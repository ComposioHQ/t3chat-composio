export type Role = 'user' | 'assistant';

export interface Tool {
  name: string;
  slug: string;
  description: string;
  displayName: string;
}

export interface Toolkit {
  slug: string;
  name: string;
  meta: {
    description: string;
    logo: string;
    tools_count: number;
    categories: Array<{ id: string; name: string }>;
  };
  tools?: Tool[];
}

export interface ToolCall {
  type: 'tool-call';
  toolName: string;
  toolCallId: string;
  args: any;
}

export interface ToolResult {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: any;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  model?: string;
  tokensPerSecond?: number;
  totalTokens?: number;
  timeToFirstToken?: number;
  timestamp?: number;
}

export interface Thread { id: string; title: string; messages: ChatMessage[] };
