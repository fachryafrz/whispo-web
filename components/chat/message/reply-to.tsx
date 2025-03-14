import { useQuery } from "convex/react";
import ReactMarkdown from "react-markdown";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

// TODO: Condition replying to deleted message
export default function ReplyTo({ msg }: { msg: Doc<"chat_messages"> }) {
  const getMessage = useQuery(api.chats.getMessage, {
    messageId: msg.replyTo as Id<"chat_messages">,
  });
  const getUser = useQuery(api.users.getUser, {
    userId: getMessage?.senderId as Id<"users">,
  });

  return (
    <>
      {getMessage && getUser ? (
        <div className="pointer-events-none space-y-1 rounded-md bg-white p-2 text-xs text-black dark:bg-black dark:text-white">
          {/* Title */}
          <div>
            Reply to <strong>{getUser.username}</strong>
          </div>

          {/* Content */}
          <div
            className={`prose max-h-20 overflow-hidden text-xs text-black marker:text-black dark:text-white dark:marker:text-white`}
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
              {getMessage.isUnsent ? `_message was unsent_` : getMessage?.text}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="h-[52px] rounded-md bg-white p-2 text-xs dark:bg-black" />
      )}
    </>
  );
}
