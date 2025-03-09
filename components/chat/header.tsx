import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { addToast } from "@heroui/toast";
import { ArrowLeft, EllipsisVertical, Search, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useEffect, useState } from "react";

import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function ChatHeader() {
  const { activeChat, clearActiveChat } = useChat();

  const currentUser = useQuery(api.users.getCurrentUser);

  const interlocutorSelector = activeChat?.participants.find(
    (p) => p !== currentUser?._id,
  );
  const interlocutor = useQuery(api.users.getUserById, {
    id: interlocutorSelector as Id<"users">,
  });

  return (
    <div className={`p-4`}>
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          className="md:hidden"
          radius="full"
          variant="light"
          onPress={() => clearActiveChat()}
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
          <h2 className="text-small font-bold line-clamp-1">
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
          <Button
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

          <Options />
        </div>
      </div>
    </div>
  );
}

function Options() {
  const { activeChat, clearActiveChat } = useChat();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [mounted, setMounted] = useState(false);

  const deleteChat = useMutation(api.chats.deleteChat);

  const handleDelete = () => {
    deleteChat({ _id: activeChat?._id as Id<"chats"> });
    clearActiveChat();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <>
          <Dropdown placement="bottom-end">
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
          </Dropdown>

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
                    <h3 className="text-2xl font-bold">Delete conversation</h3>
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Are you sure you want to delete this conversation? This
                      action is irreversible.
                    </p>
                    <p>
                      This will permanently delete the conversation for you and
                      the other participant.
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
      )}
    </>
  );
}
