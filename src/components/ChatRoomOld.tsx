import { ChevronLeft, Mic, Plus, MoreHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ChatRoomProvider, useChatConnection, useMessages, useRoom } from "@ably/chat/react";

import { ChatMessageEventType, type Message } from "@ably/chat";


interface ChatRoomProps {
  type?: "buddy" | "game" | "tribe";
  chatId: string;
  goBack: () => void;
}

interface Message {
  sender: "me" | "them";
  text: string;
  timestamp: Date;
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


  
  // State to hold the messages
  const [messages, setMessages] = useState<Message[]>([]);

  // The useMessages hook subscribes to messages in the room and provides a send method
  const { send } = useMessages({
    // @ts-ignore
    listener: (event: MessageEvent) => {
        // @ts-ignore
      const message = event.message;
      switch (event.type) {
        case ChatMessageEventType.Created: {
          // Add the new message to the list
          setMessages((prevMessages) => [...prevMessages, message]);
          break;
        }
        default: {
          console.error('Unhandled event', event);
        }
      }
    }
  });

  console.log(messages);
  

  // Function to handle sending messages
//   const handleSend = () => {
//     if (!inputValue.trim()) return;
//     send({ text: inputValue.trim() }).catch((err) =>
//       console.error('Error sending message', err))
//     setInputValue('');
//   };

//   return (
//   <div className="flex flex-col w-full h-[600px] item-left border-1 border-blue-500 rounded-lg overflow-hidden mx-auto font-sans">
//     <div className="flex-1 p-4 overflow-y-auto space-y-2">
//       {messages.map((msg: Message) => {
//         const isMine = msg.clientId === 'my-first-client';
//         return (
//           <div key={msg.serial} className={max-w-[60%] rounded-2xl px-3 py-2 shadow-sm ${
//             isMine ? 'bg-green-200 text-gray-800 rounded-br-none' : 'bg-blue-50 text-gray-800 rounded-bl-none'
//           }}>
//             {msg.text}
//           </div>
//         );
//       })}
//     </div>
//     <div className="flex items-center px-2 mt-auto mb-2">
//       <input
//         type="text"
//         placeholder="Type your message..."
//         className="flex-1 p-2 border border-gray-400 rounded outline-none bg-white"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onKeyDown={(event) => {
//           if (event.key === 'Enter') {
//             handleSend();
//           }
//         }}
//       />
//       <button
//         className="bg-blue-500 text-white px-4 ml-2 h-10 flex items-center justify-center rounded hover:bg-blue-600 transition-colors"
//         onClick={handleSend}
//       >
//         Send
//       </button>
//     </div>
//   </div>
//   );
// }

export default function ChatRoom({ type, chatId, goBack }: ChatRoomProps) {
  
  const bottomRef = useRef<HTMLDivElement | null>(null);
//   const [messages, setMessages] = useState<Message[]>([
//   {
//     sender: "them",
//     text: Hello from ${chatId},
//     timestamp: new Date(new Date().setHours(10, 0)),
//   },
//   {
//     sender: "me",
//     text: "Hi! How are you?",
//     timestamp: new Date(new Date().setHours(10, 2)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },
//   {
//     sender: "them",
//     text: "All good! Ready for the game?",
//     timestamp: new Date(new Date().setHours(10, 5)),
//   },
//   {
//     sender: "me",
//     text: "Absolutely! Let’s go 💪",
//     timestamp: new Date(new Date().setHours(10, 6)),
//   },

// ]);

  // const [input, setInput] = useState("");
  const [inputValue, setInputValue] = useState('');

  // const sendMessage = () => {
  //   if (!input.trim()) return;
  //   setMessages([
  //     ...messages,
  //     { sender: "me", text: input, timestamp: new Date() },
  //   ]);
  //   setInput("");
  // };
  const sendMessage = () => {
    if (!inputValue.trim()) return;
    send({ text: inputValue.trim() }).catch((err) =>
      console.error('Error sending message', err))
    setInputValue('');
  };

  // Determine the label based on the last message timestamp
  const lastMsgTimestamp = messages.length
    ? messages[messages.length - 1].timestamp
    : new Date();

  let dateLabel = "Today";
  if (isYesterday(lastMsgTimestamp)) {
    dateLabel = "Yesterday";
  } else if (!isToday(lastMsgTimestamp)) {
    // For other days, show formatted date or nothing
    dateLabel = lastMsgTimestamp.toLocaleDateString();

  }

 

      
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);




  return (
    <div className="mt-4 shadow-lg flex flex-col h-[80vh]">
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

      {/* Date label below header */}
      <div className="mt-5  ml-49 text-center max-w-[15%] text-xs text-gray-500 py-1 bg-gray-50 border-b border-gray-200">
        {dateLabel}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
       {messages.map((msg: Message) => {
        const isMine = msg.clientId === 'my-first-client';
          <div
            key={msg.serial}
            className={max-w-[50%] w-fit px-3 py-2 rounded-lg text-sm ${
              isMine ?
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-100 text-gray-800"
            }}
          >
            {msg.text}
          </div>
          
        ))}
        
        <div ref={bottomRef} /> 
      </div>

     
     



      {/* Footer */}
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