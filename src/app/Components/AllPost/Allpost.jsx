'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import { useGetOrCreateChatMutation } from '@/app/Store/apiSclice/messageApiSlice'

import { 
  useGetAllPostsQuery, 
  useToggleLikeMutation, 
  useAddCommentMutation, 
  useLikeCommentMutation,
  useAddReplyMutation 
} from '@/app/Store/apiSclice/PostApiSlice'
import { selectIsAuthenticated, selectCurrentUser } from '@/app/Store/Sclies/authSlice'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Search, Eye, Heart, MessageCircle, Share2, MoreVertical, Send, X, Sparkles, Play, Image as ImageIcon } from 'lucide-react'

// Popup Menu Component
const PostMenu = ({ isOpen, onClose, onViewPost, onShare, onLike, isLiked }) => {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="absolute right-0 top-12 bg-gradient-to-br from-gray-900 to-black border border-[#ceea45]/20 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[180px] backdrop-blur-xl"
      >
        <button
          onClick={() => {
            onViewPost()
            onClose()
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#ceea45]/10 transition-colors border-b border-white/10"
        >
          <Eye className="w-4 h-4 text-[#ceea45]" />
          <span>View Post</span>
        </button>
        
        <button
          onClick={() => {
            onShare()
            onClose()
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-[#ceea45]/10 transition-colors border-b border-white/10"
        >
          <Share2 className="w-4 h-4 text-[#ceea45]" />
          <span>Share</span>
        </button>
        
        <button
          onClick={() => {
            onLike()
            onClose()
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
            isLiked ? 'text-red-500 hover:bg-red-500/10' : 'text-white hover:bg-[#ceea45]/10'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : 'text-[#ceea45]'}`} />
          <span>{isLiked ? 'Unlike' : 'Like'}</span>
        </button>
      </motion.div>
    </>
  )
}

// Toast Component
const Toast = ({ show, message, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-xl ${
          type === 'error' 
            ? 'bg-red-500/90 text-white border border-red-400' 
            : 'bg-green-500/90 text-white border border-green-400'
        }`}>
          <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
          <span className="font-medium">{message}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Media Gallery Component - Videos First!
const MediaGallery = ({ videos = [], images = [] }) => {
  const allMedia = [
    ...videos.map(v => ({ type: 'video', url: v })),
    ...images.map(i => ({ type: 'image', url: i }))
  ]

  if (allMedia.length === 0) return null

  // Smart grid layout
  const getGridLayout = () => {
    if (allMedia.length === 1) return 'grid-cols-1'
    if (allMedia.length === 2) return 'grid-cols-2'
    if (allMedia.length === 3) return 'grid-cols-3'
    return 'grid-cols-2 lg:grid-cols-3'
  }

  return (
    <div className={`grid ${getGridLayout()} gap-3 mb-4`}>
      {allMedia.slice(0, 6).map((media, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="relative aspect-video rounded-xl overflow-hidden group/media cursor-pointer"
        >
          {media.type === 'video' ? (
            <>
              <video
                src={media.url}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/media:opacity-100 transition-all duration-300 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full"
                >
                  <Play className="w-6 h-6 text-white fill-white" />
                </motion.div>
              </div>
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-xs text-white font-bold flex items-center gap-1">
                <Play className="w-3 h-3 fill-white" />
                VIDEO
              </div>
            </>
          ) : (
            <>
              <img
                src={media.url}
                alt={`Media ${index + 1}`}
                className="w-full h-full object-cover group-hover/media:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded-lg text-xs text-white font-bold flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                IMAGE
              </div>
            </>
          )}

          {/* Show +N more */}
          {index === 5 && allMedia.length > 6 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white text-3xl font-black">
                +{allMedia.length - 6}
              </span>
            </div>
          )}

          <div className="absolute inset-0 border-2 border-[#ceea45]/0 group-hover/media:border-[#ceea45]/50 rounded-xl transition-all duration-300" />
        </motion.div>
      ))}
    </div>
  )
}

// ✅ BENTO CARD
const BentoCard = ({ children, className = '', delay = 0, span = '', hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={hover ? { 
        y: -8, 
        transition: { duration: 0.3, ease: "easeOut" } 
      } : {}}
      className={`group relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden ${span} ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ceea45]/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-gray-900/95 to-black/95" />
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}

const AllPost = () => {
  const router = useRouter()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrentUser)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [commentText, setCommentText] = useState({})
  const [replyText, setReplyText] = useState({})
  const [showComments, setShowComments] = useState({})
  const [showReplyBox, setShowReplyBox] = useState({})
  const [openMenuId, setOpenMenuId] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' })

  // ✅ Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data, isLoading, isError, error, refetch } = useGetAllPostsQuery(undefined, {
    skip: !isAuthenticated
  })

  const [toggleLike] = useToggleLikeMutation()
  const [addComment] = useAddCommentMutation()
  const [likeComment] = useLikeCommentMutation()
  const [addReply] = useAddReplyMutation()
  const [getOrCreateChat, { isLoading: isCreatingChat }] = useGetOrCreateChatMutation()

  const allPosts = data?.posts

  useEffect(() => {
    if (isError) {
      if (error?.status === 401 || error?.status === 400) {
        router.push('/Pages/Auth/login')
      } else {
        setToast({ show: true, message: error?.data?.message || 'Something went wrong', type: 'error' })
      }
    }
  }, [isError, error, router])

  const filteredPosts = allPosts?.filter(post => {
    const query = debouncedSearch.toLowerCase()
    if (!query) return true
    
    return (
      post.title?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      post.tags?.some(tag => tag?.toLowerCase().includes(query)) ||
      post.userId?.username?.toLowerCase().includes(query) ||
      post.userId?.fullname?.toLowerCase().includes(query) ||
      post.jobType?.toLowerCase().includes(query)
    )
  })

  const handleLike = async (postId) => {
    try {
      await toggleLike(postId).unwrap()
      setToast({ show: true, message: 'Post liked!', type: 'success' })
    } catch (err) {
      console.error('Failed to like post:', err)
      let message = 'Failed to like post'
      
      if (err?.status === 401) {
        message = 'Please log in to like posts'
        setTimeout(() => router.push('/Pages/Auth/login'), 2000)
      }
      
      setToast({ show: true, message, type: 'error' })
    }
  }

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) {
      setToast({ show: true, message: 'Comment cannot be empty', type: 'error' })
      return
    }

    try {
      await addComment({
        postId,
        text: commentText[postId]
      }).unwrap()
      
      setCommentText(prev => ({ ...prev, [postId]: '' }))
      setToast({ show: true, message: 'Comment posted!', type: 'success' })
    } catch (err) {
      console.error('Failed to comment:', err)
      setToast({ show: true, message: 'Failed to post comment', type: 'error' })
    }
  }

  const handleReply = async (postId, commentId) => {
    if (!replyText[commentId]?.trim()) {
      setToast({ show: true, message: 'Reply cannot be empty', type: 'error' })
      return
    }

    try {
      await addReply({ 
        postId, 
        commentId, 
        text: replyText[commentId] 
      }).unwrap()
      
      setReplyText(prev => ({ ...prev, [commentId]: '' }))
      setShowReplyBox(prev => ({ ...prev, [commentId]: false }))
      setToast({ show: true, message: 'Reply posted!', type: 'success' })
    } catch (err) {
      console.error('Failed to reply:', err)
      setToast({ show: true, message: 'Failed to post reply', type: 'error' })
    }
  }

  const handleCommentLike = async (postId, commentId) => {
    try {
      await likeComment({ postId, commentId }).unwrap()
    } catch (err) {
      console.error('Failed to like comment:', err)
    }
  }

  const handleConnect = async (userId) => {
    if (!userId) return
    
    try {
      const chatResult = await getOrCreateChat(userId).unwrap()
      router.push(`/Pages/Main/messages?chatId=${chatResult.chat._id}`)
    } catch (error) {
      console.error("Failed to open chat:", error)
      setToast({ 
        show: true, 
        message: 'Failed to open chat. Please try again.', 
        type: 'error' 
      })
    }
  }

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const toggleReplyBox = (commentId) => {
    setShowReplyBox(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  const handleShare = async (post) => {
    const shareUrl = `${window.location.origin}/Pages/Main/post/${post._id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: shareUrl
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(shareUrl)
          setToast({ show: true, message: 'Link copied to clipboard!', type: 'success' })
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      setToast({ show: true, message: 'Link copied to clipboard!', type: 'success' })
    }
  }

  const goToUserId = (profileId) => {
    const userId = typeof profileId === 'string' 
      ? profileId 
      : profileId?._id || profileId?.id;
    
    if (!userId) {
      console.error('Invalid user ID:', profileId);
      return;
    }
    
    router.replace(`/Pages/Main/profile/${userId}`);
  };

  const isPostLikedByUser = (post) => {
    return post.likes?.some(like => like === currentUser?._id || like?._id === currentUser?._id)
  }

  const isCommentLikedByUser = (comment) => {
    return comment.likes?.some(like => like === currentUser?._id || like?._id === currentUser?._id)
  }

  if (!isAuthenticated) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-4 border-[#ceea45]/20 border-t-[#ceea45]"
        />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className='h-full w-full overflow-y-auto bg-black'>
        
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30"
            animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30"
            animate={{ x: [0, -40, 40, 0], y: [0, 40, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10">
          {/* Search Bar */}
          <div className="sticky top-0 backdrop-blur-xl bg-black/40 z-20 pb-4 px-1 md:px-4 lg:px-4">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ceea45] to-purple-500 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 blur" />
              
              <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#ceea45]/30 group-focus-within:border-[#ceea45] rounded-2xl transition-all duration-300 flex items-center px-4">
                <Search className="text-[#ceea45] w-5 h-5 flex-shrink-0" />
                
                <input
                  type="text"
                  placeholder="Search posts, tags, users, or job types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white pl-3 pr-4 py-3 rounded-xl focus:outline-none text-sm placeholder-gray-500"
                />
                
                {searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-[#ceea45] transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {debouncedSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 text-xs text-gray-400 text-center w-full"
                >
                  Found {filteredPosts?.length || 0} result{filteredPosts?.length !== 1 ? 's' : ''}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Posts Grid */}
          <div className="max-w-7xl mx-auto space-y-5 px-2 md:px-4 lg:px-4 py-6">
            {filteredPosts && filteredPosts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {filteredPosts.map((post, index) => (
                  <BentoCard key={post._id} delay={index * 0.05}>
                    <div className="p-6 md:p-8">
                      
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[#ceea45]/10">
                        <motion.div 
                          onClick={() => goToUserId(post.userId?._id)}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-start gap-4 flex-1 cursor-pointer"
                        >
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            src={post.userId?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            alt={post.userId?.username}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-[#ceea45]/30 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-black text-white text-lg hover:text-[#ceea45] transition-colors">
                                {post.userId?.username || 'Anonymous'}
                              </h3>
                              {post.userId?.fullname && (
                                <span className="text-sm text-[#ceea45]/70">
                                  {post.userId.fullname}
                                </span>
                              )}
                            </div>
                            {post.userId?.email && (
                              <p className="text-xs text-gray-400 truncate">{post.userId.email}</p>
                            )}
                          </div>
                        </motion.div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleConnect(post.userId?._id)}
                            disabled={isCreatingChat}
                            className="px-5 py-2 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#ceea45]/50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCreatingChat ? 'Opening...' : 'Message'}
                          </motion.button>

                          <div className="relative">
                            <motion.button 
                              whileHover={{ rotate: 90 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setOpenMenuId(openMenuId === post._id ? null : post._id)}
                              className="p-2 hover:bg-[#ceea45]/10 rounded-xl transition-all"
                            >
                              <MoreVertical className="w-5 h-5 text-[#ceea45]" />
                            </motion.button>
                            <PostMenu 
                              isOpen={openMenuId === post._id}
                              onClose={() => setOpenMenuId(null)}
                              onViewPost={() => router.push(`/Pages/Main/post/${post._id}`)}
                              onShare={() => handleShare(post)}
                              onLike={() => handleLike(post._id)}
                              isLiked={isPostLikedByUser(post)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-6">
                        <h2 className="text-2xl font-black text-white mb-3 hover:text-[#ceea45] transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-300 text-base leading-relaxed mb-4">
                          {post.description}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 5).map((tag, i) => (
                              <motion.span
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-1 bg-[#ceea45]/10 text-[#ceea45] text-xs font-bold rounded-full border border-[#ceea45]/30 hover:border-[#ceea45]/50 transition-all cursor-pointer"
                              >
                                #{tag}
                              </motion.span>
                            ))}
                            {post.tags.length > 5 && (
                              <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs font-bold rounded-full">
                                +{post.tags.length - 5}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Media Gallery - Videos First! */}
                      <MediaGallery videos={post.video} images={post.image} />

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-4 py-2 bg-gradient-to-r from-[#ceea45]/20 to-purple-500/20 text-white text-sm font-bold rounded-lg border border-[#ceea45]/30">
                          {post.jobType || 'Not specified'}
                        </span>
                        {post.jobDuration && (
                          <span className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-bold rounded-lg">
                            ⏱️ {post.jobDuration}
                          </span>
                        )}
                        {post.price && (
                          <span className="px-4 py-2 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-bold text-sm rounded-lg shadow-lg shadow-[#ceea45]/20">
                            💰 {post.price.amount} {post.price.currency}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#ceea45]/10">
                        <div className="flex items-center gap-8">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLike(post._id)}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group"
                          >
                            <Heart
                              className={`w-5 h-5 transition-all ${
                                isPostLikedByUser(post) ? 'fill-red-500 text-red-500 scale-125' : 'group-hover:scale-110'
                              }`}
                            />
                            <span className="text-sm font-bold">{post.likes?.length || 0}</span>
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleComments(post._id)}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#ceea45] transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-bold">{post.comments?.length || 0}</span>
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleShare(post)}
                            className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
                          >
                            <Share2 className="w-5 h-5" />
                          </motion.button>
                        </div>

                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/Pages/Main/post/${post._id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#ceea45]/10 hover:bg-[#ceea45]/20 text-[#ceea45] rounded-lg transition-all border border-[#ceea45]/30 font-bold"
                        >
                          <Eye className="w-4 h-4" />
                          View Full
                        </motion.button>
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-3 mb-4 p-4 bg-[#ceea45]/5 rounded-xl border border-[#ceea45]/20">
                        <img
                          src={currentUser?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                          alt="Your profile"
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText[post._id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                          className="flex-1 bg-transparent text-white px-3 py-2 rounded-lg focus:outline-none placeholder-gray-500"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleComment(post._id)}
                          disabled={!commentText[post._id]?.trim()}
                          className="p-2 bg-[#ceea45] text-black rounded-lg hover:bg-[#b8d93c] transition-all disabled:opacity-30"
                        >
                          <Send className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {showComments[post._id] && post.comments && post.comments.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-3 max-h-96 overflow-y-auto"
                          >
                            {post.comments.map((comment) => (
                              <div key={comment._id} className="bg-[#ceea45]/5 rounded-lg p-4 border border-[#ceea45]/20">
                                <div className="flex items-start gap-3">
                                  <img
                                    src={comment.userId?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                    alt={comment.userId?.username}
                                    className="w-9 h-9 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-white text-sm">
                                        {comment.userId?.username}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">{comment.text}</p>
                                    
                                    <div className="flex items-center gap-4">
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => handleCommentLike(post._id, comment._id)}
                                        className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors text-xs"
                                      >
                                        <Heart
                                          className={`w-3 h-3 ${
                                            isCommentLikedByUser(comment) ? 'fill-red-500 text-red-500' : ''
                                          }`}
                                        />
                                        <span>{comment.likes?.length || 0}</span>
                                      </motion.button>
                                      
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => toggleReplyBox(comment._id)}
                                        className="text-xs text-gray-400 hover:text-[#ceea45] transition-colors"
                                      >
                                        Reply
                                      </motion.button>
                                    </div>

                                    {/* Reply Box */}
                                    <AnimatePresence>
                                      {showReplyBox[comment._id] && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="flex items-center gap-2 mt-2"
                                        >
                                          <input
                                            type="text"
                                            placeholder="Write a reply..."
                                            value={replyText[comment._id] || ''}
                                            onChange={(e) => setReplyText(prev => ({ ...prev, [comment._id]: e.target.value }))}
                                            onKeyPress={(e) => e.key === 'Enter' && handleReply(post._id, comment._id)}
                                            className="flex-1 bg-gray-700 text-white px-3 py-1.5 rounded-lg border border-[#ceea45]/30 focus:border-[#ceea45] focus:outline-none text-sm"
                                          />
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleReply(post._id, comment._id)}
                                            disabled={!replyText[comment._id]?.trim()}
                                            className="p-1.5 bg-[#ceea45] text-black rounded-lg hover:bg-[#b8d93c] transition-all disabled:opacity-30"
                                          >
                                            <Send className="w-3 h-3" />
                                          </motion.button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>

                                    {/* Replies */}
                                    {comment.replies && comment.replies.length > 0 && (
                                      <div className="mt-2 space-y-2 ml-4 border-l-2 border-[#ceea45]/20 pl-3">
                                        {comment.replies.map((reply) => (
                                          <div key={reply._id} className="flex items-start gap-2">
                                            <img
                                              src={reply.userId?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                              alt={reply.userId?.username}
                                              className="w-6 h-6 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                              <span className="font-bold text-white text-xs">
                                                {reply.userId?.username}
                                              </span>
                                              <p className="text-gray-300 text-xs">{reply.text}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </BentoCard>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <Sparkles className="w-20 h-20 text-[#ceea45]/30 mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-400 text-lg font-bold mb-2">No posts found</p>
                {debouncedSearch && (
                  <p className="text-gray-500 text-sm">
                    Try adjusting your search query
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })}
      />
    </ProtectedRoute>
  )
}

export default AllPost