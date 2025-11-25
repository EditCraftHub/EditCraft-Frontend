'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { 
  User, Briefcase, Image as ImageIcon, Video, FolderKanban, Settings,
  Upload, X, Plus, Save, Eye, Trash2, Check, AlertCircle, ChevronRight,
  ChevronLeft, Sparkles, Award, Code, Globe, Mail, Phone, Star, Loader2,
  CheckCircle2
} from 'lucide-react';
import { 
  useCreatePortfolioMutation, 
  useUpdatePortfolioMutation,
  useGetMyPortfolioQuery,
  useDeletePhotoMutation,
  useDeleteVideoMutation
} from '@/app/Store/apiSclice/portfolioApiSlice';
import { toast } from 'react-hot-toast';

// ✅ ADD THIS COMPONENT HERE - RIGHT AFTER IMPORTS
const ExternalLink = ({ url, platform, children }) => {
  // Ensure URL has protocol
  const safeUrl = url && !url.startsWith('http') ? `https://${url}` : url;

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault();
        if (safeUrl) {
          window.open(safeUrl, '_blank', 'noopener,noreferrer');
        }
      }}
      className="text-[#ceea45] hover:underline cursor-pointer"
    >
      {children || platform}
    </a>
  );
};

const CATEGORIES = [
  "Graphic Designer", "UI/UX Designer", "Illustrator", "Brand Designer",
  "Motion Designer", "3D Artist", "Photographer", "Video Editor",
  "Product Designer", "Art Director", "Content Writer", "Copywriter",
  "Social Media Manager", "Digital Marketer", "SEO Specialist", "Other"
];

const AVAILABILITY_OPTIONS = [
  "Available for hire",
  "Open to opportunities",
  "Fully booked",
  "Not available"
];

// Detect if device is low-end or mobile
const useDevicePerformance = () => {
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  useEffect(() => {
    // Check for low-end device indicators
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
      const hasSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      setIsLowEnd(isMobile || hasLowMemory || hasSlowCPU || prefersReducedMotion);
    };
    
    checkPerformance();
  }, []);
  
  return isLowEnd;
};

// Lightweight Background - Optimized
const OptimizedBackground = memo(({ isLowEnd }) => {
  if (isLowEnd) {
    // Simple gradient for low-end devices
    return (
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(206,234,69,0.1),transparent_50%)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(206,234,69,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.1),transparent_50%)]" />
      
      {/* Single optimized blob - CSS only, no JS animation */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-[80px] animate-blob"
        style={{ 
          background: 'rgba(206, 234, 69, 0.4)', 
          top: '10%', 
          left: '5%',
          willChange: 'transform'
        }} 
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(206,234,69,1) 1px, transparent 1px), linear-gradient(90deg, rgba(206,234,69,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} 
      />
    </div>
  );
});

OptimizedBackground.displayName = 'OptimizedBackground';

// Optimized Success Modal - Reduced animations
const SuccessModal = memo(({ isOpen, isUpdate }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const isLowEnd = useDevicePerformance();

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/Pages/Features/myportfolio');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Simple backdrop - no blur on mobile */}
      <div 
        className={`absolute inset-0 bg-black/90 ${!isLowEnd ? 'backdrop-blur-sm' : ''}`}
        onClick={() => router.push('/Pages/Main/profile')}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-[#ceea45]/30 p-8 text-center shadow-2xl"
      >
        {/* Success Icon - Simple animation */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#ceea45] to-[#a8c930] flex items-center justify-center">
          <CheckCircle2 size={40} className="text-black" />
        </div>

        <h2 className="text-2xl font-black text-white mb-2">
          {isUpdate ? 'Portfolio Updated!' : 'Portfolio Created!'}
        </h2>
        
        <p className="text-gray-400 mb-4">
          {isUpdate 
            ? 'Your changes have been saved successfully.' 
            : 'Your portfolio is now live!'}
        </p>

        <div className="text-4xl mb-4">🎉</div>

        <p className="text-sm text-gray-500 mb-2">Redirecting in</p>
        <div className="text-3xl font-black text-[#ceea45] mb-6">{countdown}</div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push('/Pages/Main/profile')}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ceea45] to-[#a8c930] text-black font-bold transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <User size={18} />
            View Profile
          </button>
          
          <button
            onClick={() => router.push('/Pages/Features/myportfolio')}
            className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Eye size={18} />
            Preview
          </button>
        </div>
      </motion.div>
    </div>
  );
});

SuccessModal.displayName = 'SuccessModal';

