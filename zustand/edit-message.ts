import { create } from "zustand";

type EditMessage = {
  message: string | null;
  setMessage: (message: string) => void;
};

export const useEditMessage = create<EditMessage>((set) => ({
  message: null,
  setMessage: (message) => set({ message }),
}));
