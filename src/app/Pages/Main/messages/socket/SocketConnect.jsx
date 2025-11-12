"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Search, ArrowLeft, Smile, X, MessageCircle, Sparkles, User, ExternalLink } from "lucide-react";
import { useGetUserChatsQuery, useGetMessagesQuery, useSendMessageMutation, useGetOrCreateChatMutation } from "@/app/Store/apiSclice/messageApiSlice";
import { useGetAllUsersQuery, useMyProfileQuery } from "@/app/Store/apiSclice/UserApiSlice";
import useSocket from "@/app/hooks/useSocket";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const ChatPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { socket, onlineUsers } = useSocket();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isAutoScrollRef = useRef(true);
  
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [liveMessages, setLiveMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const { data: myProfileData } = useMyProfileQuery();
  const { data: chatsData, refetch: refetchChats } = useGetUserChatsQuery();
  const { data: allUsersData } = useGetAllUsersQuery();
  const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery(

    


    { chatId: selectedChat?._id },
    { skip: !selectedChat?._id }
  );
  
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [getOrCreateChat] = useGetOrCreateChatMutation();





  const currentUser = myProfileData?.yourProfile;
  const conversations = chatsData?.chats || [];
  const allUsers = allUsersData?.users || [];

  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Message combining logic
  const apiMessages = messagesData?.messages || [];
  const uniqueLiveMessages = liveMessages.filter(liveMsg => {
    if (liveMsg.isTemp) return true;
    return !apiMessages.some(apiMsg => apiMsg._id === liveMsg._id);
  });
  
  const messageMap = new Map();
  apiMessages.forEach(msg => {
    if (msg._id) messageMap.set(msg._id, msg);
  });
  uniqueLiveMessages.forEach(msg => {
    if (msg._id && !messageMap.has(msg._id)) messageMap.set(msg._id, msg);
  });
  
  const allMessages = Array.from(messageMap.values()).sort((a, b) => {
    const timeA = new Date(a.sentAt || a.timestamp || 0).getTime();
    const timeB = new Date(b.sentAt || b.timestamp || 0).getTime();
    return timeA - timeB;
  });

  const getSenderId = (sender) => {
    if (typeof sender === 'string') return sender;
    return sender?._id || sender?.id;
  };

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪'];

  const scrollToBottom = (force = false) => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (force || isAutoScrollRef.current || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    isAutoScrollRef.current = isNearBottom;
  };

  useEffect(() => { scrollToBottom(); }, [allMessages.length]);
  useEffect(() => {
    if (selectedChat) {
      isAutoScrollRef.current = true;
      setTimeout(() => scrollToBottom(true), 100);
    }
  }, [selectedChat?._id]);

  useEffect(() => { setLiveMessages([]); }, [selectedChat?._id]);

  useEffect(() => {
    if (!selectedChat?._id) return;
    const interval = setInterval(() => refetchMessages(), 5000);
    return () => clearInterval(interval);
  }, [selectedChat?._id, refetchMessages]);

  useEffect(() => {
    if (!messagesData?.messages) return;
    setLiveMessages(prev => prev.filter(liveMsg => {
      if (liveMsg.isTemp) return true;
      return !messagesData.messages.some(apiMsg => apiMsg._id === liveMsg._id);
    }));
  }, [messagesData?.messages]);

  useEffect(() => {
  const chatIdFromUrl = searchParams.get('chatId');
  
  if (chatIdFromUrl && chatsData?.chats) {
    console.log("🎯 Looking for chat:", chatIdFromUrl);
    
    // Find the chat in the list
    const targetChat = chatsData.chats.find(
      chat => chat._id === chatIdFromUrl || chat.chatId === chatIdFromUrl
    );
    
    if (targetChat) {
      console.log("✅ Auto-opening chat:", targetChat);
      setSelectedChat(targetChat);
      setLiveMessages([]);
      setIsMobileView(true);
    } else {
      console.log("⚠️ Chat not found in list yet");
    }
  }
}, [searchParams, chatsData?.chats]);

  useEffect(() => {
    if (!socket || !currentUser) return;
    const handleReceiveMessage = (data) => {
      const messageData = data.message || data;
      if (selectedChat && messageData.chatId === selectedChat._id) {
        const apiMessages = messagesData?.messages || [];
        const existsInApi = apiMessages.some(m => m._id === messageData._id);
        if (existsInApi) {
          refetchChats();
          return;
        }
        setLiveMessages(prev => {
          const existsInLive = prev.some(m => m._id === messageData._id);
          if (existsInLive) return prev;
          return [...prev, messageData];
        });
        setTimeout(() => refetchMessages(), 1000);
        setTimeout(() => scrollToBottom(true), 100);
      }
      refetchChats();
    };
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("newMessageToUser", handleReceiveMessage);
    socket.on("newMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("newMessageToUser", handleReceiveMessage);
      socket.off("newMessage", handleReceiveMessage);
    };
  }, [socket, selectedChat, currentUser, refetchChats, messagesData]);

  const filteredUsers = allUsers.filter((user) => {
    if (!searchTerm) return false;
    const search = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(search) ||
      user.fullname?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  // Navigate to user profile
  const handleNavigateToProfile = (userId, username) => {
    if (!userId) return;
    // Option 1: Navigate using username
    if (username) {
      router.push(`/Pages/Main/profile/${userId}`);
    } else {
      // Option 2: Navigate using userId
      router.push(`/Pages/Main/profile/${userId}`);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const otherUser = conv.participants?.find(p => p._id !== currentUser?._id);
    return (
      otherUser?.username?.toLowerCase().includes(search) ||
      otherUser?.fullname?.toLowerCase().includes(search) ||
      otherUser?.email?.toLowerCase().includes(search)
    );
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "Super_admin": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "admin": return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "user": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case "premium": return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      case "pro": return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30";
      case "free": return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const isUserOnline = (userId) => {
    if (!userId || !Array.isArray(onlineUsers)) return false;
    const userIdStr = userId?.toString();
    return onlineUsers.some((user) => {
      const onlineUserId = user?._id?.toString() || user?.id?.toString() || user?.toString();
      return onlineUserId === userIdStr;
    });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat || isSending) return;
    const tempMessageText = messageText.trim();
    setMessageText("");
    setShowEmojiPicker(false);
    const tempMessageId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      const otherUser = selectedChat.participants?.find(p => p._id !== currentUser?._id);
      const tempMessage = {
        _id: tempMessageId,
        chatId: selectedChat._id,
        sender: currentUser?._id,
        message: tempMessageText,
        sentAt: new Date().toISOString(),
        read: false,
        isTemp: true
      };
      
      setLiveMessages(prev => [...prev, tempMessage]);
      isAutoScrollRef.current = true;
      setTimeout(() => scrollToBottom(true), 100);
      
      await sendMessage({
        recipientId: otherUser?._id,
        chatId: selectedChat._id,
        message: tempMessageText
      }).unwrap();

      setLiveMessages(prev => prev.filter(m => m._id !== tempMessageId));
      await refetchMessages();
      refetchChats();
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      setLiveMessages(prev => prev.filter(m => m._id !== tempMessageId));
      alert("Failed to send message. Please try again.");
      setMessageText(tempMessageText);
    }
  };

  const handleOpenChat = async (chat) => {
    setSelectedChat(chat);
    setLiveMessages([]);
    setIsMobileView(true);
  };

  const handleStartChatWithUser = async (user) => {
    try {
      const result = await getOrCreateChat(user._id).unwrap();
      setSelectedChat(result.chat);
      setLiveMessages([]);
      setSearchTerm("");
      setIsMobileView(true);
    } catch (error) {
      console.error("Failed to create/get chat:", error);
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    setLiveMessages([]);
    setIsMobileView(false);
  };

  const addEmoji = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    else if (hours < 48) return 'Yesterday';
    else return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-[#ceea45]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 md:w-96 md:h-96 bg-pink-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className={`relative z-10 h-screen flex flex-col transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="p-3 md:p-6 backdrop-blur-xl flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Layout */}
            <div className="flex md:hidden items-center gap-3">
              <Link 
                href="/Pages/Main/home"
                className="flex-shrink-0 w-9 h-9 bg-black rounded-full flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#ceea45] flex-shrink-0" />
                  <span className="truncate">Messages</span>
                </h1>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between">
              <Link 
                href="/Pages/Main/home"
                className='absolute top-6 left-6 text-white text-2xl bg-black rounded-full p-4 cursor-pointer hover:bg-[#ceea45]/10 hover:text-[#ceea45] transition-all hover:scale-110'
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-4xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent flex items-center gap-3">
                  <MessageCircle className="w-10 h-10 text-[#ceea45]" />
                  Messages
                </h1>
                <p className="text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ceea45]" />
                  Connect with your network
                </p>
              </div>

              <div className="w-12"></div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full px-2 md:px-0">
          {/* Conversations List */}
          <div
            className={`${isMobileView ? "hidden md:flex" : "flex"} flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl overflow-hidden w-full md:w-96 mb-2 md:m-4`}
            style={{
              boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
            }}
          >
            {/* Search Bar */}
            <div className="p-2.5 md:p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2 md:py-2.5 bg-white/5 border-2 border-white/20 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:border-[#ceea45]/50 transition placeholder-gray-500"
                />
              </div>
            </div>

            {/* Search Results (New Users) */}
            {searchTerm && filteredUsers.length > 0 && (
              <div className="border-b border-white/10 bg-white/5">
                <div className="p-2 md:p-3 text-xs text-gray-400 font-bold uppercase tracking-wider">New Chats</div>
                <div className="max-h-40 md:max-h-48 overflow-y-auto">
                  {filteredUsers.slice(0, 5).map((user) => (
                    <div
                      key={user._id}
                      className="p-2 md:p-2.5 hover:bg-white/5 transition border-b border-white/5 group"
                    >
                      <div className="flex items-center gap-2 md:gap-2.5">
                        <div 
                          onClick={() => handleStartChatWithUser(user)}
                          className="relative flex-shrink-0 cursor-pointer"
                        >
                          <img 
                            src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname || user.username || 'User')}&background=ceea45&color=000`}
                            alt={user.fullname || user.username}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl object-cover border-2 border-[#ceea45]/30"
                          />
                          {isUserOnline(user._id) && (
                            <span className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-400 rounded-full border-2 border-black animate-pulse"></span>
                          )}
                        </div>
                        <div 
                          onClick={() => handleStartChatWithUser(user)}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <h3 className="font-bold text-xs md:text-sm truncate">{user.fullname || user.username}</h3>
                          <p className="text-xs text-gray-400 truncate">@{user.username}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToProfile(user._id, user.username);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#ceea45]/10 rounded-lg"
                          title="View Profile"
                        >
                          <ExternalLink className="w-4 h-4 text-[#ceea45]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {!searchTerm && conversations.length === 0 ? (
                <div className="p-4 md:p-8 text-center text-gray-400">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <p className="text-xs md:text-sm font-medium">No conversations yet</p>
                  <p className="text-xs mt-2 text-gray-500">Search for users to start chatting</p>
                </div>
              ) : filteredConversations.length === 0 && searchTerm ? (
                <div className="p-6 md:p-8 text-center text-gray-400">
                  <p className="text-sm">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const otherUser = conversation.participants?.find(p => p._id !== currentUser?._id);
                  if (!otherUser) return null;

                  return (
                    <div
                      key={conversation._id || conversation.chatId}
                      className={`p-2.5 md:p-3 border-b border-white/5 hover:bg-white/5 transition group ${
                        selectedChat?._id === conversation._id ? "bg-white/10 border-l-4 border-l-[#ceea45]" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2 md:gap-2.5 mb-1.5 md:mb-2">
                        <div 
                          onClick={() => handleOpenChat(conversation)}
                          className="relative flex-shrink-0 cursor-pointer"
                        >
                          <img
                            src={otherUser.profilePic || otherUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.fullname || otherUser.username || 'User')}&background=ceea45&color=000`}
                            alt={otherUser.fullname || otherUser.username}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl object-cover border-2 border-white/20"
                          />
                          {isUserOnline(otherUser._id) && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-black animate-pulse shadow-lg shadow-green-400/50"></span>
                          )}
                        </div>

                        <div 
                          onClick={() => handleOpenChat(conversation)}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-bold text-xs md:text-sm truncate">{otherUser.fullname || otherUser.username || 'Unknown User'}</h3>
                            {conversation.lastMessageTime && (
                              <span className="text-xs text-gray-500 ml-1.5 flex-shrink-0">{formatMessageTime(conversation.lastMessageTime)}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">{conversation.lastMessage || 'Start a conversation'}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToProfile(otherUser._id, otherUser.username);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#ceea45]/10 rounded-lg flex-shrink-0"
                          title="View Profile"
                        >
                          <User className="w-4 h-4 text-[#ceea45]" />
                        </button>
                      </div>

                      <div className="flex gap-1 md:gap-1.5 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${getRoleColor(otherUser.role || "user")}`}>
                          {otherUser.role === "Super_admin" ? "👑" : otherUser.role === "admin" ? "🛡️" : "👤"}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${getAccountTypeColor(otherUser.accountType || "free")}`}>
                          {otherUser.accountType === "premium" ? "⭐" : otherUser.accountType === "pro" ? "✨" : "📦"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window */}
          {selectedChat ? (
            <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl mb-2 md:m-4 md:ml-0 rounded-xl md:rounded-2xl overflow-hidden border border-white/10"
              style={{
                boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
              }}
            >
              {/* Chat Header */}
              <div className="p-2.5 md:p-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <button onClick={handleBackToList} className="md:hidden text-[#ceea45] hover:text-[#b8d93c] transition flex-shrink-0">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {(() => {
                    const otherUser = selectedChat.participants?.find(p => p._id !== currentUser?._id);
                    const online = isUserOnline(otherUser?._id);
                    return (
                      <>
                        <div 
                          onClick={() => handleNavigateToProfile(otherUser?._id, otherUser?.username)}
                          className="relative flex-shrink-0 cursor-pointer group"
                        >
                          <img
                            src={otherUser?.profilePic || otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.fullname || otherUser?.username || 'User')}&background=ceea45&color=000`}
                            alt={otherUser?.fullname || otherUser?.username}
                            className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl object-cover border-2 border-white/20 group-hover:border-[#ceea45]/50 transition-all"
                          />
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border-2 border-black ${online ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-gray-500'}`}></span>
                        </div>
                        <div 
                          onClick={() => handleNavigateToProfile(otherUser?._id, otherUser?.username)}
                          className="min-w-0 cursor-pointer hover:opacity-80 transition"
                        >
                          <h2 className="font-black text-sm md:text-lg truncate flex items-center gap-2">
                            {otherUser?.fullname || otherUser?.username || 'Unknown User'}
                          </h2>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${online ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                            {online ? "Online" : "Offline"}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                {/* View Profile Button */}
                <button
                  onClick={() => {
                    const otherUser = selectedChat.participants?.find(p => p._id !== currentUser?._id);
                    handleNavigateToProfile(otherUser?._id, otherUser?.username);
                  }}
                  className="flex-shrink-0 p-2 md:p-2.5 hover:bg-[#ceea45]/10 rounded-lg md:rounded-xl transition-all group"
                  title="View Profile"
                >
                  <User className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[#ceea45] transition" />
                </button>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
                {allMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-gray-500" />
                      </div>
                      <p className="text-gray-400 font-medium text-sm md:text-base">No messages yet</p>
                      <p className="text-gray-500 text-xs md:text-sm mt-2">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {allMessages.map((msg) => {
                      const senderId = getSenderId(msg.sender);
                      const isMyMessage = senderId === currentUser?._id;
                      const senderInfo = typeof msg.sender === 'object' ? msg.sender : null;
                      const messageKey = msg._id || `temp-${msg.sentAt}`;
                      
                      return (
                        <div key={messageKey} className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                          <div className="flex items-end gap-1.5 md:gap-2 max-w-[85%] md:max-w-xs lg:max-w-md">
                            {!isMyMessage && senderInfo && (
                              <img
                                src={senderInfo.profilePic || senderInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderInfo.fullname || senderInfo.username || 'User')}&background=ceea45&color=000`}
                                alt={senderInfo.fullname || senderInfo.username}
                                onClick={() => handleNavigateToProfile(senderInfo._id, senderInfo.username)}
                                className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg object-cover border border-white/20 flex-shrink-0 cursor-pointer hover:border-[#ceea45]/50 transition"
                              />
                            )}
                            <div className={`px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl relative ${
                              isMyMessage
                                ? "bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-br-none shadow-lg shadow-[#ceea45]/20"
                                : "bg-white/10 backdrop-blur-xl text-white rounded-bl-none border border-white/20"
                            } ${msg.isTemp ? 'opacity-70' : ''}`}>
                              {msg.isTemp && (
                                <div className="absolute -right-1 -top-1">
                                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                </div>
                              )}
                              {!isMyMessage && senderInfo && (
                                <p 
                                  onClick={() => handleNavigateToProfile(senderInfo._id, senderInfo.username)}
                                  className="text-xs text-gray-300 mb-1 font-bold cursor-pointer hover:text-[#ceea45] transition"
                                >
                                  {senderInfo.fullname || senderInfo.username || 'Unknown'}
                                </p>
                              )}
                              <p className="text-xs md:text-sm break-words whitespace-pre-wrap leading-relaxed">{msg.message || msg.text || ''}</p>
                              <p className={`text-xs mt-1 ${isMyMessage ? 'text-black/60' : 'text-gray-400'}`}>
                                {formatMessageTime(msg.sentAt || msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="border-t border-white/10 bg-white/5 backdrop-blur-xl p-2 md:p-3 max-h-36 md:max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm text-gray-400 font-bold">Pick an emoji</span>
                    <button onClick={() => setShowEmojiPicker(false)} className="text-gray-400 hover:text-white transition">
                      <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-8 md:grid-cols-8 gap-0.5 md:gap-1">
                    {emojis.map((emoji, idx) => (
                      <button key={idx} onClick={() => addEmoji(emoji)} className="p-1.5 md:p-2 hover:bg-white/10 rounded-md md:rounded-lg text-lg md:text-xl transition">
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-2.5 md:p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl flex-shrink-0">
                <div className="flex items-center gap-2 md:gap-3">
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 md:p-3 hover:bg-white/10 rounded-lg md:rounded-xl transition text-gray-400 hover:text-[#ceea45] flex-shrink-0">
                    <Smile className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-white/5 border-2 border-white/20 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:border-[#ceea45]/50 transition placeholder-gray-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                    className="p-2 md:p-3 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] hover:from-[#b8d93c] hover:to-[#ceea45] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg md:rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-[#ceea45]/50 hover:scale-105 flex-shrink-0"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 md:w-5 md:h-5 text-black" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="hidden md:flex flex-1 items-center justify-center bg-white/5 backdrop-blur-xl m-4 ml-0 rounded-2xl border-2 border-white/10"
              style={{
                boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
              }}
            >
              <div className="text-center p-8 md:p-12">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border-4 border-white/20">
                  <MessageCircle size={48} className="md:w-16 md:h-16 text-gray-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2 md:mb-3 bg-gradient-to-r from-[#ceea45] to-white bg-clip-text text-transparent">
                  Select a conversation
                </h3>
                <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto">
                  Choose a user from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

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

export default ChatPage;