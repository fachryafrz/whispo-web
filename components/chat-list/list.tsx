import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { Tooltip } from "@heroui/tooltip";

import { ChatListCard } from "./list-card";

import { useSearchUser } from "@/zustand/search-user";
import { api } from "@/convex/_generated/api";
import { useArchivedChats } from "@/zustand/archived-chats";

export default function List() {
  const { open: openSearchUser, setOpen: setOpenSearchUser } = useSearchUser();
  const { open: openArchived } = useArchivedChats();

  // Convex
  const pinnedChats = useQuery(api.chats.pinnedChats);
  const chats = useQuery(api.chats.getChats);

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

      {/* List of chats */}
      <ul className={`h-full overflow-y-auto`}>
        {/* No chats */}
        {((chats?.length === 0 && pinnedChats?.length === 0) ||
          (chats?.every((chat) => !chat?.lastMessage) &&
            pinnedChats?.every((chat) => !chat?.lastMessage))) && (
          <li className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
            <h2 className="text-lg font-bold">No chats</h2>
            <p className="text-sm">Start a new chat</p>
          </li>
        )}

        {/* Pinned chats */}
        {pinnedChats?.length! > 0 &&
          pinnedChats!
            .filter((chat) => chat?.lastMessage)
            .sort((a, b) => b?.lastMessageTime! - a?.lastMessageTime!)
            .map((chat) => (
              <li key={chat?._id}>
                <ChatListCard pinned chat={chat!} />
              </li>
            ))}

        {/* Chats */}
        {chats
          ?.filter((chat) => chat?.lastMessage)
          .sort((a, b) => b?.lastMessageTime! - a?.lastMessageTime!)
          .map((chat) => (
            <li key={chat?._id}>
              <ChatListCard chat={chat!} />
            </li>
          ))}
      </ul>
    </div>
  );
}
