'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useCreatePostMutation } from '../../Store/apiSclice/PostApiSlice';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Upload, X, DollarSign, Tag, Calendar, FileText, Image, Video, 
  Briefcase, CheckCircle, Sparkles, ArrowLeft, Zap, AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// ✅ ANIMATED BACKGROUND
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(206,234,69,0.12),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(206,234,69,0.08),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(206,234,69,0.08),transparent_50%)]" />
    
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl"
        style={{
          width: `${200 + i * 80}px`,
          height: `${200 + i * 80}px`,
          background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(206,234,69,0.15)' : 'rgba(206,234,69,0.12)'}, transparent 70%)`,
          left: `${5 + i * 25}%`,
          top: `${10 + i * 20}%`,
        }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -40, 40, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 15 + i * 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}

    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
  </div>
);

// ✅ BENTO CARD
const BentoCard = ({ children, className = '', delay = 0, span = '', hover = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={hover ? { 
        y: -8, 
        transition: { duration: 0.3, ease: "easeOut" } 
      } : {}}
      className={`group relative bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.08] overflow-hidden ${span} ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ceea45]/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-gray-900/95 to-black/95" />
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

// ✅ INPUT FIELD COMPONENT
const InputField = ({ label, name, value, onChange, error, type = "text", placeholder, icon: Icon, delay }) => (
  <BentoCard delay={delay} hover={false}>
    <div className="p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={18} className="text-[#ceea45]" />}
        <label className="text-xs md:text-sm font-bold text-[#ceea45] uppercase tracking-wider">
          {label} <span className="text-white">*</span>
        </label>
      </div>
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.01" : undefined}
        className={`w-full px-4 py-3 rounded-lg bg-white/5 border-2 text-white placeholder:text-gray-600 transition-all focus:outline-none text-sm md:text-base font-medium ${
          error 
            ? 'border-red-500/50 focus:border-red-500' 
            : 'border-white/10 focus:border-[#ceea45]/50'
        }`}
      />
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  </BentoCard>
);

// ✅ TEXTAREA COMPONENT
const TextAreaField = ({ label, name, value, onChange, error, placeholder, icon: Icon, delay }) => (
  <BentoCard delay={delay} hover={false} span="md:col-span-2">
    <div className="p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={18} className="text-[#ceea45]" />}
        <label className="text-xs md:text-sm font-bold text-[#ceea45] uppercase tracking-wider">
          {label} <span className="text-white">*</span>
        </label>
      </div>
      
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="4"
        className={`w-full px-4 py-3 rounded-lg bg-white/5 border-2 text-white placeholder:text-gray-600 transition-all focus:outline-none resize-none text-sm md:text-base font-medium ${
          error 
            ? 'border-red-500/50 focus:border-red-500' 
            : 'border-white/10 focus:border-[#ceea45]/50'
        }`}
      />
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  </BentoCard>
);

// ✅ SELECT COMPONENT
const SelectField = ({ label, name, value, onChange, options, icon: Icon, delay }) => (
  <BentoCard delay={delay} hover={false}>
    <div className="p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={18} className="text-[#ceea45]" />}
        <label className="text-xs md:text-sm font-bold text-[#ceea45] uppercase tracking-wider">
          {label}
        </label>
      </div>
      
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border-2 border-white/10 text-white focus:border-[#ceea45]/50 transition-all focus:outline-none text-sm md:text-base font-medium"
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-gray-900 text-white">
            {opt}
          </option>
        ))}
      </select>
    </div>
  </BentoCard>
);

// ✅ FILE UPLOAD CARD
const FileUploadCard = ({ label, files, previews, onUpload, onRemove, error, maxFiles, accept, icon: Icon, delay, isVideo }) => (
  <BentoCard delay={delay} hover={false}>
    <div className="p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-[#ceea45]" />}
          <label className="text-xs md:text-sm font-bold text-[#ceea45] uppercase tracking-wider">
            {label}
          </label>
        </div>
        <span className="text-xs text-gray-500">
          {files.length}/{maxFiles}
        </span>
      </div>
      
      <div className="relative">
        <input
          type="file"
          accept={accept}
          multiple
          onChange={onUpload}
          disabled={files.length >= maxFiles}
          className="hidden"
          id={`upload-${label}`}
        />
        
        <label 
          htmlFor={`upload-${label}`}
          className={`block border-2 border-dashed rounded-lg p-4 md:p-6 text-center cursor-pointer transition-all ${
            files.length >= maxFiles
              ? 'border-gray-600 bg-gray-800/30 opacity-50 cursor-not-allowed'
              : 'border-[#ceea45]/30 hover:border-[#ceea45] bg-white/5 hover:bg-white/10'
          }`}
        >
          <motion.div
            whileHover={{ scale: files.length < maxFiles ? 1.1 : 1 }}
            className="flex flex-col items-center gap-2"
          >
            <Upload className={`${files.length >= maxFiles ? 'text-gray-600' : 'text-[#ceea45]'}`} size={20} />
            <p className="text-xs md:text-sm font-semibold text-gray-300">
              {files.length >= maxFiles ? 'LIMIT REACHED' : 'DROP OR CLICK'}
            </p>
          </motion.div>
        </label>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center gap-2 p-2 bg-red-500/10 rounded border border-red-500/30"
        >
          <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs">{error}</p>
        </motion.div>
      )}

      {previews.length > 0 && (
        <div className={`mt-4 grid ${isVideo ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
          {previews.map((preview, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group/preview rounded-lg overflow-hidden"
            >
              {isVideo ? (
                <video
                  src={preview.url}
                  className="w-full h-20 object-cover rounded-lg border-2 border-[#ceea45]/30"
                  controls
                />
              ) : (
                <img
                  src={preview.url}
                  alt={`Preview ${idx}`}
                  className="w-full h-16 object-cover rounded-lg border-2 border-[#ceea45]/30"
                />
              )}

              <motion.button
                type="button"
                onClick={() => onRemove(idx)}
                whileHover={{ scale: 1.2 }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover/preview:opacity-100 transition-all"
              >
                <X size={14} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </BentoCard>
);

// ✅ SUCCESS MODAL
const SuccessModal = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl border border-[#ceea45]/30 p-8 md:p-12 text-center max-w-md relative overflow-hidden"
        >
          <motion.div
            className="absolute top-0 left-0 w-40 h-40 bg-[#ceea45]/20 rounded-full blur-3xl -z-10"
            animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block p-4 bg-[#ceea45]/20 rounded-full mb-6"
          >
            <CheckCircle size={48} className="text-[#ceea45]" />
          </motion.div>

          <h3 className="text-3xl font-black text-white mb-2">Success!</h3>
          <p className="text-gray-400 mb-6">Your post has been created and deployed</p>

          <motion.div
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 2.5 }}
            className="w-full h-1 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] rounded-full"
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function CreatePost() {
  const router = useRouter();
  const [createPost, { isLoading }] = useCreatePostMutation();
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
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > MAX_IMAGES) {
      setErrors(prev => ({ ...prev, images: `Max ${MAX_IMAGES} images` }));
      return;
    }
    
    const validImages = files.filter(file => file.type.startsWith('image/'));
    setImages(prev => [...prev, ...validImages]);
    
    validImages.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, { file, url: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (videos.length + files.length > MAX_VIDEOS) {
      setErrors(prev => ({ ...prev, videos: `Max ${MAX_VIDEOS} videos` }));
      return;
    }

    const validVideos = files.filter(file => {
      if (!file.type.startsWith('video/')) return false;
      if (file.size > MAX_VIDEO_SIZE) {
        setErrors(prev => ({ ...prev, videos: 'Video too large (50MB max)' }));
        return false;
      }
      return true;
    });
    
    setVideos(prev => [...prev, ...validVideos]);
    validVideos.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviews(prev => [...prev, { file, url: reader.result, size: file.size }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeVideo = (idx) => {
    setVideos(prev => prev.filter((_, i) => i !== idx));
    setVideoPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Required';
    if (!formData.description.trim()) newErrors.description = 'Required';
    if (!formData.jobDuration.trim()) newErrors.jobDuration = 'Required';
    if (!formData.priceAmount || formData.priceAmount <= 0) newErrors.priceAmount = 'Required';
    if (!formData.tags.trim()) newErrors.tags = 'Required';
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
    submitData.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())));
    
    images.forEach(img => submitData.append('image', img));
    videos.forEach(vid => submitData.append('video', vid));

    try {
      await createPost(submitData).unwrap();
      setShowSuccess(true);
      setTimeout(() => router.push('/Pages/Main/home'), 2500);
    } catch (err) {
      setErrors({ submit: err?.data?.message || 'Failed to create post' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <AnimatedBackground />
      <SuccessModal show={showSuccess} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <div>
            <motion.h1
              className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-[#ceea45] to-white bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% center', '200% center'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              Create Work and hire best freelancers
            </motion.h1>
            <p className="text-gray-400 mt-2">Deploy your next Work need</p>
          </div>

          <motion.button
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all"
          >
            <ArrowLeft size={20} className="text-[#ceea45]" />
          </motion.button>
        </motion.div>

        {/* Bento Grid Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Title - Large */}
          <TextAreaField
            label="work Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={errors.title}
            placeholder="What's your project about?"
            icon={FileText}
            delay={0.1}
          />

          {/* Description - Large */}
          <div className="md:col-span-2 lg:col-span-3">
            <BentoCard delay={0.15} hover={false}>
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-[#ceea45]" />
                  <label className="text-xs md:text-sm font-bold text-[#ceea45] uppercase tracking-wider">
                    Description <span className="text-white">*</span>
                  </label>
                </div>
                
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your work in detail..."
                  rows="5"
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border-2 text-white placeholder:text-gray-600 transition-all focus:outline-none resize-none text-sm md:text-base font-medium ${
                    errors.description 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#ceea45]/50'
                  }`}
                />
                
                {errors.description && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2"
                  >
                    {errors.description}
                  </motion.p>
                )}
              </div>
            </BentoCard>
          </div>

          {/* Duration */}
          <InputField
            label="Term Duration"
            name="jobDuration"
            value={formData.jobDuration}
            onChange={handleInputChange}
            error={errors.jobDuration}
            placeholder="Long Term"
            icon={Calendar}
            delay={0.2}
          />

          {/* Price */}
          <InputField
            label="Budget Amount"
            name="priceAmount"
            type="number"
            value={formData.priceAmount}
            onChange={handleInputChange}
            error={errors.priceAmount}
            placeholder="500"
            icon={DollarSign}
            delay={0.25}
          />

          {/* Currency */}
          <SelectField
            label="Currency"
            name="priceCurrency"
            value={formData.priceCurrency}
            onChange={handleInputChange}
            options={currencies}
            icon={DollarSign}
            delay={0.3}
          />

          {/* Tags - Large */}
          <div className="md:col-span-2">
            <BentoCard delay={0.35} hover={false}>
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={18} className="text-[#ceea45]" />
                  <label className="text-xs md:text-sm font-bold text-[#ceea45] uppercase tracking-wider">
                    Tags <span className="text-white">*</span>
                  </label>
                </div>
                
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="design, logo, web"
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border-2 text-white placeholder:text-gray-600 transition-all focus:outline-none text-sm md:text-base font-medium ${
                    errors.tags 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#ceea45]/50'
                  }`}
                />

                <p className="text-xs text-gray-500 mt-2">Comma separated</p>
                
                {errors.tags && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-2"
                  >
                    {errors.tags}
                  </motion.p>
                )}
              </div>
            </BentoCard>
          </div>

          {/* Images Upload */}
          <FileUploadCard
            label="Images"
            files={images}
            previews={imagePreviews}
            onUpload={handleImageUpload}
            onRemove={removeImage}
            error={errors.images}
            maxFiles={MAX_IMAGES}
            accept="image/*"
            icon={Image}
            delay={0.4}
          />

          {/* Videos Upload */}
          <FileUploadCard
            label="Videos"
            files={videos}
            previews={videoPreviews}
            onUpload={handleVideoUpload}
            onRemove={removeVideo}
            error={errors.videos}
            maxFiles={MAX_VIDEOS}
            accept="video/*"
            icon={Video}
            delay={0.45}
            isVideo
          />

          {/* Submit Error */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="md:col-span-2 lg:col-span-4 flex items-center gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/30"
            >
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </motion.div>
          )}

          {/* Submit Button - Large */}
          <motion.button
            onClick={handleSubmit}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="md:col-span-2 lg:col-span-4 relative overflow-hidden group p-6 rounded-2xl bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black font-black text-lg disabled:opacity-70 transition-all"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white blur-xl transition-opacity" />
            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Deploy Mission</span>
                  <ChevronRight size={20} />
                </>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}