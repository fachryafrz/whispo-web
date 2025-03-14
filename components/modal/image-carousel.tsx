"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import { useImageCarousel } from "@/zustand/image-carousel";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/styles.css";

export default function ImageCarousel() {
  const { open, image, closeImage } = useImageCarousel();

  return (
    <Lightbox
      captions={{
        descriptionTextAlign: "center",
      }}
      carousel={{
        finite: true,
      }}
      close={() => closeImage()}
      open={open}
      plugins={[Captions, Zoom]}
      slides={[
        {
          src: image?.src || "",
          title: image?.title || "",
          description: image?.description || "",
        },
      ]}
    />
  );
}
