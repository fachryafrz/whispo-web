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

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSelectedChat } from "@/zustand/selected-chat";

export function ChatListCard({
  chat,
  pinned,
  archived,
}: {
  chat: Doc<"chats">;
  pinned?: boolean;
  archived?: boolean;
}) {
  const { setSelectedChat } = useSelectedChat();

  // Convex
  const currentUser = useQuery(api.users.getCurrentUser);
  const getChatParticipants = useQuery(api.chats.getChatParticipants, {
    chatId: chat._id,
  });
  const pinChat = useMutation(api.chats.pinChat);
  const archiveChat = useMutation(api.chats.archiveChat);
  const unreadMessages = useQuery(api.chats.getUnreadMessages, {
    chatId: chat._id as Id<"chats">,
  });
  const deleteUnreadMessage = useMutation(api.chats.deleteUnreadMessage);

  const interlocutor = getChatParticipants?.find(
    (p) => p?._id !== currentUser?._id,
  );

  const handleSelectChat = () => {
    setSelectedChat({
      chatId: chat?._id as Id<"chats">,
      type: "private",
      name: interlocutor?.name,
      description: interlocutor?.username,
      imageUrl: interlocutor?.avatarUrl,
    });

    deleteUnreadMessage({
      chatId: chat._id as Id<"chats">,
      userId: currentUser?._id as Id<"users">,
    });
  };

  return (
    <>
      {interlocutor && (
        <ContextMenu>
          <ContextMenuTrigger>
            <ChatCard
              description={`${chat.lastMessageSender === currentUser?._id ? "You: " : ""} ${chat.lastMessage}`}
              hasMedia={chat.hasMedia}
              imageUrl={
                chat.type === "private"
                  ? (interlocutor?.avatarUrl ?? "")
                  : (chat.imageUrl ?? "")
              }
              pinned={pinned}
              timeSent={dayjs(chat.lastMessageTime).format("HH:mm")}
              title={
                chat.type === "private"
                  ? (interlocutor?.name ?? "")
                  : (chat.name ?? "")
              }
              unreadCount={unreadMessages?.count}
              onPress={handleSelectChat}
            />
          </ContextMenuTrigger>
          <ContextMenuContent>
            {/* Pin chat */}
            {!archived && (
              <ContextMenuItem
                className="cursor-pointer space-x-2"
                onClick={() => {
                  pinChat({
                    chatId: chat._id,
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
                  chatId: chat._id,
                });
              }}
            >
              <Archive size={20} />
              <div>{archived ? "Remove from archive" : "Archive"}</div>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
    </>
  );
}
