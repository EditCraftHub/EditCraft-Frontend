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
import { Flame, Sparkles, Zap, FileText } from "lucide-react";

// Professional Color Configuration - UPDATED TO #ceea45
const getRoleColor = (role) => {
  const colors = {
    user: "text-[#ceea45] bg-[#ceea45]/10 border-[#ceea45]/20",
    admin: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    super_admin: "text-orange-400 bg-orange-500/10 border-orange-500/20"
  }
  return colors[role?.toLowerCase()] || colors.user
}

const getAccountTypeColor = (accountType) => {
  const colors = {
    free: "text-slate-300 bg-slate-500/10 border-slate-500/20",
    premium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    premium_editor: "text-green-400 bg-green-500/10 border-green-500/20"
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
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken = useSelector(selectAccessToken);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

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

  const goToMyProfile = () => {
    if (profile?._id) {
      router.push(`/Pages/Main/profile/${profile._id}`);
    }
  };

  if (!isAuthenticated) return null

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes neonGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(206, 234, 69, 0.3), 0 0 40px rgba(206, 234, 69, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(206, 234, 69, 0.5), 0 0 60px rgba(206, 234, 69, 0.2);
          }
        }

        @keyframes fireGlow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(206, 234, 69, 0.4), 0 0 20px rgba(184, 217, 60, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(206, 234, 69, 0.8), 0 0 40px rgba(184, 217, 60, 0.5);
          }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-glow {
          animation: neonGlow 3s ease-in-out infinite;
        }

        .animate-fire-glow {
          animation: fireGlow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
          background-size: 1000px 100%;
        }

        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-float-custom {
          animation: float 3s ease-in-out infinite;
        }

        .sidebar-enter {
          animation: slideInLeft 0.3s ease-out;
        }

        .sidebar-exit {
          animation: slideOutLeft 0.3s ease-out;
        }

        .nav-item-enter {
          animation: slideDown 0.3s ease-out;
        }

        /* Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(206, 234, 69, 0.2);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(206, 234, 69, 0.4);
        }

        /* Enhanced Link Effects */
        .nav-link-active {
          position: relative;
          background: linear-gradient(135deg, rgba(206, 234, 69, 0.2), rgba(206, 234, 69, 0.05));
          border-left: 3px solid #ceea45;
        }

        .nav-link-active::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #ceea45, transparent);
          animation: neonGlow 2s ease-in-out infinite;
        }

        /* Profile Image Glow */
        .profile-image-glow {
          position: relative;
          box-shadow: 0 0 20px rgba(206, 234, 69, 0.3);
        }

        .profile-image-glow:hover {
          animation: neonGlow 1.5s ease-in-out infinite;
        }

        /* Icon Background Glow */
        .icon-bg-glow {
          position: relative;
          transition: all 0.3s ease;
        }

        .icon-bg-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, currentColor, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }

        .icon-bg-glow:hover::after {
          opacity: 0.2;
        }

        /* Admin Panel Animation */
        .admin-panel-content {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Tooltip */
        .nav-tooltip {
          position: absolute;
          left: full;
          margin-left: 0.5rem;
          background: rgba(0, 0, 0, 0.9);
          color: #ceea45;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          border: 1px solid rgba(206, 234, 69, 0.3);
        }
      `}</style>

      {/* Mobile Toggle Button */}
      {/* Mobile Toggle Button - NO X BUTTON */}
{!isOpen && (
  <button
    onClick={toggleSidebar}
    className="lg:hidden fixed top-7 left-8 z-50 p-2.5 bg-gradient-to-br from-black to-gray-900 backdrop-blur-xl text-white rounded-xl hover:bg-black transition-all duration-300 shadow-lg border border-[#ceea45]/30 hover:border-[#ceea45] animate-glow"
    aria-label="Toggle menu"
  >
    <HiMenuAlt3 className="text-xl" />
  </button>
)}

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container - NO GAPS, FLUSH LEFT */}
      <div 
        className={`bg-gradient-to-b from-black via-gray-950 to-black border-r border-[#ceea45]/20 transition-all duration-300 ease-in-out z-40
          fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-0rem)]
          ${isOpen ? 'translate-x-0 sidebar-enter' : '-translate-x-full lg:translate-x-0'}
          ${isOpen ? 'w-72' : 'w-72 lg:w-20'}
          hover:border-[#ceea45]/40 transition-all
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* Profile Section */}
          <div 
            onClick={goToMyProfile}
            className={`border-b border-[#ceea45]/10 transition-all duration-300 cursor-pointer hover:bg-[#ceea45]/5 group ${isOpen ? 'p-5' : 'p-4 lg:p-3'}`}
          >
            {isLoading ? (
              <div className={`flex items-center justify-center transition-all duration-300
                ${isOpen ? 'h-32' : 'h-20 lg:h-16'}
              `}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`border-2 border-[#ceea45]/30 border-t-[#ceea45] rounded-full animate-spin
                    ${isOpen ? 'w-10 h-10' : 'w-8 h-8'}
                  `} />
                  {isOpen && <p className="text-[#ceea45]/60 text-xs mt-1">Loading...</p>}
                </div>
              </div>
            ) : (
              <>
                {/* Expanded View */}
                {isOpen && (
                  <div className="flex items-start gap-3 nav-item-enter">
                    <div className="relative flex-shrink-0">
                      <img
                        src={profile?.profilePic || "/default-avatar.png"}
                        alt="Profile"
                        className="w-14 h-14 object-cover rounded-xl border-2 border-[#ceea45]/30 hover:border-[#ceea45] transition-all profile-image-glow"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-black shadow-lg" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-bold text-sm truncate hover:text-[#ceea45] transition-all duration-300 group-hover:text-[#ceea45]">
                        {profile?.fullname || "Unnamed User"}
                      </h2>
                      <p className="text-white/40 text-xs mb-2.5 hover:text-white/60 transition-colors">@{profile?.username}</p>

                      <div className="flex flex-wrap gap-1.5">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all hover:scale-105 ${getRoleColor(profile?.role)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-custom" />
                          {profile?.role?.replace('_', ' ').toUpperCase() || "USER"}
                        </div>

                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all hover:scale-105 ${getAccountTypeColor(profile?.accountType)}`}>
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
                        className="w-11 h-11 object-cover rounded-xl border-2 border-[#ceea45]/30 hover:border-[#ceea45] transition-all profile-image-glow"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-black" />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold transition-all hover:scale-110 ${getRoleColor(profile?.role)}`}>
                        <span className="text-[10px]">
                          {profile?.role === 'super_admin' ? 'SA' : profile?.role === 'admin' ? 'A' : 'U'}
                        </span>
                      </div>
                      
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs transition-all hover:scale-110 ${getAccountTypeColor(profile?.accountType)}`}>
                        {getAccountIcon(profile?.accountType)}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${isOpen ? 'p-3' : 'p-2'}`}>
            <div className="space-y-1.5 flex flex-col gap-2">
              {/* Regular Navigation */}
              <NavLink 
                href="/Pages/Main/home" 
                icon={<CiHome className="text-lg" />} 
                label="Home" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Main/home'}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />

              <NavLink 
                href="/Pages/Main/messages" 
                icon={<FiMessageSquare className="text-lg" />} 
                label="Messages" 
                isOpen={isOpen}
                isActive={pathname.startsWith('/Pages/Main/messages')}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />

              {/* Profile Link */}
              <button
                onClick={goToMyProfile}
                className="w-full nav-item-enter"
              >
                <div className={`flex items-center gap-3 rounded-lg transition-all duration-300 group
                  ${isOpen ? 'p-2.5 justify-start' : 'p-2 justify-center lg:justify-center'}
                  ${pathname.includes('/Pages/Main/profile/') && pathname.includes(profile?._id) 
                    ? 'nav-link-active' 
                    : 'hover:bg-[#ceea45]/10'
                  }
                `}>
                  <div className={`p-1.5 rounded-lg transition-all duration-300 flex-shrink-0 icon-bg-glow
                    ${pathname.includes('/Pages/Main/profile/') && pathname.includes(profile?._id)
                      ? 'bg-[#ceea45]/30 text-[#ceea45] animate-glow'
                      : 'bg-[#ceea45]/20 text-[#ceea45] group-hover:bg-[#ceea45]/30'
                    }
                  `}>
                    <CgProfile className="text-lg" />
                  </div>
                  
                  {isOpen && (
                    <>
                      <span className={`text-sm font-semibold transition-all duration-300
                        ${pathname.includes('/Pages/Main/profile/') && pathname.includes(profile?._id)
                          ? 'text-[#ceea45] font-bold'
                          : 'text-white/70 group-hover:text-white'
                        }
                      `}>
                        Profile
                      </span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <FaArrowRightLong className={`text-xs ${
                          pathname.includes('/Pages/Main/profile/') && pathname.includes(profile?._id)
                            ? 'text-[#ceea45]'
                            : 'text-white/40'
                        }`} />
                      </span>
                    </>
                  )}
                </div>
              </button>

              <NavLink 
                href="/Pages/Main/create-work" 
                icon={<IoMdAdd className="text-lg" />} 
                label="Hire editors" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Main/create-work'}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />

              {/* Create Portfolio with Sparkles Icon */}
              <NavLink 
                href="/Pages/Features/portfolio" 
                icon={<Sparkles className="text-lg" />} 
                label="Create Portfolio" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Features/portfolio'}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />

              {/* My Portfolio with Fire Icon */}
              <NavLink 
                href="/Pages/Features/myportfolio" 
                icon={<Flame className="text-lg" />} 
                label="My Portfolio" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Features/myportfolio'}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                showFire={true}
              />

              <NavLink 
                href="/Pages/Main/notifications" 
                icon={<IoIosNotifications className="text-lg" />} 
                label="Notifications" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Main/notifications'}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />

              <NavLink 
                href="/Pages/Main/users-online" 
                icon={<BsPersonLinesFill className="text-lg" />} 
                label="Users Online" 
                isOpen={isOpen}
                isActive={pathname === '/Pages/Main/users-online'}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />

              {/* Admin Panel Toggle */}
              {isAdmin && (
                <>
                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#ceea45]/30 to-transparent" />

                  <button
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    className={`w-full rounded-lg transition-all duration-300 flex items-center gap-3 group nav-item-enter
                      ${showAdminPanel 
                        ? 'bg-gradient-to-r from-violet-500/20 to-transparent border-l-2 border-violet-400' 
                        : 'hover:bg-violet-500/10'
                      }
                      ${isOpen ? 'p-2.5 justify-start' : 'p-2 justify-center lg:justify-center'}
                    `}
                  >
                    <div className={`p-1.5 rounded-lg flex-shrink-0 text-base transition-all duration-300 ${
                      isSuperAdmin 
                        ? 'bg-gradient-to-br from-orange-500/30 to-orange-500/10 text-orange-400 group-hover:from-orange-500/40' 
                        : 'bg-gradient-to-br from-violet-500/30 to-violet-500/10 text-violet-400 group-hover:from-violet-500/40'
                    }`}>
                      {isSuperAdmin ? '👑' : '🛡️'}
                    </div>
                    
                    {isOpen && (
                      <>
                        <span className="text-white/80 group-hover:text-white text-sm font-semibold transition-all">
                          Admin Panel
                        </span>
                        <span className={`ml-auto text-white/40 transition-all duration-300 text-xs ${showAdminPanel ? 'rotate-90' : ''}`}>
                          <FaArrowRightLong />
                        </span>
                      </>
                    )}
                  </button>

                  {/* Admin Navigation Items */}
                  <div className={`admin-panel-content overflow-hidden ${
                    showAdminPanel ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="space-y-1 mt-2">
                      <AdminNavLink 
                        href="/Pages/Admin/dashboard" 
                        icon="📊" 
                        label="Dashboard" 
                        isOpen={isOpen}
                        isActive={pathname === '/Pages/Admin/dashboard'}
                        type="admin"
                      />
                      
                      <AdminNavLink 
                        href="/Pages/Admin/users" 
                        icon="👥" 
                        label="Manage Users" 
                        isOpen={isOpen}
                        isActive={pathname === '/Pages/Admin/users'}
                        type="admin"
                      />
                      
                      <AdminNavLink 
                        href="/Pages/Admin/analytics" 
                        icon="📈" 
                        label="Analytics" 
                        isOpen={isOpen}
                        isActive={pathname === '/Pages/Admin/analytics'}
                        type="admin"
                      />
                      
                      {/* Super Admin Only */}
                      {isSuperAdmin && (
                        <>
                          <div className="my-2 h-px bg-orange-500/20" />

                          <AdminNavLink 
                            href="/Pages/SuperAdmin/system" 
                            icon="⚡" 
                            label="System Config" 
                            isOpen={isOpen}
                            isActive={pathname === '/Pages/SuperAdmin/system'}
                            type="superadmin"
                          />
                          
                          <AdminNavLink 
                            href="/Pages/SuperAdmin/permissions" 
                            icon="🔐" 
                            label="Permissions" 
                            isOpen={isOpen}
                            isActive={pathname === '/Pages/SuperAdmin/permissions'}
                            type="superadmin"
                          />
                          
                          <AdminNavLink 
                            href="/Pages/SuperAdmin/logs" 
                            icon="📝" 
                            label="System Logs" 
                            isOpen={isOpen}
                            isActive={pathname === '/Pages/SuperAdmin/logs'}
                            type="superadmin"
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
          <div className={`border-t border-[#ceea45]/10 bg-gradient-to-r from-black via-gray-950 to-black ${isOpen ? 'p-3' : 'p-2'}`}>
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex w-full p-3 hover:bg-[#ceea45]/10 rounded-lg transition-all duration-300 items-center justify-center group border border-transparent hover:border-[#ceea45]/30"
              aria-label="Toggle sidebar"
            >
              <GoSidebarCollapse 
                className={`text-white/60 group-hover:text-[#ceea45] text-lg transition-all duration-300 ${
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

// Enhanced Navigation Link Component
const NavLink = ({ href, icon, label, isOpen, isActive = false, hoveredItem, setHoveredItem, showFire = false }) => {
  const getBgColor = () => {
    return isActive ? 'bg-[#ceea45]/30 text-[#ceea45]' : 'bg-[#ceea45]/20 text-[#ceea45]'
  }

  const getHoverBg = () => {
    return isActive ? 'hover:bg-[#ceea45]/40' : 'hover:bg-[#ceea45]/30'
  }

  const getTextColor = () => {
    return isActive ? 'text-[#ceea45] font-semibold' : 'text-white/70'
  }

  return (
    <Link href={href}>
      <div 
        className={`flex items-center gap-3 rounded-lg transition-all duration-300 group relative nav-item-enter
          ${isOpen ? 'p-2.5 justify-start' : 'p-2 justify-center lg:justify-center'}
          ${isActive ? 'nav-link-active' : 'hover:bg-[#ceea45]/10'}
        `}
        onMouseEnter={() => !isOpen && setHoveredItem(label)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <div className={`p-1.5 rounded-lg transition-all duration-300 flex-shrink-0 icon-bg-glow ${getBgColor()} ${getHoverBg()}`}>
          {typeof icon === 'string' ? <span className="text-sm">{icon}</span> : icon}
        </div>
        
        {isOpen && (
          <>
            <span className={`text-sm font-medium transition-all duration-300 group-hover:text-white ${getTextColor()}`}>
              {label}
            </span>
            
            {showFire && (
              <div className="ml-auto">
                <Flame size={14} className="text-orange-400 animate-pulse-custom" />
              </div>
            )}

            {!showFire && (
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                <FaArrowRightLong className={`text-xs ${getTextColor()}`} />
              </span>
            )}
          </>
        )}

        {/* Tooltip for collapsed view */}
        {!isOpen && hoveredItem === label && (
          <div className="nav-tooltip opacity-100 z-50 left-full top-0">
            {label}
          </div>
        )}
      </div>
    </Link>
  )
}

// Admin Navigation Link Component
const AdminNavLink = ({ href, icon, label, isOpen, isActive = false, type = 'admin' }) => {
  const getColor = () => {
    if (type === 'superadmin') return 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
    return 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
  }

  const getActiveColor = () => {
    if (type === 'superadmin') return 'bg-orange-500/30 text-orange-400 border-l-2 border-orange-400'
    return 'bg-violet-500/30 text-violet-400 border-l-2 border-violet-400'
  }

  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 rounded-lg transition-all duration-300 group pl-4 nav-item-enter
        ${isOpen ? 'p-2.5 py-2' : 'p-2'}
        ${isActive ? getActiveColor() : getColor()}
      `}>
        <span className="text-sm flex-shrink-0">{icon}</span>
        
        {isOpen && (
          <>
            <span className={`text-sm font-medium transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}>
              {label}
            </span>
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
              <FaArrowRightLong className="text-xs" />
            </span>
          </>
        )}
      </div>
    </Link>
  )
}

export default Sidebar