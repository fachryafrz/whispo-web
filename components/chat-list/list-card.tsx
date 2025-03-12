import { Archive, Pin } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";

import ChatCard from "./card";

import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

export function ChatListCard({ chat }: { chat: Doc<"chats"> }) {
  const { setActiveChat } = useChat();

  // Convex
  const currentUser = useQuery(api.users.getCurrentUser);
  const chatById = useQuery(api.chats.getChatById, { _id: chat._id });
  const storeChat = useMutation(api.chats.store);
  const pinChat = useMutation(api.chats.pinChat);
  const archiveChat = useMutation(api.chats.archiveChat);
  const getUnread = useQuery(api.unread_messages.get, {
    chat: chat._id as Id<"chats">,
  });

  const interlocutor = chatById?.participants.find(
    (p) => p?._id !== currentUser?._id,
  );
  const handleSelectChat = () => {
    const value = {
      type: chat.type,
      participants: [
        interlocutor?._id as Id<"users">,
        currentUser?._id as Id<"users">,
      ],
    };

    storeChat(value);
    setActiveChat({ _id: chat._id, ...value } as Doc<"chats">);
  };

  return (
    <>
      {interlocutor && (
        <ContextMenu>
          <ContextMenuTrigger>
            <ChatCard
              description={`${chat.lastMessageSender === currentUser?._id ? "You: " : ""} ${chat.lastMessage}`}
              imageUrl={
                chat.type === "private"
                  ? (interlocutor?.avatarUrl ?? "")
                  : (chat.imageUrl ?? "")
              }
              pinned={chat.pinned}
              timeSent={dayjs(chat.lastMessageTime).format("HH:mm")}
              title={
                chat.type === "private"
                  ? (interlocutor?.name ?? "")
                  : (chat.name ?? "")
              }
              unreadCount={getUnread?.count}
              onPress={() => handleSelectChat()}
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            {/* Pin chat */}
            {!chat.archived && (
              <ContextMenuItem
                className="cursor-pointer space-x-2"
                onClick={() => {
                  pinChat({
                    _id: chat._id,
                    pinned: !chat.pinned,
                  });
                }}
              >
                <Pin size={20} />
                <div>Pin</div>
              </ContextMenuItem>
            )}

            {/* Archive chat */}
            <ContextMenuItem
              className="cursor-pointer space-x-2"
              onClick={() => {
                archiveChat({
                  _id: chat._id,
                  archived: !chat.archived,
                });

                if (chat.pinned) {
                  pinChat({
                    _id: chat._id,
                    pinned: false,
                  });
                }
              }}
            >
              <Archive size={20} />
              <div>{chat.archived ? "Remove from archive" : "Archive"}</div>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </>
  );
}
