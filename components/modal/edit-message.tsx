import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { SendHorizontal } from "lucide-react";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { useRef } from "react";
import { useMutation, useQuery } from "convex/react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { handleKeyDown } from "@/utils/handle-textarea-key-down";
import { api } from "@/convex/_generated/api";

export default function EditMessageModal({
  msg,
  message,
  setMessage,
  isOpen,
  onOpenChange,
}: {
  msg: Doc<"messages">;
  message: string | null;
  setMessage: (message: string) => void;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const currentUser = useQuery(api.users.getCurrentUser);
  const editMessage = useMutation(api.messages.editMessage);

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-2xl font-bold">Edit message</h3>
            </ModalHeader>
            <ModalBody>
              <form
                ref={formRef}
                className="flex items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();

                  editMessage({
                    _id: msg._id as Id<"messages">,
                    content: message as string,
                    editedBy: currentUser?._id as Id<"users">,
                  });

                  onClose();
                }}
              >
                <Textarea
                  minRows={1}
                  placeholder="Type a message"
                  radius="full"
                  value={message || ""}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e as React.KeyboardEvent<HTMLTextAreaElement>,
                      formRef,
                    )
                  }
                />

                <Button
                  isIconOnly
                  className="bg-black text-white dark:bg-white dark:text-black"
                  radius="full"
                  type="submit"
                >
                  <SendHorizontal size={20} />
                </Button>
              </form>
            </ModalBody>
            <ModalFooter />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
