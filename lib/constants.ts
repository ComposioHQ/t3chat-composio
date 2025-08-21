export type Category = "create" | "explore" | "code" | "learn";

export const categoryPrompts: Record<Category, string[]> = {
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

export const modelOptions = [
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
];

export const STORAGE_KEYS = {
  THREADS: "t3chat:threads",
  ACTIVE: "t3chat:activeThreadId",
  MODEL: "t3chat:selectedModel"
} as const;
