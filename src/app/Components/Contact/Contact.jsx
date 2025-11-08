import React, { useEffect, useRef, useState } from 'react';

const Contact = () => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div id='contact' className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden relative py-12 sm:py-16 md:py-20 px-4">
      
      <style>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

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
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes borderGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(206, 234, 69, 0.4), 0 0 40px rgba(206, 234, 69, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(206, 234, 69, 0.6), 0 0 60px rgba(206, 234, 69, 0.3);
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
          animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-right {
          animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .glitch-text {
          position: relative;
          animation: glitch 3s infinite;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 #ceea45;
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch 2s infinite linear alternate-reverse;
        }

        .glitch-text::after {
          left: -2px;
          text-shadow: -2px 0 #ceea45, 2px 2px #000;
          clip: rect(85px, 550px, 140px, 0);
          animation: glitch 2.5s infinite linear alternate-reverse;
        }

        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(transparent, rgba(206, 234, 69, 0.8), transparent);
          animation: scan 4s linear infinite;
          opacity: 0.3;
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

        .gaming-input {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(206, 234, 69, 0.3);
          color: white;
          transition: all 0.3s ease;
          border-radius: 16px;
        }

        .gaming-input:focus {
          outline: none;
          border-color: #ceea45;
          box-shadow: 0 0 20px rgba(206, 234, 69, 0.3);
          animation: borderGlow 2s ease-in-out infinite;
        }

        .gaming-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .gaming-button {
          background: linear-gradient(135deg, #ceea45 0%, #b8d93c 100%);
          color: black;
          font-weight: bold;
          border: none;
          border-radius: 16px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .gaming-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .gaming-button:hover::before {
          left: 100%;
        }

        .gaming-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(206, 234, 69, 0.4);
        }

        .gaming-button:active {
          transform: translateY(0);
        }

        .info-card {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(206, 234, 69, 0.2);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          overflow: hidden;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(206, 234, 69, 0.1), transparent);
          animation: shimmer 3s infinite;
        }

        .info-card:hover {
          transform: translateY(-8px);
          border-color: rgba(206, 234, 69, 0.5);
          box-shadow: 0 10px 40px rgba(206, 234, 69, 0.3);
        }

        @media (max-width: 640px) {
          .info-card:active {
            transform: translateY(-4px);
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
          top: -2px;
          left: -2px;
          border-right: none;
          border-bottom: none;
        }

        .corner-tr {
          top: -2px;
          right: -2px;
          border-left: none;
          border-bottom: none;
        }

        .corner-bl {
          bottom: -2px;
          left: -2px;
          border-right: none;
          border-top: none;
        }

        .corner-br {
          bottom: -2px;
          right: -2px;
          border-left: none;
          border-top: none;
        }

        .pulse-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        .social-button {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #ceea45 0%, #b8d93c 100%);
          transition: all 0.3s ease;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .social-button:hover {
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 8px 20px rgba(206, 234, 69, 0.4);
        }

        .social-button:active {
          transform: translateY(-2px) scale(1.05);
        }

        .animation-delay-2s { animation-delay: 2s; }
        .animation-delay-4s { animation-delay: 4s; }
        .animation-delay-6s { animation-delay: 6s; }
        .animation-delay-8s { animation-delay: 8s; }
      `}</style>

      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none"></div>
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2s"></div>
        <div className="absolute -bottom-8 left-20 sm:left-40 w-48 sm:w-72 h-48 sm:h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4s"></div>
      </div>

      {/* Scan Line Effect */}
      <div className="scan-line"></div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title Section */}
        <div 
          data-animate="title"
          className={`text-center mb-10 sm:mb-12 md:mb-16 ${isVisible('title') ? 'animate-fade-up' : 'opacity-0'}`}
        >
          <div className="inline-block relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 sm:mb-4 glitch-text" data-text="CONTACT">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#a3c933]">
                CONTACT
              </span>
            </h1>
            <div className="corner-accent corner-tl"></div>
            <div className="corner-accent corner-tr"></div>
            <div className="corner-accent corner-bl"></div>
            <div className="corner-accent corner-br"></div>
          </div>
          <p className="text-white text-base sm:text-lg md:text-xl mt-4 font-mono">
            {'>'} INITIATE_CONNECTION.exe
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Contact Form */}
          <div 
            data-animate="form"
            className={`${isVisible('form') ? 'animate-slide-left' : 'opacity-0'}`}
          >
            <div className="relative p-5 sm:p-6 md:p-8 bg-black/50 backdrop-blur-sm border-2 border-[#ceea45]/30 rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ceea45] to-transparent"></div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 text-white font-mono">
                {'<'} SEND_MESSAGE {'>'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                <div>
                  <label className="block text-white mb-2 font-mono text-xs sm:text-sm">
                    {'>'} USERNAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="gaming-input w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                    placeholder="Enter your name..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-mono text-xs sm:text-sm">
                    {'>'} EMAIL_ADDRESS
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="gaming-input w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-mono text-xs sm:text-sm">
                    {'>'} SUBJECT
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="gaming-input w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-mono text-xs sm:text-sm">
                    {'>'} MESSAGE_DATA
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="gaming-input w-full px-3 sm:px-4 py-2 sm:py-3 resize-none text-sm sm:text-base"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="gaming-button w-full py-3 sm:py-4 text-base sm:text-lg font-mono font-bold"
                >
                  [ TRANSMIT DATA ]
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info Cards */}
          <div 
            data-animate="info"
            className={`space-y-4 sm:space-y-5 md:space-y-6 ${isVisible('info') ? 'animate-slide-right' : 'opacity-0'}`}
          >
            {/* Email Card */}
            <div className="info-card p-4 sm:p-5 md:p-6 relative">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#ceea45] to-[#b8d93c] rounded-xl flex items-center justify-center relative flex-shrink-0">
                  <div className="pulse-dot absolute top-0 right-0 w-2 sm:w-3 h-2 sm:h-3 bg-[#ceea45] rounded-full"></div>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-mono text-xs sm:text-sm mb-1">{'>'} EMAIL_PROTOCOL</h3>
                  <p className="text-white text-sm sm:text-base md:text-lg font-semibold truncate">contact@editcraft.studio</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Response time: 24-48 hours</p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="info-card p-4 sm:p-5 md:p-6 relative">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center relative flex-shrink-0">
                  <div className="pulse-dot absolute top-0 right-0 w-2 sm:w-3 h-2 sm:h-3 bg-purple-300 rounded-full"></div>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-mono text-xs sm:text-sm mb-1">{'>'} VOICE_CHANNEL</h3>
                  <p className="text-white text-sm sm:text-base md:text-lg font-semibold">+1 (555) 123-4567</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">Available: Mon-Fri 9AM-6PM</p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="info-card p-4 sm:p-5 md:p-6 relative">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center relative flex-shrink-0">
                  <div className="pulse-dot absolute top-0 right-0 w-2 sm:w-3 h-2 sm:h-3 bg-cyan-300 rounded-full"></div>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-mono text-xs sm:text-sm mb-1">{'>'} COORDINATES</h3>
                  <p className="text-white text-sm sm:text-base md:text-lg font-semibold">EditCraft Studio HQ</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">123 Creative Street, Tech City</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="info-card p-4 sm:p-5 md:p-6 relative">
              <h3 className="text-white font-mono text-xs sm:text-sm mb-3 sm:mb-4">{'>'} SOCIAL_NETWORKS</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button className="social-button">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="social-button">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="social-button">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </button>
                <button className="social-button">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Status Bar */}
        <div 
          data-animate="status"
          className={`mt-10 sm:mt-12 md:mt-16 border-2 border-[#ceea45]/30 bg-black/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl font-mono text-xs sm:text-sm ${
            isVisible('status') ? 'animate-fade-up' : 'opacity-0'
          }`}
        >
          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-[#ceea45] rounded-full pulse-dot"></div>
              <span className="text-white font-semibold">STATUS: ONLINE</span>
            </div>
            <div className="text-gray-400">
              PING: <span className="text-[#ceea45] font-semibold">23ms</span>
            </div>
            <div className="text-gray-400">
              SERVER: <span className="text-[#ceea45] font-semibold">US-EAST-01</span>
            </div>
            <div className="text-gray-400">
              UPTIME: <span className="text-[#ceea45] font-semibold">99.9%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;