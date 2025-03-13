import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Tooltip } from "@heroui/tooltip";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@heroui/spinner";
import { useEffect } from "react";

import { ChatListCard } from "./list-card";

import { useSearchUser } from "@/zustand/search-user";
import { api } from "@/convex/_generated/api";
import { useArchivedChats } from "@/zustand/archived-chats";

const NUM_CHATS_TO_LOAD = 20;

export default function List() {
  const { open: openSearchUser, setOpen: setOpenSearchUser } = useSearchUser();
  const { open: openArchived } = useArchivedChats();
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

  const pinnedChats = useQuery(api.chats.pinnedChats);
  const pinnedChatsIds = pinnedChats?.map((chat) => chat?._id);
  const archivedChats = useQuery(api.chats.archivedChats);
  const archivedChatsIds = archivedChats?.map((chat) => chat?._id);

  const userChats = allChats.filter((chat) =>
    chat.participants.some((participant) => participant === currentUser?._id),
  );
  const chats = userChats.filter(
    (chat) =>
      !pinnedChatsIds?.includes(chat._id) &&
      !archivedChatsIds?.includes(chat._id),
  );

  useEffect(() => {
    if (inView) loadMore(NUM_CHATS_TO_LOAD);
  }, [inView]);

  return (
    <div
      className={`relative h-full transition-all duration-500 ${openSearchUser || openArchived ? "-translate-x-20" : "translate-x-0"}`}
    >
      {/* Floating action button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Tooltip content="New chat">
          <Button
            isIconOnly
            className="h-14 w-14"
            radius="full"
            size="lg"
            onPress={() => setOpenSearchUser(true)}
          >
            <Plus />
          </Button>
        </Tooltip>
      </div>

      {/* No chat */}
      {/* {(chats?.length === 0 ||
        pinnedChats?.length === 0 ||
        chats?.every((chat) => !chat.lastMessage)) && (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
          <h2 className="text-lg font-bold">No chats</h2>
          <p className="text-sm">Start a new chat</p>
        </div>
      )} */}

      {/* List of chats */}
      {/* {chats?.length! > 0 &&
        chats?.some((chat) => chat.lastMessage) && ( */}
      <ul className={`h-full overflow-y-auto`}>
        {/* No chats */}
        {((pinnedChats?.length === 0 && chats.length === 0) ||
          chats?.some((chat) => !chat.lastMessage)) && (
          <li className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
            <h2 className="text-lg font-bold">No chats</h2>
            <p className="text-sm">Start a new chat</p>
          </li>
        )}

        {/* Pinned chats */}
        {pinnedChats?.length! > 0 &&
          pinnedChats!
            .filter((chat) => chat!.lastMessage)
            .sort((a, b) => b!.lastMessageTime! - a!.lastMessageTime!)
            .map((chat) => (
              <li key={chat!._id}>
                <ChatListCard pinned chat={chat!} />
              </li>
            ))}

        {/* Chats */}
        {chats
          ?.filter((chat) => chat.lastMessage)
          .sort((a, b) => b.lastMessageTime! - a.lastMessageTime!)
          .map((chat) => (
            <li key={chat._id}>
              <ChatListCard chat={chat} />
            </li>
          ))}

        {/* Load more */}
        {status === "CanLoadMore" && (
          <li ref={loadMoreRef} className="flex w-full justify-center py-2">
            <Spinner />
          </li>
        )}
      </ul>
      {/* )} */}
    </div>
  );
}
