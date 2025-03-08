import { SVGProps } from "react";

import { Id } from "@/convex/_generated/dataModel";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Chat = {
  type: "private" | "group";
  participants: Id<"users">[];
  name?: string; // For group chats
  description?: string; // For group chats
  imageUrl?: string; // For group chats
  lastMessage?: string;
  lastMessageSender?: string;
  lastMessageTime?: number;
  pinned?: boolean;
  unreadCount?: number;
  seenBy?: Id<"users">[];
};

export type Message = {
  chat: Id<"chats">;
  sender: Id<"users">;
  content: string;
  mediaUrl?: string;
  readBy?: Id<"users">[];
};

export type Friendship = {
  user1: Id<"users">;
  user2: Id<"users">;
  status: "pending" | "accepted" | "rejected";
};
