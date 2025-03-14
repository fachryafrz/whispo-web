/* eslint-disable @next/next/no-img-element */
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { addToast } from "@heroui/toast";
import { useMutation, useQuery } from "convex/react";

import ReplyTo from "./reply-to";

import { handleKeyDown } from "@/utils/handle-textarea-key-down";
import { useReplyMessage } from "@/zustand/reply-message";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSelectedChat } from "@/zustand/selected-chat";

export default function ChatInput() {
  // Zustand
  const { selectedChat } = useSelectedChat();
  const { replyMessageId, clearReplyTo } = useReplyMessage();

  // State
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Convex
  const currentUser = useQuery(api.users.getCurrentUser);
  const generateUploadUrl = useMutation(api.chats.generateUploadUrl);
  const addUnreadMessage = useMutation(api.chats.addUnreadMessage);
  const sendMessage = useMutation(api.chats.sendMessage);
  const getChatParticipants = useQuery(api.chats.getChatParticipants, {
    chatId: selectedChat?.chatId as Id<"chats">,
  });

  const interlocutor = getChatParticipants?.find(
    (p) => p?._id !== currentUser?._id,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text!.trim()) return;

    setIsLoading(true);

    let storageId;

    if (selectedImage) {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.type },
        body: selectedImage,
      });
      const response = await result.json();

      storageId = response.storageId;
    }

    sendMessage({
      chatId: selectedChat?.chatId as Id<"chats">,
      text: text as string,
      replyTo: (replyMessageId as Id<"chat_messages">) || undefined,
      mediaId: (storageId as Id<"_storage">) || undefined,
    });

    addUnreadMessage({
      userId: interlocutor?._id as Id<"users">,
      chatId: selectedChat?.chatId as Id<"chats">,
      count: 1,
    });

    setText("");
    clearReplyTo();
    setSelectedImage(null);
    imageInput.current!.value = "";
    setIsLoading(false);
  };

  useEffect(() => {
    setText("");
    clearReplyTo();
    setSelectedImage(null);
    imageInput.current!.value = "";
    setIsLoading(false);
  }, [selectedChat]);

  return (
    <div className={`space-y-2 p-2`}>
      {/* Reply to */}
      {replyMessageId && <ReplyTo />}

      {/* Media */}
      {selectedImage && (
        <div className="ml-12 flex items-center gap-2">
          <div className="relative overflow-hidden rounded-md before:absolute before:inset-0 before:bg-black before:opacity-50">
            <img
              alt=""
              className="h-20 w-20 object-cover"
              draggable={false}
              src={URL.createObjectURL(selectedImage)}
            />

            <button
              className="absolute right-1 top-1"
              onClick={() => {
                setSelectedImage(null);
                imageInput.current!.value = "";
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Message input */}
      <form
        ref={formRef}
        className="flex items-end gap-2"
        onSubmit={handleSubmit}
      >
        {/* Attachments */}
        <div>
          <Button
            isIconOnly
            isDisabled={isLoading}
            radius="full"
            type="button"
            variant="light"
            onPress={() => {
              imageInput.current?.click();
            }}
          >
            <Paperclip size={20} />
          </Button>

          <input
            ref={imageInput}
            accept="image/*"
            className="sr-only"
            disabled={isLoading}
            type="file"
            onChange={(event) => {
              if (event.target.files![0].size > 1024 * 1024) {
                addToast({
                  title: "File too large",
                  description: "File size must be less than 1MB",
                });

                return;
              }

              setSelectedImage(event.target.files![0]);
            }}
          />
        </div>

        {/* Message */}
        <Textarea
          ref={textareaRef}
          isDisabled={isLoading}
          minRows={1}
          placeholder="Type a message"
          radius="full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(
              e as React.KeyboardEvent<HTMLTextAreaElement>,
              formRef,
            )
          }
        />

        {/* Send */}
        <Button
          disableAnimation
          isIconOnly
          className="bg-black text-white dark:bg-white dark:text-black"
          isDisabled={isLoading}
          isLoading={isLoading}
          radius="full"
          type="submit"
        >
          {!isLoading && <SendHorizontal size={20} />}
        </Button>
      </form>
    </div>
  );
}
