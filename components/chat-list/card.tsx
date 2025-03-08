import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Pin } from "lucide-react";

type ChatCardProps = {
  title: string;
  description?: string;
  imageUrl: string;
  info?: boolean;
  timeSent?: string;
  unreadCount?: number;
  pinned?: boolean;
  onPress?: () => void;
};

export default function ChatCard({
  title,
  description = "...",
  imageUrl,
  info = true,
  timeSent, // TODO: Example: 12:00
  unreadCount, // TODO: Example: 53
  pinned, // TODO: Example: true
  onPress,
}: ChatCardProps) {
  return (
    <Button
      className="h-auto w-full rounded-none border-b border-default-200 p-4 text-start last:border-b-0 dark:border-neutral-800"
      variant="light"
      onPress={onPress}
    >
      <div className="grid w-full grid-cols-[40px_1fr_auto] items-center gap-2">
        {/* Avatar/Image */}
        <Image
          alt="avatar"
          height={40}
          radius="full"
          src={imageUrl}
          width={40}
        />

        {/* Content */}
        <div className="min-w-0">
          {/* Name */}
          <h2 className="text-small font-bold">{title}</h2>

          {/* Text */}
          {description && (
            <p
              className="overflow-hidden text-ellipsis whitespace-nowrap text-small text-default-500"
              title={description}
            >
              {description}
            </p>
          )}
        </div>

        {/* Info */}
        {info && (
          <div className="flex flex-col items-end gap-1">
            {/* Time sent */}
            <span className="text-xs">{timeSent}</span>

            {/* Pinned/Unread Messages */}
            <div className="flex items-center gap-1">
              {pinned && <Pin size={20} />}
              {unreadCount && <Chip size="sm">{unreadCount}</Chip>}
            </div>
          </div>
        )}
      </div>
    </Button>
  );
}
