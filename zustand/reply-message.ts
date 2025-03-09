import { create } from "zustand";

type ReplyMessage = {
  replyMessageId: string | null;
  setReplyMessageId: (message: string) => void;
  clearReplyTo: () => void;
};

export const useReplyMessage = create<ReplyMessage>((set) => ({
  replyMessageId: null,
  setReplyMessageId: (message) => set({ replyMessageId: message }),
  clearReplyTo: () => set({ replyMessageId: null }),
}));
