# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Telegram User API CLI tool - uses MTProto protocol to interact with Telegram personal accounts (not Bot API).

## Common Commands

```bash
# Install dependencies
pnpm install

# Build project
pnpm build

# Development mode
pnpm dev

# Production mode
pnpm start

# Login to get session token
pnpm start login

# List all conversations
pnpm start list-chats --token "your_token"

# Search groups by name
pnpm start find-chat --token "your_token" --name "keyword"

# Get messages from group
pnpm start get-messages --token "your_token" --chat_id "-1111" --limit 20

# Get group info
pnpm start get-chat-info --token "your_token" --chat_id "-1111"

# Send message
pnpm start send-message --token "your_token" --chat_id "-111" --text "Hello!"
```

## Environment Variables

Configure in `.env` file:

- `TELEGRAM_API_ID` - Get from https://my.telegram.org
- `TELEGRAM_API_HASH` - Get from https://my.telegram.org
- `TELEGRAM_SESSION_TOKEN` - Generated after login

## Architecture

- **Entry file**: `scripts/telegram-user.ts`
- **Output directory**: `dist/`
- **Main functions**:
  - `getClient()` - Get Telegram client by token (with caching)
  - `login()` - Interactive login, get session token
  - `listChats()` - Get all conversation list
  - `findChat()` - Search groups by name
  - `getMessages()` - Get group messages (supports keyword filter)
  - `getChatInfo()` - Get group details
  - `sendMessage()` - Send message

## Tech Stack

- TypeScript + Node.js (ES2022)
- `telegram` package (MTProto protocol client)
- `dayjs` (date/time handling)
- `dotenv` (environment variables)
