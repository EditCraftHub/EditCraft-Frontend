// app/hooks/useSocket.js
'use client';

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

let socketInstance = null;
let connectionCount = 0;
let onlineUsersCache = [];

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]); // ✅ NEW
  const [unreadCount, setUnreadCount] = useState(0); // ✅ NEW
  const [isConnected, setIsConnected] = useState(false);
  const isMountedRef = useRef(true);
  const onlineUsersTimeoutRef = useRef(null);
  const notificationsRef = useRef([]); // ✅ Cache notifications

  useEffect(() => {
    isMountedRef.current = true;
    connectionCount++;

    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId"); // ✅ Get user ID
    
    if (!token) {
      console.warn("⚠️ No access token found for socket connection");
      return;
    }

    if (!socketInstance || socketInstance.disconnected) {
      console.log("🔌 Creating new socket connection...");
      
      socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
        auth: { accessToken: token },
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      socketInstance.on("connect", () => {
        console.log("✅ Socket connected:", socketInstance.id);
        
        // ✅ Emit user online event
        if (userId) {
          socketInstance.emit("userOnline", {
            userId: userId,
            name: localStorage.getItem("userName"),
            email: localStorage.getItem("userEmail"),
            profilePic: localStorage.getItem("userProfilePic"),
          });
          console.log("📍 Emitted userOnline event");
        }
        
        if (isMountedRef.current) {
          setIsConnected(true);
        }
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
        if (isMountedRef.current) {
          setIsConnected(false);
        }
      });

      socketInstance.on("connect_error", (error) => {
        console.error("🔴 Socket connection error:", error.message);
      });

      // ✅ NEW: Listen to notifications
      socketInstance.on("notification", (notification) => {
        console.log("🔔 New notification received:", notification);
        
        if (isMountedRef.current) {
          notificationsRef.current = [notification, ...notificationsRef.current];
          setNotifications(notificationsRef.current);
          
          // Update unread count
          const unread = notificationsRef.current.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        }
      });

      // ✅ NEW: Listen to notification read status
      socketInstance.on("notificationRead", (data) => {
        console.log("📖 Notification marked as read:", data.notificationId);
        
        if (isMountedRef.current) {
          notificationsRef.current = notificationsRef.current.map(n =>
            n._id === data.notificationId ? { ...n, isRead: true, readAt: data.readAt } : n
          );
          setNotifications([...notificationsRef.current]);
          
          const unread = notificationsRef.current.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        }
      });

      // ✅ NEW: Listen to all notifications read
      socketInstance.on("allNotificationsRead", () => {
        console.log("📖 All notifications marked as read");
        
        if (isMountedRef.current) {
          notificationsRef.current = notificationsRef.current.map(n => ({ ...n, isRead: true }));
          setNotifications([...notificationsRef.current]);
          setUnreadCount(0);
        }
      });

      // ✅ NEW: Listen to notification deletion
      socketInstance.on("notificationDeleted", (data) => {
        console.log("🗑️ Notification deleted:", data.notificationId);
        
        if (isMountedRef.current) {
          notificationsRef.current = notificationsRef.current.filter(n => n._id !== data.notificationId);
          setNotifications([...notificationsRef.current]);
          
          const unread = notificationsRef.current.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        }
      });

      // ✅ NEW: Heartbeat to stay online
      const heartbeatInterval = setInterval(() => {
        if (socketInstance && socketInstance.connected && userId) {
          socketInstance.emit("userHeartbeat", { userId });
        }
      }, 30000); // Every 30 seconds

      socketInstance.on("disconnect", () => {
        clearInterval(heartbeatInterval);
      });

      socketInstance.on("onlineUsers", (users) => {
        console.log("🟢 Online Users received:", users);
        
        if (onlineUsersTimeoutRef.current) {
          clearTimeout(onlineUsersTimeoutRef.current);
        }
        
        onlineUsersCache = Array.isArray(users) ? users : [];
        
        onlineUsersTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setOnlineUsers(onlineUsersCache);
          }
        }, 100);
      });
    } else {
      console.log("♻️ Reusing existing socket connection:", socketInstance.id);
      setIsConnected(socketInstance.connected);
      
      if (onlineUsersCache.length > 0 && isMountedRef.current) {
        setOnlineUsers(onlineUsersCache);
      }
    }

    setSocket(socketInstance);

    return () => {
      isMountedRef.current = false;
      connectionCount--;

      if (onlineUsersTimeoutRef.current) {
        clearTimeout(onlineUsersTimeoutRef.current);
      }

      console.log(`🔄 Component unmounting. Active connections: ${connectionCount}`);

      if (connectionCount === 0 && socketInstance) {
        console.log("🔌 Disconnecting socket (no active components)");
        socketInstance.disconnect();
        socketInstance = null;
        onlineUsersCache = [];
        notificationsRef.current = [];
      }
    };
  }, []);

  const checkUserOnline = (userId) => {
    if (!userId) return false;
    const userIdStr = userId.toString();
    return onlineUsersCache.some(user => {
      const onlineUserId = user?._id?.toString() || user?.id?.toString() || user?.toString();
      return onlineUserId === userIdStr;
    });
  };

  // ✅ NEW: Helper functions
  const markNotificationAsRead = (notificationId) => {
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit("markNotificationRead", { notificationId });
    }
  };

  const markAllNotificationsAsRead = () => {
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit("markAllNotificationsRead", { userId: localStorage.getItem("userId") });
    }
  };

  return {
    socket,
    onlineUsers,
    isConnected,
    checkUserOnline,
    notifications, // ✅ NEW
    unreadCount, // ✅ NEW
    markNotificationAsRead, // ✅ NEW
    markAllNotificationsAsRead, // ✅ NEW
  };
};

export default useSocket;