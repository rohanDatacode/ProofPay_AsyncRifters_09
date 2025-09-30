import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, Shield, CreditCard, FileText, ArrowLeft } from 'lucide-react';
import { Application, User } from '../../types';
import { mockApi } from '../../utils/mockApi';
import AadhaarVerification from '../Auth/AadhaarVerification';

interface StatusTrackerProps {
  user: User | null;
  onBack: () => void;
}

const StatusTracker = ({ user: initialUser, onBack }: StatusTrackerProps) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [needsAuth, setNeedsAuth] = useState(!initialUser);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleAadhaarVerified = async (aadhaar: string) => {
    try {
      const userData = await mockApi.getUserByAadhaar(aadhaar);
      if (userData) {
        setUser(userData);
        setNeedsAuth(false);
      } else {
        // If user not found, create a basic user object for status tracking
        const basicUser: User = {
          id: `user_${Date.now()}`,
          aadhaar,
          name: 'User',
          email: '',
          phone: '',
          address: '',
          state: '',
          pincode: '',
          gender: '',
          bankAccount: '',
          ifscCode: '',
          createdAt: new Date().toISOString()
        };
        setUser(basicUser);
        setNeedsAuth(false);
      }
    } catch (error) {
      console.error('Failed to verify user:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;
    
    try {
      const apps = await mockApi.getApplicationsByUser(user.id);
      setApplications(apps);
      if (apps.length > 0) {
        setSelectedApp(apps[0]);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show Aadhaar verification if user is not authenticated
  if (needsAuth) {
    return (
      <AadhaarVerification onVerificationSuccess={handleAadhaarVerified} onBackToHome={onBack} />
    );
  }

  const statusSteps = [
    { 
      id: 'submitted', 
      title: 'Application Submitted', 
      description: 'Your application has been received',
      icon: FileText,
      color: 'blue'
    },
    { 
      id: 'ai-verified', 
      title: 'AI Verification Complete', 
      description: 'Risk assessment and document verification completed',
      icon: Shield,
      color: 'purple'
    },
    { 
      id: 'authority-approved', 
      title: 'Authority Approval', 
      description: 'Application reviewed and approved by authorities',
      icon: CheckCircle,
      color: 'green'
    },
    { 
      id: 'contract-triggered', 
      title: 'Smart Contract Triggered', 
      description: 'Blockchain transaction initiated',
      icon: Shield,
      color: 'amber'
    },
    { 
      id: 'transferred', 
      title: 'DBT Transferred', 
      description: 'Benefit amount transferred to your account',
      icon: CreditCard,
      color: 'emerald'
    }
  ];

  const getStatusIndex = (status: Application['status']) => {
    return statusSteps.findIndex(step => step.id === status);
  };

  const getStatusColor = (status: Application['status']) => {
    const step = statusSteps.find(s => s.id === status);
    return step?.color || 'gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No Applications Found</h2>
          <p className="text-slate-300 mb-8">You haven't submitted any applications yet.</p>
          <motion.button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
            whileTap={{ scale: 0.95 }}
          >
            Start New Application
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Application Status</h1>
              <p className="text-slate-300">Track your benefit transfer applications</p>
            </div>
            <motion.button
              onClick={onBack}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Applications</h2>
              <div className="space-y-3">
                {applications.map((app) => (
                  <motion.div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedApp?.id === app.id
                        ? 'bg-blue-600/30 border border-blue-500'
                        : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800/70'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {app.id.split('_')[1]}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.riskScore === 'low' 
                          ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                          : 'bg-red-900/50 text-red-400 border border-red-500/30'
                      }`}>
                        {app.riskScore === 'low' ? 'Low Risk' : 'High Risk'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2 capitalize">
                      {app.applicationType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-semibold">
                        ₹{app.amount.toLocaleString()}
                      </span>
                      <div className={`flex items-center space-x-1 text-xs ${
                        app.status === 'transferred' ? 'text-green-400' :
                        app.status === 'submitted' ? 'text-blue-400' :
                        'text-amber-400'
                      }`}>
                        {app.status === 'transferred' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : app.status === 'submitted' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <Shield className="w-3 h-3" />
                        )}
                        <span className="capitalize">
                          {app.status.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedApp && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Application Timeline</h2>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Application ID</p>
                    <p className="text-white font-mono">{selectedApp.id}</p>
                  </div>
                </div>

                {/* Application Details */}
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 mb-1">Case Type</p>
                      <p className="text-white capitalize">
                        {selectedApp.applicationType.replace(/([A-Z])/g, ' $1')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Amount</p>
                      <p className="text-amber-400 font-semibold">
                        ₹{selectedApp.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Risk Score</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedApp.riskScore === 'low' 
                          ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                          : 'bg-red-900/50 text-red-400 border border-red-500/30'
                      }`}>
                        {selectedApp.riskScore === 'low' ? 'Low Risk' : 'High Risk'}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Submitted</p>
                      <p className="text-white">
                        {new Date(selectedApp.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const currentIndex = getStatusIndex(selectedApp.status);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = step.icon;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex flex-col items-center">
                          <motion.div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                              isCompleted
                                ? `bg-${step.color}-600 border-${step.color}-500`
                                : isCurrent
                                ? `bg-${step.color}-600/50 border-${step.color}-500 animate-pulse`
                                : 'bg-slate-700 border-slate-600'
                            }`}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Icon className={`w-6 h-6 ${
                              isCompleted || isCurrent ? 'text-white' : 'text-slate-400'
                            }`} />
                          </motion.div>
                          {index < statusSteps.length - 1 && (
                            <div className={`w-px h-16 mt-2 ${
                              isCompleted ? `bg-${step.color}-500` : 'bg-slate-600'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-lg font-medium ${
                              isCompleted || isCurrent ? 'text-white' : 'text-slate-400'
                            }`}>
                              {step.title}
                            </h3>
                            {isCompleted && (
                              <span className="text-green-400 text-sm font-medium">
                                ✓ Completed
                              </span>
                            )}
                            {isCurrent && !isCompleted && (
                              <span className="text-amber-400 text-sm font-medium animate-pulse">
                                ⏳ In Progress
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            isCompleted || isCurrent ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            {step.description}
                          </p>
                          
                          {/* Special messages for certain steps */}
                          {isCurrent && step.id === 'ai-verified' && (
                            <div className="mt-3 p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                              <p className="text-purple-400 text-sm">
                                🤖 AI systems are analyzing your application and verifying documents...
                              </p>
                            </div>
                          )}
                          
                          {isCurrent && step.id === 'authority-approved' && (
                            <div className="mt-3 p-3 bg-amber-900/30 border border-amber-500/30 rounded-lg">
                              <p className="text-amber-400 text-sm">
                                👨‍💼 Your application is under review by authorized personnel...
                              </p>
                            </div>
                          )}
                          
                          {isCurrent && step.id === 'contract-triggered' && (
                            <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                              <p className="text-blue-400 text-sm">
                                ⛓️ Smart contract is being executed on the blockchain...
                              </p>
                            </div>
                          )}
                          
                          {isCompleted && step.id === 'transferred' && (
                            <div className="mt-3 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                              <p className="text-green-400 text-sm">
                                💸 ₹{selectedApp.amount.toLocaleString()} has been transferred to your Aadhaar-linked bank account ending with ****{user.bankAccount.slice(-4)}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Blockchain Verification */}
                {selectedApp.status !== 'submitted' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-gradient-to-r from-slate-800/50 to-blue-900/30 rounded-lg p-4 border border-slate-700"
                  >
                    <h3 className="text-white font-medium mb-2 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span>Blockchain Verification</span>
                    </h3>
                    <p className="text-slate-300 text-sm mb-3">
                      All transactions are recorded on an immutable blockchain ledger for complete transparency and security.
                    </p>
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400">Blockchain Hash: 0x{selectedApp.id.replace('app_', '')}</span>
                      </div>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">Block #{Math.floor(Math.random() * 1000000)}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;