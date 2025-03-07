import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { useClerk } from "@clerk/nextjs";

import ChatCard from "./card";

import { useSearchUser } from "@/zustand/search-user";
import { api } from "@/convex/_generated/api";
import { useChat } from "@/zustand/chat";

export default function SearchUser() {
  const { open, setOpen, query, setQuery } = useSearchUser();
  const { setActiveChat } = useChat();

  const { user: currentUser } = useClerk();

  const users = useQuery(api.users.searchByUsername, {
    usernameQuery: query,
  });

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
                onPress={() => {
                  setActiveChat({
                    type: "private",
                    participants: [
                      user.username,
                      currentUser?.username as string,
                    ],
                    name: user.name,
                    description: user.username,
                    imageUrl: user.avatarUrl,
                  });
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
