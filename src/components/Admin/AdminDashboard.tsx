import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Eye,
  FileText,
  Shield,
  BarChart3,
  LogOut,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Application, Admin } from '../../types';
import { mockApi } from '../../utils/mockApi';
import SmartContractSimulation from './SmartContractSimulation';
import toast from 'react-hot-toast';

interface AdminDashboardProps {
  admin: Admin;
  onLogout: () => void;
}

const AdminDashboard = ({ admin, onLogout }: AdminDashboardProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filter, setFilter] = useState<'all' | 'high-risk' | 'low-risk'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showSmartContract, setShowSmartContract] = useState<Application | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [appsData, analyticsData] = await Promise.all([
        mockApi.getAllApplications(),
        mockApi.getAnalytics()
      ]);
      setApplications(appsData);
      setAnalytics(analyticsData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAndPush = async (appId: string) => {
    setActionLoading(appId);
    try {
      await mockApi.updateApplicationStatus(appId, 'authority-approved', 'Approved by central admin authority');
      toast.success('Application approved! Initiating smart contract...');
      
      const app = applications.find(a => a.id === appId);
      if (app) {
        setShowSmartContract(app);
      }
    } catch (error) {
      toast.error('Failed to process application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (appId: string) => {
    setActionLoading(appId);
    try {
      await mockApi.updateApplicationStatus(appId, 'submitted', 'Rejected - requires field verification');
      toast.success('Application marked for field verification');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to update application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSmartContractComplete = async (transactionDetails: { transactionId: string; blockchainHash: string }) => {
    if (showSmartContract) {
      try {
        const result = await mockApi.triggerSmartContract(showSmartContract.id);
        if (result.success) {
          toast.success(`Payment of ₹${showSmartContract.amount.toLocaleString()} transferred successfully!`);
          loadDashboardData();
        }
      } catch (error) {
        toast.error('Smart contract execution failed');
      }
    }
    setShowSmartContract(null);
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'high-risk') return app.riskScore === 'high';
    if (filter === 'low-risk') return app.riskScore === 'low';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-300">ProofPay DBT Portal Management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{admin.name}</p>
              <p className="text-slate-400 text-sm">{admin.email}</p>
            </div>
            <motion.button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Applications',
                value: analytics.totalApplications,
                change: '+12%',
                icon: FileText,
                color: 'blue'
              },
              {
                title: 'Total Disbursed',
                value: `₹${(analytics.totalDisbursed / 10000000).toFixed(1)}Cr`,
                change: '+8%',
                icon: DollarSign,
                color: 'green'
              },
              {
                title: 'High Risk Cases',
                value: analytics.highRiskApplications,
                change: '-5%',
                icon: AlertTriangle,
                color: 'red'
              },
              {
                title: 'Success Rate',
                value: `${((analytics.transferredApplications / analytics.totalApplications) * 100).toFixed(1)}%`,
                change: '+2%',
                icon: TrendingUp,
                color: 'emerald'
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-${stat.color}-600/20 rounded-lg`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-slate-400 text-sm">{stat.title}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Charts */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <span>Monthly Applications</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                  <YAxis tick={{ fill: '#9CA3AF' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <span>Disbursement Trend</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                  <YAxis tick={{ fill: '#9CA3AF' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [`₹${(value / 1000000).toFixed(1)}M`, 'Disbursed']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="disbursed" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Applications Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Users className="w-6 h-6 text-blue-400" />
                <span>Applications Management</span>
              </h3>
              
              {/* Filter Buttons */}
              <div className="flex items-center space-x-2">
                {[
                  { key: 'all', label: 'All Applications', count: applications.length },
                  { key: 'high-risk', label: 'High Risk', count: applications.filter(a => a.riskScore === 'high').length },
                  { key: 'low-risk', label: 'Low Risk', count: applications.filter(a => a.riskScore === 'low').length }
                ].map((filterOption) => (
                  <motion.button
                    key={filterOption.key}
                    onClick={() => setFilter(filterOption.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === filterOption.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filterOption.label} ({filterOption.count})
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredApplications.map((app) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {app.id.split('_')[1]}
                        </div>
                        <div className="text-sm text-slate-400">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 capitalize">
                      {app.applicationType.replace(/([A-Z])/g, ' $1')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-amber-400">
                      ₹{app.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        app.riskScore === 'low'
                          ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                          : 'bg-red-900/50 text-red-400 border border-red-500/30'
                      }`}>
                        {app.riskScore === 'low' ? 'Low Risk' : 'High Risk'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        app.status === 'transferred' ? 'bg-green-900/50 text-green-400' :
                        app.status === 'submitted' ? 'bg-blue-900/50 text-blue-400' :
                        'bg-amber-900/50 text-amber-400'
                      }`}>
                        {app.status.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <motion.button
                        onClick={() => setSelectedApp(app)}
                        className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      
                      {app.status === 'ai-verified' && (
                        <>
                          <motion.button
                            onClick={() => handleApproveAndPush(app.id)}
                            disabled={actionLoading === app.id}
                            className="text-green-400 hover:text-green-300 p-1 rounded transition-colors disabled:opacity-50 flex items-center space-x-1"
                            whileTap={{ scale: 0.95 }}
                          >
                            <Zap className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleReject(app.id)}
                            disabled={actionLoading === app.id}
                            className="text-red-400 hover:text-red-300 p-1 rounded transition-colors disabled:opacity-50"
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                      
                      {app.status === 'high-risk-review' && (
                        <>
                          <motion.button
                            onClick={() => handleApproveAndPush(app.id)}
                            disabled={actionLoading === app.id}
                            className="text-green-400 hover:text-green-300 p-1 rounded transition-colors disabled:opacity-50"
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleReject(app.id)}
                            disabled={actionLoading === app.id}
                            className="text-red-400 hover:text-red-300 p-1 rounded transition-colors disabled:opacity-50"
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Application Details Modal */}
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 rounded-2xl border border-slate-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Application Details</h3>
                <motion.button
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Application ID</p>
                    <p className="text-white font-mono">{selectedApp.id}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Submitted</p>
                    <p className="text-white">{new Date(selectedApp.submittedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Application Type</p>
                    <p className="text-white capitalize">{selectedApp.applicationType.replace(/([A-Z])/g, ' $1')}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Amount</p>
                    <p className="text-amber-400 font-semibold">₹{selectedApp.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span>AI Risk Assessment</span>
                  </h4>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-300">Risk Score:</span>
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      selectedApp.riskScore === 'low' 
                        ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                        : 'bg-red-900/50 text-red-400 border border-red-500/30'
                    }`}>
                      {selectedApp.riskScore === 'low' ? 'Low Risk (15%)' : 'High Risk (85%)'}
                    </span>
                  </div>
                  
                  {selectedApp.aiVerification && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Duplicate Check</span>
                        <span className={selectedApp.aiVerification.duplicateCheck ? 'text-green-400' : 'text-red-400'}>
                          {selectedApp.aiVerification.duplicateCheck ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Document Authenticity</span>
                        <span className={selectedApp.aiVerification.documentAuthenticity ? 'text-green-400' : 'text-red-400'}>
                          {selectedApp.aiVerification.documentAuthenticity ? '✓ Verified' : '✗ Failed'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Identity Verification</span>
                        <span className={selectedApp.aiVerification.identityVerification ? 'text-green-400' : 'text-red-400'}>
                          {selectedApp.aiVerification.identityVerification ? '✓ Verified' : '✗ Failed'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Fraud Detection</span>
                        <span className={selectedApp.aiVerification.fraudDetection ? 'text-green-400' : 'text-red-400'}>
                          {selectedApp.aiVerification.fraudDetection ? '✓ Clear' : '✗ Suspicious'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <h4 className="text-white font-medium mb-3">Evidence Files</h4>
                  <div className="space-y-2">
                    {selectedApp.evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300 text-sm">{file}</span>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedApp.adminNotes && (
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                    <h4 className="text-amber-400 font-medium mb-2">Admin Notes</h4>
                    <p className="text-slate-300 text-sm">{selectedApp.adminNotes}</p>
                  </div>
                )}

                {(selectedApp.status === 'ai-verified' || selectedApp.status === 'high-risk-review') && (
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => {
                        handleApproveAndPush(selectedApp.id);
                        setSelectedApp(null);
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                      whileTap={{ scale: 0.95 }}
                      disabled={actionLoading === selectedApp.id}
                    >
                      <Zap className="w-5 h-5" />
                      <span>Approve & Trigger Smart Contract</span>
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        handleReject(selectedApp.id);
                        setSelectedApp(null);
                      }}
                      className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                      whileTap={{ scale: 0.95 }}
                      disabled={actionLoading === selectedApp.id}
                    >
                      Reject
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Smart Contract Simulation */}
        {showSmartContract && (
          <SmartContractSimulation
            application={showSmartContract}
            onComplete={handleSmartContractComplete}
            onClose={() => setShowSmartContract(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;