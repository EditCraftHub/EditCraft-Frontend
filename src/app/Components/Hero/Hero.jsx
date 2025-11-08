'use client'

import Image from "next/image";
import { logo, women1 } from "@/app/Assets/images/Images";
import { boy1 } from "@/app/Assets/images/Images";
import Navbar from "../Navbar";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const Hero = () => {
  const welcomeTagRef = useRef(null);
  const headlineRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageCircleRef = useRef(null);
  const imageRef = useRef(null);
  const decorativeLinesRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.5 });

    tl.fromTo(
      welcomeTagRef.current,
      { x: -100, opacity: 0, scale: 0.8 },
      { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
    );

    tl.fromTo(
      headlineRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.3"
    );

    tl.fromTo(
      descriptionRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.5"
    );

    tl.fromTo(
      buttonsRef.current.children,
      { y: 30, opacity: 0, scale: 0.8 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    );

    tl.fromTo(
      imageCircleRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" },
      "-=1"
    );

    tl.fromTo(
      imageRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.8"
    );

    tl.fromTo(
      decorativeLinesRef.current?.children || [],
      { x: -50, opacity: 0, rotation: 0 },
      { 
        x: 0, 
        opacity: 1, 
        rotation: 45,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      },
      "-=1"
    );

    gsap.to(decorativeLinesRef.current, {
      rotation: 405,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

  }, []);

  return (
    <section id="hero" className="bg-gradient-to-br from-black via-gray-900 to-black text-white rounded-b-[40px] overflow-hidden relative min-h-screen">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-[#ceea45]/15 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-8000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Navbar */}
      <Navbar />

      {/* Content Wrapper */}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-15 py-26 lg:py-2 gap-10 lg:gap-12 relative z-10">
        
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
            className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black mt-8 leading-tight tracking-tight"
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
            className="mt-6 text-gray-300 leading-relaxed text-base sm:text-lg max-w-xl"
          >
            Are you searching for <span className="text-[#ceea45] font-semibold">high-quality editing</span>? Get top-notch video editing
            from our skilled editors around the globe and make your production <span className="text-[#ceea45] font-semibold">stand out</span>.
          </p>

          {/* Stats/Features */}
          <div className="flex flex-wrap gap-6 mt-8">
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
          <div ref={buttonsRef} className="flex flex-wrap gap-5 mt-10">
            <button className="relative px-8 py-3.5 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-full font-bold text-lg shadow-2xl shadow-[#ceea45]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#ceea45]/50 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#b8d93c] to-[#ceea45] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
               <Link href={'/Pages/Auth/login'}> Get Started</Link>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button className="px-8 py-3.5 bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-white/10 hover:border-[#ceea45] hover:scale-105 hover:shadow-xl hover:shadow-[#ceea45]/20">
              See Our Work
            </button>
          </div>
        </div>

        {/* ===== Right Image Section ===== */}
        <div className="relative flex items-center justify-center w-full lg:w-auto">
          {/* Decorative Floating Lines */}
          <div 
            ref={decorativeLinesRef}
            className="absolute -top-18 -left-10 hidden lg:flex flex-col gap-3 opacity-60"
          >
            <span className="h-2 w-16 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] rounded-full shadow-lg shadow-[#ceea45]/50"></span>
            <span className="h-2 w-16 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] rounded-full shadow-lg shadow-[#ceea45]/50"></span>
            <span className="h-2 w-16 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] rounded-full shadow-lg shadow-[#ceea45]/50"></span>
          </div>

          {/* Floating Badge - Top Right */}
          <div className="absolute -top-8 -right-8 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-2xl animate-bounce-slow border-2 border-[#ceea45]/30 hidden lg:block z-20">
            <p className="text-black font-bold text-sm flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Premium Quality
            </p>
          </div>

          {/* Floating Badge - Bottom Left */}
          <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-2xl animate-bounce-slow animation-delay-2000 border-2 border-[#ceea45]/30 hidden lg:block z-20">
            <p className="text-black font-bold text-sm flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Fast Delivery
            </p>
          </div>

          {/* Circular Background + Image */}
          <div 
            ref={imageCircleRef}
            className="relative bg-gradient-to-br from-[#ceea45] via-[#b8d93c] to-[#a3c933] rounded-full h-72 w-72 sm:h-80 sm:w-80 lg:h-96 lg:w-96 xl:h-[450px] xl:w-[450px] flex items-center justify-center shadow-2xl border-4 border-white/20"
            style={{ 
              boxShadow: '0 25px 80px rgba(206,234,69,0.4), inset 0 0 100px rgba(255,255,255,0.1)'
            }}
          >
            {/* Decorative rings */}
            <div className="absolute inset-0 rounded-full border-4 border-white/10 animate-ping-slow"></div>
            <div className="absolute inset-4 rounded-full border-2 border-white/20"></div>
            
            {/* Inner dark circle for contrast */}
            <div className="relative w-64 mt-10 h-64 sm:w-72 sm:h-72 lg:w-80  xl:w-96 xl:h-96 bg-gradient-to-br from-black via-gray-900 to-black rounded-full flex items-center justify-center shadow-inner">
              <div ref={imageRef} className="relative">
                <Image
                  src={boy1}
                  alt="Professional Editor"
                  width={200}
                  height={300}
                  className="object-cover rounded-full -translate-y-8 drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ceea45]/20 to-transparent blur-2xl"></div>
          </div>

          {/* Decorative dots */}
          <div className="absolute -bottom-12 right-0 flex gap-2">
            <span className="w-3 h-3 bg-[#ceea45] rounded-full animate-pulse"></span>
            <span className="w-3 h-3 bg-[#ceea45] rounded-full animate-pulse animation-delay-2000"></span>
            <span className="w-3 h-3 bg-[#ceea45] rounded-full animate-pulse animation-delay-4000"></span>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.15; }
          100% { transform: scale(1.1); opacity: 0; }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        .animation-delay-8000 {
          animation-delay: 8s;
        }
      `}</style>
    </section>
  );
};

export default Hero;