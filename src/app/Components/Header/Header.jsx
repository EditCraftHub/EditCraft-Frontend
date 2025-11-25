'use client'

import { useMyProfileQuery } from "@/app/Store/apiSclice/UserApiSlice"
import { useLogoutMutation } from "@/app/Store/apiSclice/AuthApiSlice"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectIsAuthenticated, selectAccessToken, logout } from "../../Store/Sclies/authSlice"
import { FiUser, FiSettings, FiLogOut, FiChevronDown, FiBell, FiMessageSquare, FiPlus } from "react-icons/fi"
import { Zap } from "lucide-react"
import { apiSlice } from "@/app/Store/apiSclice/AuthApiSlice"

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [hackingText, setHackingText] = useState("")
  const dropdownRef = useRef(null)
  
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const accessToken = useSelector(selectAccessToken)
  
  const { data, isLoading, isError, error } = useMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  })
  
  const [logoutMutation] = useLogoutMutation()
  
  const profile = data?.yourProfile

  // Hacking text effect
  useEffect(() => {
    const codes = ["< EDITCRAFT >", "[ EDITCRAFT ]", "{ EDITCRAFT }", "~ EDITCRAFT ~", ">> EDITCRAFT <<", "▸ EDITCRAFT ◂"]
    let index = 0
    const interval = setInterval(() => {
      setHackingText(codes[index % codes.length])
      index++
    }, 150)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle authentication errors
  useEffect(() => {
    if (isError) {
      console.error('Profile fetch error:', error)
      if (error?.status === 401 || error?.status === 403) {
        dispatch(logout())
        router.push('/Pages/Auth/login')
      }
    }
  }, [isError, error, router, dispatch])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/Pages/Auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false)
      await logoutMutation().unwrap()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      dispatch(logout())
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/Pages/Auth/login'
    }
  }

  const goToMyProfile = () => {
    if (profile?._id) {
      router.push(`/Pages/Main/profile/${profile._id}`)
      setIsDropdownOpen(false)
    }
  }

  const isOnProfilePage = pathname.includes('/Pages/Main/profile/')

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <style jsx>{`
        @keyframes fireFlicker {
          0%, 100% { opacity: 1; text-shadow: 0 0 10px rgba(206, 234, 69, 0.8), 0 0 20px rgba(184, 217, 60, 0.6); }
          50% { opacity: 0.8; text-shadow: 0 0 20px rgba(206, 234, 69, 0.6), 0 0 30px rgba(184, 217, 60, 0.8), 0 0 40px rgba(172, 205, 51, 0.4); }
        }

        @keyframes dragonBreath {
          0% { box-shadow: 0 0 10px rgba(206, 234, 69, 0.3), 0 0 20px rgba(184, 217, 60, 0.2); }
          50% { box-shadow: 0 0 20px rgba(206, 234, 69, 0.6), 0 0 40px rgba(184, 217, 60, 0.4), 0 0 60px rgba(172, 205, 51, 0.3); }
          100% { box-shadow: 0 0 10px rgba(206, 234, 69, 0.3), 0 0 20px rgba(184, 217, 60, 0.2); }
        }

        @keyframes codeRain {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        @keyframes hackingGlitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes neonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes sparkle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: scale(1); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fire-text {
          animation: fireFlicker 2s ease-in-out infinite;
          font-weight: 900;
          letter-spacing: 3px;
          background: linear-gradient(90deg, #ceea45, #b8d93c, #aac933);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dragon-glow {
          animation: dragonBreath 3s ease-in-out infinite;
        }

        .code-rain {
          animation: codeRain 2s ease-in infinite;
        }

        .hacking-glitch {
          animation: hackingGlitch 0.2s infinite;
        }

        .neon-pulse {
          animation: neonPulse 1.5s ease-in-out infinite;
        }

        .sparkle-effect {
          animation: sparkle 1s ease-out forwards;
        }

        .menu-slide {
          animation: slideDown 0.2s ease-out;
        }

        .logo-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fire-glow {
          position: relative;
          display: inline-block;
        }

        .fire-char {
          display: inline-block;
          animation: fireFlicker 2s ease-in-out infinite;
        }

        .code-char {
          position: absolute;
          font-size: 10px;
          opacity: 0.6;
          font-family: monospace;
          color: rgba(206, 234, 69, 0.8);
        }
      `}</style>

      {/* Code Rain Background Effect */}
      <div className="fixed top-0 left-0 w-full h-32 pointer-events-none z-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="code-rain absolute text-xs text-[#ceea45]/30 font-mono"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: '2s'
            }}
          >
            {['0x1A', '0xBF', '█', '◆', '▲', '✦'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <header className='sticky top-4 mt-4 z-30 bg-black/95 backdrop-blur-xl border border-[#ceea45]/20 rounded-2xl shadow-2xl mx-4 lg:mx-6 dragon-glow'>
        <div className='flex items-center justify-between h-16 px-4 lg:px-6 max-w-[1920px] mx-auto'>
          
          {/* Logo Section with Fire Effects */}
          <div className="logo-container">
            {/* Fire Icon */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Zap className="fire-text w-8 h-8 animate-bounce" />
              
              {/* Sparkles around icon */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-[#ceea45] rounded-full"
                  style={{
                    top: `${Math.cos((i / 3) * Math.PI * 2) * 15}px`,
                    left: `${Math.sin((i / 3) * Math.PI * 2) * 15}px`,
                    animation: `sparkle 1.5s ease-out ${i * 0.3}s infinite`
                  }}
                />
              ))}
            </div>

            {/* EDITCRAFT Text */}
            <div className="hidden sm:block">
              <h1 className="fire-text text-xl lg:text-2xl font-black cursor-pointer hover:scale-105 transition-transform">
                EDITCRAFT
              </h1>
              <p className="text-xs text-[#ceea45]/60 font-mono -mt-1">
                {hackingText}
              </p>
            </div>
          </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-2 lg:gap-3">
          
          {/* Create Button */}
          <button 
            onClick={() => router.push('/Pages/Main/create-work')}
            className={`hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-lg
              ${pathname === '/Pages/Main/create-work' 
                ? 'bg-[#ceea45]/20 border-2 border-[#ceea45] text-[#ceea45] shadow-[#ceea45]/25' 
                : 'bg-[#ceea45]/20 border-2 border-[#ceea45]/30 text-[#ceea45] shadow-[#ceea45]/25 hover:shadow-[#ceea45]/40 hover:scale-105'
              }
            `}
          >
            <FiPlus className="text-base" />
            <span>Create</span>
          </button>

          {/* Mobile Create Button */}
          <button 
            onClick={() => router.push('/Pages/Main/create-work')}
            className={`md:hidden p-2.5 rounded-lg transition-all duration-200 shadow-lg
              ${pathname === '/Pages/Main/create-work'
                ? 'bg-[#ceea45]/20 border-2 border-[#ceea45] text-[#ceea45] shadow-[#ceea45]/25'
                : 'bg-[#ceea45]/20 border-2 border-[#ceea45]/30 text-[#ceea45] shadow-[#ceea45]/25'
              }
            `}
            aria-label="Create"
          >
            <FiPlus className="text-lg" />
          </button>

          {/* Messages */}
          <button 
            onClick={() => router.push('/Pages/Main/messages')}
            className={`p-2.5 rounded-lg transition-colors duration-200 relative
              ${pathname.startsWith('/Pages/Main/messages')
                ? 'bg-[#ceea45]/20 text-[#ceea45]'
                : 'hover:bg-white/5 text-white/70 hover:text-[#ceea45]'
              }
            `}
            aria-label="Messages"
          >
            <FiMessageSquare className="text-lg transition-colors" />
          </button>

          {/* Notifications */}
          <button 
            onClick={() => router.push('/Pages/Main/notifications')}
            className={`p-2.5 rounded-lg transition-colors duration-200 relative
              ${pathname === '/Pages/Main/notifications'
                ? 'bg-[#ceea45]/20 text-[#ceea45]'
                : 'hover:bg-white/5 text-white/70 hover:text-[#ceea45]'
              }
            `}
            aria-label="Notifications"
          >
            <FiBell className="text-lg transition-colors" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ceea45] rounded-full border-2 border-black neon-pulse">
                <span className="absolute inset-0 bg-[#ceea45] rounded-full animate-ping"></span>
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-[#ceea45]/20 mx-1"></div>

          {/* User Profile Section */}
          {isLoading ? (
            <div className='flex items-center gap-2.5'>
              <div className='hidden lg:flex flex-col items-end gap-1.5'>
                <div className='w-20 h-3 bg-white/10 rounded-full animate-pulse'></div>
                <div className='w-16 h-2.5 bg-white/10 rounded-full animate-pulse'></div>
              </div>
              <div className='w-9 h-9 bg-white/10 rounded-full animate-pulse'></div>
            </div>
          ) : profile ? (
            <div className='relative' ref={dropdownRef}>
              {/* Profile Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2.5 rounded-xl px-2 lg:px-3 py-2 transition-all duration-200 group
                  ${isOnProfilePage && pathname.includes(profile._id)
                    ? 'bg-[#ceea45]/20 border-2 border-[#ceea45]'
                    : 'hover:bg-white/5 border-2 border-transparent hover:border-[#ceea45]/30'
                  }
                `}
                aria-label="User menu"
              >
                {/* User Info - Desktop only */}
                <div className='hidden lg:block text-right'>
                  <p className={`text-sm font-semibold transition-colors
                    ${isOnProfilePage && pathname.includes(profile._id)
                      ? 'text-[#ceea45]'
                      : 'text-white group-hover:text-[#ceea45]'
                    }
                  `}>
                    {profile.fullname || profile.username || 'User'}
                  </p>
                  <p className='text-xs text-white/50'>@{profile.username}</p>
                </div>

                {/* Avatar with Status */}
                <div className="relative">
                  {profile.profilePic ? (
                    <img 
                      src={profile.profilePic} 
                      alt={profile.fullname || 'User'} 
                      className={`w-9 h-9 rounded-full object-cover border-2 transition-colors
                        ${isOnProfilePage && pathname.includes(profile._id)
                          ? 'border-[#ceea45]'
                          : 'border-white/10 group-hover:border-[#ceea45]/50'
                        }
                      `}
                    />
                  ) : (
                    <div className={`w-9 h-9 bg-gradient-to-br from-[#ceea45] to-[#b8d93c] rounded-full flex items-center justify-center text-sm font-bold text-black border-2 transition-colors
                      ${isOnProfilePage && pathname.includes(profile._id)
                        ? 'border-[#ceea45]'
                        : 'border-white/10 group-hover:border-[#ceea45]/50'
                      }
                    `}>
                      {profile.fullname?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  {/* Online Status Indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black neon-pulse">
                    <span className="absolute inset-0 bg-green-500 rounded-full animate-ping"></span>
                  </span>
                </div>

                <FiChevronDown className={`hidden lg:block transition-all duration-200
                  ${isOnProfilePage && pathname.includes(profile._id)
                    ? 'text-[#ceea45]'
                    : 'text-white/60 group-hover:text-white'
                  }
                  ${isDropdownOpen ? 'rotate-180' : ''}
                `} />
              </button>

              {/* Premium Dropdown Menu */}
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-80 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-[#ceea45]/20 menu-slide'>
                  
                  {/* Profile Header */}
                  <div className='p-5 bg-gradient-to-br from-[#ceea45]/10 via-purple-500/10 to-[#b8d93c]/10 border-b border-[#ceea45]/20'>
                    <div className='flex items-start gap-4'>
                      {profile.profilePic ? (
                        <img 
                          src={profile.profilePic} 
                          alt={profile.fullname || 'User'} 
                          className='w-14 h-14 rounded-xl object-cover border-2 border-[#ceea45]/30 shadow-lg'
                        />
                      ) : (
                        <div className='w-14 h-14 bg-gradient-to-br from-[#ceea45] to-[#b8d93c] rounded-xl flex items-center justify-center text-lg font-bold text-black shadow-lg'>
                          {profile.fullname?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className='flex-1 min-w-0'>
                        <p className='text-base font-bold text-white truncate mb-0.5'>{profile.fullname || profile.username || 'User'}</p>
                        <p className='text-sm text-[#ceea45]/60 truncate mb-2'>@{profile.username}</p>
                        {profile.bio && (
                          <p className='text-xs text-white/50 line-clamp-2 leading-relaxed'>{profile.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className='px-5 py-4 border-b border-[#ceea45]/20'>
                    <div className='grid grid-cols-2 gap-4'>
                      <button className='text-left group' onClick={() => {
                        router.push(`/Pages/Main/profile/${profile._id}?tab=following`)
                        setIsDropdownOpen(false)
                      }}>
                        <p className='text-xl font-bold text-white group-hover:text-[#ceea45] transition-colors'>{profile.following?.length || 0}</p>
                        <p className='text-xs text-white/50'>Following</p>
                      </button>
                      <button className='text-left group' onClick={() => {
                        router.push(`/Pages/Main/profile/${profile._id}?tab=followers`)
                        setIsDropdownOpen(false)
                      }}>
                        <p className='text-xl font-bold text-white group-hover:text-[#ceea45] transition-colors'>{profile.followers?.length || 0}</p>
                        <p className='text-xs text-white/50'>Followers</p>
                      </button>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className='py-2'>
                    <button
                      onClick={goToMyProfile}
                      className='w-full flex items-center gap-3 px-5 py-3 hover:bg-[#ceea45]/10 transition-colors text-left group'
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#ceea45]/10 flex items-center justify-center group-hover:bg-[#ceea45]/20 transition-colors">
                        <FiUser className='text-base text-[#ceea45]' />
                      </div>
                      <div>
                        <p className='text-sm text-white/90 font-medium group-hover:text-[#ceea45] transition-colors'>My Profile</p>
                        <p className='text-xs text-white/40'>View and edit profile</p>
                      </div>
                    </button>
                  </div>

                  {/* Logout Section */}
                  <div className='border-t border-[#ceea45]/20 p-2'>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-orange-500/10 rounded-xl transition-all duration-200 text-left group
                        ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                        {isLoggingOut ? (
                          <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiLogOut className='text-base text-orange-400' />
                        )}
                      </div>
                      <div>
                        <p className='text-sm text-orange-400 group-hover:text-orange-300 font-medium'>
                          {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </p>
                        <p className='text-xs text-orange-400/50'>Sign out of your account</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <span className='text-sm text-white/40 hidden lg:block'>Loading...</span>
              <div className='w-9 h-9 bg-white/10 rounded-full'></div>
            </div>
          )}
        </div>
      </div>
      </header>
    </>
  )
}

export default Header