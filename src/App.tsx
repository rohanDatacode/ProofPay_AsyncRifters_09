import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import Hero from './components/Hero/ParticleBackground';
import AadhaarVerification from './components/Auth/AadhaarVerification';
import RegistrationForm from './components/Registration/RegistrationForm';
import ApplicationTypeSelector from './components/Application/ApplicationTypeSelector';
import EnhancedApplicationWizard from './components/Application/EnhancedApplicationWizard';
import ApplicationSubmissionSuccess from './components/Application/ApplicationSubmissionSuccess';
import StatusTracker from './components/Status/StatusTracker';
import AdminLogin from './components/Auth/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import { User, Application, Admin, Language } from './types';

type AppState = 
  | 'home'
  | 'aadhaar-verification'
  | 'registration'
  | 'application-type-selection'
  | 'application'
  | 'application-success'
  | 'status'
  | 'admin-login'
  | 'admin-dashboard';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [verifiedAadhaar, setVerifiedAadhaar] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [selectedApplicationType, setSelectedApplicationType] = useState<'PCR' | 'POA' | 'INTERCAST_MARRIAGE' | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);

  const handleAadhaarVerified = (aadhaar: string) => {
    setVerifiedAadhaar(aadhaar);
    setCurrentState('registration');
  };

  const handleRegistrationComplete = (user: User) => {
    setCurrentUser(user);
    setCurrentState('application-type-selection');
  };

  const handleApplicationTypeSelected = (type: 'PCR' | 'POA' | 'INTERCAST_MARRIAGE') => {
    setSelectedApplicationType(type);
    setCurrentState('application');
  };

  const handleApplicationSubmitted = (application: Application) => {
    setUserApplications(prev => [...prev, application]);
    setSubmittedApplication(application);
    setCurrentState('application-success');
  };

  const handleAdminLogin = (admin: Admin) => {
    setCurrentAdmin(admin);
    setCurrentState('admin-dashboard');
  };

  const handleNavigation = (section: string) => {
    switch (section) {
      case 'home':
        setCurrentState('home');
        break;
      case 'apply':
        if (currentUser) {
          setCurrentState('application-type-selection');
        } else {
          setCurrentState('aadhaar-verification');
        }
        break;
      case 'track':
        setCurrentState('status');
        break;
      case 'beneficiary':
        setCurrentState('aadhaar-verification');
        break;
      case 'admin':
        setCurrentState('admin-login');
        break;
      default:
        setCurrentState('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentAdmin(null);
    setVerifiedAadhaar(null);
    setUserApplications([]);
    setSelectedApplicationType(null);
    setSubmittedApplication(null);
    setCurrentState('home');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid #475569',
          },
        }}
      />

      {currentState === 'home' && (
        <Navbar
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          currentUser={currentUser?.name || currentAdmin?.name || null}
          onLogout={handleLogout}
          onNavigate={handleNavigation}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentState}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {currentState === 'home' && (
            <div>
              <Hero />
              {/* Navigation Cards */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Start Application',
                      description: 'Begin your benefit transfer application with Aadhaar verification',
                      icon: '🚀',
                      action: () => setCurrentState('aadhaar-verification'),
                      gradient: 'from-blue-600 to-purple-600'
                    },
                    {
                      title: 'Track Status',
                      description: 'Monitor your application progress and disbursement status',
                      icon: '📊',
                      action: () => {
                        if (currentUser) {
                          setCurrentState('status');
                        } else {
                          setCurrentState('aadhaar-verification');
                        }
                      },
                      gradient: 'from-green-600 to-blue-600'
                    },
                    {
                      title: 'Admin Portal',
                      description: 'Administrative access for application management',
                      icon: '🛡️',
                      action: () => setCurrentState('admin-login'),
                      gradient: 'from-amber-600 to-orange-600'
                    }
                  ].map((card, index) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.2 }}
                      className="group cursor-pointer"
                      onClick={card.action}
                      whileHover={{ y: -10 }}
                    >
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300 h-full">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {card.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
                        <p className="text-slate-300 mb-6 leading-relaxed">
                          {card.description}
                        </p>
                        <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${card.gradient} text-white rounded-lg font-semibold group-hover:shadow-lg transition-all duration-300`}>
                          Get Started →
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentState === 'aadhaar-verification' && (
            <AadhaarVerification
              onVerificationSuccess={handleAadhaarVerified}
              onBackToHome={() => setCurrentState('home')}
            />
          )}

          {currentState === 'registration' && verifiedAadhaar && (
            <RegistrationForm
              aadhaar={verifiedAadhaar}
              onRegistrationComplete={handleRegistrationComplete}
              onBack={() => setCurrentState('aadhaar-verification')}
            />
          )}

          {currentState === 'application-type-selection' && currentUser && (
            <ApplicationTypeSelector
              onTypeSelect={handleApplicationTypeSelected}
              onBack={() => setCurrentState('home')}
            />
          )}

          {currentState === 'application' && currentUser && selectedApplicationType && (
            <EnhancedApplicationWizard
              user={currentUser}
              applicationType={selectedApplicationType}
              onApplicationSubmit={handleApplicationSubmitted}
              onBack={() => setCurrentState('application-type-selection')}
            />
          )}

          {currentState === 'application-success' && submittedApplication && (
            <ApplicationSubmissionSuccess
              application={submittedApplication}
              onContinue={() => setCurrentState('status')}
            />
          )}

          {currentState === 'status' && currentUser && (
            <StatusTracker
              user={currentUser}
              onBack={() => setCurrentState('home')}
            />
          )}

          {currentState === 'admin-login' && (
            <AdminLogin
              onLoginSuccess={handleAdminLogin}
              onBack={() => setCurrentState('home')}
            />
          )}

          {currentState === 'admin-dashboard' && currentAdmin && (
            <AdminDashboard
              admin={currentAdmin}
              onLogout={handleLogout}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;