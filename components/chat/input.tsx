/* eslint-disable jsx-a11y/no-autofocus */

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Paperclip, SendHorizontal } from "lucide-react";

export default function ChatInput({ onPress }: { onPress: () => void }) {
  return (
    <div className={`px-2 py-4`}>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Button
          isIconOnly
          radius="full"
          variant="light"
          onPress={() =>
            addToast({
              title: "Add attachments",
              description: "Upload images and files. This feature is coming soon.",
              color: "warning",
            })
          }
        >
          <Paperclip size={20} />
        </Button>
        <Input autoFocus placeholder="Type a message" />
        <Button isIconOnly radius="full" type="submit" onPress={onPress}>
          <SendHorizontal size={20} />
        </Button>
      </form>
    </div>
  );
}
