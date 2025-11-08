import React, { useEffect, useRef, useState } from 'react';
import { Camera, Video, Users, Briefcase, Eye, Play, ArrowRight } from 'lucide-react';
import { team1, team2 } from '@/app/Assets/images/Images';
import Image from 'next/image';

const Service = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [activeCard, setActiveCard] = useState(null);
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
    <div id='webflow' className="overflow-x-hidden min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-20 px-6 relative">
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleInBounce {
          0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          60% { transform: scale(1.05) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes borderGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(206, 234, 69, 0.4); }
          50% { box-shadow: 0 0 50px rgba(206, 234, 69, 0.6); }
        }

        .grid-pattern {
          background-image: 
            linear-gradient(rgba(206, 234, 69, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(206, 234, 69, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .animate-slide-left { animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-right { animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-bounce { animation: scaleInBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-fade-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-blob { animation: blob 7s infinite; }

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
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(206, 234, 69, 0.1), transparent);
          animation: shimmer 3s infinite;
        }

        .service-card:hover {
          transform: translateY(-8px);
          border-color: rgba(206, 234, 69, 0.3);
        }

        .service-card-lime:hover { box-shadow: 0 25px 60px rgba(206, 234, 69, 0.3); }
        .service-card-purple:hover { box-shadow: 0 25px 60px rgba(139, 92, 246, 0.3); }
        .service-card-pink:hover { box-shadow: 0 25px 60px rgba(236, 72, 153, 0.3); }
        .service-card-blue:hover { box-shadow: 0 25px 60px rgba(59, 130, 246, 0.3); }

        .corner-accent {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid currentColor;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
        .corner-br { bottom: 10px; right: 10px; border-left: none; border-top: none; }
        .service-card:hover .corner-accent { width: 30px; height: 30px; }

        .learn-more-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
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

        .service-card:hover .learn-more-btn::before { left: 100%; }

        .image-container {
          transition: all 0.4s ease;
        }

        .service-card:hover .image-container {
          transform: scale(1.05);
        }

        .icon-wrapper {
          border-radius: 50%;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .service-card:hover .icon-wrapper {
          transform: scale(1.1) rotate(-5deg);
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

        .service-card:hover .text-underline-animate::after { width: 100%; }

        .pulse-dot { animation: pulse 2s ease-in-out infinite; }

        .team-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          transition: all 0.4s ease;
        }

        .team-card:hover {
          transform: translateY(-8px);
          border-color: rgba(206, 234, 69, 0.3);
          box-shadow: 0 25px 60px rgba(206, 234, 69, 0.2);
        }

        .profile-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .profile-circle:hover {
          transform: scale(1.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #ceea45 0%, #b8d93c 100%);
          transition: all 0.3s ease;
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
        }

        .btn-primary:hover::before { left: 100%; }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(206, 234, 69, 0.4);
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

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Title Section */}
          <div 
            data-animate="title"
            className={`lg:col-span-2 flex flex-col justify-center ${isVisible('title') ? 'animate-slide-left' : 'opacity-0'}`}
          >
            <h2 className="text-4xl md:text-6xl font-black leading-tight text-white">
              Our Comprehensive
              <br />
              <span className="bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#a3c933] bg-clip-text text-transparent">
                & Diverse Services
              </span>
            </h2>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] rounded-full"></div>
          </div>

          {/* Description */}
          <div 
            data-animate="description"
            className={`flex items-center ${isVisible('description') ? 'animate-slide-right' : 'opacity-0'}`}
          >
            <p className="text-gray-300 leading-relaxed">
              At <span className="font-bold bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent">EDITCRAFT</span>, we deliver
              <span className="font-bold text-[#ceea45]"> production-grade quality</span> with exceptional 
              time management. Our top-tier editors help you elevate your brand.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Image Card 1 */}
          <div 
            data-animate="card1"
            className={`service-card service-card-lime rounded-[40px] overflow-hidden h-[380px] ${
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
              />
            </div>
          </div>

          {/* Content Creation Card */}
          <div 
            data-animate="card2"
            className={`service-card service-card-lime rounded-[40px] p-8 h-[380px] flex flex-col ${
              isVisible('card2') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            <div className="corner-accent corner-tl text-[#ceea45]/50"></div>
            <div className="corner-accent corner-br text-[#ceea45]/50"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="icon-wrapper bg-[#ceea45]">
                <Eye className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                How It Works
              </h3>
            </div>
            
            <h4 className="text-2xl font-bold text-white mb-4 text-underline-animate relative z-10">
              Content Creation
            </h4>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow relative z-10">
              We bring your creative vision to life with cutting-edge 3D animation, visual effects, and motion graphics that captivate your audience.
            </p>

            <div className="image-container w-full h-24 rounded-2xl overflow-hidden mb-4 relative">
              <Image 
                src={team1} 
                alt="Team 1" 
                fill
                className="object-cover"
              />
            </div>
            
            <button className="learn-more-btn bg-white/10 border-2 border-white/20 h-10 rounded-full flex items-center justify-between px-4 hover:bg-[#ceea45] hover:border-[#ceea45] hover:text-black transition-all duration-300 relative z-10 text-white">
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform" />
              <span className="text-xs font-bold uppercase">Learn More</span>
            </button>
          </div>

          {/* Team Section */}
          <div 
            data-animate="team"
            className={`flex flex-col gap-4 ${isVisible('team') ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.3s' }}
          >
            <div className="team-card h-[160px] flex items-center justify-center">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent">
                Meet Our Team
              </h3>
            </div>

            <div className="team-card h-[200px] flex flex-col items-center justify-center gap-6 p-6">
              <div className="flex items-center justify-center gap-4">
                <div className="profile-circle bg-gradient-to-br from-[#ceea45] to-[#b8d93c]">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <div className="profile-circle bg-gradient-to-br from-purple-500 to-pink-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="profile-circle bg-gradient-to-br from-cyan-500 to-blue-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>

              <button className="btn-primary px-8 py-3 rounded-full text-black font-semibold text-sm">
                View Profiles
              </button>
            </div>
          </div>

          {/* Video Editing Card */}
          <div 
            data-animate="card3"
            className={`service-card service-card-purple rounded-[40px] p-8 h-[380px] flex flex-col text-white ${
              isVisible('card3') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.4s' }}
          >
            <div className="corner-accent corner-tl text-purple-500/50"></div>
            <div className="corner-accent corner-br text-purple-500/50"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-purple-500/30">
                <video 
                  className="w-full h-full object-cover" 
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/video1.mp4" type="video/mp4" />
                </video>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                How It Works
              </h3>
            </div>
            
            <h4 className="text-2xl font-bold mb-4 text-underline-animate relative z-10">
              Video Editing
            </h4>
            
            <p className="text-sm leading-relaxed mb-6 flex-grow text-gray-300 relative z-10">
              Expert editors guide you through the process, refine your content, and deliver production-ready results that boost quality.
            </p>

            <div className="flex justify-center mb-4 relative z-10">
              <video 
                className="w-full h-32 rounded-lg object-cover border-2 border-purple-500/30" 
                controls
                muted
                loop
                playsInline
              >
                <source src="/video1.mp4" type="video/mp4" />
              </video>
            </div>
            
            <button className="learn-more-btn bg-white/10 border-2 border-white/20 h-10 rounded-full flex items-center justify-between px-4 hover:bg-purple-500 hover:border-purple-500 transition-all duration-300 relative z-10">
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform" />
              <span className="text-xs font-bold uppercase">Learn More</span>
            </button>
          </div>

          {/* Image Card 2 */}
          <div 
            data-animate="card4"
            className={`service-card service-card-pink rounded-[40px] overflow-hidden h-[380px] ${
              isVisible('card4') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.5s' }}
          >
            <div className="corner-accent corner-tl text-pink-500"></div>
            <div className="corner-accent corner-br text-pink-500"></div>

            <div className="image-container w-full h-full overflow-hidden">
              <video 
                className="w-full h-full object-cover" 
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/video2.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Thumbnail Design Card */}
          <div 
            data-animate="card5"
            className={`service-card service-card-pink rounded-[40px] p-8 h-[380px] flex flex-col text-white ${
              isVisible('card5') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.6s' }}
          >
            <div className="corner-accent corner-tl text-pink-500/50"></div>
            <div className="corner-accent corner-br text-pink-500/50"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-pink-500/30">
                <Image 
                  src={team2} 
                  alt="Team 2" 
                  width={56}
                  height={56}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                How It Works
              </h3>
            </div>
            
            <h4 className="text-2xl font-bold mb-4 text-underline-animate relative z-10">
              Thumbnail Design
            </h4>
            
            <p className="text-sm leading-relaxed mb-6 flex-grow text-gray-300 relative z-10">
              Eye-catching thumbnails that stop the scroll and drive clicks. Stand out with professional designs optimized for engagement.
            </p>

            <div className="image-container flex justify-center mb-4 relative h-24 rounded-2xl overflow-hidden">
              <Image 
                src={team1} 
                alt="Team 1" 
                fill
                className="object-cover"
              />
            </div>
            
            <button className="learn-more-btn bg-white/10 border-2 border-white/20 h-10 rounded-full flex items-center justify-between px-4 hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 relative z-10">
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform" />
              <span className="text-xs font-bold uppercase">Learn More</span>
            </button>
          </div>

          {/* Script Writing Card */}
          <div 
            data-animate="card6"
            className={`service-card service-card-blue rounded-[40px] p-8 h-[380px] flex flex-col ${
              isVisible('card6') ? 'animate-scale-bounce' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.7s' }}
          >
            <div className="corner-accent corner-tl text-blue-500/50"></div>
            <div className="corner-accent corner-br text-blue-500/50"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="icon-wrapper bg-blue-500/20 border-2 border-blue-500/30">
                <video 
                  className="w-full h-full rounded-full object-cover" 
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src="/video2.mp4" type="video/mp4" />
                </video>
              </div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                How It Works
              </h3>
            </div>
            
            <h4 className="text-2xl font-bold text-white mb-4 text-underline-animate relative z-10">
              Script Writing
            </h4>
            
            <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow relative z-10">
              Compelling scripts that tell your story. From concept to final draft, we craft narratives that resonate with your audience.
            </p>

            <div className="flex justify-center mb-4 relative z-10">
              <video 
                className="w-full h-32 rounded-lg object-cover border-2 border-blue-500/30" 
                controls
                muted
                loop
                playsInline
              >
                <source src="/video1.mp4" type="video/mp4" />
              </video>
            </div>   
            <button className="learn-more-btn bg-white/10 border-2 border-white/20 h-10 rounded-full flex items-center justify-between px-4 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all duration-300 relative z-10 text-white">
              <ArrowRight className="w-4 h-4 -rotate-45 transition-transform" />
              <span className="text-xs font-bold uppercase">Learn More</span>
            </button>
          </div>

          {/* Clients Section */}
          <div 
            data-animate="clients"
            className={`flex flex-col gap-4 ${isVisible('clients') ? 'animate-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.8s' }}
          >
            <div className="team-card h-[160px] flex items-center justify-center">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-[#ceea45] to-[#b8d93c] bg-clip-text text-transparent">
                Our Clients
              </h3>
            </div>

            <div className="team-card h-[200px] flex flex-col items-center justify-center gap-6 p-6">
              <div className="flex items-center justify-center gap-4">
                <div className="profile-circle bg-gradient-to-br from-green-500 to-teal-500">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="profile-circle bg-gradient-to-br from-orange-500 to-red-500">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="profile-circle bg-gradient-to-br from-indigo-500 to-blue-500">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>

              <button className="btn-primary px-8 py-3 rounded-full text-black font-semibold text-sm">
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