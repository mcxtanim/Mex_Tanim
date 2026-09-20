import { AdminChatMessage } from "./types";

const MESSAGES_STORAGE_KEY = "mex_tanim_chat_messages";

const SEED_MESSAGES: AdminChatMessage[] = [
  {
    id: "welcome-1",
    sender: "support",
    text: "👋 Swagatom Mex Tanim Store Gaming Support! Write to us for any gadget or order inquiry.",
    time: "10:00 AM",
  },
  {
    id: "msg-101",
    sender: "user",
    text: "Fantech 7.1 Gaming Headset er stock e ache ki? Fast delivery hobeno?",
    time: "10:15 AM",
    customerName: "Customer",
  },
  {
    id: "msg-102",
    sender: "support",
    text: "Ji, Fantech 7.1 Headset 100% authentic stock e available ache! Cash on delivery te 24-48 ghontay delivery hobe.",
    time: "10:18 AM",
  },
];

export function getAdminStoredMessages(): AdminChatMessage[] {
  if (typeof window === "undefined") return SEED_MESSAGES;
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(SEED_MESSAGES));
      return SEED_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_MESSAGES;
  } catch (err) {
    console.error("Error reading messages in admin:", err);
    return SEED_MESSAGES;
  }
}

export function saveAdminMessages(messages: AdminChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch (err) {
    console.error("Error saving messages in admin:", err);
  }
}

export function sendAdminReply(replyText: string, currentMessages: AdminChatMessage[]): AdminChatMessage[] {
  const newMsg: AdminChatMessage = {
    id: `admin-${Date.now()}`,
    sender: "support",
    text: replyText.trim(),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  const updated = [...currentMessages, newMsg];
  saveAdminMessages(updated);
  return updated;
}

export function clearAdminMessages(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MESSAGES_STORAGE_KEY);
}
