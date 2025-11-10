import React, { useEffect, useRef, useState } from 'react';
import { useCreatenewSltelarMutation } from '@/app/Store/apiSclice/NewSatelar.ApiSlice';

const Footer = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
  const observerRef = useRef(null);

  const [createNewSatelar, { isLoading, isError, isSuccess, error }] = useCreatenewSltelarMutation();

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

  const facebookLink = 'https://www.facebook.com/profile.php?id=61583612515861';
  const instagramLink = 'https://www.instagram.com/corp.znex';
  const linkedinLink = 'https://www.linkedin.com/in/edit-craft-477468398';
  const twitterLink = 'https://x.com/EDITCRAFT161240';

const handleFacebookLink = () => window.open(facebookLink, '_blank', 'noopener,noreferrer');
const handleInstagramLink = () => window.open(instagramLink, '_blank', 'noopener,noreferrer');
const handleLinkedinLink = () => window.open(linkedinLink, '_blank', 'noopener,noreferrer');
const handleTwitterLink = () => window.open(twitterLink, '_blank', 'noopener,noreferrer');


  const handleSubscribe = async (e) => {
  e.preventDefault();
  setSuccessMessage('');
  setErrorMessage('');
  
  try {
    const response = await createNewSatelar({ email }).unwrap();
    setSuccessMessage('✓ Subscribed successfully! Check your email.');
    setEmail('');
    setTimeout(() => setSuccessMessage(''), 5000);
  } catch (error) {
    setErrorMessage('✗ Failed to subscribe. Please try again.');
    setTimeout(() => setErrorMessage(''), 5000);
  }
};


// Success Message Card Component
const SuccessCard = ({ message }) => (
  <div className="mb-4 p-4 rounded-xl border-2 border-green-500/50 bg-gradient-to-r from-green-500/10 to-green-500/5 backdrop-blur-sm animate-fade-up">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="text-green-400 font-semibold text-sm">{message}</p>
      </div>
    </div>
  </div>
);

