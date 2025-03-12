/* eslint-disable @next/next/no-img-element */
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export default function Media({ msg }: { msg: Doc<"messages"> }) {
  const getMessageMedia = useQuery(api.messages.getMessageMedia, {
    _id: msg.mediaUrl,
  });

  return (
    <>
      {getMessageMedia && (
        <div className="flex items-center gap-2">
          <div className="relative overflow-hidden rounded-md">
            <img
              alt=""
              className="max-h-[300px] object-cover"
              draggable={false}
              src={getMessageMedia}
            />
          </div>
        </div>
      )}
    </>
  );
}
