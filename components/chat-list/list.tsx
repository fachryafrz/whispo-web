import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { Tooltip } from "@heroui/tooltip";
import dayjs from "dayjs";

import ChatCard from "./card";

import { useSearchUser } from "@/zustand/search-user";
import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Chat } from "@/types";

export default function List() {
  const { open, setOpen } = useSearchUser();

  const chats = useQuery(api.chats.getChatsByCurrentUser);

  return (
    <div
      className={`relative h-full transition-all duration-500 ${open ? "-translate-x-20" : "translate-x-0"}`}
    >
      {/* Floating action button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Tooltip content="New chat">
          <Button
            isIconOnly
            radius="full"
            size="lg"
            onPress={() => setOpen(true)}
          >
            <Plus />
          </Button>
        </Tooltip>
      </div>

      {/* No chat */}
      {chats?.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-default-500">
          <h2 className="text-lg font-bold">No chats</h2>
          <p className="text-sm">Start a new conversation</p>
        </div>
      )}

      {/* List of chats */}
      {chats?.length! > 0 && (
        <ul className={`h-full overflow-y-auto`}>
          {chats
            ?.filter((chat) => chat.lastMessage)
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

function ChatListCard({ chat }: { chat: Doc<"chats"> }) {
  const { setActiveChat } = useChat();
  const currentUser = useQuery(api.users.getCurrentUser);

  const interlocutorSelector = chat.participants.find(
    (p) => p !== currentUser?._id,
  );
  const interlocutor = useQuery(api.users.getUserById, {
    _id: interlocutorSelector as Id<"users">,
  });
  const storeChat = useMutation(api.chats.store);

  const handleSelectChat = () => {
    const value: Chat = {
      _id: chat._id,
      type: chat.type as "private" | "group",
      participants: [
        interlocutor?._id as Id<"users">,
        currentUser?._id as Id<"users">,
      ],
    };

    storeChat(value);
    setActiveChat(value);
  };

  return (
    <ChatCard
      description={`${chat.lastMessageSender === currentUser?._id ? "You: " : ""} ${chat.lastMessage}`}
      imageUrl={
        chat.type === "private"
          ? (interlocutor?.avatarUrl ?? "")
          : (chat.imageUrl ?? "")
      }
      timeSent={dayjs(chat.lastMessageTime).format("HH:mm")}
      title={
        chat.type === "private" ? (interlocutor?.name ?? "") : (chat.name ?? "")
      }
      onPress={() => handleSelectChat()}
    />
  );
}
