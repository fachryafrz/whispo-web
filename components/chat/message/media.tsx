/* eslint-disable @next/next/no-img-element */
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export default function Media({ msg }: { msg: Doc<"chat_messages"> }) {
  const getMedia = useQuery(api.chats.getMedia, { mediaId: msg.mediaId });

  return (
    <>
      {getMedia && (
        <div className="flex items-center gap-2">
          <div className="relative overflow-hidden rounded-md">
            <img
              alt=""
              className="max-h-[500px] object-cover"
              draggable={false}
              src={getMedia}
            />
          </div>
        </div>
      )}
    </>
  );
}
