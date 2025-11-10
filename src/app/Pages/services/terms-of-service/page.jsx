'use client';
import React, { useState, useEffect } from 'react';

export default function TermsOfService() {
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
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
        
        .highlight-red::before {
          background: linear-gradient(90deg, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.6));
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
        
        .emoji-float {
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }
        
        .emoji-shake {
          display: inline-block;
          animation: shake 2s ease-in-out infinite;
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
            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-bold tracking-wider uppercase">Legal Agreement</span>
          </div>
          
          <h1 className={`text-4xl sm:text-5xl md:text-7xl font-black mb-3 sm:mb-4 gradient-text ${isVisible.header ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            🧾 EDITCRAFT
          </h1>
          
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-gray-300 mb-4 sm:mb-6 ${isVisible.header ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            Terms of Service
          </h2>
          
          <p className={`text-base sm:text-lg text-gray-400 ${isVisible.header ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            Last Updated: <span className="text-[#ceea45] font-semibold">November 11, 2025</span>
          </p>
        </header>

        {/* Introduction */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8" id="intro" data-animate>
          <p className={`text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-300 mb-4 sm:mb-6 ${isVisible.intro ? 'animate-visible' : 'opacity-0'}`}>
            Welcome to <span className="highlight-mark font-bold text-white">EDITCRAFT</span>, a{' '}
            <span className="highlight-mark font-bold text-[#ceea45]">free creative collaboration platform</span> designed to connect{' '}
            <span className="highlight-mark font-bold text-white">Content Creators and Editors</span> to work together, grow together, and build digital success stories.
          </p>
          <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/40 ${isVisible.intro ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            <p className="text-base sm:text-lg leading-relaxed text-yellow-100">
              By accessing or using EDITCRAFT, you agree to these Terms of Service. Please read them carefully —{' '}
              <span className="highlight-mark font-bold">by using our platform, you are legally bound by these terms.</span>
            </p>
          </div>
        </section>

        {/* Section 1 */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8" id="section1" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 ${isVisible.section1 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 
            <span>1. Acceptance of Terms</span>
          </h3>
          <p className={`text-base sm:text-lg leading-relaxed text-gray-300 mb-4 sm:mb-6 ${isVisible.section1 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            By creating an account or using EDITCRAFT, you confirm that:
          </p>
          
          <div className="space-y-3 sm:space-y-4">
            {[
              'You have read, understood, and accepted these Terms.',
              'You are at least 13 years old or the legal minimum age in your country.',
              'You agree to follow all platform rules and community guidelines.'
            ].map((item, idx) => (
              <div key={idx} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 ${isVisible.section1 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
                <span className="text-[#ceea45] text-xl sm:text-2xl font-bold mt-1">✓</span>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-red-500/10 border-2 border-red-500/30 ${isVisible.section1 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
            <p className="text-base sm:text-lg font-semibold text-red-400 text-center">
              If you do not agree, please do not use the platform.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8" id="section2" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 ${isVisible.section2 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 
            <span>2. About EDITCRAFT</span>
          </h3>
          <p className={`text-base sm:text-lg leading-relaxed text-gray-300 mb-4 sm:mb-6 ${isVisible.section2 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            EDITCRAFT is a <span className="highlight-mark font-semibold">free online platform</span> that allows users to:
          </p>
          
          <div className="space-y-3 sm:space-y-4">
            {[
              'Connect creators and editors for collaboration.',
              'Communicate, exchange ideas, and work on creative projects.',
              'Grow professionally in a secure, respectful community.'
            ].map((item, idx) => (
              <div key={idx} className={`flex items-start gap-3 sm:gap-4 ${isVisible.section2 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
                <span className="text-[#ceea45] text-xl sm:text-2xl font-bold mt-1">•</span>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-blue-500/10 border-2 border-blue-500/30 ${isVisible.section2 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
            <p className="text-base sm:text-lg text-blue-300">
              <span className="font-bold">Note:</span> While free now, we may introduce premium or paid features in the future, but always with clear notice to users.
            </p>
          </div>
        </section>

        {/* Section 3 - User Responsibilities */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-2 border-[#ceea45]/20" id="section3" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 ${isVisible.section3 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 
            <span>3. User Responsibilities</span>
          </h3>
          
          {/* DO's */}
          <div className={`mb-6 sm:mb-8 ${isVisible.section3 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            <h4 className="text-xl sm:text-2xl font-bold text-[#ceea45] mb-3 sm:mb-4">You agree to:</h4>
            <div className="space-y-3">
              {[
                'Provide accurate details during registration.',
                'Maintain respectful communication with all users.',
                'Use EDITCRAFT only for legal, creative, and professional purposes.'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-green-500/10 border-l-4 border-green-500">
                  <span className="text-green-400 text-xl sm:text-2xl font-bold flex-shrink-0">✅</span>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* DON'Ts */}
          <div className={`${isVisible.section3 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            <h4 className="text-xl sm:text-2xl font-bold text-red-400 mb-3 sm:mb-4">You must not:</h4>
            <div className="space-y-3">
              {[
                'Upload or share adult, obscene, or explicit material.',
                'Engage in scamming, impersonation, or fraudulent activities.',
                'Repost, sell, or claim others\' work as your own ("No Double Sharing").',
                'Misuse any data or attempt to harm the platform or its users.'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-red-500/10 border-l-4 border-red-500">
                  <span className="text-red-400 text-xl sm:text-2xl font-bold emoji-shake flex-shrink-0">🚫</span>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4 - Data Protection */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8" id="section4" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 ${isVisible.section4 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 
            <span>4. Data Protection & Privacy</span>
          </h3>
          <p className={`text-lg sm:text-xl font-bold text-[#ceea45] mb-4 sm:mb-6 ${isVisible.section4 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            We take your privacy seriously.
          </p>
          
          <div className="space-y-3 sm:space-y-4">
            {[
              'EDITCRAFT securely stores your basic information (email, name, and account details).',
              'We do not sell or leak your personal data.',
              'Your information is protected from our side under strict security standards.'
            ].map((item, idx) => (
              <div key={idx} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-green-500/10 ${isVisible.section4 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
                <span className="text-green-400 text-xl sm:text-2xl font-bold flex-shrink-0">🛡️</span>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/40 ${isVisible.section4 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
            <p className="text-base sm:text-lg text-yellow-100 leading-relaxed">
              <span className="font-bold">⚠️ However:</span> If you choose to share your personal details (like{' '}
              <span className="highlight-mark highlight-red font-semibold">phone number, UPI, or payment info</span>) directly with another user,{' '}
              <span className="highlight-mark highlight-red font-bold">you do so at your own risk</span>. We are{' '}
              <span className="highlight-mark highlight-red font-bold">not responsible</span> for what happens outside the platform once you share data voluntarily.
            </p>
          </div>
        </section>

        {/* Section 5 - No Liability (CRITICAL) */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-4 border-red-500/40 bg-gradient-to-br from-red-500/10 to-transparent" id="section5" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3 text-red-400 ${isVisible.section5 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-shake text-2xl sm:text-3xl flex-shrink-0">⚠️</span> 
            <span>5. No Liability for User-to-User Scams or Deals</span>
          </h3>
          
          <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-red-500/20 border-2 border-red-500/50 mb-4 sm:mb-6 ${isVisible.section5 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            <p className="text-lg sm:text-xl font-bold text-red-300 text-center mb-3 sm:mb-4">
              EDITCRAFT is <span className="highlight-mark highlight-red">only a connection platform</span>.
            </p>
            <p className="text-base sm:text-lg text-red-200 text-center">
              We <span className="highlight-mark highlight-red font-bold">do not control</span> the deals, payments, or collaborations made between users.
            </p>
          </div>
          
          <div className={`mb-4 sm:mb-6 ${isVisible.section5 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Therefore:</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-4 sm:p-5 rounded-xl bg-red-500/10 border-l-4 border-red-500">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  EDITCRAFT is <span className="highlight-mark highlight-red font-bold">not responsible</span> for any{' '}
                  <span className="highlight-mark highlight-red">scam, fraud, payment dispute, or misunderstanding</span> that occurs between two users.
                </p>
              </div>
              
              <div className="p-4 sm:p-5 rounded-xl bg-red-500/10 border-l-4 border-red-500">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  We <span className="highlight-mark highlight-red font-bold">do not charge any commission</span> or take responsibility for any money earned or lost between creators and editors.
                </p>
              </div>
              
              <div className="p-4 sm:p-5 rounded-xl bg-orange-500/10 border-l-4 border-orange-500">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  It is <span className="highlight-mark font-bold">your full responsibility</span> to verify the identity and credibility of the person you are working with.
                </p>
              </div>
            </div>
          </div>
          
          <div className={`mb-4 sm:mb-6 ${isVisible.section5 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            <h4 className="text-lg sm:text-xl font-bold text-yellow-300 mb-3 sm:mb-4">If a scam or dispute occurs:</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-4 sm:p-5 rounded-xl bg-yellow-500/10 border-l-4 border-yellow-500">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  EDITCRAFT may <span className="highlight-mark font-semibold">investigate and ban or suspend</span> the account responsible for fraudulent behavior to prevent further harm.
                </p>
              </div>
              
              <div className="p-4 sm:p-5 rounded-xl bg-red-500/10 border-l-4 border-red-500">
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  But EDITCRAFT is <span className="highlight-mark highlight-red font-bold">not liable to refund, compensate, or recover</span> any loss caused by user-to-user transactions.
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#ceea45]/20 to-transparent border-2 border-[#ceea45]/40 ${isVisible.section5 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
            <h4 className="text-xl sm:text-2xl font-bold text-[#ceea45] mb-4 text-center">In short:</h4>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl mb-2">👉</p>
                <p className="text-lg sm:text-xl font-bold text-white">We protect your data.</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl mb-2">👉</p>
                <p className="text-lg sm:text-xl font-bold text-white">You protect your deals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8" id="section6" data-animate>
          <h3 className={`text-2xl sm:text-3xl font-bold mb-4 flex items-center gap-2 sm:gap-3 ${isVisible.section6 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 6. Intellectual Property
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <p className={`text-base sm:text-lg text-gray-300 leading-relaxed ${isVisible.section6 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              You retain <span className="highlight-mark font-bold">full ownership</span> of the content you create or upload.
            </p>
            <p className={`text-base sm:text-lg text-gray-300 leading-relaxed ${isVisible.section6 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              By posting on EDITCRAFT, you grant us a non-exclusive, royalty-free license to display and promote your work within the platform.
            </p>
            <p className={`text-base sm:text-lg text-gray-300 leading-relaxed ${isVisible.section6 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
              Do not post content you do not own or have permission to use.
            </p>
          </div>
        </section>

        {/* Sections 7-8 Grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6" id="section7" data-animate>
            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isVisible.section7 ? 'animate-visible' : 'opacity-0'}`}>
              <span className="emoji-float text-xl sm:text-2xl">🔹</span> 7. Platform Access
            </h3>
            <p className={`text-sm sm:text-base text-gray-300 leading-relaxed ${isVisible.section7 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              We strive to keep EDITCRAFT online 24/7 but may occasionally perform maintenance or upgrades. We are not liable for downtime, data loss, or interruptions.
            </p>
          </div>
          
          <div className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6" id="section8" data-animate>
            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isVisible.section8 ? 'animate-visible' : 'opacity-0'}`}>
              <span className="emoji-float text-xl sm:text-2xl">🔹</span> 8. Account Termination
            </h3>
            <p className={`text-sm sm:text-base text-gray-300 leading-relaxed mb-3 ${isVisible.section8 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              EDITCRAFT reserves the right to suspend or delete any account that violates these Terms, engages in harmful or illegal activity, or participates in scams or harassment.
            </p>
            <p className={`text-sm sm:text-base text-gray-300 leading-relaxed ${isVisible.section8 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              You may request account deletion anytime by emailing <span className="text-[#ceea45] font-semibold">support@editcraft.co.in</span>
            </p>
          </div>
        </div>

        {/* Sections 9-10 - Disclaimers */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-2 border-yellow-500/30" id="section9" data-animate>
          <h3 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 ${isVisible.section9 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 9. Disclaimer of Warranties
          </h3>
          <p className={`text-base sm:text-lg text-gray-300 leading-relaxed mb-4 sm:mb-6 ${isVisible.section9 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            EDITCRAFT is provided <span className="highlight-mark font-bold">"as is"</span> without warranties of any kind. We make no promises about the outcomes of collaborations or the trustworthiness of other users.
          </p>
          <div className="space-y-3">
            {[
              'Your interactions are at your own discretion and risk.',
              'EDITCRAFT has no liability for user actions, deals, or disputes.'
            ].map((item, idx) => (
              <div key={idx} className={`flex items-start gap-3 sm:gap-4 ${isVisible.section9 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
                <span className="text-yellow-400 text-xl font-bold flex-shrink-0">⚠️</span>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-2 border-red-500/30" id="section10" data-animate>
          <h3 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 ${isVisible.section10 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 10. Limitation of Liability
          </h3>
          <p className={`text-lg sm:text-xl font-bold text-red-400 mb-4 sm:mb-6 ${isVisible.section10 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            EDITCRAFT and its team are not liable for:
          </p>
          
          <div className="space-y-3">
            {[
              'Financial losses between users.',
              'Misuse of information you voluntarily share.',
              'Any scam, dispute, or fraud between collaborators.',
              'Any indirect or consequential damages from using the platform.'
            ].map((item, idx) => (
              <div key={idx} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-red-500/10 ${isVisible.section10 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
                <span className="text-red-400 text-xl font-bold flex-shrink-0">❌</span>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#ceea45]/10 border-2 border-[#ceea45]/40 ${isVisible.section10 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
            <p className="text-lg sm:text-xl font-bold text-[#ceea45] text-center">
              Our role is to <span className="highlight-mark">connect</span>, not to <span className="highlight-mark highlight-red">mediate or manage</span> financial transactions.
            </p>
          </div>
        </section>

        {/* Sections 11-12 Grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6" id="section11" data-animate>
            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isVisible.section11 ? 'animate-visible' : 'opacity-0'}`}>
              <span className="emoji-float text-xl sm:text-2xl">🔹</span> 11. Changes to Terms
            </h3>
            <p className={`text-sm sm:text-base text-gray-300 leading-relaxed ${isVisible.section11 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              We may update these Terms occasionally. All updates will be posted here with a revised "Last Updated" date. Continued use after updates means you accept the new Terms.
            </p>
          </div>
          
          <div className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-6" id="section12" data-animate>
            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isVisible.section12 ? 'animate-visible' : 'opacity-0'}`}>
              <span className="emoji-float text-xl sm:text-2xl">🔹</span> 12. Governing Law
            </h3>
            <p className={`text-sm sm:text-base text-gray-300 leading-relaxed ${isVisible.section12 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              These Terms are governed by the <span className="highlight-mark font-bold">laws of India</span>, with all disputes subject to Indian jurisdiction.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-2 border-[#ceea45]/30" id="contact" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">🔹</span> 13. Contact Us
          </h3>
          <p className={`text-base sm:text-lg text-gray-300 leading-relaxed mb-4 sm:mb-6 ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            If you have any issues, questions, or need support, contact us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <a href="mailto:support@editcraft.co.in" className={`flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#ceea45]/10 border-2 border-[#ceea45]/30 hover:bg-[#ceea45]/20 hover:border-[#ceea45] transition-all text-base sm:text-xl font-bold ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <span className="text-xl sm:text-2xl">📧</span> <span className="break-all">support@editcraft.co.in</span>
            </a>
            <a href="https://www.editcraft.co.in" className={`flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#ceea45]/10 border-2 border-[#ceea45]/30 hover:bg-[#ceea45]/20 hover:border-[#ceea45] transition-all text-base sm:text-xl font-bold ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
              <span className="text-xl sm:text-2xl">🌐</span> www.editcraft.co.in
            </a>
          </div>
        </section>

        {/* Summary */}
        <section className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border-2 sm:border-4 border-[#ceea45]/40 bg-gradient-to-br from-[#ceea45]/10 to-transparent" id="summary" data-animate>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center flex items-center justify-center gap-2 sm:gap-3 ${isVisible.summary ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float text-2xl sm:text-3xl">⚡</span> Summary
          </h3>
          
          <div className={`text-center mb-6 sm:mb-8 ${isVisible.summary ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-relaxed mb-4">
              EDITCRAFT is a <span className="highlight-mark text-[#ceea45]">free creative connection platform</span>, not a middleman or payment processor.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-green-500/10 border-2 border-green-500/30 ${isVisible.summary ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl flex-shrink-0">✅</span>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-green-400 mb-2">We Do:</h4>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    <span className="highlight-mark font-semibold">Protect your personal data</span> on our side.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-red-500/10 border-2 border-red-500/30 ${isVisible.summary ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl emoji-shake flex-shrink-0">🚫</span>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-red-400 mb-2">We Don't:</h4>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    Take responsibility for <span className="highlight-mark highlight-red font-semibold">user-to-user scams or deals</span>.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/30 ${isVisible.summary ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl flex-shrink-0">💬</span>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">We Encourage:</h4>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    <span className="highlight-mark font-semibold">Verify who you work with</span> before starting any project.
                  </p>
                </div>
              </div>
            </div>
            
            <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-purple-500/10 border-2 border-purple-500/30 ${isVisible.summary ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl flex-shrink-0">💪</span>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-purple-400 mb-2">We Will:</h4>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    <span className="highlight-mark font-semibold">Ban scam accounts</span> to protect the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 sm:mt-16 text-gray-500">
          <p className="text-sm sm:text-base md:text-lg">© 2024 EditCraft. All rights reserved. Built with passion 💚</p>
        </footer>
      </div>
    </div>
  );
}