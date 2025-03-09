import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery } from "convex/react";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { handleKeyDown } from "@/utils/handle-textarea-key-down";
import { useReplyMessage } from "@/zustand/reply-message";

export default function ChatInput() {
  const { activeChat } = useChat();
  const { replyMessageId, clearReplyTo } = useReplyMessage();

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>();

  const currentUser = useQuery(api.users.getCurrentUser);

  const storeMessage = useMutation(api.messages.store);
  const updateChat = useMutation(api.chats.updateChatById);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text) return;

    storeMessage({
      chat: activeChat?._id as Id<"chats">,
      sender: currentUser?._id as Id<"users">,
      content: text,
      replyTo: replyMessageId as Id<"messages"> || undefined,
    }).then(() => {
      setText("");
      clearReplyTo();
      textareaRef.current?.focus();
    });

    updateChat({
      _id: activeChat?._id as Id<"chats">,
      lastMessage: text as string,
      lastMessageSender: currentUser?._id as Id<"users">,
      lastMessageTime: Date.now(),
    });
  };

  useEffect(() => {
    setText("");
    clearReplyTo();
  }, [activeChat]);

  return (
    <div className={`space-y-2 p-2`}>
      {/* Reply to */}
      {replyMessageId && <ReplyTo />}

      {/* Message input */}
      <form
        ref={formRef}
        className="flex items-end gap-2"
        onSubmit={sendMessage}
      >
        {/* Attachments */}
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onPress={() =>
            addToast({
              title: "Add attachments",
              description:
                "Upload images and files. This feature is coming soon.",
              color: "warning",
            })
          }
        >
          <Paperclip size={20} />
        </Button>

        {/* Message */}
        <Textarea
          ref={textareaRef}
          minRows={1}
          placeholder="Type a message"
          radius="full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(
              e as React.KeyboardEvent<HTMLTextAreaElement>,
              formRef,
            )
          }
        />

        {/* Send */}
        <Button
          isIconOnly
          className="bg-black text-white dark:bg-white dark:text-black"
          radius="full"
          type="submit"
        >
          <SendHorizontal size={20} />
        </Button>
      </form>
    </div>
  );
}

function ReplyTo() {
  const { replyMessageId, clearReplyTo } = useReplyMessage();

  const getMessage = useQuery(api.messages.getMessageById, {
    _id: replyMessageId as Id<"messages">,
  });
  const getUserOfMessage = useQuery(api.users.getUserById, {
    _id: getMessage?.sender as Id<"users">,
  });

  return (
    <>
      {getMessage && getUserOfMessage && (
        <div className="flex items-center gap-2">
          {/* Reply info */}
          <div className="pointer-events-none ml-12 flex-1 space-y-1 rounded-md bg-default p-2 text-xs">
            {/* Title */}
            <span className="block font-semibold">
              Reply to {getUserOfMessage?.username}
            </span>

            {/* Content */}
            <span className="block">{getMessage?.content}</span>
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
