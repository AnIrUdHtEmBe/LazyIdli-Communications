import { useEffect, useState } from "react";
import ChatCard from "../components/ChatCard";

import dummyData from "../dummyData/dummyData";
import PendingRequests from "./PendingRequests";
import PastGames from "./PastGames";
import ChatRoom from "./ChatRoomInner";
import axios from "axios";

interface ChatListProps {
  type: "buddy" | "game" | "tribe";
  onOpenChat: (id: string) => void;
  activeChat?: string | null;
}

type Buddy = {
  name: string;
  id: string;
  message: string;
  count: number;
  time: string;
};

type Tribe = {
  name: string;
  members: string;
  count: number;
  time: string;
  message: string;
};


type GameSummary = {
  gameId: string;
  sport: string;
  members: string;
  count: number;
  time: string;
  message: string;
};

// Default dummy data for fallback


export default function ChatList({ type, onOpenChat }: ChatListProps) {
  const [showPending, setShowPending] = useState(false);
  const [pastGames, setPastGames] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [games, setGames] = useState<string[]>([]); // hold array of game IDs (strings)
  const [myGame, setMyGame] = useState<GameSummary[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [mySport, setMySports] = useState<Tribe[]>([]);

  // Fetch main user data, set buddies and gamesBooked IDs
  async function fetchBuddiesFromAPI(mainUserId: string): Promise<Buddy[]> {
    try {
      // 1. Fetch main user data
      const mainUserResponse = await axios.get(
        `http://127.0.0.1:8000/human/${mainUserId}`
      );

      // Set gamesBooked IDs into state
      const gamesBooked = mainUserResponse.data.gamesBooked || [];
      setGames(gamesBooked);

      // Fetch fave users details
      const faveUserIds = mainUserResponse.data.faveUsers || [];
      const faveUsersResponses = await Promise.all(
        faveUserIds.map((userId: any) =>
          axios.get(`http://127.0.0.1:8000/human/${userId}`)
        )
      );

      const buddiesFromAPI: Buddy[] = faveUsersResponses.map((res) => ({
        name: res.data.name || "Unknown",
        id: res.data.userId,
        message: res.data.lastMessage || "Hi there",
        count: 0,
        time: "12:30",
      }));

      return buddiesFromAPI;
    } catch (error) {
      console.error("Error fetching buddies from API:", error);
      return [];
    }
  }

  // Fetch detailed game info for each game ID whenever `games` changes and type is "game"
  useEffect(() => {
    if (type !== "game" || games.length === 0) {
      setMyGame([]); // clear when no games or not game view
      return;
    }

    async function fetchGameDetails() {
      const fetchedGames: GameSummary[] = [];

      try {
        await Promise.all(
          games.map(async (gameId) => {
            try {
              const res = await axios.get(`http://127.0.0.1:8000/game/${gameId}`);
              const data = res.data;

              const sport = data.sport || "Unknown Sport";
              const players = data.scheduledPlayersDetails || [];
              const membersNames = players.map((p: any) => p.name).join(", ");
              const count = players.length || 0;
              const time = data.startTime
                ? new Date(data.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A";

              fetchedGames.push({
                gameId,
                sport,
                members: membersNames,
                count,
                time,
                message: "Game has started",
              });
            } catch (err) {
              console.error(`Failed to fetch details for game ${gameId}`, err);
            }
          })
        );
        setMyGame(fetchedGames);
      } catch (error) {
        console.error("Error fetching game details", error);
        setMyGame([]);
      }
    }

    fetchGameDetails();
  }, [games, type]);

 
useEffect(() => {
    if (type !== "tribe") {
      setMySports([]);
      return;
    }

    async function fetchSportDetails() {
      console.log("fetching sports!!!");
      
      try {
        const res = await axios.get(`http://127.0.0.1:8000/sports/all`);
        const data = res.data;
        console.log("api sport data ", data);
        
        // Map the API response to Tribe format
        const fetchedSports: Tribe[] = data.map((sportItem: any) => {
          const sportName = sportItem.name || "Unknown Sport";
          const description = sportItem.description || "";
          const maxPlayers = sportItem.maxPlayers || 0;
          const minPlayers = sportItem.minPlayers || 0;
          
          return {
            name: sportName,
            members: `${minPlayers}-${maxPlayers} players`, // Use player range as members info
            count: Math.floor(Math.random() * 50) + 1, // Random count for demo
            time: "Active", // Since there's no time in API response
            message: description || "Join the tribe!",
          };
        });

        setMySports(fetchedSports);
        console.log(fetchedSports, "sports data!!");
        
      } catch (error) {
        console.error("Error fetching sport details", error);
        setMySports([]);
      }
    }

    fetchSportDetails();
  }, [type]);
  

  // Helper function for opening chat
  const handleOpenChat = (id: string) => {
    setActiveChatId(id);
    setPastGames(false);
  };

  // Reset UI when type changes
  useEffect(() => {
    setPastGames(false);
    setShowPending(false);
    setActiveChatId(null);
  }, [type]);

  // Fetch buddies when type is buddy
  useEffect(() => {
    if (type === "buddy") {
      (async () => {
        const fetchedBuddies = await fetchBuddiesFromAPI("USER_YOJB35");
        setBuddies(fetchedBuddies);
      })();
    }
  }, [type]);

  return (
    <>
      {type === "buddy" && (
        <>
          <ChatCard
            label="Pending Requests"
            onClick={() => setShowPending(true)}
            count={2}
            time="2:45 PM"
          />
          {buddies.map((user) => (
            <ChatCard
              key={user.name}
              label={user.name}
              count={user.count}
              time={user.time}
              message={user.message}
              onClick={() => {
                onOpenChat(user.id);
                setPastGames(false);
              }}
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
          <ChatCard
            label="Past Games"
            onClick={() => setPastGames((prev) => !prev)}
            count={2}
            time="Yesterday"
          />
          {myGame.length === 0 ? (
            <div className="text-sm text-gray-500 p-4">No games found</div>
          ) : (
            myGame.map((group) => (
              <ChatCard
                key={group.gameId}
                label={group.sport}
                count={group.count}
                time={group.time}
                message={group.message}
                onClick={() => {
                  onOpenChat(group.sport);
                  setPastGames(false);
                }}
                icon={
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                    {group.sport[0]}
                  </div>
                }
                subtext={group.members}
              />
            ))
          )}
        </>
      )}

      {pastGames && (
        <PastGames onOpenChat={handleOpenChat} onClose={() => setPastGames(false)} />
      )}

      {type === "tribe" && (
        <>
          <ChatCard label="My Tribes" count={2} time="Today" />
          {mySport.map((tribe) => (
            <ChatCard
              key={tribe.name}
              label={tribe.name}
              count={tribe.count}
              time={tribe.time}
              message={tribe.message}
              onClick={() => {
                onOpenChat(tribe.name);
                setPastGames(false);
              }}
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
        <ChatRoom
          chatId={activeChatId}
          goBack={() => setActiveChatId(null)}
          type={type}
          roomName={`room-${type}-${activeChatId}`}
        />
      )}
    </>
  );
}
