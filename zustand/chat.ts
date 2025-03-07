import { create } from "zustand";

import { Chat } from "@/types";

type ChatState = {
  activeChat: Chat | null;
  setActiveChat: (chat: Chat) => void;
  clearActiveChat: () => void;
};

export const useChat = create<ChatState>((set) => ({
  activeChat: null,
  setActiveChat: (chat) => set({ activeChat: chat }),
  clearActiveChat: () => set({ activeChat: null }),
}));
