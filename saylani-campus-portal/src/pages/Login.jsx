import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back! 🎉');
        navigate('/dashboard');
      } else {
        await signup(formData.email, formData.password);
        toast.success('Account created successfully! 🎉');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saylani-green via-saylani-blue to-saylani-green-light relative overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Background decorative elements */}
      <div className="blur-shape blur-shape-1"></div>
      <div className="blur-shape blur-shape-2"></div>
      <div className="blur-shape blur-shape-3"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          {/* Logo and Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex justify-center mb-3 md:mb-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20  flex items-center justify-center">
                               <img 
                  src= {logo}
                  alt="Saylani Logo" 
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-800 dark:text-white mb-2">
              Campus Portal
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage reports, complaints & events in one place.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex mb-6 md:mb-8 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 md:py-3 rounded-lg font-heading font-semibold transition-smooth text-sm md:text-base ${
                isLogin
                  ? 'bg-white dark:bg-gray-800 text-saylani-blue shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 md:py-3 rounded-lg font-heading font-semibold transition-smooth text-sm md:text-base ${
                !isLogin
                  ? 'bg-white dark:bg-gray-800 text-saylani-blue shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base focus:ring-2 focus:ring-saylani-blue"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 md:mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm md:text-base focus:ring-2 focus:ring-saylani-blue"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 md:py-4 bg-gradient-to-r from-saylani-green to-saylani-blue text-white font-heading font-bold rounded-lg md:rounded-xl hover:shadow-xl transition-smooth disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {loading ? (
                <div className="loading-spinner w-5 h-5 md:w-6 md:h-6 border-2"></div>
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-5 md:mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs sm:text-sm text-saylani-blue hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <UserPlus className="w-3.5 h-3.5 md:w-4 md:h-4" />
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;