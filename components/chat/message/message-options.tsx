import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { EllipsisVertical, Pencil, Reply, Trash2, Undo2 } from "lucide-react";
import { useDisclosure } from "@heroui/modal";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useEditMessage } from "@/zustand/edit-message";
import { useReplyMessage } from "@/zustand/reply-message";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditMessageModal from "@/components/modal/edit-message";

export default function MessageOptions({
  msg,
  index,
}: {
  msg: Doc<"chat_messages">;
  index: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { message, setMessage } = useEditMessage();
  const { setReplyMessageId } = useReplyMessage();

  const currentUser = useQuery(api.users.getCurrentUser);

  const unsendMessage = useMutation(api.chats.unsendMessage);
  const readMessage = useMutation(api.chats.readMessage);
  const deleteMessage = useMutation(api.chats.deleteMessage);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="sticky -bottom-4 flex h-10 w-10 items-center justify-center rounded-full outline-none transition-all hover:bg-default/40">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={`center`}>
          {/* Reply */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setReplyMessageId(msg._id);

              readMessage({
                userId: currentUser?._id as Id<"users">,
                chatId: msg.chatId as Id<"chats">,
              });
            }}
          >
            <Reply size={20} />
            <div>Reply</div>
          </DropdownMenuItem>

          {/* Options for message by current user */}
          {msg.senderId === currentUser?._id ? (
            <>
              {/* If message is not unsent */}
              {!msg.isUnsent && (
                <>
                  {/* Edit */}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      setMessage(msg.text);
                      onOpen();
                    }}
                  >
                    <Pencil size={20} />
                    <div>Edit</div>
                  </DropdownMenuItem>

                  {/* Unsend */}
                  <DropdownMenuItem
                    className="cursor-pointer text-danger hover:!bg-danger hover:!text-white"
                    onClick={() => {
                      unsendMessage({
                        messageId: msg._id as Id<"chat_messages">,
                        chatId: msg.chatId as Id<"chats">,
                        index: index,
                      });
                    }}
                  >
                    <Undo2 size={20} />
                    <div>Unsend</div>
                  </DropdownMenuItem>
                </>
              )}
            </>
          ) : null}

          {/* If message was unsent */}
          {msg.isUnsent && (
            <>
              {/* Delete */}
              <DropdownMenuItem
                className="cursor-pointer text-danger hover:!bg-danger hover:!text-white"
                onClick={() => {
                  deleteMessage({
                    chatId: msg.chatId as Id<"chats">,
                    messageId: msg._id as Id<"chat_messages">,
                  });
                }}
              >
                <Trash2 size={20} />
                <div>Delete for me</div>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}
      {/* <Dropdown
          placement={
            windowWidth >= 1024
              ? msg.sender === currentUser?._id
                ? "left-start"
                : "right-start"
              : "bottom"
          }
        >
          <DropdownTrigger>
            <Button
              isIconOnly
              className="sticky bottom-0"
              radius="full"
              variant="light"
            >
              <EllipsisVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Menu">
            // Reply
            <DropdownItem
              key="reply"
              color="default"
              startContent={<Reply size={20} />}
              onPress={() => {
                setReplyMessageId(msg._id);
              }}
            >
              Reply
            </DropdownItem>
  
            {msg.sender === currentUser?._id ? (
              <>
                // Edit
                <DropdownItem
                  key="edit"
                  color="default"
                  startContent={<Pencil size={20} />}
                  onPress={() => {
                    setMessage(msg.content);
                    onOpen();
                  }}
                >
                  Edit
                </DropdownItem>
  
                // Unsend
                {msg._creationTime + 3600000 > Date.now() && (
                  <>
                    {!msg.unsentBy && (
                      <DropdownItem
                        key="unsend"
                        color="default"
                        startContent={<Undo2 size={20} />}
                        onPress={() => {
                          unsendMessage({
                            _id: msg._id as Id<"messages">,
                            unsentBy: currentUser?._id as Id<"users">,
                            unsentAt: Date.now(),
                          });
  
                          if (index === 0) {
                            updateChat({
                              _id: activeChat?._id as Id<"chats">,
                              lastMessage: "_message was unsent_",
                              lastMessageSender: currentUser?._id as Id<"users">,
                              lastMessageTime: Date.now(),
                            });
                          }
                        }}
                      >
                        Unsend
                      </DropdownItem>
                    )}
                  </>
                )}
              </>
            ) : null}
  
            // Delete
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<Trash2 size={20} />}
              onPress={() => {
                deleteMessage({
                  _id: msg._id as Id<"messages">,
                  deletedBy: msg.deletedBy
                    ? [...msg.deletedBy, currentUser?._id as Id<"users">]
                    : [currentUser?._id as Id<"users">],
                  deletedAt: msg.deletedAt
                    ? [...msg.deletedAt, Date.now()]
                    : [Date.now()],
                });
              }}
            >
              Delete for me
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
      {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}

      {/* Edit message modal */}
      <EditMessageModal
        isOpen={isOpen}
        message={message}
        msg={msg}
        setMessage={setMessage}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
