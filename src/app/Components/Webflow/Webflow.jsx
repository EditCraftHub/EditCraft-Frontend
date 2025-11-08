import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { brain, content, thumbnail, video } from '@/app/Assets/images/Images';
import { FaRegArrowAltCircleRight } from "react-icons/fa";

const Webflow = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.dataset.animate]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const isVisible = (id) => visibleElements.has(id);

  return (
    <div id="service" className="overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-black rounded-[40px] min-h-screen flex items-center justify-center px-6 py-20 relative">
     
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleInBounce {
          0% {
            opacity: 0;
            transform: scale(0.8) rotate(-5deg);
          }
          60% {
            transform: scale(1.05) rotate(2deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes borderGlow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(206, 234, 69, 0.4), 0 0 60px rgba(206, 234, 69, 0.2);
          }
          50% {
            box-shadow: 0 0 50px rgba(206, 234, 69, 0.6), 0 0 80px rgba(206, 234, 69, 0.3);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-slide-left {
          animation: slideInLeft 1s ease-out forwards;
        }

        .animate-slide-right {
          animation: slideInRight 1s ease-out forwards;
        }

        .animate-scale-bounce {
          animation: scaleInBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .service-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(206, 234, 69, 0.1) 50%, transparent 70%);
          animation: shimmer 3s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .service-card:hover::before {
          opacity: 1;
        }

        .service-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(206, 234, 69, 0.5);
          animation: borderGlow 2s ease-in-out infinite;
        }

        .service-card-1:hover {
          box-shadow: 0 25px 60px rgba(206, 234, 69, 0.3);
        }

        .service-card-2:hover {
          box-shadow: 0 25px 60px rgba(139, 92, 246, 0.3);
        }

        .service-card-3:hover {
          box-shadow: 0 25px 60px rgba(236, 72, 153, 0.3);
        }

        .service-card-4:hover {
          box-shadow: 0 25px 60px rgba(59, 130, 246, 0.3);
        }

        .corner-accent {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid currentColor;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .corner-tl {
          top: 10px;
          left: 10px;
          border-right: none;
          border-bottom: none;
        }

        .corner-br {
          bottom: 10px;
          right: 10px;
          border-left: none;
          border-top: none;
        }

        .service-card:hover .corner-accent {
          width: 30px;
          height: 30px;
        }

        .learn-more-btn {
          position: relative;
          overflow: hidden;
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
        }

        .service-card:hover .learn-more-btn::before {
          left: 100%;
        }

        .image-container {
          transition: all 0.4s ease;
        }

        .service-card:hover .image-container {
          transform: scale(1.1) rotate(5deg);
        }

        .service-card-1:hover .image-container {
          filter: drop-shadow(0 0 20px rgba(206, 234, 69, 0.6));
        }

        .service-card-2:hover .image-container {
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
        }

        .service-card-3:hover .image-container {
          filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.6));
        }

        .service-card-4:hover .image-container {
          filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6));
        }

        .text-underline-effect {
          position: relative;
          display: inline-block;
        }

        .text-underline-effect::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 2px;
          background: currentColor;
          transition: width 0.4s ease;
        }

        .service-card:hover .text-underline-effect::after {
          width: 100%;
        }

        .grid-pattern {
          background-image: 
            linear-gradient(rgba(206, 234, 69, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(206, 234, 69, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .pulse-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        .animation-delay-2s { animation-delay: 2s; }
        .animation-delay-4s { animation-delay: 4s; }
        .animation-delay-6s { animation-delay: 6s; }
        .animation-delay-8s { animation-delay: 8s; }
      `}</style>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern pointer-events-none"></div>

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2s"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4s"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-6s"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-[#ceea45]/15 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-8s"></div>
      </div>

      {/* Floating Accent Dots */}
      <div className="absolute top-20 left-1/4 w-2 h-2 bg-[#ceea45] rounded-full pulse-dot"></div>
      <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-[#ceea45] rounded-full pulse-dot" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 left-10 w-3 h-3 bg-[#ceea45] rounded-full pulse-dot" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-[#ceea45] rounded-full pulse-dot" style={{ animationDelay: '1.5s' }}></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 w-full max-w-6xl relative z-10">
        
        {/* ===== Title Box ===== */}
        <div 
          data-animate="title"
          className={`flex flex-col justify-center ${isVisible('title') ? 'animate-slide-left' : 'opacity-0'}`}
        >
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
            Our Comprehensive <br /> 
            <span className="bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#a3c933] bg-clip-text text-transparent">
              & Diverse Services
            </span>
          </h3>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] rounded-full"></div>
        </div>

        {/* ===== Description Box ===== */}
        <div 
          data-animate="description"
          className={`font-medium text-gray-300 text-sm sm:text-base leading-relaxed ${isVisible('description') ? 'animate-slide-right' : 'opacity-0'}`}
        >
          <p>
            At <span className="font-black bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent">EDITCRAFT</span>, we deliver
            <span className="text-[#ceea45] font-bold"> production-grade quality</span> 
            with exceptional time management. Our top-tier editors help you elevate
            your brand and master the digital era with world-class editing precision.
          </p>
        </div>

        {/* ===== Box 1 - Video Editing ===== */}
        <div 
          data-animate="box1"
          className={`service-card service-card-1 rounded-[40px] flex items-center justify-between px-6 py-6 h-[200px] cursor-pointer group ${
            isVisible('box1') ? 'animate-scale-bounce' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.1s' }}
        >
          <div className="corner-accent corner-tl text-[#ceea45]/50 group-hover:text-[#ceea45]"></div>
          <div className="corner-accent corner-br text-[#ceea45]/50 group-hover:text-[#ceea45]"></div>
          
          <div className="flex flex-col justify-between h-full relative z-10">
            <h2 className="font-bold text-xl text-white text-underline-effect">
              Production grade <br/>Video Editing
            </h2>
            <div className="learn-more-btn bg-white/10 backdrop-blur-sm border-2 border-white/20 h-[40px] w-[120px] rounded-full flex items-center justify-between px-3 group-hover:bg-[#ceea45] group-hover:border-[#ceea45] transition-all duration-300">
              <FaRegArrowAltCircleRight className="text-white group-hover:text-black rotate-[-45deg] transition-all duration-300" size={18} />
              <h3 className='text-xs text-white group-hover:text-black font-bold uppercase transition-all duration-300'>learn more</h3>
            </div>
          </div>
          <div className="image-container">
            <Image 
              src={video} 
              alt="Video Editing" 
              width={110} 
              height={110} 
              className="object-contain" 
            />
          </div>
        </div>

        {/* ===== Box 2 - Thumbnail Editing ===== */}
        <div 
          data-animate="box2"
          className={`service-card service-card-2 rounded-[40px] flex items-center justify-between px-6 py-6 h-[200px] cursor-pointer group ${
            isVisible('box2') ? 'animate-scale-bounce' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.2s' }}
        >
          <div className="corner-accent corner-tl text-purple-500/50 group-hover:text-purple-500"></div>
          <div className="corner-accent corner-br text-purple-500/50 group-hover:text-purple-500"></div>
          
          <div className="flex flex-col justify-between h-full relative z-10">
            <h2 className="font-bold text-xl text-white text-underline-effect">
              Production grade<br/>Thumbnail Editing
            </h2>
            <div className="learn-more-btn bg-white/10 backdrop-blur-sm border-2 border-white/20 h-[40px] w-[120px] rounded-full flex items-center justify-between px-3 group-hover:bg-purple-500 group-hover:border-purple-500 transition-all duration-300">
              <FaRegArrowAltCircleRight className="text-white group-hover:text-white rotate-[-45deg] transition-all duration-300" size={18} />
              <h3 className='text-xs text-white group-hover:text-white font-bold uppercase transition-all duration-300'>learn more</h3>
            </div>
          </div>
          <div className="image-container">
            <Image 
              src={thumbnail} 
              alt="Thumbnail Editing" 
              width={140} 
              height={140} 
              className="object-contain" 
            />
          </div>
        </div>

        {/* ===== Box 3 - Content Creation ===== */}
        <div 
          data-animate="box3"
          className={`service-card service-card-3 rounded-[40px] flex items-center justify-between px-6 py-6 h-[200px] cursor-pointer group ${
            isVisible('box3') ? 'animate-scale-bounce' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.3s' }}
        >
          <div className="corner-accent corner-tl text-pink-500/50 group-hover:text-pink-500"></div>
          <div className="corner-accent corner-br text-pink-500/50 group-hover:text-pink-500"></div>
          
          <div className="flex flex-col justify-between h-full relative z-10">
            <h2 className="font-bold text-xl text-white text-underline-effect">
              Production grade<br/>Content Creation
            </h2>
            <div className="learn-more-btn bg-white/10 backdrop-blur-sm border-2 border-white/20 h-[40px] w-[120px] rounded-full flex items-center justify-between px-3 group-hover:bg-pink-500 group-hover:border-pink-500 transition-all duration-300">
              <FaRegArrowAltCircleRight className="text-white group-hover:text-white rotate-[-45deg] transition-all duration-300" size={18} />
              <h3 className='text-xs text-white group-hover:text-white font-bold uppercase transition-all duration-300'>learn more</h3>
            </div>
          </div>
          <div className="image-container">
            <Image 
              src={content} 
              alt="Content Creation" 
              width={140} 
              height={140} 
              className="object-contain" 
            />
          </div>
        </div>

        {/* ===== Box 4 - Script Writing ===== */}
        <div 
          data-animate="box4"
          className={`service-card service-card-4 rounded-[40px] flex items-center justify-between px-6 py-6 h-[200px] cursor-pointer group ${
            isVisible('box4') ? 'animate-scale-bounce' : 'opacity-0'
          }`}
          style={{ animationDelay: '0.4s' }}
        >
          <div className="corner-accent corner-tl text-blue-500/50 group-hover:text-blue-500"></div>
          <div className="corner-accent corner-br text-blue-500/50 group-hover:text-blue-500"></div>
          
          <div className="flex flex-col justify-between h-full relative z-10">
            <h2 className="font-bold text-xl text-white text-underline-effect">
              Production grade<br/>Script Writing
            </h2>
            <div className="learn-more-btn bg-white/10 backdrop-blur-sm border-2 border-white/20 h-[40px] w-[120px] rounded-full flex items-center justify-between px-3 group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-300">
              <FaRegArrowAltCircleRight className="text-white group-hover:text-white rotate-[-45deg] transition-all duration-300" size={18} />
              <h3 className='text-xs text-white group-hover:text-white font-bold uppercase transition-all duration-300'>learn more</h3>
            </div>
          </div>
          <div className="image-container">
            <Image 
              src={brain} 
              alt="Script Writing" 
              width={140} 
              height={140} 
              className="object-contain" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Webflow;