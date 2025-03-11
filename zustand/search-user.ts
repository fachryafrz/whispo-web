import { create } from "zustand";

type SearchUser = {
  open: boolean;
  setOpen: (open: boolean) => void;

  query: string;
  setQuery: (query: string) => void;
};

export const useSearchUser = create<SearchUser>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),

  query: "",
  setQuery: (query) => set({ query }),
}));
