'use client'
import { useMyProfileQuery, useUpdateProfileMutation } from '@/app/Store/apiSclice/UserApiSlice'
import { selectIsAuthenticated } from '@/app/Store/Sclies/authSlice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { User, Mail, Camera, X, Save, ArrowLeft, Image as ImageIcon, Sparkles, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const EditProfilePage = () => {
  const router = useRouter()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [isVisible, setIsVisible] = useState(false)
  const [profilePicPreview, setProfilePicPreview] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const { data: profileData, isLoading: profileLoading } = useMyProfileQuery(undefined, {
    skip: !isAuthenticated
  })

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const profile = profileData?.yourProfile

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    bio: '',
    profilePic: null,
    banner: null,
  })

  useEffect(() => {
    setIsVisible(true)
    if (profile) {
      setFormData({
        fullname: profile.fullname || '',
        username: profile.username || '',
        email: profile.email || '',
        bio: profile.bio || '',
        profilePic: null,
        banner: null,
      })
      setProfilePicPreview(profile.profilePic || null)
      setBannerPreview(profile.banner || null)
    }
  }, [profile])

  if (!isAuthenticated) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'profilePic') {
          setProfilePicPreview(reader.result)
          setFormData(prev => ({ ...prev, profilePic: file }))
        } else {
          setBannerPreview(reader.result)
          setFormData(prev => ({ ...prev, banner: file }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (type) => {
    if (type === 'profilePic') {
      setProfilePicPreview(null)
      setFormData(prev => ({ ...prev, profilePic: null }))
    } else {
      setBannerPreview(null)
      setFormData(prev => ({ ...prev, banner: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const submitData = new FormData()
    submitData.append('fullname', formData.fullname)
    submitData.append('username', formData.username)
    submitData.append('email', formData.email)
    submitData.append('bio', formData.bio)
    
    if (formData.profilePic) {
      submitData.append('profilePic', formData.profilePic)
    }
    if (formData.banner) {
      submitData.append('banner', formData.banner)
    }

    try {
      await updateProfile(submitData).unwrap()
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        router.push('/Pages/Main/profile')
      }, 2000)
    } catch (error) {
      console.error('Failed to update profile:', error)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-y-auto overflow-x-hidden relative pb-24">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-[#ceea45]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 md:w-96 md:h-96 bg-pink-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(206,234,69,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(206,234,69,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-green-500/20 backdrop-blur-xl border-2 border-green-500/50 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top">
          <CheckCircle className="w-6 h-6 text-green-400" />
          <span className="text-green-400 font-bold">Profile updated successfully!</span>
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="fixed top-6 right-6 z-50 bg-red-500/20 backdrop-blur-xl border-2 border-red-500/50 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <span className="text-red-400 font-bold">Failed to update profile</span>
        </div>
      )}

      <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <Link href="/Pages/Main/profile">
                  <button className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/20 hover:border-[#ceea45]/50 flex-shrink-0">
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </Link>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-[#ceea45] via-white to-[#ceea45] bg-clip-text text-transparent flex items-center gap-2">
                    <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-[#ceea45] flex-shrink-0" />
                    <span className="truncate">Edit Profile</span>
                  </h1>
                  <p className="text-xs md:text-sm text-gray-400 mt-1 truncate">Update your personal information</p>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-xl font-bold hover:from-[#b8d93c] hover:to-[#ceea45] transition-all shadow-lg hover:shadow-[#ceea45]/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {isUpdating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12">
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Banner Upload */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border-2 border-white/10 overflow-hidden"
              style={{
                boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
              }}
            >
              <div className="p-4 md:p-6 border-b border-white/10">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <ImageIcon size={20} className="text-[#ceea45]" />
                  Banner Image
                </h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">Recommended size: 1920x400px</p>
              </div>
              
              <div className="p-4 md:p-6">
                <div className="relative h-48 md:h-64 rounded-xl md:rounded-2xl overflow-hidden border-2 border-dashed border-white/20 hover:border-[#ceea45]/50 transition-all group">
                  {bannerPreview ? (
                    <>
                      <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <label className="cursor-pointer p-3 bg-[#ceea45] hover:bg-[#b8d93c] rounded-xl transition-all">
                          <Camera size={20} className="text-black" />
                          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="hidden" />
                        </label>
                        <button type="button" onClick={() => removeImage('banner')} className="p-3 bg-red-500 hover:bg-red-600 rounded-xl transition-all">
                          <X size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center mb-3 md:mb-4 group-hover:bg-[#ceea45]/20 transition-all">
                        <ImageIcon size={32} className="text-gray-400 group-hover:text-[#ceea45] transition-colors" />
                      </div>
                      <p className="text-sm md:text-base font-medium text-gray-300 group-hover:text-[#ceea45] transition-colors">Click to upload banner</p>
                      <p className="text-xs md:text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border-2 border-white/10 overflow-hidden"
              style={{
                boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
              }}
            >
              <div className="p-4 md:p-6 border-b border-white/10">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <User size={20} className="text-[#ceea45]" />
                  Profile Picture
                </h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">Recommended size: 400x400px</p>
              </div>
              
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-[#ceea45]/30 group">
                    <img
                      src={profilePicPreview || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.fullname || 'User') + '&background=ceea45&color=000&size=400'}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="cursor-pointer p-2.5 md:p-3 bg-[#ceea45] hover:bg-[#b8d93c] rounded-xl transition-all">
                        <Camera size={18} className="text-black" />
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePic')} className="hidden" />
                      </label>
                      {profilePicPreview && (
                        <button type="button" onClick={() => removeImage('profilePic')} className="p-2.5 md:p-3 bg-red-500 hover:bg-red-600 rounded-xl transition-all">
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-sm md:text-base text-gray-300 mb-2">Upload a new profile picture</p>
                    <p className="text-xs md:text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl border-2 border-white/10 overflow-hidden"
              style={{
                boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 80px rgba(206,234,69,0.05)'
              }}
            >
              <div className="p-4 md:p-6 border-b border-white/10">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <User size={20} className="text-[#ceea45]" />
                  Personal Information
                </h2>
              </div>
              
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-sm md:text-base focus:outline-none focus:border-[#ceea45]/50 transition placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-sm md:text-base focus:outline-none focus:border-[#ceea45]/50 transition placeholder-gray-500"
                      placeholder="username"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 items-center gap-2">
                    <Mail size={16} className="text-[#ceea45]" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-sm md:text-base focus:outline-none focus:border-[#ceea45]/50 transition placeholder-gray-500"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-sm md:text-base focus:outline-none focus:border-[#ceea45]/50 transition placeholder-gray-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-gray-500 mt-2">{formData.bio.length} / 500 characters</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Fixed Mobile Save Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black via-black to-transparent">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isUpdating}
          className="w-full py-4 bg-gradient-to-r from-[#ceea45] to-[#b8d93c] text-black rounded-xl font-bold hover:from-[#b8d93c] hover:to-[#ceea45] transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUpdating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
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
      `}</style>
    </div>
  )
}

export default EditProfilePage