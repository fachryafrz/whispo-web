import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { Pin, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

type ChatCardProps = {
  title: string;
  description?: string;
  imageUrl: string;
  info?: boolean;
  timeSent?: string;
  unreadCount?: number;
  pinned?: boolean;
  hasMedia?: boolean;
  onPress: () => void;
};

export default function ChatCard({
  title,
  description = "...",
  imageUrl,
  info = true,
  timeSent,
  unreadCount,
  pinned,
  hasMedia,
  onPress,
}: ChatCardProps) {
  const router = useRouter();

  return (
    <Button
      className="h-auto w-full rounded-none border-b border-default-200 p-4 text-start last:border-b-0 dark:border-neutral-800"
      variant="light"
      onPress={() => {
        onPress();
        router.push("/chat");
      }}
    >
      <div className="grid w-full grid-cols-[40px_1fr_auto] items-center gap-2">
        {/* Avatar/Image */}
        <div>
          {imageUrl && (
            <Image
              alt="avatar"
              height={40}
              radius="full"
              src={imageUrl}
              width={40}
            />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0">
          {/* Name */}
          <h2 className="text-small font-bold">{title}</h2>

          {/* Text */}
          {description && (
            <div
              className="flex h-5 items-center gap-1 overflow-hidden"
              title={description}
            >
              {hasMedia && (
                <ImageIcon
                  className={
                    unreadCount ? "font-bold text-white" : "text-default-500"
                  }
                  size={16}
                />
              )}

              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  p: ({ node, ...props }) => (
                    <p
                      className={`overflow-hidden text-ellipsis whitespace-nowrap text-small ${unreadCount ? "font-bold text-white" : "text-default-500"}`}
                      {...props}
                    />
                  ),
                }}
              >
                {description}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Info */}
        {info && (
          <div className="flex h-full flex-col items-end gap-1">
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
