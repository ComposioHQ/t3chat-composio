"use client";

import React from "react";
import { ChatMessage } from "@/lib/chatTypes";

function IconCopy() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconBranch() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

export function MessageActions({
  message,
  onCopy,
  onBranchOff,
  onRetry,
}: {
  message: ChatMessage;
  onCopy: () => void;
  onBranchOff: () => void;
  onRetry: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return null;
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)} sec`;
  };

  return (
    <div className="mt-3 flex items-center justify-between text-xs border-t border-rose-200/30 pt-2">
      <div className="flex items-center gap-1">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-rose-100/40 transition-colors hover:text-[#432A78]"
          style={{ color: "#432A78" }}
          title={copied ? "Copied!" : "Copy message"}
        >
          <IconCopy />
        </button>

        <button
          onClick={onBranchOff}
          className="p-1.5 rounded-md hover:bg-rose-100/40 transition-colors hover:text-[#432A78]"
          style={{ color: "#432A78" }}
          title="Branch off to new conversation with different model"
        >
          <IconBranch />
        </button>

        <button
          onClick={onRetry}
          className="p-1.5 rounded-md hover:bg-rose-100/40 transition-colors hover:text-[#432A78]"
          style={{ color: "#432A78" }}
          title="Retry message"
        >
          <IconRefresh />
        </button>
      </div>

      <div
        className="flex items-center gap-3 font-medium"
        style={{ color: "#432A78" }}
      >
        {message.model && <span className="text-xs">{message.model}</span>}
        {message.tokensPerSecond && (
          <span className="text-xs">
            {message.tokensPerSecond.toFixed(2)} tok/sec
          </span>
        )}
        {message.totalTokens && (
          <span className="text-xs">{message.totalTokens} tokens</span>
        )}
        {message.timeToFirstToken && (
          <span className="text-xs">
            Time-to-First: {formatDuration(message.timeToFirstToken)}
          </span>
        )}
      </div>
    </div>
  );
}
