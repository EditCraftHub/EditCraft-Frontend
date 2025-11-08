import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { logo } from '../Assets/images/Images';
import Image from 'next/image';
import { useRouter } from 'next/navigation';



const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
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
    // Scroll detection for sticky navbar
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on screen resize to desktop
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

        .nav-link {
          position: relative;
          transition: all 0.3s ease;
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

        @media (max-width: 768px) {
          .nav-link:active {
            color: #ceea45;
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
          box-shadow: 0 8px 20px rgba(206, 234, 69, 0.4);
        }

        .get-started-btn:active {
          transform: scale(0.98);
        }

        .mobile-menu-bg {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%);
          backdrop-filter: blur(20px);
        }

        .hamburger-icon {
          transition: all 0.3s ease;
        }

        .hamburger-icon:hover {
          transform: scale(1.1);
          color: #ceea45;
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
      `}</style>

      {/* Navbar - Sticky with animation */}
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 pt-4 sm:pt-6 md:pt-8 flex items-start justify-center z-50 transition-all duration-300 animate-fade-down ${
          isScrolled ? 'backdrop-blur-xl bg-black/30' : ''
        }`}
      >
        <div className='flex items-center justify-center w-full px-3 sm:px-4'>
          <div className={`flex justify-between items-center h-[60px] sm:h-[65px] md:h-[70px] rounded-full bg-gradient-to-r from-black via-gray-900 to-black border-2 text-white w-full max-w-[93vw] px-3 sm:px-4 md:px-6 transition-all duration-300 ${
            isScrolled ? 'shadow-2xl shadow-[#ceea45]/20 border-[#ceea45] animate-pulse-glow' : 'border-white/30'
          }`}>
            
            {/* Logo with animation */}
            <div ref={logoRef} className='cursor-pointer logo-container animate-scale-in'>
              
              <Image
                src={logo}
                alt='Logo'
                width={90}
                height={40}
                className='animate-fade-in'
              />
             
            </div>

            {/* Desktop Menu */}
            <ul className='hidden md:flex gap-6 lg:gap-10'>
              <a
                href='#hero'
                className='nav-link text-sm lg:text-base font-medium'
              >
                Home
              </a>
              
              <a
                href='#service'
                className='nav-link text-sm lg:text-base font-medium'
              >
                Service
              </a>
              
              <a
                href='#webflow'
                className='nav-link text-sm lg:text-base font-medium'
              >
                webflow
              </a>
              
              <a
                href='#contact'
                className='nav-link text-sm lg:text-base font-medium'
              >
                Contact
              </a>
            </ul>

            {/* Desktop Button */}
            <button 
              className='hidden md:flex items-center justify-center h-[45px] lg:h-[50px] px-5 lg:px-6  rounded-full bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-semibold text-sm lg:text-base get-started-btn animate-scale-in'
              style={{ animationDelay: '0.3s' }}
              onClick={startBtn}
            >
              Get Started
            </button>

            {/* Hamburger (Mobile) */}
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className='md:hidden flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full cursor-pointer border-2 border-white/30 hamburger-icon'
            >
              {openMenu ? <X size={24} className="sm:w-7 sm:h-7" /> : <Menu size={24} className="sm:w-7 sm:h-7" />}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content jump */}
      <div className='h-[76px] sm:h-[89px] md:h-[106px]'></div>

      {/* Mobile Menu - Slide from Left with Glass Effect */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-screen w-[75vw] sm:w-[65vw] mobile-menu-bg text-white flex flex-col items-start pt-24 sm:pt-28 md:pt-32 pl-6 sm:pl-8 space-y-6 sm:space-y-8 z-40 border-r-2 border-[#ceea45]/30 transition-transform duration-500 ${
          openMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Decorative glow effect */}
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ceea45]/5 to-purple-500/5 pointer-events-none'></div>

        {/* Animated floating elements in mobile menu */}
        <div className='absolute bottom-20 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-[#ceea45]/10 rounded-full blur-2xl animate-pulse-glow'></div>
        <div className='absolute top-40 right-5 w-12 h-12 sm:w-16 sm:h-16 bg-purple-400/10 rounded-full blur-xl animate-pulse-glow' style={{ animationDelay: '1s' }}></div>

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
          webflow
        </a>
        
        <a
          href='#contact'
          onClick={handleClose}
          className='text-lg sm:text-xl font-semibold transition-all hover:scale-110 duration-500 hover:text-[#ceea45] hover:translate-x-2 relative z-10'
        >
          Contact
        </a>

        <div className='flex items-center justify-center relative z-10 mt-4'>
          <button
            onClick={startBtn}
            className='flex items-center justify-center h-[42px] sm:h-[45px] px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-semibold text-sm sm:text-base get-started-btn'
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