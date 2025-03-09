import { useQuery } from "convex/react";
import { Card, CardBody } from "@heroui/card";
import dayjs from "dayjs";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useChat } from "@/zustand/chat";

export default function ChatMessages() {
  const { activeChat } = useChat();

  const messages = useQuery(api.messages.getMessagesByChatId, {
    chatId: activeChat?._id as Id<"chats">,
  });

  return (
    <div className="relative flex-1 overflow-y-hidden before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-10 before:dark:invert">
      {/* Messages */}
      <div className="relative flex h-full flex-1 flex-col-reverse items-center gap-1 overflow-y-auto p-4">
        {messages?.map((msg) => <Message key={msg._id} msg={msg} />)}
      </div>
    </div>
  );
}

function Message({ msg }: { msg: Doc<"messages"> }) {
  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <div
      key={msg._id}
      className={`flex w-full ${msg.sender === currentUser?._id ? "justify-end" : "justify-start"}`}
    >
      <Card className="w-fit max-w-lg rounded-md bg-black text-white dark:bg-white dark:text-black">
        <CardBody className="flex-row overflow-visible p-2">
          {/* <p className="text-sm break-words max-w-full text-wrap">{msg.content}</p> */}
          <p className="max-w-full whitespace-pre-wrap text-sm">
            {msg.content}
          </p>

          {/* Time placeholder */}
          <time
            className={`pointer-events-none ml-2 flex text-[10px] opacity-0`}
          >
            {dayjs(msg._creationTime).format("HH:mm")}
          </time>

          {/* Time displayed */}
          <span
            className={`pointer-events-none absolute bottom-1 right-2 flex text-[10px]`}
          >
            {dayjs(msg._creationTime).format("HH:mm")}
          </span>
        </CardBody>
      </Card>
    </div>
  );
}
