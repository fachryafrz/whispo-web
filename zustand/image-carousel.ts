import { create } from "zustand";

type Image = {
  src: string;
  title?: string;
  description?: string;
};

type ImageCarousel = {
  open: boolean;
  image: Image | null;
  openModal: (image: Image) => void;
  closeImage: () => void;
};

export const useImageCarousel = create<ImageCarousel>((set) => ({
  open: false,
  image: null,
  openModal: (image: Image) => set({ open: true, image }),
  closeImage: () => set({ open: false, image: null }),
}));
