'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Video, Users, Briefcase, Eye, Play, ArrowRight } from 'lucide-react';
import { team1, team2 } from '@/app/Assets/images/Images';
import Image from 'next/image';

const Service = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const observerRef = useRef(null);
  const videoRefs = useRef([]);

  useEffect(() => {
    // Detect mobile for performance optimizations
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Optimized IntersectionObserver with better options
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.dataset.animate]));
            
            // Play videos when they come into view
            const video = entry.target.querySelector('video');
            if (video) {
              video.play().catch(err => console.log('Video autoplay failed:', err));
            }
          } else {
            // Pause videos when out of view to save resources
            const video = entry.target.querySelector('video');
            if (video) {
              video.pause();
            }
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading earlier for smoother experience
      }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Clean up video refs
      videoRefs.current = [];
    };
  }, []);

  const isVisible = (id) => visibleElements.has(id);

  // Add video ref
  const addVideoRef = (el) => {
    if (el && !videoRefs.current.includes(el)) {
      videoRefs.current.push(el);
    }
  };

  return (
    <div id='webflow' className="overflow-x-hidden min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 md:py-20 px-4 md:px-6 relative">
      <style>{`
        /* GPU-accelerated animations */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translate3d(-100px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translate3d(100px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes scaleInBounce {
          0% { opacity: 0; transform: scale3d(0.8, 0.8, 1) rotate(-5deg); }
          60% { transform: scale3d(1.05, 1.05, 1) rotate(2deg); }
          100% { opacity: 1; transform: scale3d(1, 1, 1) rotate(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translate3d(0, 30px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        @keyframes blob {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(30px, -50px, 0) scale(1.1); }
          66% { transform: translate3d(-20px, 20px, 0) scale(0.9); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .grid-pattern {
          background-image: 
            linear-gradient(rgba(206, 234, 69, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(206, 234, 69, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .grid-pattern {
            background-size: 30px 30px;
            opacity: 0.5;
          }
        }

        .animate-slide-left { 
          animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .animate-slide-right { 
          animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .animate-scale-bounce { 
          animation: scaleInBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          will-change: transform, opacity;
        }
        .animate-fade-up { 
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        /* Remove will-change after animation */
        .animate-slide-left,
        .animate-slide-right,
        .animate-scale-bounce,
        .animate-fade-up {
          animation-fill-mode: forwards;
        }

        @media (min-width: 1024px) {
          .animate-blob { 
            animation: blob 7s infinite;
            will-change: transform;
          }
        }

        /* Simplified mobile animations */
        @media (max-width: 767px) {
          .animate-blob {
            animation: blob 10s infinite;
          }
        }

        .service-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(206, 234, 69, 0.1), transparent);
          transition: left 0.5s ease;
          pointer-events: none;
        }

        @media (min-width: 1024px) {
          .service-card::before {
            animation: shimmer 3s infinite;
          }

          .service-card:hover {
            transform: translateY(-8px);
            border-color: rgba(206, 234, 69, 0.3);
            will-change: transform;
          }

          .service-card:not(:hover) {
            will-change: auto;
          }

          .service-card-lime:hover { box-shadow: 0 25px 60px rgba(206, 234, 69, 0.3); }
          .service-card-purple:hover { box-shadow: 0 25px 60px rgba(139, 92, 246, 0.3); }
          .service-card-pink:hover { box-shadow: 0 25px 60px rgba(236, 72, 153, 0.3); }
          .service-card-blue:hover { box-shadow: 0 25px 60px rgba(59, 130, 246, 0.3); }

          .service-card:hover .corner-accent { 
            width: 30px; 
            height: 30px; 
          }

          .service-card:hover .image-container {
            transform: scale(1.05);
          }

          .service-card:hover .icon-wrapper {
            transform: scale(1.1) rotate(-5deg);
          }

          .service-card:hover .text-underline-animate::after { 
            width: 100%; 
          }

          .service-card:hover .learn-more-btn::before { 
            left: 100%; 
          }
        }

        /* Simplified mobile interactions */
        @media (max-width: 1023px) {
          .service-card:active {
            transform: scale(0.98);
            border-color: rgba(206, 234, 69, 0.3);
          }
        }

        .corner-accent {
          position: absolute;
          width: 15px;
          height: 15px;
          border: 2px solid currentColor;
          transition: width 0.3s ease, height 0.3s ease;
          z-index: 10;
          pointer-events: none;
        }

        @media (min-width: 768px) {
          .corner-accent {
            width: 20px;
            height: 20px;
          }
        }

        .corner-tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }
        .corner-br { bottom: 8px; right: 8px; border-left: none; border-top: none; }

        @media (min-width: 768px) {
          .corner-tl { top: 10px; left: 10px; }
          .corner-br { bottom: 10px; right: 10px; }
        }

        .learn-more-btn {
          position: relative;
          overflow: hidden;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .learn-more-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
          pointer-events: none;
        }

        @media (min-width: 1024px) {
          .image-container {
            transition: transform 0.4s ease;
          }

          .icon-wrapper {
            transition: transform 0.3s ease;
          }
        }

        .icon-wrapper {
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .icon-wrapper {
            width: 56px;
            height: 56px;
          }
        }

        .text-underline-animate {
          position: relative;
          display: inline-block;
        }

        .text-underline-animate::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: currentColor;
          transition: width 0.4s ease;
        }

        .pulse-dot { 
          animation: pulse 2s ease-in-out infinite;
          will-change: opacity;
        }

        @media (max-width: 768px) {
          .pulse-dot {
            display: none;
          }
        }

        .team-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          transition: transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        @media (min-width: 768px) {
          .team-card {
            border-radius: 32px;
          }
        }

        @media (min-width: 1024px) {
          .team-card:hover {
            transform: translateY(-8px);
            border-color: rgba(206, 234, 69, 0.3);
            box-shadow: 0 25px 60px rgba(206, 234, 69, 0.2);
          }
        }

        .profile-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        @media (min-width: 768px) {
          .profile-circle {
            width: 56px;
            height: 56px;
          }
        }

        @media (min-width: 1024px) {
          .profile-circle:hover {
            transform: scale(1.1);
          }
        }

        .btn-primary {
          background: linear-gradient(135deg, #ceea45 0%, #b8d93c 100%);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 12px rgba(206, 234, 69, 0.3);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
          pointer-events: none;
        }

        @media (min-width: 1024px) {
          .btn-primary:hover::before { left: 100%; }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(206, 234, 69, 0.4);
          }
        }

        @media (max-width: 1023px) {
          .btn-primary:active {
            transform: scale(0.95);
          }
        }

        /* Video optimization */
        video {
          will-change: auto;
        }

        video::-webkit-media-controls {
          display: none !important;
        }

        video::-webkit-media-controls-enclosure {
          display: none !important;
        }

        .animation-delay-2s { animation-delay: 2s; }
        .animation-delay-4s { animation-delay: 4s; }
        .animation-delay-6s { animation-delay: 6s; }
        .animation-delay-8s { animation-delay: 8s; }

        /* Reduce motion preference */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern"></div>

      {/* Animated Background Blobs - Hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2s"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4s"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-6s"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-[#ceea45]/15 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-8s"></div>
      </div>

      {/* Simplified mobile background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
        <div className="absolute top-10 left-5 w-48 h-48 bg-[#ceea45]/15 rounded-full mix-blend-screen filter blur-2xl opacity-30"></div>
        <div className="absolute bottom-10 right-5 w-48 h-48 bg-purple-500/15 rounded-full mix-blend-screen filter blur-2xl opacity-30"></div>
      </div>

      {/* Floating Accent Dots - Desktop only */}
      <div className="hidden lg:block absolute top-20 left-1/4 w-2 h-2 bg-[#ceea45] rounded-full pulse-dot"></div>
      <div className="hidden lg:block absolute bottom-40 right-1/4 w-2 h-2 bg-[#ceea45] rounded-full pulse-dot" style={{ animationDelay: '0.5s' }}></div>
      <div className="hidden lg:block absolute top-1/2 left-10 w-3 h-3 bg-[#ceea45] rounded-full pulse-dot" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          
          {/* Title Section */}
          <div 
            data-animate="title"
            className={`lg:col-span-2 flex flex-col justify-center ${isVisible('title') ? 'animate-slide-left' : 'opacity-0'}`}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-white">
              Our Comprehensive
              <br />
              <span className="bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#a3c933] bg-clip-text text-transparent">
                & Diverse Services
              </span>
            </h2>
            <div className="mt-4 md:mt-6 w-20 md:w-24 h-1 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] rounded-full"></div>
          </div>

          {/* Description */}
          <div 
            data-animate="description"
            className={`flex items-center ${isVisible('description') ? 'animate-slide-right' : 'opacity-0'}`}
          >
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              At <span className="font-bold bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent">EDITCRAFT</span>, we deliver
              <span className="font-bold text-[#ceea45]"> production-grade quality</span> with exceptional 
              time management. Our top-tier editors help you elevate your brand.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Image Card 1 */}
          <div 
            data-animate="card1"
            className={`service-card service-card-lime rounded-3xl md:rounded-[40px] overflow-hidden h-[280px] md:h-[380px] ${
              isVisible('card1') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <div className="corner-accent corner-tl text-[#ceea45]"></div>
            <div className="corner-accent corner-br text-[#ceea45]"></div>

            <div className="image-container w-full h-full relative">
              <Image 
                src={team2} 
                alt="Team 2" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={85}
                priority={false}
                loading="lazy"
              />
            </div>
          </div>

          {/* Content Creation Card */}
          <div 
            data-animate="card2"
            className={`service-card service-card-lime rounded-3xl md:rounded-[40px] p-6 md:p-8 h-[280px] md:h-[380px] flex flex-col ${
              isVisible('card2') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="corner-accent corner-tl text-[#ceea45]/50"></div>
            <div className="corner-accent corner-br text-[#ceea45]/50"></div>

            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 relative z-10">
              <div className="icon-wrapper bg-[#ceea45]">
                <Eye className="w-5 h-5 md:w-6 md:h-6 text-black" />
              </div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                How It Works
              </h3>
            </div>
            
            <h4 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 text-underline-animate relative z-10">
              Content Creation
            </h4>
            
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 flex-grow relative z-10">
              We bring your creative vision to life with cutting-edge 3D animation, visual effects, and motion graphics that captivate your audience.
            </p>

            <div className="image-container w-full h-20 md:h-24 rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4 relative">
              <Image 
                src={team1} 
                alt="Team 1" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={85}
                loading="lazy"
              />
            </div>
            
            <button className="learn-more-btn bg-white/10 border-2 border-white/20 h-9 md:h-10 rounded-full flex items-center justify-between px-3 md:px-4 hover:bg-[#ceea45] hover:border-[#ceea45] hover:text-black transition-all duration-300 relative z-10 text-white">
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform" />
              <span className="text-xs font-bold uppercase">Learn More</span>
            </button>
          </div>

          {/* Team Section */}
          <div 
            data-animate="team"
            className={`flex flex-col gap-3 md:gap-4 ${isVisible('team') ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.3s' }}
          >
            <div className="team-card h-[120px] md:h-[160px] flex items-center justify-center">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent">
                Meet Our Team
              </h3>
            </div>

            <div className="team-card h-[150px] md:h-[200px] flex flex-col items-center justify-center gap-4 md:gap-6 p-5 md:p-6">
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <div className="profile-circle bg-gradient-to-br from-[#ceea45] to-[#b8d93c]">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
                <div className="profile-circle bg-gradient-to-br from-purple-500 to-pink-500">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="profile-circle bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>

              <button className="btn-primary px-6 md:px-8 py-2.5 md:py-3 rounded-full text-black font-semibold text-xs md:text-sm">
                View Profiles
              </button>
            </div>
          </div>

          {/* Video Editing Card */}
          <div 
            data-animate="card3"
            className={`service-card service-card-purple rounded-3xl md:rounded-[40px] p-6 md:p-8 h-[280px] md:h-[380px] flex flex-col text-white ${
              isVisible('card3') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.4s' }}
          >
            <div className="corner-accent corner-tl text-purple-500/50"></div>
            <div className="corner-accent corner-br text-purple-500/50"></div>

            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-lg border-2 border-purple-500/30">
                <video 
                  ref={addVideoRef}
                  className="w-full h-full object-cover" 
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                >
                  <source src="/video1.mp4" type="video/mp4" />
                </video>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                How It Works
              </h3>
            </div>
            
            <h4 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-underline-animate relative z-10">
              Video Editing
            </h4>
            
            <p className="text-xs md:text-sm leading-relaxed mb-4 md:mb-6 flex-grow text-gray-300 relative z-10">
              Expert editors guide you through the process, refine your content, and deliver production-ready results that boost quality.
            </p>

            <div className="flex justify-center mb-3 md:mb-4 relative z-10">
              <video 
                ref={addVideoRef}
                className="w-full h-24 md:h-32 rounded-lg object-cover border-2 border-purple-500/30" 
                controls
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload"
              >
                <source src="/video1.mp4" type="video/mp4" />
              </video>
            </div>
            
            <button className="learn-more-btn bg-white/10 border-2 border-white/20 h-9 md:h-10 rounded-full flex items-center justify-between px-3 md:px-4 hover:bg-purple-500 hover:border-purple-500 transition-all duration-300 relative z-10">
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform" />
              <span className="text-xs font-bold uppercase">Learn More</span>
            </button>
          </div>

          {/* Image Card 2 */}
          <div 
            data-animate="card4"
            className={`service-card service-card-pink rounded-3xl md:rounded-[40px] overflow-hidden h-[280px] md:h-[380px] ${
              isVisible('card4') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.5s' }}
          >
            <div className="corner-accent corner-tl text-pink-500"></div>
            <div className="corner-accent corner-br text-pink-500"></div>

            <div className="image-container w-full h-full overflow-hidden ">
              <video 
                ref={addVideoRef}
                className="w-full h-full object-cover " 
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
              >
                <source src="/video2.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Thumbnail Design Card */}
          <div 
            data-animate="card5"
            className={`service-card service-card-pink rounded-3xl md:rounded-[40px] p-6 md:p-8 h-[280px] md:h-[380px] flex flex-col text-white ${
              isVisible('card5') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.6s' }}
          >
            <div className="corner-accent corner-tl text-pink-500/50"></div>
            <div className="corner-accent corner-br text-pink-500/50"></div>

            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 relative z-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-lg border-2 border-pink-500/30">
                <Image 
                  src={team2} 
                  alt="Team 2" 
                  width={56}
                  height={56}
                  className="object-cover"
                  quality={85}
                  loading="lazy"
                />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                How It Works
              </h3>
            </div>
            
            <h4 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-underline-animate relative z-10">
              Thumbnail Design
            </h4>
            
            <p className="text-xs md:text-sm leading-relaxed mb-4 md:mb-6 flex-grow text-gray-300 relative z-10">
              Eye-catching thumbnails that stop the scroll and drive clicks. Stand out with professional designs optimized for engagement.
            </p>

            <div className="image-container flex justify-center mb-3 md:mb-4 relative h-20 md:h-24 rounded-xl md:rounded-2xl overflow-hidden">
              <Image 
                src={team1} 
                alt="Team 1" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={85}
                loading="lazy"
              />
            </div>
            
            <button className="learn-more-btn bg-white/10 border-2 border-white/20 h-9 md:h-10 rounded-full flex items-center justify-between px-3 md:px-4 hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 relative z-10">
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform" />
              <span className="text-xs font-bold uppercase">Learn More</span>
            </button>
          </div>

          {/* Script Writing Card */}
          <div 
            data-animate="card6"
            className={`service-card service-card-blue rounded-3xl md:rounded-[40px] p-6 md:p-8 h-[280px] md:h-[380px] flex flex-col ${
              isVisible('card6') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.7s' }}
          >
            <div className="corner-accent corner-tl text-blue-500/50"></div>
            <div className="corner-accent corner-br text-blue-500/50"></div>

            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 relative z-10">
              <div className="icon-wrapper bg-blue-500/20 border-2 border-blue-500/30">
                <video 
                  ref={addVideoRef}
                  className="w-full h-full rounded-full object-cover" 
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                >
                  <source src="/video2.mp4" type="video/mp4" />
                </video>
              </div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                How It Works
              </h3>
            </div>
            
            <h4 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 text-underline-animate relative z-10">
              Script Writing
            </h4>
            
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 flex-grow relative z-10">
              Compelling scripts that tell your story. From concept to final draft, we craft narratives that resonate with your audience.
            </p>

            <div className="flex justify-center mb-3 md:mb-4 relative z-10">
              <video 
                ref={addVideoRef}
                className="w-full h-24 md:h-32 rounded-lg object-cover border-2 border-blue-500/30" 
                controls
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload"
              >
                <source src="/video1.mp4" type="video/mp4" />
              </video>
            </div>   
            <button className="learn-more-btn bg-white/10 border-2 border-white/20 h-9 md:h-10 rounded-full flex items-center justify-between px-3 md:px-4 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all duration-300 relative z-10 text-white">
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform" />
              <span className="text-xs font-bold uppercase">Learn More</span>
            </button>
          </div>

          {/* Clients Section */}
          <div 
            data-animate="clients"
            className={`flex flex-col gap-3 md:gap-4 ${isVisible('clients') ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.8s' }}
          >
            <div className="team-card h-[120px] md:h-[160px] flex items-center justify-center">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent">
                Our Clients
              </h3>
            </div>

            <div className="team-card h-[150px] md:h-[200px] flex flex-col items-center justify-center gap-4 md:gap-6 p-5 md:p-6">
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <div className="profile-circle bg-gradient-to-br from-green-500 to-teal-500">
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="profile-circle bg-gradient-to-br from-orange-500 to-red-500">
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="profile-circle bg-gradient-to-br from-indigo-500 to-blue-500">
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>

              <button className="btn-primary px-6 md:px-8 py-2.5 md:py-3 rounded-full text-black font-semibold text-xs md:text-sm">
                All Clients
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;