// Optimized Tag Input - Memoized
const TagInput = memo(({ 
  value = [], 
  onChange, 
  placeholder, 
  colorClass = 'bg-[#ceea45]/20 text-[#ceea45]',
  error,
  maxTags = 20
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const addTag = useCallback((tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
  }, [value, onChange, maxTags]);

  const removeTag = useCallback((indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  }, [value, onChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  }, [inputValue, value.length, addTag, removeTag]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const tags = pastedText.split(',').map(tag => tag.trim()).filter(tag => tag);
    const newTags = [...value];
    tags.forEach(tag => {
      if (!newTags.includes(tag) && newTags.length < maxTags) {
        newTags.push(tag);
      }
    });
    onChange(newTags);
  }, [value, maxTags, onChange]);

  return (
    <div className="space-y-2">
      <div 
        className={`min-h-[48px] px-3 py-2 rounded-xl bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} focus-within:border-[#ceea45] transition-colors flex flex-wrap gap-2 items-center cursor-text`}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${colorClass} text-xs font-medium`}
          >
            <span className="max-w-[150px] truncate">{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? placeholder : value.length >= maxTags ? 'Max reached' : 'Add more...'}
          disabled={value.length >= maxTags}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm py-1"
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400">,</kbd> to add</span>
        <span>{value.length}/{maxTags}</span>
      </div>
      
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
});

TagInput.displayName = 'TagInput';

// File Preview with cleanup
const useFilePreview = (file) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Cleanup function to revoke the URL
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof file === 'string') {
      setPreview(file);
    }
  }, [file]);

  return preview;
};

// Optimized Image Preview Component
const ImagePreview = memo(({ file, url, onRemove, index }) => {
  const preview = useFilePreview(file);
  const displayUrl = url || preview;

  if (!displayUrl) return null;

  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 group">
      <img 
        src={displayUrl} 
        alt={`Photo ${index + 1}`} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <button 
        type="button" 
        onClick={onRemove}
        className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 size={20} className="text-red-500" />
      </button>
      <div className="absolute bottom-2 left-2 text-xs text-white/70 bg-black/50 px-2 py-1 rounded">
        {index + 1}
      </div>
    </div>
  );
});

ImagePreview.displayName = 'ImagePreview';

// Video Preview Component
const VideoPreview = memo(({ file, url, onRemove }) => {
  const preview = useFilePreview(file);
  const displayUrl = url || preview;

  if (!displayUrl) return null;

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 group">
      <video 
        src={displayUrl} 
        className="w-full h-full object-cover" 
        controls 
        preload="metadata"
      />
      <button 
        type="button" 
        onClick={onRemove}
        className="absolute top-2 right-2 p-2 rounded-lg bg-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/40"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
});

VideoPreview.displayName = 'VideoPreview';

// Simple Glass Card - No blur on mobile
const GlassCard = memo(({ children, className = '', isLowEnd }) => (
  <div className={`bg-white/[0.03] ${!isLowEnd ? 'backdrop-blur-sm' : ''} border border-white/10 rounded-2xl ${className}`}>
    {children}
  </div>
));

GlassCard.displayName = 'GlassCard';

export default function CreateEditPortfolio() {
  const router = useRouter();
  const isLowEnd = useDevicePerformance();
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { data: existingPortfolio, isLoading: isLoadingPortfolio, refetch } = useGetMyPortfolioQuery();
  const [createPortfolio, { isLoading: isCreating }] = useCreatePortfolioMutation();
  const [updatePortfolio, { isLoading: isUpdating }] = useUpdatePortfolioMutation();
  const [deletePhoto] = useDeletePhotoMutation();
  const [deleteVideo] = useDeleteVideoMutation();

  const [formData, setFormData] = useState({
    profilePic: null, tagline: '', bio: '', category: '', tags: [], 
    specializations: [], mainSkills: [], experience: [{ title: '', company: '', duration: '', description: '' }],
    education: [{ degree: '', institution: '', year: '', description: '' }], software: [],
    photos: [], videos: [], projects: [], certifications: [], awards: [],
    languages: [], testimonials: [], contacts: { email: '', phone: '', website: '' },
    externalLinks: [], availability: { isAvailable: true, status: 'Available for hire' },
    services: [], theme: 'modern', isPublic: true, metaTitle: '', metaDescription: ''
  });

  const [errors, setErrors] = useState({});

  const tabs = useMemo(() => [
    { id: 0, name: 'Basic Info', icon: User },
    { id: 1, name: 'Professional', icon: Briefcase },
    { id: 2, name: 'Media', icon: ImageIcon },
    { id: 3, name: 'Projects', icon: FolderKanban },
    { id: 4, name: 'Additional', icon: Award },
    { id: 5, name: 'Settings', icon: Settings }
  ], []);

  // Calculate completion percentage - memoized
  const completionPercentage = useMemo(() => {
    const requiredFields = [
      formData.tagline, 
      formData.bio, 
      formData.category, 
      formData.tags.length > 0, 
      formData.mainSkills.length > 0
    ];
    const completed = requiredFields.filter(Boolean).length;
    return Math.round((completed / requiredFields.length) * 100);
  }, [formData.tagline, formData.bio, formData.category, formData.tags.length, formData.mainSkills.length]);

  useEffect(() => {
    if (existingPortfolio?.portfolio) {
      setIsEditMode(true);
      const p = existingPortfolio.portfolio;
      
      setFormData({
        profilePic: null,
        tagline: p.tagline || '',
        bio: p.bio || '',
        category: p.category || '',
        tags: p.tags || [],
        specializations: p.specializations || [],
        mainSkills: p.mainSkills?.map(s => typeof s === 'string' ? s : s.name) || [],
        experience: p.experience?.length > 0 ? p.experience : [{ title: '', company: '', duration: '', description: '' }],
        education: p.education?.length > 0 ? p.education : [{ degree: '', institution: '', year: '', description: '' }],
        software: p.software?.map(s => typeof s === 'string' ? s : s.name) || [],
        photos: p.photos?.map(ph => ({ ...ph, isExisting: true })) || [],
        videos: p.videos?.map(v => ({ ...v, isExisting: true })) || [],
        projects: p.projects || [],
        certifications: p.certifications || [],
        awards: p.awards || [],
        languages: p.languages?.map(l => typeof l === 'string' ? l : l.name) || [],
        testimonials: p.testimonials || [],
        contacts: p.contacts || { email: '', phone: '', website: '' },
        externalLinks: p.externalLinks || [],
        availability: p.availability || { isAvailable: true, status: 'Available for hire' },
        services: p.services?.map(s => typeof s === 'string' ? s : s.name) || [],
        theme: p.theme || 'modern',
        isPublic: p.isPublic !== undefined ? p.isPublic : true,
        metaTitle: p.metaTitle || '',
        metaDescription: p.metaDescription || ''
      });
    }
  }, [existingPortfolio]);

  // Memoized callbacks
  const updateArrayField = useCallback((fieldName, newValue) => {
    setFormData(prev => ({ ...prev, [fieldName]: newValue }));
    setErrors(prev => ({ ...prev, [fieldName]: null }));
  }, []);

  const updateField = useCallback((fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.tagline.trim()) newErrors.tagline = 'Tagline is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required';
    if (formData.mainSkills.length === 0) newErrors.mainSkills = 'At least one main skill is required';

    setErrors(newErrors);
    const errorCount = Object.keys(newErrors).length;
    if (errorCount > 0) {
      toast.error(`${errorCount} field(s) need attention`);
    }
    return errorCount === 0;
  }, [formData.tagline, formData.bio, formData.category, formData.tags.length, formData.mainSkills.length]);

  const handleFileUpload = useCallback((e, type) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const maxSize = type === 'videos' ? 400 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds size limit`);
        return;
      }

      if (type === 'profilePic') {
        setFormData(prev => ({ ...prev, profilePic: file }));
      } else if (type === 'photos') {
        setFormData(prev => {
          if (prev.photos.length >= 10) {
            toast.error('Maximum 10 photos allowed');
            return prev;
          }
          return { ...prev, photos: [...prev.photos, { file, isNew: true }] };
        });
      } else if (type === 'videos') {
        setFormData(prev => {
          if (prev.videos.length >= 10) {
            toast.error('Maximum 10 videos allowed');
            return prev;
          }
          return { ...prev, videos: [...prev.videos, { file, isNew: true }] };
        });
      }
    });
    
    // Reset input
    e.target.value = '';
  }, []);

  const removeFile = useCallback(async (type, index) => {
    if (type === 'profilePic') {
      setFormData(prev => ({ ...prev, profilePic: null }));
    } else if (type === 'photos') {
      const photo = formData.photos[index];
      if (photo.isExisting && photo._id && isEditMode) {
        try {
          await deletePhoto(photo._id).unwrap();
          toast.success('Photo deleted');
        } catch (error) {
          toast.error('Failed to delete photo');
          return;
        }
      }
      setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
    } else if (type === 'videos') {
      const video = formData.videos[index];
      if (video.isExisting && video._id && isEditMode) {
        try {
          await deleteVideo(video._id).unwrap();
          toast.success('Video deleted');
        } catch (error) {
          toast.error('Failed to delete video');
          return;
        }
      }
      setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }));
    }
  }, [formData.photos, formData.videos, isEditMode, deletePhoto, deleteVideo]);

  const addDynamicField = useCallback((fieldName) => {
    const templates = {
      experience: { title: '', company: '', duration: '', description: '' },
      education: { degree: '', institution: '', year: '', description: '' },
      projects: { title: '', description: '', link: '' },
      certifications: { name: '', issuer: '', date: '', link: '' },
      awards: { title: '', issuer: '', date: '', description: '' },
      externalLinks: { platform: '', url: '' }
    };
    setFormData(prev => ({ ...prev, [fieldName]: [...prev[fieldName], templates[fieldName]] }));
  }, []);

  const removeDynamicField = useCallback((fieldName, index) => {
    setFormData(prev => ({ ...prev, [fieldName]: prev[fieldName].filter((_, i) => i !== index) }));
  }, []);

  const updateDynamicField = useCallback((fieldName, index, key, value) => {
    setFormData(prev => {
      const newArray = [...prev[fieldName]];
      newArray[index] = { ...newArray[index], [key]: value };
      return { ...prev, [fieldName]: newArray };
    });
  }, []);

  const prepareFormData = useCallback(() => {
    const submitFormData = new FormData();

    if (formData.profilePic instanceof File) {
      submitFormData.append('profilePic', formData.profilePic);
    }

    formData.photos.forEach((photo) => {
      if (photo.isNew && photo.file instanceof File) {
        submitFormData.append('photos', photo.file);
      }
    });

    formData.videos.forEach((video) => {
      if (video.isNew && video.file instanceof File) {
        submitFormData.append('videos', video.file);
      }
    });

    const fields = ['tagline', 'bio', 'category', 'tags', 'specializations', 'mainSkills', 'experience', 'education', 'software', 'projects', 'certifications', 'awards', 'languages', 'testimonials', 'contacts', 'externalLinks', 'availability', 'services', 'theme', 'isPublic', 'metaTitle', 'metaDescription'];

    fields.forEach(field => {
      const value = formData[field];
      if (value !== undefined && value !== null) {
        submitFormData.append(field, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });

    return submitFormData;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      setCurrentTab(0);
      return;
    }

    const loadingToast = toast.loading(
      isEditMode ? 'Updating portfolio...' : 'Creating portfolio...'
    );

    try {
      const submitFormData = prepareFormData();
      
      if (isEditMode) {
        await updatePortfolio(submitFormData).unwrap();
      } else {
        await createPortfolio(submitFormData).unwrap();
      }
      
      toast.dismiss(loadingToast);
      setShowSuccessModal(true);
      
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save portfolio', { id: loadingToast });
    }
  }, [validateForm, isEditMode, prepareFormData, updatePortfolio, createPortfolio]);

  const isSubmitting = isCreating || isUpdating;

  // Loading State
  if (isLoadingPortfolio) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin">
          <Loader2 size={48} className="text-[#ceea45]" />
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-black text-white">
        {/* Optimized Background */}
        <OptimizedBackground isLowEnd={isLowEnd} />
        
        {/* Success Modal */}
        <SuccessModal isOpen={showSuccessModal} isUpdate={isEditMode} />

        {/* CSS Animations */}
        <style jsx global>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, -30px) scale(1.05); }
          }
          .animate-blob { animation: blob 20s ease-in-out infinite; }
          
          input:focus, textarea:focus, select:focus { 
            outline: none; 
            border-color: #ceea45 !important; 
          }
          
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
          ::-webkit-scrollbar-thumb { background: rgba(206, 234, 69, 0.3); border-radius: 10px; }
        `}</style>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 text-sm">
              <Sparkles size={16} className="text-[#ceea45]" />
              <span className="font-bold">{isEditMode ? 'Edit Portfolio' : 'Create Portfolio'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black mb-3 bg-gradient-to-r from-[#ceea45] to-white bg-clip-text text-transparent">
              {isEditMode ? 'UPDATE YOUR STORY' : 'BUILD YOUR STORY'}
            </h1>
            
            <p className="text-gray-400 text-sm mb-6">
              Showcase your work, skills, and achievements
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-400">Completion</span>
                <span className="text-[#ceea45] font-bold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#ceea45] to-green-500 h-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </header>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-4 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => setCurrentTab(tab.id)} 
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentTab === tab.id 
                        ? 'bg-[#ceea45]/20 text-[#ceea45] border border-[#ceea45]/50' 
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <GlassCard isLowEnd={isLowEnd} className="p-4 sticky top-6">
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button 
                        key={tab.id} 
                        onClick={() => setCurrentTab(tab.id)} 
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          currentTab === tab.id 
                            ? 'bg-[#ceea45]/20 text-[#ceea45]' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 p-4 rounded-xl bg-[#ceea45]/10 border border-[#ceea45]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-[#ceea45]" />
                    <span className="text-sm font-semibold">Quick Stats</span>
                  </div>
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Photos</span>
                      <span className="text-white font-medium">{formData.photos.length}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Videos</span>
                      <span className="text-white font-medium">{formData.videos.length}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projects</span>
                      <span className="text-white font-medium">{formData.projects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skills</span>
                      <span className="text-white font-medium">{formData.mainSkills.length}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </aside>

            {/* Form Content */}
            <main className="lg:col-span-9">
              <GlassCard isLowEnd={isLowEnd} className="p-4 md:p-8">
                {/* TAB 0: BASIC INFO */}
                {currentTab === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <User className="text-[#ceea45]" size={24} />
                        Basic Information
                      </h2>
                      <p className="text-gray-400 text-sm">Let's start with the essentials</p>
                    </div>

                    {/* Profile Picture */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-300">Profile Picture</label>
                      <div className="flex items-center gap-6">
                        <div className="relative w-28 h-28 rounded-full bg-white/5 border border-white/10 overflow-hidden group">
                          {formData.profilePic ? (
                            <>
                              <ImagePreview file={formData.profilePic} index={0} onRemove={() => removeFile('profilePic')} />
                            </>
                          ) : existingPortfolio?.portfolio?.profilePic ? (
                            <>
                              <img src={existingPortfolio.portfolio.profilePic} alt="Profile" className="w-full h-full object-cover" />
                              <label className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Upload size={20} className="text-gray-400" />
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePic')} className="hidden" />
                              </label>
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                              <Upload size={20} className="text-gray-400 mb-1" />
                              <span className="text-xs text-gray-400">Upload</span>
                              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePic')} className="hidden" />
                            </label>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          <p className="font-medium">400x400px recommended</p>
                          <p className="text-xs">Max 5MB</p>
                        </div>
                      </div>
                    </div>

                    {/* Tagline */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Tagline <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.tagline} 
                        onChange={(e) => updateField('tagline', e.target.value)}
                        placeholder="Creative Video Editor | Motion Graphics Artist" 
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.tagline ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-500`}
                      />
                      {errors.tagline && <p className="text-red-500 text-xs">{errors.tagline}</p>}
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Bio <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        value={formData.bio} 
                        onChange={(e) => updateField('bio', e.target.value)}
                        placeholder="Tell us about yourself..." 
                        rows={4} 
                        maxLength={500} 
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.bio ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-500 resize-none`}
                      />
                      <div className="flex justify-between">
                        {errors.bio && <p className="text-red-500 text-xs">{errors.bio}</p>}
                        <p className="text-xs text-gray-500 ml-auto">{formData.bio.length}/500</p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select 
                        value={formData.category} 
                        onChange={(e) => updateField('category', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${errors.category ? 'border-red-500' : 'border-white/10'} text-white cursor-pointer`}
                      >
                        <option value="" className="bg-gray-900">Select Category</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-gray-900">{cat}</option>)}
                      </select>
                      {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Tags <span className="text-red-500">*</span>
                      </label>
                      <TagInput
                        value={formData.tags}
                        onChange={(newTags) => updateArrayField('tags', newTags)}
                        placeholder="Type a tag and press Enter"
                        colorClass="bg-[#ceea45]/20 text-[#ceea45]"
                        error={errors.tags}
                        maxTags={15}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 1: PROFESSIONAL */}
                {currentTab === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <Briefcase className="text-[#ceea45]" size={24} />
                        Professional Details
                      </h2>
                      <p className="text-gray-400 text-sm">Showcase your expertise</p>
                    </div>

                    {/* Specializations */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">Specializations</label>
                      <TagInput
                        value={formData.specializations}
                        onChange={(val) => updateArrayField('specializations', val)}
                        placeholder="Color Grading, Sound Design, VFX"
                        colorClass="bg-purple-500/20 text-purple-400"
                        maxTags={10}
                      />
                    </div>

                    {/* Main Skills */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Main Skills <span className="text-red-500">*</span>
                      </label>
                      <TagInput
                        value={formData.mainSkills}
                        onChange={(val) => updateArrayField('mainSkills', val)}
                        placeholder="Adobe Premiere Pro, After Effects"
                        colorClass="bg-blue-500/20 text-blue-400"
                        error={errors.mainSkills}
                        maxTags={15}
                      />
                    </div>

                    {/* Experience */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-gray-300">Experience</label>
                        <button 
                          type="button" 
                          onClick={() => addDynamicField('experience')} 
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ceea45]/20 text-[#ceea45] text-xs font-medium"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.experience.map((exp, index) => (
                          <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-medium text-gray-400">Experience #{index + 1}</span>
                              {formData.experience.length > 1 && (
                                <button type="button" onClick={() => removeDynamicField('experience', index)} className="text-red-500 p-1">
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                value={exp.title} 
                                onChange={(e) => updateDynamicField('experience', index, 'title', e.target.value)} 
                                placeholder="Job Title" 
                                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                              />
                              <input 
                                type="text" 
                                value={exp.company} 
                                onChange={(e) => updateDynamicField('experience', index, 'company', e.target.value)} 
                                placeholder="Company Name" 
                                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                              />
                            </div>
                            <input 
                              type="text" 
                              value={exp.duration} 
                              onChange={(e) => updateDynamicField('experience', index, 'duration', e.target.value)} 
                              placeholder="Duration (e.g., 2020 - Present)" 
                              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                            />
                            <textarea 
                              value={exp.description} 
                              onChange={(e) => updateDynamicField('experience', index, 'description', e.target.value)} 
                              placeholder="Description" 
                              rows={2} 
                              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-gray-300">Education</label>
                        <button 
                          type="button" 
                          onClick={() => addDynamicField('education')} 
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ceea45]/20 text-[#ceea45] text-xs font-medium"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.education.map((edu, index) => (
                          <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-medium text-gray-400">Education #{index + 1}</span>
                              {formData.education.length > 1 && (
                                <button type="button" onClick={() => removeDynamicField('education', index)} className="text-red-500 p-1">
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                value={edu.degree} 
                                onChange={(e) => updateDynamicField('education', index, 'degree', e.target.value)} 
                                placeholder="Degree/Course" 
                                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                              />
                              <input 
                                type="text" 
                                value={edu.institution} 
                                onChange={(e) => updateDynamicField('education', index, 'institution', e.target.value)} 
                                placeholder="Institution" 
                                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                              />
                            </div>
                            <input 
                              type="text" 
                              value={edu.year} 
                              onChange={(e) => updateDynamicField('education', index, 'year', e.target.value)} 
                              placeholder="Year" 
                              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Software */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <Code size={14} /> Software & Tools
                      </label>
                      <TagInput
                        value={formData.software}
                        onChange={(val) => updateArrayField('software', val)}
                        placeholder="Premiere Pro, After Effects"
                        colorClass="bg-green-500/20 text-green-400"
                        maxTags={20}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: MEDIA */}
                {currentTab === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <ImageIcon className="text-[#ceea45]" size={24} />
                        Media Showcase
                      </h2>
                      <p className="text-gray-400 text-sm">Upload your best work</p>
                    </div>

                    {/* Photos */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm font-semibold text-gray-300">Photos</label>
                          <p className="text-xs text-gray-500">{formData.photos.length}/10</p>
                        </div>
                        <label className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ceea45]/20 text-[#ceea45] text-xs font-medium cursor-pointer ${formData.photos.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <Upload size={14} />
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={(e) => handleFileUpload(e, 'photos')} 
                            className="hidden" 
                            disabled={formData.photos.length >= 10}
                          />
                        </label>
                      </div>

                      {formData.photos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {formData.photos.map((photo, index) => (
                            <ImagePreview
                              key={index}
                              file={photo.isNew ? photo.file : null}
                              url={photo.isExisting ? photo.url : null}
                              onRemove={() => removeFile('photos', index)}
                              index={index}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-xl border-2 border-dashed border-white/10 text-center">
                          <ImageIcon size={40} className="mx-auto mb-3 text-gray-600" />
                          <p className="text-gray-400 text-sm">No photos yet</p>
                          <p className="text-xs text-gray-500">Max 10MB each</p>
                        </div>
                      )}
                    </div>

                    {/* Videos */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <label className="text-sm font-semibold text-gray-300">Videos</label>
                          <p className="text-xs text-gray-500">{formData.videos.length}/10</p>
                        </div>
                        <label className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium cursor-pointer ${formData.videos.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <Video size={14} />
                          Upload
                          <input 
                            type="file" 
                            accept="video/*" 
                            multiple 
                            onChange={(e) => handleFileUpload(e, 'videos')} 
                            className="hidden" 
                            disabled={formData.videos.length >= 10}
                          />
                        </label>
                      </div>

                      {formData.videos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {formData.videos.map((video, index) => (
                            <VideoPreview
                              key={index}
                              file={video.isNew ? video.file : null}
                              url={video.isExisting ? video.url : null}
                              onRemove={() => removeFile('videos', index)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-xl border-2 border-dashed border-white/10 text-center">
                          <Video size={40} className="mx-auto mb-3 text-gray-600" />
                          <p className="text-gray-400 text-sm">No videos yet</p>
                          <p className="text-xs text-gray-500">Max 400MB each</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: PROJECTS */}
                {currentTab === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <FolderKanban className="text-[#ceea45]" size={24} />
                        Projects
                      </h2>
                      <p className="text-gray-400 text-sm">Showcase your best work</p>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => addDynamicField('projects')} 
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold"
                    >
                      <Plus size={18} /> Add Project
                    </button>

                    {formData.projects.length === 0 ? (
                      <div className="p-8 rounded-xl border-2 border-dashed border-white/10 text-center">
                        <FolderKanban size={40} className="mx-auto mb-3 text-gray-600" />
                        <p className="text-gray-400 text-sm">No projects yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.projects.map((project, index) => (
                          <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-bold text-[#ceea45]">Project #{index + 1}</h3>
                              <button type="button" onClick={() => removeDynamicField('projects', index)} className="text-red-500">
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <input 
                              type="text" 
                              value={project.title} 
                              onChange={(e) => updateDynamicField('projects', index, 'title', e.target.value)} 
                              placeholder="Project Title" 
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                            />
                            <textarea 
                              value={project.description} 
                              onChange={(e) => updateDynamicField('projects', index, 'description', e.target.value)} 
                              placeholder="Description" 
                              rows={3} 
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none text-sm"
                            />
                            <input 
                              type="url" 
                              value={project.link} 
                              onChange={(e) => updateDynamicField('projects', index, 'link', e.target.value)} 
                              placeholder="Project Link (optional)" 
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: ADDITIONAL */}
                                {/* TAB 4: ADDITIONAL */}
                {currentTab === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <Award className="text-[#ceea45]" size={24} />
                        Additional Information
                      </h2>
                      <p className="text-gray-400 text-sm">Certifications, languages & services</p>
                    </div>

                    {/* Certifications */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                          <Award size={14} /> Certifications
                        </label>
                        <button 
                          type="button" 
                          onClick={() => addDynamicField('certifications')} 
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ceea45]/20 text-[#ceea45] text-xs font-medium"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>

                      {formData.certifications.length > 0 ? (
                        <div className="space-y-3">
                          {formData.certifications.map((cert, index) => (
                            <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-medium text-gray-400">Certification #{index + 1}</span>
                                <button type="button" onClick={() => removeDynamicField('certifications', index)} className="text-red-500 p-1">
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input 
                                  type="text" 
                                  value={cert.name} 
                                  onChange={(e) => updateDynamicField('certifications', index, 'name', e.target.value)} 
                                  placeholder="Certification Name" 
                                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                                />
                                <input 
                                  type="text" 
                                  value={cert.issuer} 
                                  onChange={(e) => updateDynamicField('certifications', index, 'issuer', e.target.value)} 
                                  placeholder="Issuing Organization" 
                                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input 
                                  type="text" 
                                  value={cert.date} 
                                  onChange={(e) => updateDynamicField('certifications', index, 'date', e.target.value)} 
                                  placeholder="Date (e.g., Jan 2024)" 
                                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                                />
                                <input 
                                  type="url" 
                                  value={cert.link} 
                                  onChange={(e) => updateDynamicField('certifications', index, 'link', e.target.value)} 
                                  placeholder="Credential URL (optional)" 
                                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl border-2 border-dashed border-white/10 text-center">
                          <Award size={32} className="mx-auto mb-2 text-gray-600" />
                          <p className="text-gray-500 text-sm">No certifications added</p>
                        </div>
                      )}
                    </div>

                    {/* Languages */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <Globe size={14} /> Languages
                      </label>
                      <TagInput
                        value={formData.languages}
                        onChange={(val) => updateArrayField('languages', val)}
                        placeholder="English, Hindi, Spanish"
                        colorClass="bg-indigo-500/20 text-indigo-400"
                        maxTags={10}
                      />
                    </div>

                    {/* Services */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <Star size={14} /> Services Offered
                      </label>
                      <TagInput
                        value={formData.services}
                        onChange={(val) => updateArrayField('services', val)}
                        placeholder="Video Editing, Color Grading, Motion Graphics"
                        colorClass="bg-pink-500/20 text-pink-400"
                        maxTags={15}
                      />
                    </div>

                    {/* Awards */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                          <Star size={14} /> Awards & Achievements
                        </label>
                        <button 
                          type="button" 
                          onClick={() => addDynamicField('awards')} 
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs font-medium"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>

                      {formData.awards.length > 0 && (
                        <div className="space-y-3">
                          {formData.awards.map((award, index) => (
                            <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-medium text-gray-400">Award #{index + 1}</span>
                                <button type="button" onClick={() => removeDynamicField('awards', index)} className="text-red-500 p-1">
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input 
                                  type="text" 
                                  value={award.title} 
                                  onChange={(e) => updateDynamicField('awards', index, 'title', e.target.value)} 
                                  placeholder="Award Title" 
                                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                                />
                                <input 
                                  type="text" 
                                  value={award.issuer} 
                                  onChange={(e) => updateDynamicField('awards', index, 'issuer', e.target.value)} 
                                  placeholder="Issuing Organization" 
                                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                                />
                              </div>
                              <input 
                                type="text" 
                                value={award.date} 
                                onChange={(e) => updateDynamicField('awards', index, 'date', e.target.value)} 
                                placeholder="Date (e.g., 2024)" 
                                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
                              />
                              <textarea 
                                value={award.description} 
                                onChange={(e) => updateDynamicField('awards', index, 'description', e.target.value)} 
                                placeholder="Brief description (optional)" 
                                rows={2} 
                                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm resize-none"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: SETTINGS */}
                {currentTab === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                        <Settings className="text-[#ceea45]" size={24} />
                        Settings & Contact
                      </h2>
                      <p className="text-gray-400 text-sm">Configure your portfolio</p>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Mail size={18} className="text-[#ceea45]" />
                        Contact Information
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input 
                            type="email" 
                            value={formData.contacts.email} 
                            onChange={(e) => setFormData(prev => ({ ...prev, contacts: { ...prev.contacts, email: e.target.value } }))} 
                            placeholder="your@email.com" 
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500"
                          />
                        </div>
                        <div className="relative">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input 
                            type="tel" 
                            value={formData.contacts.phone} 
                            onChange={(e) => setFormData(prev => ({ ...prev, contacts: { ...prev.contacts, phone: e.target.value } }))} 
                            placeholder="+1 234 567 8900" 
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500"
                          />
                        </div>
                        <div className="relative">
                          <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input 
                            type="url" 
                            value={formData.contacts.website} 
                            onChange={(e) => setFormData(prev => ({ ...prev, contacts: { ...prev.contacts, website: e.target.value } }))} 
                            placeholder="https://yourwebsite.com" 
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Availability Status</h3>
                      
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div>
                          <p className="font-medium text-sm">Available for Work</p>
                          <p className="text-xs text-gray-400">Let clients know you're open to projects</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            availability: { ...prev.availability, isAvailable: !prev.availability.isAvailable } 
                          }))} 
                          className={`relative w-14 h-7 rounded-full transition-colors ${formData.availability.isAvailable ? 'bg-[#ceea45]' : 'bg-gray-600'}`}
                        >
                          <div 
                            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${formData.availability.isAvailable ? 'left-[30px]' : 'left-0.5'}`}
                          />
                        </button>
                      </div>

                      <select 
                        value={formData.availability.status} 
                        onChange={(e) => setFormData(prev => ({ ...prev, availability: { ...prev.availability, status: e.target.value } }))} 
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer"
                      >
                        {AVAILABILITY_OPTIONS.map(opt => (
                          <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Privacy Settings</h3>
                      
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div>
                          <p className="font-medium text-sm">Public Portfolio</p>
                          <p className="text-xs text-gray-400">Make your portfolio visible to everyone</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))} 
                          className={`relative w-14 h-7 rounded-full transition-colors ${formData.isPublic ? 'bg-[#ceea45]' : 'bg-gray-600'}`}
                        >
                          <div 
                            className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${formData.isPublic ? 'left-[30px]' : 'left-0.5'}`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Globe size={18} className="text-[#ceea45]" />
                        SEO Settings
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Meta Title</label>
                          <input 
                            type="text" 
                            value={formData.metaTitle} 
                            onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))} 
                            placeholder="Your Name - Video Editor Portfolio" 
                            maxLength={60}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60</p>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Meta Description</label>
                          <textarea 
                            value={formData.metaDescription} 
                            onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))} 
                            placeholder="A brief description for search engines..." 
                            rows={3} 
                            maxLength={160}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160</p>
                        </div>
                      </div>
                    </div>

                    {/* External Links */}

                    <div className="space-y-4">
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold">External Links</h3>
    <button 
      type="button" 
      onClick={() => addDynamicField('externalLinks')} 
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ceea45]/20 text-[#ceea45] text-xs font-medium"
    >
      <Plus size={14} /> Add Link
    </button>
  </div>
  
  {formData.externalLinks.length > 0 && (
    <div className="space-y-3">
      {formData.externalLinks.map((link, index) => (
        <div key={index} className="flex gap-3 items-center p-3 rounded-lg bg-white/5 border border-white/10">
          <input 
            type="text" 
            value={link.platform} 
            onChange={(e) => updateDynamicField('externalLinks', index, 'platform', e.target.value)} 
            placeholder="Platform (e.g., LinkedIn)" 
            className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
          />
          <input 
            type="url" 
            value={link.url} 
            onChange={(e) => updateDynamicField('externalLinks', index, 'url', e.target.value)} 
            placeholder="https://example.com" 
            className="flex-[2] px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm"
          />
          
          {/* ✅ PREVIEW LINK BUTTON - FIXED */}
          {link.url && (
            <a
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#ceea45] hover:bg-[#ceea45]/10 rounded-lg transition-all flex-shrink-0 cursor-pointer"
              title="Open link in new tab"
            >
              <Globe size={18} />
            </a>
          )}
          
          {/* DELETE BUTTON */}
          <button 
            type="button" 
            onClick={() => removeDynamicField('externalLinks', index)} 
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )}
</div>
               
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setCurrentTab(Math.max(0, currentTab - 1))} 
                    disabled={currentTab === 0} 
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      currentTab === 0 
                        ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95'
                    }`}
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <div className="flex gap-3 w-full sm:w-auto">
                    {/* Preview Button */}
                    {isEditMode && (
                      <button 
                        type="button" 
                        onClick={() => router.push('/Pages/Features/myportfolio')} 
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 active:scale-95 transition-all"
                      >
                        <Eye size={18} />
                        Preview
                      </button>
                    )}

                    {currentTab === tabs.length - 1 ? (
                      <button 
                        type="button" 
                        onClick={handleSubmit} 
                        disabled={isSubmitting} 
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#ceea45] to-[#a8c930] text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            {isEditMode ? 'Updating...' : 'Creating...'}
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            {isEditMode ? 'Update Portfolio' : 'Create Portfolio'}
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setCurrentTab(Math.min(tabs.length - 1, currentTab + 1))} 
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#ceea45] to-[#a8c930] text-black font-bold active:scale-95 transition-all"
                      >
                        Next
                        <ChevronRight size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </main>
          </div>

          {/* Floating Help Button */}
          <button 
            type="button" 
            onClick={() => toast('Need help? Contact support@editcraft.co.in', {
              icon: '💬',
              style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(206,234,69,0.3)' },
            })} 
            className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-[#ceea45] to-[#a8c930] text-black shadow-lg z-50 active:scale-90 transition-transform"
          >
            <Sparkles size={20} />
          </button>
        </div>
      </div>
    </LazyMotion>
  );
}
