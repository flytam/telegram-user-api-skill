# Telegram User API Skill

<p align="center">

[![npm 版本](https://img.shields.io/npm/v/telegram-user-api-skill.svg)](https://www.npmjs.com/package/telegram-user-api-skill)
[![Node.js](https://img.shields.io/node/v/telegram-user-api-skill.svg)](https://nodejs.org)
[![许可证](https://img.shields.io/npm/l/telegram-user-api-skill.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org)

</p>

> ⚡️ 通过 MTProto 协议使用 Telegram 个人账号的命令行工具。
> **这是 User API，不是 Bot API。**

## ✨ 功能特点

- 🔌 通过 MTProto 协议连接 Telegram 个人账号
- 📋 获取所有对话列表（群组/频道/私聊）
- 🔍 根据关键词搜索群组
- 📊 获取群组/频道详细信息和成员数量
- 💬 获取群组消息历史
- ✉️ 发送消息到群组/私聊
- 🔑 支持关键字过滤消息

## 🚀 快速开始

### 1. 安装

```bash
pnpm install
```

### 2. 获取 Telegram API 凭证

首先从 Telegram 获取 API 凭证：

1. 访问 [my.telegram.org](https://my.telegram.org)
2. 使用你的 Telegram 账号登录
3. 创建一个新应用
4. 获取你的 `api_id` 和 `api_hash`

### 3. 配置

```bash
cp .env.example .env
```

编辑 `.env`：

```bash
TELEGRAM_API_ID=your_api_id_here
TELEGRAM_API_HASH=your_api_hash_here
```

### 4. 登录

```bash
pnpm build
pnpm start login
```

按照提示进行身份验证。

## 📖 命令说明

| 命令 | 说明 |
|------|------|
| `login` | 登录并获取 session token |
| `list-chats` | 列出所有对话 |
| `find-chat --name <关键词>` | 按名称搜索群组 |
| `get-messages --chat_id <ID> [--limit N]` | 获取群组消息 |
| `get-chat-info --chat_id <ID>` | 获取群组详情 |
| `send-message --chat_id <ID> --text <消息>` | 发送消息 |

## 🔧 环境变量

| 变量名 | 必填 | 说明 |
|--------|:----:|------|
| `TELEGRAM_API_ID` | ✅ | 从 [my.telegram.org](https://my.telegram.org) 获取 |
| `TELEGRAM_API_HASH` | ✅ | 从 [my.telegram.org](https://my.telegram.org) 获取 |
| `TELEGRAM_SESSION_TOKEN` | - | Session token（登录后） |

## 📝 使用示例

```bash
# 登录（首次使用）
pnpm start login

# 列出所有对话
pnpm start list-chats --token "your_token"

# 查找群组
pnpm start find-chat --token "your_token" --name "加密货币"

# 获取消息
pnpm start get-messages --token "your_token" --chat_id "-10000" --limit 20

# 发送消息
pnpm start send-message --token "your_token" --chat_id "-10000" --text "你好！"
```

## ⚠️ 注意事项

- **不是 Bot API**: 使用 User API（MTProto），与 Bot API 不同
- **隐私**: 凭证仅保存在本地
- **频率限制**: 请遵守 Telegram 的 API 限制
- **Token 有效期**: 可能需要定期重新登录

## 🔗 相关链接

- [Telegram API 文档](https://core.telegram.org/api)
- [MTProto 文档](https://core.telegram.org/mtproto)
- [获取 API ID](https://core.telegram.org/api/obtaining_api_id)

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)

---

*English documentation available at [README.md](README.md)*
