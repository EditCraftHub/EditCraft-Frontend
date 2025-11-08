'use client';

import { useGetAllUsersQuery } from "@/app/Store/apiSclice/UserApiSlice";
import useSocket from "@/app/hooks/useSocket";
import { Users as UsersIcon, Search, Filter, TrendingUp, Award, Mail, Sparkles, X, Shield, Crown, CheckCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import Users from "./users/Users";

const Page = () => {
  const { data, isLoading, isError, error, refetch } = useGetAllUsersQuery();
  const { socket, onlineUsers } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterAccount, setFilterAccount] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [isVisible, setIsVisible] = useState(false);

  // 🔥 Real-time refetch when socket receives updates
  useEffect(() => {
    if (!socket) return;

    const handleUserUpdate = () => {
      console.log("👥 User data changed, refetching...");
      refetch();
    };

    // Listen for various user-related events
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

  // 🔥 Periodic refresh to keep data in sync
  useEffect(() => {
    // Refetch users every 30 seconds
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Get unique roles from data
  const availableRoles = useMemo(() => {
    const roles = new Set(data?.users?.map(u => u.role).filter(Boolean) || []);
    return Array.from(roles).sort();
  }, [data?.users]);

  // Get unique account types from data
  const availableAccountTypes = useMemo(() => {
    const types = new Set(data?.users?.map(u => u.accountType).filter(Boolean) || []);
    return Array.from(types).sort();
  }, [data?.users]);

  // 🔥 Enhanced online status check
  const isUserOnline = (userId) => {
    if (!userId || !Array.isArray(onlineUsers)) return false;
    
    const userIdStr = userId?.toString();
    return onlineUsers.some((user) => {
      const onlineUserId = user?._id?.toString() || user?.id?.toString() || user?.toString();
      return onlineUserId === userIdStr;
    });
  };

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = data?.users || [];

    if (searchTerm) {
      result = result.filter(user =>
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.accountType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      result = result.filter(user => user.role?.toLowerCase() === filterRole.toLowerCase());
    }

    if (filterAccount !== "all") {
      result = result.filter(user => user.accountType?.toLowerCase() === filterAccount.toLowerCase());
    }

    if (sortBy === "followers") {
      result = [...result].sort((a, b) => (b.followers?.length || 0) - (a.followers?.length || 0));
    } else if (sortBy === "online") {
      result = [...result].sort((a, b) => {
        const aOnline = isUserOnline(a._id);
        const bOnline = isUserOnline(b._id);
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;
        return 0;
      });
    } else if (sortBy === "recent") {
      result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [data?.users, searchTerm, filterRole, filterAccount, sortBy, onlineUsers]);

  // 🔥 Count online users
  const onlineCount = useMemo(() => {
    return (data?.users || []).filter(user => isUserOnline(user._id)).length;
  }, [data?.users, onlineUsers]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRole("all");
    setFilterAccount("all");
    setSortBy("recent");
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#ceea45]/20 border-t-[#ceea45] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-lg">Loading users...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="relative z-10 bg-rose-500/10 backdrop-blur-2xl border-2 border-rose-500/30 rounded-3xl p-8 max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mr-4">
            <X className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-xl font-bold text-rose-400">Error loading users</h3>
        </div>
        <p className="text-gray-400">{error?.message || 'An error occurred'}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/30 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const userCount = data?.users?.length || 0;

  const stats = {
    admins: data?.users?.filter(u => u.role === 'admin' || u.role === 'Super_admin').length || 0,
    premium: data?.users?.filter(u => u.accountType?.toLowerCase() === 'premium').length || 0,
    pro: data?.users?.filter(u => u.accountType?.toLowerCase() === 'pro').length || 0,
    online: onlineCount,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-y-auto overflow-x-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 md:w-96 md:h-96 bg-[#ceea45]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 md:w-96 md:h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 md:w-96 md:h-96 bg-pink-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Header Section */}
        <div className={`transition-all duration-1000 mb-8 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden mb-6"
            style={{
              boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
            }}
          >
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent flex items-center gap-3 mb-2">
                    <UsersIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#ceea45]" />
                    All Users
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ceea45]" />
                      Discover amazing creators and professionals
                    </span>
                  </p>
                </div>
                
                <div className="flex items-center gap-3 bg-[#ceea45]/10 backdrop-blur-xl px-5 py-3 rounded-2xl border-2 border-[#ceea45]/30">
                  <UsersIcon className="w-5 h-5 text-[#ceea45]" />
                  <span className="text-sm font-medium text-gray-400">Total:</span>
                  <span className="text-2xl font-black text-[#ceea45]">{userCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/20 hover:border-[#ceea45]/50 transition-all hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-wide mb-2">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#ceea45] transition-colors">{userCount}</p>
                </div>
                <UsersIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[#ceea45]/30 group-hover:text-[#ceea45]/50 transition-colors" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/20 hover:border-emerald-500/50 transition-all hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-wide mb-2">Online Now</p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400 group-hover:scale-110 transition-transform">{stats.online}</p>
                </div>
                <div className="relative">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500/30 group-hover:text-emerald-500/50 transition-colors" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/20 hover:border-rose-500/50 transition-all hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-wide mb-2">Admins</p>
                  <p className="text-2xl sm:text-3xl font-black text-rose-400 group-hover:scale-110 transition-transform">{stats.admins}</p>
                </div>
                <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500/30 group-hover:text-rose-500/50 transition-colors" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/20 hover:border-purple-500/50 transition-all hover:scale-105 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 font-bold uppercase tracking-wide mb-2">Premium</p>
                  <p className="text-2xl sm:text-3xl font-black text-purple-400 group-hover:scale-110 transition-transform">{stats.premium}</p>
                </div>
                <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500/30 group-hover:text-purple-500/50 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border-2 border-white/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, username, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#ceea45]/50 focus:bg-white/10 transition text-white placeholder-gray-500"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#ceea45]/50 focus:bg-white/10 transition appearance-none text-white cursor-pointer"
                >
                  <option value="all" className="bg-gray-900">All Roles</option>
                  {availableRoles.map(role => (
                    <option key={role} value={role} className="bg-gray-900">{role}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Account Type Filter */}
            <div>
              <select
                value={filterAccount}
                onChange={(e) => setFilterAccount(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#ceea45]/50 focus:bg-white/10 transition appearance-none text-white cursor-pointer"
              >
                <option value="all" className="bg-gray-900">All Plans</option>
                {availableAccountTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-900">{type}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#ceea45]/50 focus:bg-white/10 transition appearance-none text-white cursor-pointer"
              >
                <option value="recent" className="bg-gray-900">Recent</option>
                <option value="online" className="bg-gray-900">Online First</option>
                <option value="followers" className="bg-gray-900">Top Followers</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterRole !== "all" || filterAccount !== "all") && (
            <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-2 bg-[#ceea45]/20 border-2 border-[#ceea45]/30 text-[#ceea45] px-4 py-2 rounded-xl text-sm font-bold">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")} className="hover:text-white transition">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filterRole !== "all" && (
                <span className="inline-flex items-center gap-2 bg-purple-500/20 border-2 border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl text-sm font-bold">
                  Role: {filterRole}
                  <button onClick={() => setFilterRole("all")} className="hover:text-white transition">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filterAccount !== "all" && (
                <span className="inline-flex items-center gap-2 bg-blue-500/20 border-2 border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold">
                  Plan: {filterAccount}
                  <button onClick={() => setFilterAccount("all")} className="hover:text-white transition">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#ceea45]" />
              Community Members
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Showing <span className="text-[#ceea45] font-bold">{filteredUsers.length}</span> of <span className="text-white font-bold">{userCount}</span> users
              {stats.online > 0 && (
                <> • <span className="text-emerald-400 font-bold">{stats.online}</span> online</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
            <span className="text-sm text-emerald-400 font-bold">Live updates</span>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <>
            <Users />

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-xl font-bold hover:from-[#b8d93c] hover:to-[#ceea45] transition-all shadow-lg hover:shadow-[#ceea45]/50 hover:scale-105">
                Load More Users
              </button>
              <button 
                onClick={clearFilters}
                className="px-8 py-4 bg-white/5 border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all hover:scale-105"
              >
                Reset Filters
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border-2 border-white/20 p-12 sm:p-16 text-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/20">
              <Mail size={48} className="text-gray-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">No users found</h3>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-xl font-bold hover:from-[#b8d93c] hover:to-[#ceea45] transition-all shadow-lg hover:shadow-[#ceea45]/50 hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}
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

export default Page;