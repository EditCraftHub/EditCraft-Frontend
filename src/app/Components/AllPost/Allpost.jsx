'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
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
import { Search, Eye, Heart, MessageCircle, Share2, MoreVertical, Send, X, Sparkles } from 'lucide-react'

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
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
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

  // ✅ Improved search with better filtering
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

  const handleConnect = (userId) => {
    if (!userId) return
    router.push(`/Pages/Main/messages?userId=${userId}`)
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

const gouserId = (profileId) => {
  // ✅ Extract ID if an object is passed
  const userId = typeof profileId === 'string' 
    ? profileId 
    : profileId?._id || profileId?.id;
  
  if (!userId) {
    console.error('Invalid user ID:', profileId);
    return;
  }
  
  console.log('Navigating to user:', userId);
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
      <div className='h-full w-full overflow-y-auto bg-gradient-to-br from-green-900 via-gray-950 to-black'>
        
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/5 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        </div>

        <div className="relative z-10">
          {/* Search Bar */}
          <div className="sticky top-0 backdrop-blur-xl bg-black/40 z-20 pb-4  px-1 md:px-4  lg:px-4">
            <div className="relative group">
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

              {/* Search hints */}
              {debouncedSearch && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 text-xs text-gray-400 text-center w-full"
                >
                  Found {filteredPosts?.length || 0} result{filteredPosts?.length !== 1 ? 's' : ''}
                </motion.div>
              )}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4 px-1 lg:px-4 md:px4 py-4">
            {filteredPosts && filteredPosts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-[#ceea45]/20 hover:border-[#ceea45]/50 overflow-hidden hover:shadow-xl hover:shadow-[#ceea45]/10 transition-all duration-300"
                  >
                    {/* Post Header */}
                    <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#ceea45]/10">
                      <div onClick={() => gouserId(post.userId?._id) } className="flex items-start gap-3 flex-1">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={post.userId?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                          alt={post.userId?.username}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-[#ceea45]/30 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-white truncate text-lg">
                              {post.userId?.username || 'Anonymous'}
                            </h3>
                            {post.userId?.fullname && (
                              <span className="text-sm text-[#ceea45]/70">
                                • {post.userId.fullname}
                              </span>
                            )}
                          </div>
                          {post.userId?.email && (
                            <p className="text-xs text-gray-400 truncate">{post.userId.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-start gap-2 sm:items-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleConnect(post.userId?._id)}
                          className="px-4 py-2 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#ceea45]/50 transition-all text-sm whitespace-nowrap"
                        >
                          Message
                        </motion.button>

                        <div className="relative ml-10">
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
                    <div className="px-4 md:px-5 py-4">
                      <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#ceea45] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3">
                        {post.description}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 4).map((tag, index) => (
                            <motion.span
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className="px-3 py-1 bg-[#ceea45]/10 text-[#ceea45] text-xs font-semibold rounded-full border border-[#ceea45]/30 hover:border-[#ceea45]/50 transition-all cursor-pointer"
                            >
                              #{tag}
                            </motion.span>
                          ))}
                          {post.tags.length > 4 && (
                            <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs font-semibold rounded-full">
                              +{post.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Images */}
                      {post.image && post.image.length > 0 && (
                        <div className={`grid gap-3 mb-4 ${
                          post.image.length === 1 ? 'grid-cols-1' : 
                          post.image.length === 2 ? 'grid-cols-2' : 
                          'grid-cols-3'
                        }`}>
                          {post.image.slice(0, 5).map((img, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className="relative aspect-square rounded-xl overflow-hidden group/image cursor-pointer"
                            >
                              <img
                                src={img}
                                alt={`Post image ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              {index === 4 && post.image.length > 5 && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                  <span className="text-white text-2xl font-bold">
                                    +{post.image.length - 5}
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-[#ceea45]/20 to-purple-500/20 text-white text-xs font-semibold rounded-lg border border-[#ceea45]/30">
                          {post.jobType || 'Not specified'}
                        </span>
                        {post.jobDuration && (
                          <span className="px-3 py-1.5 bg-gray-800 text-gray-300 text-xs font-semibold rounded-lg">
                            ⏱️ {post.jobDuration}
                          </span>
                        )}
                        {post.price && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-bold text-xs rounded-lg shadow-lg shadow-[#ceea45]/20">
                            💰 {post.price.amount} {post.price.currency}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Post Footer - Actions */}
                    <div className="px-4 md:px-5 py-3 border-t border-[#ceea45]/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-6">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLike(post._id)}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group/like"
                          >
                            <Heart
                              className={`w-5 h-5 transition-all ${
                                isPostLikedByUser(post) ? 'fill-red-500 text-red-500 scale-125' : 'group-hover/like:scale-110'
                              }`}
                            />
                            <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleComments(post._id)}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#ceea45] transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">{post.comments?.length || 0}</span>
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
                          className="flex items-center gap-2 px-4 py-2 bg-[#ceea45]/10 hover:bg-[#ceea45]/20 text-[#ceea45] rounded-lg transition-all border border-[#ceea45]/30 font-semibold text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Post
                        </motion.button>
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 mb-3 p-3 bg-gray-800/50 rounded-xl border border-[#ceea45]/10">
                        <img
                          src={currentUser?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                          alt="Your profile"
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText[post._id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                          className="flex-1 bg-transparent text-white px-3 py-1 rounded-lg focus:outline-none text-sm placeholder-gray-500"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleComment(post._id)}
                          disabled={!commentText[post._id]?.trim()}
                          className="p-2 bg-[#ceea45] text-black rounded-lg hover:bg-[#b8d93c] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
                            className="mt-3 space-y-3 max-h-96 overflow-y-auto"
                          >
                            {post.comments.map((comment) => (
                              <div key={comment._id} className="bg-gray-800/50 rounded-lg p-3 border border-[#ceea45]/10">
                                <div className="flex items-start gap-2">
                                  <img
                                    src={comment.userId?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                    alt={comment.userId?.username}
                                    className="w-8 h-8 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-white text-sm">
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
                                        whileTap={{ scale: 0.95 }}
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
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleReply(post._id, comment._id)}
                                            disabled={!replyText[comment._id]?.trim()}
                                            className="p-1.5 bg-[#ceea45] text-black rounded-lg hover:bg-[#b8d93c] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
                                              <span className="font-semibold text-white text-xs">
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
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <Sparkles className="w-16 h-16 text-[#ceea45]/30 mx-auto mb-4" />
                </motion.div>
                <p className="text-gray-400 text-lg font-semibold mb-2">No posts found</p>
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