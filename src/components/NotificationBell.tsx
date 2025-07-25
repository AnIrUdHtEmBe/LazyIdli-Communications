// components/NotificationBell.tsx
import { Bell } from "lucide-react";

interface NotificationBellProps {
  hasNotification?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function NotificationBell({ hasNotification = false, onClick, className }: NotificationBellProps) {
  return (
    <div className={`relative ${className}`}>
      <button onClick={onClick}>
        <Bell className="h-5 w-5 text-gray-700" />
      </button>
      {hasNotification && (
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
      )}
    </div>
  );
}
