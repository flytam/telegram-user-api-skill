#!/usr/bin/env node

import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

// Get API credentials from environment variables
const API_ID = process.env.TELEGRAM_API_ID!;
const API_HASH = process.env.TELEGRAM_API_HASH!;

// Validate required API credentials
if (!API_ID || !API_HASH) {
  console.error("Error: Please set TELEGRAM_API_ID and TELEGRAM_API_HASH environment variables");
  console.error("Reference: https://core.telegram.org/api/obtaining_api_id");
  process.exit(1);
}

// Create interactive input interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

interface ClientCache {
  [token: string]: TelegramClient;
}

const clientCache: ClientCache = {};

async function getClient(token: string): Promise<TelegramClient> {
  if (clientCache[token]) {
    return clientCache[token];
  }

  const stringSession = new StringSession(token);
  const tgClient = new TelegramClient(stringSession, parseInt(API_ID), API_HASH, {
    connectionRetries: 100,
    retryDelay: 500,
  });

  // Check if session is valid
  try {
    await tgClient.connect();
    clientCache[token] = tgClient;
    return tgClient;
  } catch (error) {
    throw new Error("Session token invalid or expired, please re-login");
  }
}

async function listChats(token: string) {
  const client = await getClient(token);
  const dialogs = await client.getDialogs({ limit: 100 });

  console.log("\nFound " + dialogs.length + " conversations:\n");

  dialogs.forEach((dialog, index) => {
    const type = dialog.isGroup ? "Group" : dialog.isChannel ? "Channel" : "Private";
    const title = dialog.title || dialog.name || "Unknown";
    const id = dialog.id?.toString();
    console.log(index + 1 + ". [" + type + "] " + title);
    console.log("   ID: " + id + "\n");
  });
}

async function findChat(token: string, name: string) {
  const client = await getClient(token);
  const dialogs = await client.getDialogs({ limit: 100 });

  const matched = dialogs.filter((dialog) => {
    const title = dialog.title || dialog.name || "";
    return title.toLowerCase().includes(name.toLowerCase());
  });

  if (matched.length === 0) {
    console.log("No groups found containing \"" + name + "\"");
    return;
  }

  console.log("\nFound " + matched.length + " matching groups:\n");
  matched.forEach((dialog, index) => {
    const type = dialog.isGroup ? "Group" : dialog.isChannel ? "Channel" : "Private";
    const title = dialog.title || dialog.name || "Unknown";
    const id = dialog.id?.toString();
    console.log(index + 1 + ". [" + type + "] " + title);
    console.log("   ID: " + id + "\n");
  });
}

async function getMessages(token: string, chatId: string, limit: number = 10, keyword?: string) {
  const client = await getClient(token);

  let messages;
  if (keyword) {
    try {
      messages = await client.getMessages(chatId, { limit, search: keyword });
    } catch (e) {
      throw new Error("Failed to get messages: " + (e as Error).message);
    }
  } else {
    messages = await client.getMessages(chatId, { limit });
  }

  console.log("\nGot " + messages.length + " messages:\n");

  messages.reverse().forEach((msg) => {
    const time = dayjs.tz(msg.date * 1000).format("YYYY-MM-DD HH:mm:ss");
    const text = msg.text || msg.message || "[Non-text message]";
    const sender = msg.fromId ? (msg.fromId as any).userId?.toString() : "Unknown";
    const out = msg.out ? "[Sent]" : "[Received]";

    console.log(out + " " + time);
    console.log("From: " + sender);
    console.log("Content: " + text.slice(0, 200) + (text.length > 200 ? "..." : ""));
    console.log("---\n");
  });
}

async function getChatInfo(token: string, chatId: string) {
  const client = await getClient(token);

  const entity = await client.getEntity(chatId);

  console.log("\nGroup info:\n");
  console.log("ID: " + entity.id?.toString());
  console.log("Name: " + ((entity as any).title || (entity as any).firstName));
  console.log("Username: " + ((entity as any).username || "None"));
  console.log("Members: " + ((entity as any).participantsCount || "Unknown"));
  console.log("Type: " + (entity as any).className);
  console.log("About: " + ((entity as any).about || "None"));
}

async function sendMessage(token: string, chatId: string, text: string) {
  const client = await getClient(token);

  await client.sendMessage(chatId, { message: text });

  console.log("Message sent to " + chatId);
}

/**
 * Login and get session token
 */
