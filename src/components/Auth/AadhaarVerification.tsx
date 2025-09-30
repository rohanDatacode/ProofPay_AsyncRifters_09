import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';
import toast from 'react-hot-toast';

interface AadhaarVerificationProps {
  onVerificationSuccess: (aadhaar: string) => void;
  onBackToHome: () => void;
}

const AadhaarVerification = ({ onVerificationSuccess, onBackToHome }: AadhaarVerificationProps) => {
  const [step, setStep] = useState<'aadhaar' | 'otp' | 'success'>('aadhaar');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ aadhaar?: string; otp?: string }>({});

  const validateAadhaar = (value: string) => {
    const cleanAadhaar = value.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12) return 'Aadhaar must be 12 digits';
    if (!/^\d+$/.test(cleanAadhaar)) return 'Aadhaar must contain only numbers';
    return null;
  };

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    return cleaned;
  };

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAadhaar = aadhaar.replace(/\s/g, '');
    const error = validateAadhaar(cleanAadhaar);
    
    if (error) {
      setErrors({ aadhaar: error });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await mockApi.sendOtp(cleanAadhaar);
      if (result.success) {
        toast.success('OTP sent to your registered mobile number');
        setStep('otp');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ otp: 'OTP must be 6 digits' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await mockApi.verifyOtp(aadhaar.replace(/\s/g, ''), otp);
      if (result.success) {
        setStep('success');
        setTimeout(() => {
          onVerificationSuccess(aadhaar.replace(/\s/g, ''));
        }, 2000);
      } else {
        toast.error(result.message);
        setErrors({ otp: result.message });
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
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
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'aadhaar' ? 'bg-blue-600 text-white' : step === 'otp' || step === 'success' ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'}`}>
              {step === 'aadhaar' ? '1' : <CheckCircle className="w-5 h-5" />}
            </div>
            <div className={`w-16 h-1 rounded-full ${step === 'otp' || step === 'success' ? 'bg-green-600' : 'bg-slate-600'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'otp' ? 'bg-blue-600 text-white' : step === 'success' ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'}`}>
              {step === 'success' ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <div className={`w-16 h-1 rounded-full ${step === 'success' ? 'bg-green-600' : 'bg-slate-600'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'success' ? 'bg-green-600 text-white' : 'bg-slate-600 text-slate-300'}`}>
              {step === 'success' ? <CheckCircle className="w-5 h-5" /> : '3'}
            </div>
          </div>
          <div className="flex justify-center space-x-8 text-sm text-slate-400">
            <span className={step === 'aadhaar' ? 'text-blue-400' : step === 'otp' || step === 'success' ? 'text-green-400' : ''}>Aadhaar</span>
            <span className={step === 'otp' ? 'text-blue-400' : step === 'success' ? 'text-green-400' : ''}>OTP</span>
            <span className={step === 'success' ? 'text-green-400' : ''}>Verified</span>
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          layout
        >
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-8 h-8 text-amber-400" />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Aadhaar Verification</h2>
                <p className="text-slate-300 text-sm">Secure authentication with your Aadhaar</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 'aadhaar' && (
                <motion.form
                  key="aadhaar-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleAadhaarSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="aadhaar" className="block text-sm font-medium text-slate-300 mb-2">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      id="aadhaar"
                      value={aadhaar}
                      onChange={(e) => {
                        const formatted = formatAadhaar(e.target.value);
                        if (formatted.replace(/\s/g, '').length <= 12) {
                          setAadhaar(formatted);
                          setErrors(prev => ({ ...prev, aadhaar: undefined }));
                        }
                      }}
                      placeholder="1234 5678 9012"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled={loading}
                    />
                    {errors.aadhaar && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.aadhaar}</span>
                      </motion.p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      type="button"
                      onClick={onBackToHome}
                      className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-200"
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200"
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <span>Send OTP</span>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleOtpSubmit}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <p className="text-slate-300 mb-4">
                      OTP has been sent to your registered mobile number ending with ****56
                    </p>
                    <p className="text-xs text-slate-400">
                      Demo OTP: <span className="text-amber-400 font-mono">123456</span>
                    </p>
                  </div>

                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-2">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 6) {
                          setOtp(value);
                          setErrors(prev => ({ ...prev, otp: undefined }));
                        }
                      }}
                      placeholder="123456"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest"
                      disabled={loading}
                      maxLength={6}
                    />
                    {errors.otp && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.otp}</span>
                      </motion.p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      type="button"
                      onClick={() => setStep('aadhaar')}
                      className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-200"
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200"
                      whileTap={{ scale: 0.95 }}
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Verify OTP</span>
                      )}
                    </motion.button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 text-sm underline"
                      onClick={() => {
                        setStep('aadhaar');
                        toast.success('New OTP sent');
                      }}
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Verification Successful!</h3>
                    <p className="text-slate-300">
                      Your Aadhaar has been verified successfully. Redirecting to registration...
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-xs text-slate-400 bg-slate-800/30 rounded-lg p-4 border border-slate-700"
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Your Aadhaar data is encrypted and stored securely. We comply with UIDAI guidelines and data protection regulations.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AadhaarVerification;