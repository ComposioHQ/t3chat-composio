"use client";

import React from "react";
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { MessageActions } from '@/components/MessageActions';
import { ToolCallComponent } from '@/components/ToolCall';
import { ToolsModalContent } from '@/components/ToolsModalContent';
import type { ChatMessage, Thread, ToolCall, ToolResult } from '@/lib/chatTypes';

function IconHamburger() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M2 12h20"></path>
      <path d="M12 2a15.3 15.3 0 0 0 0 20a15.3 15.3 0 0 0 0-20"></path>
    </svg>
  );
}

function IconPlusSparkles() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 3v4M3 5h4" />
      <path d="M19 11v4M17 13h4" />
      <path d="M8 20l2-2 2 2 2-2 2 2" />
    </svg>
  );
}

function IconCompass() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16 8 14 14 8 16 10 10 16 8" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconHat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 10L12 6 2 10l10 4 10-4z" />
      <path d="M6 12v4c3 2 9 2 12 0v-4" />
    </svg>
  );
}

function IconArrowUp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

function IconPaperclip() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.2a2 2 0 1 1-2.83-2.83L15 6" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function IconTools() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconBranch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function ChipButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-white/70 px-4 py-2 text-sm font-medium text-rose-900 shadow-sm backdrop-blur transition hover:bg-white">
      <span className="text-rose-500">{icon}</span>
      {label}
    </button>
  );
}

// Types moved to lib/chatTypes

type Category = "create" | "explore" | "code" | "learn";

const categoryPrompts: Record<Category, string[]> = {
  create: [
    "Write a short story about time travel",
    "Design a logo concept for a tech startup",
    "Create a social media campaign for sustainability",
    "Generate ideas for a mobile app"
  ],
  explore: [
    "What are the latest developments in quantum computing?",
    "Explain the James Webb Space Telescope discoveries",
    "How do neural networks actually work?",
    "What's happening with climate change research?"
  ],
  code: [
    "Build a React component for a todo list",
    "Write a Python script to analyze CSV data",
    "Create a REST API endpoint with authentication",
    "Debug this JavaScript async function"
  ],
  learn: [
    "Teach me about machine learning fundamentals",
    "Explain blockchain technology simply",
    "How do I get started with data science?",
    "What are the basics of cybersecurity?"
  ]
};

// Interfaces moved to lib/chatTypes

// MessageActions extracted to components/MessageActions

// ToolCallComponent extracted to components/ToolCall

// ToolsModalContent extracted to components/ToolsModalContent

