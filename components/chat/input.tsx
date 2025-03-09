import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery } from "convex/react";
import { Paperclip, SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";

import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function ChatInput() {
  const { activeChat } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>();

  const currentUser = useQuery(api.users.getCurrentUser);

  const storeMessage = useMutation(api.messages.store);
  const updateChat = useMutation(api.chats.updateChatById);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    storeMessage({
      chat: activeChat?._id as Id<"chats">,
      sender: currentUser?._id as Id<"users">,
      content: text as string,
    }).then(() => {
      setText("");
      inputRef.current?.focus();
    });

    updateChat({
      _id: activeChat?._id as Id<"chats">,
      lastMessage: text as string,
      lastMessageSender: currentUser?._id as Id<"users">,
      lastMessageTime: Date.now(),
    });
  };

  return (
    <div className={`p-2`}>
      <form className="flex gap-2" onSubmit={sendMessage}>
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
        <Input
          ref={inputRef}
          placeholder="Type a message"
          radius="full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
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
