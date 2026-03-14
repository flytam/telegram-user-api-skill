# Telegram User API Skill

<p align="center">

[![Node.js](https://img.shields.io/node/v/telegram-user-api-skill.svg)](https://nodejs.org)
[![License](https://img.shields.io/npm/l/telegram-user-api-skill.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org)

</p>

> A command-line tool to interact with Telegram using your personal account via MTProto protocol.
> **This is User API, not Bot API.**

## What This Skill Does

Use Telegram personal account (MTProto) to call Telegram features:
- Connect to Telegram personal account
- List all conversations (groups/channels/private chats)
- Search groups by name
- Get group/channel details and member counts
- Fetch message history from groups
- Send messages to groups/private chats
- Filter messages by keyword

## Setup

### 1. Install

```bash
pnpm install
```

### 2. Get Telegram API Credentials

Obtain from [my.telegram.org](https://my.telegram.org):
1. Login with your Telegram account
2. Create a new application
3. Get your `api_id` and `api_hash`

### 3. Configure

```bash
cp .env.example .env
```

Edit `.env`:

```bash
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
```

### 4. Login

```bash
pnpm start login
```

Follow the prompts to authenticate and get session token.

## Commands

### login

Login and get session token (first time).

```bash
pnpm start login
# or
./bin/telegram-user login
```

### list-chats

List all conversations.

```bash
pnpm start list-chats --token "session_token"
# or
./bin/telegram-user list-chats --token "session_token"
```

### find-chat

Find group by name.

```bash
pnpm start find-chat --token "session_token" --name "keyword"
```

### get-messages

Get messages from group.

```bash
pnpm start get-messages --token "session_token" --chat_id "-100xxx" --limit 10
```

Parameters:
- `--chat_id` (required): Group ID
- `--limit` (optional): Number of messages, default 10
- `--keyword` (optional): Keyword filter

### get-chat-info

Get group detailed info.

```bash
pnpm start get-chat-info --token "session_token" --chat_id "-100xxx"
```

### send-message

Send message to group/private chat.

```bash
pnpm start send-message --token "session_token" --chat_id "-100xxx" --text "hello"
```

## Environment Variables

| Variable | Required | Description |
|----------|:--------:|-------------|
| `TELEGRAM_API_ID` | ✅ | Get from my.telegram.org |
| `TELEGRAM_API_HASH` | ✅ | Get from my.telegram.org |
| `TELEGRAM_SESSION_TOKEN` | - | Session token (after login) |

## Notes

- **Not Bot API**: Uses User API (MTProto), different from Bot API
- **Privacy**: Credentials stored locally only
- **Rate Limits**: Respect Telegram's API limits
- **Token Expiry**: May need re-login periodically

## License

MIT License - see [LICENSE](LICENSE)
