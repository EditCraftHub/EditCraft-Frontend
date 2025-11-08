"use client";

import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, MessageSquare, CheckCheck, Trash2, Loader, ArrowRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // ✅ ADD THIS IMPORT
import io from 'socket.io-client';
import {
  useGetUserNotificationsQuery,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  notificationApiSlice
} from '../../Store/apiSclice/NotificationApiSlice';
import Link from 'next/link';

const ActivityCard = () => {
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ ADD THIS LINE
  const [isVisible, setIsVisible] = useState(false);
  const [clearAllConfirm, setClearAllConfirm] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const accessToken = useSelector(state => state.auth?.accessToken);
  const userId = useSelector(state => state.auth?.user?._id);

  // ✅ Fixed function with router
  const gouserId = (profileId) => {
    // Extract ID if an object is passed
    const userId = typeof profileId === 'string' 
      ? profileId 
      : profileId?._id || profileId?.id;
    
    if (!userId) {
      console.error('Invalid user ID:', profileId);
      return;
    }
    
    console.log('✅ Navigating to user:', userId);
    router.push(`/Pages/Main/profile/${userId}`); // ✅ Changed to push for better UX
  };

  // Queries & Mutations
  const { data: notificationData, isLoading, refetch } = useGetUserNotificationsQuery(
    { page: 1, limit: 100 },
    { skip: !accessToken }
  );

  const [markAllAsRead, { isLoading: isMarkingAllRead }] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const allNotifications = notificationData?.notifications || [];

  // Filter activity
  const notifications = allNotifications
    .filter(n => ['like', 'comment', 'reply', 'new_message'].includes(n.type))
    .slice(0, 5);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = allNotifications.filter(n => 
    ['like', 'comment', 'reply', 'new_message'].includes(n.type)
  ).length;

  // ===== SOCKET SETUP - REAL TIME UPDATES =====
  useEffect(() => {
    setIsVisible(true);
    if (!accessToken || !userId) return;

    console.log('🔌 Setting up socket connection...');

    const newSocket = io(
      process.env.NEXT_PUBLIC_API_URL?.replace('/v1/api', '') || 'http://localhost:5000',
      { 
        auth: { token: accessToken },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      }
    );

    // Connection Events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setSocketConnected(true);
    });

    // ===== NEW NOTIFICATION =====
    newSocket.on('notification', (data) => {
      console.log('🔔 New notification received:', data);
      dispatch(notificationApiSlice.util.invalidateTags(['Notifications', 'UnreadCount']));
      refetch();
    });

    newSocket.on('notificationRead', (data) => {
      console.log('✅ Notification read:', data);
      dispatch(notificationApiSlice.util.invalidateTags(['Notification', 'UnreadCount']));
      refetch();
    });

    newSocket.on('allNotificationsRead', () => {
      console.log('✅ All marked as read');
      dispatch(notificationApiSlice.util.invalidateTags(['Notifications', 'UnreadCount']));
      refetch();
    });

    newSocket.on('notificationDeleted', (data) => {
      console.log('🗑️ Notification deleted:', data);
      dispatch(notificationApiSlice.util.invalidateTags(['Notification', 'Notifications', 'UnreadCount']));
      refetch();
    });

    newSocket.on('allNotificationsDeleted', () => {
      console.log('🗑️ All notifications deleted');
      dispatch(notificationApiSlice.util.invalidateTags(['Notifications', 'UnreadCount']));
      refetch();
    });

    newSocket.on('unreadCleared', () => {
      console.log('🧹 Unread cleared');
      dispatch(notificationApiSlice.util.invalidateTags(['Notifications', 'UnreadCount']));
      refetch();
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setSocketConnected(false);
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket disconnected:', reason);
      setSocketConnected(false);
    });

    return () => {
      console.log('🔌 Closing socket connection');
      newSocket.disconnect();
      setSocketConnected(false);
    };
  }, [accessToken, userId, dispatch, refetch]);

  // ===== AUTO-REFRESH FALLBACK =====
  useEffect(() => {
    if (!accessToken || socketConnected) return;

    console.log('📡 Socket not connected, enabling auto-refresh fallback (10s)...');

    const pollInterval = setInterval(() => {
      console.log('🔄 Auto-refetching notifications...');
      refetch();
    }, 10000);

    return () => {
      console.log('🧹 Clearing auto-refresh interval');
      clearInterval(pollInterval);
    };
  }, [accessToken, socketConnected, refetch]);

  // Handlers
  const handleMarkAllAsRead = async () => {
    try {
      console.log('⏳ Marking all as read...');
      await markAllAsRead().unwrap();
      console.log('✅ All marked as read');
      refetch();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setDeletingAll(true);
      console.log('🗑️ Deleting all notifications...');
      for (const notification of notifications) {
        await deleteNotification(notification._id).unwrap();
      }
      setClearAllConfirm(false);
      console.log('✅ All deleted');
      refetch();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setDeletingAll(false);
    }
  };

  // Helpers
  const formatDistanceToNow = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = { day: 86400, hour: 3600, minute: 60 };
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) return `${interval}${unit.charAt(0)}`;
    }
    return 'now';
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'like': <Heart className="w-3 h-3 text-rose-400" fill="currentColor" />,
      'comment': <MessageCircle className="w-3 h-3 text-blue-400" />,
      'reply': <MessageCircle className="w-3 h-3 text-cyan-400" />,
      'new_message': <MessageSquare className="w-3 h-3 text-purple-400" />
    };
    return icons[type] || <Heart className="w-3 h-3 text-gray-400" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      'like': 'text-rose-400 bg-rose-500/20',
      'comment': 'text-blue-400 bg-blue-500/20',
      'reply': 'text-cyan-400 bg-cyan-500/20',
      'new_message': 'text-purple-400 bg-purple-500/20'
    };
    return colors[type] || 'text-gray-400 bg-gray-500/20';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'like': 'Liked',
      'comment': 'Commented',
      'reply': 'Replied',
      'new_message': 'Message'
    };
    return labels[type] || type;
  };

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div 
        className="bg-transparent backdrop-blur-2xl rounded-2xl border-2 border-white/20 overflow-hidden h-full relative"
        style={{
          boxShadow: '0 15px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 60px rgba(206,234,69,0.03)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#ceea45]/5 to-transparent">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#ceea45]" fill="currentColor" />
              <h2 className="text-lg font-bold text-white">Activity</h2>
              
              {/* Socket Status Indicator */}
              <div 
                className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-400 animate-pulse' : 'bg-yellow-500 animate-pulse'}`} 
                title={socketConnected ? 'Live (Socket)' : 'Polling (Fallback)'} 
              />
            </div>
            {unreadCount > 0 && (
              <div className="px-2 py-1 bg-[#ceea45]/20 border border-[#ceea45]/30 rounded-full animate-pulse">
                <span className="text-xs font-bold text-[#ceea45]">{unreadCount}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || isMarkingAllRead}
              className="flex-1 px-3 py-1.5 text-xs font-bold bg-[#ceea45]/20 hover:bg-[#ceea45]/30 border border-[#ceea45]/30 text-[#ceea45] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              {isMarkingAllRead ? (
                <Loader className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCheck className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">Read</span>
            </button>

            <button
              onClick={() => setClearAllConfirm(true)}
              disabled={totalCount === 0 || deletingAll}
              className="flex-1 px-3 py-1.5 text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              {deletingAll ? (
                <Loader className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader className="w-5 h-5 text-[#ceea45] animate-spin" />
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="text-center py-6">
              <Heart className="w-6 h-6 text-gray-600 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-gray-500">No activity yet</p>
            </div>
          )}

          {!isLoading && notifications.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-2.5 rounded-lg border transition-all animate-in fade-in-50 slide-in-from-top-2 ${
                    !notification.isRead 
                      ? 'border-[#ceea45]/30 bg-[#ceea45]/10' 
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {/* ✅ Fixed: Make entire notification clickable with proper cursor */}
                  <div 
                    onClick={() => gouserId(notification.sender?._id)} 
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={
                        notification.sender?.profilePic || 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.sender?.username || 'U')}&background=ceea45&color=000&size=32`
                      }
                      alt={notification.sender?.username || 'User'}
                      className="w-8 h-8 rounded-full border border-white/20 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-white truncate">
                          {notification.sender?.fullname || notification.sender?.username || 'Someone'}
                        </p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${getTypeColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                      
                      {(notification.comment?.content || notification.reply?.content) && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          "{notification.comment?.content || notification.reply?.content}"
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDistanceToNow(notification.createdAt)}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <div className="w-1.5 h-1.5 bg-[#ceea45] rounded-full flex-shrink-0 animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && totalCount > 0 && (
          <Link
            href="/Pages/Main/notifications"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-t border-white/10 text-xs font-bold text-[#ceea45] hover:bg-white/5 transition-all"
          >
            View All ({totalCount})
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Clear All Modal */}
      {clearAllConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-xl p-5 max-w-xs w-full">
            <h3 className="text-lg font-bold text-white mb-3">Clear All Activity?</h3>
            <p className="text-sm text-gray-400 mb-5">This will delete all {totalCount} activity items.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setClearAllConfirm(false)}
                disabled={deletingAll}
                className="flex-1 px-3 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deletingAll}
                className="flex-1 px-3 py-2 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingAll ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                    Clearing
                  </>
                ) : (
                  'Clear'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ActivityCard;