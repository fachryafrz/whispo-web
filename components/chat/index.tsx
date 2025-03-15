"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import ChatHeader from "./header";
import ChatMessages from "./messages";
import ChatInput from "./input";

import { useSelectedChat } from "@/zustand/selected-chat";

export default function Chat() {
  const router = useRouter();
  const pathname = usePathname();

  const { selectedChat, clearSelectedChat, showChatRoom, setShowChatRoom } =
    useSelectedChat();

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 768;

    if (pathname === "/") {
      setShowChatRoom(false);

      setTimeout(
        () => {
          clearSelectedChat();
        },
        isSmallScreen ? 500 : 0, // If the screen is small, wait 500ms before clearing the selected chat
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && pathname !== "/") {
        setShowChatRoom(false);

        setTimeout(
          () => {
            clearSelectedChat();
            router.back();
          },
          isSmallScreen ? 500 : 0, // If the screen is small, wait 500ms before clearing the selected chat
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname]);

  useEffect(() => {
    if (!selectedChat) return;

    if (selectedChat) {
      setTimeout(() => {
        setShowChatRoom(true);
      }, 100);
    }
  }, [selectedChat]);

  return (
    <>
      {selectedChat && (
        <section
          className={`fixed inset-0 z-10 flex w-full flex-1 flex-col bg-white transition-all duration-500 dark:bg-black md:static md:z-0 ${showChatRoom ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
        >
          {/* Header */}
          <ChatHeader />

          {/* Chat */}
          <ChatMessages />

          {/* Input */}
          <ChatInput />
        </section>
      )}
    </>
  );
}
