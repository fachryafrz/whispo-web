import { usePaginatedQuery, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { ArrowDown } from "lucide-react";
import { Spinner } from "@heroui/spinner";
import { useInView } from "react-intersection-observer";
import { useTheme } from "next-themes";

import Message from "../message";

import { useChat } from "@/zustand/chat";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

const NUM_MESSAGES_TO_LOAD = 50;

export default function ChatMessages() {
  const { resolvedTheme } = useTheme();
  const { activeChat } = useChat();
  const { ref: loadMoreRef, inView } = useInView();

  const currentUser = useQuery(api.users.getCurrentUser);

  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.getMessagesByChatId,
    { chatId: activeChat?._id as Id<"chats"> },
    { initialNumItems: NUM_MESSAGES_TO_LOAD },
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState<boolean>(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollBtn(e.currentTarget.scrollTop < 0);
  };

  useEffect(() => {
    if (inView) loadMore(NUM_MESSAGES_TO_LOAD);
  }, [inView]);

  return (
    <div className="relative flex-1 overflow-y-hidden before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-10 before:dark:invert">
      {/* Messages */}
      <div
        ref={containerRef}
        className="relative flex h-full flex-1 flex-col-reverse items-center gap-1 overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        {/* Scroll to bottom */}
        <Button
          isIconOnly
          className={`fixed z-10 bg-black text-white transition-all dark:bg-white dark:text-black ${showScrollBtn ? "opacity-100" : "opacity-0"}`}
          radius="full"
          onPress={() => {
            containerRef.current?.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          <ArrowDown size={20} />
        </Button>

        {messages
          ?.filter(
            (msg) => !msg.deletedBy?.includes(currentUser?._id as Id<"users">),
          )
          .map((msg, index) => {
            const prevMsg = messages[index + 1];
            const isDifferentSender = prevMsg?.sender !== msg.sender;

            return (
              <div
                key={msg._id}
                className={`w-full ${isDifferentSender ? "pt-4" : "pt-0"}`}
              >
                <Message
                  currentUser={currentUser as Doc<"users">}
                  index={index}
                  msg={msg}
                />

                {/* Edited */}
                {msg.editedBy && (
                  <span
                    className={`flex text-xs ${msg.sender === currentUser?._id ? "justify-end" : "justify-start"}`}
                  >
                    Edited
                  </span>
                )}
              </div>
            );
          })}

        {/* Paginate messages */}
        {status === "CanLoadMore" && (
          <div ref={loadMoreRef}>
            <Spinner color={resolvedTheme === "dark" ? "white" : "primary"} />
          </div>
        )}
      </div>
    </div>
  );
}
