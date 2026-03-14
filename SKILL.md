---
name: telegram-user
description: Use Telegram personal account (MTProto) to call Telegram features, supports fetching groups, messages, sending messages, etc.
---

# telegram-user Skill

Use Telegram personal account (MTProto) to call Telegram features, supports fetching groups, messages, sending messages, etc.

## Configuration

### Environment Variables

```bash
# Required
export TELEGRAM_SESSION_TOKEN="your_session_token"

# Optional (already have default values)
export TELEGRAM_API_ID="your_api_id"
export TELEGRAM_API_HASH="your_api_hash"
```

### Get Session Token

Reference `telegram-user.ts`, need to login via phone number first to get session token.

## Commands

### login

Login and get session token (first time use).

```bash
pnpm start login
```

Flow:
1. Enter phone number
2. Enter verification code
3. Enter password (if two-step verification enabled)
4. Get session token (can save to .env file)

### list-chats

Get all conversation list.

```bash
pnpm start list-chats --token "session_token"
```

### find-chat

Find group by name.

```bash
pnpm start find-chat --token "session_token" --name "group_name_keyword"
```

### get-messages

Get group messages.

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

## Usage Examples

```bash
# Or use bin wrapper
./bin/telegram-user login
./bin/telegram-user list-chats --token "xxx"
./bin/telegram-user find-chat --token "xxx" --name "keyword"
./bin/telegram-user get-messages --token "xxx" --chat_id "-100xxx" --limit 10
```

## Dependencies

- `telegram` npm package
- Node.js 18+
