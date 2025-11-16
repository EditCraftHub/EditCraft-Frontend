'use client'

import Image from "next/image";
import { logo, women1, boy1 } from "@/app/Assets/images/Images";
import Navbar from "../Navbar";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const welcomeTagRef = useRef(null);
  const headlineRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageCircleRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    
    const debouncedResize = debounce(checkMobile, 150);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  useEffect(() => {
    if (isAnimated) return;
    
    const tl = gsap.timeline({ 
      defaults: { ease: "power2.out" },
      onComplete: () => setIsAnimated(true)
    });

    const elements = [
      welcomeTagRef.current,
      headlineRef.current,
      descriptionRef.current,
      statsRef.current,
      ...Array.from(buttonsRef.current?.children || []),
      imageCircleRef.current
    ].filter(Boolean);

    tl.fromTo(
      elements,
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6,
        stagger: 0.08,
        clearProps: "all"
      }
    );

  }, [isAnimated]);

  return (
    <section id="hero" className="bg-gradient-to-br from-black via-gray-900 to-black text-white rounded-b-[40px] overflow-hidden relative min-h-screen">
      {/* Simplified Background - GPU accelerated */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/15 rounded-full mix-blend-screen filter blur-3xl opacity-30 will-change-transform animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/15 rounded-full mix-blend-screen filter blur-3xl opacity-30 will-change-transform animate-blob animation-delay-2000"></div>
      </div>

      {/* Static grid pattern - no animation */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-40"></div>

      <Navbar />

      <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-15 py-16 lg:py-2 gap-10 lg:gap-12 relative z-10">
        
        {/* Left Content */}
        <div className="flex flex-col items-start text-left max-w-2xl w-full">
          {/* Welcome Tag */}
          <div 
            ref={welcomeTagRef}
            className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg"
          >
            Hi! Welcome To{" "}
            <span className="font-bold bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent">EDITCRAFT</span>
          </div>

          {/* Headline */}
          <h1 
            ref={headlineRef}
            className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black mt-6 lg:mt-8 leading-tight tracking-tight"
          >
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              India's First Platform 
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#ceea45] bg-clip-text text-transparent">
             Connecting Creators with 
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
             Verified Editors
            </span>
          </h1>

          {/* Description */}
          <p 
            ref={descriptionRef}
            className="mt-4 lg:mt-6 text-gray-300 leading-relaxed text-base sm:text-lg max-w-xl"
          >
           Find skilled video editors<span className="text-[#ceea45] font-semibold"> thumbnail designers</span>, and scriptwriters in 24 hours.
            Or join as an editor and get consistent paid projects<span className="text-[#ceea45] font-semibold"> from verified creators</span>.
          </p>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap gap-4 lg:gap-6 mt-6 lg:mt-8">
            <StatCard number="500+" label="Projects Completed" />
            <StatCard number="50+" label="Expert Editors" />
            <StatCard number="98%" label="Client Satisfaction" />
          </div>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4 lg:gap-5 mt-8 lg:mt-10">
            <Link href='/Pages/Auth/login'>
              <button className="relative px-6 lg:px-8 py-3 lg:py-3.5 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-full font-bold text-base lg:text-lg shadow-2xl shadow-[#ceea45]/30 transition-transform duration-200 hover:scale-105 active:scale-95 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#b8d93c] to-[#ceea45] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <Link href='#service'>
              <button className="px-6 lg:px-8 py-3 lg:py-3.5 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white rounded-full font-bold text-base lg:text-lg transition-all duration-200 hover:bg-white/10 hover:border-[#ceea45] hover:scale-105 active:scale-95">
                See Our Services
              </button>
            </Link>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative flex items-center justify-center w-full lg:w-auto">
          
          {/* Floating Badges - Optimized animations */}
          <div className="hidden lg:block absolute -top-4 -right-4 lg:-top-8 lg:-right-8 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 lg:px-5 lg:py-3 shadow-2xl will-change-transform animate-float border-2 border-[#ceea45]/30 z-20">
            <p className="text-black font-bold text-xs lg:text-sm flex items-center gap-2">
              <span className="text-xl lg:text-2xl">✨</span>
              <span>Premium Quality</span>
            </p>
          </div>

          <div className="absolute -bottom-4 -left-4 lg:-bottom-8 lg:-left-8 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 lg:px-5 lg:py-3 shadow-2xl will-change-transform animate-float animation-delay-1000 border-2 border-[#ceea45]/30 z-20">
            <p className="text-black font-bold text-xs lg:text-sm flex items-center gap-2">
              <span className="text-xl lg:text-2xl">⚡</span>
              <span className="hidden sm:inline">Fast Delivery</span>
              <span className="sm:hidden">Fast</span>
            </p>
          </div>

          {/* Circular Background + Image */}
          <div 
            ref={imageCircleRef}
            className="relative bg-gradient-to-br from-[#ceea45] via-[#b8d93c] to-[#a3c933] rounded-full h-64 w-64 sm:h-80 sm:w-80 md:h-[340px] md:w-[340px] lg:h-96 lg:w-96 xl:h-[450px] xl:w-[450px] flex items-center justify-center shadow-2xl border-4 border-white/20"
          >
            <div className="absolute inset-4 rounded-full border-2 border-white/20"></div>
            
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[290px] md:h-[290px] lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-br from-black via-gray-900 to-black rounded-full flex items-center justify-center shadow-inner overflow-hidden">
              <div className="relative w-full h-full flex items-end justify-center">
                <Image
                  src={boy1}
                  alt="Professional Editor"
                  width={210}
                  height={300}
                  className="object-contain object-bottom h-[95%] w-auto drop-shadow-2xl"
                  priority
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  sizes="(max-width: 640px) 130px, (max-width: 1024px) 170px, 210px"
                />
              </div>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute -bottom-8 lg:-bottom-12 right-4 lg:right-0 flex gap-2">
            <span className="w-2 h-2 lg:w-3 lg:h-3 bg-[#ceea45] rounded-full animate-pulse-slow"></span>
            <span className="w-2 h-2 lg:w-3 lg:h-3 bg-[#ceea45] rounded-full animate-pulse-slow animation-delay-700"></span>
            <span className="w-2 h-2 lg:w-3 lg:h-3 bg-[#ceea45] rounded-full animate-pulse-slow animation-delay-1400"></span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(20px, -30px, 0) scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1400 {
          animation-delay: 1.4s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-blob,
          .animate-float,
          .animate-pulse-slow {
            animation: none;
          }
        }

        /* Force GPU acceleration */
        .animate-blob,
        .animate-float {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

// Reusable StatCard component
const StatCard = ({ number, label }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
    <p className="text-[#ceea45] text-2xl font-bold">{number}</p>
    <p className="text-gray-400 text-xs">{label}</p>
  </div>
);

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default Hero;