async function login() {
  console.log("\n=== Telegram Login ===\n");

  // Input phone number
  const phone = await question("Please enter phone number (e.g. +1234567890): ");
  if (!phone) {
    console.error("Error: Phone number cannot be empty");
    rl.close();
    process.exit(1);
  }

  const stringSession = new StringSession("");
  const tgClient = new TelegramClient(stringSession, parseInt(API_ID), API_HASH, {
    connectionRetries: 100,
    retryDelay: 500,
  });

  try {
    await tgClient.start({
      phoneNumber: async () => phone,
      password: async () => {
        console.log("\nTwo-step verification required:");
        return await question("Please enter password: ");
      },
      phoneCode: async () => {
        console.log("\nPlease enter the verification code:");
        return await question("Code: ");
      },
      onError: (err) => {
        console.error("Login error:", err);
      },
    });

    // Get session token
    const sessionToken = tgClient.session.save();

    console.log("\n=== Login Successful! ===\n");
    console.log("Your Session Token (save it for future use):\n");
    console.log(sessionToken);
    console.log("\nPlease save this token, use --token parameter or set TELEGRAM_SESSION_TOKEN environment variable.\n");

    // Save to .env file
    const saveEnv = await question("Save to .env file? (y/n): ");
    if (saveEnv.toLowerCase() === "y") {
      const fs = await import("fs");
      const envPath = ".env.telegram-user";
      const content = 'TELEGRAM_SESSION_TOKEN="' + sessionToken + '"\n';
      fs.writeFileSync(envPath, content);
      console.log("Saved to " + envPath);
      console.log("Use: source " + envPath + " or manually set environment variable");
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\nLogin failed:", (error as Error).message);
    rl.close();
    process.exit(1);
  }
}

function showHelp() {
  console.log("Telegram User API Tool (Not Bot API)\n\nUsage:\n  telegram-user-api login                           # Login and get session token\n  telegram-user-api list-chats --token <token>     # List all conversations\n  telegram-user-api find-chat --token <token> --name <keyword>\n  telegram-user-api get-messages --token <token> --chat_id <id> [--limit <count>] [--keyword <keyword>]\n  telegram-user-api get-chat-info --token <token> --chat_id <id>\n  telegram-user-api send-message --token <token> --chat_id <id> --text <message>\n\nEnvironment Variables (required):\n  TELEGRAM_API_ID       Get from https://core.telegram.org/api/obtaining_api_id\n  TELEGRAM_API_HASH     Get from https://core.telegram.org/api/obtaining_api_id\n  TELEGRAM_SESSION_TOKEN Optional, default token\n\nFor more info see README.md");
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const command = args[0];

  // login command doesn't require token
  if (command === "login") {
    await login();
    return;
  }

  const tokenArg = args.find((a) => a.startsWith("--token="));
  const token = tokenArg ? tokenArg.replace("--token=", "") :
    (args.find((a) => a === "--token") ? args[args.indexOf("--token") + 1] :
      process.env.TELEGRAM_SESSION_TOKEN);

  if (!token) {
    console.error("Error: Please provide --token or set TELEGRAM_SESSION_TOKEN environment variable");
    process.exit(1);
  }

  try {
    switch (command) {
      case "list-chats": {
        await listChats(token);
        break;
      }
      case "find-chat": {
        const nameArg = args.find((a) => a.startsWith("--name="));
        const name = nameArg ? nameArg.replace("--name=", "") : args[args.indexOf("--name") + 1];
        if (!name) {
          console.error("Error: Please provide --name parameter");
          process.exit(1);
        }
        await findChat(token, name);
        break;
      }
      case "get-messages": {
        const chatIdArg = args.find((a) => a.startsWith("--chat_id="));
        const chatId = chatIdArg ? chatIdArg.replace("--chat_id=", "") : args[args.indexOf("--chat_id") + 1];
        if (!chatId) {
          console.error("Error: Please provide --chat_id parameter");
          process.exit(1);
        }
        const limitArg = args.find((a) => a.startsWith("--limit="));
        const limit = limitArg ? parseInt(limitArg.replace("--limit=", "")) : 10;
        const keywordArg = args.find((a) => a.startsWith("--keyword="));
        const keyword = keywordArg ? keywordArg.replace("--keyword=", "") : undefined;
        await getMessages(token, chatId, limit, keyword);
        break;
      }
      case "get-chat-info": {
        const chatIdArg = args.find((a) => a.startsWith("--chat_id="));
        const chatId = chatIdArg ? chatIdArg.replace("--chat_id=", "") : args[args.indexOf("--chat_id") + 1];
        if (!chatId) {
          console.error("Error: Please provide --chat_id parameter");
          process.exit(1);
        }
        await getChatInfo(token, chatId);
        break;
      }
      case "send-message": {
        const chatIdArg = args.find((a) => a.startsWith("--chat_id="));
        const chatId = chatIdArg ? chatIdArg.replace("--chat_id=", "") : args[args.indexOf("--chat_id") + 1];
        const textArg = args.find((a) => a.startsWith("--text="));
        const text = textArg ? textArg.replace("--text=", "") : args[args.indexOf("--text") + 1];
        if (!chatId || !text) {
          console.error("Error: Please provide --chat_id and --text parameters");
          process.exit(1);
        }
        await sendMessage(token, chatId, text);
        break;
      }
      case "help":
      case "--help":
      case "-h": {
        showHelp();
        break;
      }
      default:
        console.error("Unknown command: " + command);
        process.exit(1);
    }
  } catch (error) {
    console.error("Error: " + (error as Error).message);
    process.exit(1);
  }
}

main();
