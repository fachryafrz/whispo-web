"use client";

import { useEffect } from "react";

import ChatHeader from "./header";
import ChatMessages from "./messages";
import ChatInput from "./input";

import { useChat } from "@/zustand/chat";

export default function Chat() {
  const { activeChat, clearActiveChat } = useChat();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearActiveChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
        <section
          className={`hidden flex-1 place-content-center bg-neutral-100 text-default-500 dark:bg-neutral-950 md:grid`}
        >
          <h2 className="text-lg font-bold">Select a chat</h2>
        </section>
      )}
    </>
  );
}
