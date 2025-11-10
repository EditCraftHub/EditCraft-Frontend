'use client'

import React, { useEffect, useRef, useState } from "react";
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
  const hasAnimated = useRef(false);
  const countersAnimated = useRef(false);
  const [finalValues] = useState([200, 10, 800, 1500]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Simplified container animation
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.6 : 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true
          }
        }
      );

      // Simplified stats animation
      const stats = [stat1Ref.current, stat2Ref.current, stat3Ref.current, stat4Ref.current];
      
      gsap.fromTo(
        stats,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: isMobile ? 0.4 : 0.6,
          stagger: isMobile ? 0.1 : 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true
          }
        }
      );

      // Optimized counter animation
      const animateCounter = (element, target, index) => {
        if (!element || countersAnimated.current) {
          // If already animated, just set the final value
          if (element && countersAnimated.current) {
            element.innerText = finalValues[index] + "+";
          }
          return;
        }
        
        // Set initial value to prevent NaN
        element.innerText = "0+";
        
        gsap.fromTo(
          element,
          { innerText: 0 },
          {
            innerText: target,
            duration: isMobile ? 1.5 : 2,
            ease: "power1.out",
            snap: { innerText: 1 },
            onUpdate: function() {
              const currentValue = Math.ceil(parseFloat(this.targets()[0].innerText) || 0);
              element.innerText = currentValue + "+";
            },
            onComplete: function() {
              element.innerText = target + "+";
            },
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
              once: true,
              onEnter: () => {
                countersAnimated.current = true;
              }
            }
          }
        );
      };

      // Animate each number only once
      if (!countersAnimated.current) {
        animateCounter(numberRefs.current[0], 200, 0);
        animateCounter(numberRefs.current[1], 10, 1);
        animateCounter(numberRefs.current[2], 800, 2);
        animateCounter(numberRefs.current[3], 1500, 3);
      } else {
        // Restore final values on resize
        numberRefs.current.forEach((el, index) => {
          if (el) el.innerText = finalValues[index] + "+";
        });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [finalValues]);

  const stats = [
    {
      ref: stat1Ref,
      numberRef: 0,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      ),
      gradient: "from-[#ceea45] to-[#b8d93c]",
      bgGradient: "from-[#ceea45]/20 to-[#b8d93c]/20",
      shadow: "shadow-[#ceea45]/30",
      label: "Content Types"
    },
    {
      ref: stat2Ref,
      numberRef: 1,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      ),
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      shadow: "shadow-purple-500/30",
      label: "Categories"
    },
    {
      ref: stat3Ref,
      numberRef: 2,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      shadow: "shadow-blue-500/30",
      label: "Active Users"
    },
    {
      ref: stat4Ref,
      numberRef: 3,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      ),
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/20 to-red-500/20",
      shadow: "shadow-orange-500/30",
      label: "Projects Done"
    }
  ];

  return (
    <section className="mt-20 mb-16 flex items-center justify-center px-4 relative">
      {/* Simplified background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#ceea45]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div 
        ref={containerRef}
        className="relative border border-white/20 rounded-3xl lg:rounded-[40px] w-full max-w-6xl bg-white/5 backdrop-blur-xl text-white flex flex-col sm:flex-row items-center justify-evenly py-8 sm:py-10 lg:py-12 gap-8 sm:gap-6 overflow-hidden"
        style={{
          boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
          willChange: 'transform, opacity'
        }}
      >
        {stats.map((stat, index) => (
          <div 
            key={index}
            ref={stat.ref}
            className="group flex flex-col items-center text-center transition-transform duration-300 cursor-pointer relative px-4 lg:px-6 hover:scale-105 active:scale-95"
            style={{ willChange: 'transform' }}
          >
            <div className="relative">
              {/* Simplified icon background glow */}
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${stat.bgGradient} rounded-2xl blur-lg transition-all pointer-events-none`}></div>
              
              {/* Icon */}
              <div className={`relative mb-3 w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg ${stat.shadow} transition-transform duration-300 group-hover:rotate-6`}>
                <svg className="w-7 h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {stat.icon}
                </svg>
              </div>
            </div>
            
            <h2 
              ref={el => numberRefs.current[stat.numberRef] = el}
              className={`text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent transition-transform duration-300`}
            >
              0+
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2 font-medium">{stat.label}</p>
            
            {/* Divider line - hidden on last item and mobile */}
            {index < stats.length - 1 && (
              <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-20 lg:h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section;