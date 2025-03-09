import { useMutation, useQuery } from "convex/react";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import {
  EllipsisVertical,
  Pencil,
  Reply,
  SendHorizontal,
  Undo2,
} from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";

import { useChat } from "@/zustand/chat";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useEditMessage } from "@/zustand/edit-message";
import { handleKeyDown } from "@/utils/handle-textarea-key-down";
import { useReplyMessage } from "@/zustand/reply-message";

export default function ChatMessages() {
  const { activeChat } = useChat();

  const currentUser = useQuery(api.users.getCurrentUser);
  const messages = useQuery(api.messages.getMessagesByChatId, {
    chatId: activeChat?._id as Id<"chats">,
  });

  return (
    <div className="relative flex-1 overflow-y-hidden before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-10 before:dark:invert">
      {/* Messages */}
      <div className="relative flex h-full flex-1 flex-col-reverse items-center gap-1 overflow-y-auto p-4">
        {messages?.map((msg, index) => {
          const prevMsg = messages[index + 1];
          const isDifferentSender = prevMsg?.sender !== msg.sender;

          return (
            <div
              key={msg._id}
              className={`w-full ${isDifferentSender ? "pt-4" : "pt-0"}`}
            >
              <Message currentUser={currentUser as Doc<"users">} msg={msg} />

              {/* Edited */}
              {msg.editedBy && (
                <span
                  className={`flex text-xs ${msg.sender === currentUser?._id ? "justify-end" : "justify-start"}`}
                >
                  Edited
                </span>
              )}
            </div>
          );
        })}

        {/* TODO: Paginate messages */}
        <Spinner color="white" />
      </div>
    </div>
  );
}

function Message({
  msg,
  className,
  currentUser,
}: {
  msg: Doc<"messages">;
  className?: string;
  currentUser: Doc<"users">;
}) {
  return (
    <div
      key={msg._id}
      className={`group flex gap-1 ${className} ${
        msg.sender === currentUser?._id ? "justify-end" : "justify-start"
      }`}
    >
      {/* Message */}
      <div
        className={`relative w-fit max-w-xs rounded-md lg:max-w-lg xl:max-w-xl ${
          msg.sender === currentUser?._id
            ? "order-2 bg-default"
            : "order-1 bg-black text-white dark:bg-white dark:text-black"
        }`}
      >
        <div className="space-y-2 p-2">
          {/* Reply to */}
          {msg.replyTo && <ReplyTo msg={msg} />}

          {/* TODO: Media */}

          {/* Text content */}
          <div className="flex gap-2">
            {/* NOTE: Kalau pakai text, gabisa markdown */}
            {/* <p className="max-w-full whitespace-pre-wrap text-sm">
              {msg.content}
            </p> */}

            {/* NOTE: Kalau pakai markdown, gabisa multiple line breaks */}
            <div
              className={`prose text-sm ${
                msg.sender === currentUser?._id
                  ? "prose-a:text-black dark:prose-a:text-white prose-code:dark:text-white text-black marker:text-black dark:text-white dark:marker:text-white"
                  : "prose-a:text-white dark:prose-a:text-black prose-code:dark:text-black text-white marker:text-white dark:text-black dark:marker:text-black"
              }`}
              style={{
                wordBreak: "break-word",
              }}
            >
              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  a: ({ node, ...props }) => (
                    <a {...props} rel="noopener noreferrer" target="_blank">
                      {props.children}
                    </a>
                  ),
                }}
                remarkPlugins={[remarkGfm]}
              >
                {msg.content}
              </ReactMarkdown>
            </div>

            {/* Time placeholder */}
            <span
              className={`pointer-events-none flex grow justify-end text-[10px] opacity-0`}
            >
              {dayjs(msg._creationTime).format("HH:mm")}
            </span>

            {/* Time displayed */}
            <span
              className={`pointer-events-none absolute bottom-2 right-2 mt-1 text-[10px]`}
            >
              {dayjs(msg._creationTime).format("HH:mm")}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className={`flex items-end opacity-0 transition-all group-hover:opacity-100 ${
          msg.sender === currentUser?._id ? "order-1" : "order-2"
        }`}
      >
        <MessageOptions msg={msg} />
      </div>
    </div>
  );
}

function ReplyTo({ msg }: { msg: Doc<"messages"> }) {
  const getMessage = useQuery(api.messages.getMessageById, {
    _id: msg.replyTo as Id<"messages">,
  });
  const getUserOfMessage = useQuery(api.users.getUserById, {
    _id: getMessage?.sender as Id<"users">,
  });

  return (
    <>
      {getMessage && getUserOfMessage && (
        <div className="pointer-events-none space-y-1 rounded-md bg-white p-2 text-xs dark:bg-black">
          {/* Title */}
          <div>
            Reply to <strong>{getUserOfMessage?.username}</strong>
          </div>

          {/* Content */}
          <p
            style={{
              wordBreak: "break-word",
            }}
          >
            {getMessage?.content}
          </p>
        </div>
      )}
    </>
  );
}

function MessageOptions({ msg }: { msg: Doc<"messages"> }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { message, setMessage } = useEditMessage();
  const { replyMessageId, setReplyMessageId, clearReplyTo } = useReplyMessage();

  const formRef = useRef<HTMLFormElement>(null);

  const currentUser = useQuery(api.users.getCurrentUser);

  const editMessage = useMutation(api.messages.editMessage);
  const unsendMessage = useMutation(api.messages.unsendMessage);

  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => setWindowWidth(window.innerWidth);

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {mounted && (
        <>
          <Dropdown
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
              {/* Reply */}
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
                  {/* Edit */}
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

                  {/* Unsend */}
                  <DropdownItem
                    key="unsend"
                    className="text-danger"
                    color="danger"
                    startContent={<Undo2 size={20} />}
                    onPress={() => {
                      unsendMessage({
                        _id: msg._id as Id<"messages">,
                      });
                    }}
                  >
                    Unsend
                  </DropdownItem>
                </>
              ) : null}
            </DropdownMenu>
          </Dropdown>

          {/* Edit message modal */}
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
        </>
      )}
    </>
  );
}
