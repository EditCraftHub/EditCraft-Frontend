'use client';
import React, { useState, useEffect } from 'react';

export default function CookiePolicy() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden">
      <style jsx>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -50px) scale(1.1); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.08); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(35px, -35px) scale(1.12); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes highlightSweep {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.25;
          mix-blend-mode: screen;
          pointer-events: none;
          will-change: transform;
        }
        .blob1 {
          width: 300px;
          height: 300px;
          background: rgba(206, 234, 69, 0.4);
          top: 10%;
          left: 5%;
          animation: blob1 10s ease-in-out infinite;
        }
        .blob2 {
          width: 400px;
          height: 400px;
          background: rgba(147, 51, 234, 0.3);
          top: 40%;
          right: 5%;
          animation: blob2 12s ease-in-out infinite;
        }
        .blob3 {
          width: 350px;
          height: 350px;
          background: rgba(236, 72, 153, 0.3);
          bottom: 10%;
          left: 30%;
          animation: blob3 14s ease-in-out infinite;
        }
        
        @media (max-width: 768px) {
          .blob1, .blob2, .blob3 {
            width: 200px;
            height: 200px;
            filter: blur(50px);
          }
        }
        
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image: 
            linear-gradient(rgba(206, 234, 69, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(206, 234, 69, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #ceea45 0%, #ffffff 50%, #ceea45 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 5s ease infinite;
        }
        
        .highlight-mark {
          position: relative;
          display: inline;
          padding: 0 4px;
        }
        
        .highlight-mark::before {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 0;
          height: 40%;
          background: linear-gradient(90deg, rgba(206, 234, 69, 0.4), rgba(206, 234, 69, 0.6));
          z-index: -1;
          animation: highlightSweep 0.6s ease-out forwards;
        }
        
        .highlight-blue::before {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.4), rgba(59, 130, 246, 0.6));
        }
        
        .highlight-green::before {
          background: linear-gradient(90deg, rgba(34, 197, 94, 0.4), rgba(34, 197, 94, 0.6));
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-card:hover {
          border-color: rgba(206, 234, 69, 0.5);
          box-shadow: 0 20px 60px rgba(206, 234, 69, 0.15);
          transform: translateY(-2px);
        }
        
        .animate-visible {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .animate-scale {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .emoji-float {
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse 2s ease-in-out infinite;
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* Animated Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
      <div className="grid-bg"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        
        {/* Header */}
        <header className="text-center mb-12 sm:mb-16" id="header" data-animate>
          <div className={`inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-card mb-4 sm:mb-6 text-xs sm:text-sm ${isVisible.header ? 'animate-visible' : 'opacity-0'}`}>
            <span className="text-2xl emoji-float">🍪</span>
            <span className="font-bold tracking-wider uppercase">Cookie Policy</span>
          </div>
          
          <h1 className={`text-4xl sm:text-5xl md:text-7xl font-black mb-3 sm:mb-4 gradient-text ${isVisible.header ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            EDITCRAFT
          </h1>
          
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-gray-300 mb-4 sm:mb-6 ${isVisible.header ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            Cookie Policy
          </h2>
          
          <p className={`text-base sm:text-lg text-gray-400 ${isVisible.header ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            Last Updated: <span className="text-[#ceea45] font-semibold">November 11, 2025</span>
          </p>
        </header>

        {/* Introduction */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8" id="intro" data-animate>
          <div className={`text-center mb-6 sm:mb-8 ${isVisible.intro ? 'animate-visible' : 'opacity-0'}`}>
            <span className="text-5xl sm:text-6xl md:text-7xl emoji-float">🍪</span>
          </div>
          <p className={`text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-300 text-center ${isVisible.intro ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            EDITCRAFT uses <span className="highlight-mark font-bold text-white">cookies and similar technologies</span> to improve your experience, ensure security, and enable essential features like{' '}
            <span className="highlight-mark highlight-blue font-bold">login and user sessions</span>.
          </p>
        </section>

        {/* What We Use Section */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-2 border-[#ceea45]/20" id="what-we-use" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 ${isVisible['what-we-use'] ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 
            <span>What We Use</span>
          </h3>
          
          <p className={`text-base sm:text-lg text-gray-300 mb-6 ${isVisible['what-we-use'] ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            We use:
          </p>

          <div className="space-y-4 sm:space-y-6">
            {/* Essential Cookies */}
            <div className={`glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 ${isVisible['what-we-use'] ? 'animate-scale' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl flex-shrink-0 pulse-glow">✅</span>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-green-400 mb-2 sm:mb-3">Essential Cookies</h4>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    To keep you <span className="highlight-mark highlight-green font-semibold">logged in</span> and remember your{' '}
                    <span className="highlight-mark highlight-green font-semibold">preferences</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* JWT Tokens */}
            <div className={`glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-blue-500/30 ${isVisible['what-we-use'] ? 'animate-scale' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl flex-shrink-0 pulse-glow">🔐</span>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2 sm:mb-3">JWT (JSON Web Tokens)</h4>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    To securely manage your <span className="highlight-mark highlight-blue font-semibold">authentication</span> and{' '}
                    <span className="highlight-mark highlight-blue font-semibold">protect your account</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className={`glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-purple-500/30 ${isVisible['what-we-use'] ? 'animate-scale' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl flex-shrink-0 pulse-glow">📊</span>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-purple-400 mb-2 sm:mb-3">Analytics Cookies</h4>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    To understand how users interact with our platform and{' '}
                    <span className="highlight-mark font-semibold">improve performance</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Control Section */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-2 border-yellow-500/30" id="your-control" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 ${isVisible['your-control'] ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 
            <span>Your Control</span>
          </h3>
          
          <div className={`p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/40 ${isVisible['your-control'] ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="text-3xl sm:text-4xl flex-shrink-0">⚙️</span>
              <div>
                <p className="text-base sm:text-lg text-yellow-100 leading-relaxed mb-3 sm:mb-4">
                  You can <span className="highlight-mark font-bold">disable cookies anytime</span> in your browser settings.
                </p>
                <div className="p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                  <p className="text-sm sm:text-base text-yellow-200 leading-relaxed">
                    ⚠️ <span className="font-semibold">Important:</span> Some features (like{' '}
                    <span className="highlight-mark font-bold">login or account access</span>) may stop working properly if cookies are disabled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Safety Section */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent" id="data-safety" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 ${isVisible['data-safety'] ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 
            <span>Data Safety</span>
          </h3>
          
          <div className="space-y-4 sm:space-y-6">
            <div className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-green-500/10 border-l-4 border-green-500 ${isVisible['data-safety'] ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              <span className="text-3xl sm:text-4xl flex-shrink-0">🛡️</span>
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                We <span className="highlight-mark highlight-green font-bold">never sell or leak</span> your data.
              </p>
            </div>
            
            <div className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-green-500/10 border-l-4 border-green-500 ${isVisible['data-safety'] ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <span className="text-3xl sm:text-4xl flex-shrink-0">🔒</span>
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                All cookies and JWT tokens are <span className="highlight-mark highlight-green font-bold">securely handled</span> and used only for{' '}
                <span className="highlight-mark highlight-green font-semibold">authentication, protection, and better user experience</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Agreement Section */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-2 sm:border-4 border-[#ceea45]/40 bg-gradient-to-br from-[#ceea45]/10 to-transparent" id="agreement" data-animate>
          <div className={`text-center ${isVisible.agreement ? 'animate-scale' : 'opacity-0'}`}>
            <div className="mb-4 sm:mb-6">
              <span className="text-5xl sm:text-6xl emoji-float">✅</span>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed">
              By using <span className="highlight-mark text-[#ceea45]">EDITCRAFT</span>, you agree to our use of{' '}
              <span className="highlight-mark text-[#ceea45]">cookies</span> and{' '}
              <span className="highlight-mark text-[#ceea45]">JWT-based authentication</span>.
            </p>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8" id="summary" data-animate>
          <div className={`glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 ${isVisible.summary ? 'animate-scale' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            <div className="text-center">
              <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block emoji-float">🔒</span>
              <h4 className="text-lg sm:text-xl font-bold text-green-400 mb-2">Secure & Safe</h4>
              <p className="text-sm sm:text-base text-gray-300">
                Your data is encrypted and protected
              </p>
            </div>
          </div>
          
          <div className={`glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-blue-500/30 ${isVisible.summary ? 'animate-scale' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <div className="text-center">
              <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block emoji-float">🎯</span>
              <h4 className="text-lg sm:text-xl font-bold text-blue-400 mb-2">Essential Only</h4>
              <p className="text-sm sm:text-base text-gray-300">
                We use cookies only for core functionality
              </p>
            </div>
          </div>
          
          <div className={`glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-purple-500/30 ${isVisible.summary ? 'animate-scale' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            <div className="text-center">
              <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block emoji-float">👤</span>
              <h4 className="text-lg sm:text-xl font-bold text-purple-400 mb-2">Your Control</h4>
              <p className="text-sm sm:text-base text-gray-300">
                Manage your cookie preferences anytime
              </p>
            </div>
          </div>
          
          <div className={`glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-[#ceea45]/30 ${isVisible.summary ? 'animate-scale' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            <div className="text-center">
              <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block emoji-float">🚫</span>
              <h4 className="text-lg sm:text-xl font-bold text-[#ceea45] mb-2">No Tracking</h4>
              <p className="text-sm sm:text-base text-gray-300">
                We never sell or share your data
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border-2 border-[#ceea45]/30" id="contact" data-animate>
          <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`}>
            Questions about our Cookie Policy?
          </h3>
          <p className={`text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            Contact us anytime
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a 
              href="mailto:support@editcraft.co.in" 
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ceea45]/10 border-2 border-[#ceea45]/30 hover:bg-[#ceea45]/20 hover:border-[#ceea45] transition-all font-semibold ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`}
              style={{animationDelay: '0.2s'}}
            >
              <span className="text-xl">📧</span> 
              <span className="break-all">support@editcraft.co.in</span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 sm:mt-16 text-gray-500">
          <p className="text-sm sm:text-base">© 2025 EditCraft. All rights reserved. Built with passion 💚</p>
        </footer>
      </div>
    </div>
  );
}