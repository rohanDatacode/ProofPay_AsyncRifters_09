import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  CreditCard, 
  Database,
  Link,
  Clock,
  DollarSign
} from 'lucide-react';
import { Application } from '../../types';

interface SmartContractSimulationProps {
  application: Application;
  onComplete: (transactionDetails: { transactionId: string; blockchainHash: string }) => void;
  onClose: () => void;
}

const SmartContractSimulation = ({ application, onComplete, onClose }: SmartContractSimulationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [blockchainHash, setBlockchainHash] = useState('');

  const steps = [
    { 
      id: 'validation', 
      title: 'Smart Contract Validation', 
      description: 'Validating application data and eligibility criteria',
      icon: Shield,
      duration: 2000
    },
    { 
      id: 'blockchain', 
      title: 'Blockchain Network Connection', 
      description: 'Connecting to government blockchain network',
      icon: Link,
      duration: 1500
    },
    { 
      id: 'contract', 
      title: 'Contract Execution', 
      description: 'Executing smart contract for benefit transfer',
      icon: Zap,
      duration: 3000
    },
    { 
      id: 'pfms', 
      title: 'PFMS Integration', 
      description: 'Initiating transfer through Public Financial Management System',
      icon: Database,
      duration: 2500
    },
    { 
      id: 'transfer', 
      title: 'Fund Transfer', 
      description: 'Transferring funds to Aadhaar-linked bank account',
      icon: CreditCard,
      duration: 2000
    },
    { 
      id: 'confirmation', 
      title: 'Transaction Complete', 
      description: 'Payment successfully transferred and recorded',
      icon: CheckCircle,
      duration: 1000
    }
  ];

  useEffect(() => {
    // Generate transaction details
    setTransactionId(`TXN_${Date.now()}`);
    setBlockchainHash(`0x${Math.random().toString(16).substr(2, 64)}`);

    // Start the simulation
    const runSimulation = async () => {
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        setCurrentStep(i + 1);
      }
      
      // Complete the process
      setTimeout(() => {
        onComplete({
          transactionId: `TXN_${Date.now()}`,
          blockchainHash: `0x${Math.random().toString(16).substr(2, 64)}`
        });
      }, 1000);
    };

    runSimulation();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 rounded-2xl border border-slate-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Smart Contract Execution</h2>
          <p className="text-slate-300">Processing benefit transfer for Application #{application.id.split('_')[1]}</p>
        </div>

        {/* Application Details */}
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-1">Beneficiary</p>
              <p className="text-white font-medium">{application.basicDetails.name}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Application Type</p>
              <p className="text-white font-medium">{application.applicationType}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Transfer Amount</p>
              <p className="text-amber-400 font-bold text-lg">₹{application.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Risk Score</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                application.riskScore === 'low' 
                  ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                  : 'bg-red-900/50 text-red-400 border border-red-500/30'
              }`}>
                {application.riskScore === 'low' ? 'Low Risk' : 'High Risk'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isActive = index === currentStep - 1;
            const isPending = index >= currentStep;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : isActive 
                    ? 'bg-blue-900/20 border-blue-500/30' 
                    : 'bg-slate-800/30 border-slate-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500' 
                    : isActive 
                    ? 'bg-blue-500 animate-pulse' 
                    : 'bg-slate-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : isActive ? (
                    <Icon className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    isCompleted || isActive ? 'text-white' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${
                    isCompleted || isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {step.description}
                  </p>
                </div>

                <div className="text-right">
                  {isCompleted ? (
                    <span className="text-green-400 text-sm font-medium">✓ Complete</span>
                  ) : isActive ? (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-blue-400 text-sm">Processing...</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-sm">Pending</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Transaction Details */}
        {currentStep > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-slate-800/50 to-blue-900/30 rounded-lg p-4 mb-6 border border-slate-700"
          >
            <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-400" />
              <span>Transaction Details</span>
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-blue-400 font-mono">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blockchain Hash:</span>
                <span className="text-green-400 font-mono text-xs">{blockchainHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network:</span>
                <span className="text-white">Government Blockchain Network</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gas Fee:</span>
                <span className="text-white">₹0 (Government Sponsored)</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {currentStep >= steps.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-green-900/20 border border-green-500/30 rounded-lg p-6"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h3>
            <p className="text-slate-300 mb-4">
              ₹{application.amount.toLocaleString()} has been successfully transferred to the beneficiary's 
              Aadhaar-linked bank account.
            </p>
            <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 text-amber-400">
                <DollarSign className="w-5 h-5" />
                <span className="font-bold text-lg">₹{application.amount.toLocaleString()}</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">Transferred via PFMS</p>
            </div>
            <motion.button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200"
              whileTap={{ scale: 0.95 }}
            >
              Continue to Dashboard
            </motion.button>
          </motion.div>
        )}

        {/* Real-time Blockchain Visualization */}
        <div className="mt-6 bg-slate-800/30 rounded-lg p-4 border border-slate-700">
          <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
            <Link className="w-5 h-5 text-purple-400" />
            <span>Blockchain Network Activity</span>
          </h4>
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex space-x-1">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                />
              ))}
            </div>
            <span className="text-slate-400">Network confirmations: {Math.min(currentStep * 2, 12)}/12</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SmartContractSimulation;