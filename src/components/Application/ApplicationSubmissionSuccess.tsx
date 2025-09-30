import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Clock, Shield, CreditCard, Copy, Download } from 'lucide-react';
import { Application } from '../../types';

interface ApplicationSubmissionSuccessProps {
  application: Application;
  onContinue: () => void;
}

const ApplicationSubmissionSuccess = ({ application, onContinue }: ApplicationSubmissionSuccessProps) => {
  const [copied, setCopied] = useState(false);

  const copyApplicationId = () => {
    navigator.clipboard.writeText(application.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = () => {
    // Simulate receipt download
    const receiptData = {
      applicationId: application.id,
      applicationType: application.applicationType,
      submittedAt: application.submittedAt,
      amount: application.amount,
      status: application.status
    };
    
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ProofPay_Receipt_${application.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Application Submitted Successfully!</h1>
          <p className="text-xl text-slate-300">Your benefit transfer request has been received and is being processed</p>
        </motion.div>

        {/* Application Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden mb-6"
        >
          <div className="px-8 py-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white text-center">Application Receipt</h2>
          </div>

          <div className="p-8 space-y-6">
            {/* Application ID */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Application ID</p>
                  <p className="text-white font-mono text-lg">{application.id}</p>
                </div>
                <motion.button
                  onClick={copyApplicationId}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
                  whileTap={{ scale: 0.95 }}
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </motion.button>
              </div>
            </div>

            {/* Application Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">Application Type</p>
                <p className="text-white font-medium capitalize">
                  {application.applicationType.replace(/([A-Z])/g, ' $1')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Benefit Amount</p>
                <p className="text-amber-400 font-bold text-xl">₹{application.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Submitted On</p>
                <p className="text-white">{new Date(application.submittedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Current Status</p>
                <span className="inline-flex px-3 py-1 bg-blue-900/50 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                  Under Review
                </span>
              </div>
            </div>

            {/* Processing Timeline Preview */}
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
              <h3 className="text-white font-medium mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Processing Timeline</span>
              </h3>
              <div className="space-y-3">
                {[
                  { step: 'Application Submitted', status: 'completed', icon: FileText },
                  { step: 'AI Verification', status: 'current', icon: Shield },
                  { step: 'Authority Review', status: 'pending', icon: CheckCircle },
                  { step: 'Payment Processing', status: 'pending', icon: CreditCard }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'current' ? 'bg-blue-500 animate-pulse' :
                        'bg-slate-600'
                      }`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-sm ${
                        item.status === 'completed' ? 'text-green-400' :
                        item.status === 'current' ? 'text-blue-400' :
                        'text-slate-400'
                      }`}>
                        {item.step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-400 font-medium mb-2">Important Information</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Keep your Application ID safe for future reference</li>
                <li>• You will receive SMS updates on your registered mobile number</li>
                <li>• Processing typically takes 3-5 business days</li>
                <li>• You can track your application status anytime using the Track Status feature</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={downloadReceipt}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                <span>Download Receipt</span>
              </motion.button>
              <motion.button
                onClick={onContinue}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
                whileTap={{ scale: 0.95 }}
              >
                Continue to Dashboard
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center text-slate-400 text-sm"
        >
          <p>Need help? Contact our support team at <span className="text-blue-400">support@proofpay.gov.in</span> or call <span className="text-blue-400">1800-XXX-XXXX</span></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ApplicationSubmissionSuccess;