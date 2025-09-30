import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';
import { User as UserType } from '../../types';
import toast from 'react-hot-toast';

interface RegistrationFormProps {
  aadhaar: string;
  onRegistrationComplete: (user: UserType) => void;
  onBack: () => void;
}

const RegistrationForm = ({ aadhaar, onRegistrationComplete, onBack }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    bankAccount: '',
    ifscCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await mockApi.registerUser({
        aadhaar,
        ...formData
      });
      toast.success('Registration completed successfully!');
      onRegistrationComplete(user);
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name as per Aadhaar',
      icon: User,
      required: true
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your.email@example.com',
      icon: User,
      required: true
    },
    {
      id: 'phone',
      label: 'Mobile Number',
      type: 'tel',
      placeholder: '+91 98765 43210',
      icon: Phone,
      required: true
    },
    {
      id: 'address',
      label: 'Address',
      type: 'text',
      placeholder: 'Enter your complete address',
      icon: MapPin,
      required: true
    },
    {
      id: 'pincode',
      label: 'PIN Code',
      type: 'text',
      placeholder: '123456',
      icon: MapPin,
      required: true
    },
    {
      id: 'bankAccount',
      label: 'Bank Account Number',
      type: 'text',
      placeholder: 'Enter your bank account number',
      icon: CreditCard,
      required: true
    },
    {
      id: 'ifscCode',
      label: 'IFSC Code',
      type: 'text',
      placeholder: 'ABCD0123456',
      icon: CreditCard,
      required: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Registration</h1>
          <p className="text-slate-300">Please provide your details to create your account</p>
          <div className="mt-4 text-sm text-slate-400">
            Aadhaar: <span className="font-mono text-amber-400">{aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}</span>
          </div>
        </div>

        {/* Registration Form */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {inputFields.map((field, index) => {
              const Icon = field.icon;
              const isFocused = focusedField === field.id;
              
              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <label htmlFor={field.id} className="block text-sm font-medium text-slate-300 mb-2">
                    {field.label} {field.required && <span className="text-red-400">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon className={`h-5 w-5 transition-colors duration-200 ${
                        isFocused ? 'text-blue-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <input
                      type={field.type}
                      id={field.id}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        isFocused ? 'border-blue-500 bg-slate-800/70' : 'border-slate-600'
                      }`}
                      disabled={loading}
                    />
                    {isFocused && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
            >
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={loading}
                />
                <span className="text-sm text-slate-300 leading-relaxed">
                  I hereby agree to the{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                    Privacy Policy
                  </a>. I consent to the processing of my personal data for the purpose of direct benefit transfer and related services.
                </span>
              </label>
            </motion.div>

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
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <span>{loading ? 'Registering...' : 'Complete Registration'}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-xs text-slate-400 bg-slate-800/30 rounded-lg p-4 border border-slate-700"
        >
          🔒 Your information is protected with bank-level security encryption. All data is stored in compliance with Digital India guidelines.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;