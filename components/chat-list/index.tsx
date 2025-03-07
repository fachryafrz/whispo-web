"use client";

import ChatListHeader from "./header";
import List from "./list";
import SearchUser from "./search-user";

export default function ChatList() {
  return (
    <section className={`flex max-w-96 flex-1 flex-col`}>
      <ChatListHeader />

      <div className="relative flex-1 overflow-x-hidden">
        <List />

        <SearchUser />
      </div>
    </section>
  );
}
