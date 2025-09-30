import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Shield, 
  CheckCircle, 
  X, 
  Eye, 
  AlertTriangle,
  Clock,
  Database,
  Brain,
  Zap
} from 'lucide-react';
import { mockApi } from '../../utils/mockApi';
import { User, Application, PoliceStation } from '../../types';
import toast from 'react-hot-toast';

interface EnhancedApplicationWizardProps {
  user: User;
  applicationType: 'PCR' | 'POA' | 'INTERCAST_MARRIAGE';
  onApplicationSubmit: (application: Application) => void;
  onBack: () => void;
}

const EnhancedApplicationWizard = ({ 
  user, 
  applicationType, 
  onApplicationSubmit, 
  onBack 
}: EnhancedApplicationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    basicDetails: {
      name: user.name || '',
      gender: user.gender || '',
      contact: user.phone || '',
      address: user.address || '',
      state: user.state || '',
      pincode: user.pincode || ''
    },
    incidentDetails: {
      policeStation: '',
      dateOfIncident: '',
      firNumber: '',
      cctnsVerified: false
    },
    evidenceFiles: [] as File[],
    description: ''
  });

  const [verificationStatus, setVerificationStatus] = useState({
    cctns: false,
    digiLocker: false,
    aiDuplicate: false,
    aiDocument: false,
    aiIdentity: false,
    aiFraud: false
  });

  const steps = [
    { id: 1, title: 'Basic Details', description: 'Personal information' },
    { id: 2, title: 'Incident Details', description: 'Police station & FIR details' },
    { id: 3, title: 'Evidence Upload', description: 'Supporting documents' },
    { id: 4, title: 'AI Verification', description: 'Automated verification process' }
  ];

  const applicationTypeDetails = {
    PCR: { name: 'Police Complaint Report', amount: 100000, icon: '🛡️' },
    POA: { name: 'Protection of Assets', amount: 150000, icon: '⚖️' },
    INTERCAST_MARRIAGE: { name: 'Inter-Caste Marriage Support', amount: 75000, icon: '💕' }
  };

  const loadPoliceStations = async () => {
    try {
      const stations = await mockApi.getPoliceStations();
      setPoliceStations(stations);
    } catch (error) {
      toast.error('Failed to load police stations');
    }
  };

  const handleCCTNSVerification = async () => {
    if (!formData.incidentDetails.firNumber || !formData.incidentDetails.policeStation) {
      toast.error('Please fill FIR number and police station');
      return;
    }

    setLoading(true);
    try {
      const result = await mockApi.verifyCCTNS(
        formData.incidentDetails.firNumber,
        formData.incidentDetails.policeStation
      );
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          incidentDetails: { ...prev.incidentDetails, cctnsVerified: true }
        }));
        setVerificationStatus(prev => ({ ...prev, cctns: true }));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('CCTNS verification failed');
    } finally {
      setLoading(false);
    }
  };

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

  const fetchFromDigiLocker = async () => {
    setLoading(true);
    try {
      const result = await mockApi.fetchFromDigiLocker();
      toast.success(result.message);
      
      // Simulate adding files
      const mockFiles = result.files.map(fileName => 
        new File([''], fileName, { type: 'application/pdf' })
      );
      
      setFormData(prev => ({
        ...prev,
        evidenceFiles: [...prev.evidenceFiles, ...mockFiles]
      }));
      
      setVerificationStatus(prev => ({ ...prev, digiLocker: true }));
    } catch (error) {
      toast.error('Failed to fetch from DigiLocker');
    } finally {
      setLoading(false);
    }
  };

  const performAIVerification = async () => {
    setLoading(true);
    
    // Simulate AI verification steps
    const steps = [
      { key: 'aiDuplicate', label: 'Duplicate Application Check', delay: 2000 },
      { key: 'aiDocument', label: 'Document Authenticity', delay: 1500 },
      { key: 'aiIdentity', label: 'Identity Verification', delay: 1000 },
      { key: 'aiFraud', label: 'Fraud Detection', delay: 2500 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setVerificationStatus(prev => ({ ...prev, [step.key]: true }));
      toast.success(`${step.label} completed`);
    }
    
    setLoading(false);
    toast.success('AI verification completed successfully!');
    
    setTimeout(() => handleSubmit(), 1000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const application = await mockApi.submitApplication({
        userId: user.id,
        applicationType,
        basicDetails: formData.basicDetails,
        incidentDetails: formData.incidentDetails,
        amount: applicationTypeDetails[applicationType].amount,
        status: 'submitted',
        riskScore: 'low',
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
            <h3 className="text-2xl font-semibold text-white mb-6">Basic Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.basicDetails.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    basicDetails: { ...prev.basicDetails, name: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Gender <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.basicDetails.gender}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    basicDetails: { ...prev.basicDetails, gender: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contact Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.basicDetails.contact}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    basicDetails: { ...prev.basicDetails, contact: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.basicDetails.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    basicDetails: { ...prev.basicDetails, state: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  PIN Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.basicDetails.pincode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    basicDetails: { ...prev.basicDetails, pincode: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Complete Address <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.basicDetails.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  basicDetails: { ...prev.basicDetails, address: e.target.value }
                }))}
                rows={3}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Incident Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Police Station <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.incidentDetails.policeStation}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    incidentDetails: { ...prev.incidentDetails, policeStation: e.target.value }
                  }))}
                  onFocus={loadPoliceStations}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Police Station</option>
                  {policeStations.map(station => (
                    <option key={station.id} value={station.name}>
                      {station.name} - {station.district}, {station.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date of Incident <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.incidentDetails.dateOfIncident}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    incidentDetails: { ...prev.incidentDetails, dateOfIncident: e.target.value }
                  }))}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                FIR Number <span className="text-red-400">*</span>
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={formData.incidentDetails.firNumber}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    incidentDetails: { ...prev.incidentDetails, firNumber: e.target.value }
                  }))}
                  placeholder="FIR/2024/001234"
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <motion.button
                  type="button"
                  onClick={handleCCTNSVerification}
                  disabled={loading || formData.incidentDetails.cctnsVerified}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    formData.incidentDetails.cctnsVerified
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } disabled:opacity-50`}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <Clock className="w-5 h-5 animate-spin" />
                  ) : formData.incidentDetails.cctnsVerified ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    'Verify CCTNS'
                  )}
                </motion.button>
              </div>
              {formData.incidentDetails.cctnsVerified && (
                <p className="text-green-400 text-sm mt-2 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>FIR verified with CCTNS database</span>
                </p>
              )}
            </div>

            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-400 font-medium mb-2 flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>CCTNS Integration</span>
              </h4>
              <p className="text-slate-300 text-sm">
                Crime and Criminal Tracking Network & Systems (CCTNS) verification ensures that your FIR 
                is genuine and registered in the national database. This step is mandatory for processing.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Evidence Upload</h3>
            
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

            {/* DigiLocker Integration */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-6 border border-green-500/30">
              <h4 className="text-lg font-medium text-white mb-3 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-green-400" />
                <span>DigiLocker Integration</span>
              </h4>
              <p className="text-slate-300 text-sm mb-4">
                Automatically fetch verified documents from your DigiLocker account for seamless verification.
              </p>
              <motion.button
                onClick={fetchFromDigiLocker}
                disabled={loading || verificationStatus.digiLocker}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  verificationStatus.digiLocker
                    ? 'bg-green-600 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50`}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Fetching...' : verificationStatus.digiLocker ? '✓ Documents Fetched' : 'Fetch from DigiLocker'}
              </motion.button>
            </div>

            {/* Uploaded Files */}
            {formData.evidenceFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-white">Uploaded Files ({formData.evidenceFiles.length})</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
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
                          <p className="text-slate-400 text-xs">
                            {file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'DigiLocker Document'}
                          </p>
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
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">AI Verification Pipeline</h3>
            
            <div className="space-y-4">
              {/* AI Verification Steps */}
              {[
                { key: 'aiDuplicate', title: 'Duplicate Application Check', icon: Brain, description: 'Checking for duplicate applications in the system' },
                { key: 'aiDocument', title: 'Document Authenticity', icon: FileText, description: 'Verifying authenticity of uploaded documents' },
                { key: 'aiIdentity', title: 'Identity Verification', icon: Shield, description: 'Cross-referencing identity with government databases' },
                { key: 'aiFraud', title: 'Fraud Detection', icon: AlertTriangle, description: 'Advanced fraud detection algorithms' }
              ].map((step, index) => {
                const Icon = step.icon;
                const isCompleted = verificationStatus[step.key as keyof typeof verificationStatus];
                const isActive = loading && !isCompleted;
                
                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-900/20 border-green-500/30' 
                        : isActive 
                        ? 'bg-blue-900/20 border-blue-500/30' 
                        : 'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-green-500' 
                          : isActive 
                          ? 'bg-blue-500 animate-pulse' 
                          : 'bg-slate-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{step.title}</h4>
                        <p className="text-slate-400 text-sm">{step.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {isCompleted ? (
                        <span className="text-green-400 text-sm font-medium">✓ Completed</span>
                      ) : isActive ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                          <span className="text-blue-400 text-sm">Processing...</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">Pending</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {!loading && !Object.values(verificationStatus).slice(2).every(Boolean) && (
              <motion.button
                onClick={performAIVerification}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-5 h-5" />
                <span>Start AI Verification</span>
              </motion.button>
            )}

            {Object.values(verificationStatus).slice(2).every(Boolean) && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h4 className="text-green-400 font-bold text-lg mb-2">AI Verification Complete!</h4>
                <p className="text-slate-300 text-sm">
                  All verification checks have passed. Your application will now be submitted for review.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {applicationTypeDetails[applicationType].icon} {applicationTypeDetails[applicationType].name}
              </h1>
              <p className="text-slate-300">Maximum Benefit: ₹{applicationTypeDetails[applicationType].amount.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

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
              {currentStep === 1 ? 'Back to Type Selection' : 'Previous'}
            </motion.button>
            
            {currentStep < 4 && (
              <motion.button
                onClick={() => {
                  if (currentStep === 2 && !formData.incidentDetails.cctnsVerified) {
                    toast.error('Please verify FIR with CCTNS before proceeding');
                    return;
                  }
                  setCurrentStep(prev => prev + 1);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                disabled={
                  loading ||
                  (currentStep === 1 && (!formData.basicDetails.name || !formData.basicDetails.gender)) ||
                  (currentStep === 2 && !formData.incidentDetails.cctnsVerified) ||
                  (currentStep === 3 && formData.evidenceFiles.length === 0)
                }
              >
                Next Step
              </motion.button>
            )}

            {currentStep === 4 && Object.values(verificationStatus).slice(2).every(Boolean) && (
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

export default EnhancedApplicationWizard;