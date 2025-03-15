import { create } from "zustand";

import { Id } from "@/convex/_generated/dataModel";

type Chat = {
  chatId: Id<"chats"> | null;
  type: "private" | "group";
  name?: string;
  description?: string;
  imageUrl?: string;
};

type SelectedChat = {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
  clearSelectedChat: () => void;

  showChatRoom: boolean;
  setShowChatRoom: (showChatRoom: boolean) => void;
};

export const useSelectedChat = create<SelectedChat>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  clearSelectedChat: () => set({ selectedChat: null }),

  showChatRoom: false,
  setShowChatRoom: (showChatRoom) => set({ showChatRoom }),
}));
