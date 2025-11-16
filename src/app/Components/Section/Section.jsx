'use client'

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Section = () => {
  const containerRef = useRef(null);
  const numberRefs = useRef([]);
  const statsRefs = useRef([]);
  const hasAnimated = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  const finalValues = [200, 10, 800, 1500];

  useEffect(() => {
    setIsMounted(true);
    
    if (hasAnimated.current) return;

    const ctx = gsap.context(() => {
      // Single combined animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            hasAnimated.current = true;
          }
        }
      });

      // Container fade in
      tl.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", clearProps: "all" }
      );

      // Stats cards stagger
      tl.fromTo(
        statsRefs.current.filter(Boolean),
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "all"
        },
        "-=0.3"
      );

      // Counter animations - simplified
      numberRefs.current.forEach((el, index) => {
        if (!el) return;
        
        const target = finalValues[index];
        el.textContent = "0+";
        
        tl.to(
          el,
          {
            innerText: target,
            duration: 1.5,
            ease: "power1.out",
            snap: { innerText: 1 },
            onUpdate: function() {
              const val = Math.ceil(this.targets()[0].innerText);
              el.textContent = val + "+";
            },
            onComplete: function() {
              el.textContent = target + "+";
            }
          },
          "-=0.8"
        );
      });

    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const stats = [
    {
      icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
      gradient: "from-[#ceea45] to-[#b8d93c]",
      label: "Content Types"
    },
    {
      icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
      gradient: "from-purple-500 to-pink-500",
      label: "Categories"
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      gradient: "from-blue-500 to-cyan-500",
      label: "Active Users"
    },
    {
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
      gradient: "from-orange-500 to-red-500",
      label: "Projects Done"
    }
  ];

  return (
    <section className="mt-20 mb-16 flex items-center justify-center px-4 relative">
      {/* Static background - no animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#ceea45]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div 
        ref={containerRef}
        className="relative border border-white/20 rounded-3xl lg:rounded-[40px] w-full max-w-6xl bg-white/5 backdrop-blur-xl text-white flex flex-col sm:flex-row items-center justify-evenly py-8 sm:py-10 lg:py-12 gap-8 sm:gap-6 overflow-hidden shadow-2xl"
      >
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            stat={stat}
            index={index}
            statsRef={el => statsRefs.current[index] = el}
            numberRef={el => numberRefs.current[index] = el}
            isLast={index === stats.length - 1}
            finalValue={finalValues[index]}
            isMounted={isMounted}
          />
        ))}
      </div>
    </section>
  );
};

// Memoized StatCard component to prevent unnecessary re-renders
const StatCard = React.memo(({ stat, index, statsRef, numberRef, isLast, finalValue, isMounted }) => {
  return (
    <div 
      ref={statsRef}
      className="group flex flex-col items-center text-center transition-transform duration-200 cursor-pointer relative px-4 lg:px-6 hover:scale-105 active:scale-95"
    >
      <div className="relative">
        {/* Simplified icon glow - only on hover */}
        <div className={`absolute -inset-2 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none`}></div>
        
        {/* Icon */}
        <div className={`relative mb-3 w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:rotate-6`}>
          <svg className="w-7 h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} />
          </svg>
        </div>
      </div>
      
      <h2 
        ref={numberRef}
        className={`text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
      >
        {isMounted ? '0+' : `${finalValue}+`}
      </h2>
      <p className="text-sm sm:text-base text-gray-300 mt-2 font-medium">{stat.label}</p>
      
      {/* Divider */}
      {!isLast && (
        <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-20 lg:h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default Section;