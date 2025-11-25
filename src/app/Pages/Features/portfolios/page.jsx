'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search, Filter, Loader2, AlertCircle, Star, Heart, MessageSquare,
  ChevronLeft, ChevronRight, Sparkles, Code, Briefcase, MapPin,
  ExternalLink, ArrowRight, TrendingUp
} from 'lucide-react';
import { useGetAllPortfoliosQuery } from '@/app/Store/apiSclice/portfolioApiSlice';
import { toast } from 'react-hot-toast';

// Animated Background
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(206,234,69,0.12),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.08),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.08),transparent_50%)]" />
    
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

    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
  </div>
);

// Portfolio Card Component
const PortfolioCard = ({ portfolio, index, onClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isLiked, setIsLiked] = useState(false);

  if (!portfolio.isPublic) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      onClick={onClick}
      className="group cursor-pointer h-full"
    >
      <div className="relative h-full bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/[0.08] overflow-hidden hover:border-[#ceea45]/50 transition-all duration-300">
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#ceea45]/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Background */}
        <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-gray-900/95 to-black/95" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-6 sm:p-8">
          
          {/* Profile Section */}
          <div className="mb-6">
            {/* Profile Picture */}
            <motion.div
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-4 ring-2 ring-[#ceea45]/30 group-hover:ring-[#ceea45]/70 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={portfolio.profilePic || '/default-avatar.png'}
                alt={portfolio.tagline}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>

            {/* Tagline & Category */}
            <div className="mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-[#ceea45] transition-colors duration-300 line-clamp-2">
                {portfolio.tagline}
              </h3>
              <motion.p
                className="text-xs sm:text-sm text-[#ceea45] font-medium flex items-center gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Code size={12} />
                {portfolio.category}
              </motion.p>
            </div>
          </div>

          {/* Bio */}
          {portfolio.bio && (
            <p className="text-xs sm:text-sm text-gray-300 mb-4 line-clamp-3 flex-grow">
              {portfolio.bio}
            </p>
          )}

          {/* Tags */}
          {portfolio.tags?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {portfolio.tags.slice(0, 3).map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.3 + i * 0.1 }}
                  className="px-2 py-1 rounded-full bg-[#ceea45]/10 text-[#ceea45] text-xs font-medium"
                >
                  #{tag}
                </motion.span>
              ))}
              {portfolio.tags?.length > 3 && (
                <span className="px-2 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-medium">
                  +{portfolio.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Stats Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
            <div className="flex gap-4 text-xs sm:text-sm text-gray-400">
              <motion.div
                className="flex items-center gap-1 group/stat hover:text-[#ceea45] transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Heart size={14} className="group-hover/stat:fill-[#ceea45]" />
                <span>{portfolio.likes || 0}</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Briefcase size={14} />
                <span>{portfolio.projects?.length || 0}</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Star size={14} />
                <span>{portfolio.photos?.length || 0}</span>
              </motion.div>
            </div>

            {/* View Button */}
            <motion.div
              className="p-2 rounded-lg bg-[#ceea45]/20 group-hover:bg-[#ceea45]/40 transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: -15 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={14} className="text-[#ceea45]" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Filter Bar Component
const FilterBar = ({ filters, setFilters, categories }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-4 sm:p-6 mb-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search portfolios..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#ceea45] focus:outline-none transition-all"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#ceea45] focus:outline-none transition-all cursor-pointer"
        >
          <option value="" className="bg-gray-900">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#ceea45] focus:outline-none transition-all cursor-pointer"
        >
          <option value="createdAt" className="bg-gray-900">Newest</option>
          <option value="-likes" className="bg-gray-900">Most Liked</option>
          <option value="-updatedAt" className="bg-gray-900">Recently Updated</option>
        </select>

        {/* Limit */}
        <select
          value={filters.limit}
          onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#ceea45] focus:outline-none transition-all cursor-pointer"
        >
          <option value="12" className="bg-gray-900">12 per page</option>
          <option value="24" className="bg-gray-900">24 per page</option>
          <option value="36" className="bg-gray-900">36 per page</option>
        </select>
      </div>
    </motion.div>
  );
};

// Loading Skeleton
const SkeletonCard = () => (
  <div className="bg-white/[0.03] rounded-3xl border border-white/[0.08] p-6 h-full animate-pulse">
    <div className="w-24 h-24 bg-white/10 rounded-2xl mb-4" />
    <div className="h-6 bg-white/10 rounded mb-2 w-3/4" />
    <div className="h-4 bg-white/10 rounded mb-4 w-1/2" />
    <div className="h-12 bg-white/10 rounded mb-4" />
    <div className="flex gap-2">
      <div className="h-8 bg-white/10 rounded-full flex-1" />
      <div className="h-8 bg-white/10 rounded-full flex-1" />
    </div>
  </div>
);

// Main Component
export default function PortfolioShowcase() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    sort: 'createdAt'
  });

  // Fetch portfolios
  const { data: portfoliosData, isLoading, error, isFetching } = useGetAllPortfoliosQuery({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    category: filters.category || undefined,
    sort: filters.sort
  });

  const portfolios = portfoliosData?.portfolios || [];
  const totalPages = portfoliosData?.totalPages || 1;
  const categories = [
    "Graphic Designer", "UI/UX Designer", "Illustrator", "Brand Designer",
    "Motion Designer", "3D Artist", "Photographer", "Video Editor",
    "Product Designer", "Art Director", "Content Writer", "Copywriter",
    "Social Media Manager", "Digital Marketer", "SEO Specialist"
  ];

  const handleCardClick = (portfolio) => {
    const identifier = portfolio.slug || portfolio._id;
    router.push(`/portfolio/${identifier}`);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} className="text-[#ceea45]" />
            <span className="text-sm font-bold tracking-wider uppercase">Portfolio Gallery</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-white via-[#ceea45] to-white bg-clip-text text-transparent">
              Discover Amazing Portfolios
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Browse through talented creators and find the perfect person for your next project
          </p>
        </motion.div>

        {/* Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} categories={categories} />

        {/* Results Info */}
        {!isLoading && (
          <motion.div
            className="mb-6 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-gray-400">
              Showing <span className="text-[#ceea45] font-bold">{portfolios.length}</span> portfolios
              {filters.search && <span> for "{filters.search}"</span>}
            </p>
            {portfolios.length === 0 && (
              <button
                onClick={() => setFilters({ page: 1, limit: 12, search: '', category: '', sort: 'createdAt' })}
                className="text-xs px-3 py-1 bg-[#ceea45]/20 text-[#ceea45] rounded hover:bg-[#ceea45]/30 transition-all"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {[...Array(filters.limit)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={56} className="text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Error Loading Portfolios</h3>
            <p className="text-gray-400 mb-6">Failed to load portfolios. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#ceea45] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#ceea45]/30 transition-all"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && portfolios.length === 0 && !error && (
          <motion.div
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Briefcase size={56} className="text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Portfolios Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
            <button
              onClick={() => setFilters({ page: 1, limit: 12, search: '', category: '', sort: 'createdAt' })}
              className="px-6 py-2 bg-[#ceea45] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#ceea45]/30 transition-all"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Portfolio Grid */}
        {portfolios.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {portfolios.map((portfolio, index) => (
              <PortfolioCard
                key={portfolio._id}
                portfolio={portfolio}
                index={index}
                onClick={() => handleCardClick(portfolio)}
              />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {portfolios.length > 0 && totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Previous Button */}
            <motion.button
              onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
              disabled={filters.page === 1}
              className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} className="text-[#ceea45]" />
            </motion.button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = filters.page > 3 ? filters.page - 2 + i : i + 1;
                if (pageNum > totalPages) return null;

                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => setFilters({ ...filters, page: pageNum })}
                    className={`px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                      filters.page === pageNum
                        ? 'bg-[#ceea45] text-black'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>

            {/* Next Button */}
            <motion.button
              onClick={() => setFilters({ ...filters, page: Math.min(totalPages, filters.page + 1) })}
              disabled={filters.page === totalPages}
              className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={20} className="text-[#ceea45]" />
            </motion.button>

            {/* Page Info */}
            <span className="text-sm text-gray-400 ml-4">
              Page <span className="text-[#ceea45] font-bold">{filters.page}</span> of{' '}
              <span className="text-[#ceea45] font-bold">{totalPages}</span>
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}