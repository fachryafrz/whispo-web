/* eslint-disable @next/next/no-img-element */
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useImageCarousel } from "@/zustand/image-carousel";

export default function Media({ msg }: { msg: Doc<"chat_messages"> }) {
  const { openModal } = useImageCarousel();

  const getMedia = useQuery(api.chats.getMedia, { mediaId: msg.mediaId });

  return (
    <>
      {getMedia && (
        <button
          className="relative overflow-hidden rounded-md"
          onClick={() =>
            openModal({
              src: getMedia,
              description: msg.text,
            })
          }
        >
          <img
            alt=""
            className="max-h-[500px] object-cover"
            draggable={false}
            src={getMedia}
          />
        </button>
      )}
    </>
  );
}
