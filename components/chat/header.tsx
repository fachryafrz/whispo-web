import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { addToast } from "@heroui/toast";
import { Search } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className={`p-4`}>
      <div className="grid grid-cols-[40px_1fr_auto] items-center gap-2">
        {/* Avatar/Image */}
        <Image
          alt="avatar"
          draggable={false}
          height={40}
          radius="full"
          src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          width={40}
        />

        {/* Content */}
        <div className="min-w-0">
          {/* Name */}
          <h2 className="text-small font-bold">Shovi</h2>
          {/* Text */}
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-small text-default-500">
            Private Chat
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-end gap-1">
          <Button
            isIconOnly
            radius="full"
            variant="light"
            onPress={() =>
              addToast({
                title: "Search messages",
                description: "Search through your messages. This feature is coming soon.",
                color: "warning",
              })
            }
          >
            <Search size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
