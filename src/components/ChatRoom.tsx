// ChatRoom.tsx
import { ChatRoomProvider } from "@ably/chat/react";
import ChatRoomInner from "./ChatRoomInner"; // this is your old ChatRoom component
import type { ChatRoomProps } from "../components/ChatRoomInner"; // optional: export the type
// optional: export the type

export default function ChatRoomWrapper(props: ChatRoomProps) {
  return (
    <ChatRoomProvider
      name={`room${props.type}${props.chatId}`}
      // @ts-ignore
      
    >
      <ChatRoomInner {...props} />
    </ChatRoomProvider>
  );
}
