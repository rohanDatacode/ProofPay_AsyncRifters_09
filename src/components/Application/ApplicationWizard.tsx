import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Shield, CheckCircle, X, Eye } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';
import { User, Application } from '../../types';
import toast from 'react-hot-toast';

interface ApplicationWizardProps {
  user: User;
  onApplicationSubmit: (application: Application) => void;
  onBack: () => void;
}

const ApplicationWizard = ({ user, onApplicationSubmit, onBack }: ApplicationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    caseType: '',
    amount: 0,
    description: '',
    evidenceFiles: [] as File[]
  });

  const [verificationStatus, setVerificationStatus] = useState({
    cctns: false,
    eCourts: false,
    digiLocker: false
  });

  const steps = [
    { id: 1, title: 'Case Type', description: 'Select your case category' },
    { id: 2, title: 'Details', description: 'Provide case details' },
    { id: 3, title: 'Evidence', description: 'Upload supporting documents' },
    { id: 4, title: 'Verification', description: 'Real-time verification' },
    { id: 5, title: 'Declaration', description: 'Final declaration' }
  ];

  const caseTypes = [
    { id: 'compensation', name: 'Victim Compensation', amount: 100000, icon: '🛡️' },
    { id: 'rehabilitation', name: 'Rehabilitation Support', amount: 150000, icon: '🏠' },
    { id: 'medical', name: 'Medical Assistance', amount: 75000, icon: '🏥' },
    { id: 'education', name: 'Education Support', amount: 50000, icon: '📚' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      evidenceFiles: [...prev.evidenceFiles, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index)
    }));
  };

  const simulateVerification = async () => {
    setLoading(true);
    
    // Simulate CCTNS verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVerificationStatus(prev => ({ ...prev, cctns: true }));
    
    // Simulate eCourts verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setVerificationStatus(prev => ({ ...prev, eCourts: true }));
    
    // Simulate DigiLocker fetch
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVerificationStatus(prev => ({ ...prev, digiLocker: true }));
    
    setLoading(false);
    toast.success('All verifications completed successfully!');
    
    setTimeout(() => setCurrentStep(5), 1000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const application = await mockApi.submitApplication({
        userId: user.id,
        caseType: formData.caseType,
        amount: formData.amount,
        status: 'submitted',
        evidenceFiles: formData.evidenceFiles.map(f => f.name)
      });
      
      toast.success('Application submitted successfully!');
      onApplicationSubmit(application);
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Select Case Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseTypes.map((type) => (
                <motion.div
                  key={type.id}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    formData.caseType === type.id
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, caseType: type.id, amount: type.amount }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-3xl mb-3">{type.icon}</div>
                  <h4 className="text-lg font-medium text-white mb-2">{type.name}</h4>
                  <p className="text-slate-400 text-sm mb-3">Maximum benefit amount</p>
                  <p className="text-xl font-bold text-amber-400">₹{type.amount.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Case Details</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Case Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                placeholder="Please provide detailed description of your case..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h4 className="text-lg font-medium text-white mb-2">Selected Case Type</h4>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{caseTypes.find(t => t.id === formData.caseType)?.icon}</span>
                <div>
                  <p className="text-slate-300">{caseTypes.find(t => t.id === formData.caseType)?.name}</p>
                  <p className="text-amber-400 font-semibold">₹{formData.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Upload Evidence</h3>
            
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors duration-200 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg text-white mb-2">Drop files here or click to upload</p>
              <p className="text-slate-400 text-sm">Supported formats: PDF, JPG, PNG (Max 10MB each)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Uploaded Files */}
            {formData.evidenceFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-white">Uploaded Files</h4>
                {formData.evidenceFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white text-sm">{file.name}</p>
                        <p className="text-slate-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-slate-400 hover:text-blue-400 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* DigiLocker Integration */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-green-500/30">
              <h4 className="text-lg font-medium text-white mb-2 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>DigiLocker Integration</span>
              </h4>
              <p className="text-slate-300 text-sm mb-3">
                Automatically fetch documents from your DigiLocker account for seamless verification.
              </p>
              <motion.button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  toast.success('DigiLocker documents fetched successfully!');
                  setFormData(prev => ({
                    ...prev,
                    evidenceFiles: [
                      ...prev.evidenceFiles,
                      new File([''], 'aadhaar_card.pdf', { type: 'application/pdf' }),
                      new File([''], 'income_certificate.pdf', { type: 'application/pdf' })
                    ]
                  }));
                }}
              >
                Fetch from DigiLocker
              </motion.button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Real-time Verification</h3>
            
            <div className="space-y-4">
              {/* CCTNS Verification */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    verificationStatus.cctns ? 'bg-green-500' : loading ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'
                  }`}>
                    {verificationStatus.cctns ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Shield className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">CCTNS Verification</h4>
                    <p className="text-slate-400 text-sm">Crime and Criminal Tracking Network</p>
                  </div>
                </div>
                <div className="text-right">
                  {verificationStatus.cctns ? (
                    <span className="text-green-400 text-sm font-medium">✓ Verified</span>
                  ) : loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                      <span className="text-blue-400 text-sm">Verifying...</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">Pending</span>
                  )}
                </div>
              </div>

              {/* eCourts Verification */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    verificationStatus.eCourts ? 'bg-green-500' : loading ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'
                  }`}>
                    {verificationStatus.eCourts ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <FileText className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">eCourts Verification</h4>
                    <p className="text-slate-400 text-sm">Electronic Courts Database</p>
                  </div>
                </div>
                <div className="text-right">
                  {verificationStatus.eCourts ? (
                    <span className="text-green-400 text-sm font-medium">✓ Verified</span>
                  ) : loading && verificationStatus.cctns ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                      <span className="text-blue-400 text-sm">Verifying...</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">Pending</span>
                  )}
                </div>
              </div>

              {/* DigiLocker Verification */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    verificationStatus.digiLocker ? 'bg-green-500' : loading ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'
                  }`}>
                    {verificationStatus.digiLocker ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Shield className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">DigiLocker Authentication</h4>
                    <p className="text-slate-400 text-sm">Document authenticity verification</p>
                  </div>
                </div>
                <div className="text-right">
                  {verificationStatus.digiLocker ? (
                    <span className="text-green-400 text-sm font-medium">✓ Verified</span>
                  ) : loading && verificationStatus.eCourts ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                      <span className="text-blue-400 text-sm">Verifying...</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-sm">Pending</span>
                  )}
                </div>
              </div>
            </div>

            {!loading && !Object.values(verificationStatus).every(Boolean) && (
              <motion.button
                onClick={simulateVerification}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
                whileTap={{ scale: 0.95 }}
              >
                Start Verification Process
              </motion.button>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Final Declaration</h3>
            
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-medium text-white mb-4">Application Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Case Type:</span>
                  <span className="text-white">{caseTypes.find(t => t.id === formData.caseType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Maximum Benefit:</span>
                  <span className="text-amber-400 font-semibold">₹{formData.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Documents Uploaded:</span>
                  <span className="text-white">{formData.evidenceFiles.length} files</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verification Status:</span>
                  <span className="text-green-400">✓ All systems verified</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-400 font-medium mb-2">Important Declaration</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                I hereby declare that all information provided in this application is true and correct to the best of my knowledge. 
                I understand that providing false information may result in rejection of my application and/or legal consequences.
                I consent to the verification of the information provided through various government databases and systems.
              </p>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-slate-300">
                I agree to the above declaration and authorize the processing of my application.
              </span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step.id === currentStep
                    ? 'bg-blue-600 text-white'
                    : step.id < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-600 text-slate-300'
                }`}>
                  {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 rounded-full ${
                    step.id < currentStep ? 'bg-green-600' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep - 1]?.title}</h2>
            <p className="text-slate-300">{steps[currentStep - 1]?.description}</p>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8"
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
            <motion.button
              onClick={() => currentStep === 1 ? onBack() : setCurrentStep(prev => prev - 1)}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {currentStep === 1 ? 'Back to Home' : 'Previous'}
            </motion.button>
            
            {currentStep < 5 && (
              <motion.button
                onClick={() => {
                  if (currentStep === 4) {
                    simulateVerification();
                  } else {
                    setCurrentStep(prev => prev + 1);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                disabled={
                  loading ||
                  (currentStep === 1 && !formData.caseType) ||
                  (currentStep === 2 && !formData.description) ||
                  (currentStep === 3 && formData.evidenceFiles.length === 0) ||
                  (currentStep === 4 && !Object.values(verificationStatus).every(Boolean))
                }
              >
                {currentStep === 4 ? (loading ? 'Verifying...' : 'Start Verification') : 'Next'}
              </motion.button>
            )}

            {currentStep === 5 && (
              <motion.button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationWizard;