import dummyData from "../dummyData/dummyData";
import ChatCard from "./ChatCard";

interface PastGamesProps {
  onOpenChat: (id: string) => void;
   onClose?: () => void;
}

const PastGames = ({  onOpenChat } : PastGamesProps) => {
    const dummyPastGames = dummyData.dummyPastGames
    

    return(
        <div>
            
          {dummyPastGames.map((group) => (
            <ChatCard
              key={group.name}
              label={group.name}
              count={group.count}
              time={group.time}
              message={group.message}
               onClick={() => onOpenChat(group.name)}
               
              icon={
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                  {group.name[0]}
                </div>
              }
              subtext={group.members}
            />
          ))}
        </div>
    )

}

export default PastGames;