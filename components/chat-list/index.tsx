"use client";

import ChatListHeader from "./header";
import List from "./list";

export default function ChatList() {
  return (
    <section className={`flex max-w-96 flex-1 flex-col`}>
      <ChatListHeader />

      <List />
    </section>
  );
}
