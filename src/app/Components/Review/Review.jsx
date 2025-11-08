import React, { useEffect, useRef, useState } from 'react';

const Review = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Content Creator",
      review: "Absolutely incredible work! The team transformed my vision into reality with stunning 3D animations. Highly recommend their services!",
      rating: 5,
      color: "from-[#ceea45] to-[#b8d93c]"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Marketing Director",
      review: "Professional, creative, and efficient. Their video editing skills took our campaign to the next level. Outstanding quality!",
      rating: 5,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "YouTuber",
      review: "Best post-production team I've worked with! They understood my style and delivered beyond expectations. Will definitely work again!",
      rating: 5,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Business Owner",
      review: "The VFX work was mind-blowing! Professional service from start to finish. They made our brand video stand out!",
      rating: 5,
      color: "from-green-500 to-teal-500"
    },
    {
      id: 5,
      name: "Priya Sharma",
      role: "Filmmaker",
      review: "Exceptional color grading and editing! They brought out emotions I didn't know existed in my footage. True artists!",
      rating: 5,
      color: "from-red-500 to-orange-500"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Social Media Manager",
      review: "Quick turnaround without compromising quality. Their motion graphics elevated our content game significantly!",
      rating: 5,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.dataset.animate]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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
    <div className='w-full min-h-screen flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden relative'>
      
      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
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

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-scroll-left {
          animation: scroll-left 50s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 50s linear infinite;
        }

        @media (max-width: 768px) {
          .animate-scroll-left {
            animation: scroll-left 30s linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right 30s linear infinite;
          }
        }

        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }

        .animate-fade-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-fade-scale {
          animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .review-card {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .review-card {
            border-radius: 24px;
          }
        }

        .review-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(206, 234, 69, 0.1), transparent);
          animation: shimmer 3s infinite;
        }

        .review-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(206, 234, 69, 0.5);
        }

        @media (hover: hover) {
          .review-card:hover {
            animation: borderGlow 2s ease-in-out infinite;
          }
        }

        @media (max-width: 640px) {
          .review-card:active {
            transform: translateY(-5px) scale(1.01);
            border-color: rgba(206, 234, 69, 0.5);
          }
        }

        .corner-accent {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(206, 234, 69, 0.5);
          transition: all 0.3s ease;
          z-index: 10;
        }

        @media (min-width: 640px) {
          .corner-accent {
            width: 15px;
            height: 15px;
          }
        }

        .corner-tl {
          top: 8px;
          left: 8px;
          border-right: none;
          border-bottom: none;
        }

        @media (min-width: 640px) {
          .corner-tl {
            top: 10px;
            left: 10px;
          }
        }

        .corner-br {
          bottom: 8px;
          right: 8px;
          border-left: none;
          border-top: none;
        }

        @media (min-width: 640px) {
          .corner-br {
            bottom: 10px;
            right: 10px;
          }
        }

        .review-card:hover .corner-accent {
          width: 20px;
          height: 20px;
          border-color: #ceea45;
        }

        @media (min-width: 640px) {
          .review-card:hover .corner-accent {
            width: 25px;
            height: 25px;
          }
        }

        .profile-ring {
          position: relative;
          overflow: hidden;
        }

        .profile-ring::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(transparent, rgba(206, 234, 69, 0.8), transparent 30%);
          animation: rotate 2s linear infinite;
        }

        .profile-inner {
          position: relative;
          z-index: 10;
        }

        .star-icon {
          transition: all 0.3s ease;
        }

        .review-card:hover .star-icon {
          transform: scale(1.2) rotate(20deg);
          filter: drop-shadow(0 0 5px rgba(206, 234, 69, 0.8));
        }

        @media (max-width: 640px) {
          .review-card:active .star-icon {
            transform: scale(1.15) rotate(15deg);
          }
        }

        .grid-pattern {
          background-image: 
            linear-gradient(rgba(206, 234, 69, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(206, 234, 69, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        @media (max-width: 640px) {
          .grid-pattern {
            background-size: 30px 30px;
          }
        }

        .title-accent {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #ceea45, transparent);
          animation: pulse 2s ease-in-out infinite;
        }

        @media (min-width: 640px) {
          .title-accent {
            width: 120px;
          }
        }

        .pulse-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        .quote-accent {
          position: absolute;
          font-size: 40px;
          font-family: Georgia, serif;
          color: rgba(206, 234, 69, 0.1);
          font-weight: bold;
          line-height: 1;
          transition: all 0.3s ease;
          z-index: 5;
        }

        @media (min-width: 640px) {
          .quote-accent {
            font-size: 60px;
          }
        }

        .quote-left {
          top: 8px;
          left: 12px;
        }

        @media (min-width: 640px) {
          .quote-left {
            top: 10px;
            left: 15px;
          }
        }

        .quote-right {
          bottom: 8px;
          right: 12px;
        }

        @media (min-width: 640px) {
          .quote-right {
            bottom: 10px;
            right: 15px;
          }
        }

        .review-card:hover .quote-accent {
          color: rgba(206, 234, 69, 0.2);
          transform: scale(1.2);
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
        <div className="absolute top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2s"></div>
        <div className="absolute -bottom-8 left-20 sm:left-40 w-48 sm:w-72 h-48 sm:h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4s"></div>
        <div className="absolute top-1/2 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-6s"></div>
        <div className="absolute bottom-20 left-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-[#ceea45]/15 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-8s"></div>
      </div>

      {/* Floating Accent Dots */}
      <div className="absolute top-20 left-1/4 w-2 sm:w-3 h-2 sm:h-3 bg-[#ceea45] rounded-full pulse-dot"></div>
      <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-[#ceea45] rounded-full pulse-dot" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 left-10 w-2 h-2 bg-[#ceea45] rounded-full pulse-dot" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 right-20 w-2 sm:w-3 h-2 sm:h-3 bg-[#ceea45] rounded-full pulse-dot" style={{ animationDelay: '1.5s' }}></div>

      {/* Title Section */}
      <div 
        data-animate="title"
        className={`text-center mb-10 sm:mb-12 md:mb-16 relative z-10 px-4 ${isVisible('title') ? 'animate-fade-up' : 'opacity-0'}`}
      >
        <div className="inline-block relative">
          <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 leading-tight'>
            WHAT OUR <span className="bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#a3c933] bg-clip-text text-transparent">CLIENTS</span> SAY
          </h2>
          <div className="title-accent"></div>
        </div>
        <p className='text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-4 sm:mt-6 font-medium px-4'>
          Don't just take our word for it - hear from our <span className="text-[#ceea45] font-bold">amazing clients</span>
        </p>
      </div>

      {/* Reviews Container - Scrolling Left to Right */}
      <div className='relative w-full mb-6 sm:mb-8 overflow-hidden'>
        <div className='flex gap-3 sm:gap-4 md:gap-6 animate-scroll-left'>
          {[...reviews, ...reviews].map((review, index) => (
            <div 
              key={`${review.id}-${index}`}
              className='review-card w-[240px] sm:w-[280px] md:w-[340px] lg:w-[380px] p-4 sm:p-5 md:p-6 lg:p-7 flex-shrink-0 group'
            >
              <div className="corner-accent corner-tl"></div>
              <div className="corner-accent corner-br"></div>
              <div className="quote-accent quote-left">"</div>
              <div className="quote-accent quote-right">"</div>

              {/* Profile Section */}
              <div className='flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 relative z-10'>
                <div className={`profile-ring w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#ceea45] p-0.5 flex-shrink-0`}>
                  <div className={`profile-inner w-full h-full rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-base sm:text-lg md:text-xl lg:text-2xl font-black shadow-lg`}>
                    {review.name.charAt(0)}
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className='text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl truncate'>{review.name}</h3>
                  <p className='text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-wide truncate'>{review.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className='flex gap-0.5 sm:gap-1 mb-2 sm:mb-3 md:mb-4 relative z-10'>
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className='star-icon w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#ceea45]' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className='text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-medium relative z-10'>
                {review.review}
              </p>

              {/* Tech Lines Decoration */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="text-[#ceea45]">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="2"/>
                  <line x1="100" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2"/>
                  <line x1="0" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="2"/>
                  <line x1="50" y1="50" x2="50" y2="100" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Container - Scrolling Right to Left */}
      <div className='relative w-full mb-8 sm:mb-12 md:mb-16 overflow-hidden'>
        <div className='flex gap-3 sm:gap-4 md:gap-6 animate-scroll-right'>
          {[...reviews, ...reviews].reverse().map((review, index) => (
            <div 
              key={`${review.id}-reverse-${index}`}
              className='review-card w-[240px] sm:w-[280px] md:w-[340px] lg:w-[380px] p-4 sm:p-5 md:p-6 lg:p-7 flex-shrink-0 group'
            >
              <div className="corner-accent corner-tl"></div>
              <div className="corner-accent corner-br"></div>
              <div className="quote-accent quote-left">"</div>
              <div className="quote-accent quote-right">"</div>

              {/* Profile Section */}
              <div className='flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 relative z-10'>
                <div className={`profile-ring w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#ceea45] p-0.5 flex-shrink-0`}>
                  <div className={`profile-inner w-full h-full rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-base sm:text-lg md:text-xl lg:text-2xl font-black shadow-lg`}>
                    {review.name.charAt(0)}
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className='text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl truncate'>{review.name}</h3>
                  <p className='text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-wide truncate'>{review.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className='flex gap-0.5 sm:gap-1 mb-2 sm:mb-3 md:mb-4 relative z-10'>
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className='star-icon w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#ceea45]' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>

              {/* Review Text */}
              <p className='text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-medium relative z-10'>
                {review.review}
              </p>

              {/* Tech Lines Decoration */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" className="text-[#ceea45]">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="2"/>
                  <line x1="100" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="2"/>
                  <line x1="0" y1="50" x2="50" y2="50" stroke="currentColor" strokeWidth="2"/>
                  <line x1="50" y1="50" x2="50" y2="100" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;