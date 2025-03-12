import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { addToast } from "@heroui/toast";
import { ArrowLeft, Search } from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

import Options from "./options";

import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function ChatHeader() {
  const router = useRouter();

  const { activeChat, clearActiveChat } = useChat();

  const currentUser = useQuery(api.users.getCurrentUser);
  const chatById = useQuery(api.chats.getChatById, {
    _id: activeChat?._id as Id<"chats">,
  });

  const interlocutor = chatById?.participants.find(
    (p) => p?._id !== currentUser?._id,
  );

  return (
    <div className={`p-4`}>
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          className="md:hidden"
          radius="full"
          variant="light"
          onPress={() => {
            clearActiveChat();
            router.back();
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
          src={
            activeChat?.type === "private"
              ? interlocutor?.avatarUrl
              : activeChat?.imageUrl
          }
          width={40}
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <h2 className="line-clamp-1 text-small font-bold">
            {activeChat?.type === "private"
              ? interlocutor?.name
              : activeChat?.name}
          </h2>

          {/* Text */}
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-small text-default-500">
            {activeChat?.type === "private"
              ? interlocutor?.username
              : activeChat?.description}
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
