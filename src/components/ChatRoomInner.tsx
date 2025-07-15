import { ChevronLeft, Mic, Plus, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMessages } from "@ably/chat/react";
import { useContext } from "react";
import { ClientIdContext } from "../main";

import { ChatMessageEventType } from "@ably/chat";

export interface ChatRoomProps {
  type?: "buddy" | "game" | "tribe";
  chatId: string;
  goBack: () => void;
  activeTab?: string;
  roomName?: string;
}

function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isYesterday(date: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

export default function ChatRoomInner({ type, chatId, goBack, activeTab }: ChatRoomProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const clientId = useContext(ClientIdContext);
  const clientsIds = clientId;

  // ✅ Real-time message listener
  // const { send } = useMessages({
  //   // @ts-ignore
  //   listener: (event: MessageEvent) => {
  //     // @ts-ignore
  //     const message = event.message;
  //     if (event.type === ChatMessageEventType.Created) {
  //       setMessages((prev) => [...prev, message]);
  //     }
  //   },
  // });

  const containerHeightClass = activeTab === "My Tribe" ? "h-[83vh]" : "h-[80vh]";

  const { historyBeforeSubscribe, send } = useMessages({
    listener: (event) => {
      if (event.type === ChatMessageEventType.Created) {
        setMessages((prev) => [...prev, event.message]);
      }
    },
    onDiscontinuity: (error) => {
      console.warn("Discontinuity detected:", error);
      setLoading(true);
    },
  });

  useEffect(() => {
    if (historyBeforeSubscribe && loading) {
      historyBeforeSubscribe({ limit: 50 }).then((result) => {
        // result.items() returns an array of messages
        const messages = result.items;

        setMessages(messages);
        setLoading(false);
      });
    }
  }, [historyBeforeSubscribe, loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    send({ text: inputValue.trim()}).catch((err) =>
      console.error("Send error", err)
    );
    setInputValue("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastMsgTimestamp = messages.length
    ? new Date(messages[messages.length - 1].timestamp)
    : new Date();

  let dateLabel = "Today";
  if (isYesterday(lastMsgTimestamp)) {
    dateLabel = "Yesterday";
  } else if (!isToday(lastMsgTimestamp)) {
    dateLabel = lastMsgTimestamp.toLocaleDateString();
  }

  

  return (
    <div className={`mt-4 shadow-lg flex flex-col ${containerHeightClass}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white shadow rounded-b-2xl">
        <div className="flex items-center gap-2">
          <button onClick={goBack}>
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
            {chatId[0]}
          </div>
          <div>
            <p className="text-sm font-semibold">{chatId}</p>
            <p className="text-xs text-gray-500">
              {type === "buddy" ? "Online" : "Members: Divya, Alok"}
            </p>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-gray-600" />
      </div>

      {/* Date label */}
      <div className="mt-5 ml-49 text-center max-w-[15%] text-xs text-gray-500 py-1 bg-gray-50 border-b border-gray-200">
        {dateLabel}
      </div>

      {/* Messages */}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {loading && <p className="rounded-lg bg-blue-50 w-fit p-2">Loading messages.....</p>}
        {[...messages]
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          .map((msg: any, idx) => {
            const isMine = msg.clientId === clientsIds;
            console.log("msg.clientId:", msg.clientId);


            return (
              <div
                key={idx}
                className={`max-w-[60%] px-3 py-2 text-sm rounded-2xl break-words whitespace-normal ${
                  isMine
                    ? "bg-green-200 text-gray-800 rounded-br-none ml-auto"
                    : "bg-blue-100 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            );
          })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center px-4 py-2 gap-2">
        <Plus className="w-5 h-5 text-gray-500" />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none"
          placeholder="Type a message"
        />
        <Mic className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  );
}
