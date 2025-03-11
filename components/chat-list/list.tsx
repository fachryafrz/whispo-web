import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { Tooltip } from "@heroui/tooltip";

import { ChatListCard } from "./list-card";

import { useSearchUser } from "@/zustand/search-user";
import { api } from "@/convex/_generated/api";
import { useArchivedChats } from "@/zustand/archived-chats";
import { Id } from "@/convex/_generated/dataModel";

export default function List() {
  const { open: openSearchUser, setOpen: setOpenSearchUser } = useSearchUser();
  const { open: openArchived } = useArchivedChats();

  const currentUser = useQuery(api.users.getCurrentUser);
  const chats = useQuery(api.chats.getChatsByCurrentUser, {
    currentUser: currentUser?._id as Id<"users">,
  });

  return (
    <div
      className={`relative h-full transition-all duration-500 ${openSearchUser || openArchived ? "-translate-x-20" : "translate-x-0"}`}
    >
      {/* Floating action button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Tooltip content="New chat">
          <Button
            isIconOnly
            radius="full"
            size="lg"
            onPress={() => setOpenSearchUser(true)}
          >
            <Plus />
          </Button>
        </Tooltip>
      </div>

      {/* No chat */}
      {(chats?.length === 0 ||
        chats?.every((chat) => !chat.lastMessage || chat.archived)) && (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
          <h2 className="text-lg font-bold">No chats</h2>
          <p className="text-sm">Start a new chat</p>
        </div>
      )}

      {/* List of chats */}
      {chats?.length! > 0 &&
        chats?.some((chat) => chat.lastMessage && !chat.archived) && (
          <ul className={`h-full overflow-y-auto`}>
            {/* Pinned chats */}
            {chats
              ?.filter((chat) => chat.lastMessage && chat.pinned)
              .sort((a, b) => b.lastMessageTime! - a.lastMessageTime!)
              .map((chat) => (
                <li key={chat._id}>
                  <ChatListCard chat={chat} />
                </li>
              ))}

            {/* Chats */}
            {chats
              ?.filter(
                (chat) => chat.lastMessage && !chat.pinned && !chat.archived,
              )
              .sort((a, b) => b.lastMessageTime! - a.lastMessageTime!)
              .map((chat) => (
                <li key={chat._id}>
                  <ChatListCard chat={chat} />
                </li>
              ))}
          </ul>
        )}
    </div>
  );
}
