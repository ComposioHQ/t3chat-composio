# T3Chat Composio

A powerful AI chat interface built with Next.js that integrates multiple AI providers with Composio tools for enhanced functionality.

## Features

- **Multi-AI Provider Support**: Connect to OpenAI, Anthropic, Google Gemini, and Groq models
- **Tool Integration**: Seamlessly use external tools via Composio platform
- **Streaming Responses**: Real-time chat experience with streaming
- **Modern UI**: Clean, responsive interface built with TailwindCSS
- **Model Selection**: Choose from the latest AI models across providers
- **Tool Selection**: Pick and configure tools for enhanced AI capabilities
- **File Attachments**: Support for file uploads and attachments
- **Message History**: Persistent chat threads with local storage

## Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- API keys for desired AI providers
- Composio API key for tool integration

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd t3chat-composio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```bash
# AI Provider API Keys (at least one required)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key

# Composio Integration (required for tools)
COMPOSIO_API_KEY=your_composio_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

Built with modern technologies:

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **AI Integration**: AI SDK with multiple provider support
- **Tools Platform**: Composio for external service integrations
- **Styling**: TailwindCSS with custom design system
- **Type Safety**: TypeScript throughout

## Supported AI Models

### OpenAI

- GPT-5, GPT-5 Mini, GPT-5 Nano
- O3, O4 Mini
- GPT-4.1, GPT-4.1 Mini

### Anthropic

- Claude 4 Opus, Claude 4 Sonnet
- Claude 3.5 Sonnet, Claude 3.5 Haiku

### Google

- Gemini 2.5 Pro, Gemini 2.5 Flash
- Gemini 2.0 Flash, Gemini 2.0 Flash Thinking

### Groq

- DeepSeek R1 Llama 70B
- Llama 3.3 70B

## Tool Integration

The application integrates with Composio to provide access to hundreds of tools and services. Select tools through the intuitive tool selection modal to enhance your AI conversations.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## References

### Core Integrations

- [Composio Platform](https://composio.dev) - Tools and integrations platform
- [Composio Documentation](https://docs.composio.dev) - Complete integration guides
- [Composio GitHub](https://github.com/composiohq/composio) - Open source repository

### AI Providers

- [OpenAI](https://openai.com) - GPT models and API
- [Anthropic](https://anthropic.com) - Claude models
- [Google AI](https://ai.google.dev) - Gemini models
- [Groq](https://groq.com) - High-speed LLM inference

### Framework & Tools

- [Next.js](https://nextjs.org) - React framework
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS
- [Vercel AI SDK](https://sdk.vercel.ai) - AI application toolkit
- [T3 Stack](https://create.t3.gg) - Modern web development stack

### Inspiration

- [T3 Chat](https://t3.chat) - Modern chat interface inspiration
