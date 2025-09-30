import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, User } from 'lucide-react';
import { Language } from '../../types';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: string | null;
  onLogout: () => void;
  onNavigate: (section: string) => void;
}

const Navbar = ({ currentLanguage, onLanguageChange, currentUser, onLogout, onNavigate }: NavbarProps) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'regional', name: 'Regional', flag: '🏛️' }
  ];

  const navLinks = [
    { id: 'home', label: 'Home', labelHi: 'होम' },
    { id: 'apply', label: 'Apply', labelHi: 'आवेदन करें' },
    { id: 'track', label: 'Track Status', labelHi: 'स्थिति ट्रैक करें' },
    { id: 'beneficiary', label: 'Beneficiary Login', labelHi: 'लाभार्थी लॉगिन' },
    { id: 'admin', label: 'Admin Login', labelHi: 'व्यवस्थापक लॉगिन' }
  ];

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <Shield className="h-8 w-8 text-amber-400" />
              <div className="absolute inset-0 bg-amber-400/20 blur-lg rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ProofPay</h1>
              <p className="text-xs text-slate-300">DBT Portal</p>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="relative text-slate-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                style={{ cursor: 'pointer' }}
              >
                {currentLanguage === 'hi' ? link.labelHi : link.label}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="h-4 w-4 text-slate-300" />
                <span className="text-sm text-slate-300">
                  {languages.find(lang => lang.code === currentLanguage)?.flag}
                </span>
              </motion.button>

              {isLanguageOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code as Language);
                        setIsLanguageOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors duration-200 text-sm text-slate-300 flex items-center space-x-3"
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* User Info */}
            {currentUser && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800 rounded-lg">
                  <User className="h-4 w-4 text-slate-300" />
                  <span className="text-sm text-slate-300">{currentUser}</span>
                </div>
                <motion.button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;