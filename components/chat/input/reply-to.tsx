import { Button } from "@heroui/button";
import { useQuery } from "convex/react";
import { Reply, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useReplyMessage } from "@/zustand/reply-message";

export default function ReplyTo() {
  const { replyMessageId, clearReplyTo } = useReplyMessage();

  const getMessage = useQuery(api.messages.getMessageById, {
    _id: replyMessageId as Id<"messages">,
  });

  return (
    <>
      {getMessage && (
        <div className="flex items-center gap-2">
          {/* Reply Icon */}
          <div className="grid h-10 w-10 place-content-center">
            <Reply size={20} />
          </div>

          {/* Reply info */}
          <div className="pointer-events-none flex-1 space-y-1 rounded-md bg-default p-2 text-xs">
            {/* Title */}
            <span className="block font-semibold">
              Reply to {getMessage?.sender?.username}
            </span>

            {/* Content */}
            <div
              className={`prose max-h-20 max-w-none overflow-hidden text-xs text-black marker:text-black dark:text-white dark:marker:text-white`}
            >
              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  blockquote: ({ node, ...props }) => (
                    <blockquote {...props} className={`dark:text-white`}>
                      {props.children}
                    </blockquote>
                  ),
                }}
              >
                {getMessage.unsentBy
                  ? `_message was unsent_`
                  : getMessage?.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Clear */}
          <Button
            isIconOnly
            radius="full"
            variant="light"
            onPress={clearReplyTo}
          >
            <X size={20} />
          </Button>
        </div>
      )}
    </>
  );
}
