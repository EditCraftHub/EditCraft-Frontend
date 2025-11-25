import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Flame } from 'lucide-react';
import { logo } from '../Assets/images/Images';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleClose = () => setOpenMenu(false);
  const router = useRouter();

  const startBtn = () => {
    router.push('/Pages/Main/home');
    handleClose();
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && openMenu) {
        setOpenMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [openMenu]);

  return (
    <div className='overflow-x-hidden text-white overflow-y-hidden relative'>
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
            transform: translateY(-8px);
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(206, 234, 69, 0.3), 0 0 40px rgba(206, 234, 69, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(206, 234, 69, 0.5), 0 0 60px rgba(206, 234, 69, 0.2);
          }
        }

        @keyframes fireGlow {
          0% {
            box-shadow: 0 0 10px rgba(206, 234, 69, 0.4), 0 0 20px rgba(255, 100, 0, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(206, 234, 69, 0.8), 0 0 40px rgba(255, 100, 0, 0.5), 0 0 60px rgba(255, 50, 0, 0.3);
          }
          100% {
            box-shadow: 0 0 10px rgba(206, 234, 69, 0.4), 0 0 20px rgba(255, 100, 0, 0.2);
          }
        }

        @keyframes fireFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes portfolioGlow {
          0%, 100% {
            background: linear-gradient(135deg, rgba(206, 234, 69, 0.1), rgba(206, 234, 69, 0.05));
            box-shadow: inset 0 0 20px rgba(206, 234, 69, 0.1), 0 0 15px rgba(206, 234, 69, 0.3);
          }
          50% {
            background: linear-gradient(135deg, rgba(206, 234, 69, 0.2), rgba(206, 234, 69, 0.1));
            box-shadow: inset 0 0 30px rgba(206, 234, 69, 0.2), 0 0 25px rgba(206, 234, 69, 0.5);
          }
        }

        @keyframes underlineExpand {
          from {
            width: 0;
            left: 0;
          }
          to {
            width: 100%;
            left: 0;
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-fade-down {
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-pulse-glow {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-fire-glow {
          animation: fireGlow 2s ease-in-out infinite;
        }

        .animate-fire-flicker {
          animation: fireFlicker 0.3s ease-in-out infinite;
        }

        .animate-portfolio-glow {
          animation: portfolioGlow 3s ease-in-out infinite;
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }

        .nav-link {
          position: relative;
          transition: all 0.3s ease;
          padding: 8px 4px;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ceea45, #b8d93c);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link:hover {
          color: #ceea45;
          transform: translateY(-2px);
        }

        /* Portfolio link with fire effect */
        .portfolio-link {
          position: relative;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .portfolio-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(206, 234, 69, 0.15), rgba(255, 100, 0, 0.1));
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .portfolio-link:hover::before {
          opacity: 1;
        }

        .portfolio-link:hover {
          color: #ceea45;
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(206, 234, 69, 0.4), 0 0 25px rgba(255, 100, 0, 0.2);
        }

        .portfolio-link.active {
          background: linear-gradient(135deg, rgba(206, 234, 69, 0.15), rgba(255, 100, 0, 0.1));
          box-shadow: 0 0 20px rgba(206, 234, 69, 0.5), 0 0 30px rgba(255, 100, 0, 0.3);
        }

        @media (max-width: 768px) {
          .nav-link:active {
            color: #ceea45;
          }

          .portfolio-link:active {
            color: #ceea45;
            box-shadow: 0 0 15px rgba(206, 234, 69, 0.4);
          }
        }

        .get-started-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .get-started-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .get-started-btn:hover::before {
          left: 100%;
        }

        .get-started-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(206, 234, 69, 0.4), 0 0 15px rgba(255, 100, 0, 0.2);
        }

        .get-started-btn:active {
          transform: scale(0.98);
        }

        .mobile-menu-bg {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(10, 10, 10, 0.98) 50%, rgba(20, 10, 0, 0.95) 100%);
          backdrop-filter: blur(20px);
        }

        .hamburger-icon {
          transition: all 0.3s ease;
        }

        .hamburger-icon:hover {
          transform: scale(1.1);
          color: #ceea45;
          box-shadow: 0 0 15px rgba(206, 234, 69, 0.3);
        }

        .hamburger-icon:active {
          transform: scale(0.95);
        }

        .logo-container {
          position: relative;
        }

        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(206, 234, 69, 0.2) 0%, transparent 70%);
          animation: glow 3s ease-in-out infinite;
          pointer-events: none;
        }

        /* Navbar border glow */
        .navbar-border-glow {
          position: relative;
        }

        .navbar-border-glow::after {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(90deg, #ceea45, transparent, #ceea45);
          border-radius: 9999px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        /* Flame icon animation */
        .flame-icon {
          display: inline-block;
          animation: fireFlicker 0.3s ease-in-out infinite;
        }

        /* Mobile portfolio link */
        @media (max-width: 768px) {
          .portfolio-link {
            padding: 12px 16px;
            margin-left: -16px;
            width: calc(100% + 32px);
          }
        }
      `}</style>

      {/* Navbar - Sticky with animation */}
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 pt-4 sm:pt-6 md:pt-8 flex items-start justify-center z-50 transition-all duration-300 animate-fade-down ${
          isScrolled ? 'backdrop-blur-xl bg-black/30' : ''
        }`}
      >
        <div className='flex items-center justify-center w-full px-3 sm:px-4'>
          <div className={`flex justify-between items-center h-[60px] sm:h-[65px] md:h-[70px] rounded-full bg-gradient-to-r from-black via-gray-900 to-black border-2 text-white w-full max-w-[93vw] px-3 sm:px-4 md:px-6 navbar-border-glow transition-all duration-300 ${
            isScrolled 
              ? 'shadow-2xl shadow-[#ceea45]/20 border-[#ceea45] animate-pulse-glow' 
              : 'border-white/30 hover:border-white/50'
          }`}>
            
            {/* Logo with animation */}
            <div ref={logoRef} className='cursor-pointer logo-container animate-scale-in'>
              <Image
                src={logo}
                alt='Logo'
                width={90}
                height={40}
                className='animate-fade-in hover:drop-shadow-lg transition-all'
              />
            </div>

            {/* Desktop Menu */}
            <ul className='hidden md:flex gap-6 lg:gap-10 items-center'>
              <a
                href='#hero'
                className='nav-link text-sm lg:text-base font-medium hover:text-[#ceea45] transition-colors'
              >
                Home
              </a>
              
              <a
                href='#service'
                className='nav-link text-sm lg:text-base font-medium hover:text-[#ceea45] transition-colors'
              >
                Service
              </a>
              
              <a
                href='#webflow'
                className='nav-link text-sm lg:text-base font-medium hover:text-[#ceea45] transition-colors'
              >
                Webflow
              </a>
              
              <a
                href='#contact'
                className='nav-link text-sm lg:text-base font-medium hover:text-[#ceea45] transition-colors'
              >
                Contact
              </a>

              {/* Portfolio Link with Fire Glow */}
              <Link 
                href={'/Pages/Features/portfolios'}
                className={`portfolio-link text-sm lg:text-base font-medium flex items-center gap-2 ${
                  hoveredLink === 'portfolio' ? 'animate-fire-glow' : ''
                }`}
                onMouseEnter={() => setHoveredLink('portfolio')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span>Portfolios</span>
                <Flame 
                  size={16} 
                  className={`${hoveredLink === 'portfolio' ? 'animate-fire-flicker text-[#ff6400]' : 'text-[#ceea45]'} transition-colors`}
                />
              </Link>
            </ul>

            {/* Desktop Button */}
            <button 
              className='hidden md:flex items-center justify-center h-[45px] lg:h-[50px] px-5 lg:px-6 rounded-full bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-semibold text-sm lg:text-base get-started-btn animate-scale-in hover:shadow-lg'
              style={{ animationDelay: '0.3s' }}
              onClick={startBtn}
            >
              Get Started
            </button>

            {/* Hamburger (Mobile) */}
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className='md:hidden flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full cursor-pointer border-2 border-white/30 hamburger-icon hover:border-[#ceea45]'
            >
              {openMenu ? (
                <X size={24} className="sm:w-7 sm:h-7" />
              ) : (
                <Menu size={24} className="sm:w-7 sm:h-7" />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content jump */}
      <div className='h-[76px] sm:h-[89px] md:h-[106px]'></div>

      {/* Mobile Menu - Enhanced with fire effects */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-screen w-[75vw] sm:w-[65vw] mobile-menu-bg text-white flex flex-col items-start pt-24 sm:pt-28 md:pt-32 pl-6 sm:pl-8 space-y-6 sm:space-y-8 z-40 border-r-2 border-[#ceea45]/30 transition-transform duration-500 ${
          openMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Decorative glow effect */}
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ceea45]/5 via-transparent to-orange-500/5 pointer-events-none'></div>

        {/* Animated floating elements in mobile menu */}
        <div className='absolute bottom-20 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-[#ceea45]/15 rounded-full blur-2xl animate-pulse-glow'></div>
        <div className='absolute top-40 right-5 w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/15 rounded-full blur-xl animate-pulse-glow' style={{ animationDelay: '1s' }}></div>
        <div className='absolute bottom-40 left-10 w-14 h-14 bg-[#ceea45]/10 rounded-full blur-2xl animate-pulse-glow' style={{ animationDelay: '0.5s' }}></div>

        <a
          href='#hero'
          onClick={handleClose}
          className='text-lg sm:text-xl font-semibold transition-all hover:scale-110 duration-500 hover:text-[#ceea45] hover:translate-x-2 relative z-10'
        >
          Home
        </a>
        
        <a
          href='#service'
          onClick={handleClose}
          className='text-lg sm:text-xl font-semibold transition-all hover:scale-110 duration-500 hover:text-[#ceea45] hover:translate-x-2 relative z-10'
        >
          Service
        </a>
        
        <a
          href='#webflow'
          onClick={handleClose}
          className='text-lg sm:text-xl font-semibold transition-all hover:scale-110 duration-500 hover:text-[#ceea45] hover:translate-x-2 relative z-10'
        >
          Webflow
        </a>
        
        <a
          href='#contact'
          onClick={handleClose}
          className='text-lg sm:text-xl font-semibold transition-all hover:scale-110 duration-500 hover:text-[#ceea45] hover:translate-x-2 relative z-10'
        >
          Contact
        </a>

        {/* Mobile Portfolio Link with Fire Glow */}
        <Link
          href={'/Pages/Features/portfolios'}
          onClick={handleClose}
          className='portfolio-link text-lg sm:text-xl font-semibold transition-all hover:scale-110 duration-500 hover:text-[#ceea45] hover:translate-x-2 relative z-10 flex items-center gap-2 animate-portfolio-glow'
        >
          <span>Portfolios</span>
          <Flame size={18} className='text-[#ff6400] animate-fire-flicker' />
        </Link>

        <div className='flex items-center justify-center relative z-10 mt-4'>
          <button
            onClick={startBtn}
            className='flex items-center justify-center h-[42px] sm:h-[45px] px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-semibold text-sm sm:text-base get-started-btn hover:shadow-lg'
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Background Overlay (when menu is open) */}
      {openMenu && (
        <div
          onClick={handleClose}
          className='fixed inset-0 bg-black/70 z-30 backdrop-blur-md transition-opacity duration-500 md:hidden'
        ></div>
      )}
    </div>
  );
};

export default Navbar;