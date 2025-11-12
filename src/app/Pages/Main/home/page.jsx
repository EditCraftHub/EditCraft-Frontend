'use client'
import React, { useState } from 'react';
import ProtectedRoute from '@/app/Components/ProtectedRoute/ProtectedRoute';
import Allpost from '@/app/Components/AllPost/Allpost';
import ActivityCard from '@/app/Components/homenotifications/ActivityCard';

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      
      <div className="w-full overflow-hidden bg-transparent">
        
        {/* Main Container with proper padding */}
        <div className="h-full max-w-[1900px] mx-auto px-0 sm:px-4 lg:px-6 py-4 sm:py-6">
          
          {/* Responsive Grid Layout */}
          <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-4 lg:gap-6">

            {/* Left Column - Posts (Scrollable) */}
            <div className="w-full  h-screen overflow-hidden">
              <div className="bg-transparent rounded-2xl h-full overflow-y-auto">
                <Allpost />
              </div>
            </div>
            
            {/* Right Column - Sticky Sidebar (Hidden on mobile) */}
            <div className="hidden lg:block">
              {/* FIXED: Added sticky wrapper */}
              <div className="sticky top-4 h-[calc(100vh-2rem)]">
                {/* FIXED: Made inner content scrollable */}
                <div className="h-full overflow-y-auto space-y-4 pr-2">
                  
                  {/* Sidebar Box 1 */}
                  <div className="bg-black border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                    <ActivityCard />
                  </div>

                  {/* Sidebar Box 2 - Trending Categories */}
                  <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-[#ceea45]/20 rounded-2xl p-5 overflow-hidden group hover:border-[#ceea45]/40 transition-all duration-500">
                    {/* Animated background effects */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ceea45]/10 rounded-full blur-3xl animate-pulse-slow"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse-slow animation-delay-1000"></div>
                    </div>

                    {/* Cyberpunk grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                    {/* Header with icon */}
                    <div className="relative mb-5 flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#ceea45] rounded-lg blur-md opacity-50"></div>
                        <div className="relative bg-gradient-to-br from-[#ceea45] to-[#b8d93c] p-2 rounded-lg">
                          <svg 
                            className="w-5 h-5 text-black" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2.5} 
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                            />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white uppercase tracking-wide">
                          Trending <span className="text-[#ceea45]">Categories</span>
                        </h3>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Most Popular Right Now</p>
                      </div>
                    </div>

                    {/* Categories Grid - Compact Version */}
                    <div className="relative grid grid-cols-2 gap-2">
                      {[
                        { 
                          label: '3D Motion', 
                          color: 'from-blue-500/20 to-blue-600/10',
                          borderColor: 'border-blue-500/30',
                          glowColor: 'group-hover/item:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
                          icon: '🎬',
                          posts: 45
                        },
                        { 
                          label: 'Thumbnails', 
                          color: 'from-purple-500/20 to-purple-600/10',
                          borderColor: 'border-purple-500/30',
                          glowColor: 'group-hover/item:shadow-[0_0_15px_rgba(168,85,247,0.3)]',
                          icon: '🖼️',
                          posts: 38
                        },
                        { 
                          label: 'Pr Pro', 
                          color: 'from-orange-500/20 to-orange-600/10',
                          borderColor: 'border-orange-500/30',
                          glowColor: 'group-hover/item:shadow-[0_0_15px_rgba(249,115,22,0.3)]',
                          icon: '✂️',
                          posts: 29
                        },
                        { 
                          label: 'After FX', 
                          color: 'from-pink-500/20 to-pink-600/10',
                          borderColor: 'border-pink-500/30',
                          glowColor: 'group-hover/item:shadow-[0_0_15px_rgba(236,72,153,0.3)]',
                          icon: '⚡',
                          posts: 41
                        },
                      ].map((item, index) => (
                        <button
                          key={index}
                          className={`group/item relative p-2 bg-gradient-to-br ${item.color} backdrop-blur-sm hover:scale-105 rounded-lg border-2 ${item.borderColor} hover:border-opacity-80 transition-all duration-300 text-center overflow-hidden ${item.glowColor}`}
                        >
                          {/* Shine effect on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover/item:translate-x-[200%] transition-transform duration-1000"></div>
                          </div>

                          {/* Content */}
                          <div className="relative z-10">
                            {/* Icon */}
                            <div className="text-lg mb-1 transform group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300">
                              {item.icon}
                            </div>
                            
                            {/* Label */}
                            <p className="text-[10px] text-white font-bold leading-tight mb-1">
                              {item.label}
                            </p>
                            
                            {/* Stats */}
                            <div className="flex items-center justify-center gap-1">
                              <div className="w-1 h-1 bg-[#ceea45] rounded-full animate-pulse"></div>
                              <span className="text-[9px] text-gray-400 font-semibold">
                                {item.posts}+
                              </span>
                            </div>

                            {/* Trending indicator */}
                            <div className="absolute top-0.5 right-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                              <div className="bg-[#ceea45] text-black text-[7px] font-black px-1 py-0.5 rounded-full uppercase tracking-wider">
                                Hot
                              </div>
                            </div>
                          </div>

                          {/* Corner accent */}
                          <div className="absolute bottom-0 right-0 w-6 h-6 opacity-20 group-hover/item:opacity-40 transition-opacity">
                            <div className={`absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl ${item.color} rounded-tl-full`}></div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Bottom stats bar - Compact */}
                    <div className="relative mt-3 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between text-[9px] text-gray-400 font-semibold">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-[#ceea45] rounded-full animate-pulse"></div>
                          <span>Live</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[#ceea45]">238+</span>
                          <span>Posts</span>
                        </div>
                      </div>
                    </div>

                    <style jsx>{`
                      @keyframes pulse-slow {
                        0%, 100% {
                          opacity: 0.3;
                        }
                        50% {
                          opacity: 0.6;
                        }
                      }
                      .animate-pulse-slow {
                        animation: pulse-slow 4s ease-in-out infinite;
                      }
                      .animation-delay-1000 {
                        animation-delay: 1s;
                      }
                    `}</style>
                  </div>
                  
                </div>
              </div>
            </div>

          </div>

        </div>
        
      </div>
    </ProtectedRoute>
  );
};

export default Page;