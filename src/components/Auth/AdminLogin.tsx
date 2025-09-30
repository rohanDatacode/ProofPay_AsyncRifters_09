import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';
import { Admin } from '../../types';
import toast from 'react-hot-toast';

interface AdminLoginProps {
  onLoginSuccess: (admin: Admin) => void;
  onBack: () => void;
}

const AdminLogin = ({ onLoginSuccess, onBack }: AdminLoginProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await mockApi.adminLogin(formData.email, formData.password);
      if (result.success && result.admin) {
        toast.success(result.message);
        onLoginSuccess(result.admin);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-300">Secure access to ProofPay management</p>
        </div>

        {/* Login Form */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-8 py-6 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-white/10">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">Administrative Login</h2>
              <p className="text-slate-300 text-sm">Enter your credentials to access the dashboard</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Demo Credentials Notice */}
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2 text-sm">Demo Credentials</h4>
              <div className="space-y-1 text-xs text-slate-300">
                <p>Email: <span className="font-mono text-blue-400">admin@proofpay.gov.in</span></p>
                <p>Password: <span className="font-mono text-blue-400">admin123</span></p>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@proofpay.gov.in"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium mb-1">Security Notice</p>
                  <p className="text-slate-400 text-xs">
                    This is a secure administrative portal. All login attempts are monitored and logged. 
                    Unauthorized access is strictly prohibited.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </motion.button>
              <motion.button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Admin Login'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-slate-400"
        >
          <div className="flex flex-col items-center space-y-1">
            <div className="w-8 h-8 bg-green-900/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <span>SSL Encrypted</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <span>2FA Protected</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-8 h-8 bg-amber-900/30 rounded-full flex items-center justify-center">
              <Eye className="w-4 h-4 text-amber-400" />
            </div>
            <span>Audit Logged</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;