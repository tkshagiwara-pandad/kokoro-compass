import { ChatMessage, Sender } from "@/types/consultation";

export const createChatMessage = (
  sender: Sender,
  content: string,
): ChatMessage => ({
  id: crypto.randomUUID(),
  sender,
  content,
  createdAt: new Date().toISOString(),
});
