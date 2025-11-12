'use client'
import { useGetMyPostsQuery } from '@/app/Store/apiSclice/PostApiSlice'
import { useMyProfileQuery } from '@/app/Store/apiSclice/UserApiSlice'
import { selectAccessToken, selectIsAuthenticated } from '@/app/Store/Sclies/authSlice'
import { useGetOrCreateChatMutation } from '@/app/Store/apiSclice/messageApiSlice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { User, Mail, Calendar, MapPin, Edit, Grid, List, Heart, MessageCircle, Eye, CheckCircle, Crown, Users, Settings, Share2, MoreVertical, Briefcase, Clock, DollarSign, Tag, Sparkles, ArrowLeft } from 'lucide-react'

const Page = () => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken = useSelector(selectAccessToken);
  const [viewMode, setViewMode] = useState('grid');
  const [isVisible, setIsVisible] = useState(false);

  const { data: postsResponse, isLoading, isError } = useGetMyPostsQuery(undefined, {
    skip: !isAuthenticated
  });

  const { data: profileData, isLoading: profileLoading } = useMyProfileQuery(undefined, {
    skip: !isAuthenticated
  });

  const [getOrCreateChat, { isLoading: isCreatingChat }] = useGetOrCreateChatMutation();

  const profile = profileData?.yourProfile;
  const postsData = postsResponse?.posts || [];

  const goback = () => {
    router.back('/Pages/Main/home');
  }
    const handleShare = async () => {
      const shareData = {
        
        url: window.location.href,
      };

      const handleMessageUser = async () => {
  if (!profile?._id) return;
  
  try {
    console.log("📤 Creating/getting chat with user:", profile._id);
    
    // Create/get chat
    const chatResult = await getOrCreateChat(profile._id).unwrap();
    console.log("✅ Chat ready:", chatResult);
    
    // Navigate to messages page WITH chatId
    router.push(`/Pages/Main/messages?chatId=${chatResult.chat._id}`);
    
  } catch (error) {
    console.error("❌ Failed to open chat:", error);
    alert("Failed to open chat. Please try again.");
  }
};
  
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          toast.success('📤 Shared successfully!');
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Share error:', err);
          }
        }
      } else {
        try {
          await navigator.clipboard.writeText(shareData.url);
          toast.success('🔗 Link copied to clipboard!');
        } catch (err) {
          toast.error('Failed to copy link');
        }
      }
    };

    

  useEffect(() => {
    setIsVisible(true);
    if (isError) {
      return console.error('Error fetching posts:', isError);
    }
  }, [isError]);

  if (!isAuthenticated) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handlePostClick = (postId) => {
    router.push(`/Pages/Main/post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-y-auto overflow-x-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#ceea45]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

     

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Hero Banner Section */}
        <div className="relative h-80 w-full overflow-hidden border-b border-white/10">
          {profile?.banner ? (
            <img
              src={profile.banner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30 relative">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
          
          {/* Floating Action Buttons */}
         

          <div className="absolute top-6 left-6 flex justify-between items-center gap-3">
             <div onClick={()=> goback()}  className=' bsolute top-6 left-6 text-white text-2xl bg-black rounded-full p-4 cursor-pointer hover:bg-[#ceea45]/10 hover:text-[#ceea45] transition-all hover:scale-110'><ArrowLeft /></div>
            {/* <button onClick={handleShare} className="p-3 bg-white/10 backdrop-blur-xl hover:bg-[#ceea45]/20 rounded-xl border border-white/20 hover:border-[#ceea45]/50 transition-all group">
              <Share2 size={20} className="text-gray-300 group-hover:text-[#ceea45] transition-colors" />
            </button> */}
            {/* <button className="p-3 bg-white/10 backdrop-blur-xl hover:bg-[#ceea45]/20 rounded-xl border border-white/20 hover:border-[#ceea45]/50 transition-all group">
              <MoreVertical size={20} className="text-gray-300 group-hover:text-[#ceea45] transition-colors" />
            </button> */}
          </div>
        </div>

        

        {/* Profile Info Section */}
        <div className={`max-w-7xl mx-auto px-6 -mt-24 relative z-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
            }}
          >
            {profileLoading ? (
              <div className="p-8">
                <div className="flex gap-6 mb-6">
                  <div className="w-32 h-32 bg-white/10 rounded-2xl animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-8 bg-white/10 rounded w-64 animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-48 animate-pulse" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Profile Picture */}
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#ceea45]/30 shadow-xl relative group">
                      
                      <img
                        src={profile?.profilePic || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile?.fullname || 'User') + '&background=ceea45&color=000'}
                        alt={profile?.fullname}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Edit size={24} className="text-[#ceea45]" />
                      </div>
                    </div>
                    {profile?.isOnline && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black animate-pulse shadow-lg shadow-green-500/50" />
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h1 className="text-4xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent">
                            {profile?.fullname || 'User'}
                          </h1>
                          {profile?.isVerified && (
                            <div className="p-1 bg-blue-500/20 rounded-full border-2 border-blue-400/30 animate-pulse">
                              <CheckCircle size={24} className="text-blue-400" />
                            </div>
                          )}
                          {profile?.accountType === 'premium' && (
                            <div className="p-1 bg-yellow-500/20 rounded-full border-2 border-yellow-400/30 animate-pulse">
                              <Crown size={24} className="text-yellow-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-xl text-gray-400 mb-3">@{profile?.username}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border-2 ${
                            profile?.accountType === 'premium' 
                              ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30 text-yellow-400' 
                              : 'bg-white/5 border-white/20 text-gray-400'
                          }`}>
                            {profile?.accountType || 'Free'} Account
                          </span>
                          {profile?.role && (
                            <span className="px-4 py-2 bg-purple-600/20 border-2 border-purple-500/30 text-purple-400 rounded-xl text-xs font-bold uppercase tracking-wide">
                              {profile.role}
                            </span>
                          )}
                        </div>
                      </div>
<div className="flex gap-3">
  {/* Message Button */}
  <button
    onClick={handleMessageUser}
    disabled={isCreatingChat}
    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
  >
    {isCreatingChat ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Opening...
      </>
    ) : (
      <>
        <MessageCircle size={18} />
        Message
      </>
    )}
  </button>

  {/* Edit Profile Button */}
  <Link href="/Pages/Main/edit-profile">
    <button className="px-6 py-3 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-xl font-bold hover:from-[#b8d93c] hover:to-[#ceea45] transition-all flex items-center gap-2 shadow-lg hover:shadow-[#ceea45]/50 hover:scale-105">
      <Settings size={18} />
      Edit Profile
    </button>
  </Link>
</div>
                    </div>

                    {profile?.bio && (
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed max-w-3xl">
                        {profile.bio}
                      </p>
                    )}

                    {/* Profile Meta Info */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
                      {profile?.email && (
                        <div className="flex items-center gap-2 hover:text-[#ceea45] transition-colors">
                          <Mail size={18} className="text-[#ceea45]" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                      {profile?.createdAt && (
                        <div className="flex items-center gap-2 hover:text-[#ceea45] transition-colors">
                          <Calendar size={18} className="text-[#ceea45]" />
                          <span>Joined {formatDate(profile.createdAt)}</span>
                        </div>
                      )}
                      {profile?.lastSeen && !profile?.isOnline && (
                        <div className="flex items-center gap-2 hover:text-[#ceea45] transition-colors">
                          <Clock size={18} className="text-[#ceea45]" />
                          <span>Last seen {new Date(profile.lastSeen).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border-2 border-white/10 hover:border-[#ceea45]/50 transition-all cursor-pointer group hover:scale-105">
                        <div className="text-3xl font-black text-[#ceea45] mb-1 group-hover:scale-110 transition-transform">{postsData?.length || 0}</div>
                        <div className="text-gray-400 text-sm font-bold uppercase tracking-wide">Posts</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border-2 border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group hover:scale-105">
                        <div className="text-3xl font-black text-purple-400 mb-1 group-hover:scale-110 transition-transform">{profile?.followers?.length || 0}</div>
                        <div className="text-gray-400 text-sm font-bold uppercase tracking-wide">Followers</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border-2 border-white/10 hover:border-pink-500/50 transition-all cursor-pointer group hover:scale-105">
                        <div className="text-3xl font-black text-pink-400 mb-1 group-hover:scale-110 transition-transform">{profile?.following?.length || 0}</div>
                        <div className="text-gray-400 text-sm font-bold uppercase tracking-wide ">Following</div>
                      </div>
                    </div>


                    
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Posts Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-[#ceea45] to-white bg-clip-text text-transparent mb-2 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-[#ceea45]" />
                My Work
              </h2>
              <p className="text-gray-400">
                {postsData?.length || 0} {postsData?.length === 1 ? 'post' : 'posts'} published
              </p>
            </div>
            <div className="flex gap-3 bg-white/5 backdrop-blur-xl rounded-xl p-1.5 border-2 border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Posts Grid/List */}
          {isLoading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-white/10" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : postsData && postsData.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {postsData.map((post) => (
                <div
                  key={post._id}
                  onClick={() => handlePostClick(post._id)}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-white/10 overflow-hidden hover:border-[#ceea45]/50 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#ceea45]/20"
                >
                  {/* Post Image */}
                  {post.image && post.image.length > 0 && (
                    <div className="aspect-video bg-white/10 overflow-hidden relative">
                      <img
                        src={post.image[0]}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {post.image.length > 1 && (
                          <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg text-xs font-bold border border-[#ceea45]/30">
                            +{post.image.length - 1} Photos
                          </div>
                        )}
                        {post.video && post.video.length > 0 && (
                          <div className="px-3 py-1.5 bg-purple-600/90 backdrop-blur-md rounded-lg text-xs font-bold">
                            VIDEO
                          </div>
                        )}
                      </div>

                      {post.jobType && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg text-xs font-bold border border-[#ceea45]/30 uppercase">
                          {post.jobType}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-[#ceea45] transition-colors">
                      {post.title}
                    </h3>
                    
                    {post.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    )}

                    {/* Price & Duration */}
                    {post.price && (
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <DollarSign size={18} className="text-emerald-400" />
                          <span className="text-2xl font-bold text-emerald-400">
                            {post.price.amount}
                          </span>
                          <span className="text-gray-500 text-sm">{post.price.currency}</span>
                        </div>
                        {post.jobDuration && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock size={16} />
                            <span className="text-sm font-medium">{post.jobDuration}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <div key={idx} className="flex items-center gap-1 px-3 py-1 bg-[#ceea45]/10 border border-[#ceea45]/30 rounded-full text-xs font-medium text-[#ceea45]">
                            <Tag size={12} />
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-2 hover:text-rose-400 transition-colors">
                          <Heart size={18} className="group-hover:fill-current" />
                          <span className="font-medium">{post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                          <MessageCircle size={18} />
                          <span className="font-medium">{post.comments?.length || 0}</span>
                        </div>
                      </div>
                      {post.createdAt && (
                        <div className="text-xs text-gray-500 font-medium">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border-2 border-white/10">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/20">
                <Briefcase size={48} className="text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">No posts yet</h3>
              <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
                Start showcasing your work and connect with clients
              </p>
              <Link href="/create-post">
                <button className="px-8 py-4 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] hover:from-[#b8d93c] hover:to-[#ceea45] text-black rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-[#ceea45]/50 hover:scale-105">
                  Create Your First Post
                </button>
              </Link>
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

export default Page;