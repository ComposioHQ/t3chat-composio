import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MessageActions } from './MessageActions';
import { ToolCallComponent } from './ToolCall';
import type { ChatMessage } from '@/lib/chatTypes';

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onCopyMessage: () => void;
    onBranchOff: (message: ChatMessage) => void;
    onRetryMessage: (message: ChatMessage) => void;
}

export function MessageList({
    messages,
    isLoading,
    onCopyMessage,
    onBranchOff,
    onRetryMessage
}: MessageListProps) {
    return (
        <div className="space-y-4">
            {messages.map((m) => (
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
                                        } rounded-2xl px-4 py-3`}
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
                                        onCopy={onCopyMessage}
                                        onBranchOff={() => onBranchOff(m)}
                                        onRetry={() => onRetryMessage(m)}
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
    );
}
