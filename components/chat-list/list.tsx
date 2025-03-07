import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Pin, Plus } from "lucide-react";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";

export default function List() {
  return (
    <div className="relative h-full">
      {/* Floating action button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Button
          isIconOnly
          radius="full"
          size="lg"
          onPress={() => {
            addToast({
              title: "New chat",
              description: "Start a new chat. This feature is coming soon.",
              color: "warning",
            });
          }}
        >
          <Plus />
        </Button>
      </div>

      {/* List of chats */}
      <ul className={`h-full overflow-y-auto`}>
        <li>
          <Item />
        </li>
      </ul>
    </div>
  );
}

function Item() {
  return (
    <Button
      className="h-auto w-full rounded-none border-b border-default-200 p-4 text-start dark:border-neutral-800"
      variant="light"
    >
      <div className="grid grid-cols-[40px_1fr_auto] items-center gap-2">
        {/* Avatar/Image */}
        <Image
          alt="avatar"
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
          <p
            className="overflow-hidden text-ellipsis whitespace-nowrap text-small text-default-500"
            title="Lorem ipsum dolor sit amet fsdasda sda sd"
          >
            Lorem ipsum dolor sit amet fsdasda sda sd
          </p>
        </div>

        {/* Info */}
        <div className="flex flex-col items-end gap-1">
          {/* Time sent */}
          <span className="text-xs">12:00</span>

          {/* Pinned/Unread Messages */}
          <div className="flex items-center gap-1">
            <Pin size={20} />
            <Chip size="sm">53</Chip>
          </div>
        </div>
      </div>
    </Button>
  );
}
