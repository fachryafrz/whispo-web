import { useQuery } from "convex/react";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";

import { ChatListCard } from "./list-card";

import { api } from "@/convex/_generated/api";
import { useArchivedChats } from "@/zustand/archived-chats";

export default function ArchivedChats() {
  // Zustand
  const { open, setOpen } = useArchivedChats();

  // Convex
  const archivedChats = useQuery(api.chats.archivedChats);

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
      </ul>
    </div>
  );
}
