'use client'

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Section = () => {
  const containerRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const stat3Ref = useRef(null);
  const stat4Ref = useRef(null);
  const numberRefs = useRef([]);

  useEffect(() => {
    // Container animation - scale and fade in
    gsap.fromTo(
      containerRef.current,
      {
        scale: 0.8,
        opacity: 0,
        y: 100
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Stats stagger animation
    const stats = [stat1Ref.current, stat2Ref.current, stat3Ref.current, stat4Ref.current];
    
    gsap.fromTo(
      stats,
      {
        y: 50,
        opacity: 0,
        scale: 0.5
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Counter animation for numbers
    const animateCounter = (element, target) => {
      gsap.fromTo(
        element,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 1 },
          onUpdate: function() {
            const currentValue = Math.ceil(this.targets()[0].innerText);
            element.innerText = currentValue + "+";
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        }
      );
    };

    // Animate each number
    if (numberRefs.current[0]) animateCounter(numberRefs.current[0], 200);
    if (numberRefs.current[1]) animateCounter(numberRefs.current[1], 10);
    if (numberRefs.current[2]) animateCounter(numberRefs.current[2], 800);
    if (numberRefs.current[3]) animateCounter(numberRefs.current[3], 1500);

  }, []);

  return (
    <section className="mt-20 mb-16 flex items-center justify-center px-4 relative">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#ceea45]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div 
        ref={containerRef}
        className="relative border border-white/20 rounded-[40px] w-full max-w-6xl bg-white/5 backdrop-blur-2xl text-white flex flex-col sm:flex-row items-center justify-evenly py-10 sm:py-12 gap-10 sm:gap-6 overflow-hidden"
        style={{
          boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
        }}
      >
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-[#ceea45]/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"></div>

        {/* Stat 1 - Content Types */}
        <div 
          ref={stat1Ref}
          className="group flex flex-col items-center text-center transition-all duration-300 cursor-pointer relative px-6"
        >
          <div className="relative">
            {/* Icon background */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#ceea45]/20 to-[#b8d93c]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            
            {/* Icon */}
            <div className="relative mb-3 w-16 h-16 bg-gradient-to-br from-[#ceea45] to-[#b8d93c] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ceea45]/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
          </div>
          
          <h2 
            ref={el => numberRefs.current[0] = el}
            className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
          >
            0+
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mt-2 font-medium">Content Types</p>
          
          {/* Divider line (hidden on mobile) */}
          <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Stat 2 - Categories */}
        <div 
          ref={stat2Ref}
          className="group flex flex-col items-center text-center transition-all duration-300 cursor-pointer relative px-6"
        >
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            
            <div className="relative mb-3 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
          </div>
          
          <h2 
            ref={el => numberRefs.current[1] = el}
            className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
          >
            0+
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mt-2 font-medium">Categories</p>
          
          <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Stat 3 - Active Users */}
        <div 
          ref={stat3Ref}
          className="group flex flex-col items-center text-center transition-all duration-300 cursor-pointer relative px-6"
        >
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            
            <div className="relative mb-3 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          
          <h2 
            ref={el => numberRefs.current[2] = el}
            className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
          >
            0+
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mt-2 font-medium">Active Users</p>
          
          <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Stat 4 - Projects Done */}
        <div 
          ref={stat4Ref}
          className="group flex flex-col items-center text-center transition-all duration-300 cursor-pointer relative px-6"
        >
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            
            <div className="relative mb-3 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          
          <h2 
            ref={el => numberRefs.current[3] = el}
            className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300"
          >
            0+
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mt-2 font-medium">Projects Done</p>
        </div>
      </div>
    </section>
  );
};

export default Section;