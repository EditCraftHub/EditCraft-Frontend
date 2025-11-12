'use client';

import useSocket from "@/app/hooks/useSocket";
import { useGetAllUsersQuery } from "@/app/Store/apiSclice/UserApiSlice";
import { useGetOrCreateChatMutation, useSendMessageMutation } from "@/app/Store/apiSclice/messageApiSlice";
import { useEffect, useState, useMemo, useCallback } from "react";
import { MessageCircle, X, Send, Clock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const Users = () => {
  const { socket, onlineUsers } = useSocket();
  const { data, refetch } = useGetAllUsersQuery();
  const [getOrCreateChat, { isLoading: isCreatingChat }] = useGetOrCreateChatMutation();
  const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();
  const [dmModal, setDmModal] = useState({ isOpen: false, user: null });
  const [message, setMessage] = useState("");
  const [displayCount, setDisplayCount] = useState(12);
  const router = useRouter();

  // Get current user ID (adjust based on your auth implementation)
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // 🔥 Real-time refetch when socket receives updates
  useEffect(() => {
    if (!socket) return;

    const handleUserUpdate = () => {
      console.log("👥 User data changed, refetching users component...");
      refetch();
    };

    socket.on("userUpdated", handleUserUpdate);
    socket.on("newUser", handleUserUpdate);
    socket.on("userDeleted", handleUserUpdate);
    socket.on("userStatusChange", handleUserUpdate);

    return () => {
      socket.off("userUpdated", handleUserUpdate);
      socket.off("newUser", handleUserUpdate);
      socket.off("userDeleted", handleUserUpdate);
      socket.off("userStatusChange", handleUserUpdate);
    };
  }, [socket, refetch]);

  // Navigate to profile page
  const navigateToProfile = useCallback((userId, e) => {
    e?.stopPropagation();
    if (!userId) return;
    
    if (userId === currentUserId) {
      router.push('/profile');
    } else {
      router.push(`/Pages/Main/profile/${userId}`);
    }
  }, [currentUserId, router]);

  // Combine online and all users
  const allUsersWithStatus = useMemo(() => {
    const allUsers = data?.users || [];
    
    return allUsers.map(user => {
      const isOnline = onlineUsers?.some(u => {
        return String(u.id) === String(user._id) || String(u._id) === String(user._id);
      });
      return { ...user, isOnline };
    }).sort((a, b) => {
      // Online users first, then offline
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return 0;
    });
  }, [data?.users, onlineUsers]);

  const displayedUsers = allUsersWithStatus.slice(0, displayCount);
  const hasMore = displayCount < allUsersWithStatus.length;

  const openDmModal = (user) => {
    setDmModal({ isOpen: true, user });
    // Set default message
    setMessage("Hi! I'd like to chat with you. 😊");
  };

  const closeDmModal = () => {
    setDmModal({ isOpen: false, user: null });
    setMessage("");
  };

  // 🔥 Send message and navigate to chat
// 🔥 Send message and navigate to chat
const handleSendMessage = async () => {
  if (!message.trim() || !dmModal.user) return;

  try {
    console.log("📤 Creating/getting chat with user:", dmModal.user._id);
    
    // Step 1: Get or create chat
    const chatResult = await getOrCreateChat(dmModal.user._id).unwrap();
    console.log("✅ Chat created/retrieved:", chatResult);

    // Step 2: Send the message
    const messageResult = await sendMessage({
      recipientId: dmModal.user._id,
      chatId: chatResult.chat._id,
      message: message.trim()
    }).unwrap();
    
    console.log("✅ Message sent:", messageResult);

    // Step 3: Close modal
    closeDmModal();

    // Step 4: Navigate to messages page WITH chatId ✅
    router.push(`/Pages/Main/messages?chatId=${chatResult.chat._id}`);
    
  } catch (error) {
    console.error("❌ Failed to send message:", error);
    alert("Failed to send message. Please try again.");
  }
};




  // 🔥 Quick message - sends instantly and navigates to chat
const handleQuickMessage = async (user, e) => {
  e.stopPropagation();
  
  try {
    console.log("📤 Quick messaging user:", user._id);
    
    // Create/get chat
    const chatResult = await getOrCreateChat(user._id).unwrap();
    console.log("✅ Chat ready:", chatResult);
    
    // Navigate to messages page WITH chatId ✅
    router.push(`/Pages/Main/messages?chatId=${chatResult.chat._id}`);
    
  } catch (error) {
    console.error("❌ Failed to open chat:", error);
    alert("Failed to open chat. Please try again.");
  }
};

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-500/20 text-red-400 border border-red-500/30",
      Super_admin: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      user: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    };
    return colors[role] || "bg-gray-500/20 text-gray-400";
  };

  const getAccountBadge = (type) => {
    const colors = {
      premium: "bg-purple-500/20 text-purple-400",
      pro: "bg-cyan-500/20 text-cyan-400",
      free: "bg-gray-500/20 text-gray-400",
    };
    return colors[type?.toLowerCase()] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-600">All Users</h2>
          <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">{onlineUsers?.length || 0} Online</span>
          </div>
        </div>
        <p className="text-gray-400">Showing {displayedUsers.length} of {allUsersWithStatus.length} users</p>
      </div>

      {/* Users Grid */}
      {allUsersWithStatus.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-2">No users found</p>
          <p className="text-gray-500 text-sm">Check back later</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-max">
            {displayedUsers.map((user) => (
              <div
                key={user._id || user.id}
                className={`relative rounded-xl p-4 md:p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border cursor-pointer ${
                  user.isOnline
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-green-500/30 ring-1 ring-green-500/20'
                    : 'bg-gray-800 border-gray-700'
                }`}
                onClick={(e) => navigateToProfile(user._id || user.id, e)}
              >
                {/* Online Badge */}
                {user.isOnline && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Online
                    </div>
                  </div>
                )}

                {/* Avatar Section */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname || user.username || 'User')}&background=ceea45&color=000`}
                      alt={user.fullname || user.name || "User"}
                      className={`w-16 h-16 rounded-full object-cover border-2 ${
                        user.isOnline ? 'border-green-500' : 'border-gray-600'
                      }`}
                    />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900 ${
                      user.isOnline ? 'bg-green-500' : 'bg-gray-600'
                    }`}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">
                      {user.fullname || user.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">@{user.username || "user"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                    {user.bio}
                  </p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(user.role)}`}>
                    {user.role || "user"}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getAccountBadge(user.accountType)}`}>
                    {user.accountType || "free"}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                  <div className="bg-gray-700/50 rounded-lg py-2">
                    <p className="text-lg font-bold text-gray-200">
                      {user.followers?.length ? (user.followers.length / 1000).toFixed(1) + "K" : "0"}
                    </p>
                    <p className="text-xs text-gray-400">Followers</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg py-2">
                    <p className="text-lg font-bold text-gray-200">
                      {user.following?.length || "0"}
                    </p>
                    <p className="text-xs text-gray-400">Following</p>
                  </div>
                </div>

                {/* Message Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDmModal(user);
                    }}
                    disabled={isCreatingChat || isSendingMessage}
                    className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={(e) => handleQuickMessage(user, e)}
                    disabled={isCreatingChat}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-all"
                    title="Quick chat"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setDisplayCount(prev => prev + 12)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all"
              >
                Load More users
              </button>
            </div>
          )}

          {!hasMore && allUsersWithStatus.length > 12 && (
            <div className="text-center mt-8">
              <p className="text-gray-400">No more users to load</p>
            </div>
          )}
        </>
      )}

      {/* DM Modal */}
      {dmModal.isOpen && dmModal.user && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={dmModal.user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(dmModal.user.fullname || dmModal.user.username || 'User')}&background=ceea45&color=000`}
                    alt={dmModal.user.fullname || dmModal.user.name}
                    className="w-10 h-10 rounded-full border-2 border-white flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">
                      {dmModal.user.fullname || dmModal.user.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-purple-100 flex items-center gap-1">
                      {dmModal.user.isOnline ? (
                        <>
                          <Zap className="w-3 h-3" />
                          Online
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          Offline
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDmModal}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 max-h-64 overflow-y-auto">
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Your Message
              </label>
              <textarea
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
                rows={4}
                placeholder="Write something nice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2">
                💡 Tip: This message will be sent and you'll be taken to the chat
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-4 pb-4 flex gap-3 border-t border-gray-700 pt-4">
              <button
                onClick={closeDmModal}
                disabled={isCreatingChat || isSendingMessage}
                className="flex-1 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isCreatingChat || isSendingMessage}
                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg font-bold transition flex items-center justify-center gap-2"
              >
                {isCreatingChat || isSendingMessage ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send & Open Chat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;