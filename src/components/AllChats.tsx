import { useEffect, useState } from "react";
import Header from "../components/Header";
import ChatList from "./ChatList";
import ChatRoom from "../components/ChatRoom";
import FootBallIcon from "../icons/FootballIcon";
import CricketIcon from "../icons/CricketIcon";
import TennisIcon from "../icons/TennisIcon";
import HockeyIcon from "../icons/HockeyIcon";
import BadmintonIcon from "../icons/BadmintonIcon";
import ChatCard from "./ChatCard";
import { ChatRoomProvider, useChatConnection, useRoom } from "@ably/chat/react";
import { ConnectionStatus } from "@ably/chat";
import ChatRoomInner from "./ChatRoomInner";

type AllChatsProps = {
  activeRoom?: string; // optional as not used here
  setActiveRoom?: (room: string) => void; // optional as not used here
};

const tribeIcons = [
  { name: "Football Tribe", Icon: FootBallIcon },
  { name: "Cricket Tribe", Icon: CricketIcon },
  { name: "Tennis Tribe", Icon: TennisIcon },
  { name: "Hockey Tribe", Icon: HockeyIcon },
  { name: "Badminton Tribe", Icon: BadmintonIcon },
];

const AllChats = ({}: AllChatsProps) => {
  
  function RoomStatus() {
    const [currentRoomStatus, setCurrentRoomStatus] = useState("");
    const { roomName } = useRoom({
      onStatusChange: (status) => {
        setCurrentRoomStatus(status.current);
      },
    });
    console.log("roomname", roomName);

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

  function ConnectionStatus() {
    const { currentStatus } = useChatConnection();
    let i = 0;
    console.log("new user", i + 1);
    console.log(currentStatus, "currentStatus");
    return (
      <div className="p-4 text-center h-full border-gray-300 bg-gray-100">
        <h2 className="text-lg font-semibold text-blue-500">
          Ably Chat Connection
        </h2>
        <p className="mt-2">Connection: {currentStatus}!</p>
      </div>
    );
  }

  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("My Buddy");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isInChatRoom = activeChat !== null;

  const tabToType = (tab: string): "buddy" | "game" | "tribe" =>
    tab === "My Game" ? "game" : tab === "My Tribe" ? "tribe" : "buddy";

  const chatType = tabToType(activeTab);

  const dummyNotifications = [
    {
      id: 1,
      text: "Divya sent you a friend request",
      actions: ["Accept", "Decline"],
    },
    {
      id: 2,
      text: "You’ve been invited to a Football Game",
      actions: ["Join"],
    },
  ];
  
  console.log(`hello from room-${chatType}-${activeChat}`);
  return (
    <>
      <Header
        title={"Communications"}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveChat(null);
          setShowNotifications(false); // Hide notifications when switching tabs
        }}
        showBackButton={true}
        onBackClick={() => setActiveChat(null)}
        showNotifications={() => setShowNotifications(true)}
        isNotificationsOpen={showNotifications}
      />

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed mt-48 left-4 right-4 z-50  shadow-lg p-4 ">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-sm text-gray-500"
            >
              Close
            </button>
          </div>

          {dummyNotifications.map((n) => (
            <ChatCard
              key={n.id}
              label={n.text}
              count={1}
              time={"2:00 PM"}
              actions={n.actions} // assume array like ["accept", "decline"]
              onAccept={() => console.log("Accepted", n.id)}
              onDecline={() => console.log("Declined", n.id)}
            />
          ))}
        </div>
      )}

      {!showNotifications && (
        <>
          {/* Tribe Icons */}
          {chatType === "tribe" && (
            <div className="mx-4 mt-48 flex justify-between">
              {tribeIcons.map(({ name, Icon }) => (
                <div
                  key={name}
                  onClick={() => setActiveChat(name)}
                  className={`cursor-pointer rounded-md w-14 h-14 flex items-center justify-center p-3 transition ${
                    activeChat === name
                      ? "bg-[#00f0ff] shadow-md"
                      : "bg-gray-200"
                  }`}
                >
                  <Icon />
                </div>
              ))}
            </div>
          )}

          <div
            className={`${
              activeTab === "My Tribe"
                ? "mt-4"
                : activeTab === "My Game" || activeTab === "My Buddy"
                ? "mt-48"
                : ""
            } bg-white shadow-lg`}
          >

            {isInChatRoom ? (
              <ChatRoomProvider
                name={`room-${chatType}-${activeChat}`}
                // @ts-ignore
                connection={{ clientId: "user-2-anirudh" }} // 👈 required for clientId checks
              >
                <ChatRoom
                  type={chatType}
                  chatId={activeChat!}
                  goBack={() => setActiveChat(null)}
                />
              </ChatRoomProvider>
            ) : (
              <ChatList
                type={chatType}
                onOpenChat={(id) => setActiveChat(id)}
                activeChat={activeChat}
              />
            )}
          </div>
        </>
      )}
    </>
  );

  
};




export default AllChats;
