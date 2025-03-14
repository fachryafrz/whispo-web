"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import SelectAChat from "./select-a-chat";
import ChatHeader from "./header";
import ChatMessages from "./messages";
import ChatInput from "./input";

import { useSelectedChat } from "@/zustand/selected-chat";

export default function Chat() {
  const router = useRouter();

  const { selectedChat, clearSelectedChat } = useSelectedChat();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearSelectedChat();
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {selectedChat ? (
        <section
          className={`absolute inset-0 z-10 flex w-full flex-1 flex-col bg-white dark:bg-black md:static`}
        >
          {/* Header */}
          <ChatHeader />

          {/* Chat */}
          <ChatMessages />

          {/* Input */}
          <ChatInput />
        </section>
      ) : (
        <SelectAChat />
      )}
    </>
  );
}
