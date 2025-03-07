"use client";

import { useEffect, useState } from "react";

import ChatHeader from "./header";
import ChatMessages from "./messages";
import ChatInput from "./input";

import { useChat } from "@/zustand/chat";

export default function Chat() {
  const { activeChat, clearActiveChat } = useChat();

  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = () => {
    setMessages((prev) => [`Message ${prev.length}`, ...prev]); // Tambah ke awal array
  };

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
        <section className={`flex flex-1 flex-col`}>
          {/* Header */}
          <ChatHeader />

          {/* Chat */}
          <ChatMessages messages={messages} />

          {/* Input */}
          <ChatInput onPress={addMessage} />
        </section>
      ) : (
        <section
          className={`grid flex-1 place-content-center bg-neutral-100 dark:bg-neutral-950`}
        >
          <h2 className="text-center text-xl">Select a chat</h2>
        </section>
      )}
    </>
  );
}
