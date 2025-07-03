// App.tsx
import { useState } from "react";
import { ChatRoomProvider, useChatConnection, useMessages, useRoom } from "@ably/chat/react";
import "../App.css";
import { ChatMessageEventType, type Message } from "@ably/chat";


function ConnectionStatus() {
  const { currentStatus } = useChatConnection();
  let i =0;
  console.log("new user", i + 1);
  
  return (
    <div className="p-4 text-center h-full border-gray-300 bg-gray-100">
      <h2 className="text-lg font-semibold text-blue-500">
        Ably Chat Connection
      </h2>
      <p className="mt-2">Connection: {currentStatus}!</p>
    </div>
  );
}

function ChatBox() {
  const [inputValue, setInputValue] = useState('');
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
  const handleSend = () => {
    if (!inputValue.trim()) return;
    send({ text: inputValue.trim() }).catch((err) =>
      console.error('Error sending message', err))
    setInputValue('');
  };

  return (
  <div className="flex flex-col w-full h-[600px] item-left border-1 border-blue-500 rounded-lg overflow-hidden mx-auto font-sans">
    <div className="flex-1 p-4 overflow-y-auto space-y-2">
      {messages.map((msg: Message) => {
        const isMine = msg.clientId === 'my-first-client';
        return (
          <div key={msg.serial} className={`max-w-[60%] rounded-2xl px-3 py-2 shadow-sm ${
            isMine ? 'bg-green-200 text-gray-800 rounded-br-none' : 'bg-blue-50 text-gray-800 rounded-bl-none'
          }`}>
            {msg.text}
          </div>
        );
      })}
    </div>
    <div className="flex items-center px-2 mt-auto mb-2">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-2 border border-gray-400 rounded outline-none bg-white"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSend();
          }
        }}
      />
      <button
        className="bg-blue-500 text-white px-4 ml-2 h-10 flex items-center justify-center rounded hover:bg-blue-600 transition-colors"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  </div>
  );
}

function RoomStatus() {
  const [currentRoomStatus, setCurrentRoomStatus] = useState("");
  const { roomName } = useRoom({
    onStatusChange: (status) => {
      setCurrentRoomStatus(status.current);
    },
  });

  return (
    <div className="flex-1 border-1 border-blue-500">
      <ConnectionStatus />
      <p className="mt-2">
        Status: {currentRoomStatus}
        <br />
        Room: {roomName}
      </p>
    </div>
  );
}



function App() {
  return (
    <>
    <ChatRoomProvider
      name="my-first-room" // The room name you want to create or join
      release={true} // Release the room automatically when unmounted
      attach={true} // Attach to the room automatically when mounted
    >
      <div className="flex flex-col w-[900px] h-full border-1 border-blue-500 rounded-lg overflow-hidden mx-auto font-sans">
        <div className="flex flex-row w-full border-1 border-blue-500 rounded-lg overflow-hidden mx-auto font-sans">
          <div className="flex-1 border-1 border-blue-500">
            <ConnectionStatus/>
          </div>
          <div className="flex-1 border-1 border-blue-500">
            <RoomStatus/>
          </div>
        </div>
        <div className="flex flex-1 flex-row flex justify-evenly">
          <div className="flex flex-col bg-white w-1/2 border-1 border-blue-500 rounded-lg overflow-hidden mx-auto font-sans">
          {/* Your ChatBox component should go here */}
            <ChatBox/>
          </div>
        </div>
      </div>
    </ChatRoomProvider>

    <ChatRoomProvider
      name="my-second-room" // The room name you want to create or join
      release={true} // Release the room automatically when unmounted
      attach={true} // Attach to the room automatically when mounted
    >
      <div className="flex flex-col w-[900px] h-full border-1 border-blue-500 rounded-lg overflow-hidden mx-auto font-sans">
        <div className="flex flex-row w-full border-1 border-blue-500 rounded-lg overflow-hidden mx-auto font-sans">
          <div className="flex-1 border-1 border-blue-500">
            <ConnectionStatus/>
          </div>
          <div className="flex-1 border-1 border-blue-500">
            <RoomStatus/>
          </div>
        </div>
        <div className="flex flex-1 flex-row flex justify-evenly">
          <div className="flex flex-col bg-white w-1/2 border-1 border-blue-500 rounded-lg overflow-hidden mx-auto font-sans">
          {/* Your ChatBox component should go here */}
            <ChatBox/>
          </div>
        </div>
      </div>
    </ChatRoomProvider>
    </>
  );
}
export default App;
