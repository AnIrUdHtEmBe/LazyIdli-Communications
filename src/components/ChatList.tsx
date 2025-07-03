
import { useState } from "react";
import ChatCard from "../components/ChatCard";

import dummyData from "../dummyData/dummyData";
import PendingRequests from "./PendingRequests";
import PastGames from "./PastGames";
import ChatRoom from "./ChatRoomInner";

interface ChatListProps {
  type: "buddy" | "game" | "tribe";
  onOpenChat: (id: string) => void;
  activeChat?: string | null;
}

const dummyBuddies = dummyData.dummyBuddies;

const dummyGames = dummyData.dummyGames;

const dummyTribes = dummyData.dummyTribes;




export default function ChatList({ type, onOpenChat, activeChat }: ChatListProps) {
  const [showPending, setShowPending] = useState(false);
  const [pastGames, setPastGames] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleOpenChat = (id: string) => {
    setActiveChatId(id); // ✅ set current chat
    setPastGames(false); // ✅ close past games modal if open
  };

  return (
    <>
      {type === "buddy" && (
        <>
          <ChatCard label="Pending Requests" onClick={() => setShowPending(true)} count={2} time="2:45 PM" />
          {dummyBuddies.map((user) => (
            <ChatCard
              key={user.name}
              label={user.name}
              count={user.count}
              time={user.time}
              message={user.message}
              onClick={() => handleOpenChat(user.name)}
              icon={
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                  {user.name[0]}
                </div>
              }
            />
          ))}
        </>
      )}

      {showPending && <PendingRequests onClose={() => setShowPending(false)} />}

      {type === "game" && (
        <>
          <ChatCard label="Past Games" onClick={() => setPastGames(true)} count={2} time="Yesterday" />
          {dummyGames.map((group) => (
            <ChatCard
              key={group.name}
              label={group.name}
              count={group.count}
              time={group.time}
              message={group.message}
              onClick={() => handleOpenChat(group.name)}

              icon={
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                  {group.name[0]}
                </div>
              }
              subtext={group.members}
            />
          ))}
        </>
      )}

      {pastGames && (
        <PastGames
          onOpenChat={handleOpenChat} // ✅ pass down
          onClose={() => setPastGames(false)} // ✅ optional modal close
        />
      )}

      {type === "tribe" && (
        <>
          {/* 🟦 Icon Header – Always Visible */}
          {/* <div className="mx-4 flex justify-between mb-4">
            {tribeIcons.map(({ name, Icon }) => (
              <div
                key={name}
                onClick={() => onOpenChat(name)}
                className={`cursor-pointer rounded-md w-14 h-14 flex items-center justify-center p-3 transition ${
                  activeChat === name
                    ? "bg-[#00f0ff] shadow-md"
                    : "bg-gray-200"
                }`}
              >
                <Icon />
              </div>
            ))}
          </div> */}

          <ChatCard label="My Tribes" count={2} time="Today" />

          {dummyTribes.map((tribe) => (
            <ChatCard
              key={tribe.name}
              label={tribe.name}
              count={tribe.count}
              time={tribe.time}
              message={tribe.message}
              onClick={() => handleOpenChat(tribe.name)}
              icon={
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                  {tribe.name[0]}
                </div>
              }
              subtext={tribe.members}
            />
          ))}
        </>
      )}
       {activeChatId && (
        <ChatRoom chatId={activeChatId} goBack={() => setActiveChatId(null)} />
      )}
    </>
  );
}
