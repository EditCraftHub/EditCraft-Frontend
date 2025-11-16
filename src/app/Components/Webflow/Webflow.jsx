'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { brain, content, thumbnail, video } from '@/app/Assets/images/Images';
import { FaRegArrowAltCircleRight } from "react-icons/fa";

const Webflow = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Improved intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const animateId = element.dataset.animate;
            
            setVisibleElements((prev) => {
              const newSet = new Set(prev);
              newSet.add(animateId);
              return newSet;
            });
            
            // Stop observing once visible
            observerRef.current?.unobserve(element);
          }
        });
      },
      { 
        threshold: 0.1, // Lower threshold for earlier trigger
        rootMargin: '50px' // Trigger earlier
      }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el) => {
        if (observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const isVisible = (id) => visibleElements.has(id);

  const services = [
    {
      id: 'box1',
      title: 'Video Editing',
      subtitle: 'By Skilled Editors',
      colorClass: 'service-card-1',
      accentColor: 'ceea45',
      hoverBg: 'hover:bg-[#ceea45]',
      hoverBorder: 'hover:border-[#ceea45]',
      textColor: 'text-[#ceea45]',
      textColorHover: 'group-hover:text-[#ceea45]',
      image: video,
      alt: 'Video Editing',
      delay: '0.1s'
    },
    {
      id: 'box2',
      title: 'Thumbnail Design',
      subtitle: '3x More Clicks',
      colorClass: 'service-card-2',
      accentColor: 'purple',
      hoverBg: 'hover:bg-purple-500',
      hoverBorder: 'hover:border-purple-500',
      textColor: 'text-purple-500/50',
      textColorHover: 'group-hover:text-purple-500',
      image: thumbnail,
      alt: 'Thumbnail Design',
      delay: '0.2s'
    },
    {
      id: 'box3',
      title: 'Content Strategy',
      subtitle: 'Niche Experts',
      colorClass: 'service-card-3',
      accentColor: 'pink',
      hoverBg: 'hover:bg-pink-500',
      hoverBorder: 'hover:border-pink-500',
      textColor: 'text-pink-500/50',
      textColorHover: 'group-hover:text-pink-500',
      image: content,
      alt: 'Content Strategy',
      delay: '0.3s'
    },
    {
      id: 'box4',
      title: 'Script Writing',
      subtitle: 'Engaging Stories',
      colorClass: 'service-card-4',
      accentColor: 'blue',
      hoverBg: 'hover:bg-blue-500',
      hoverBorder: 'hover:border-blue-500',
      textColor: 'text-blue-500/50',
      textColorHover: 'group-hover:text-blue-500',
      image: brain,
      alt: 'Script Writing',
      delay: '0.4s'
    }
  ];

  if (!isMounted) {
    return null; // Prevent hydration issues
  }

  return (
    <div id="service" className="overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black rounded-[40px] min-h-screen flex items-center justify-center px-6 py-20 relative">
     
      <style jsx>{`
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translate3d(-50px, 0, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translate3d(50px, 0, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: translate3d(0, 30px, 0) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes blob {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(15px, -20px, 0) scale(1.05); }
        }

        .animate-slide-left {
          animation: slideInLeft 0.7s ease-out forwards;
        }

        .animate-slide-right {
          animation: slideInRight 0.7s ease-out forwards;
        }

        .animate-scale-bounce {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-blob {
          animation: blob 12s ease-in-out infinite;
        }

        .service-card {
          position: relative;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        .service-card:hover {
          transform: translate3d(0, -8px, 0);
        }

        .service-card-1:hover {
          border-color: rgba(206, 234, 69, 0.5);
          box-shadow: 0 20px 40px rgba(206, 234, 69, 0.25);
        }

        .service-card-2:hover {
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.25);
        }

        .service-card-3:hover {
          border-color: rgba(236, 72, 153, 0.5);
          box-shadow: 0 20px 40px rgba(236, 72, 153, 0.25);
        }

        .service-card-4:hover {
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.25);
        }

        .corner-accent {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid currentColor;
          transition: all 0.3s ease;
          z-index: 10;
          pointer-events: none;
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
          width: 28px;
          height: 28px;
        }

        .learn-more-btn {
          transition: all 0.3s ease;
        }

        .image-container {
          transition: transform 0.3s ease;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }

        .service-card:hover .image-container {
          transform: translate3d(0, 0, 0) scale(1.08);
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
          transition: width 0.3s ease;
        }

        .service-card:hover .text-underline-effect::after {
          width: 100%;
        }

        @media (max-width: 768px) {
          .animate-blob {
            animation-duration: 15s;
          }
          
          .service-card:hover {
            transform: translate3d(0, -5px, 0);
          }

          .service-card:hover .image-container {
            transform: translate3d(0, 0, 0) scale(1.05);
          }
        }

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

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#ceea45]/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-10 lg:gap-y-12 w-full max-w-6xl relative z-10">
        
        {/* Title */}
        <div 
          data-animate="title"
          className={`flex flex-col justify-center transition-opacity duration-300 ${isVisible('title') ? 'animate-slide-left' : 'opacity-0'}`}
        >
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white">
            Our Comprehensive<br /> 
            <span className="bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#a3c933] bg-clip-text text-transparent">
              & Diverse Services
            </span>
          </h3>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] rounded-full"></div>
        </div>

        {/* Description */}
        <div 
          data-animate="description"
          className={`font-medium text-gray-300 text-sm sm:text-base leading-relaxed transition-opacity duration-300 ${isVisible('description') ? 'animate-slide-right' : 'opacity-0'}`}
        >
          <p>
            EditCraft is India's first marketplace built specifically for the creator economy. 
            At <span className="font-black bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent">EDITCRAFT</span>, find editors in
            <span className="text-[#ceea45] font-bold"> 24 hours</span>—every editor portfolio is verified with India-focused fair pricing. 
            Direct chat with editors with <span className="text-[#ceea45] font-bold">0% commission</span>.
          </p>
        </div>

        {/* Service Cards */}
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isVisible={isVisible(service.id)}
          />
        ))}

      </div>
    </div>
  );
};

// Memoized ServiceCard component
const ServiceCard = React.memo(({ service, isVisible }) => {
  return (
    <div 
      data-animate={service.id}
      className={`service-card ${service.colorClass} rounded-[40px] flex items-center justify-between px-6 py-6 h-[200px] cursor-pointer group transition-opacity duration-300 ${
        isVisible ? 'animate-scale-bounce' : 'opacity-0'
      }`}
      style={{ animationDelay: service.delay }}
    >
      <div className={`corner-accent corner-tl ${service.textColor} ${service.textColorHover}`}></div>
      <div className={`corner-accent corner-br ${service.textColor} ${service.textColorHover}`}></div>
      
      <div className="flex flex-col justify-between h-full relative z-10">
        <h2 className="font-bold text-lg sm:text-xl text-white text-underline-effect leading-snug">
          {service.title}<br/>{service.subtitle}
        </h2>
        <Link href="/Pages/Main/home">
          <div className={`learn-more-btn bg-white/10 backdrop-blur-sm border-2 border-white/20 h-[38px] sm:h-[40px] w-[110px] sm:w-[120px] rounded-full flex items-center justify-between px-2.5 sm:px-3 group-hover:text-white ${service.hoverBg} ${service.hoverBorder} transition-all duration-300`}>
            <FaRegArrowAltCircleRight className="text-white rotate-[-45deg] transition-all duration-300" size={16} />
            <h3 className='text-[10px] sm:text-xs text-white font-bold uppercase transition-all duration-300'>Learn More</h3>
          </div>
        </Link>
      </div>
      <div className="image-container flex-shrink-0">
        <Image 
          src={service.image} 
          alt={service.alt} 
          width={110} 
          height={110} 
          className="object-contain sm:w-[130px] sm:h-[130px] md:w-[140px] md:h-[140px]"
          quality={75}
          loading="lazy"
        />
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default Webflow;