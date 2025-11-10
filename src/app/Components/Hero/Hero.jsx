'use client'

import Image from "next/image";
import { logo, women1, boy1 } from "@/app/Assets/images/Images";
import Navbar from "../Navbar";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const welcomeTagRef = useRef(null);
  const headlineRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageCircleRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Simplified animations for better mobile performance
    const tl = gsap.timeline({ 
      defaults: { ease: "power2.out" }, 
      delay: isMobile ? 0.2 : 0.5 
    });

    tl.fromTo(
      welcomeTagRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    );

    tl.fromTo(
      headlineRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.3"
    );

    tl.fromTo(
      descriptionRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.4"
    );

    if (statsRef.current) {
      tl.fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      );
    }

    tl.fromTo(
      buttonsRef.current.children,
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5,
        stagger: 0.15
      },
      "-=0.3"
    );

    // Simpler image animation
    tl.fromTo(
      imageCircleRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8 },
      "-=0.6"
    );

  }, [isMobile]);

  return (
    <section id="hero" className="bg-gradient-to-br from-black via-gray-900 to-black text-white rounded-b-[40px] overflow-hidden relative min-h-screen">
      {/* Simplified Background - fewer blobs for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Navbar */}
      <Navbar />

      {/* Content Wrapper */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-15 py-16 lg:py-2 gap-10 lg:gap-12 relative z-10">
        
        {/* ===== Left Content ===== */}
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
              Want quality editing
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#ceea45] bg-clip-text text-transparent">
              for your content?
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Come with us.
            </span>
          </h1>

          {/* Description */}
          <p 
            ref={descriptionRef}
            className="mt-4 lg:mt-6 text-gray-300 leading-relaxed text-base sm:text-lg max-w-xl"
          >
            Are you searching for <span className="text-[#ceea45] font-semibold">high-quality editing</span>? Get top-notch video editing
            from our skilled editors around the globe and make your production <span className="text-[#ceea45] font-semibold">stand out</span>.
          </p>

          {/* Stats/Features */}
          <div ref={statsRef} className="flex flex-wrap gap-4 lg:gap-6 mt-6 lg:mt-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-[#ceea45] text-2xl font-bold">500+</p>
              <p className="text-gray-400 text-xs">Projects Completed</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-[#ceea45] text-2xl font-bold">50+</p>
              <p className="text-gray-400 text-xs">Expert Editors</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
              <p className="text-[#ceea45] text-2xl font-bold">98%</p>
              <p className="text-gray-400 text-xs">Client Satisfaction</p>
            </div>
          </div>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4 lg:gap-5 mt-8 lg:mt-10">
            <Link href='/Pages/Auth/login'>
              <button className="relative px-6 lg:px-8 py-3 lg:py-3.5 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-full font-bold text-base lg:text-lg shadow-2xl shadow-[#ceea45]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#ceea45]/50 active:scale-95 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#b8d93c] to-[#ceea45] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <button  className="px-6 lg:px-8 py-3 lg:py-3.5 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white rounded-full font-bold text-base lg:text-lg transition-all duration-300 hover:bg-white/10 hover:border-[#ceea45] hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-[#ceea45]/20">
              <Link href={'#service'}>See Our services</Link>
            </button>
          </div>
        </div>

        {/* ===== Right Image Section ===== */}
        <div className="relative flex items-center justify-center w-full lg:w-auto">
          
          {/* Floating Badge - Top Right */}
          <div className=" hidden lg:block absolute -top-4 -right-4 lg:-top-8 lg:-right-8 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 lg:px-5 lg:py-3 shadow-2xl animate-bounce-slow border-2 border-[#ceea45]/30 z-20">
            <p className="text-black font-bold text-xs lg:text-sm flex items-center gap-2">
              <span className="text-xl lg:text-2xl">✨</span>
              <span className="hidden lg:flex">Premium Quality</span>
              <span className=" hidden lg:flex">Premium</span>
            </p>
          </div>

          {/* Floating Badge - Bottom Left */}
          <div className="absolute -bottom-4 -left-4 lg:-bottom-8 lg:-left-8 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 lg:px-5 lg:py-3 shadow-2xl animate-bounce-slow animation-delay-1000 border-2 border-[#ceea45]/30 z-20">
            <p className="text-black font-bold text-xs lg:text-sm flex items-center gap-2">
              <span className="text-xl lg:text-2xl">⚡</span>
              <span className="hidden  sm:inline">Fast Delivery</span>
              <span className="sm:hidden">Fast</span>
            </p>
          </div>
   {/* Circular Background + Image */}
          <div 
            ref={imageCircleRef}
            className="relative bg-gradient-to-br from-[#ceea45] via-[#b8d93c] to-[#a3c933] rounded-full h-64 w-64 sm:h-80 sm:w-80 md:h-[340px] md:w-[340px] lg:h-96 lg:w-96 xl:h-[450px] xl:w-[450px] flex items-center justify-center shadow-2xl border-4 border-white/20"
            style={{ 
              boxShadow: '0 25px 80px rgba(206,234,69,0.4), inset 0 0 100px rgba(255,255,255,0.1)'
            }}
          >
            {/* Simplified decorative ring */}
            <div className="absolute inset-4 rounded-full border-2 border-white/20"></div>
            
            {/* Inner dark circle for contrast */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[290px] md:h-[290px] lg:w-80 lg:h-80 xl:w-96 xl:h-96 bg-gradient-to-br from-black via-gray-900 to-black rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                  <div ref={imageRef} className="relative w-full h-full flex items-end justify-center">
                {/* Mobile & Small screens */}
                <Image
                  src={boy1}
                  alt="Professional Editor"
                  width={130}
                  height={200}
                  className="block sm:hidden object-contain object-bottom h-[95%] w-auto drop-shadow-2xl"
                  priority
                  loading="eager"
                />
                
                {/* Medium screens */}
                <Image
                  src={boy1}
                  alt="Professional Editor"
                  width={170}
                  height={250}
                  className="hidden sm:block lg:hidden object-contain object-bottom h-[95%] w-auto drop-shadow-2xl"
                  priority
                  loading="eager"
                />
                
                {/* Large screens and above */}
                <Image
                  src={boy1}
                  alt="Professional Editor"
                  width={210}
                  height={300}
                  className="hidden lg:block object-contain object-bottom h-[95%] w-auto drop-shadow-2xl"
                  priority
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* Decorative dots */}
          <div className="absolute -bottom-8 lg:-bottom-12 right-4 lg:right-0 flex gap-2">
            <span className="w-2 h-2 lg:w-3 lg:h-3 bg-[#ceea45] rounded-full animate-pulse"></span>
            <span className="w-2 h-2 lg:w-3 lg:h-3 bg-[#ceea45] rounded-full animate-pulse animation-delay-1000"></span>
            <span className="w-2 h-2 lg:w-3 lg:h-3 bg-[#ceea45] rounded-full animate-pulse animation-delay-2000"></span>
          </div>
        </div>
      </div>

      {/* Optimized CSS animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.05); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .animate-blob {
          animation: blob 8s ease-in-out infinite;
          will-change: transform;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
          will-change: transform;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          .animate-blob,
          .animate-bounce-slow,
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;