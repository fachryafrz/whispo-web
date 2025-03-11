import { create } from "zustand";

import { Doc } from "@/convex/_generated/dataModel";

type ChatState = {
  activeChat: Doc<"chats"> | null;
  setActiveChat: (chat: Doc<"chats">) => void;
  clearActiveChat: () => void;
};

export const useChat = create<ChatState>((set) => ({
  activeChat: null,
  setActiveChat: (chat) => set({ activeChat: chat }),
  clearActiveChat: () => set({ activeChat: null }),
}));
