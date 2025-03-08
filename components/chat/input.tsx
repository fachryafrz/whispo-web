import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Paperclip, SendHorizontal } from "lucide-react";

export default function ChatInput({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className={`p-2`}>
      <form className="flex gap-2" onSubmit={onSubmit}>
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onPress={() =>
            addToast({
              title: "Add attachments",
              description:
                "Upload images and files. This feature is coming soon.",
              color: "warning",
            })
          }
        >
          <Paperclip size={20} />
        </Button>
        <Input placeholder="Type a message" radius="full" />
        <Button isIconOnly radius="full" type="submit">
          <SendHorizontal size={20} />
        </Button>
      </form>
    </div>
  );
}
