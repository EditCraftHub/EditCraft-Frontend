import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  onlineUsers: [], // Array of user IDs who are online
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    
    setUserOnline: (state, action) => {
      const userId = action.payload;
      if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },
    
    setUserOffline: (state, action) => {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
    },
    
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    
    clearSocket: (state) => {
      state.isConnected = false;
      state.onlineUsers = [];
    }
  }
});

export const {
  setConnected,
  setUserOnline,
  setUserOffline,
  setOnlineUsers,
  clearSocket
} = socketSlice.actions;

export default socketSlice.reducer;