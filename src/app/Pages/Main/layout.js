'use client';
import Header from '@/app/Components/Header/Header';
import ProtectedRoute from '@/app/Components/ProtectedRoute/ProtectedRoute'
import Sidebar from '@/app/Components/Sidebar/Sidebar'
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react'


const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  
  // Define pages where sidebar and header should be hidden
  const pagesWithoutSidebar = [
    '/Pages/Main/settings',
    '/Pages/Main/profile',
    '/Pages/Main/create-work',
    '/Pages/Main/messages'

  ];

  // Check if current path should hide sidebar/header
  // Use startsWith to handle dynamic routes like /Pages/Main/profile/123
  const shouldHideSidebar = pagesWithoutSidebar.some(path => 
    pathname.startsWith(path)
  );

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Close sidebar on mobile, open on desktop
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // Empty dependency array - only run once on mount

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <ProtectedRoute lang="en" suppressHydrationWarning>
      <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
        
        {/* Sidebar - only show when shouldHideSidebar is false */}
        {!shouldHideSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header - only show when shouldHideSidebar is false */}
          {!shouldHideSidebar && (
            <div className="">
              <Header />
            </div>
          )}

          {/* Scrollable Content Area - REMOVED sticky top-4 */}
   <div 
  className="flex-1 overflow-y-auto overflow-x-hidden px-3 mx-0 sm:px-8 md:px-0 md:mx-4 lg:mx-6 pb-6 sm:pb-8 md:pb-4"
  style={{
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
  }}
>
  {/* Your content here */}

  <div 
    className={`
      ${!shouldHideSidebar ? 'rounded-lg p-4 md:p-6' : ''}
      h-full
      transition-all 
      duration-300
    `}
  >
    {children}
  </div>
</div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Layout