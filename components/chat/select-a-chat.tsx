"use client";

import { useSelectedChat } from "@/zustand/selected-chat";

export default function SelectAChat() {
  const { selectedChat } = useSelectedChat();

  return (
    <>
      {!selectedChat && (
        <section
          className={`hidden flex-1 place-content-center bg-neutral-100 text-default-500 dark:bg-neutral-950 md:grid`}
        >
          <h2 className="text-lg font-bold">Select a chat</h2>
        </section>
      )}
    </>
  );
}
