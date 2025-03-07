"use client";

import { useState } from "react";

import ChatHeader from "./header";
import ChatMessages from "./messages";
import ChatInput from "./input";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = () => {
    setMessages((prev) => [`Message ${prev.length}`, ...prev]); // Tambah ke awal array
  };

  return (
    <section
      className={`flex flex-1 flex-col bg-neutral-100 dark:bg-neutral-900`}
    >
      {/* Header */}
      <ChatHeader />

      {/* Chat */}
      <ChatMessages messages={messages} />

      {/* Input */}
      <ChatInput onPress={addMessage} />
    </section>
  );
}
