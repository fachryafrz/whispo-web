import { usePaginatedQuery, useQuery } from "convex/react";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@heroui/spinner";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

import { ChatListCard } from "./list-card";

import { api } from "@/convex/_generated/api";
import { useChat } from "@/zustand/chat";
import { useArchivedChats } from "@/zustand/archived-chats";

const NUM_CHATS_TO_LOAD = 20;

export default function ArchivedChats() {
  // Zustand
  const { open, setOpen } = useArchivedChats();
  const { activeChat, setActiveChat } = useChat();
  const { ref: loadMoreRef, inView } = useInView();

  // Convex
  const currentUser = useQuery(api.users.getCurrentUser);
  const {
    results: allChats,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.chats.getAllChats,
    {},
    { initialNumItems: NUM_CHATS_TO_LOAD },
  );

  const userChats = allChats.filter((chat) =>
    chat.participants.some((participant) => participant === currentUser?._id),
  );
  const chats = userChats.filter((chat) => chat.archived);

  const archivedChats = useQuery(api.chats.archivedChats);

  useEffect(() => {
    if (inView) loadMore(NUM_CHATS_TO_LOAD);
  }, [inView]);

  return (
    <div
      className={`absolute inset-0 flex flex-col bg-white transition-all duration-500 dark:bg-black ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Title */}
      <div className="relative flex items-center justify-center p-4">
        <Button
          isIconOnly
          className="absolute left-4"
          radius="full"
          variant="light"
          onPress={() => setOpen(false)}
        >
          <ArrowLeft />
        </Button>

        <h2 className="flex h-10 items-center text-center text-xl font-bold">
          Archived chats
        </h2>
      </div>

      {/* No results */}
      {/* {chats?.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
          <p className="text-sm">No archived chats</p>
        </div>
      )} */}

      {/* Results */}
      <ul>
        {/* No results */}
        {archivedChats?.length === 0 && (
          <li className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
            <p className="text-sm">No archived chats</p>
          </li>
        )}

        {/* Chats */}
        {archivedChats
          ?.sort((a, b) => b!.lastMessageTime! - a!.lastMessageTime!)
          .map((chat) => (
            <li key={chat!._id}>
              <ChatListCard archived chat={chat!} />
            </li>
          ))}

        {/* Load more */}
        {status === "CanLoadMore" && (
          <li ref={loadMoreRef} className="flex w-full justify-center py-2">
            <Spinner />
          </li>
        )}
      </ul>
    </div>
  );
}
