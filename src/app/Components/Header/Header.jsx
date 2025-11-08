'use client'

import { useMyProfileQuery } from "@/app/Store/apiSclice/UserApiSlice"
import { useLogoutMutation } from "@/app/Store/apiSclice/AuthApiSlice"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectIsAuthenticated, selectAccessToken, logout } from "../../Store/Sclies/authSlice"
import { FiUser, FiSettings, FiLogOut, FiChevronDown, FiBell, FiMessageSquare, FiPlus } from "react-icons/fi"

const Header = () => {
  const router = useRouter()
  const pathname = usePathname() // ✅ Get current route
  const dispatch = useDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const dropdownRef = useRef(null)
  
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const accessToken = useSelector(selectAccessToken)
  
  const { data, isLoading, isError, error } = useMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  })
  
  const [logoutMutation] = useLogoutMutation()
  
  const profile = data?.yourProfile

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
      await logoutMutation().unwrap()
      dispatch(logout())
      router.push('/Pages/Auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
      dispatch(logout())
      router.push('/Pages/Auth/login')
    }
  }

  // ✅ Navigate to user's own profile
  const goToMyProfile = () => {
    if (profile?._id) {
      router.push(`/Pages/Main/profile/${profile._id}`)
      setIsDropdownOpen(false)
    }
  }

  // ✅ Check if on profile page
  const isOnProfilePage = pathname.includes('/Pages/Main/profile/')

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className='sticky top-4 mt-4 z-30 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl mx-4 lg:mx-6'>
      <div className='flex items-center justify-between h-16 px-4 lg:px-6 max-w-[1920px] mx-auto'>
        
        {/* Logo Section - Empty for spacing */}
        <div className="flex items-center">
          <div className="w-9 h-9"></div>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-2 lg:gap-3">
          
          {/* Create Button */}
          <button 
            onClick={() => router.push('/Pages/Main/create-work')}
            className={`hidden md:flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg
              ${pathname === '/Pages/Main/create-work' 
                ? 'bg-[#ceea45]/20 border-2 border-[#ceea45] text-[#ceea45] shadow-[#ceea45]/25' 
                : 'bg-[#b3cc35] border-2 border-cyan-500/30 shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105'
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
                : 'bg-[#b3cc35] border-2 border-blue-500/30 text-white shadow-blue-500/25'
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
                : 'hover:bg-white/5 text-white/70 hover:text-white'
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
                : 'hover:bg-white/5 text-white/70 hover:text-white'
              }
            `}
            aria-label="Notifications"
          >
            <FiBell className="text-lg transition-colors" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-black">
                <span className="absolute inset-0 bg-red-500 rounded-full animate-ping"></span>
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-1"></div>

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
                    : 'hover:bg-white/5 border-2 border-transparent'
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
                    <div className={`w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 transition-colors
                      ${isOnProfilePage && pathname.includes(profile._id)
                        ? 'border-[#ceea45]'
                        : 'border-white/10 group-hover:border-[#ceea45]/50'
                      }
                    `}>
                      {profile.fullname?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  {/* Online Status Indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black">
                    <span className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></span>
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
                <div className='absolute right-0 mt-2 w-80 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-in slide-in-from-top-2 duration-200'>
                  
                  {/* Profile Header */}
                  <div className='p-5 bg-gradient-to-br from-[#ceea45]/10 via-purple-500/10 to-pink-500/10 border-b border-white/10'>
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
                        <p className='text-sm text-white/60 truncate mb-2'>@{profile.username}</p>
                        {profile.bio && (
                          <p className='text-xs text-white/50 line-clamp-2 leading-relaxed'>{profile.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className='px-5 py-4 border-b border-white/10'>
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

                    {/* ✅ Settings Hidden
                    <button
                      onClick={() => {
                        router.push('/Pages/Main/settings')
                        setIsDropdownOpen(false)
                      }}
                      className='w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-left group'
                    >
                      <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <FiSettings className='text-base text-purple-400' />
                      </div>
                      <div>
                        <p className='text-sm text-white/90 font-medium'>Settings</p>
                        <p className='text-xs text-white/40'>Preferences and privacy</p>
                      </div>
                    </button>
                    */}
                  </div>

                  {/* Logout Section */}
                  <div className='border-t border-white/10 p-2'>
                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 rounded-xl transition-all duration-200 text-left group'
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <FiLogOut className='text-base text-red-400' />
                      </div>
                      <div>
                        <p className='text-sm text-red-400 group-hover:text-red-300 font-medium'>Logout</p>
                        <p className='text-xs text-red-400/50'>Sign out of your account</p>
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
  )
}

export default Header