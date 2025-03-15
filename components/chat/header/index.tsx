import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Image } from "@heroui/image";

import Options from "./options";

import { useSelectedChat } from "@/zustand/selected-chat";

export default function ChatHeader() {
  const router = useRouter();

  const { selectedChat, clearSelectedChat, showChatRoom, setShowChatRoom } =
    useSelectedChat();

  return (
    <div className={`p-4`}>
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          className="md:hidden"
          radius="full"
          variant="light"
          onPress={() => {
            setShowChatRoom(false);

            setTimeout(() => {
              clearSelectedChat();
              router.back();
            }, 500);
          }}
        >
          <ArrowLeft />
        </Button>

        {/* Avatar/Image */}
        <Image
          alt="avatar"
          draggable={false}
          height={40}
          radius="full"
          src={selectedChat?.imageUrl}
          width={40}
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <h2 className="line-clamp-1 text-small font-bold">
            {selectedChat?.name}
          </h2>

          {/* Text */}
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-small text-default-500">
            {selectedChat?.description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-end gap-1">
          {/* Search messages */}
          <Button
            disableRipple
            isIconOnly
            radius="full"
            variant="light"
            onPress={() =>
              addToast({
                title: "Search messages",
                description:
                  "Search through your messages. This feature is coming soon.",
                color: "warning",
              })
            }
          >
            <Search size={20} />
          </Button>

          {/* Other options */}
          <Options />
        </div>
      </div>
    </div>
  );
}
