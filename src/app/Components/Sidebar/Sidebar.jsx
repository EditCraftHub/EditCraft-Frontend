'use client'
import { useMyProfileQuery } from "@/app/Store/apiSclice/UserApiSlice";
import { selectIsAuthenticated, selectAccessToken, logout } from "../../Store/Sclies/authSlice"
import Link from "next/link";
import { BsPersonLinesFill } from "react-icons/bs";
import { GoSidebarCollapse } from "react-icons/go";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoIosNotifications } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiMessageSquare } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { CiHome } from "react-icons/ci";
import { GiBrassEye } from "react-icons/gi";
import { IoMdAdd } from "react-icons/io";

// Professional Color Configuration
const getRoleColor = (role) => {
  const colors = {
    user: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    admin: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    super_admin: "text-red-400 bg-red-500/10 border-red-500/20"
  }
  return colors[role?.toLowerCase()] || colors.user
}

const getAccountTypeColor = (accountType) => {
  const colors = {
    free: "text-gray-400 bg-gray-500/10 border-gray-500/20",
    premium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    premium_editor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  }
  return colors[accountType?.toLowerCase()] || colors.free
}

const getAccountIcon = (accountType) => {
  const icons = {
    free: "🔓",
    premium: "⭐",
    premium_editor: "✨"
  }
  return icons[accountType?.toLowerCase()] || "🔓"
}

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Get current route
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken = useSelector(selectAccessToken);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const { data, isLoading, isError, error } = useMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  })

  const profile = data?.yourProfile
  const userRole = profile?.role?.toLowerCase();
  
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  useEffect(() => {
    if (isError) {
      console.error('Error fetching profile:', error)
      if (error?.status === 400) {
        router.push('/Pages/Auth/login')
      }
    }
  }, [isError, error, router])

  // ✅ Navigate to user's own profile
  const goToMyProfile = () => {
    if (profile?._id) {
      router.push(`/Pages/Main/profile/${profile._id}`);
    }
  };

  if (!isAuthenticated) return null

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-7 left-8 z-50 p-2.5 bg-black/80 backdrop-blur-xl text-white rounded-xl hover:bg-black transition-all duration-200 shadow-lg border border-white/10"
        aria-label="Toggle menu"
      >
        {isOpen ? <IoClose className="text-xl" /> : <HiMenuAlt3 className="text-xl" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-200"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`bg-black border-r border-white/10 transition-all duration-300 ease-in-out z-40 rounded-2xl shadow-2xl
          fixed lg:sticky top-14 left-0 h-[calc(100vh-2rem)] lg:ml-4
          ${isOpen ? 'translate-x-0 ml-4' : '-translate-x-full lg:translate-x-0'}
          ${isOpen ? 'w-72' : 'w-72 lg:w-20'}
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* Profile Section - ✅ Now Clickable */}
          <div 
            onClick={goToMyProfile}
            className={`border-b border-white/10 transition-all duration-300 cursor-pointer hover:bg-white/5 ${isOpen ? 'p-5' : 'p-4 lg:p-3'}`}
          >
            {isLoading ? (
              <div className={`flex items-center justify-center transition-all duration-300
                ${isOpen ? 'h-32' : 'h-20 lg:h-16'}
              `}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`border-2 border-white/20 border-t-[#ceea45] rounded-full animate-spin
                    ${isOpen ? 'w-10 h-10' : 'w-8 h-8'}
                  `} />
                  {isOpen && <p className="text-white/40 text-xs mt-1">Loading...</p>}
                </div>
              </div>
            ) : (
              <>
                {/* Expanded View */}
                {isOpen && (
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={profile?.profilePic || "/default-avatar.png"}
                        alt="Profile"
                        className="w-14 h-14 object-cover rounded-xl border-2 border-[#ceea45]/30 hover:border-[#ceea45] transition-all"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-semibold text-sm truncate hover:text-[#ceea45] transition-colors">
                        {profile?.fullname || "Unnamed User"}
                      </h2>
                      <p className="text-white/50 text-xs mb-2.5">@{profile?.username}</p>

                      <div className="flex flex-wrap gap-1.5">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${getRoleColor(profile?.role)}`}>
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {profile?.role?.replace('_', ' ').toUpperCase() || "USER"}
                        </div>

                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${getAccountTypeColor(profile?.accountType)}`}>
                          <span className="text-xs">{getAccountIcon(profile?.accountType)}</span>
                          {profile?.accountType?.replace('_', ' ').toUpperCase() || "FREE"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Collapsed View */}
                {!isOpen && (
                  <div className="hidden lg:flex flex-col items-center gap-2">
                    <div className="relative">
                      <img
                        src={profile?.profilePic || "/default-avatar.png"}
                        alt="Profile"
                        className="w-11 h-11 object-cover rounded-xl border-2 border-[#ceea45]/30 hover:border-[#ceea45] transition-all"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                    </div>

                    {/* Mini Badges */}
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${getRoleColor(profile?.role)}`}>
                        <span className="text-[10px] font-bold">
                          {profile?.role === 'super_admin' ? 'SA' : profile?.role === 'admin' ? 'A' : 'U'}
                        </span>
                      </div>
                      
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs ${getAccountTypeColor(profile?.accountType)}`}>
                        {getAccountIcon(profile?.accountType)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1  overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent ${isOpen ? 'p-3' : 'p-2'}`}>
            <div className="space-y-1 flex flex-col gap-2">
              {/* Regular Navigation */}
              <NavLink 
                href="/Pages/Main/home" 
                icon={<CiHome className="text-lg" />} 
                label="Home" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Main/home'}
              />

              <NavLink 
                href="/Pages/Main/messages" 
                icon={<FiMessageSquare className="text-lg" />} 
                label="Messages" 
                isOpen={isOpen}
                isActive={pathname.startsWith('/Pages/Main/messages')}
              />

              {/* ✅ Updated Profile Link */}
              <button
                onClick={goToMyProfile}
                className="w-full"
              >
                <div className={`flex items-center gap-3 rounded-lg transition-all duration-200 group
                  ${isOpen ? 'p-2.5 justify-start' : 'p-2 justify-center lg:justify-center'}
                  ${pathname.includes('/Pages/Main/profile/') && pathname.includes(profile?._id) 
                    ? 'bg-[#ceea45]/20 border-l-2 border-[#ceea45]' 
                    : 'hover:bg-white/5'
                  }
                `}>
                  <div className={`p-1.5 rounded-lg transition-all duration-200 flex-shrink-0
                    ${pathname.includes('/Pages/Main/profile/') && pathname.includes(profile?._id)
                      ? 'bg-[#ceea45]/30 text-[#ceea45]'
                      : 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30'
                    }
                  `}>
                    <CgProfile className="text-lg" />
                  </div>
                  
                  {isOpen && (
                    <>
                      <span className={`text-sm font-medium transition-all duration-200
                        ${pathname.includes('/Pages/Main/profile/') && pathname.includes(profile?._id)
                          ? 'text-[#ceea45] font-semibold'
                          : 'text-white/70 group-hover:text-white'
                        }
                      `}>
                        Profile
                      </span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <FaArrowRightLong className={`text-xs ${
                          pathname.includes('/Pages/Main/profile/') && pathname.includes(profile?._id)
                            ? 'text-[#ceea45]'
                            : 'text-white/70'
                        }`} />
                      </span>
                    </>
                  )}
                </div>
              </button>

              <NavLink 
                href="/Pages/Main/create-work" 
                icon={<IoMdAdd className="text-lg" />} 
                label="Add New Job" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Main/create-work'}
              />

              {/* <NavLink 
                href="/Pages/Main/portfolio" 
                icon={<GiBrassEye className="text-lg" />} 
                label="My Portfolio" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Main/portfolio'}
              /> */}

              <NavLink 
                href="/Pages/Main/notifications" 
                icon={<IoIosNotifications className="text-lg" />} 
                label="Notifications" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Main/notifications'}
              />

              <NavLink 
                href="/Pages/Main/users-online" 
                icon={<BsPersonLinesFill className="text-lg" />} 
                label="Users Online" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Main/users-online'}
              />

              {/* Admin Panel Toggle */}
              {isAdmin && (
                <>
                  <div className="my-3">
                    <div className="h-px bg-white/10" />
                  </div>

                  <button
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    className={`w-full rounded-lg transition-all duration-200 flex items-center gap-3 group
                      ${showAdminPanel ? 'bg-white/5' : 'hover:bg-white/5'}
                      ${isOpen ? 'p-2.5 justify-start' : 'p-2 justify-center lg:justify-center'}
                    `}
                  >
                    <div className={`p-1.5 rounded-lg flex-shrink-0 text-base
                      ${isSuperAdmin ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'}
                    `}>
                      {isSuperAdmin ? '👑' : '🛡️'}
                    </div>
                    
                    {isOpen && (
                      <>
                        <span className="text-white/80 group-hover:text-white text-sm font-medium">
                          Admin Panel
                        </span>
                        <span className={`ml-auto text-white/40 transition-transform duration-200 ${showAdminPanel ? 'rotate-90' : ''}`}>
                          <FaArrowRightLong className="text-xs" />
                        </span>
                      </>
                    )}
                  </button>

                  {/* Admin Navigation Items */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    showAdminPanel ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="space-y-1">
                      <NavLink 
                        href="/Pages/Admin/dashboard" 
                        icon="📊" 
                        label="Dashboard" 
                        isOpen={isOpen}
                        isAdmin={true}
                        isActive={pathname === '/Pages/Admin/dashboard'}
                      />
                      
                      <NavLink 
                        href="/Pages/Admin/users" 
                        icon="👥" 
                        label="Manage Users" 
                        isOpen={isOpen}
                        isAdmin={true}
                        isActive={pathname === '/Pages/Admin/users'}
                      />
                      
                      <NavLink 
                        href="/Pages/Admin/analytics" 
                        icon="📈" 
                        label="Analytics" 
                        isOpen={isOpen}
                        isAdmin={true}
                        isActive={pathname === '/Pages/Admin/analytics'}
                      />
                      
                      {/* Super Admin Only */}
                      {isSuperAdmin && (
                        <>
                          <div className="my-2">
                            <div className="h-px bg-red-500/20" />
                          </div>

                          <NavLink 
                            href="/Pages/SuperAdmin/system" 
                            icon="⚡" 
                            label="System Config" 
                            isOpen={isOpen}
                            isSuperAdmin={true}
                            isActive={pathname === '/Pages/SuperAdmin/system'}
                          />
                          
                          <NavLink 
                            href="/Pages/SuperAdmin/permissions" 
                            icon="🔐" 
                            label="Permissions" 
                            isOpen={isOpen}
                            isSuperAdmin={true}
                            isActive={pathname === '/Pages/SuperAdmin/permissions'}
                          />
                          
                          <NavLink 
                            href="/Pages/SuperAdmin/logs" 
                            icon="📝" 
                            label="System Logs" 
                            isOpen={isOpen}
                            isSuperAdmin={true}
                            isActive={pathname === '/Pages/SuperAdmin/logs'}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Collapse Toggle */}
          <div className={`border-t border-white/10 ${isOpen ? 'p-3' : 'p-2'}`}>
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex w-full p-2.5 hover:bg-white/5 rounded-lg transition-all duration-200 items-center justify-center group"
              aria-label="Toggle sidebar"
            >
              <GoSidebarCollapse 
                className={`text-white/60 group-hover:text-white text-lg transition-all duration-200 ${
                  isOpen ? '' : 'rotate-180'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ✅ Updated Navigation Link Component with Active State
const NavLink = ({ href, icon, label, isOpen, isAdmin = false, isSuperAdmin = false, isActive = false }) => {
  const getBgColor = () => {
    if (isActive) return 'bg-[#ceea45]/30 text-[#ceea45]' // ✅ Active state
    if (isSuperAdmin) return 'bg-red-500/20 text-red-400'
    if (isAdmin) return 'bg-purple-500/20 text-purple-400'
    return 'bg-blue-500/20 text-blue-400'
  }

  const getHoverBg = () => {
    if (isActive) return 'hover:bg-[#ceea45]/40' // ✅ Active hover
    if (isSuperAdmin) return 'hover:bg-red-500/30'
    if (isAdmin) return 'hover:bg-purple-500/30'
    return 'hover:bg-blue-500/30'
  }

  const getTextColor = () => {
    if (isActive) return 'text-[#ceea45] font-semibold' // ✅ Active text
    if (isSuperAdmin) return 'text-red-400'
    if (isAdmin) return 'text-purple-400'
    return 'text-white/70'
  }

  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 rounded-lg transition-all duration-200 group
        ${isOpen ? 'p-2.5 justify-start' : 'p-2 justify-center lg:justify-center'}
        ${isActive ? 'bg-[#ceea45]/20 border-l-2 border-[#ceea45]' : 'hover:bg-white/5'}
      `}>
        <div className={`p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 ${getBgColor()} ${getHoverBg()}`}>
          {typeof icon === 'string' ? <span className="text-sm">{icon}</span> : icon}
        </div>
        
        {isOpen && (
          <>
            <span className={`text-sm font-medium transition-all duration-200 group-hover:text-white ${getTextColor()}`}>
              {label}
            </span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <FaArrowRightLong className={`text-xs ${getTextColor()}`} />
            </span>
          </>
        )}
      </div>
    </Link>
  )
}

export default Sidebar