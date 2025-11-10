'use client';
import React, { useState, useEffect } from 'react';

export default function PrivacyPolicy() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
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
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes highlightSweep {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.3;
          mix-blend-mode: screen;
          pointer-events: none;
          will-change: transform;
        }
        .blob1 {
          width: 400px;
          height: 400px;
          background: rgba(206, 234, 69, 0.4);
          top: 10%;
          left: 10%;
          animation: blob1 10s ease-in-out infinite;
        }
        .blob2 {
          width: 500px;
          height: 500px;
          background: rgba(147, 51, 234, 0.3);
          top: 40%;
          right: 10%;
          animation: blob2 12s ease-in-out infinite;
        }
        .blob3 {
          width: 450px;
          height: 450px;
          background: rgba(236, 72, 153, 0.3);
          bottom: 10%;
          left: 30%;
          animation: blob3 14s ease-in-out infinite;
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
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-card:hover {
          border-color: rgba(206, 234, 69, 0.5);
          box-shadow: 0 20px 60px rgba(206, 234, 69, 0.2);
          transform: translateY(-4px);
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-visible {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .emoji-float {
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Animated Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>
      <div className="grid-bg"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-16" id="header" data-animate>
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card mb-6 ${isVisible.header ? 'animate-visible' : 'opacity-0'}`}>
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-bold tracking-wider uppercase">Legal Document</span>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-black mb-4 gradient-text ${isVisible.header ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            🧾 EDITCRAFT
          </h1>
          
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-300 mb-6 ${isVisible.header ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            Privacy Policy
          </h2>
          
          <p className={`text-lg text-gray-400 ${isVisible.header ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
            Last Updated: <span className="text-[#ceea45] font-semibold">November 11, 2025</span>
          </p>
        </header>

        {/* Introduction */}
        <section className="glass-card rounded-3xl p-8 md:p-12 mb-8" id="intro" data-animate>
          <p className={`text-xl md:text-2xl leading-relaxed text-gray-300 ${isVisible.intro ? 'animate-visible' : 'opacity-0'}`}>
            Welcome to <span className="highlight-mark font-bold text-white">EDITCRAFT</span>, a platform built to connect{' '}
            <span className="highlight-mark font-bold text-white">Content Creators and Editors</span> so they can collaborate, grow, and create amazing projects together —{' '}
            <span className="highlight-mark font-bold text-[#ceea45]">absolutely free</span>.
          </p>
          <p className={`text-lg md:text-xl leading-relaxed text-gray-400 mt-6 ${isVisible.intro ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
          </p>
        </section>

        {/* Section 1 */}
        <section className="glass-card rounded-3xl p-8 md:p-12 mb-8" id="section1" data-animate>
          <h3 className={`text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3 ${isVisible.section1 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float">🔹</span> 1. Information We Collect
          </h3>
          <p className={`text-lg leading-relaxed text-gray-300 mb-6 ${isVisible.section1 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            We collect <span className="highlight-mark font-semibold">minimal data</span> necessary to make EDITCRAFT work smoothly:
          </p>
          
          <div className="space-y-4">
            {[
              { title: 'Basic Information', content: 'Name, email, and profile details you voluntarily share when you register or communicate on the platform.' },
              { title: 'Usage Data', content: 'Technical information like IP address, browser type, device information, and actions performed on our site to improve performance and user experience.' },
              { title: 'Communication Data', content: 'Messages, posts, or shared content between creators and editors within the platform (stored securely).' }
            ].map((item, idx) => (
              <div key={idx} className={`p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ceea45]/30 transition-all ${isVisible.section1 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
                <h4 className="text-xl font-bold text-[#ceea45] mb-2">• {item.title}:</h4>
                <p className="text-gray-300 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
          
          <p className={`text-lg leading-relaxed text-gray-400 mt-6 italic ${isVisible.section1 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
            We do not collect sensitive personal data like financial information, ID numbers, or biometric data.
          </p>
        </section>

        {/* Section 2 */}
        <section className="glass-card rounded-3xl p-8 md:p-12 mb-8" id="section2" data-animate>
          <h3 className={`text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3 ${isVisible.section2 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float">🔹</span> 2. How We Use Your Information
          </h3>
          
          <div className="space-y-4">
            {[
              'Help creators and editors discover and connect with each other.',
              'Improve platform performance and security.',
              'Send important updates, notifications, or feature announcements (only if you agree).',
              'Maintain a safe, respectful, and productive community environment.'
            ].map((item, idx) => (
              <div key={idx} className={`flex items-start gap-4 ${isVisible.section2 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: `${0.1 + idx * 0.1}s`}}>
                <span className="text-[#ceea45] text-2xl font-bold mt-1">✓</span>
                <p className="text-lg text-gray-300 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          
          <div className={`mt-8 p-6 rounded-2xl bg-[#ceea45]/10 border-2 border-[#ceea45]/30 ${isVisible.section2 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
            <p className="text-xl font-bold text-[#ceea45] text-center">
              We <span className="highlight-mark">never sell, rent, or trade</span> your personal data with third parties.
            </p>
          </div>
        </section>

        {/* Section 3 - Community Rules */}
        <section className="glass-card rounded-3xl p-8 md:p-12 mb-8 border-2 border-[#ceea45]/20" id="section3" data-animate>
          <h3 className={`text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3 ${isVisible.section3 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float">🔹</span> 3. Community Rules & Conduct
          </h3>
          <p className={`text-lg leading-relaxed text-gray-300 mb-8 ${isVisible.section3 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            To maintain a <span className="highlight-mark font-semibold">healthy ecosystem</span>, all users must follow these essential guidelines:
          </p>
          
          <div className="space-y-4">
            {[
              { icon: '🚫', title: 'No Adultery or Explicit Content', content: 'EDITCRAFT strictly prohibits any form of adult, obscene, or sexually explicit material.' },
              { icon: '🚫', title: 'No Scamming or Fraud', content: 'Users must not engage in misleading, deceptive, or fraudulent activity.' },
              { icon: '🚫', title: 'No Double Sharing', content: "Avoid reposting or reselling other users' work without their consent." },
              { icon: '🤝', title: 'Respect Collaboration', content: 'Always credit and respect your collaborators.' },
              { icon: '🛡️', title: 'Maintain Professional Behavior', content: 'Be polite, honest, and professional in all communications.' }
            ].map((rule, idx) => (
              <div key={idx} className={`p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-[#ceea45] hover:from-red-500/20 transition-all ${isVisible.section3 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: `${0.2 + idx * 0.1}s`}}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{rule.icon}</span>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{rule.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{rule.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-8 p-6 rounded-2xl bg-red-500/10 border-2 border-red-500/30 ${isVisible.section3 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.7s'}}>
            <p className="text-lg font-semibold text-red-400 text-center">
              ⚠️ Violation of these terms may result in account suspension or permanent removal from the platform.
            </p>
          </div>
        </section>

        {/* Sections 4-8 (Compact) */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[
            { id: 'section4', emoji: '🔹', title: '4. Cookies', content: 'EDITCRAFT may use cookies to enhance your experience, such as remembering login sessions, saving preferences, and improving functionality. You can disable cookies through browser settings.' },
            { id: 'section5', emoji: '🔹', title: '5. Third-Party Services', content: 'We may use third-party tools (analytics, social media plugins) that collect standard usage data. EDITCRAFT is not responsible for external websites or services.' },
            { id: 'section6', emoji: '🔹', title: '6. Data Security', content: 'We use industry-standard security measures to protect your information. Your trust means everything to us — and we take that responsibility seriously.' },
            { id: 'section7', emoji: '🔹', title: '7. Your Rights', content: 'You can request access to, correction of, or deletion of your personal data. Contact us at support@editcraft.co.in to exercise these rights.' }
          ].map((section, idx) => (
            <div key={section.id} className={`glass-card rounded-2xl p-6 ${isVisible[section.id] ? 'animate-visible' : 'opacity-0'}`} id={section.id} data-animate style={{animationDelay: `${idx * 0.1}s`}}>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="emoji-float">{section.emoji}</span> {section.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Sections 8-9 */}
        <section className="glass-card rounded-3xl p-8 md:p-12 mb-8" id="section8" data-animate>
          <h3 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${isVisible.section8 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float">🔹</span> 8. Children's Privacy
          </h3>
          <p className={`text-lg text-gray-300 leading-relaxed ${isVisible.section8 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            EDITCRAFT is <span className="highlight-mark font-semibold">not intended for users under 13 years of age</span>. If you are under 13, please do not register or share any personal data.
          </p>
        </section>

        <section className="glass-card rounded-3xl p-8 md:p-12 mb-8" id="section9" data-animate>
          <h3 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${isVisible.section9 ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float">🔹</span> 9. Changes to This Policy
          </h3>
          <p className={`text-lg text-gray-300 leading-relaxed ${isVisible.section9 ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            We may update this Privacy Policy from time to time. All updates will be posted here with a revised "Last Updated" date.
          </p>
        </section>

        {/* Contact Section */}
        <section className="glass-card rounded-3xl p-8 md:p-12 mb-8 border-2 border-[#ceea45]/30" id="contact" data-animate>
          <h3 className={`text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3 ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float">🔹</span> 10. Contact Us
          </h3>
          <p className={`text-lg text-gray-300 leading-relaxed mb-6 ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            If you have any questions, suggestions, or privacy concerns, feel free to contact:
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a href="mailto:support@editcraft.co.in" className={`flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#ceea45]/10 border-2 border-[#ceea45]/30 hover:bg-[#ceea45]/20 hover:border-[#ceea45] transition-all text-xl font-bold ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <span className="text-2xl">📧</span> support@editcraft.co.in
            </a>
            <a href="https://editcraft.co.in" className={`flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#ceea45]/10 border-2 border-[#ceea45]/30 hover:bg-[#ceea45]/20 hover:border-[#ceea45] transition-all text-xl font-bold ${isVisible.contact ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
              <span className="text-2xl">🌐</span> editcraft.co.in
            </a>
          </div>
        </section>

        {/* Summary */}
        <section className="glass-card rounded-3xl p-8 md:p-12 border-2 border-[#ceea45]/40 bg-gradient-to-br from-[#ceea45]/5 to-transparent" id="summary" data-animate>
          <h3 className={`text-3xl md:text-4xl font-bold mb-6 text-center flex items-center justify-center gap-3 ${isVisible.summary ? 'animate-visible' : 'opacity-0'}`}>
            <span className="emoji-float">⚡</span> Summary
          </h3>
          <p className={`text-xl md:text-2xl leading-relaxed text-gray-200 text-center ${isVisible.summary ? 'animate-visible' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            EDITCRAFT is a <span className="highlight-mark font-bold text-white">free, safe, and creative collaboration platform</span> — designed to help creators and editors grow together with{' '}
            <span className="highlight-mark font-bold text-[#ceea45]">respect and trust</span>. We don't sell your data, and we strictly maintain a{' '}
            <span className="highlight-mark font-bold text-white">no-adultery, no-scam, and no-double-sharing policy</span> to ensure a positive, professional environment for everyone.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500">
          <p className="text-lg">© 2024 EditCraft. All rights reserved. Built with passion 💚</p>
        </footer>
      </div>
    </div>
  );
}