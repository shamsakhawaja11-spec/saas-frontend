import { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUnreadCount, useNotifications, useMarkOneAsRead, useMarkAllAsRead } from '../../hooks/useNotifications';
import { NotificationType } from '../../types/notification.types';
import type{ Notification } from '../../types/notification.types';


// Icon and color per notification type
const typeConfig: Record<string, { label: string; color: string }> = {
  [NotificationType.TASK_ASSIGNED]: { label: 'Task Assigned', color: 'text-violet-400' },
  [NotificationType.COMMENT_ADDED]: { label: 'Comment Added', color: 'text-blue-400' },
  [NotificationType.TASK_STATUS_CHANGED]: { label: 'Status Changed', color: 'text-yellow-400' },
  [NotificationType.TASK_DUE_SOON]: { label: 'Due Soon', color: 'text-red-400' },
};

export const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: countData } = useUnreadCount();
  const { data: notifications, isLoading } = useNotifications();
  const markOne = useMarkOneAsRead();
  const markAll = useMarkAllAsRead();

  const unreadCount = countData?.count ?? 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkOne = (notification: Notification) => {
    if (!notification.isRead) {
      markOne.mutate(notification.id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}
                className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition disabled:opacity-50"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col gap-3 p-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-zinc-700 mt-2 shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-3 bg-zinc-700 rounded w-3/4" />
                      <div className="h-3 bg-zinc-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications?.length === 0 ? (
              <div className="text-zinc-600 text-sm text-center py-8">
                No notifications yet.
              </div>
            ) : (
              notifications?.map((notification: Notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkOne(notification)}
                  className={`flex gap-3 px-4 py-3 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800 transition ${
                    !notification.isRead ? 'bg-zinc-800/50' : ''
                  }`}
                >
                  {/* Unread dot */}
                  <div className="mt-1.5 shrink-0">
                    {!notification.isRead ? (
                      <div className="w-2 h-2 rounded-full bg-violet-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Type label */}
                    <span className={`text-xs font-semibold ${typeConfig[notification.type]?.color ?? 'text-zinc-400'}`}>
                      {typeConfig[notification.type]?.label ?? notification.type}
                    </span>

                    {/* Message */}
                    <p className="text-sm text-zinc-300 mt-0.5 leading-snug">
                      {notification.message}
                    </p>

                    {/* Time */}
                    <div className="flex items-center gap-1 mt-1">
                      <Clock size={11} className="text-zinc-600" />
                      <span className="text-xs text-zinc-600">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                      {notification.isRead && (
                        <Check size={11} className="text-zinc-600 ml-1" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
};