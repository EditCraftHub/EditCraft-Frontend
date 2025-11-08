// store/slices/messageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  currentChat: null,
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  searchResults: [],
  loading: false,
  error: null,
  socketConnected: false,
  lastMessageSent: null,
};

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // ==================== CHATS ====================
    
    setChats: (state, action) => {
      state.chats = action.payload;
    },

    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },

    addChat: (state, action) => {
      const exists = state.chats.find(chat => chat._id === action.payload._id);
      if (!exists) {
        state.chats.unshift(action.payload);
      }
    },

    updateChat: (state, action) => {
      const index = state.chats.findIndex(chat => chat._id === action.payload._id);
      if (index !== -1) {
        state.chats[index] = action.payload;
      }
    },

    // ==================== MESSAGES ====================

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
      state.lastMessageSent = action.payload;
    },

    prependMessages: (state, action) => {
      state.messages = [...action.payload, ...state.messages];
    },

    updateMessage: (state, action) => {
      const index = state.messages.findIndex(msg => msg.messageId === action.payload.messageId);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...action.payload };
      }
    },

    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.messageId !== action.payload);
    },

    markMessageAsRead: (state, action) => {
      const message = state.messages.find(msg => msg.messageId === action.payload);
      if (message) {
        message.read = true;
        message.readAt = new Date();
      }
    },

    markAllMessagesAsRead: (state, action) => {
      state.messages = state.messages.map(msg => ({
        ...msg,
        read: true,
        readAt: new Date()
      }));
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    // ==================== SEARCH ====================

    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },

    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    // ==================== ONLINE USERS ====================

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },

    // ==================== TYPING INDICATORS ====================

    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },

    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(id => id !== action.payload);
    },

    clearTypingUsers: (state) => {
      state.typingUsers = [];
    },

    // ==================== SOCKET STATUS ====================

    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },

    // ==================== LOADING & ERROR ====================

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    resetMessages: (state) => {
      return initialState;
    }
  }
});

export const {
  setChats,
  setCurrentChat,
  addChat,
  updateChat,
  setMessages,
  addMessage,
  prependMessages,
  updateMessage,
  deleteMessage,
  markMessageAsRead,
  markAllMessagesAsRead,
  clearMessages,
  setSearchResults,
  clearSearchResults,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
  setSocketConnected,
  setLoading,
  setError,
  clearError,
  resetMessages
} = messageSlice.actions;

export default messageSlice.reducer;