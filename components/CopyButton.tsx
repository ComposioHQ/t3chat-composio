"use client";

import React, { useState } from "react";
import { IconCopy, IconCheck } from "./Icons";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200 ${className}`}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <div className="flex items-center gap-1 text-green-600">
          <IconCheck />
          <span className="text-xs">Copied!</span>
        </div>
      ) : (
        <IconCopy />
      )}
    </button>
  );
}
