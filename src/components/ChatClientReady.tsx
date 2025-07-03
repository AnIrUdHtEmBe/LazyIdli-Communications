// components/ChatClientReady.tsx
import { useChatConnection } from "@ably/chat/react";

export default function ChatClientReady({ children }: { children: React.ReactNode }) {
  const { currentStatus } = useChatConnection();

  if (currentStatus !== "connected") {
    return (
      <div className="p-4 text-center">
        <p>Connecting to chat...</p>
      </div>
    );
  }

  return <>{children}</>;
}