export default function Home() {
  const STORAGE_THREADS = "t3chat:threads";
  const STORAGE_ACTIVE = "t3chat:activeThreadId";
  const STORAGE_MODEL = "t3chat:selectedModel";

  const [threads, setThreads] = React.useState<Thread[]>([{ id: crypto.randomUUID(), title: "Greeting Title", messages: [] }]);
  const [activeThreadId, setActiveThreadId] = React.useState<string>("");
  const [input, setInput] = React.useState("");
  const [isModelMenuOpen, setIsModelMenuOpen] = React.useState(false);
  const [modelQuery, setModelQuery] = React.useState("");
  const modelMenuRef = React.useRef<HTMLDivElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageStartTime, setMessageStartTime] = React.useState<number | null>(null);
  const [firstTokenTime, setFirstTokenTime] = React.useState<number | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const composerRef = React.useRef<HTMLDivElement | null>(null);
  const [composerHeight, setComposerHeight] = React.useState<number>(160);
  const [selectedCategory, setSelectedCategory] = React.useState<Category>("create");
  const [isToolsModalOpen, setIsToolsModalOpen] = React.useState(false);
  const [selectedTools, setSelectedTools] = React.useState<string[]>([]);

  const modelOptions = React.useMemo(
    () => [
      // OpenAI models (2025)
      // "o3",
      // "o4-mini",
      // "gpt-5",
      // "gpt-5-mini",
      // "gpt-5-nano",
      // "GPT-4.1",
      // "GPT-4.1 Mini",
      // Anthropic models (2025)
      // "Claude 4 Opus",
      // "Claude 4 Sonnet", 
      // "Claude 3.5 Sonnet",
      // "Claude 3.5 Haiku",
      // Google models (2025)
      "Gemini 2.0 Flash",
      "Gemini 2.5 Pro",
      "Gemini 2.5 Flash",
      "Gemini 2.0 Flash Thinking",
      // Groq models (2025)
      // "DeepSeek R1 Llama 70B",
      // "Llama 3.3 70B",
    ],
    []
  );

  const [selectedModel, setSelectedModel] = React.useState(modelOptions[0]);


  const filteredModels = React.useMemo(
    () => modelOptions.filter((m) => m.toLowerCase().includes(modelQuery.toLowerCase())),
    [modelOptions, modelQuery]
  );

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (isModelMenuOpen && modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setIsModelMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isModelMenuOpen]);

  // Load from storage on first mount to avoid SSR/CSR mismatch
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_THREADS);
      if (raw) {
        const parsed = JSON.parse(raw) as Thread[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setThreads(parsed);
        }
      }
      const savedActive = localStorage.getItem(STORAGE_ACTIVE);
      if (savedActive) setActiveThreadId(savedActive);
      const savedModel = localStorage.getItem(STORAGE_MODEL);
      if (savedModel) setSelectedModel(savedModel);
    } catch { }
  }, []);

  // Persist threads, active thread, and model selection
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THREADS, JSON.stringify(threads));
    } catch { }
  }, [threads]);

  React.useEffect(() => {
    try {
      if (activeThreadId) localStorage.setItem(STORAGE_ACTIVE, activeThreadId);
    } catch { }
  }, [activeThreadId]);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MODEL, selectedModel);
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
            let lastUpdateTime = streamStartTime;

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
            <section className="mx-auto mt-8 w-full max-w-2xl text-left">
              <h1 className="text-2xl font-semibold font-weight-600 tracking-tight sm:text-[30px] pb-6 pt-12 justify-left text-[#4e2a58]">How can I help you?</h1>

              <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
                <button
                  onClick={() => setSelectedCategory("create")}
                  className={`justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full ${selectedCategory === "create"
                    ? "bg-[#aa4673] text-primary-foreground shadow hover:bg-[#aa4673]/90"
                    : "bg-secondary/30 text-secondary-foreground/90 outline hover:bg-secondary"
                    }`}
                >
                  <IconPlusSparkles />
                  <div>Create</div>
                </button>
                <button
                  onClick={() => setSelectedCategory("explore")}
                  className={`justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full ${selectedCategory === "explore"
                    ? "bg-[#aa4673] text-primary-foreground shadow hover:bg-[#aa4673]/90"
                    : "bg-secondary/30 text-secondary-foreground/90 outline hover:bg-secondary"
                    }`}
                >
                  <IconCompass />
                  <div>Explore</div>
                </button>
                <button
                  onClick={() => setSelectedCategory("code")}
                  className={`justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full ${selectedCategory === "code"
                    ? "bg-[#aa4673] text-primary-foreground shadow hover:bg-[#aa4673]/90"
                    : "bg-secondary/30 text-secondary-foreground/90 outline hover:bg-secondary"
                    }`}
                >
                  <IconCode />
                  <div>Code</div>
                </button>
                <button
                  onClick={() => setSelectedCategory("learn")}
                  className={`justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full ${selectedCategory === "learn"
                    ? "bg-[#aa4673] text-primary-foreground shadow hover:bg-[#aa4673]/90"
                    : "bg-secondary/30 text-secondary-foreground/90 outline hover:bg-secondary"
                    }`}
                >
                  <IconHat />
                  <div>Learn</div>
                </button>
              </div>

              {activeThread?.messages.length === 0 && (
                <div className="mx-auto mt-4 w-full max-w-2xl divide-y divide-rose-100 overflow-hidden rounded-2xl text-left pt-1">
                  {categoryPrompts[selectedCategory].map((prompt: string) => (
                    <button
                      key={prompt}
                      onClick={() => onSuggestionClick(prompt)}
                      className="block w-full px-5 py-3 text-left text-rose-900/90 transition hover:bg-[#ed78c6]/20 text-font-10px"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Messages */}
          <div className="mx-auto mt-6 w-full max-w-3xl flex-1" style={{ paddingBottom: composerHeight + 24 }}>
            <div className="space-y-4">
              {activeThread?.messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`${m.role === "assistant" ? "w-full" : "max-w-[80%]"} ${m.role === "user" ? "flex justify-end" : ""}`}>
                    {/* Tool calls (only for assistant messages) */}
                    {m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0 && (
                      <div className="mb-3 w-full">
                        {m.toolCalls.map((toolCall) => {
                          const toolResult = m.toolResults?.find(tr => tr.toolCallId === toolCall.toolCallId);
                          return (
                            <ToolCallComponent
                              key={toolCall.toolCallId}
                              toolCall={toolCall}
                              toolResult={toolResult}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Message content */}
                    {m.content && (
                      <div className="w-full">
                        <div
                          className={`${m.role === "user"
                            ? "bg-[#f5dbef] text-[#432A78]"
                            : "bg-[#fdf7fd] text-rose-900"
                            } whitespace-pre-wrap rounded-2xl px-4 py-3`}
                        >
                          {m.role === "assistant" ? (
                            <div className="prose prose-sm max-w-none prose-headings:text-rose-900 prose-p:text-rose-900 prose-li:text-rose-900 prose-strong:text-rose-900 prose-code:text-rose-800 prose-code:bg-rose-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-rose-100 prose-pre:text-rose-800">
                              <MarkdownRenderer>
                                {m.content}
                              </MarkdownRenderer>
                            </div>
                          ) : (
                            m.content
                          )}
                        </div>

                        {/* Message Actions - only for assistant messages */}
                        {m.role === "assistant" && !isLoading && (
                          <MessageActions
                            message={m}
                            onCopy={handleCopyMessage}
                            onBranchOff={() => handleBranchOff(m)}
                            onRetry={() => handleRetryMessage(m)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-[#fdf7fd] px-4 py-3">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Composer (floating) */}
          <section className="mx-auto mt-10 w-full max-w-3xl">
            <div className="input-bar" ref={composerRef}>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    placeholder="Type your message here..."
                    className="h-[68px] w-full resize-none rounded-l-2xl border border-transparent bg-[#FBF7FB] px-4 py-3 text-[#432A78] placeholder-[#6F4DA3] outline-none"
                  />
                  <div className="mt-2 flex items-center gap-2 text-xs text-rose-700">
                    <div className="relative inline-block" ref={modelMenuRef}>
                      <button
                        aria-haspopup="listbox"
                        aria-expanded={isModelMenuOpen}
                        onClick={() => setIsModelMenuOpen((v) => !v)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-200/60 bg-white/70 px-2.5 py-1 font-medium hover:bg-[#ed78c6]/20"
                      >
                        {selectedModel}
                        <IconChevronDown />
                      </button>
                      {isModelMenuOpen && (
                        <div className="absolute left-0 bottom-full z-50 mb-2 w-72 rounded-xl border border-rose-200/60 bg-white p-2 text-rose-900 shadow-lg">
                          <input
                            autoFocus
                            value={modelQuery}
                            onChange={(e) => setModelQuery(e.target.value)}
                            placeholder="Search models..."
                            className="mb-2 w-full rounded-lg border border-rose-200/60 bg-white px-2.5 py-1 text-xs outline-none"
                          />
                          <ul role="listbox" className="max-h-56 overflow-auto">
                            {filteredModels.length === 0 && (
                              <li className="px-2 py-1 text-xs text-rose-500">No models found</li>
                            )}
                            {filteredModels.map((m) => (
                              <li key={m}>
                                <button
                                  role="option"
                                  onClick={() => { setSelectedModel(m); setIsModelMenuOpen(false); }}
                                  className={`block w-full rounded-md px-2 py-1 text-left text-sm hover:bg-[#ed78c6]/20 ${selectedModel === m ? 'bg-[#ed78c6]/20' : ''}`}
                                >
                                  {m}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsToolsModalOpen(true)}
                      className={`inline-flex items-center gap-1 rounded-full border border-rose-200/60 px-2.5 py-1 font-medium transition ${selectedTools.length > 0
                        ? "bg-[#aa4673] text-white border-[#aa4673] hover:bg-[#aa4673]/90"
                        : "bg-white/70 hover:bg-white"
                        }`}
                    >
                      <span className={selectedTools.length > 0 ? "text-white" : "text-rose-500"}>
                        <IconTools />
                      </span>
                      Tools {selectedTools.length > 0 && `(${selectedTools.length})`}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length > 0) setAttachments((prev) => [...prev, ...files]);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-200/60 bg-white/70 px-2.5 py-1 font-medium hover:bg-white"
                    >
                      <span className="text-rose-500"><IconPaperclip /></span>
                      Attach
                    </button>
                  </div>
                  {attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-rose-900/90">
                      {attachments.map((file, idx) => (
                        <span key={`${file.name}-${idx}`} className="inline-flex items-center gap-1 rounded-full border border-rose-200/60 bg-white/70 px-2.5 py-1">
                          {file.name}
                          <button
                            aria-label="Remove attachment"
                            className="ml-1 text-rose-500 hover:text-rose-700"
                            onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button aria-label="Send" onClick={() => sendMessage(input)} className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-rose-800 to-pink-800 text-white shadow-md transition hover:from-rose-600 hover:to-pink-600">
                  <IconArrowUp />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Tools Modal */}
      {isToolsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Select Tools</h2>
              <button
                onClick={() => setIsToolsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <ToolsModalContent
                selectedTools={selectedTools}
                setSelectedTools={setSelectedTools}
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsToolsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsToolsModalOpen(false)}
                className="px-6 py-2 bg-[#aa4673] text-white rounded-lg hover:bg-[#aa4673]/90 transition"
              >
                Done ({selectedTools.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
