import { useQuery } from "convex/react";
import { Card, CardBody } from "@heroui/card";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { EllipsisVertical, Reply, Undo2 } from "lucide-react";
import { addToast } from "@heroui/toast";

import { useChat } from "@/zustand/chat";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export default function ChatMessages() {
  const { activeChat } = useChat();

  const messages = useQuery(api.messages.getMessagesByChatId, {
    chatId: activeChat?._id as Id<"chats">,
  });

  return (
    <div className="relative flex-1 overflow-y-hidden before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-10 before:dark:invert">
      {/* Messages */}
      <div className="relative flex h-full flex-1 flex-col-reverse items-center gap-1 overflow-y-auto p-4">
        {messages?.map((msg, index) => {
          const prevMsg = messages[index + 1];
          const isDifferentSender = prevMsg?.sender !== msg.sender;

          return (
            <Message
              key={msg._id}
              className={`${isDifferentSender ? "pt-4" : "pt-0"}`}
              msg={msg}
            />
          );
        })}
      </div>
    </div>
  );
}

function Message({
  msg,
  className,
}: {
  msg: Doc<"messages">;
  className?: string;
}) {
  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <div
      key={msg._id}
      className={`group flex w-full gap-1 ${className} ${msg.sender === currentUser?._id ? "justify-end" : "justify-start"}`}
    >
      <Card
        className={`w-fit max-w-xs rounded-md lg:max-w-lg xl:max-w-xl ${
          msg.sender === currentUser?._id
            ? "order-2 bg-default"
            : "order-1 bg-black text-white dark:bg-white dark:text-black"
        }`}
      >
        <CardBody className="flex-row overflow-visible p-2">
          {/* NOTE: Kalau pakai text, gabisa markdown */}
          {/* <p className="max-w-full whitespace-pre-wrap text-sm">
            {msg.content}
          </p> */}

          {/* NOTE: Kalau pakai markdown, gabisa multiple line breaks */}
          <div
            className={`prose text-sm ${
              msg.sender === currentUser?._id
                ? "prose-a:text-black dark:prose-a:text-white prose-code:dark:text-white text-black marker:text-black dark:text-white dark:marker:text-white"
                : "prose-a:text-white dark:prose-a:text-black prose-code:dark:text-black text-white marker:text-white dark:text-black dark:marker:text-black"
            }`}
          >
            <ReactMarkdown
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                a: ({ node, ...props }) => (
                  <a {...props} rel="noopener noreferrer" target="_blank">
                    {props.children}
                  </a>
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {msg.content}
            </ReactMarkdown>
          </div>

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

      {/* CTA */}
      <div
        className={`opacity-0 transition-all group-hover:opacity-100 ${
          msg.sender === currentUser?._id ? "order-1" : "order-2"
        }`}
      >
        <MessageOptions msg={msg} />
      </div>
    </div>
  );
}

function MessageOptions({ msg }: { msg: Doc<"messages"> }) {
  const currentUser = useQuery(api.users.getCurrentUser);

  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => setWindowWidth(window.innerWidth);

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {mounted && (
        <Dropdown
          placement={
            windowWidth >= 1024
              ? msg.sender === currentUser?._id
                ? "left-start"
                : "right-start"
              : "bottom"
          }
        >
          <DropdownTrigger>
            <Button isIconOnly radius="full" variant="light">
              <EllipsisVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Menu">
            <DropdownItem
              key="reply"
              color="default"
              startContent={<Reply size={20} />}
              onPress={() => {
                addToast({
                  title: "Reply",
                  description: "This feature is coming soon.",
                  color: "warning",
                });
              }}
            >
              Reply
            </DropdownItem>
            {msg.sender === currentUser?._id ? (
              <DropdownItem
                key="unsend"
                className="text-danger"
                color="danger"
                startContent={<Undo2 size={20} />}
                onPress={() => {
                  addToast({
                    title: "Unsend",
                    description: "This feature is coming soon.",
                    color: "warning",
                  });
                }}
              >
                Unsend
              </DropdownItem>
            ) : null}
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  );
}
