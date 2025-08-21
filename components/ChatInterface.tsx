import React from 'react';
import { WelcomeSection } from './WelcomeSection';
import { MessageList } from './MessageList';
import { ChatComposer } from './ChatComposer';
import { IconPlus } from './Icons';
import type { ChatMessage, Thread, ToolCall, ToolResult } from '@/lib/chatTypes';
import { Category, STORAGE_KEYS, modelOptions } from '@/lib/constants';

export function ChatInterface() {
    const [threads, setThreads] = React.useState<Thread[]>([{ id: crypto.randomUUID(), title: "Greeting Title", messages: [] }]);
    const [activeThreadId, setActiveThreadId] = React.useState<string>("");
    const [input, setInput] = React.useState("");
    const [attachments, setAttachments] = React.useState<File[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageStartTime, setMessageStartTime] = React.useState<number | null>(null);
    const [firstTokenTime, setFirstTokenTime] = React.useState<number | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
    const composerRef = React.useRef<HTMLDivElement | null>(null);
    const [composerHeight, setComposerHeight] = React.useState<number>(160);
    const [selectedCategory, setSelectedCategory] = React.useState<Category>("create");
    const [selectedTools, setSelectedTools] = React.useState<string[]>([]);
    const [selectedModel, setSelectedModel] = React.useState(modelOptions[0]);

    // Load from storage on first mount to avoid SSR/CSR mismatch
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.THREADS);
            if (raw) {
                const parsed = JSON.parse(raw) as Thread[];
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setThreads(parsed);
                }
            }
            const savedActive = localStorage.getItem(STORAGE_KEYS.ACTIVE);
            if (savedActive) setActiveThreadId(savedActive);
            const savedModel = localStorage.getItem(STORAGE_KEYS.MODEL);
            if (savedModel) setSelectedModel(savedModel);
        } catch { }
    }, []);

    // Persist threads, active thread, and model selection
    React.useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
        } catch { }
    }, [threads]);

    React.useEffect(() => {
        try {
            if (activeThreadId) localStorage.setItem(STORAGE_KEYS.ACTIVE, activeThreadId);
        } catch { }
    }, [activeThreadId]);

    React.useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.MODEL, selectedModel);
        } catch { }
    }, [selectedModel]);

    // Ensure we always have a valid active thread id after hydration
    React.useEffect(() => {
        if (!activeThreadId && threads[0]) {
            setActiveThreadId(threads[0].id);
        }
    }, [threads, activeThreadId]);

    // Measure composer height so content never sits under it
    React.useEffect(() => {
        function measure() {
            const h = composerRef.current?.offsetHeight ?? 160;
            setComposerHeight(h);
        }
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0];
    const showWelcome = (activeThread?.messages.length ?? 0) === 0 && input.trim().length === 0;

    async function sendMessage(text: string, retryFromMessage?: ChatMessage) {
        if (!text.trim()) return;

        let targetMessages: ChatMessage[];
        let messagesForAPI: ChatMessage[];

        if (retryFromMessage) {
            // Find the index of the message we're retrying from
            const msgIndex = activeThread.messages.findIndex(m => m.id === retryFromMessage.id);
            // Keep all messages up to (but not including) the retry message
            targetMessages = activeThread.messages.slice(0, msgIndex);
            // For API, use the target messages as-is (they already include the user message)
            messagesForAPI = targetMessages;

            // Update threads state to remove the failed assistant message
            const optimistic = threads.map((t) => {
                if (t.id !== activeThread.id) return t;
                return { ...t, messages: targetMessages };
            });
            setThreads(optimistic);
        } else {
            // Normal message flow - add new user message
            targetMessages = activeThread.messages;

            const userMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: "user",
                content: text.trim(),
                timestamp: Date.now()
            };

            messagesForAPI = [...targetMessages, userMsg];

            const optimistic = threads.map((t) => {
                if (t.id !== activeThread.id) return t;
                const isFirst = targetMessages.length === 0;
                const maybeTitle = isFirst ? text.trim().slice(0, 40) || t.title : t.title;
                return { ...t, title: maybeTitle, messages: messagesForAPI };
            });
            setThreads(optimistic);
        }

        if (!retryFromMessage) setInput("");
        setIsLoading(true);
        setMessageStartTime(Date.now());
        setFirstTokenTime(null);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    model: selectedModel,
                    attachments: attachments.map((f) => ({ name: f.name, size: f.size, type: f.type })),
                    messages: messagesForAPI,
                    tools: selectedTools,
                }),
            });

            // If backend streams text/plain, read incrementally; else fall back to JSON
            const contentType = res.headers.get("content-type") || "";

            if (contentType.includes("text/plain")) {
                const reader = res.body?.getReader();
                const decoder = new TextDecoder();
                let acc = "";
                // Generate a unique stream ID based on current timestamp for retries or last user message for new messages
                const lastUserMsg = messagesForAPI.filter(m => m.role === "user").pop();
                const streamMsgId = retryFromMessage
                    ? "stream-retry-" + Date.now()
                    : "stream-" + (lastUserMsg?.id || Date.now());

                // Add initial empty assistant message
                const initialMsg: ChatMessage = {
                    id: streamMsgId,
                    role: "assistant",
                    content: "",
                    model: selectedModel,
                    timestamp: Date.now()
                };
                setThreads((prev) => prev.map((t) => t.id === activeThread.id ? { ...t, messages: [...t.messages, initialMsg] } : t));

                if (reader) {
                    try {
                        let toolCalls: ToolCall[] = [];
                        let toolResults: ToolResult[] = [];
                        let totalChars = 0;
                        let streamStartTime = Date.now();
                        let firstChunkTime: number | null = null;

                        while (true) {
                            const { value, done } = await reader.read();
                            if (done) {
                                break;
                            }
                            const chunk = decoder.decode(value, { stream: true });
                            acc += chunk;

                            // Track first meaningful chunk time for TTFT
                            if (!firstChunkTime && chunk.trim().length > 0) {
                                firstChunkTime = Date.now();
                            }

                            // Count characters for token estimation
                            totalChars += chunk.length;

                            // Parse tool calls and results from the accumulated content
                            const parseToolData = (content: string) => {
                                let cleanContent = content;
                                const newToolCalls: ToolCall[] = [...toolCalls];
                                const newToolResults: ToolResult[] = [...toolResults];

                                // Extract tool calls
                                const toolCallMatches = cleanContent.matchAll(/__TOOL_CALL__(.*?)__TOOL_CALL__/g);
                                for (const match of toolCallMatches) {
                                    try {
                                        const toolCall = JSON.parse(match[1]) as ToolCall;
                                        if (!newToolCalls.find(tc => tc.toolCallId === toolCall.toolCallId)) {
                                            newToolCalls.push(toolCall);
                                        }
                                        cleanContent = cleanContent.replace(match[0], '');
                                    } catch (e) {
                                    }
                                }

                                // Extract tool results
                                const toolResultMatches = cleanContent.matchAll(/__TOOL_RESULT__(.*?)__TOOL_RESULT__/g);
                                for (const match of toolResultMatches) {
                                    try {
                                        const toolResult = JSON.parse(match[1]) as ToolResult;
                                        if (!newToolResults.find(tr => tr.toolCallId === toolResult.toolCallId)) {
                                            newToolResults.push(toolResult);
                                        }
                                        cleanContent = cleanContent.replace(match[0], '');
                                    } catch (e) {
                                    }
                                }

                                toolCalls = newToolCalls;
                                toolResults = newToolResults;
                                return cleanContent.trim();
                            };

                            const cleanContent = parseToolData(acc);

                            // Calculate real-time metrics
                            const currentTime = Date.now();
                            const elapsedTime = (currentTime - streamStartTime) / 1000;

                            // Better token estimation: ~3.5 chars per token for English text (based on clean content)
                            const estimatedTokens = Math.ceil(cleanContent.length / 3.5);
                            const tokensPerSecond = estimatedTokens > 0 && elapsedTime > 0.1 ? estimatedTokens / elapsedTime : 0;

                            // Calculate TTFT from request start
                            const ttft = firstChunkTime && messageStartTime ? firstChunkTime - messageStartTime : undefined;

                            // Update streaming message with real-time metrics
                            setThreads((prev) => prev.map((t) => {
                                if (t.id !== activeThread.id) return t;
                                return {
                                    ...t,
                                    messages: t.messages.map((m) =>
                                        m.id === streamMsgId ? {
                                            ...m,
                                            content: cleanContent,
                                            toolCalls,
                                            toolResults,
                                            timeToFirstToken: ttft,
                                            tokensPerSecond: tokensPerSecond > 0 ? tokensPerSecond : undefined,
                                            totalTokens: estimatedTokens > 0 ? estimatedTokens : undefined
                                        } : m
                                    )
                                };
                            }));
                        }
                    } catch (error) {
                        // Replace streaming message with error
                        const errorMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: "Sorry, streaming failed." };
                        setThreads((prev) => prev.map((t) => {
                            if (t.id !== activeThread.id) return t;
                            return {
                                ...t,
                                messages: t.messages.map((m) => m.id === streamMsgId ? errorMsg : m)
                            };
                        }));
                    }
                } else {
                    const fullText = await res.text();
                    const botMsg: ChatMessage = {
                        id: crypto.randomUUID(),
                        role: "assistant",
                        content: fullText,
                        model: selectedModel,
                        timestamp: Date.now(),
                        timeToFirstToken: firstTokenTime || undefined
                    };
                    setThreads((prev) => prev.map((t) => t.id === activeThread.id ? { ...t, messages: [...t.messages, botMsg] } : t));
                }
            } else {
                const data = await res.json();
                const botMsg: ChatMessage = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: String(data.content ?? ""),
                    model: selectedModel,
                    timestamp: Date.now(),
                    timeToFirstToken: firstTokenTime || undefined
                };
                setThreads((prev) => prev.map((t) => t.id === activeThread.id ? { ...t, messages: [...t.messages, botMsg] } : t));
            }
            setAttachments([]);
        } catch (e) {
            const errorMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "Sorry, something went wrong.",
                model: selectedModel,
                timestamp: Date.now()
            };
            setThreads((prev) => prev.map((t) => t.id === activeThread.id ? { ...t, messages: [...t.messages, errorMsg] } : t));
        } finally {
            setIsLoading(false);
            setMessageStartTime(null);
            setFirstTokenTime(null);
        }
    }

    function startNewChat() {
        const id = crypto.randomUUID();
        const newThread: Thread = { id, title: "New Chat", messages: [] };
        setThreads((prev) => [newThread, ...prev]);
        setActiveThreadId(id);
        setInput("");
    }

    function onSuggestionClick(prompt: string) {
        setInput(prompt);
        // optionally send immediately
        // sendMessage(prompt);
    }

    function handleCopyMessage() {
        // Copy functionality is handled within MessageActions component
    }

    function handleBranchOff(message: ChatMessage) {
        // Create a new thread starting from this message for trying a different model
        const messageIndex = activeThread.messages.findIndex(m => m.id === message.id);
        const messagesUpToHere = activeThread.messages.slice(0, messageIndex);

        const newThreadId = crypto.randomUUID();
        const newThread: Thread = {
            id: newThreadId,
            title: `Branch: ${message.content.slice(0, 30)}...`,
            messages: messagesUpToHere
        };

        setThreads(prev => [newThread, ...prev]);
        setActiveThreadId(newThreadId);
    }

    function handleRetryMessage(message: ChatMessage) {
        // Find the user message that generated this assistant response
        const messageIndex = activeThread.messages.findIndex(m => m.id === message.id);
        if (messageIndex > 0) {
            const userMessage = activeThread.messages[messageIndex - 1];
            if (userMessage.role === "user") {
                sendMessage(userMessage.content, message);
            }
        }
    }

    const handleSendMessage = () => {
        sendMessage(input);
    };

    return (
        <div className="font-sans min-h-screen w-full bg-[#fdf7fd]">
            {/* Top-left toolbar with only + for New Chat */}
            <div className="fixed left-3 top-3 z-50">
                <button
                    aria-label="New chat"
                    onClick={startNewChat}
                    className="grid h-9 w-9 place-items-center rounded-lg bg-[#f5dbef] text-[#ca0277] shadow-sm hover:brightness-95"
                >
                    <IconPlus />
                </button>
            </div>
            <div className="mx-auto flex gap-6 p-4 sm:p-6 lg:py-8 justify-center">
                <div className="w-full space-y-6 px-2 pt-8 duration-300 animate-in fade-in-50 zoom-in-90 sm:px-8">
                    {showWelcome && (
                        <WelcomeSection
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            onSuggestionClick={onSuggestionClick}
                        />
                    )}

                    {/* Messages */}
                    <div className="mx-auto mt-6 w-full max-w-3xl flex-1" style={{ paddingBottom: composerHeight + 24 }}>
                        <MessageList
                            messages={activeThread?.messages || []}
                            isLoading={isLoading}
                            onCopyMessage={handleCopyMessage}
                            onBranchOff={handleBranchOff}
                            onRetryMessage={handleRetryMessage}
                        />
                    </div>

                    {/* Composer (floating) */}
                    <ChatComposer
                        input={input}
                        setInput={setInput}
                        selectedModel={selectedModel}
                        setSelectedModel={setSelectedModel}
                        selectedTools={selectedTools}
                        setSelectedTools={setSelectedTools}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        onSendMessage={handleSendMessage}
                        composerRef={composerRef}
                    />
                </div>
            </div>
        </div>
    );
}
