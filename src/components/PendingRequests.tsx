import ChatCard from "./ChatCard";

interface PendingProps {
  onClose?: () => void;
}

const PendingRequests = ({ onClose }: PendingProps) => {
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

  return (
    <div
  className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
  onClick={onClose} // clicking outside closes modal
>
  <div
    className="relative bg-white bg-opacity-20 text-white rounded-lg shadow-lg w-[400px] max-w-full pb-6"
    onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
  >
    {/* Header bar with fixed height */}
    <div className="relative bg-black rounded-t-lg">
      {/* Close button hanging above top right corner */}
      <button
        onClick={onClose}
        className="absolute -top-4 -right-4 bg-white rounded-full px-2  shadow-lg text-black text-2xl font-bold hover:text-gray-700 focus:outline-none z-10"
        aria-label="Close"
      >
        &times;
      </button>

      <div className="flex justify-center p-2 font-semibold text-lg">
        Pending Requests
      </div>
    </div>

    {/* Content below header */}
    {dummyNotifications.map((n) => (
      <ChatCard
        key={n.id}
        label={n.text}
        count={1}
        time="2:00 PM"
        onClick={() => console.log("ChatCard clicked", n.id)}
        actions={n.actions}
        onAccept={() => console.log("Accepted", n.id)}
        onDecline={() => console.log("Declined", n.id)}
      />
    ))}
  </div>
</div>




      

      
    
  );
};

export default PendingRequests;
