'use client';
import React, { useState, useEffect } from 'react';
import { Home, Search, ArrowLeft, Compass, MapPin, AlertCircle, Sparkles, Star, Zap } from 'lucide-react';

export default function NotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Generate random floating elements
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      size: 20 + Math.random() * 40
    }));
    setFloatingElements(elements);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 transition-all duration-1000"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" 
          style={{ animationDelay: '2s' }} 
        />
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="absolute opacity-10"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            animation: `float ${element.duration}s ease-in-out infinite`,
            animationDelay: `${element.delay}s`
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-[#ceea45] to-purple-500 rounded-full blur-sm" />
        </div>
      ))}

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Main Content */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl w-full text-center">
          {/* 404 Number with Glitch Effect */}
          <div className="relative mb-8">
            <h1 className="text-[200px] md:text-[300px] font-black leading-none bg-gradient-to-r from-[#ceea45] via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center opacity-50">
              <h1 className="text-[200px] md:text-[300px] font-black leading-none text-[#ceea45] blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}>
                404
              </h1>
            </div>
          </div>

          {/* Icon with Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#ceea45]/20 to-purple-500/20 rounded-full flex items-center justify-center border-4 border-[#ceea45]/30 animate-bounce backdrop-blur-xl">
                <AlertCircle size={64} className="text-[#ceea45]" />
              </div>
              <div className="absolute -top-2 -right-2 animate-ping">
                <div className="w-8 h-8 bg-[#ceea45] rounded-full opacity-75" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-pulse">
                <Sparkles size={24} className="text-purple-400" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-[#ceea45] to-white bg-clip-text text-transparent">
              Oops! Lost in Space
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 mb-4 leading-relaxed">
              The page you&apos;re looking for has drifted into the digital void
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Don&apos;t worry though, even the best explorers get lost sometimes. Let&apos;s get you back on track!
            </p>
          </div>

          {/* Animated Divider */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ceea45]/30 to-transparent" />
            <Compass className="text-[#ceea45] animate-spin" style={{ animationDuration: '8s' }} />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#ceea45]/30 to-transparent" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleGoHome}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-xl font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#ceea45]/50 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Home size={24} className="relative z-10" />
              <span className="relative z-10">Take Me Home</span>
            </button>

            <button
              onClick={handleGoBack}
              className="group px-8 py-4 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-[#ceea45]/50 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center gap-3 backdrop-blur-xl"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 max-w-2xl mx-auto"
            style={{
              boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
            }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
              <Star className="text-[#ceea45]" />
              Popular Destinations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Home, label: 'Home', path: '/' },
                { icon: Search, label: 'Search', path: '/' },
                { icon: Compass, label: 'Explore', path: '/' },
                { icon: MapPin, label: 'Find Us', path: '/' }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className="group flex items-center gap-3 p-4 bg-white/5 hover:bg-[#ceea45]/10 border border-white/10 hover:border-[#ceea45]/50 rounded-xl transition-all hover:scale-105"
                >
                  <div className="w-12 h-12 bg-white/10 group-hover:bg-[#ceea45]/20 rounded-lg flex items-center justify-center transition-colors">
                    <link.icon size={20} className="text-gray-400 group-hover:text-[#ceea45] transition-colors" />
                  </div>
                  <span className="font-bold text-gray-300 group-hover:text-[#ceea45] transition-colors">
                    {link.label}
                  </span>
                  <Zap size={16} className="ml-auto text-[#ceea45] opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Fun Message */}
          <div className="mt-12 text-gray-500 text-sm">
            <p className="mb-2">💡 <span className="text-[#ceea45]">Pro Tip:</span> Double check the URL or use the navigation above</p>
            <p>Error Code: 404 | Page Not Found</p>
          </div>
        </div>
      </div>

      {/* Animated Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -20px) rotate(90deg);
          }
          50% {
            transform: translate(0, -40px) rotate(180deg);
          }
          75% {
            transform: translate(-20px, -20px) rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
}