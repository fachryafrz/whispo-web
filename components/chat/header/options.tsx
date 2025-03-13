import { Button } from "@heroui/button";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function Options() {
  const { activeChat, clearActiveChat } = useChat();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const deleteChat = useMutation(api.chats.deleteChat);

  const handleDelete = () => {
    deleteChat({ chatId: activeChat?._id as Id<"chats"> });
    clearActiveChat();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full outline-none transition-all hover:bg-default/40">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer text-danger hover:!bg-danger hover:!text-white"
            onClick={onOpen}
          >
            <Trash2 size={20} />
            <div>Delete chat</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}
      {/* <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly radius="full" variant="light">
            <EllipsisVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Menu">
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={<Trash2 size={20} />}
            onPress={onOpen}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
      {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}

      <Modal
        backdrop="blur"
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold">Delete chat</h3>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this chat? This action is
                  irreversible.
                </p>
                <p>
                  This will permanently delete the chat for you and the other
                  participant.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={handleDelete}>
                  Yes, delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
