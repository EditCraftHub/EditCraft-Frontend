'use client';

import { useLogoutMutation } from "@/app/Store/apiSclice/AuthApiSlice";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { LogOut, Loader2, AlertTriangle, X } from "lucide-react";

const LogoutButton = ({ inSidebar = false }) => {
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();
  const pathname = usePathname();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Check if we're NOT in sidebar (show messages only outside sidebar)
  const shouldShowMessages = !inSidebar;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      
      // Only show success toast if NOT in sidebar
      if (shouldShowMessages) {
        toast.success(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">Logout Successful!</p>
              <p className="text-xs opacity-80">Redirecting to login...</p>
            </div>
          </div>,
          { 
            autoClose: 2000,
            style: {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            },
            progressStyle: {
              background: 'rgba(255, 255, 255, 0.3)'
            }
          }
        );
      }
      
      setShowConfirmModal(false);
      
      // Delay redirect only if showing messages
      setTimeout(() => {
        router.push('/Pages/login');
      }, shouldShowMessages ? 2000 : 0);
      
    } catch (err) {
      console.error("❌ Logout failed:", err);
      
      // Only show error toast if NOT in sidebar
      if (shouldShowMessages) {
        toast.error(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <X className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Logout Failed!</p>
              <p className="text-xs opacity-80">Please try again</p>
            </div>
          </div>,
          { 
            autoClose: 3000,
            style: {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            },
            progressStyle: {
              background: 'rgba(255, 255, 255, 0.3)'
            }
          }
        );
      }
    }
  };

  const handleLogoutClick = () => {
    if (shouldShowMessages) {
      // Show modal on non-sidebar pages
      setShowConfirmModal(true);
    } else {
      // Direct logout in sidebar (no modal, no messages)
      handleLogout();
    }
  };

  return (
    <>
      {/* Gaming-Style Logout Button */}
      <button
        onClick={handleLogoutClick}
        disabled={isLoading}
        className="w-full relative flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 text-red-400 hover:text-white rounded-xl transition-all duration-300 font-semibold group overflow-hidden border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        
        {/* Neon Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
        
        {/* Button Content */}
        <div className="relative z-10 flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="animate-pulse">LOGGING OUT...</span>
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
              <span className="font-bold tracking-wider">LOGOUT</span>
            </>
          )}
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500/50 group-hover:border-red-400 transition-colors duration-300" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500/50 group-hover:border-red-400 transition-colors duration-300" />
      </button>

      {/* Gaming-Style Confirmation Modal - Only show outside sidebar */}
      {shouldShowMessages && showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop with Blur */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => !isLoading && setShowConfirmModal(false)}
          />
          
          {/* Modal Container */}
          <div className="relative max-w-md w-full animate-scale-up">
            {/* Neon Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-pink-500/30 to-purple-500/30 rounded-2xl blur-2xl animate-pulse" />
            
            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-red-500/30 overflow-hidden">
              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 animate-gradient-shift opacity-50" />
              
              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-red-500/30" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-red-500/30" />
              
              {/* Content */}
              <div className="relative p-8">
                {/* Warning Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    {/* Pulsing Ring */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 rounded-full animate-ping opacity-20" />
                    
                    {/* Icon Container */}
                    <div className="relative w-20 h-20 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center border-2 border-red-500/50 backdrop-blur-sm">
                      <AlertTriangle className="w-10 h-10 text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 mb-3 tracking-wider">
                  CONFIRM LOGOUT
                </h3>
                
                {/* Description */}
                <div className="text-center space-y-2 mb-8">
                  <p className="text-gray-300 font-medium">
                    Are you sure you want to logout?
                  </p>
                  <p className="text-sm text-gray-500">
                    You'll need to login again to access your dashboard
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  {/* Cancel Button */}
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    disabled={isLoading}
                    className="flex-1 relative px-6 py-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-gray-700/70 hover:to-gray-800/70 text-gray-300 hover:text-white font-bold rounded-xl transition-all duration-300 border border-gray-600/50 hover:border-gray-500 overflow-hidden group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600/0 via-gray-600/20 to-gray-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <span className="relative z-10 tracking-wider">CANCEL</span>
                  </button>
                  
                  {/* Confirm Button */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex-1 relative px-6 py-3 bg-gradient-to-r from-red-500/30 to-pink-500/30 hover:from-red-500/50 hover:to-pink-500/50 text-red-400 hover:text-white font-bold rounded-xl transition-all duration-300 border border-red-500/50 hover:border-red-400 overflow-hidden group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                    
                    {/* Sweep Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/30 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    
                    {/* Content */}
                    <span className="relative z-10 flex items-center justify-center gap-2 tracking-wider">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          PROCESSING...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-5 h-5" />
                          YES, LOGOUT
                        </>
                      )}
                    </span>
                    
                    {/* Corner Accents */}
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-400/50 group-hover:border-red-300 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-400/50 group-hover:border-red-300 transition-colors duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles - Only include if showing messages */}
      {shouldShowMessages && (
        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scale-up {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          
          .animate-scale-up {
            animation: scale-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 8s ease infinite;
          }
        `}</style>
      )}
    </>
  );
};

export default LogoutButton;