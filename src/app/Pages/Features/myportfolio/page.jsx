'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Edit3, Share2, ArrowLeft, Loader2, AlertCircle, Briefcase, 
  User, Mail, Phone, Globe, Award, Code, Star, MapPin, 
  Copy, ExternalLink, Lock, Unlock, Sparkles, Zap, Target,
  GraduationCap, FolderOpen, Languages, Wrench, ChevronRight,
  Check, X, Twitter, Linkedin, Facebook, Link2, QrCode
} from 'lucide-react';
import { useGetMyPortfolioQuery } from '@/app/Store/apiSclice/portfolioApiSlice';
import { toast } from 'react-hot-toast';

// Animated Background Component - Smoother animations
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(206,234,69,0.12),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.08),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.08),transparent_50%)]" />
    
    {/* Floating Orbs - Smoother */}
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{
          width: `${200 + i * 80}px`,
          height: `${200 + i * 80}px`,
          background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(206,234,69,0.15)' : 'rgba(147,51,234,0.12)'}, transparent 70%)`,
          left: `${5 + i * 25}%`,
          top: `${10 + i * 20}%`,
        }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -40, 40, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 15 + i * 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}

    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
  </div>
);

// Share Modal Component
const ShareModal = ({ isOpen, onClose, shareUrl, portfolioTitle }) => {
  const [copied, setCopied] = useState(false);

const handleCopy = async () => {
  // ✅ FIXED: Add validation
  if (!shareUrl) {
    toast.error('Cannot generate share link');
    return;
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!', {
      icon: '🔗',
      style: { 
        background: '#1a1a1a', 
        color: '#ceea45',
        border: '1px solid rgba(206,234,69,0.3)',
        borderRadius: '12px'
      },
    });
    setTimeout(() => setCopied(false), 3000);
  } catch (err) {
    toast.error('Failed to copy link');
    console.error('Copy error:', err);
  }
};

  const shareOptions = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/30',
      url: `https://twitter.com/intent/tweet?text=Check out my portfolio!&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2]/30',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/30',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 z-50"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#ceea45]/20">
                      <Share2 size={20} className="text-[#ceea45]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Share Portfolio</h3>
                      <p className="text-sm text-gray-500">Let others see your work</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Copy Link Section */}
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    Portfolio Link
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                      <Link2 size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-300 truncate">{shareUrl}</span>
                    </div>
                    <motion.button
                      onClick={handleCopy}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                        copied 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-[#ceea45] text-black hover:bg-[#b8d43e]'
                      }`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>
                </div>

                {/* Social Share */}
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-3 block">
                    Share on Social Media
                  </label>
                  <div className="flex gap-3">
                    {shareOptions.map((option) => (
                      <motion.a
                        key={option.name}
                        href={option.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 p-4 rounded-xl ${option.color} transition-all flex flex-col items-center gap-2`}
                      >
                        <option.icon size={22} />
                        <span className="text-xs font-medium">{option.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* QR Code Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20"
                >
                  <QrCode size={20} className="text-purple-400" />
                  <p className="text-sm text-purple-300">
                    Share your portfolio link and let recruiters see your amazing work!
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Smooth Bento Card Component
const BentoCard = ({ children, className = '', delay = 0, span = '', hover = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.22, 1, 0.36, 1] // Custom smooth easing
      }}
      whileHover={hover ? { 
        y: -8, 
        transition: { duration: 0.3, ease: "easeOut" } 
      } : {}}
      className={`group relative bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/[0.08] overflow-hidden ${span} ${className}`}
    >
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ceea45]/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-gray-900/95 to-black/95" />
      
      {/* Shine Effect */}
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
  );
};

// Video Card with smoother autoplay
const VideoCard = ({ video, index }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "-100px", amount: 0.3 });

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ scale: 1.03 }}
      className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
    >
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loop
        muted
        playsInline
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span className="text-xs text-white/90 font-medium">Playing</span>
      </div>
      
      <div className="absolute inset-0 border-2 border-[#ceea45]/0 group-hover:border-[#ceea45]/50 rounded-2xl transition-all duration-300" />
    </motion.div>
  );
};

// Photo Card with smoother animations
const PhotoCard = ({ photo, index }) => (
  <motion.a
    href={photo.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ 
      delay: index * 0.06, 
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }}
    whileHover={{ scale: 1.08, zIndex: 10 }}
    className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
  >
    <img
      src={photo.url}
      alt={`Photo ${index + 1}`}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
    />
    
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
    
    <motion.div 
      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
      initial={{ scale: 0 }}
      whileHover={{ scale: 1 }}
    >
      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
        <ExternalLink size={20} className="text-white" />
      </div>
    </motion.div>
    
    <div className="absolute inset-0 rounded-2xl ring-2 ring-[#ceea45]/0 group-hover:ring-[#ceea45]/50 transition-all duration-300" />
  </motion.a>
);

// Skill Badge with smoother spring animation
const SkillBadge = ({ skill, index, variant = 'default' }) => {
  const variants = {
    default: 'from-[#ceea45]/20 to-[#ceea45]/5 text-[#ceea45] border-[#ceea45]/30 hover:border-[#ceea45]/60',
    blue: 'from-blue-500/20 to-cyan-500/5 text-blue-400 border-blue-500/30 hover:border-blue-500/60',
    purple: 'from-purple-500/20 to-pink-500/5 text-purple-400 border-purple-500/30 hover:border-purple-500/60',
    pink: 'from-pink-500/20 to-rose-500/5 text-pink-400 border-pink-500/30 hover:border-pink-500/60',
    indigo: 'from-indigo-500/20 to-violet-500/5 text-indigo-400 border-indigo-500/30 hover:border-indigo-500/60',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.04, 
        type: "spring", 
        stiffness: 150,
        damping: 15
      }}
      whileHover={{ scale: 1.1, y: -3 }}
      className={`px-4 py-2 rounded-xl bg-gradient-to-r ${variants[variant]} border text-sm font-medium inline-flex items-center gap-2 cursor-default transition-colors duration-300`}
    >
      <Sparkles size={12} className="opacity-60" />
      {typeof skill === 'string' ? skill : skill.name}
    </motion.span>
  );
};

// Section Header Component
const SectionHeader = ({ icon: Icon, title, count, color = "#ceea45" }) => (
  <div className="flex items-center gap-3 mb-5">
    <motion.div 
      className="p-2.5 rounded-xl bg-gradient-to-br from-white/10 to-white/5" 
      style={{ color }}
      whileHover={{ rotate: [0, -10, 10, 0] }}
      transition={{ duration: 0.5 }}
    >
      <Icon size={20} />
    </motion.div>
    <h3 className="text-lg font-bold text-white">{title}</h3>
    {count !== undefined && (
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-400"
      >
        {count}
      </motion.span>
    )}
  </div>
);

// Timeline Item Component
const TimelineItem = ({ item, type, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ x: 8 }}
    className="relative pl-6 pb-6 border-l-2 border-white/10 last:pb-0 group"
  >
    <motion.div 
      className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-[#ceea45] to-[#a8c930] border-4 border-gray-900"
      whileHover={{ scale: 1.3 }}
      transition={{ type: "spring", stiffness: 300 }}
    />
    
    <div className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-[#ceea45]/20">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="font-bold text-white group-hover:text-[#ceea45] transition-colors duration-300">
            {type === 'experience' ? item.title : item.degree}
          </h4>
          <p className="text-sm text-gray-400">
            {type === 'experience' ? item.company : item.institution}
          </p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#ceea45]/10 text-[#ceea45]">
          {type === 'experience' ? item.duration : item.year}
        </span>
      </div>
      {item.description && (
        <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
      )}
    </div>
  </motion.div>
);

export default function ViewMyPortfolio() {
  const router = useRouter();
  const { data: portfolioData, isLoading, error } = useGetMyPortfolioQuery();
  const [portfolio, setPortfolio] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  useEffect(() => {
    if (portfolioData?.portfolio) {
      setPortfolio(portfolioData.portfolio);
    }
  }, [portfolioData]);

  // Generate shareable URL with portfolio ID
const getShareableUrl = () => {
  if (!portfolio) return '';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // ✅ FIXED: Use slug if available, otherwise use ID
  const identifier = portfolio.slug || portfolio._id;
  
  // ✅ FIXED: Generate correct public viewing URL
  return `${baseUrl}/portfolio/${identifier}`;
};


  // Quick copy function for inline use


const quickCopy = async () => {
  const url = getShareableUrl();
  
  // ✅ FIXED: Add validation
  if (!url) {
    toast.error('Portfolio URL not available');
    return;
  }

  try {
    await navigator.clipboard.writeText(url);
    toast.success('Portfolio link copied! 🔗', {
      icon: '✓',
      style: { 
        background: '#1a1a1a', 
        color: '#ceea45', 
        border: '1px solid rgba(206,234,69,0.3)',
        borderRadius: '12px'
      },
    });
  } catch (err) {
    toast.error('Failed to copy link');
    console.error('Copy failed:', err);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-4 border-[#ceea45]/20 border-t-[#ceea45]"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles size={24} className="text-[#ceea45]" />
            </motion.div>
          </motion.div>
          <div className="text-center">
            <p className="text-white font-medium mb-1">Loading Portfolio</p>
            <p className="text-gray-500 text-sm">Preparing your showcase...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <AnimatedBackground />
        <motion.div
          className="text-center relative z-10 max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/20">
              <AlertCircle size={56} className="text-red-400" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-3">No Portfolio Found</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Create your first portfolio and showcase your amazing work to the world. It only takes a few minutes!
          </p>
          <motion.button
            onClick={() => router.push('/Pages/Features/portfolio')}
            className="px-8 py-4 bg-gradient-to-r from-[#ceea45] to-[#a8c930] text-black font-bold rounded-2xl hover:shadow-2xl hover:shadow-[#ceea45]/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              <Sparkles size={18} />
              Create Portfolio
              <ChevronRight size={18} />
            </span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <AnimatedBackground />
      
      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={getShareableUrl()}
        portfolioTitle={portfolio.tagline}
      />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ceea45] via-purple-500 to-[#ceea45] z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* Header */}
        <motion.header
          style={{ opacity: headerOpacity }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.back()}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-[#ceea45]/30 transition-all duration-300"
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} className="text-[#ceea45]" />
            </motion.button>
            <div>
              <motion.h1
                className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-[#ceea45] to-white bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ['0% center', '200% center'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                My Portfolio
              </motion.h1>
              <p className="text-gray-500 text-sm mt-1">{portfolio.category}</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* Quick Copy Button */}
            <motion.button
              onClick={quickCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium text-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Copy size={16} />
              <span className="hidden sm:inline">Copy Link</span>
            </motion.button>

            {/* Share Button - Opens Modal */}
            <motion.button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 text-sm font-medium text-purple-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Share</span>
            </motion.button>

            {/* Edit Button */}
            <motion.button
              onClick={() => router.push('/Pages/Features/portfolio')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ceea45] to-[#a8c930] text-black font-bold hover:shadow-lg hover:shadow-[#ceea45]/30 transition-all duration-300 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 size={16} />
              <span className="hidden sm:inline">Edit</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          
          {/* Profile Card - Tall */}
          <BentoCard span="md:col-span-1 lg:col-span-1 lg:row-span-2" delay={0.1} hover={false}>
            <div className="p-6 h-full flex flex-col">
              {/* Profile Picture */}
              <motion.div
                className="relative mb-5 aspect-square rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={portfolio.profilePic || '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Availability Badge */}
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className={`absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 backdrop-blur-md ${
                    portfolio.availability?.isAvailable
                      ? 'bg-green-500/30 text-green-300 border border-green-500/30'
                      : 'bg-gray-500/30 text-gray-300 border border-gray-500/30'
                  }`}
                >
                  {portfolio.availability?.isAvailable ? <Unlock size={12} /> : <Lock size={12} />}
                  {portfolio.availability?.status || 'Availability Unknown'}
                </motion.div>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1 text-white">{portfolio.tagline}</h2>
                <p className="text-[#ceea45] text-sm font-medium mb-4">{portfolio.category}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-[#ceea45]/30 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl font-black text-[#ceea45]">{portfolio.likes || 0}</p>
                    <p className="text-xs text-gray-500">Likes</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:border-purple-500/30 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl font-black text-purple-400">{portfolio.photos?.length || 0}</p>
                    <p className="text-xs text-gray-500">Photos</p>
                  </motion.div>
                </div>

                {/* Contact Links */}
                <div className="space-y-2">
                  {portfolio.contacts?.email && (
                    <motion.a
                      href={`mailto:${portfolio.contacts.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#ceea45]/10 transition-all duration-300 group"
                      whileHover={{ x: 5 }}
                    >
                      <Mail size={16} className="text-[#ceea45]" />
                      <span className="text-sm truncate text-gray-400 group-hover:text-white transition-colors">{portfolio.contacts.email}</span>
                    </motion.a>
                  )}
                  {portfolio.contacts?.phone && (
                    <motion.a
                      href={`tel:${portfolio.contacts.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#ceea45]/10 transition-all duration-300 group"
                      whileHover={{ x: 5 }}
                    >
                      <Phone size={16} className="text-[#ceea45]" />
                      <span className="text-sm truncate text-gray-400 group-hover:text-white transition-colors">{portfolio.contacts.phone}</span>
                    </motion.a>
                  )}
                  {portfolio.contacts?.website && (
                    <motion.a
                      href={portfolio.contacts.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#ceea45]/10 transition-all duration-300 group"
                      whileHover={{ x: 5 }}
                    >
                      <Globe size={16} className="text-[#ceea45]" />
                      <span className="text-sm truncate text-gray-400 group-hover:text-white transition-colors">Website</span>
                      <ExternalLink size={12} className="ml-auto text-gray-500" />
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Tags */}
              {portfolio.tags?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tags.slice(0, 5).map((tag, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1 rounded-full bg-[#ceea45]/10 text-[#ceea45] text-xs font-medium cursor-default"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </BentoCard>

          {/* Bio Card - Wide */}
          {portfolio.bio && (
            <BentoCard span="md:col-span-1 lg:col-span-2" delay={0.15}>
              <div className="p-6 h-full flex flex-col">
                <SectionHeader icon={User} title="About Me" />
                <p className="text-gray-300 leading-relaxed flex-1">{portfolio.bio}</p>
                <motion.div 
                  className="mt-4 flex items-center gap-2 text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Sparkles size={12} className="text-[#ceea45]" />
                  <span>Crafting digital experiences</span>
                </motion.div>
              </div>
            </BentoCard>
          )}

          {/* Quick Stats Card */}
          <BentoCard span="md:col-span-1 lg:col-span-1" delay={0.2}>
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <motion.div 
                  className="p-3 rounded-2xl bg-gradient-to-br from-[#ceea45]/20 to-[#ceea45]/5 w-fit mb-4"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Zap size={24} className="text-[#ceea45]" />
                </motion.div>
                <motion.h3 
                  className="text-4xl font-black text-white mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {portfolio.experience?.length || 0}+
                </motion.h3>
                <p className="text-gray-500 text-sm">Years Experience</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Projects</span>
                  <span className="font-bold text-white">{portfolio.projects?.length || 0}</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Main Skills Card */}
          {portfolio.mainSkills?.length > 0 && (
            <BentoCard span="md:col-span-2 lg:col-span-2" delay={0.25}>
              <div className="p-6">
                <SectionHeader icon={Code} title="Main Skills" count={portfolio.mainSkills.length} color="#3b82f6" />
                <div className="flex flex-wrap gap-3">
                  {portfolio.mainSkills.map((skill, i) => (
                    <SkillBadge key={i} skill={skill} index={i} variant="blue" />
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* Specializations Card */}
          {portfolio.specializations?.length > 0 && (
            <BentoCard span="md:col-span-1 lg:col-span-2" delay={0.3}>
              <div className="p-6">
                <SectionHeader icon={Target} title="Specializations" count={portfolio.specializations.length} color="#a855f7" />
                <div className="flex flex-wrap gap-3">
                  {portfolio.specializations.map((spec, i) => (
                    <SkillBadge key={i} skill={spec} index={i} variant="purple" />
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* Experience Card - Tall */}
          {portfolio.experience?.length > 0 && (
            <BentoCard span="md:col-span-1 lg:col-span-2 lg:row-span-2" delay={0.35}>
              <div className="p-6 h-full overflow-hidden">
                <SectionHeader icon={Briefcase} title="Experience" count={portfolio.experience.length} />
                <div className="space-y-0 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {portfolio.experience.map((exp, i) => (
                    <TimelineItem key={i} item={exp} type="experience" index={i} />
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* Education Card */}
          {portfolio.education?.length > 0 && (
            <BentoCard span="md:col-span-1 lg:col-span-2" delay={0.4}>
              <div className="p-6">
                <SectionHeader icon={GraduationCap} title="Education" count={portfolio.education.length} />
                <div className="space-y-0">
                  {portfolio.education.map((edu, i) => (
                    <TimelineItem key={i} item={edu} type="education" index={i} />
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* Photos Gallery Card */}
          {portfolio.photos?.length > 0 && (
            <BentoCard span="md:col-span-2 lg:col-span-4" delay={0.45}>
              <div className="p-6">
                <SectionHeader icon={Star} title="Photo Gallery" count={portfolio.photos.length} />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {portfolio.photos.map((photo, i) => (
                    <PhotoCard key={i} photo={photo} index={i} />
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* Videos Card */}
          {portfolio.videos?.length > 0 && (
            <BentoCard span="md:col-span-2 lg:col-span-4" delay={0.5}>
              <div className="p-6">
                <SectionHeader icon={Star} title="Video Showcase" count={portfolio.videos.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.videos.map((video, i) => (
                    <VideoCard key={i} video={video} index={i} />
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* Projects Card */}
          {portfolio.projects?.length > 0 && (
            <BentoCard span="md:col-span-2 lg:col-span-2" delay={0.55}>
              <div className="p-6">
                <SectionHeader icon={FolderOpen} title="Projects" count={portfolio.projects.length} />
                <div className="space-y-3">
                  {portfolio.projects.map((project, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      whileHover={{ x: 5 }}
                      className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#ceea45]/30 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-white group-hover:text-[#ceea45] transition-colors duration-300">
                            {project.title}
                          </h4>
                          {project.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                          )}
                        </div>
                        {project.link && (
                          <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[#ceea45]/10 rounded-lg text-[#ceea45] hover:bg-[#ceea45]/20 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={16} />
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* Certifications Card */}
          {portfolio.certifications?.length > 0 && (
            <BentoCard span="md:col-span-1 lg:col-span-2" delay={0.6}>
              <div className="p-6">
                <SectionHeader icon={Award} title="Certifications" count={portfolio.certifications.length} />
                <div className="space-y-3">
                  {portfolio.certifications.map((cert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                    >
                      <motion.div 
                        className="p-2 bg-yellow-500/20 rounded-lg"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                      >
                        <Award size={18} className="text-yellow-500" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer} • {cert.date}</p>
                      </div>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-[#ceea45] transition-colors duration-300"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* Languages Card */}
          {portfolio.languages?.length > 0 && (
            <BentoCard span="md:col-span-1 lg:col-span-1" delay={0.65}>
              <div className="p-6">
                <SectionHeader icon={Languages} title="Languages" />
                <div className="flex flex-wrap gap-2">
                  {portfolio.languages.map((lang, i) => (
                    <SkillBadge key={i} skill={lang} index={i} variant="indigo" />
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* Services Card */}
          {portfolio.services?.length > 0 && (
            <BentoCard span="md:col-span-1 lg:col-span-1" delay={0.7}>
              <div className="p-6">
                <SectionHeader icon={Wrench} title="Services" />
                <div className="flex flex-wrap gap-2">
                  {portfolio.services.map((service, i) => (
                    <SkillBadge key={i} skill={service} index={i} variant="pink" />
                  ))}
                </div>
              </div>
            </BentoCard>
          )}
        </div>

        {/* Footer Actions */}
        <motion.footer
          className="mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.button
              onClick={() => router.push('/Pages/Features/portfolio')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ceea45] to-[#a8c930] text-black font-bold hover:shadow-2xl hover:shadow-[#ceea45]/30 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Edit3 size={18} />
              Edit Full Portfolio
            </motion.button>

            <motion.button
              onClick={() => setShowShareModal(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 font-bold transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Share2 size={18} />
              Share Portfolio
            </motion.button>

            <motion.button
              onClick={() => router.push('/Pages/Main/home')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ceea45]/30 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft size={18} />
              Back to Home
            </motion.button>
          </div>

          <motion.p 
            className="text-center text-gray-600 text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Made with <motion.span 
              className="text-red-500 inline-block"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >♥</motion.span> • Last updated recently
          </motion.p>
        </motion.footer>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(206, 234, 69, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(206, 234, 69, 0.5);
        }
      `}</style>
    </div>
  );
}