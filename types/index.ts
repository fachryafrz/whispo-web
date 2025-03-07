import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Chat = {
  type: string;
  participants: string[];
  name: string;
  imageUrl: string;
  lastMessage?: string;
  lastMessageSender?: string;
  lastMessageTime?: number;
  pinned?: boolean;
  unreadCount?: number;
  seenBy?: string[];
};
