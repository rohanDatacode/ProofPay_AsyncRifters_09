import { motion } from 'framer-motion';
import { Shield, Heart, Scale } from 'lucide-react';

interface ApplicationTypeSelectorProps {
  onTypeSelect: (type: 'PCR' | 'POA' | 'INTERCAST_MARRIAGE') => void;
  onBack: () => void;
}

const ApplicationTypeSelector = ({ onTypeSelect, onBack }: ApplicationTypeSelectorProps) => {
  const applicationTypes = [
    {
      id: 'PCR' as const,
      title: 'Police Complaint Report (PCR)',
      description: 'File a complaint for criminal incidents, harassment, or safety concerns',
      icon: Shield,
      color: 'from-red-600 to-orange-600',
      bgColor: 'bg-red-900/20',
      borderColor: 'border-red-500/30',
      amount: '₹1,00,000',
      features: ['CCTNS Integration', 'Real-time FIR Verification', 'Emergency Processing']
    },
    {
      id: 'POA' as const,
      title: 'Protection of Assets (POA)',
      description: 'Secure protection for property, assets, and financial security',
      icon: Scale,
      color: 'from-blue-600 to-purple-600',
      bgColor: 'bg-blue-900/20',
      borderColor: 'border-blue-500/30',
      amount: '₹1,50,000',
      features: ['Asset Verification', 'Legal Documentation', 'Court Integration']
    },
    {
      id: 'INTERCAST_MARRIAGE' as const,
      title: 'Inter-Caste Marriage Support',
      description: 'Financial assistance and protection for inter-caste marriages',
      icon: Heart,
      color: 'from-pink-600 to-rose-600',
      bgColor: 'bg-pink-900/20',
      borderColor: 'border-pink-500/30',
      amount: '₹75,000',
      features: ['Marriage Verification', 'Social Protection', 'Family Counseling']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Select Application Type</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the type of assistance you need. Each application type has specific requirements and benefits.
          </p>
        </motion.div>

        {/* Application Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {applicationTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`${type.bgColor} backdrop-blur-md rounded-2xl border ${type.borderColor} p-8 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl`}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTypeSelect(type.id)}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${type.color} rounded-full mb-4`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{type.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{type.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-1">{type.amount}</div>
                    <div className="text-sm text-slate-400">Maximum Benefit Amount</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-semibold text-sm">Key Features:</h4>
                    {type.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-slate-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className={`w-full py-3 px-4 bg-gradient-to-r ${type.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200`}
                    whileTap={{ scale: 0.95 }}
                  >
                    Select This Type →
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <motion.button
            onClick={onBack}
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors duration-200"
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Home
          </motion.button>
        </div>

        {/* Information Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-2xl p-6"
        >
          <div className="text-center">
            <h3 className="text-amber-400 font-bold text-lg mb-2">Important Information</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              All applications undergo AI-powered verification, CCTNS database checks, and administrative review. 
              Fraudulent applications will be rejected and may result in legal action. Ensure all information 
              provided is accurate and truthful.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationTypeSelector;