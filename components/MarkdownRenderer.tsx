"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import shell from 'react-syntax-highlighter/dist/esm/languages/hljs/shell';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import md from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { githubGist as githubStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Register languages once
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('ts', ts);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', shell);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);
SyntaxHighlighter.registerLanguage('markdown', md);
SyntaxHighlighter.registerLanguage('md', md);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('xml', xml);

const components: Components = {
    // Typography spacing
    p({ children, className }: any) {
        return <p className={`leading-normal mb-3 ${className ?? ''}`}>{children}</p>;
    },
    h1({ children, className }: any) {
        return <h1 className={`leading-normal text-2xl font-semibold mt-6 mb-3 ${className ?? ''}`}>{children}</h1>;
    },
    h2({ children, className }: any) {
        return <h2 className={`leading-normal text-xl font-semibold mt-5 mb-2 ${className ?? ''}`}>{children}</h2>;
    },
    h3({ children, className }: any) {
        return <h3 className={`leading-normal text-lg font-semibold mt-4 mb-2 ${className ?? ''}`}>{children}</h3>;
    },
    h4({ children, className }: any) {
        return <h4 className={`leading-normal text-base font-semibold mt-4 mb-1.5 ${className ?? ''}`}>{children}</h4>;
    },
    h5({ children, className }: any) {
        return <h5 className={`leading-normal text-base font-medium mt-3 mb-1 ${className ?? ''}`}>{children}</h5>;
    },
    h6({ children, className }: any) {
        return <h6 className={`leading-normal text-sm font-medium mt-3 mb-1 ${className ?? ''}`}>{children}</h6>;
    },
    // Lists
    ul({ children, className }: any) {
        return (
            <ul className={`leading-normal list-disc pl-6 mb-3 ${className ?? ''}`}>
                {children}
            </ul>
        );
    },
    ol({ children, start, className }: any) {
        return (
            <ol start={start as any} className={`leading-normal list-decimal pl-6 mb-3 ${className ?? ''}`}>
                {children}
            </ol>
        );
    },
    li({ children, className }: any) {
        return (
            <li className={`leading-normal marker:text-[#aa4673] [&>p]:m-0 [&>p]:inline ${className ?? ''}`}>
                {children}
            </li>
        );
    },
    code(props: any) {
        const { inline, className, children, ...rest } = props || {};
        const [copied, setCopied] = React.useState(false);
        const match = /language-(\w+)/.exec(className || "");
        const rawCode = String(children ?? '').replace(/\n$/, '');

        const mapLang = (lang?: string) => {
            if (!lang) return undefined;
            const l = lang.toLowerCase();
            if (l === 'js' || l === 'jsx') return 'javascript';
            if (l === 'ts' || l === 'tsx') return 'typescript';
            if (l === 'sh' || l === 'zsh') return 'bash';
            if (l === 'html') return 'xml';
            if (l === 'yml') return 'yaml';
            return l;
        };
        const language = mapLang(match?.[1]);

        // Robust detection: treat as block when react-markdown marks inline === false
        // or when a language is present or the code contains a newline. Otherwise inline.
        const isBlock = inline === false || !!language || rawCode.includes("\n");

        const isInline = !isBlock;

        if (isInline) {
            return (
                <code
                    className={`rounded bg-rose-100 text-rose-800 px-1 py-0.5 font-mono text-[0.9em] ${className || ''}`}
                    {...rest}
                >
                    {rawCode}
                </code>
            );
        }

        const handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(rawCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } catch { }
        };

        // Block code with language => SyntaxHighlighter
        if (language) {
            return (
                <div className="relative group border border-rose-200/70 rounded-lg bg-white/80 p-2 shadow-sm">
                    <button
                        onClick={handleCopy}
                        className="absolute right-2 top-2 z-10 rounded-md border border-rose-300/70 bg-white/80 px-2 py-1 text-xs font-medium text-rose-700 shadow-sm hover:bg-white"
                        aria-label="Copy code"
                    >
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    <SyntaxHighlighter
                        language={language}
                        style={githubStyle}
                        PreTag="pre"
                        customStyle={{ background: 'transparent', margin: 0, fontSize: '0.9em' }}
                        codeTagProps={{ style: { background: 'transparent' } }}
                        wrapLongLines
                        {...rest}
                    >
                        {rawCode}
                    </SyntaxHighlighter>
                </div>
            );
        }

        // Block code without language => simple styled <pre><code>
        return (
            <div className="relative group border border-rose-200/70 rounded-lg bg-white/80 shadow-sm">
                <button
                    onClick={handleCopy}
                    className="absolute right-2 top-2 z-10 rounded-md border border-rose-300/70 bg-white/80 px-2 py-1 text-xs font-medium text-rose-700 shadow-sm hover:bg-white"
                    aria-label="Copy code"
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
                <pre className="bg-rose-100 text-rose-800 p-2 rounded-lg overflow-x-auto">
                    <code className="font-mono text-sm whitespace-pre">{rawCode}</code>
                </pre>
            </div>
        );
    },
    a({ href, children, title, target, rel, className }: any) {
        return (
            <a
                href={href}
                title={title}
                target={target}
                rel={rel}
                className={`text-[#aa4673] underline underline-offset-4 hover:text-[#7a3052] ${className ?? ''}`}
            >
                {children}
            </a>
        );
    },
};

export function MarkdownRenderer({ children }: { children: string }) {
    return <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
}
