import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery } from "convex/react";

import ChatCard from "./card";

import { useSearchUser } from "@/zustand/search-user";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSelectedChat } from "@/zustand/selected-chat";

export default function SearchUser() {
  // Zustand
  const { open, setOpen, query, setQuery } = useSearchUser();
  const { selectedChat, setSelectedChat } = useSelectedChat();

  // Convex
  const users = useQuery(api.users.searchByUsername, {
    usernameQuery: query,
  });
  const selectOrStartConversation = useMutation(
    api.chats.selectOrStartConversation,
  );

  // Functions
  const handleSelectUser = async (user: Doc<"users">) => {
    const chat = await selectOrStartConversation({
      type: "private",
      targetId: user._id,
    });

    setSelectedChat({
      chatId: chat?._id as Id<"chats">,
      type: "private",
      name: user.name,
      description: user.username,
      imageUrl: user.avatarUrl,
    });
  };

  return (
    <div
      className={`absolute inset-0 flex flex-col bg-white transition-all duration-500 dark:bg-black ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Search */}
      <div className="flex items-center gap-2 p-4">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onPress={() => setOpen(false)}
        >
          <ArrowLeft />
        </Button>

        <Input
          isClearable
          placeholder="Search"
          radius="full"
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
        />
      </div>

      {/* Initial message */}
      {users?.length === 0 && !query && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
          <p className="text-sm">Search by username</p>
        </div>
      )}

      {/* No results */}
      {users?.length === 0 && query && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
          <p className="text-sm">No user found</p>
        </div>
      )}

      {/* Results */}
      {users?.length! > 0 && (
        <ul>
          {users?.map((user) => (
            <li key={user.username}>
              <ChatCard
                description={user.username}
                imageUrl={user.avatarUrl}
                info={false}
                title={user.name}
                onPress={() => handleSelectUser(user)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
