import { create } from "zustand";


type ArchivedChats = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const useArchivedChats = create<ArchivedChats>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
