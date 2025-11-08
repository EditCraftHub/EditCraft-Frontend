// app/components/SocketStatusManager.js
'use client';

import useSocket from "@/app/hooks/useSocket";
import { useEffect } from "react";
import { useSelector } from "react-redux";

/**
 * This component manages user online status globally across all pages
 */
const SocketStatusManager = ({ children }) => {
  const { socket } = useSocket();
  
  // Get user AND isAuthenticated from Redux
  const user = useSelector((state) => state.auth?.user);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Socket not connected yet");
      return;
    }

    if (!isAuthenticated || !user?.id) {
      console.log("⚠️ User not authenticated yet. User:", user, "Auth:", isAuthenticated);
      return;
    }

    const userName = user.fullname || user.name || "User";
    console.log("👤 User logged in:", userName);
    console.log("✅ Emitting user status as online");

    // Emit that user is online when they log in
    socket.emit("userOnline", {
      userId: user.id, // Use 'id' not '_id'
      name: userName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
      accountType: user.accountType,
    });

    // Emit heartbeat every 30s to keep user marked as online
    const heartbeatInterval = setInterval(() => {
      socket.emit("userHeartbeat", { userId: user.id }); // Use 'id' not '_id'
    }, 30000);

    // Cleanup: Tell server user is offline when they leave
    return () => {
      clearInterval(heartbeatInterval);
      socket.emit("userOffline", { userId: user.id }); // Use 'id' not '_id'
    };
  }, [socket, user, isAuthenticated]);

  return <>{children}</>;
};

export default SocketStatusManager;