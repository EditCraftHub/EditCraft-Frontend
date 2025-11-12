'use client'
import React, { useState, useEffect } from 'react';
import { useCreatePostMutation } from '../../Store/apiSclice/PostApiSlice';
import { Upload, X, DollarSign, Tag, Calendar, FileText, Image, Video, Briefcase, CheckCircle, Sparkles, ArrowLeft, Zap, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CreatePost = () => {
  const router = useRouter();
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobDuration: '',
    priceAmount: '',
    priceCurrency: 'INR',
    tags: '',
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'];
  const MAX_IMAGES = 3;
  const MAX_VIDEOS = 3;
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding new images would exceed the limit
    if (images.length + files.length > MAX_IMAGES) {
      setErrors(prev => ({ 
        ...prev, 
        images: `Maximum ${MAX_IMAGES} images allowed. You can upload ${MAX_IMAGES - images.length} more.` 
      }));
      return;
    }

    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length !== files.length) {
      setErrors(prev => ({ ...prev, images: 'Some files were not images and were skipped' }));
      setTimeout(() => {
        setErrors(prev => ({ ...prev, images: '' }));
      }, 3000);
    }

    setImages(prev => [...prev, ...validImages]);
    
    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, { file, url: reader.result }]);
      };
      reader.readAsDataURL(file);
    });

    // Clear any existing image errors
    if (errors.images) {
      setTimeout(() => {
        setErrors(prev => ({ ...prev, images: '' }));
      }, 3000);
    }
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding new videos would exceed the limit
    if (videos.length + files.length > MAX_VIDEOS) {
      setErrors(prev => ({ 
        ...prev, 
        videos: `Maximum ${MAX_VIDEOS} videos allowed. You can upload ${MAX_VIDEOS - videos.length} more.` 
      }));
      return;
    }

    const validVideos = files.filter(file => {
      if (!file.type.startsWith('video/')) {
        return false;
      }
      
      // Check video size
      if (file.size > MAX_VIDEO_SIZE) {
        setErrors(prev => ({ 
          ...prev, 
          videos: `Video "${file.name}" exceeds 50 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB)` 
        }));
        setTimeout(() => {
          setErrors(prev => ({ ...prev, videos: '' }));
        }, 5000);
        return false;
      }
      
      return true;
    });
    
    if (validVideos.length !== files.length && !errors.videos) {
      setErrors(prev => ({ ...prev, videos: 'Some files were not valid videos or exceeded size limit' }));
      setTimeout(() => {
        setErrors(prev => ({ ...prev, videos: '' }));
      }, 3000);
    }

    setVideos(prev => [...prev, ...validVideos]);
    
    validVideos.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviews(prev => [...prev, { file, url: reader.result, size: file.size }]);
      };
      reader.readAsDataURL(file);
    });

    // Clear any existing video errors after successful upload
    if (validVideos.length > 0 && errors.videos) {
      setTimeout(() => {
        setErrors(prev => ({ ...prev, videos: '' }));
      }, 3000);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    // Clear image error when removing
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
    // Clear video error when removing
    if (errors.videos) {
      setErrors(prev => ({ ...prev, videos: '' }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.jobDuration.trim()) newErrors.jobDuration = 'Job duration is required';
    if (!formData.priceAmount || formData.priceAmount <= 0) {
      newErrors.priceAmount = 'Valid price amount is required';
    }
    if (!formData.tags.trim()) newErrors.tags = 'At least one tag is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = new FormData();
    
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('jobDuration', formData.jobDuration);
    submitData.append('priceAmount', formData.priceAmount);
    submitData.append('priceCurrency', formData.priceCurrency);
    
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    submitData.append('tags', JSON.stringify(tagsArray));

    images.forEach(image => {
      submitData.append('image', image);
    });

    videos.forEach(video => {
      submitData.append('video', video);
    });

    try {
      const result = await createPost(submitData).unwrap();
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push('/Pages/Main/home');
      }, 2500);
    } catch (err) {
      setErrors({ submit: err?.data?.message || 'Failed to create post' });
    }
  };

  const handleBack = () => {
    router.push('/Pages/Main/home');
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        {/* Gaming particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#ceea45] rounded-full animate-particle-1"></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-particle-2"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-particle-3"></div>
          <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-particle-4"></div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#ceea45] rounded-full animate-particle-5"></div>
        </div>

        <div className="relative w-full max-w-[340px] sm:max-w-md">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-24 h-24 sm:w-40 sm:h-40 bg-[#ceea45]/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-purple-500/30 rounded-full animate-ping animation-delay-300"></div>
          </div>
          
          <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-[#ceea45] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center animate-scale-bounce shadow-[0_0_60px_rgba(206,234,69,0.4)] sm:shadow-[0_0_100px_rgba(206,234,69,0.5)]">
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-[#ceea45] rounded-full blur-xl sm:blur-2xl opacity-60 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-br from-[#ceea45] to-[#b8d93c] rounded-full p-3 sm:p-5 animate-rotate-slow">
                <CheckCircle className="w-14 h-14 sm:w-20 sm:h-20 text-black animate-scale-pulse" strokeWidth={3} />
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 animate-text-glow">
             WORK COMPLETE!
            </h3>
            <p className="text-gray-300 mb-2 sm:mb-3 text-base sm:text-lg font-semibold">
              Post Created Successfully
            </p>
            <p className="text-[#ceea45] text-xs sm:text-sm mb-4 sm:mb-6 font-bold animate-pulse">
              +1000 XP EARNED
            </p>
            
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-[#ceea45]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow" />
              <span className="text-xs sm:text-sm font-bold">Redirecting to Home Base...</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow animation-delay-300" />
            </div>

            {/* Progress bar */}
            <div className="mt-4 sm:mt-6 w-full bg-gray-800 rounded-full h-1.5 sm:h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#ceea45] to-[#b8d93c] animate-progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Gaming animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-40 h-40 sm:w-72 sm:h-72 bg-[#ceea45]/20 rounded-full mix-blend-screen filter blur-2xl sm:blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-40 h-40 sm:w-72 sm:h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-2xl sm:blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-4 sm:-bottom-8 left-20 sm:left-40 w-40 h-40 sm:w-72 sm:h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-2xl sm:blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-56 h-56 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-2xl sm:blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
      </div>

      {/* Cyberpunk grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px] pointer-events-none"></div>

      {/* Gaming scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5 sm:opacity-10 animate-scanlines" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)'
      }}></div>

      {/* Back Button - Gaming Style */}
      <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20">
        <button 
          onClick={handleBack}  
          className="group relative bg-gradient-to-r from-[#ceea45]/10 to-[#b8d93c]/10 hover:from-[#ceea45] hover:to-[#b8d93c] backdrop-blur-md px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-110 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-[#ceea45]/50 border-2 border-[#ceea45]/30 hover:border-[#ceea45] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center gap-1.5 sm:gap-2">
            <ArrowLeft className="text-[#ceea45] group-hover:text-black transition-colors duration-300 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[#ceea45] group-hover:text-black font-bold text-xs sm:text-sm transition-colors duration-300">BACK</span>
          </div>
        </button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-3 sm:px-4 py-16 sm:py-12">
        <div 
          className={`bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-2xl border-2 border-[#ceea45]/30 w-full max-w-[95%] sm:max-w-xl lg:max-w-2xl rounded-2xl sm:rounded-3xl lg:rounded-[40px] p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl transition-all duration-1000 hover:border-[#ceea45]/60 hover:shadow-[0_0_60px_rgba(206,234,69,0.25)] sm:hover:shadow-[0_0_80px_rgba(206,234,69,0.3)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
          style={{
            boxShadow: '0 15px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(206,234,69,0.2), inset 0 0 60px rgba(206,234,69,0.05)'
          }}
        >
          {/* Gaming Header */}
          <div className="mb-5 sm:mb-6 md:mb-8 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 sm:w-64 sm:h-64 bg-[#ceea45]/10 rounded-full blur-2xl sm:blur-3xl -z-10"></div>
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#ceea45] to-[#b8d93c] mb-3 sm:mb-4 animate-pulse-glow shadow-[0_0_30px_rgba(206,234,69,0.5)] sm:shadow-[0_0_40px_rgba(206,234,69,0.6)]">
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black animate-bounce-subtle" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent mb-2 sm:mb-3 tracking-tight animate-text-glow">
              CREATE WORK
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-wider font-semibold">Deploy Your Work Request</p>
            <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#ceea45] rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#ceea45] rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#ceea45] rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-4 md:space-y-5">
            {/* Title */}
            <div className="relative group">
              <label className="absolute -top-3 sm:-top-3 left-3 sm:left-4 bg-gradient-to-r from-gray-900 to-black px-1.5 sm:px-2 text-[10px] sm:text-xs text-[#ceea45] font-bold flex items-center gap-0.5 sm:gap-1 uppercase tracking-wider">
                <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Post Title <span className="text-white">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter mission title..."
                className={`rounded-xl sm:rounded-2xl h-[45px] sm:h-[50px] md:h-[55px] w-full px-3 sm:px-4 md:px-5 focus:outline-none border-2 transition-all bg-black/50 backdrop-blur-sm text-white placeholder:text-gray-600 group-hover:bg-black/70 text-sm sm:text-base font-medium ${
                  errors.title ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] sm:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-[#ceea45]/30 focus:border-[#ceea45] focus:shadow-[0_0_15px_rgba(206,234,69,0.3)] sm:focus:shadow-[0_0_20px_rgba(206,234,69,0.3)]'
                }`}
              />
              {errors.title && <p className="text-red-400 text-[11px] sm:text-sm mt-1.5 sm:mt-2 ml-1.5 sm:ml-2 font-semibold animate-shake">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="relative group">
              <label className="absolute -top-3 sm:-top-3 left-3 sm:left-4 bg-gradient-to-r from-gray-900 to-black px-1.5 sm:px-2 text-[10px] sm:text-xs text-[#ceea45] font-bold flex items-center gap-0.5 sm:gap-1 uppercase tracking-wider">
                <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Post Description <span className="text-white">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your mission objectives..."
                rows="3"
                className={`rounded-xl sm:rounded-2xl w-full px-3 sm:px-4 md:px-5 py-3 sm:py-4 focus:outline-none border-2 transition-all bg-black/50 backdrop-blur-sm text-white placeholder:text-gray-600 group-hover:bg-black/70 resize-none text-sm sm:text-base font-medium ${
                  errors.description ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] sm:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-[#ceea45]/30 focus:border-[#ceea45] focus:shadow-[0_0_15px_rgba(206,234,69,0.3)] sm:focus:shadow-[0_0_20px_rgba(206,234,69,0.3)]'
                }`}
              />
              {errors.description && <p className="text-red-400 text-[11px] sm:text-sm mt-1.5 sm:mt-2 ml-1.5 sm:ml-2 font-semibold animate-shake">{errors.description}</p>}
            </div>

            {/* Job Duration & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5">
              <div className="relative group">
                <label className="absolute -top-3 sm:-top-3 left-3 sm:left-4 bg-gradient-to-r from-gray-900 to-black px-1.5 sm:px-2 text-[10px] sm:text-xs text-[#ceea45] font-bold flex items-center gap-0.5 sm:gap-1 uppercase tracking-wider">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  Duration <span className="text-white">*</span>
                </label>
                <input
                  type="text"
                  name="jobDuration"
                  value={formData.jobDuration}
                  onChange={handleInputChange}
                  placeholder="e.g., 3 days"
                  className={`rounded-xl sm:rounded-2xl h-[45px] sm:h-[50px] md:h-[55px] w-full px-3 sm:px-4 md:px-5 focus:outline-none border-2 transition-all bg-black/50 backdrop-blur-sm text-white placeholder:text-gray-600 group-hover:bg-black/70 text-sm sm:text-base font-medium ${
                    errors.jobDuration ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] sm:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-[#ceea45]/30 focus:border-[#ceea45] focus:shadow-[0_0_15px_rgba(206,234,69,0.3)] sm:focus:shadow-[0_0_20px_rgba(206,234,69,0.3)]'
                  }`}
                />
                {errors.jobDuration && <p className="text-red-400 text-[11px] sm:text-sm mt-1.5 sm:mt-2 ml-1.5 sm:ml-2 font-semibold animate-shake">{errors.jobDuration}</p>}
              </div>

              <div className="grid grid-cols-[1.5fr_1fr] sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="relative group">
                  <label className="absolute -top-3 sm:-top-3 left-3 sm:left-4 bg-gradient-to-r from-gray-900 to-black px-1.5 sm:px-2 text-[10px] sm:text-xs text-[#ceea45] font-bold flex items-center gap-0.5 sm:gap-1 uppercase tracking-wider">
                    <DollarSign className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Budget <span className="text-white">*</span>
                  </label>
                  <input
                    type="number"
                    name="priceAmount"
                    value={formData.priceAmount}
                    onChange={handleInputChange}
                    placeholder="200"
                    min="0"
                    step="0.01"
                    className={`rounded-xl sm:rounded-2xl h-[45px] sm:h-[50px] md:h-[55px] w-full px-3 sm:px-4 md:px-5 focus:outline-none border-2 transition-all bg-black/50 backdrop-blur-sm text-white placeholder:text-gray-600 group-hover:bg-black/70 text-sm sm:text-base font-medium ${
                      errors.priceAmount ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] sm:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-[#ceea45]/30 focus:border-[#ceea45] focus:shadow-[0_0_15px_rgba(206,234,69,0.3)] sm:focus:shadow-[0_0_20px_rgba(206,234,69,0.3)]'
                    }`}
                  />
                  {errors.priceAmount && <p className="text-red-400 text-[11px] sm:text-sm mt-1.5 sm:mt-2 ml-1.5 sm:ml-2 font-semibold animate-shake">{errors.priceAmount}</p>}
                </div>

                <div className="relative group">
                  <label className="absolute -top-3 sm:-top-3 left-3 sm:left-4 bg-gradient-to-r from-gray-900 to-black px-1.5 sm:px-2 text-[10px] sm:text-xs text-[#ceea45] font-bold uppercase tracking-wider whitespace-nowrap">
                    Type
                  </label>
                  <select
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleInputChange}
                    className="rounded-xl sm:rounded-2xl h-[45px] sm:h-[50px] md:h-[55px] w-full px-2 sm:px-3 md:px-5 focus:outline-none border-2 border-[#ceea45]/30 focus:border-[#ceea45] transition-all bg-black/50 backdrop-blur-sm text-white group-hover:bg-black/70 appearance-none cursor-pointer text-sm sm:text-base font-medium focus:shadow-[0_0_15px_rgba(206,234,69,0.3)] sm:focus:shadow-[0_0_20px_rgba(206,234,69,0.3)]"
                  >
                    {currencies.map(curr => (
                      <option key={curr} value={curr} className="bg-gray-900 text-white">{curr}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="relative group">
              <label className="absolute -top-3 sm:-top-3 left-3 sm:left-4 bg-gradient-to-r from-gray-900 to-black px-1.5 sm:px-2 text-[10px] sm:text-xs text-[#ceea45] font-bold flex items-center gap-0.5 sm:gap-1 uppercase tracking-wider">
                <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Tags <span className="text-white">*</span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="logo, design, graphics"
                className={`rounded-xl sm:rounded-2xl h-[45px] sm:h-[50px] md:h-[55px] w-full px-3 sm:px-4 md:px-5 focus:outline-none border-2 transition-all bg-black/50 backdrop-blur-sm text-white placeholder:text-gray-600 group-hover:bg-black/70 text-sm sm:text-base font-medium ${
                  errors.tags ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] sm:shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-[#ceea45]/30 focus:border-[#ceea45] focus:shadow-[0_0_15px_rgba(206,234,69,0.3)] sm:focus:shadow-[0_0_20px_rgba(206,234,69,0.3)]'
                }`}
              />
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 ml-1.5 sm:ml-2 font-semibold">Comma separated tags</p>
              {errors.tags && <p className="text-red-400 text-[11px] sm:text-sm mt-1 ml-1.5 sm:ml-2 font-semibold animate-shake">{errors.tags}</p>}
            </div>

            {/* Image & Video Upload Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5">
              {/* Image Upload */}
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#ceea45] gap-1.5 sm:gap-2 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Image className="w-3 h-3 sm:w-4 sm:h-4" />
                    Images
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {images.length}/{MAX_IMAGES}
                  </span>
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={images.length >= MAX_IMAGES}
                  />
                  <label 
                    htmlFor="image-upload" 
                    className={`block border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center transition-all backdrop-blur-sm ${
                      images.length >= MAX_IMAGES
                        ? 'border-gray-600 bg-gray-800/30 cursor-not-allowed opacity-50'
                        : 'border-[#ceea45]/30 hover:border-[#ceea45] cursor-pointer bg-black/30 group-hover:bg-black/50 hover:shadow-[0_0_20px_rgba(206,234,69,0.2)] sm:hover:shadow-[0_0_30px_rgba(206,234,69,0.2)]'
                    }`}
                  >
                    <Upload className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto transition-colors mb-1.5 sm:mb-2 ${
                      images.length >= MAX_IMAGES ? 'text-gray-600' : 'text-gray-400 group-hover:text-[#ceea45] animate-bounce-subtle'
                    }`} />
                    <p className={`text-xs sm:text-sm font-semibold ${
                      images.length >= MAX_IMAGES ? 'text-gray-500' : 'text-gray-300'
                    }`}>
                      {images.length >= MAX_IMAGES ? 'MAX LIMIT REACHED' : 'UPLOAD FILES'}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">PNG, JPG, GIF</p>
                  </label>
                </div>
                {errors.images && (
                  <div className="flex items-start gap-1.5 sm:gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2 sm:p-2.5 animate-shake">
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-[10px] sm:text-xs font-semibold">{errors.images}</p>
                  </div>
                )}
                
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group/item">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 sm:h-20 object-cover rounded-lg sm:rounded-xl border-2 border-[#ceea45]/30 hover:border-[#ceea45] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 hover:bg-red-600 text-white p-1 sm:p-1.5 rounded-full opacity-0 group-hover/item:opacity-100 transition-all shadow-lg hover:scale-110"
                        >
                          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#ceea45] gap-1.5 sm:gap-2 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                    Videos
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {videos.length}/{MAX_VIDEOS}
                  </span>
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                    disabled={videos.length >= MAX_VIDEOS}
                  />
                  <label 
                    htmlFor="video-upload" 
                    className={`block border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-center transition-all backdrop-blur-sm ${
                      videos.length >= MAX_VIDEOS
                        ? 'border-gray-600 bg-gray-800/30 cursor-not-allowed opacity-50'
                        : 'border-[#ceea45]/30 hover:border-[#ceea45] cursor-pointer bg-black/30 group-hover:bg-black/50 hover:shadow-[0_0_20px_rgba(206,234,69,0.2)] sm:hover:shadow-[0_0_30px_rgba(206,234,69,0.2)]'
                    }`}
                  >
                    <Upload className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 mx-auto transition-colors mb-1.5 sm:mb-2 ${
                      videos.length >= MAX_VIDEOS ? 'text-gray-600' : 'text-gray-400 group-hover:text-[#ceea45] animate-bounce-subtle'
                    }`} />
                    <p className={`text-xs sm:text-sm font-semibold ${
                      videos.length >= MAX_VIDEOS ? 'text-gray-500' : 'text-gray-300'
                    }`}>
                      {videos.length >= MAX_VIDEOS ? 'MAX LIMIT REACHED' : 'UPLOAD FILES'}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">MP4, MOV, AVI (Max 50MB each)</p>
                  </label>
                </div>
                {errors.videos && (
                  <div className="flex items-start gap-1.5 sm:gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2 sm:p-2.5 animate-shake">
                    <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-[10px] sm:text-xs font-semibold">{errors.videos}</p>
                  </div>
                )}
                
                {videoPreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {videoPreviews.map((preview, index) => (
                      <div key={index} className="relative group/item">
                        <video
                          src={preview.url}
                          className="w-full h-20 sm:h-24 object-cover rounded-lg sm:rounded-xl border-2 border-[#ceea45]/30 hover:border-[#ceea45] transition-all"
                          controls
                        />
                        <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] text-[#ceea45] font-bold">
                          {formatFileSize(preview.size)}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 hover:bg-red-600 text-white p-1 sm:p-1.5 rounded-full opacity-0 group-hover/item:opacity-100 transition-all shadow-lg hover:scale-110"
                        >
                          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-500/10 border-2 border-red-500/50 text-red-400 px-3 sm:px-4 md:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl backdrop-blur-sm text-xs sm:text-sm md:text-base font-semibold animate-shake shadow-[0_0_20px_rgba(239,68,68,0.3)] sm:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                ⚠️ {errors.submit}
              </div>
            )}

            {/* Deploy Button */}
            <div className="pt-2 sm:pt-3 md:pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`relative w-full rounded-xl sm:rounded-2xl h-[50px] sm:h-[55px] md:h-[60px] bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-black text-base sm:text-lg transition-all overflow-hidden group uppercase tracking-wider ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_40px_rgba(206,234,69,0.7)] sm:hover:shadow-[0_0_60px_rgba(206,234,69,0.8)] hover:scale-[1.02] active:scale-95'
                }`}
              >
                <div className="absolute inset-0 bg-[#ceea45] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm sm:text-base md:text-lg">Deploying...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                      <span className="text-sm sm:text-base md:text-lg">Deploy Post</span>
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
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
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes scale-bounce {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-bounce {
          animation: scale-bounce 0.6s ease-out;
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(206, 234, 69, 0.5);
          }
          50% {
            text-shadow: 0 0 40px rgba(206, 234, 69, 0.8), 0 0 60px rgba(206, 234, 69, 0.6);
          }
        }
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes scale-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-scale-pulse {
          animation: scale-pulse 1s ease-in-out infinite;
        }
        @keyframes progress-bar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-progress-bar {
          animation: progress-bar 2.5s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes scanlines {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(10px);
          }
        }
        .animate-scanlines {
          animation: scanlines 8s linear infinite;
        }
        @keyframes particle-1 {
          0% { transform: translate(0, 0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(100px, -100px); opacity: 0; }
        }
        .animate-particle-1 {
          animation: particle-1 3s ease-out infinite;
        }
        @keyframes particle-2 {
          0% { transform: translate(0, 0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(-120px, 80px); opacity: 0; }
        }
        .animate-particle-2 {
          animation: particle-2 2.5s ease-out infinite;
          animation-delay: 0.5s;
        }
        @keyframes particle-3 {
          0% { transform: translate(0, 0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(80px, 120px); opacity: 0; }
        }
        .animate-particle-3 {
          animation: particle-3 3.5s ease-out infinite;
          animation-delay: 1s;
        }
        @keyframes particle-4 {
          0% { transform: translate(0, 0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(-90px, -90px); opacity: 0; }
        }
        .animate-particle-4 {
          animation: particle-4 2.8s ease-out infinite;
          animation-delay: 1.5s;
        }
        @keyframes particle-5 {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          50% { opacity: 1; transform: scale(2); }
          100% { transform: translate(150px, 100px) scale(0); opacity: 0; }
        }
        .animate-particle-5 {
          animation: particle-5 4s ease-out infinite;
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
};

export default CreatePost;