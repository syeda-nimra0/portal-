import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Camera, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Profile = () => {
  const { currentUser, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            name: data.name || '',
            email: currentUser.email,
            phone: data.phone || '',
            studentId: data.studentId || '',
            department: data.department || '',
            bio: data.bio || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: userData.name,
        phone: userData.phone,
        studentId: userData.studentId,
        department: userData.department,
        bio: userData.bio,
        updatedAt: new Date().toISOString()
      });

      toast.success('Profile updated successfully! 🎉');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(currentUser, passwordData.newPassword);
      toast.success('Password changed successfully! 🔒');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in to change your password');
      } else {
        toast.error('Failed to change password');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <TopBar title="Profile Settings" subtitle="Manage your account settings" />

        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-6"
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-saylani-green to-saylani-blue rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {userData.name.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-saylani-blue text-white rounded-full hover:bg-saylani-blue-dark transition-smooth">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-heading font-bold text-gray-800 dark:text-white mb-1">
                    {userData.name || 'User Name'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {currentUser?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className={`w-4 h-4 ${userRole === 'admin' ? 'text-red-500' : 'text-blue-500'}`} />
                    <span className={`text-sm font-medium ${
                      userRole === 'admin' 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {userRole === 'admin' ? 'Administrator' : 'Student'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 px-6 py-4 font-heading font-semibold transition-smooth ${
                      activeTab === 'profile'
                        ? 'text-saylani-blue border-b-2 border-saylani-blue bg-saylani-blue/5'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <User className="w-5 h-5 inline-block mr-2" />
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`flex-1 px-6 py-4 font-heading font-semibold transition-smooth ${
                      activeTab === 'security'
                        ? 'text-saylani-blue border-b-2 border-saylani-blue bg-saylani-blue/5'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <Lock className="w-5 h-5 inline-block mr-2" />
                    Security Settings
                  </button>
                </div>
              </div>

              <div className="p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleProfileUpdate}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Email cannot be changed
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                          placeholder="+92 XXX XXXXXXX"
                        />
                      </div>

                      {userRole === 'student' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Student ID
                            </label>
                            <input
                              type="text"
                              value={userData.studentId}
                              onChange={(e) => setUserData({ ...userData, studentId: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                              placeholder="STD-12345"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Department
                            </label>
                            <select
                              value={userData.department}
                              onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            >
                              <option value="">Select Department</option>
                              <option value="Computer Science">Computer Science</option>
                              <option value="Web Development">Web Development</option>
                              <option value="Mobile App Development">Mobile App Development</option>
                              <option value="Graphic Design">Graphic Design</option>
                              <option value="Digital Marketing">Digital Marketing</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={userData.bio}
                        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saylani-green to-saylani-blue text-white font-heading font-semibold rounded-xl hover:shadow-lg transition-smooth disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handlePasswordChange}
                    className="space-y-6"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <Lock className="w-4 h-4 inline mr-2" />
                        For security reasons, you may need to log out and log back in after changing your password.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Minimum 6 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-heading font-semibold rounded-xl hover:shadow-lg transition-smooth disabled:opacity-50"
                      >
                        <Lock className="w-5 h-5" />
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </motion.form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;