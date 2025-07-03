// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Ably from 'ably';
import { ChatClient, LogLevel } from '@ably/chat';
import { ChatClientProvider } from '@ably/chat/react';
import { AblyProvider } from 'ably/react';
import App from './App'; // Your main app component

// Create your Ably Realtime client and ChatClient instances:
const realtimeClient = new Ably.Realtime({
  key: "0DwkUw.pjfyJw:CwXcw14bOIyzWPRLjX1W7MAoYQYEVgzk8ko3tn0dYUI",
  clientId: 'user2anirudh',
});

const chatClient = new ChatClient(realtimeClient, {
  logLevel: LogLevel.Info,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AblyProvider client={realtimeClient}>
      <ChatClientProvider client={chatClient}>
        <App /> {/* Your main app component */}
      </ChatClientProvider>
    </AblyProvider>
  </React.StrictMode>,
);
