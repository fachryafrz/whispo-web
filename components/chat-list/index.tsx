"use client";

import ChatListHeader from "./header";
import List from "./list";
import SearchUser from "./search-user";

export default function ChatList() {
  return (
    <section className={`flex flex-1 flex-col md:max-w-96`}>
      <ChatListHeader />

      <div className="relative flex-1 overflow-x-hidden">
        <List />

        <SearchUser />
      </div>
    </section>
  );
}
