// hooks/useSocket.js
'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setSocketConnected,
  setError
} from '../app/Store/Sclies/messageSlice';

/**
 * Main socket connection hook
 */
export const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  const activityIntervalRef = useRef(null);

  const connect = useCallback(() => {
    if (!user?._id || !accessToken || socketRef.current?.connected) {
      console.warn('⚠️ Cannot connect - missing user or token');
      return;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    console.log('🔌 Connecting to socket...');
    socketRef.current = io(SOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    // ==================== CONNECTION EVENTS ====================

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      dispatch(setSocketConnected(true));

      // Start activity heartbeat
      activityIntervalRef.current = setInterval(() => {
        if (socket?.connected) {
          socket.emit('getOnlineUsers');
        }
      }, 30000);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      dispatch(setSocketConnected(false));

      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
        activityIntervalRef.current = null;
      }
    });

    socket.on('reconnect', () => {
      console.log('🔄 Socket reconnected');
      dispatch(setSocketConnected(true));
      socket.emit('getOnlineUsers');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      dispatch(setError('Connection error: ' + error.message));
    });

    // ==================== USER STATUS EVENTS ====================

    /**
     * Receive initial list of online users
     */
    socket.on('onlineUsers', (userIds) => {
      console.log('📊 Online users:', userIds);
      dispatch(setOnlineUsers(userIds || []));
    });

    /**
     * Listen for individual user status changes
     */
    socket.on('userStatusChange', ({ userId, status, isOnline }) => {
      console.log(`👤 User ${userId} status changed to ${status}`);

      if (isOnline) {
        dispatch(addOnlineUser(userId));
      } else {
        dispatch(removeOnlineUser(userId));
      }
    });

    socket.on('userOnline', ({ userId }) => {
      console.log(`🟢 User online: ${userId}`);
      dispatch(addOnlineUser(userId));
    });

    socket.on('userOffline', ({ userId }) => {
      console.log(`🔴 User offline: ${userId}`);
      dispatch(removeOnlineUser(userId));
    });

    // ==================== ERROR HANDLING ====================

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      dispatch(setError(typeof error === 'string' ? error : error?.message));
    });

    return socket;
  }, [user?._id, accessToken, dispatch]);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting socket...');
    socketRef.current?.disconnect();
    socketRef.current = null;

    if (activityIntervalRef.current) {
      clearInterval(activityIntervalRef.current);
      activityIntervalRef.current = null;
    }
    dispatch(setSocketConnected(false));
  }, [dispatch]);

  const updateStatus = useCallback((status) => {
    if (socketRef.current?.connected) {
      console.log(`📤 Updating status to: ${status}`);
      socketRef.current.emit('updateStatus', { status });
    }
  }, []);

  const getOnlineUsers = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('getOnlineUsers');
    }
  }, []);

  /**
   * Auto-connect when user is available
   */
  useEffect(() => {
    if (user?._id && accessToken) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user?._id, accessToken, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    connect,
    disconnect,
    updateStatus,
    getOnlineUsers,
  };
};

export default useSocket;