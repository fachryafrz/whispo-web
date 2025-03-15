import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { ArrowDown } from "lucide-react";
import {
  PaginatedQueryReference,
  usePaginatedQuery,
  useQuery,
} from "convex/react";
import { Spinner } from "@heroui/spinner";
import { useInView } from "react-intersection-observer";
import { useTheme } from "next-themes";
import dayjs from "dayjs";
import { Chip } from "@heroui/chip";

import Message from "../message";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useSelectedChat } from "@/zustand/selected-chat";
import { groupMessagesByDate } from "@/utils/group-messages-by-date";

const NUM_MESSAGES_TO_LOAD = 50;

export default function ChatMessages() {
  const { resolvedTheme } = useTheme();
  const { selectedChat } = useSelectedChat();
  const { ref: loadMoreRef, inView } = useInView();

  const currentUser = useQuery(api.users.getCurrentUser);

  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.chats.getMessages as PaginatedQueryReference, // NOTE: Potential bug when filtering out deleted messages
    { chatId: selectedChat?.chatId as Id<"chats"> },
    { initialNumItems: NUM_MESSAGES_TO_LOAD },
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState<boolean>(false);

  const groupedMessages = groupMessagesByDate(messages);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollBtn(e.currentTarget.scrollTop < 0);
  };

  useEffect(() => {
    if (inView) loadMore(NUM_MESSAGES_TO_LOAD);
  }, [inView]);

  return (
    <div className="relative flex-1 overflow-y-hidden before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-15 before:dark:invert md:before:opacity-10">
      <div
        ref={containerRef}
        className="relative flex h-full flex-1 flex-col-reverse overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        {/* Grouped messages */}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div
            key={date}
            className="flex w-full flex-col-reverse items-center gap-1"
          >
            {/* Scroll to bottom */}
            <Button
              isIconOnly
              className={`fixed z-10 bg-black text-white transition-all dark:bg-white dark:text-black ${showScrollBtn ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
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

            {/* Messages */}
            {msgs.map((msg, index) => {
              const prevMsg = msgs[index + 1];
              const nextMsg = msgs[index - 1];
              const isDifferentSenderPrev = prevMsg?.senderId !== msg.senderId;
              const isDifferentSenderNext = nextMsg?.senderId !== msg.senderId;

              return (
                <div
                  key={msg._id}
                  className={`w-full ${prevMsg?.senderId} ${isDifferentSenderPrev ? "pt-4" : "pt-0"}`}
                >
                  {/* Message bubble */}
                  <Message
                    currentUser={currentUser as Doc<"users">}
                    index={index}
                    isDifferentSenderNext={isDifferentSenderNext}
                    isDifferentSenderPrev={isDifferentSenderPrev}
                    msg={msg}
                  />

                  {/* Edited */}
                  {msg.isEdited && (
                    <span
                      className={`flex text-xs ${msg.senderId === currentUser?._id ? "justify-end" : "justify-start"}`}
                    >
                      Edited
                    </span>
                  )}
                </div>
              );
            })}

            {/* Message date */}
            <Chip size="sm">{dayjs(date).format("dddd, DD MMMM YYYY")}</Chip>

            {/* Paginate messages */}
            {status === "CanLoadMore" && (
              <div ref={loadMoreRef}>
                <Spinner
                  color={resolvedTheme === "dark" ? "white" : "primary"}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
