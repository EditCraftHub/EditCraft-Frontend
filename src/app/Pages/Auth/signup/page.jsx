'use client'

import { boy1 } from "@/app/Assets/images/Images";
import { useSignupMutation } from "@/app/Store/apiSclice/AuthApiSlice";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setSignupEmail } from "@/app/Store/Sclies/authSlice";
import { FaArrowLeft } from "react-icons/fa6";

const Page = () => {
  const signupRef = useRef(null);
  const imageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: ""
  });

  const homeclick = () => {
    router.push("/");
  };

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = "Full name must be at least 2 characters";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = "Username must be 3-20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 20) {
      newErrors.password = "Password cannot exceed 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form", { autoClose: 3000 });
      return;
    }

    try {
      const response = await signup(formData).unwrap();

      dispatch(setSignupEmail(formData.email));

      toast.success(response.message || "Signup successful! Please verify your OTP.", { 
        autoClose: 3000 
      });

      setFormData({
        fullname: "",
        username: "",
        email: "",
        password: ""
      });

      setTimeout(() => {
        router.push("/Pages/Auth/verify-otp");
      }, 1500);

    } catch (err) {
      console.error("Signup error:", err);

      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        err.data.errors.forEach((error) => {
          toast.error(error.msg || error.message || error, { autoClose: 4000 });
        });
      } else if (err?.data?.message) {
        toast.error(err.data.message, { autoClose: 4000 });
      } else if (err?.error) {
        toast.error(err.error, { autoClose: 4000 });
      } else {
        toast.error("Signup failed. Please try again.", { autoClose: 4000 });
      }
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <ToastContainer position="top-right" autoClose={3000} />

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
          onClick={homeclick}  
          className="group bg-white/5 hover:bg-[#ceea45] backdrop-blur-md p-4 rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[#ceea45]/50 border border-white/10 hover:border-[#ceea45]"
        >
          <FaArrowLeft className="text-white group-hover:text-black transition-colors duration-300" size={20} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 lg:px-20 gap-10 lg:gap-16 py-10">
        
        {/* Signup Box */}
        <form
          ref={signupRef}
          onSubmit={handleSubmit}
          className={`bg-white/10 backdrop-blur-2xl border border-white/20 w-full sm:w-[400px] lg:w-[450px] h-auto rounded-[40px] flex flex-col items-center justify-start p-8 lg:p-10 shadow-2xl transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}
          style={{ 
            boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)' 
          }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent mb-3 tracking-tight">
              Welcome to Editcraft
            </h2>
            <p className="text-gray-300 text-sm">Create your account to get started</p>
          </div>

          <div className="flex flex-col gap-5 w-full">
            {/* Full Name */}
            <div className="relative group">
              <label className="absolute -top-3 left-4 bg-gradient-to-r from-gray-900 to-black px-2 text-xs text-gray-300 font-semibold">
                Full Name <span className="text-[#ceea45]">*</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={`rounded-2xl h-[55px] w-full px-5 focus:outline-none border-2 transition-all bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500 group-hover:border-[#ceea45]/50 group-hover:bg-white/10 ${
                  errors.fullname ? 'border-red-500' : 'border-white/20 focus:border-[#ceea45] focus:bg-white/10'
                }`}
              />
              {errors.fullname && (
                <p className="text-red-400 text-xs mt-1 ml-2">{errors.fullname}</p>
              )}
            </div>

            {/* Username */}
            <div className="relative group">
              <label className="absolute -top-3 left-4 bg-gradient-to-r from-gray-900 to-black px-2 text-xs text-gray-300 font-semibold">
                Username <span className="text-[#ceea45]">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                minLength={3}
                maxLength={20}
                className={`rounded-2xl h-[55px] w-full px-5 focus:outline-none border-2 transition-all bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500 group-hover:border-[#ceea45]/50 group-hover:bg-white/10 ${
                  errors.username ? 'border-red-500' : 'border-white/20 focus:border-[#ceea45] focus:bg-white/10'
                }`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1 ml-2">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative group">
              <label className="absolute -top-3 left-4 bg-gradient-to-r from-gray-900 to-black px-2 text-xs text-gray-300 font-semibold">
                Email <span className="text-[#ceea45]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className={`rounded-2xl h-[55px] w-full px-5 focus:outline-none border-2 transition-all bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500 group-hover:border-[#ceea45]/50 group-hover:bg-white/10 ${
                  errors.email ? 'border-red-500' : 'border-white/20 focus:border-[#ceea45] focus:bg-white/10'
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 ml-2">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="absolute -top-3 left-4 bg-gradient-to-r from-gray-900 to-black px-2 text-xs text-gray-300 font-semibold">
                Password <span className="text-[#ceea45]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  maxLength={20}
                  className={`rounded-2xl h-[55px] w-full px-5 pr-12 focus:outline-none border-2 transition-all bg-white/5 backdrop-blur-sm text-white placeholder:text-gray-500 group-hover:border-[#ceea45]/50 group-hover:bg-white/10 ${
                    errors.password ? 'border-red-500' : 'border-white/20 focus:border-[#ceea45] focus:bg-white/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ceea45] transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 ml-2">{errors.password}</p>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`relative rounded-2xl h-[55px] w-full bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-bold text-lg transition-all overflow-hidden group mt-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-[#ceea45]/50 hover:scale-[1.02]'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#b8d93c] to-[#ceea45] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </span>
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-300">
            Already have an account?{" "}
            <Link href="/Pages/Auth/login" className="text-[#ceea45] hover:text-[#b8d93c] font-bold transition-colors hover:underline">
              Login
            </Link>
          </p>
        </form>

        {/* Image Section */}
        <div
          ref={imageRef}
          className={`relative bg-gradient-to-br from-[#ceea45] via-[#b8d93c] to-[#a3c933] w-full sm:w-[450px] lg:w-[650px] h-[400px] sm:h-[500px] lg:h-[600px] rounded-[40px] lg:rounded-l-[100px] flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-1000 border-4 border-white/20 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
          }`}
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
                  alt="Boy Image"
                  width={500}
                  height={500}
                  className="object-contain w-[300px] h-auto sm:w-[400px] lg:w-[500px] drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob { 
          0%,100%{transform:translate(0,0) scale(1);} 
          33%{transform:translate(30px,-50px) scale(1.1);} 
          66%{transform:translate(-20px,20px) scale(0.9);} 
        }
        @keyframes float { 
          0%,100%{transform:translateY(0px) rotate(0deg);} 
          50%{transform:translateY(-20px) rotate(2deg);} 
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }
      `}</style>
    </div>
  );
};

export default Page;