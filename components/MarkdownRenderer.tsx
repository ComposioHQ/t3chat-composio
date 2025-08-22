"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "./CopyButton";
import { Modal } from "./Modal";
import { IconExpand } from "./Icons";

// Component to render mermaid diagrams
interface MermaidDiagramProps {
  chart: string;
  id: string;
  onFullscreen?: () => void;
}

function MermaidDiagram({ chart, id, onFullscreen }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    // Dynamic import to ensure client-side execution and avoid SSR issues
    if (!ref.current) return;

    (async () => {
      try {
        const mod = await import("mermaid");
        const mermaid = mod.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          flowchart: { useMaxWidth: true, htmlLabels: true },
          sequence: { useMaxWidth: true, diagramMarginX: 50, diagramMarginY: 50 },
          gantt: { useMaxWidth: true },
          journey: { useMaxWidth: true },
          timeline: { useMaxWidth: true },
          // Increase the font size and spacing for better readability
          themeVariables: {
            primaryColor: "#ff6b6b",
            primaryTextColor: "#000",
            primaryBorderColor: "#ff6b6b",
            lineColor: "#333",
            secondaryColor: "#00d4aa",
            tertiaryColor: "#fff"
          }
        });

        // Clean up the chart content to avoid parsing issues
        const cleanedChart = chart
          .trim()
          // Remove any extra whitespace or invisible characters
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n")
          // Fix common line break issues in arrows
          .replace(/(\w+)->>([+\-]?\w*)\s*\n\s*([A-Za-z])/g, "$1->>$2$3")
          // Ensure proper spacing around arrows
          .replace(/(\w+)(->|-->|->>|-->>)(\+?\w+)/g, "$1 $2 $3")
          // Remove trailing whitespace from lines
          .split("\n")
          .map((line) => line.trimEnd())
          .join("\n");

        const result = await mermaid.render(
          `mermaid-${id}` as string,
          cleanedChart,
        );
        if (!cancelled && ref.current) {
          ref.current.innerHTML = result.svg;
        }
      } catch (error: any) {
        console.error("Mermaid rendering error:", error);
        console.log("Original chart content:", chart);
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-red-500 text-sm bg-red-50 p-3 rounded border">
            <strong>Error rendering Mermaid diagram:</strong><br>
            ${error?.message ?? String(error)}<br><br>
            <details class="mt-2">
              <summary class="cursor-pointer text-red-700 font-medium">Show diagram source</summary>
              <code class="text-xs mt-1 block whitespace-pre-wrap">${chart.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code>
            </details>
          </pre>`;
        }
      }
    })();

    return () => {
      cancelled = true;
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [chart, id]);

  return (
    <div className="relative group">
      <div
        ref={ref}
        className="mermaid-diagram w-full max-w-full overflow-x-auto"
      />
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/80 hover:bg-white border border-gray-200 rounded-md shadow-sm"
          title="View fullscreen"
        >
          <IconExpand />
        </button>
      )}
    </div>
  );
}

// Component to parse and render content with mermaid diagrams in details/summary tags
interface MarkdownWithMermaidProps {
  content: string;
}

interface DetailsPart {
  type: "markdown" | "details-with-mermaid" | "details";
  content: string;
  summary?: string;
  mermaidCharts?: { chart: string; id: string }[];
}

// Shared code renderer for all markdown blocks
function CodeBlock({ inline, className, children, node, ...props }: any) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match?.[1] ?? "";
  const content = String(children ?? "").replace(/\n$/, "");

  // Force inline detection - if no newlines and short content, treat as inline
  const isActuallyInline =
    inline || (!content.includes("\n") && content.length < 100 && !language);

  // Mermaid code blocks render as diagrams
  if (!isActuallyInline && language.toLowerCase() === "mermaid") {
    const id = React.useId();
    return <MermaidDiagram chart={content} id={id} />;
  }

  if (isActuallyInline) {
    return <code {...props}>{children}</code>;
  }

  return (
    <div className="relative group my-4">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton text={content} />
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={oneLight}
        PreTag="div"
        customStyle={{
          background: "#fafafa",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          margin: 0,
          fontSize: "0.875rem",
          padding: "1rem",
          paddingTop: "3rem",
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
        }}
        codeTagProps={{
          style: {
            background: "transparent",
            fontFamily: "inherit",
          },
        }}
        wrapLongLines
        showLineNumbers={content.split("\n").length > 10}
        {...props}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}

function MarkdownWithMermaid({ content }: MarkdownWithMermaidProps) {
  const [fullscreenChart, setFullscreenChart] = useState<{
    chart: string;
    id: string;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(150); // Default 150% zoom

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 400)); // Max 400%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50)); // Min 50%
  };

  const handleResetZoom = () => {
    setZoomLevel(150); // Reset to default
  };

  const handleWheelZoom = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -25 : 25;
      setZoomLevel(prev => Math.max(50, Math.min(400, prev + delta)));
    }
  };

  // Reset zoom when modal closes
  const handleCloseModal = () => {
    setFullscreenChart(null);
    setZoomLevel(150);
  };

  // Custom CodeBlock for this component that supports fullscreen mermaid
  const CustomCodeBlock = ({
    inline,
    className,
    children,
    node,
    ...props
  }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match?.[1] ?? "";
    const content = String(children ?? "").replace(/\n$/, "");

    // Force inline detection - if no newlines and short content, treat as inline
    const isActuallyInline =
      inline || (!content.includes("\n") && content.length < 100 && !language);

    // Mermaid code blocks render as diagrams with fullscreen support
    if (!isActuallyInline && language.toLowerCase() === "mermaid") {
      const id = React.useId();
      return (
        <MermaidDiagram
          chart={content}
          id={id}
          onFullscreen={() => setFullscreenChart({ chart: content, id })}
        />
      );
    }

    if (isActuallyInline) {
      return <code {...props}>{children}</code>;
    }

    return (
      <div className="relative group my-4">
        <div className="absolute top-2 right-2 z-10">
          <CopyButton text={content} />
        </div>
        <SyntaxHighlighter
          language={language || "text"}
          style={oneLight}
          PreTag="div"
          customStyle={{
            background: "#fafafa",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            margin: 0,
            fontSize: "0.875rem",
            padding: "1rem",
            paddingTop: "3rem",
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
          }}
          codeTagProps={{
            style: {
              background: "transparent",
              fontFamily: "inherit",
            },
          }}
          wrapLongLines
          showLineNumbers={content.split("\n").length > 10}
          {...props}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    );
  };
  // Parse content to find details sections with mermaid diagrams
  const parseDetailsWithMermaid = (text: string): DetailsPart[] => {
    const detailsRegex =
      /<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
    const parts: DetailsPart[] = [];
    let lastIndex = 0;
    let match;
    let diagramCounter = 0;

    while ((match = detailsRegex.exec(text)) !== null) {
      // Add content before this details section
      if (match.index > lastIndex) {
        parts.push({
          type: "markdown",
          content: text.slice(lastIndex, match.index),
        });
      }

      const summaryContent = match[1].trim();
      const detailsContent = match[2].trim();

      // Check if details content contains mermaid code blocks
      const mermaidRegex = /```mermaid\s*([\s\S]*?)\s*```/gi;
      const mermaidMatches = [...detailsContent.matchAll(mermaidRegex)];

      if (mermaidMatches.length > 0) {
        // This details section contains mermaid diagrams
        parts.push({
          type: "details-with-mermaid",
          summary: summaryContent,
          content: detailsContent,
          mermaidCharts: mermaidMatches.map((m, index) => ({
            chart: m[1].trim(),
            id: `${diagramCounter}-${index}`,
          })),
        });
        diagramCounter++;
      } else {
        // Regular details section without mermaid
        parts.push({
          type: "details",
          summary: summaryContent,
          content: detailsContent,
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining content
    if (lastIndex < text.length) {
      parts.push({
        type: "markdown",
        content: text.slice(lastIndex),
      });
    }

    return parts;
  };

  const parts = parseDetailsWithMermaid(content);

  return (
    <>
      <div>
        {parts.map((part, index) => {
          if (part.type === "markdown") {
            return (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{ code: CustomCodeBlock }}
              >
                {part.content}
              </ReactMarkdown>
            );
          }

          if (part.type === "details-with-mermaid") {
            return (
              <details
                key={index}
                className="mb-4 border border-gray-200 rounded-lg"
              >
                <summary className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 font-medium">
                  {part.summary}
                </summary>
                <div className="p-4">
                  {/* Render non-mermaid content first */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{ code: CustomCodeBlock }}
                  >
                    {part.content.replace(/```mermaid\s*[\s\S]*?\s*```/gi, "")}
                  </ReactMarkdown>

                  {/* Render mermaid diagrams */}
                  {part.mermaidCharts?.map((chart, chartIndex) => (
                    <div key={chartIndex} className="my-4 w-full">
                      <MermaidDiagram
                        chart={chart.chart}
                        id={chart.id}
                        onFullscreen={() =>
                          setFullscreenChart({
                            chart: chart.chart,
                            id: chart.id,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </details>
            );
          }

          if (part.type === "details") {
            return (
              <details
                key={index}
                className="mb-4 border border-gray-200 rounded-lg"
              >
                <summary className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 font-medium">
                  {part.summary}
                </summary>
                <div className="p-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{ code: CustomCodeBlock }}
                  >
                    {part.content}
                  </ReactMarkdown>
                </div>
              </details>
            );
          }

          return null;
        })}
      </div>

      {/* Fullscreen Modal for Mermaid Diagrams */}
      <Modal
        isOpen={!!fullscreenChart}
        onClose={handleCloseModal}
        title={
          <div className="flex items-center justify-between w-full">
            <span>Diagram</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{zoomLevel}%</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomOut}
                  className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                  title="Zoom Out (Ctrl + Mouse Wheel)"
                >
                  −
                </button>
                <button
                  onClick={handleResetZoom}
                  className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                  title="Reset Zoom"
                >
                  Reset
                </button>
                <button
                  onClick={handleZoomIn}
                  className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                  title="Zoom In (Ctrl + Mouse Wheel)"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        }
      >
        {fullscreenChart && (
          <div 
            className="w-full h-[80vh] overflow-auto p-4"
            onWheel={handleWheelZoom}
            style={{ cursor: 'grab' }}
          >
            <div className="min-w-full min-h-full flex items-center justify-center">
              <div 
                className="origin-center min-w-max transition-transform duration-200 ease-in-out"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                <MermaidDiagram
                  chart={fullscreenChart.chart}
                  id={`fullscreen-${fullscreenChart.id}`}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export function MarkdownRenderer({ children }: { children: string }) {
  return <MarkdownWithMermaid content={children} />;
}
