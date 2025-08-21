import React from "react";
import {
  IconArrowUp,
  IconChevronDown,
  IconTools,
  IconPaperclip,
} from "./Icons";
import { ToolsModalContent } from "./ToolsModalContent";
import { modelOptions } from "@/lib/constants";

interface ChatComposerProps {
  input: string;
  setInput: (input: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedTools: string[];
  setSelectedTools: (tools: string[]) => void;
  attachments: File[];
  setAttachments: (attachments: File[]) => void;
  onSendMessage: () => void;
  composerRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatComposer({
  input,
  setInput,
  selectedModel,
  setSelectedModel,
  selectedTools,
  setSelectedTools,
  attachments,
  setAttachments,
  onSendMessage,
  composerRef,
}: ChatComposerProps) {
  const [isModelMenuOpen, setIsModelMenuOpen] = React.useState(false);
  const [modelQuery, setModelQuery] = React.useState("");
  const [isToolsModalOpen, setIsToolsModalOpen] = React.useState(false);
  const modelMenuRef = React.useRef<HTMLDivElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const filteredModels = React.useMemo(
    () =>
      modelOptions.filter((m) =>
        m.toLowerCase().includes(modelQuery.toLowerCase()),
      ),
    [modelQuery],
  );

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        isModelMenuOpen &&
        modelMenuRef.current &&
        !modelMenuRef.current.contains(e.target as Node)
      ) {
        setIsModelMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isModelMenuOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) setAttachments([...attachments, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  return (
    <>
      <section className="mx-auto mt-10 w-full max-w-3xl">
        <div className="input-bar" ref={composerRef}>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
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
                          <li className="px-2 py-1 text-xs text-rose-500">
                            No models found
                          </li>
                        )}
                        {filteredModels.map((m) => (
                          <li key={m}>
                            <button
                              role="option"
                              onClick={() => {
                                setSelectedModel(m);
                                setIsModelMenuOpen(false);
                              }}
                              className={`block w-full rounded-md px-2 py-1 text-left text-sm hover:bg-[#ed78c6]/20 ${selectedModel === m ? "bg-[#ed78c6]/20" : ""}`}
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
                  className={`inline-flex items-center gap-1 rounded-full border border-rose-200/60 px-2.5 py-1 font-medium transition ${
                    selectedTools.length > 0
                      ? "bg-[#aa4673] text-white border-[#aa4673] hover:bg-[#aa4673]/90"
                      : "bg-white/70 hover:bg-white"
                  }`}
                >
                  <span
                    className={
                      selectedTools.length > 0 ? "text-white" : "text-rose-500"
                    }
                  >
                    <IconTools />
                  </span>
                  Tools{" "}
                  {selectedTools.length > 0 && `(${selectedTools.length})`}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-full border border-rose-200/60 bg-white/70 px-2.5 py-1 font-medium hover:bg-white"
                >
                  <span className="text-rose-500">
                    <IconPaperclip />
                  </span>
                  Attach
                </button>
              </div>
              {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-rose-900/90">
                  {attachments.map((file, idx) => (
                    <span
                      key={`${file.name}-${idx}`}
                      className="inline-flex items-center gap-1 rounded-full border border-rose-200/60 bg-white/70 px-2.5 py-1"
                    >
                      {file.name}
                      <button
                        aria-label="Remove attachment"
                        className="ml-1 text-rose-500 hover:text-rose-700"
                        onClick={() => removeAttachment(idx)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              aria-label="Send"
              onClick={onSendMessage}
              className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b from-rose-800 to-pink-800 text-white shadow-md transition hover:from-rose-600 hover:to-pink-600"
            >
              <IconArrowUp />
            </button>
          </div>
        </div>
      </section>

      {/* Tools Modal */}
      {isToolsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Select Tools
              </h2>
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
    </>
  );
}
