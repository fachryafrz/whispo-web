import Chat from "@/components/chat";
import ChatList from "@/components/chat-list";

export default function Home() {
  return (
    <div className={`relative flex h-screen`}>
      <ChatList />

      <Chat />
    </div>
  );
}
