import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { useEffect, useRef, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import {
  ArrowDown,
  EllipsisVertical,
  Pencil,
  Reply,
  SendHorizontal,
  Trash2,
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
import { useInView } from "react-intersection-observer";

import { useChat } from "@/zustand/chat";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useEditMessage } from "@/zustand/edit-message";
import { handleKeyDown } from "@/utils/handle-textarea-key-down";
import { useReplyMessage } from "@/zustand/reply-message";

const NUM_MESSAGES_TO_LOAD = 50;

export default function ChatMessages() {
  const { activeChat } = useChat();
  const { ref: loadMoreRef, inView, entry } = useInView();

  const currentUser = useQuery(api.users.getCurrentUser);

  const {
    results: messages,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.messages.getMessagesByChatId,
    { chatId: activeChat?._id as Id<"chats"> },
    { initialNumItems: NUM_MESSAGES_TO_LOAD },
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState<boolean>(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollBtn(e.currentTarget.scrollTop < 0);
  };

  useEffect(() => {
    if (inView) {
      loadMore(NUM_MESSAGES_TO_LOAD);
    }
  }, [inView]);

  return (
    <div className="relative flex-1 overflow-y-hidden before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-10 before:dark:invert">
      {/* Messages */}
      <div
        ref={containerRef}
        className="relative flex h-full flex-1 flex-col-reverse items-center gap-1 overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        {/* TODO: Scroll to bottom */}
        <Button
          isIconOnly
          className={`fixed z-10 bg-black text-white transition-all dark:bg-white dark:text-black ${showScrollBtn ? "opacity-100" : "opacity-0"}`}
          radius="full"
          onPress={() => {
            containerRef.current?.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          <ArrowDown size={20} />
        </Button>

        {messages
          ?.filter(
            (msg) => !msg.deletedBy?.includes(currentUser?._id as Id<"users">),
          )
          .map((msg, index) => {
            const prevMsg = messages[index + 1];
            const isDifferentSender = prevMsg?.sender !== msg.sender;

            return (
              <div
                key={msg._id}
                className={`w-full ${isDifferentSender ? "pt-4" : "pt-0"}`}
              >
                <Message
                  currentUser={currentUser as Doc<"users">}
                  index={index}
                  msg={msg}
                />

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
        {status === "CanLoadMore" && (
          <div ref={loadMoreRef}>
            <Spinner color="white" />
          </div>
        )}
      </div>
    </div>
  );
}

function Message({
  msg,
  currentUser,
  index,
}: {
  msg: Doc<"messages">;
  currentUser: Doc<"users">;
  index: number;
}) {
  return (
    <div
      key={msg._id}
      className={`group flex gap-1 ${
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
                  ? "text-black marker:text-black dark:text-white dark:marker:text-white"
                  : "text-white marker:text-white dark:text-black dark:marker:text-black"
              }`}
              style={{
                wordBreak: "break-word",
              }}
            >
              <ReactMarkdown
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className={`${
                        msg.sender === currentUser?._id
                          ? "text-black dark:text-white"
                          : "text-white dark:text-black"
                      }`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {props.children}
                    </a>
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      {...props}
                      className={`${
                        msg.sender === currentUser?._id
                          ? "text-black dark:text-white"
                          : "text-white dark:text-black"
                      }`}
                    >
                      {props.children}
                    </blockquote>
                  ),
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  code: ({ node, ...props }) => (
                    <code {...props} className={`text-white`}>
                      {props.children}
                    </code>
                  ),
                }}
                remarkPlugins={[remarkGfm, remarkBreaks]}
              >
                {msg.unsentBy ? `_message was unsent_` : msg.content}
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
        className={`pointer-events-none flex items-end opacity-0 transition-all group-hover:pointer-events-auto group-hover:opacity-100 ${
          msg.sender === currentUser?._id ? "order-1" : "order-2"
        }`}
      >
        <MessageOptions index={index} msg={msg} />
      </div>
    </div>
  );
}

// TODO: Condition replying to deleted message
function ReplyTo({ msg }: { msg: Doc<"messages"> }) {
  const getMessage = useQuery(api.messages.getMessageById, {
    _id: msg.replyTo as Id<"messages">,
  });

  return (
    <>
      {getMessage ? (
        <div className="pointer-events-none space-y-1 rounded-md bg-white p-2 text-xs text-black dark:bg-black dark:text-white">
          {/* Title */}
          <div>
            Reply to <strong>{getMessage?.sender?.username}</strong>
          </div>

          {/* Content */}
          <div
            className={`prose max-h-20 overflow-hidden text-xs text-black marker:text-black dark:text-white dark:marker:text-white`}
          >
            <ReactMarkdown
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                blockquote: ({ node, ...props }) => (
                  <blockquote {...props} className={`dark:text-white`}>
                    {props.children}
                  </blockquote>
                ),
              }}
            >
              {getMessage.unsentBy
                ? `_message was unsent_`
                : getMessage?.content}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="h-[52px] rounded-md bg-white p-2 text-xs dark:bg-black" />
      )}
    </>
  );
}

function MessageOptions({
  msg,
  index,
}: {
  msg: Doc<"messages">;
  index: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { activeChat } = useChat();
  const { message, setMessage } = useEditMessage();
  const { setReplyMessageId } = useReplyMessage();

  const formRef = useRef<HTMLFormElement>(null);

  const currentUser = useQuery(api.users.getCurrentUser);

  const updateChat = useMutation(api.chats.updateChatById);
  const editMessage = useMutation(api.messages.editMessage);
  const unsendMessage = useMutation(api.messages.unsendMessage);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const [windowWidth, setWindowWidth] = useState(0);
  const [mounted, setMounted] = useState<boolean>(false);

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
                                lastMessageSender:
                                  currentUser?._id as Id<"users">,
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

              {/* Delete */}
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

                  // TODO: update last message to previous message
                  // if (index === 0) {
                  //   updateChat({
                  //     _id: activeChat?._id as Id<"chats">,
                  //     lastMessage: "_message was unsent_",
                  //     lastMessageSender: currentUser?._id as Id<"users">,
                  //     lastMessageTime: Date.now(),
                  //   });
                  // }
                }}
              >
                Delete for me
              </DropdownItem>
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
