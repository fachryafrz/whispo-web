/* eslint-disable @next/next/no-img-element */
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { useMutation, useQuery } from "convex/react";
import { Paperclip, SendHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { addToast } from "@heroui/toast";

import ReplyTo from "./reply-to";

import { useChat } from "@/zustand/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { handleKeyDown } from "@/utils/handle-textarea-key-down";
import { useReplyMessage } from "@/zustand/reply-message";

export default function ChatInput() {
  // Zustand
  const { activeChat } = useChat();
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
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const storeMessage = useMutation(api.messages.store);
  const updateChat = useMutation(api.chats.updateChatById);
  const storeUnreadMessage = useMutation(api.unread_messages.store);

  const interlocutor = activeChat?.participants.find(
    (p) => p !== currentUser?._id,
  );

  const sendMessage = async (e: React.FormEvent) => {
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

    storeMessage({
      chat: activeChat?._id as Id<"chats">,
      sender: currentUser?._id as Id<"users">,
      content: text as string,
      replyTo: (replyMessageId as Id<"messages">) || undefined,
      mediaUrl: storageId,
    });

    updateChat({
      _id: activeChat?._id as Id<"chats">,
      lastMessage: text as string,
      lastMessageSender: currentUser?._id as Id<"users">,
      lastMessageTime: Date.now(),
    });

    storeUnreadMessage({
      user: interlocutor as Id<"users">,
      chat: activeChat?._id as Id<"chats">,
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
  }, [activeChat]);

  return (
    <div className={`space-y-2 p-2`}>
      {/* Reply to */}
      {replyMessageId && <ReplyTo />}

      {/* TODO: Media */}
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
        onSubmit={sendMessage}
      >
        {/* Attachments */}
        <div>
          <Button
            isIconOnly
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
