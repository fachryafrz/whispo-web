import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";

import ChatCard from "./card";

import { useSearchUser } from "@/zustand/search-user";
import { api } from "@/convex/_generated/api";
import { useChat } from "@/zustand/chat";

export default function SearchUser() {
  const { open, setOpen, query, setQuery } = useSearchUser();
  const { setActiveChat } = useChat();

  const users = useQuery(api.users.searchByUsername, {
    usernameQuery: query,
  });

  return (
    <div
      className={`absolute inset-0 bg-white transition-all duration-500 dark:bg-black ${open ? "translate-x-0" : "translate-x-full"}`}
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
          placeholder="Search"
          radius="full"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Results */}
      <ul>
        {users?.map((user) => (
          <li key={user.username}>
            <ChatCard
              description={user.name}
              imageUrl={user.avatarUrl}
              info={false}
              title={user.username}
              onPress={() => {
                setActiveChat({
                  type: "private",
                  participants: [user.username],
                  name: user.name,
                  imageUrl: user.avatarUrl,
                });
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