// Error Message Card Component
const ErrorCard = ({ message }) => (
  <div className="mb-4 p-4 rounded-xl border-2 border-red-500/50 bg-gradient-to-r from-red-500/10 to-red-500/5 backdrop-blur-sm animate-fade-up">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="text-red-400 font-semibold text-sm">{message}</p>
      </div>
    </div>
  </div>
);



 const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="w-full mt-20 sm:mt-32 md:mt-40 mb-6 sm:mb-8 md:mb-10 px-4 text-white overflow-hidden relative">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(206, 234, 69, 0.5), 0 0 10px rgba(206, 234, 69, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(206, 234, 69, 0.8), 0 0 30px rgba(206, 234, 69, 0.4);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-fade-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-left {
          animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-right {
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-scale {
          animation: scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .footer-link {
          position: relative;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ceea45, #b8d93c);
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .footer-link:hover {
          color: #ceea45;
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .footer-link:active::after {
            width: 100%;
          }
          .footer-link:active {
            color: #ceea45;
          }
        }

        .social-icon {
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          overflow: hidden;
        }

        .social-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(206, 234, 69, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .social-icon:hover::before {
          left: 100%;
        }

        .social-icon:hover {
          transform: scale(1.1) translateY(-4px);
          border-color: #ceea45;
          background: rgba(206, 234, 69, 0.1);
          box-shadow: 0 8px 20px rgba(206, 234, 69, 0.3);
        }

        @media (max-width: 640px) {
          .social-icon:active {
            transform: scale(1.05) translateY(-2px);
            border-color: #ceea45;
          }
        }

        .newsletter-input {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(206, 234, 69, 0.2);
          transition: all 0.3s ease;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #ceea45;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 20px rgba(206, 234, 69, 0.3);
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .newsletter-button {
          background: linear-gradient(135deg, #ceea45 0%, #b8d93c 100%);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .newsletter-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .newsletter-button:hover::before {
          left: 100%;
        }

        .newsletter-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(206, 234, 69, 0.5);
        }

        .newsletter-button:active {
          transform: translateY(0);
        }

        .footer-divider {
          background: linear-gradient(90deg, transparent, #ceea45, transparent);
          height: 1px;
          animation: pulse 3s ease-in-out infinite;
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

        .corner-accent {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(206, 234, 69, 0.5);
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .corner-accent {
            width: 30px;
            height: 30px;
          }
        }

        .corner-tl {
          top: 10px;
          left: 10px;
          border-right: none;
          border-bottom: none;
        }

        .corner-tr {
          top: 10px;
          right: 10px;
          border-left: none;
          border-bottom: none;
        }

        .corner-bl {
          bottom: 10px;
          left: 10px;
          border-right: none;
          border-top: none;
        }

        .corner-br {
          bottom: 10px;
          right: 10px;
          border-left: none;
          border-top: none;
        }

        .animation-delay-2s { animation-delay: 2s; }
        .animation-delay-4s { animation-delay: 4s; }
      `}</style>

      {/* Main Footer Container */}
      <div 
        data-animate="footer"
        className={`border-2 border-[#ceea45]/30 rounded-3xl bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-xl relative overflow-hidden ${
          isVisible('footer') ? 'animate-fade-up' : 'opacity-0'
        }`}
      >
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none"></div>

        {/* Decorative Background Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#ceea45]/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-2s"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-pink-400/10 rounded-full blur-3xl animate-blob animation-delay-4s"></div>

        {/* Corner Accents */}
        <div className="corner-accent corner-tl"></div>
        <div className="corner-accent corner-tr"></div>
        <div className="corner-accent corner-bl"></div>
        <div className="corner-accent corner-br"></div>

        {/* Footer Content */}
        <div className="relative z-10 p-5 sm:p-6 md:p-8 lg:p-12">
          
          {/* Top Section - Logo & Tagline */}
          <div 
            data-animate="brand"
            className={`text-center mb-8 sm:mb-10 md:mb-12 ${isVisible('brand') ? 'animate-scale' : 'opacity-0'}`}
          >
            <div className="inline-block relative float-animation">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#a3c933] bg-clip-text text-transparent">
                  EDITCRAFT
                </span>
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
                Creating stunning digital experiences with cutting-edge technology and creative excellence.
              </p>
            </div>
          </div>

          {/* Middle Section - Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            
            {/* Company Social Links */}
            <div 
              data-animate="social"
              className={`${isVisible('social') ? 'animate-slide-left' : 'opacity-0'}`}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#ceea45]">Connect With Us</h3>
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                <a onClick={handleFacebookLink} href="#" className="social-icon w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a onClick={handleTwitterLink} href="#" className="social-icon w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a onClick={handleInstagramLink} href="#" className="social-icon w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a onClick={handleLinkedinLink} href="#" className="social-icon w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div 
              data-animate="links1"
              className={`${isVisible('links1') ? 'animate-scale' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#ceea45]">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#hero" className="footer-link text-gray-400 text-sm sm:text-base">Home</a></li>
                <li><a href="#service" className="footer-link text-gray-400 text-sm sm:text-base">Services</a></li>
                <li><a href="#webflow" className="footer-link text-gray-400 text-sm sm:text-base">webflow</a></li>
                <li><a href="#contact" className="footer-link text-gray-400 text-sm sm:text-base">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div 
              data-animate="links2"
              className={`${isVisible('links2') ? 'animate-scale' : 'opacity-0'}`}
              style={{ animationDelay: '0.4s' }}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#ceea45]">Services</h3>
              <ul className="space-y-2">
                <li><a href="#service" className="footer-link text-gray-400 text-sm sm:text-base">Video Editing</a></li>
                <li><a href="#service" className="footer-link text-gray-400 text-sm sm:text-base">Thumbnail Design</a></li>
                <li><a href="#service" className="footer-link text-gray-400 text-sm sm:text-base">Script Writing</a></li>
                <li><a href="#service" className="footer-link text-gray-400 text-sm sm:text-base">Content Creation</a></li>
              </ul>
            </div>

   {/* Newsletter */}
<div 
  data-animate="newsletter"
  className={`${isVisible('newsletter') ? 'animate-slide-right' : 'opacity-0'}`}
>
  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#ceea45]">Newsletter</h3>
  
  {/* Display Messages */}
  {successMessage && <SuccessCard message={successMessage} />}
  {errorMessage && <ErrorCard message={errorMessage} />}
  
  <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
    <input
      type="email"
      value={email}
      onChange={handleChange}
      placeholder="Enter your email"
      required
      className="newsletter-input px-3 sm:px-4 py-2 rounded-full text-white text-sm sm:text-base"
    />
    <button
      type="submit"
      className="newsletter-button px-4 sm:px-6 py-2 rounded-full text-black font-semibold text-sm sm:text-base"
      disabled={isLoading}
    >
      {isLoading ? 'Subscribing...' : 'Subscribe'}
    </button>
  </form>
</div>

          </div>

          {/* Divider */}
          <div className="footer-divider my-6 sm:my-8"></div>

          {/* Bottom Section */}
          <div 
            data-animate="bottom"
            className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${
              isVisible('bottom') ? 'animate-fade-up' : 'opacity-0'
            }`}
          >
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2025 <span className="text-[#ceea45] font-semibold">EDITCRAFT</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a href="Pages/services/privacy-policy" className="footer-link text-gray-400">Privacy Policy</a>
              <a href="Pages/services/terms-of-service" className="footer-link text-gray-400">Terms of Service</a>
              <a href="Pages/services/cookie-policy" className="footer-link text-gray-400">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;