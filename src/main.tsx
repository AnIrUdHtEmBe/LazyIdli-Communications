// // main.tsx
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import * as Ably from 'ably';
// import { ChatClient, LogLevel } from '@ably/chat';
// import { ChatClientProvider } from '@ably/chat/react';
// import { AblyProvider } from 'ably/react';
// import App from './App'; // Your main app component

// // Create your Ably Realtime client and ChatClient instances:
// const realtimeClient = new Ably.Realtime({
//   key: "0DwkUw.pjfyJw:CwXcw14bOIyzWPRLjX1W7MAoYQYEVgzk8ko3tn0dYUI",
//   clientId: 'user2anirudh',
// });

// const chatClient = new ChatClient(realtimeClient, {
//   logLevel: LogLevel.Info,
// });

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <AblyProvider client={realtimeClient}>
//       <ChatClientProvider client={chatClient}>
//         <App /> 
//       </ChatClientProvider>
//     </AblyProvider>
//   </React.StrictMode>,
// );

import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import * as Ably from "ably";
import { ChatClient, LogLevel } from "@ably/chat";
import { ChatClientProvider } from "@ably/chat/react";
import { AblyProvider } from "ably/react";
import App from "./App";
import { v4 as uuidv4 } from "uuid";

// Create a React Context for clientId
export const ClientIdContext = createContext<string>("");

function Root() {
  const [clientId, setClientId] = useState<string>("");

  useEffect(() => {
    // Generate UUID once on mount
    setClientId("USER_YOJB35");
  }, []);

  if (!clientId) return null; // or loading spinner

  // Create Ably clients with generated clientId
  const realtimeClient = new Ably.Realtime({
    key: "0DwkUw.pjfyJw:CwXcw14bOIyzWPRLjX1W7MAoYQYEVgzk8ko3tn0dYUI",
    clientId,
  });

  const chatClient = new ChatClient(realtimeClient, {
    logLevel: LogLevel.Info,
  });

  return (
    <ClientIdContext.Provider value={clientId}>
      <AblyProvider client={realtimeClient}>
        <ChatClientProvider client={chatClient}>
          <App />
        </ChatClientProvider>
      </AblyProvider>
    </ClientIdContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);


