"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import SelectAChat from "./select-a-chat";
import ChatHeader from "./header";
import ChatMessages from "./messages";
import ChatInput from "./input";

import { useChat } from "@/zustand/chat";

export default function Chat() {
  const router = useRouter();

  const { activeChat, clearActiveChat } = useChat();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearActiveChat();
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() =>{
    console.log(activeChat)
  },[activeChat])

  return (
    <>
      {activeChat ? (
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
