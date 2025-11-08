"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, Check, CheckCheck, Heart, MessageCircle, UserPlus, Share2, 
  Sparkles, Trash2, Search, X, Loader, User, ExternalLink 
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import {
  useGetUserNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  notificationApiSlice
} from '../../Store/apiSclice/NotificationApiSlice';

const NotificationSystemPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [clearAllConfirm, setClearAllConfirm] = useState(false);
  const [socket, setSocket] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const accessToken = useSelector(state => state.auth?.accessToken);

  // ===== REDUX QUERIES & MUTATIONS =====
  
  const { data: notificationData, isLoading, error, refetch } = useGetUserNotificationsQuery(
    { page: 1, limit: 50 },
    { skip: !accessToken }
  );

  const { data: unreadData } = useGetUnreadCountQuery(
    undefined,
    { skip: !accessToken }
  );

  // Mutations
  const [markAsRead, { isLoading: isMarkingRead }] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAllRead }] = useMarkAllAsReadMutation();
  const [deleteNotification, { isLoading: isDeleteNotificationLoading }] = useDeleteNotificationMutation();

  const notifications = notificationData?.notifications || [];
  const unreadCount = unreadData?.unreadCount || 0;

  // ===== NAVIGATION HANDLERS =====

  const handleNavigateToProfile = (userId, username) => {
    if (!userId) return;
    if (username) {
      router.push(`/Pages/Main/profile/${userId}`)
    } else {
      router.push(`/Pages/Main/profile/${userId}`)
    }
  };

  const handleNavigateToPost = (postId) => {
    if (!postId) return;
    router.push(`/Pages/Main/post/${postId}`);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read first
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.type === 'new_message' || notification.type === 'first_message') {
      const senderId = notification.sender?._id || notification.sender;
      const senderUsername = notification.sender?.username;
      if (senderId) {
        router.push(`/Pages/Main/messages?userId=${senderId}`);
      }
    } else if (notification.post?._id) {
      handleNavigateToPost(notification.post._id);
    } else if (notification.sender?._id) {
      handleNavigateToProfile(notification.sender._id, notification.sender.username);
    }
  };

  // ===== SOCKET SETUP =====
  
  useEffect(() => {
    setIsVisible(true);

    if (!accessToken) return;

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

    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    newSocket.on('notification', (newNotification) => {
      console.log('🔔 New notification:', newNotification);
      dispatch(notificationApiSlice.util.invalidateTags([
        { type: 'Notifications', id: 'LIST' },
        { type: 'UnreadCount', id: 'COUNT' }
      ]));
      refetch();
    });

    newSocket.on('notificationRead', (data) => {
      console.log('✅ Notification read:', data);
      dispatch(notificationApiSlice.util.invalidateTags([
        { type: 'UnreadCount', id: 'COUNT' }
      ]));
      refetch();
    });

    newSocket.on('notificationDeleted', (data) => {
      console.log('🗑️ Notification deleted:', data);
      dispatch(notificationApiSlice.util.invalidateTags([
        { type: 'Notifications', id: 'LIST' }
      ]));
      refetch();
    });

    newSocket.on('allNotificationsDeleted', () => {
      console.log('🗑️ All notifications deleted');
      dispatch(notificationApiSlice.util.invalidateTags([
        { type: 'Notifications', id: 'LIST' },
        { type: 'UnreadCount', id: 'COUNT' }
      ]));
      refetch();
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken, dispatch, refetch]);

  // ===== HANDLERS =====

  const handleMarkAsRead = async (notificationId) => {
    try {
      console.log('⏳ Marking as read:', notificationId);
      await markAsRead(notificationId).unwrap();
      console.log('✅ Successfully marked as read:', notificationId);
    } catch (error) {
      console.error('❌ Error marking as read:', {
        notificationId,
        status: error?.status,
        data: error?.data,
        message: error?.data?.message || error?.message
      });
      alert(`Error: ${error?.data?.message || 'Failed to mark as read'}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      console.log('⏳ Marking all as read...');
      await markAllAsRead().unwrap();
      console.log('✅ Successfully marked all as read');
      refetch();
    } catch (error) {
      console.error('❌ Error marking all as read:', {
        status: error?.status,
        data: error?.data,
        message: error?.data?.message || error?.message
      });
      alert(`Error: ${error?.data?.message || 'Failed to mark all as read'}`);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      console.log('⏳ Deleting notification:', notificationId);
      setDeletingId(notificationId);
      
      await deleteNotification(notificationId).unwrap();
      
      console.log('✅ Successfully deleted notification:', notificationId);
      setDeleteConfirm(null);
      setDeletingId(null);
      refetch();
    } catch (error) {
      console.error('❌ Error deleting notification:', {
        notificationId,
        status: error?.status,
        data: error?.data,
        message: error?.data?.message || error?.message
      });
      alert(`Error: ${error?.data?.message || 'Failed to delete notification'}`);
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    try {
      console.log('⏳ Deleting all notifications...');
      console.log(`📊 Total notifications to delete: ${notifications.length}`);
      
      setDeletingId('all');
      
      let deletedCount = 0;
      let errorCount = 0;

      for (const notification of notifications) {
        try {
          await deleteNotification(notification._id).unwrap();
          deletedCount++;
          console.log(`✅ Deleted ${deletedCount}/${notifications.length}`);
        } catch (err) {
          errorCount++;
          console.error(`❌ Failed to delete ${notification._id}:`, err);
        }
      }

      console.log(`✅ Deletion complete: ${deletedCount} deleted, ${errorCount} failed`);
      
      setDeletingId(null);
      setClearAllConfirm(false);
      refetch();

      if (errorCount > 0) {
        alert(`Deleted ${deletedCount} notifications, but ${errorCount} failed`);
      } else {
        alert('All notifications deleted successfully');
      }
    } catch (error) {
      console.error('❌ Error during delete all:', error);
      alert(`Error: ${error?.data?.message || 'Failed to delete all'}`);
      setDeletingId(null);
    }
  };

  // ===== HELPERS =====

  const formatDistanceToNow = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'like': <Heart className="w-4 h-4 text-rose-400" fill="currentColor" />,
      'comment': <MessageCircle className="w-4 h-4 text-blue-400" />,
      'reply': <MessageCircle className="w-4 h-4 text-cyan-400" />,
      'new_message': <MessageCircle className="w-4 h-4 text-purple-400" />,
      'first_message': <UserPlus className="w-4 h-4 text-yellow-400" />,
      'new_post': <Share2 className="w-4 h-4 text-green-400" />
    };
    return icons[type] || <Bell className="w-4 h-4 text-gray-400" />;
  };

  const getNotificationBgColor = (type) => {
    const colors = {
      'like': 'bg-rose-500/10 border-rose-500/30',
      'comment': 'bg-blue-500/10 border-blue-500/30',
      'reply': 'bg-cyan-500/10 border-cyan-500/30',
      'new_message': 'bg-purple-500/10 border-purple-500/30',
      'first_message': 'bg-yellow-500/10 border-yellow-500/30',
      'new_post': 'bg-green-500/10 border-green-500/30'
    };
    return colors[type] || 'bg-white/10 border-white/20';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'like': '❤️ Likes',
      'comment': '💬 Comments',
      'reply': '↩️ Replies',
      'new_message': '💌 Messages',
      'first_message': '👋 Connection',
      'new_post': '📝 Posts'
    };
    return labels[type] || type;
  };

  // ===== FILTER NOTIFICATIONS =====

  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (filter === 'unread') {
      result = result.filter(n => !n.isRead);
    } else if (filter === 'read') {
      result = result.filter(n => n.isRead);
    }

    if (typeFilter !== 'all') {
      result = result.filter(n => n.type === typeFilter);
    }

    if (searchQuery) {
      result = result.filter(n =>
        n.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sender?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.sender?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [notifications, filter, typeFilter, searchQuery]);

  const readCount = notifications.filter(n => n.isRead).length;

  return (
    <div className="min-h-screen bg-transparent text-white overflow-y-auto overflow-x-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 md:w-96 md:h-96 bg-[#ceea45]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 md:w-96 md:h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 md:w-96 md:h-96 bg-pink-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        
        {/* Header Section */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div 
            className="bg-transparent backdrop-blur-2xl rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden mb-6"
            style={{
              boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
            }}
          >
            <div className="p-6 sm:p-8">
              {/* Title & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent flex items-center gap-3 mb-2">
                    <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-[#ceea45]" />
                    Notifications
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {unreadCount > 0 ? (
                      <span className="font-bold text-[#ceea45]">
                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#ceea45]" />
                        You're all caught up!
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0 || isMarkingAllRead}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-xl font-bold hover:from-[#b8d93c] hover:to-[#ceea45] disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#ceea45]/50 hover:scale-105 disabled:hover:scale-100"
                  >
                    {isMarkingAllRead ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCheck className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">Mark All Read</span>
                    <span className="sm:hidden">All Read</span>
                  </button>

                  <button
                    onClick={() => setClearAllConfirm(true)}
                    disabled={notifications.length === 0 || deletingId === 'all'}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl font-bold hover:from-red-500 hover:to-rose-500 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-rose-500/50 hover:scale-105 disabled:hover:scale-100"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Clear All</span>
                    <span className="sm:hidden">Clear</span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ceea45] transition-all"
                  />
                </div>
              </div>

              {/* Filter Tabs - Status */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2 uppercase font-bold">Status</p>
                <div className="flex gap-2 bg-white/5 backdrop-blur-xl rounded-xl p-1.5 border-2 border-white/20">
                  <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm sm:text-base transition-all ${
                      filter === 'all' 
                        ? 'bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm sm:text-base transition-all ${
                      filter === 'unread' 
                        ? 'bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-sm sm:text-base transition-all ${
                      filter === 'read' 
                        ? 'bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Read ({readCount})
                  </button>
                </div>
              </div>

              {/* Filter Tabs - Type */}
              <div>
                <p className="text-xs text-gray-400 mb-2 uppercase font-bold">Type</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                      typeFilter === 'all' 
                        ? 'bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black shadow-lg' 
                        : 'bg-white/5 border-2 border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    All Types
                  </button>
                  {['like', 'comment', 'reply', 'new_message', 'first_message', 'new_post'].map(type => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`px-4 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                        typeFilter === type 
                          ? 'bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black shadow-lg' 
                          : 'bg-white/5 border-2 border-white/20 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {getTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border-2 border-white/20 p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-[#ceea45] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading notifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-rose-500/10 backdrop-blur-2xl border-2 border-rose-500/30 rounded-3xl p-6 text-rose-400">
              <p className="font-bold text-lg mb-2">Error loading notifications</p>
              <p className="text-sm text-gray-400">{error?.data?.message || 'Something went wrong'}</p>
              <button 
                onClick={() => refetch()}
                className="mt-4 px-6 py-2 bg-rose-500/20 hover:bg-rose-500/30 border-2 border-rose-500/30 rounded-xl font-bold transition-all"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredNotifications.length === 0 && (
            <div 
              className="bg-white/10 backdrop-blur-2xl rounded-3xl border-2 border-white/20 p-12 sm:p-16 text-center"
              style={{
                boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
              }}
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/20">
                <Bell size={48} className="text-gray-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">No notifications</h3>
              <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
                {filter === 'unread' && "You don't have any unread notifications"}
                {filter === 'read' && "You don't have any read notifications"}
                {filter === 'all' && "You don't have any notifications yet"}
              </p>
            </div>
          )}

          {/* Notifications Grid */}
          {!isLoading && filteredNotifications.map((notification, index) => (
            <div
              key={notification._id}
              className={`group bg-white/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border-2 overflow-hidden transition-all hover:scale-[1.01] hover:shadow-2xl ${
                !notification.isRead 
                  ? 'border-[#ceea45]/50 shadow-lg shadow-[#ceea45]/20' 
                  : 'border-white/20 hover:border-white/30'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                boxShadow: !notification.isRead 
                  ? '0 10px 40px rgba(206,234,69,0.2), 0 0 0 1px rgba(206,234,69,0.3)' 
                  : '0 10px 40px rgba(0,0,0,0.2)',
                opacity: deletingId === notification._id ? 0.5 : 1
              }}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Avatar & Icon */}
                  <div className="relative flex-shrink-0 group/avatar">
                    <div 
                      onClick={() => handleNavigateToProfile(notification.sender?._id, notification.sender?.username)}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/20 group-hover/avatar:border-[#ceea45]/50 transition-all cursor-pointer"
                    >
                      <img
                        src={
                          notification.sender?.profilePic || 
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.sender?.username || 'User')}&background=ceea45&color=000`
                        }
                        alt={notification.sender?.username || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-lg border-2 ${getNotificationBgColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <p className="text-sm sm:text-base text-white leading-relaxed">
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToProfile(notification.sender?._id, notification.sender?.username);
                            }}
                            className="font-bold hover:text-[#ceea45] transition-colors cursor-pointer"
                          >
                            {notification.sender?.fullname || notification.sender?.username || 'Someone'}
                          </span>
                          {' '}
                          <span className="text-gray-300">{notification.content || 'interacted with your content'}</span>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex-shrink-0 flex gap-2">
                        {/* View Profile Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToProfile(notification.sender?._id, notification.sender?.username);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 sm:p-2.5 bg-[#ceea45]/20 hover:bg-[#ceea45]/30 border-2 border-[#ceea45]/30 text-[#ceea45] rounded-lg hover:scale-110"
                          title="View Profile"
                        >
                          <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {!notification.isRead ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification._id);
                            }}
                            disabled={isMarkingRead || deletingId === notification._id}
                            className="p-2 sm:p-2.5 bg-[#ceea45]/20 hover:bg-[#ceea45]/30 border-2 border-[#ceea45]/30 text-[#ceea45] rounded-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as read"
                          >
                            {isMarkingRead && deletingId === notification._id ? (
                              <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded-lg border border-white/20">
                            <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          </div>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(notification._id);
                          }}
                          disabled={deletingId === notification._id || isDeleteNotificationLoading}
                          className="p-2 sm:p-2.5 bg-rose-500/20 hover:bg-rose-500/30 border-2 border-rose-500/30 text-rose-400 rounded-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          {deletingId === notification._id ? (
                            <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Comment/Reply Preview */}
                    {notification.comment?.content && (
                      <div 
                        onClick={() => handleNotificationClick(notification)}
                        className="mt-3 p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <p className="text-xs sm:text-sm text-gray-400 italic line-clamp-2">
                          "{notification.comment.content}"
                        </p>
                      </div>
                    )}

                    {notification.reply?.content && (
                      <div 
                        onClick={() => handleNotificationClick(notification)}
                        className="mt-3 p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
                      >
                        <p className="text-xs sm:text-sm text-gray-400 italic line-clamp-2">
                          "{notification.reply.content}"
                        </p>
                      </div>
                    )}
                    
                    {/* Post Reference */}
                    {notification.post?.title && (
                      <div 
                        onClick={() => handleNavigateToPost(notification.post._id)}
                        className="mt-2 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <span className="text-xs sm:text-sm text-gray-500">on post:</span>
                        <span className="text-xs sm:text-sm font-bold text-[#ceea45] truncate">
                          {notification.post.title}
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#ceea45]" />
                      </div>
                    )}
                    
                    {/* Timestamp & Read Indicator */}
                    <div className="flex items-center gap-3 mt-3">
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        {notification.createdAt 
                          ? formatDistanceToNow(notification.createdAt)
                          : 'Just now'
                        }
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-[#ceea45] rounded-full animate-pulse shadow-lg shadow-[#ceea45]/50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        {!isLoading && notifications.length > 0 && (
          <div className="mt-6 bg-white/10 backdrop-blur-2xl rounded-2xl border-2 border-white/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <span className="font-medium">
                Showing <span className="text-[#ceea45] font-bold">{filteredNotifications.length}</span> of <span className="text-white font-bold">{notifications.length}</span> notifications
              </span>
              <button
                onClick={() => refetch()}
                className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-[#ceea45]/50 rounded-xl font-bold text-white transition-all hover:scale-105"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-2xl p-6 sm:p-8 max-w-sm w-full animate-in fade-in-50 duration-200">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Delete Notification?</h3>
            <p className="text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deletingId === deleteConfirm}
                className="flex-1 px-4 py-2 bg-white/10 border-2 border-white/20 hover:bg-white/20 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNotification(deleteConfirm)}
                disabled={deletingId === deleteConfirm}
                className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-lg font-bold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deletingId === deleteConfirm ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {clearAllConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-2xl p-6 sm:p-8 max-w-sm w-full animate-in fade-in-50 duration-200">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Clear All Notifications?</h3>
            <p className="text-gray-400 mb-6">This will delete all {notifications.length} notifications. This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setClearAllConfirm(false)}
                disabled={deletingId === 'all'}
                className="flex-1 px-4 py-2 bg-white/10 border-2 border-white/20 hover:bg-white/20 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deletingId === 'all'}
                className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deletingId === 'all' ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  'Clear All'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotificationSystemPage;