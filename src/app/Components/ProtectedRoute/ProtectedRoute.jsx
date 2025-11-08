'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useVerifyAuthQuery } from "@/app/Store/apiSclice/AuthApiSlice";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // ✅ Automatically verify auth using backend middleware
  const { isLoading, isError, error } = useVerifyAuthQuery();

  useEffect(() => {
    // Redirect to login if verification fails
    if (!isLoading && (isError || !isAuthenticated)) {
      console.log("❌ Not authenticated, redirecting to login");
      router.push('/Pages/Auth/login');
    }
  }, [isAuthenticated, isError, isLoading, router]);

  // Show loading while verifying
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

        {/* Loading Content */}
        <div className="text-center relative z-10">
          {/* Animated Logo/Icon */}
          <div className="relative mb-8">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-[#ceea45]/30 animate-spin-slow"></div>
            </div>
            
            {/* Middle pulsing ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-[#ceea45]/50 animate-pulse"></div>
            </div>

            {/* Inner spinning loader */}
            <div className="relative flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#ceea45]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#b8d93c]" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-[#ceea45] rounded-full animate-pulse shadow-lg shadow-[#ceea45]/60"></div>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#ceea45] via-[#b8d93c] to-[#ceea45] bg-clip-text text-transparent animate-pulse">
              EDITCRAFT
            </h3>
            <p className="text-gray-300 font-medium text-lg">Verifying authentication...</p>
            
            {/* Loading dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-2 h-2 bg-[#ceea45] rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#ceea45] rounded-full animate-bounce animation-delay-200"></span>
              <span className="w-2 h-2 bg-[#ceea45] rounded-full animate-bounce animation-delay-400"></span>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex gap-3 opacity-40">
            <div className="w-2 h-2 bg-[#ceea45] rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-200"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-400"></div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .animation-delay-200 {
            animation-delay: 0.2s;
          }

          .animation-delay-400 {
            animation-delay: 0.4s;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  // Don't render if not authenticated
  if (isError || !isAuthenticated) {
    return null; // Router will redirect
  }

  // ✅ Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;