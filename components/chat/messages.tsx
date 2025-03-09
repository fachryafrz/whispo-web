import { useQuery } from "convex/react";
import { Card, CardBody } from "@heroui/card";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useChat } from "@/zustand/chat";

export default function ChatMessages() {
  const { activeChat } = useChat();

  const currentUser = useQuery(api.users.getCurrentUser);

  const messages = useQuery(api.messages.getMessagesByChatId, {
    chatId: activeChat?._id as Id<"chats">,
  });

  return (
    <div className="relative flex-1 overflow-y-hidden before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-10 before:dark:invert">
      {/* Messages */}
      <div className="relative flex h-full flex-1 flex-col-reverse items-center gap-1 overflow-y-auto p-4">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`flex w-full ${msg.sender === currentUser?._id ? "justify-end" : "justify-start"}`}
          >
            <Card className="w-fit max-w-sm bg-black text-white dark:bg-white dark:text-black">
              <CardBody>
                <p className="text-sm">{msg.content}</p>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
