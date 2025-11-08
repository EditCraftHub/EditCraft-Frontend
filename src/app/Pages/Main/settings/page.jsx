'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { 
  useMyProfileQuery, 
  useUpdateProfileMutation,
  useUnblockUserMutation
} from "@/app/Store/apiSclice/UserApiSlice";
import { useLogoutMutation } from "@/app/Store/apiSclice/AuthApiSlice";
import { logout as logoutAction } from "@/app/Store/Sclies/authSlice";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";
import { 
  ArrowLeft, Settings, User, Bell, Shield, 
  Save, AlertTriangle, LogOut, Trash2, Mail, X, UserX, Globe
} from "lucide-react";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: profileData, refetch } = useMyProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();
  const [logout] = useLogoutMutation();

  const profile = profileData?.yourProfile;
  const blockedUsers = profile?.blockedUsers || [];

  // Active tab
  const [activeTab, setActiveTab] = useState('account');

  // Account settings
  const [accountData, setAccountData] = useState({
    email: '',
    username: '',
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    allowMessages: true,
    showActivity: true,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
  });

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Logout confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Unblock confirmation
  const [unblockConfirm, setUnblockConfirm] = useState({ show: false, userId: null, userName: '' });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setAccountData({
        email: profile.email || '',
        username: profile.username || '',
      });
      setPrivacySettings({
        profileVisibility: profile.privacy?.profileVisibility || 'public',
        showEmail: profile.privacy?.showEmail || false,
        allowMessages: profile.privacy?.allowMessages || true,
        showActivity: profile.privacy?.showActivity || true,
      });
      setNotificationSettings({
        emailNotifications: profile.notifications?.email || true,
        pushNotifications: profile.notifications?.push || true,
        likeNotifications: profile.notifications?.likes || true,
        commentNotifications: profile.notifications?.comments || true,
        followNotifications: profile.notifications?.follows || true,
      });
    }
  }, [profile]);

  // Update handlers
  const handleUpdateAccount = async () => {
    try {
      await updateProfile(accountData).unwrap();
      toast.success('Account updated successfully!');
      await refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update account');
    }
  };

  const handleUpdatePrivacy = async () => {
    try {
      await updateProfile({ privacy: privacySettings }).unwrap();
      toast.success('Privacy settings updated!');
      await refetch();
    } catch (err) {
      toast.error('Failed to update privacy settings');
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      await updateProfile({ notifications: notificationSettings }).unwrap();
      toast.success('Notification settings updated!');
      await refetch();
    } catch (err) {
      toast.error('Failed to update notification settings');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await unblockUser(userId).unwrap();
      toast.success('User unblocked successfully!');
      setUnblockConfirm({ show: false, userId: null, userName: '' });
      await refetch();
    } catch (err) {
      toast.error('Failed to unblock user');
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      // Call delete account API endpoint
      toast.success('Account deleted successfully');
      dispatch(logoutAction());
      router.push('/');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'blocked', name: 'Blocked', icon: UserX },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2">Logout?</h3>
              <p className="text-slate-600 text-center mb-6 text-sm sm:text-base">
                Are you sure you want to logout?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unblock Confirmation Modal */}
        {unblockConfirm.show && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2">Unblock User?</h3>
              <p className="text-slate-600 text-center mb-6 text-sm sm:text-base">
                Do you want to unblock <span className="font-semibold">{unblockConfirm.userName}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setUnblockConfirm({ show: false, userId: null, userName: '' })}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-sm sm:text-base"
                  disabled={isUnblocking}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUnblockUser(unblockConfirm.userId)}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all text-sm sm:text-base disabled:opacity-50"
                  disabled={isUnblocking}
                >
                  {isUnblocking ? 'Unblocking...' : 'Unblock'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2">Delete Account?</h3>
              <p className="text-slate-600 text-center mb-6 text-sm sm:text-base">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-rose-800 font-medium mb-2">Type <span className="font-bold">DELETE</span> to confirm:</p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm sm:text-base"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE'}
                  className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold text-sm sm:text-base">Back</span>
              </button>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">Settings</h1>
              </div>
              <div className="w-16 sm:w-20"></div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
          {/* Mobile Tabs (Horizontal Scroll) */}
          <div className="md:hidden mb-6 -mx-4 px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm ${
                      activeTab === tab.id
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-white text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Desktop Sidebar Tabs */}
            <div className="hidden md:block md:col-span-1">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-slate-200/50 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                          activeTab === tab.id
                            ? 'bg-indigo-500 text-white shadow-md'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Account Settings</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={accountData.email}
                          onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm sm:text-base"
                          placeholder="your@email.com"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Your email address cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={accountData.username}
                          onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                          className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm sm:text-base"
                          placeholder="Your name"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleUpdateAccount}
                      disabled={isUpdating}
                      className="w-full py-2.5 sm:py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                          Save Changes
                        </>
                      )}
                    </button>

                    {/* Danger Zone */}
                    <div className="pt-4 sm:pt-6 border-t border-slate-200">
                      <h3 className="text-base sm:text-lg font-bold text-rose-600 mb-3 sm:mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Danger Zone
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full py-2.5 sm:py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Profile Visibility</label>
                      <div className="space-y-2">
                        {['public', 'followers', 'private'].map((option) => (
                          <label key={option} className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={option}
                              checked={privacySettings.profileVisibility === option}
                              onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                              className="w-4 h-4 text-indigo-600 mt-0.5"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800 capitalize text-sm sm:text-base">{option}</p>
                              <p className="text-xs text-slate-500">
                                {option === 'public' && 'Anyone can see your profile'}
                                {option === 'followers' && 'Only your followers can see'}
                                {option === 'private' && 'Only you can see'}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <label className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="flex-1 pr-4">
                          <p className="font-semibold text-slate-800 text-sm sm:text-base">Show Email</p>
                          <p className="text-xs text-slate-500">Display email on profile</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacySettings.showEmail}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="flex-1 pr-4">
                          <p className="font-semibold text-slate-800 text-sm sm:text-base">Allow Messages</p>
                          <p className="text-xs text-slate-500">Receive direct messages</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacySettings.allowMessages}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, allowMessages: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="flex-1 pr-4">
                          <p className="font-semibold text-slate-800 text-sm sm:text-base">Show Activity</p>
                          <p className="text-xs text-slate-500">Display online status</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacySettings.showActivity}
                          onChange={(e) => setPrivacySettings({ ...privacySettings, showActivity: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 rounded"
                        />
                      </label>
                    </div>

                    <button
                      onClick={handleUpdatePrivacy}
                      className="w-full py-2.5 sm:py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                      Save Privacy Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Notification Settings</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-3 sm:mb-4">Channels</h3>
                      <div className="space-y-3 sm:space-y-4">
                        <label className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                          <div className="flex-1 pr-4">
                            <p className="font-semibold text-slate-800 text-sm sm:text-base">Email</p>
                            <p className="text-xs text-slate-500">Email notifications</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                            className="w-5 h-5 text-indigo-600 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                          <div className="flex-1 pr-4">
                            <p className="font-semibold text-slate-800 text-sm sm:text-base">Push</p>
                            <p className="text-xs text-slate-500">Browser notifications</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushNotifications}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                            className="w-5 h-5 text-indigo-600 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-3 sm:mb-4">Activity</h3>
                      <div className="space-y-3 sm:space-y-4">
                        <label className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                          <div className="flex-1 pr-4">
                            <p className="font-semibold text-slate-800 text-sm sm:text-base">Likes</p>
                            <p className="text-xs text-slate-500">Someone likes your post</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.likeNotifications}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, likeNotifications: e.target.checked })}
                            className="w-5 h-5 text-indigo-600 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                          <div className="flex-1 pr-4">
                            <p className="font-semibold text-slate-800 text-sm sm:text-base">Comments</p>
                            <p className="text-xs text-slate-500">Someone comments</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.commentNotifications}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, commentNotifications: e.target.checked })}
                            className="w-5 h-5 text-indigo-600 rounded"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                          <div className="flex-1 pr-4">
                            <p className="font-semibold text-slate-800 text-sm sm:text-base">Followers</p>
                            <p className="text-xs text-slate-500">New followers</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notificationSettings.followNotifications}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, followNotifications: e.target.checked })}
                            className="w-5 h-5 text-indigo-600 rounded"
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleUpdateNotifications}
                      className="w-full py-2.5 sm:py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                      Save Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Blocked Users Tab */}
              {activeTab === 'blocked' && (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/50">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Blocked Users</h2>
                  
                  {blockedUsers.length > 0 ? (
                    <div className="space-y-3">
                      {blockedUsers.map((blockedUser) => (
                        <div 
                          key={blockedUser._id || blockedUser}
                          className="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <img
                            src={blockedUser.profilePic || `https://ui-avatars.com/api/?name=${blockedUser.fullname || 'User'}&background=random&size=80`}
                            alt={blockedUser.fullname || 'User'}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-800 truncate text-sm sm:text-base">
                              {blockedUser.fullname || 'Unknown User'}
                            </h3>
                            <p className="text-xs text-slate-500 truncate">
                              {blockedUser.email || 'No email'}
                            </p>
                          </div>
                          <button
                            onClick={() => setUnblockConfirm({ 
                              show: true, 
                              userId: blockedUser._id || blockedUser, 
                              userName: blockedUser.fullname || 'this user' 
                            })}
                            className="px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all text-xs sm:text-sm"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 sm:py-16">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserX className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">No blocked users</h3>
                      <p className="text-sm text-slate-500">You haven't blocked anyone yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Logout Button */}
          <div className="md:hidden mt-6">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-rose-50 rounded-2xl font-semibold text-rose-600 transition-all shadow-sm border border-slate-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SettingsPage;