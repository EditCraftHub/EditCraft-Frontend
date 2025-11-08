'use client';

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  useGetPostByIdQuery, 
  useToggleLikeMutation, 
  useAddCommentMutation,
  useLikeCommentMutation,
  useDeleteCommentMutation,
  useAddReplyMutation,
  useDeleteReplyMutation,
  useLikeReplyMutation,
  useDeletePostMutation
} from "@/app/Store/apiSclice/PostApiSlice";
import { useFollowUserMutation, useUnfollowUserMutation } from "@/app/Store/apiSclice/UserApiSlice";
import { 
  ArrowLeft, Heart, MessageSquare, Share2, Send, Trash2, 
  UserPlus, UserMinus, Eye, Bookmark, Edit,
  Loader2, X, Play, ChevronLeft, ChevronRight, Reply, Briefcase,
  DollarSign, Clock, AlertTriangle, CheckCircle
} from "lucide-react";


const PostDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const { data: postData, isLoading, error, refetch } = useGetPostByIdQuery(postId);
  const [toggleLike] = useToggleLikeMutation();
  const [addComment] = useAddCommentMutation();
  const [likeComment] = useLikeCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [addReply] = useAddReplyMutation();
  const [deleteReply] = useDeleteReplyMutation();
  const [likeReply] = useLikeReplyMutation();
  const [deletePost] = useDeletePostMutation();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [mediaModal, setMediaModal] = useState({ open: false, items: [], index: 0 });
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: '', commentId: '' });
  const [isVisible, setIsVisible] = useState(false);

  const [currentUserId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId');
    }
    return null;
  });

  useEffect(() => {
    setIsVisible(true);
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const post = postData?.post;
  const isAuthor = post?.userId?._id === currentUserId;
  const isLiked = post?.likes?.includes(currentUserId);
  const isFollowing = post?.userId?.followers?.includes(currentUserId);

  const setLoading = useCallback((key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);


//   const handleFollowToggle = async () => {
//   // Prevent self-follow
//   if (isAuthor) {
//     toast.error("You cannot follow yourself!");
//     return;
//   }

//   if (!currentUser) {
//     toast.error("Please login to follow users");
//     return;
//   }

//   try {
//     setLoadingStates(prev => ({ ...prev, follow: true }));

//     const endpoint = isFollowingUser 
//       ? `/api/users/unfollow/${post.userId._id}`
//       : `/api/users/follow/${post.userId._id}`;

//     const response = await fetch(endpoint, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${currentUser.token}`
//       },
//       credentials: 'include'
//     });

//     const data = await response.json();

//     // ✅ Check if response is not ok
//     if (!response.ok) {
//       // Display backend error message
//       toast.error(data.message || 'Failed to update follow status');
//       return;
//     }

//     // Success
//     setIsFollowingUser(!isFollowingUser);
//     toast.success(
//       isFollowingUser 
//         ? `Unfollowed ${post.userId.fullname}` 
//         : `Now following ${post.userId.fullname}`
//     );

//   } catch (error) {
//     console.error('Follow error:', error);
//     toast.error(error.message || 'Network error. Please try again.');
//   } finally {
//     setLoadingStates(prev => ({ ...prev, follow: false }));
//   }
// };

  // Delete Modal Component
  const DeleteConfirmModal = () => {
    if (!deleteModal.open) return null;

    const handleConfirmDelete = async () => {
      try {
        if (deleteModal.type === 'post') {
          setLoading('deletePost', true);
          await deletePost(postId).unwrap();
          toast.success('Post deleted successfully!');
          router.push('/profile');
        } else if (deleteModal.type === 'comment') {
          setLoading(`deleteComment-${deleteModal.id}`, true);
          await deleteComment({ postId, commentId: deleteModal.id }).unwrap();
          toast.success('Comment deleted!');
          refetch();
        } else if (deleteModal.type === 'reply') {
          setLoading(`deleteReply-${deleteModal.id}`, true);
          await deleteReply({ postId, commentId: deleteModal.commentId, replyId: deleteModal.id }).unwrap();
          toast.success('Reply deleted!');
          refetch();
        }
      } catch (err) {
        toast.error(`Failed to delete ${deleteModal.type}`);
      } finally {
        setLoading(deleteModal.type === 'post' ? 'deletePost' : `delete${deleteModal.type}-${deleteModal.id}`, false);
        setDeleteModal({ open: false, type: '', id: '', commentId: '' });
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black text-white backdrop-blur-xl animate-fadeIn">
        <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white rounded-3xl border-2 border-red-500/30 max-w-md w-full shadow-2xl overflow-hidden"
          style={{
            boxShadow: '0 25px 80px rgba(239,68,68,0.3), 0 0 0 1px rgba(239,68,68,0.2), inset 0 0 80px rgba(239,68,68,0.05)'
          }}
        >
          {/* Warning Glow Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="relative z-10 p-8">
            {/* Warning Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-500/30 animate-bounce-slow">
              <AlertTriangle className="w-10 h-10 text-red-500" strokeWidth={2.5} />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black text-white text-center mb-3">
              Delete {deleteModal.type === 'post' ? 'Post' : deleteModal.type === 'comment' ? 'Comment' : 'Reply'}?
            </h2>
            
            {/* Message */}
            <p className="text-gray-400 text-center mb-8 leading-relaxed">
              {deleteModal.type === 'post' 
                ? "This action cannot be undone. Your post will be permanently deleted along with all comments and replies."
                : `Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`
              }
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, type: '', id: '', commentId: '' })}
                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border-2 border-white/20 text-gray-300 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loadingStates.deletePost || loadingStates[`deleteComment-${deleteModal.id}`] || loadingStates[`deleteReply-${deleteModal.id}`]}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/50 disabled:opacity-50"
              >
                {(loadingStates.deletePost || loadingStates[`deleteComment-${deleteModal.id}`] || loadingStates[`deleteReply-${deleteModal.id}`]) ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleLikePost = async () => {
    try {
      setLoading('likePost', true);
      await toggleLike(postId).unwrap();
      refetch();
      toast.success(isLiked ? '💔 Post unliked' : '❤️ Post liked!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to like post');
    } finally {
      setLoading('likePost', false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.warning('Please write something');
      return;
    }

    try {
      setLoading('addComment', true);
      await addComment({ postId, text: commentText }).unwrap();
      setCommentText('');
      toast.success('💬 Comment added!');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add comment');
    } finally {
      setLoading('addComment', false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      setLoading(`likeComment-${commentId}`, true);
      await likeComment({ postId, commentId }).unwrap();
      refetch();
    } catch (err) {
      toast.error('Failed to like comment');
    } finally {
      setLoading(`likeComment-${commentId}`, false);
    }
  };

  const handleAddReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text?.trim()) {
      toast.warning('Please write something');
      return;
    }

    try {
      setLoading(`addReply-${commentId}`, true);
      await addReply({ postId, commentId, text }).unwrap();
      setReplyText(prev => ({ ...prev, [commentId]: '' }));
      toast.success('↩️ Reply added!');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add reply');
    } finally {
      setLoading(`addReply-${commentId}`, false);
    }
  };

  const handleLikeReply = async (commentId, replyId) => {
    try {
      setLoading(`likeReply-${replyId}`, true);
      await likeReply({ postId, commentId, replyId }).unwrap();
      refetch();
    } catch (err) {
      toast.error('Failed to like reply');
    } finally {
      setLoading(`likeReply-${replyId}`, false);
    }
  };

const handleFollowToggle = async () => {
  // ✅ Validate post author exists
  if (!post?.userId?._id) {
    toast.error('Unable to follow this user', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      style: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: '2px solid #ef4444',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)',
      }
    });
    return;
  }

  // ✅ Check if user is logged in
  if (!currentUserId || !user || !isAuthenticated) {
    toast.error('🔒 Please login to follow users', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      style: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: '2px solid #ceea45',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(206, 234, 69, 0.3)',
      }
    });
    return;
  }

  // ✅ CRITICAL: Prevent self-follow
  if (currentUserId === post.userId._id) {
    toast.error('🚫 You cannot follow yourself! Try following other users instead 😊', {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      style: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1a1a 100%)',
        border: '2px solid #ef4444',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4)',
      }
    });
    return;
  }

  // ✅ Prevent double-click during loading
  if (loadingStates.follow) return;
  
  try {
    setLoading('follow', true);
    
    if (isFollowing) {
      // Unfollow
      await unfollowUser(post.userId._id).unwrap();
      toast.success(`👋 Unfollowed ${post.userId.fullname || 'user'}`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          border: '2px solid #6b7280',
          borderRadius: '18px',
          boxShadow: '0 15px 50px rgba(107, 114, 128, 0.3)',
        }
      });
    } else {
      // Follow
      await followUser(post.userId._id).unwrap();
      toast.success(`✨ Now following ${post.userId.fullname || 'user'}! You'll see their posts in your feed 🎉`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #1a2d1a 100%)',
          border: '2px solid #ceea45',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(206, 234, 69, 0.4)',
        }
      });
    }
    
    // ✅ Refetch data to update UI
    refetch();
    
  } catch (err) {
    console.error('Follow error:', err);
    
    // ✅ Extract proper error message
    const errorMessage = 
      err?.data?.message || 
      err?.response?.data?.message || 
      err?.message || 
      'Failed to update follow status';
    
    toast.error(`❌ ${errorMessage}`, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      style: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1a1a 100%)',
        border: '2px solid #ef4444',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4)',
      }
    });
  } finally {
    setLoading('follow', false);
  }
};

  const handleShare = async () => {
    const shareData = {
      title: post?.title,
      text: post?.description,
      url: window.location.href,
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

  const navigateToProfile = (userId) => {
    if (!userId) return;
    if (userId === currentUserId) {
      router.push('/Pages/Main/profile');
    } else {
      router.push(`/Pages/Main/profile/${userId}`);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const isCommentLiked = (comment) => {
    return comment.likes?.includes(currentUserId);
  };

  const isReplyLiked = (reply) => {
    return reply.likes?.includes(currentUserId);
  };

  const openMediaModal = (items, index) => {
    setMediaModal({ open: true, items, index });
  };

  const closeMediaModal = () => {
    setMediaModal({ open: false, items: [], index: 0 });
  };

  const nextMedia = () => {
    setMediaModal(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.items.length
    }));
  };

  const prevMedia = () => {
    setMediaModal(prev => ({
      ...prev,
      index: prev.index === 0 ? prev.items.length - 1 : prev.index - 1
    }));
  };

  const MediaGallery = ({ images, videos }) => {
    const allMedia = [];
    
    if (images) {
      const imageArray = Array.isArray(images) ? images : [images];
      imageArray.forEach(img => allMedia.push({ type: 'image', url: img }));
    }
    
    if (videos) {
      const videoArray = Array.isArray(videos) ? videos : [videos];
      videoArray.forEach(vid => allMedia.push({ type: 'video', url: vid }));
    }

    if (allMedia.length === 0) return null;

    const getGridClass = (count) => {
      if (count === 1) return 'grid-cols-1';
      if (count === 2) return 'grid-cols-2';
      if (count === 3) return 'grid-cols-3';
      return 'grid-cols-2';
    };

    return (
      <div className={`grid ${getGridClass(Math.min(allMedia.length, 4))} gap-3 mb-6`}>
        {allMedia.slice(0, 4).map((media, idx) => (
          <div 
            key={idx} 
            className="relative group overflow-hidden rounded-2xl cursor-pointer aspect-square border-2 border-white/10 hover:border-[#ceea45]/50 transition-all hover:scale-[1.02]"
            onClick={() => openMediaModal(allMedia, idx)}
          >
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={`Media ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/30 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform animate-pulse">
                    <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            )}
            {idx === 3 && allMedia.length > 4 && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center">
                <span className="text-[#ceea45] text-3xl font-black">+{allMedia.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const MediaModal = () => {
    if (!mediaModal.open) return null;

    const currentItem = mediaModal.items[mediaModal.index];

    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" onClick={closeMediaModal}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeMediaModal();
          }}
          className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-[#ceea45] backdrop-blur-md rounded-full transition-all hover:scale-110 border border-white/20 group z-10"
        >
          <X className="w-6 h-6 text-white group-hover:text-black transition-colors" />
        </button>

        {mediaModal.items.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevMedia();
              }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-[#ceea45] backdrop-blur-md rounded-full transition-all hover:scale-110 border border-white/20 group z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-black transition-colors" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextMedia();
              }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-[#ceea45] backdrop-blur-md rounded-full transition-all hover:scale-110 border border-white/20 group z-10"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-black transition-colors" />
            </button>
          </>
        )}

        <div className="max-w-5xl w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {currentItem?.type === 'image' ? (
            <img
              src={currentItem.url}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
          ) : (
            <video
              src={currentItem?.url}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
          )}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20">
          <span className="text-[#ceea45] text-sm font-bold">
            {mediaModal.index + 1} / {mediaModal.items.length}
          </span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-[#ceea45] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
        <div className="text-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl max-w-md">
          <div className="w-16 h-16 bg-rose-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-rose-500/30">
            <MessageSquare className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Post Not Found</h2>
          <p className="text-gray-400 mb-4">This post may have been deleted or doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-bold rounded-xl hover:shadow-xl hover:shadow-[#ceea45]/50 transition-all hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen bg-transparent overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10     top-0 shadow-xl">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-300 hover:text-[#ceea45] transition-all group"
              >
                <div className="p-2 bg-white/5 group-hover:bg-[#ceea45]/20 rounded-xl transition-all border border-white/10 group-hover:border-[#ceea45]/50">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="font-bold hidden sm:inline">Back</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-[#ceea45]/50 group"
                >
                  <Share2 className="w-5 h-5 text-gray-300 group-hover:text-[#ceea45] transition-colors" />
                </button>
                {/* <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-[#ceea45]/50 group">
                  <Bookmark className="w-5 h-5 text-gray-300 group-hover:text-[#ceea45] transition-colors" />
                </button> */}
                {isAuthor && (
                  <>
                    <button 
                      onClick={() => router.push(`/edit-post/${postId}`)}
                      className="p-2.5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-blue-500/50 group"
                    >
                      <Edit className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                    </button>
                    <button 
                      onClick={() => setDeleteModal({ open: true, type: 'post', id: postId, commentId: '' })}
                      className="p-2.5 hover:bg-red-500/20 rounded-xl transition-all border border-white/10 hover:border-red-500/50 group"
                    >
                      <Trash2 className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`relative z-10 max-w-5xl mx-auto px-4 py-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Post Content */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-6"
            style={{
              boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
            }}
          >








          {/* Author Info */}
{/* Author Info */}
<div className="p-6 border-b border-white/10">
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-4">
      <div className="relative">
        <img
          src={post.userId?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userId?.fullname || 'User')}&background=ceea45&color=000`}
          alt={post.userId?.fullname}
          className="w-14 h-14 rounded-full object-cover cursor-pointer hover:ring-4 hover:ring-[#ceea45]/50 transition-all border-2 border-white/20"
          onClick={() => navigateToProfile(post.userId?._id)}
        />
        {post.userId?.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h3 
            className="font-bold text-white cursor-pointer hover:text-[#ceea45] transition-colors"
            onClick={() => navigateToProfile(post.userId?._id)}
          >
            {post.userId?.fullname || 'Unknown User'}
          </h3>
          {post.userId?.isVerified && (
            <CheckCircle className="w-5 h-5 text-blue-400 fill-blue-400" />
          )}
        </div>
        <p className="text-sm text-gray-400">{formatDate(post.createdAt)}</p>
      </div>
    </div>

    {/* ✅ HIDDEN: Follow button removed temporarily */}
    {/* {!isAuthor && (
      <button
        onClick={handleFollowToggle}
        disabled={loadingStates.follow}
        className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 ${
          isFollowing
            ? 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
            : 'bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black border-[#ceea45] hover:shadow-lg hover:shadow-[#ceea45]/50 hover:scale-105'
        }`}
      >
        {loadingStates.follow ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          <>
            <UserMinus className="w-4 h-4" />
            <span className="hidden sm:inline">Following</span>
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Follow</span>
          </>
        )}
      </button>
    )} */}
  </div>
</div>
            {/* Post Body */}
            <div className="p-6">
              <h1 className="text-3xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent mb-6 leading-tight">{post.title}</h1>
              
              {/* Media Gallery */}
              <MediaGallery images={post.image} videos={post.video} />

              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-6">{post.description}</p>

              {/* Job Details */}
              {(post.jobType || post.price?.amount || post.jobDuration) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.jobType && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-300 rounded-xl text-sm font-bold backdrop-blur-sm hover:scale-105 transition-transform">
                      <Briefcase className="w-4 h-4" />
                      {post.jobType}
                    </span>
                  )}
                  {post.price?.amount && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 text-emerald-300 rounded-xl text-sm font-bold backdrop-blur-sm hover:scale-105 transition-transform">
                      <DollarSign className="w-4 h-4" />
                      {post.price.currency} {post.price.amount.toLocaleString()}
                    </span>
                  )}
                  {post.jobDuration && (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-amber-300 rounded-xl text-sm font-bold backdrop-blur-sm hover:scale-105 transition-transform">
                      <Clock className="w-4 h-4" />
                      {post.jobDuration}
                    </span>
                  )}
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#ceea45]/10 text-[#ceea45] border border-[#ceea45]/30 rounded-full text-sm font-medium hover:bg-[#ceea45]/20 transition-all backdrop-blur-sm cursor-pointer hover:scale-105"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 text-gray-400 border-t border-white/10 pt-4">
                <span className="flex items-center gap-2 hover:text-[#ceea45] transition-colors cursor-pointer">
                  <Eye className="w-5 h-5 text-[#ceea45]" />
                  <span className="font-semibold">{post.views || 0}</span>
                </span>
                <span className="flex items-center gap-2 hover:text-rose-400 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <span className="font-semibold">{post.likes?.length || 0}</span>
                </span>
                <span className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">{post.comments?.length || 0}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 flex items-center gap-3">
              <button
                onClick={handleLikePost}
                disabled={loadingStates.likePost}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 hover:scale-105 ${
                  isLiked
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 hover:bg-rose-500/30 shadow-lg shadow-rose-500/20'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-[#ceea45]/50 hover:text-[#ceea45]'
                } disabled:opacity-50`}
              >
                {loadingStates.likePost ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current animate-pulse' : ''}`} />
                )}
                <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
              </button>
              <button
                onClick={() => document.getElementById('comment-input')?.focus()}
                className="flex-1 py-3 bg-white/5 border-2 border-white/20 text-gray-300 hover:bg-white/10 hover:border-[#ceea45]/50 hover:text-[#ceea45] rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="hidden sm:inline">Comment</span>
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-3 bg-white/5 border-2 border-white/20 text-gray-300 hover:bg-white/10 hover:border-[#ceea45]/50 hover:text-[#ceea45] rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6"
            style={{
              boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
            }}
          >
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#ceea45]" />
              Comments ({post.comments?.length || 0})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-3">
                <img
                  src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || 'You')}&background=ceea45&color=000`}
                  alt="You"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    id="comment-input"
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl focus:outline-none focus:border-[#ceea45] focus:bg-white/10 transition-all text-white placeholder:text-gray-500 backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    disabled={loadingStates.addComment || !commentText.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] hover:from-[#b8d93c] hover:to-[#ceea45] text-black rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#ceea45]/50 hover:scale-105"
                  >
                    {loadingStates.addComment ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => {
                  const isCommentAuthor = comment.userId?._id === currentUserId;

                  return (
                    <div key={comment._id} className="group animate-fadeIn">
                      <div className="flex gap-3">
                        <img
                          src={comment.userId?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userId?.fullname || 'User')}&background=random`}
                          alt={comment.userId?.fullname}
                          className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-4 hover:ring-[#ceea45]/50 transition-all border-2 border-white/20"
                          onClick={() => navigateToProfile(comment.userId?._id)}
                        />
                        <div className="flex-1">
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 
                                    className="font-bold text-white cursor-pointer hover:text-[#ceea45] transition-colors text-sm"
                                    onClick={() => navigateToProfile(comment.userId?._id)}
                                  >
                                    {comment.userId?.fullname || 'User'}
                                  </h4>
                                  {comment.userId?.isVerified && (
                                    <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</p>
                              </div>
                              {isCommentAuthor && (
                                <button
                                  onClick={() => setDeleteModal({ open: true, type: 'comment', id: comment._id, commentId: '' })}
                                  disabled={loadingStates[`deleteComment-${comment._id}`]}
                                  className="p-1.5 hover:bg-rose-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-500/50"
                                >
                                  {loadingStates[`deleteComment-${comment._id}`] ? (
                                    <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-rose-400" />
                                  )}
                                </button>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed break-words">{comment.text}</p>
                          </div>

                          {/* Comment Actions */}
                          <div className="flex items-center gap-4 mt-2 ml-3 text-sm">
                            <button
                              onClick={() => handleLikeComment(comment._id)}
                              disabled={loadingStates[`likeComment-${comment._id}`]}
                              className={`flex items-center gap-1 font-medium transition-all disabled:opacity-50 hover:scale-110 ${
                                isCommentLiked(comment)
                                  ? 'text-rose-400'
                                  : 'text-gray-400 hover:text-rose-400'
                              }`}
                            >
                              {loadingStates[`likeComment-${comment._id}`] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Heart className={`w-4 h-4 ${isCommentLiked(comment) ? 'fill-current animate-pulse' : ''}`} />
                              )}
                              <span>{comment.likes?.length || 0}</span>
                            </button>

                            <button
                              onClick={() => setShowReplies({ ...showReplies, [comment._id]: !showReplies[comment._id] })}
                              className="flex items-center gap-1 text-gray-400 hover:text-[#ceea45] transition-colors font-medium hover:scale-110"
                            >
                              <Reply className="w-4 h-4" />
                              <span>Reply ({comment.replies?.length || 0})</span>
                            </button>
                          </div>

                          {/* Replies Section */}
                          {showReplies[comment._id] && (
                            <div className="mt-4 ml-3 pl-4 border-l-2 border-[#ceea45]/30 space-y-3 animate-fadeIn">
                              {/* Add Reply Input */}
                              <div className="flex gap-2">
                                <img
                                  src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || 'You')}&background=ceea45&color=000`}
                                  alt="You"
                                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                                />
                                <div className="flex-1 flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="Write a reply..."
                                    value={replyText[comment._id] || ''}
                                    onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment._id)}
                                    className="flex-1 px-3 py-2 text-sm bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-[#ceea45] focus:bg-white/10 transition-all text-white placeholder:text-gray-500 backdrop-blur-sm"
                                  />
                                  <button
                                    onClick={() => handleAddReply(comment._id)}
                                    disabled={loadingStates[`addReply-${comment._id}`]}
                                    className="px-4 py-2 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-xl hover:from-[#b8d93c] hover:to-[#ceea45] transition-all shadow-sm disabled:opacity-50 hover:scale-105"
                                  >
                                    {loadingStates[`addReply-${comment._id}`] ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Send className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Replies List */}
                              {comment.replies && comment.replies.length > 0 ? (
                                <div className="space-y-3">
                                  {comment.replies.map((reply) => {
                                    const isReplyAuthor = reply.userId?._id === currentUserId;

                                    return (
                                      <div key={reply._id} className="flex gap-2 group animate-fadeIn">
                                        <img
                                          src={reply.userId?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.userId?.fullname || 'User')}&background=random`}
                                          alt={reply.userId?.fullname}
                                          className="w-7 h-7 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#ceea45]/50 transition-all border border-white/20"
                                          onClick={() => navigateToProfile(reply.userId?._id)}
                                        />
                                        <div className="flex-1">
                                          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 hover:bg-white/10 transition-colors backdrop-blur-sm">
                                            <div className="flex items-start justify-between mb-1">
                                              <div className="flex items-center gap-2">
                                                <span 
                                                  className="font-semibold text-white text-sm cursor-pointer hover:text-[#ceea45] transition-colors"
                                                  onClick={() => navigateToProfile(reply.userId?._id)}
                                                >
                                                  {reply.userId?.fullname || 'User'}
                                                </span>
                                                {reply.userId?.isVerified && (
                                                  <CheckCircle className="w-3 h-3 text-blue-400 fill-blue-400" />
                                                )}
                                                <span className="text-xs text-gray-500">{timeAgo(reply.createdAt)}</span>
                                              </div>
                                              {isReplyAuthor && (
                                                <button
                                                  onClick={() => setDeleteModal({ open: true, type: 'reply', id: reply._id, commentId: comment._id })}
                                                  disabled={loadingStates[`deleteReply-${reply._id}`]}
                                                  className="p-1 hover:bg-rose-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-500/50"
                                                >
                                                  {loadingStates[`deleteReply-${reply._id}`] ? (
                                                    <Loader2 className="w-3 h-3 text-rose-400 animate-spin" />
                                                  ) : (
                                                    <Trash2 className="w-3 h-3 text-rose-400" />
                                                  )}
                                                </button>
                                              )}
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed break-words">{reply.text}</p>
                                          </div>

                                          {/* Reply Like Button */}
                                          <button
                                            onClick={() => handleLikeReply(comment._id, reply._id)}
                                            disabled={loadingStates[`likeReply-${reply._id}`]}
                                            className={`mt-1.5 ml-2 text-xs font-medium transition-all flex items-center gap-1 disabled:opacity-50 hover:scale-110 ${
                                              isReplyLiked(reply)
                                                ? 'text-rose-400'
                                                : 'text-gray-400 hover:text-rose-400'
                                            }`}
                                          >
                                            {loadingStates[`likeReply-${reply._id}`] ? (
                                              <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                              <Heart className={`w-3 h-3 ${isReplyLiked(reply) ? 'fill-current animate-pulse' : ''}`} />
                                            )}
                                            <span>{reply.likes?.length || 0}</span>
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                                  <p className="text-xs text-gray-500 italic">No replies yet. Be the first! ✨</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                    <MessageSquare className="w-10 h-10 text-gray-500" />
                  </div>
                  <p className="text-white font-bold mb-1">No comments yet</p>
                  <p className="text-sm text-gray-400">Be the first to comment! 💬</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Modal */}
      <MediaModal />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal />

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default PostDetailPage;