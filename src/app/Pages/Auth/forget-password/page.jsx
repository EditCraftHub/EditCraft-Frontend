'use client'

import { boy1 } from "@/app/Assets/images/Images";
import { useForgotPasswordMutation } from "@/app/Store/apiSclice/AuthApiSlice";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

const Page = () => {
  const forgotPasswordRef = useRef(null);
  const imageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  
  const homebtn = () => {
    router.push('/');
  }
  
  const [formData, setFormData] = useState({
    email: ""
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please enter a valid email", { 
        autoClose: 3000,
        position: "top-right"
      });
      return;
    }

    try {
      const response = await forgotPassword(formData).unwrap();
      
      toast.success(response.message || "OTP sent to your email successfully!", { 
        autoClose: 3000,
        position: "top-right"
      });

      setFormData({ email: "" });

      setTimeout(() => {
        toast.info("Please check your email for the OTP code", { 
          autoClose: 5000,
          position: "top-right"
        });
      }, 1000);

    } catch (error) {
      console.error("Forgot password error:", error);

      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach(err => {
          toast.error(err.msg || err.message || err, { 
            autoClose: 4000,
            position: "top-right"
          });
        });
      } else if (error?.data?.message) {
        toast.error(error.data.message, { 
          autoClose: 4000,
          position: "top-right"
        });
      } else if (error?.error) {
        toast.error(error.error, { 
          autoClose: 4000,
          position: "top-right"
        });
      } else {
        toast.error("Failed to send OTP. Please try again.", { 
          autoClose: 4000,
          position: "top-right"
        });
      }
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <ToastContainer />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button 
          onClick={homebtn}  
          className="group bg-white/5 hover:bg-[#ceea45] backdrop-blur-md p-4 rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[#ceea45]/50 border border-white/10 hover:border-[#ceea45]"
        >
          <FaArrowLeft className="text-white group-hover:text-black transition-colors duration-300" size={20} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 lg:px-20 gap-10 lg:gap-16 py-10">

        {/* Forgot Password Box */}
        <form
          onSubmit={handleSubmit}
          ref={forgotPasswordRef}
          className={`bg-white/10 backdrop-blur-2xl border border-white/20 w-full sm:w-[400px] lg:w-[450px] h-auto rounded-[40px] flex flex-col items-center justify-start p-8 lg:p-10 shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
          style={{
            boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
          }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent mb-3 tracking-tight">
              Forgot Password
            </h2>
            <p className="text-gray-300 text-sm">We'll send you an OTP to reset it</p>
          </div>

          {/* Info Box */}
          <div className="w-full mb-6 p-4 bg-[#ceea45]/10 border border-[#ceea45]/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#ceea45] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs text-[#ceea45] font-semibold mb-1">How it works:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Enter your registered email</li>
                  <li>• Receive OTP code in your inbox</li>
                  <li>• Use OTP to reset your password</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full">
            {/* Email Input */}
            <div className="relative group">
              <label className="absolute -top-3 left-4 bg-gradient-to-r from-gray-900 to-black px-2 text-xs text-gray-300 font-semibold">
                Email Address <span className="text-[#ceea45]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your registered email"
                required
                autoComplete="email"
                className={`rounded-2xl h-[55px] w-full px-5 focus:outline-none border-2 transition-all bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500 group-hover:bg-white/10 focus:bg-white/10 ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-[#ceea45] group-hover:border-[#ceea45]/50'
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 ml-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`relative rounded-2xl h-[55px] w-full bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-bold text-lg transition-all overflow-hidden group mt-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-[#ceea45]/50 hover:scale-[1.02]'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#b8d93c] to-[#ceea45] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send OTP
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Links Section */}
          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm text-gray-300">
              Remember Password?{" "}
              <Link href="/Pages/Auth/login" className="text-[#ceea45] hover:text-[#b8d93c] font-bold transition-colors hover:underline">
                Login
              </Link>
            </p>
            
            <p className="text-sm text-gray-300">
              Already have OTP?{" "}
              <Link href="/Pages/Auth/reset-password" className="text-[#ceea45] hover:text-[#b8d93c] font-bold transition-colors hover:underline">
                Reset Password
              </Link>
            </p>

            <p className="text-sm text-gray-300">
              Don't have an account?{" "}
              <Link href="/Pages/Auth/signup" className="text-[#ceea45] hover:text-[#b8d93c] font-bold transition-colors hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-gray-400 text-center">
              💡 <span className="font-semibold text-gray-300">Tip:</span> Check your spam folder if you don't receive the email
            </p>
          </div>
        </form>

        {/* Image Section */}
        <div
          ref={imageRef}
          className={`relative bg-gradient-to-br from-[#ceea45] via-[#b8d93c] to-[#a3c933] w-full sm:w-[450px] lg:w-[650px] h-[400px] sm:h-[500px] lg:h-[600px] rounded-[40px] lg:rounded-l-[100px] flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-1000 border-4 border-white/20 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
          style={{ boxShadow: '0 25px 80px rgba(206,234,69,0.4), inset 0 0 100px rgba(255,255,255,0.1)' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 animate-float">
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center border-4 border-white/50 shadow-2xl">
              <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-gradient-to-br from-black via-gray-900 to-black rounded-full flex items-center justify-center shadow-inner">
                <Image
                  src={boy1}
                  alt="Forgot Password Illustration"
                  width={500}
                  height={500}
                  className="object-contain w-[300px] h-auto sm:w-[400px] lg:w-[500px] drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg animate-bounce-slow border-2 border-[#ceea45]/30">
            <p className="text-black font-bold text-sm">🔐 Secure Reset</p>
          </div>
          <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg animate-bounce-slow animation-delay-2000 border-2 border-[#ceea45]/30">
            <p className="text-black font-bold text-sm">📧 Check Email</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
};

export default Page;