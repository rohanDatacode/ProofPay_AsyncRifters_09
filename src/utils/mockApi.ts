import { User, Application, Evidence, Admin, PoliceStation } from '../types';

// Mock data storage
let users: User[] = [];
let applications: Application[] = [];
let evidences: Evidence[] = [];
let currentOtp: string | null = null;
let otpExpiry: number | null = null;

const mockAdmin: Admin = {
  id: '1',
  email: 'admin@proofpay.gov.in',
  name: 'Central Admin Authority',
  role: 'central_admin'
};

// Mock police stations data
const policeStations: PoliceStation[] = [
  { id: '1', name: 'Connaught Place Police Station', district: 'New Delhi', state: 'Delhi', code: 'DL001' },
  { id: '2', name: 'Karol Bagh Police Station', district: 'New Delhi', state: 'Delhi', code: 'DL002' },
  { id: '3', name: 'Andheri Police Station', district: 'Mumbai', state: 'Maharashtra', code: 'MH001' },
  { id: '4', name: 'Bandra Police Station', district: 'Mumbai', state: 'Maharashtra', code: 'MH002' },
  { id: '5', name: 'Koramangala Police Station', district: 'Bangalore', state: 'Karnataka', code: 'KA001' },
  { id: '6', name: 'Whitefield Police Station', district: 'Bangalore', state: 'Karnataka', code: 'KA002' },
];

// Generate some dummy applications
const generateDummyApplications = () => {
  const dummyApps: Application[] = [
    {
      id: 'app_1703123456789',
      userId: 'user_1703123456789',
      applicationType: 'PCR',
      basicDetails: {
        name: 'Rajesh Kumar',
        gender: 'Male',
        contact: '+91 9876543210',
        address: '123 MG Road, New Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      incidentDetails: {
        policeStation: 'Connaught Place Police Station',
        dateOfIncident: '2024-01-15',
        firNumber: 'FIR/2024/001234',
        cctnsVerified: true
      },
      amount: 100000,
      status: 'ai-verified',
      riskScore: 'low',
      aiVerification: {
        duplicateCheck: true,
        documentAuthenticity: true,
        identityVerification: true,
        fraudDetection: true
      },
      evidenceFiles: ['medical_report.pdf', 'incident_photos.jpg', 'witness_statement.pdf'],
      submittedAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T11:45:00Z'
    },
    {
      id: 'app_1703123456790',
      userId: 'user_1703123456790',
      applicationType: 'INTERCAST_MARRIAGE',
      basicDetails: {
        name: 'Priya Sharma',
        gender: 'Female',
        contact: '+91 9876543211',
        address: '456 Park Street, Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      incidentDetails: {
        policeStation: 'Bandra Police Station',
        dateOfIncident: '2024-01-10',
        firNumber: 'FIR/2024/005678',
        cctnsVerified: true
      },
      amount: 75000,
      status: 'high-risk-review',
      riskScore: 'high',
      aiVerification: {
        duplicateCheck: false,
        documentAuthenticity: true,
        identityVerification: true,
        fraudDetection: true
      },
      evidenceFiles: ['marriage_certificate.pdf', 'threat_evidence.jpg'],
      submittedAt: '2024-01-18T14:20:00Z',
      updatedAt: '2024-01-18T15:30:00Z'
    },
    {
      id: 'app_1703123456791',
      userId: 'user_1703123456791',
      applicationType: 'POA',
      basicDetails: {
        name: 'Amit Singh',
        gender: 'Male',
        contact: '+91 9876543212',
        address: '789 Brigade Road, Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      incidentDetails: {
        policeStation: 'Koramangala Police Station',
        dateOfIncident: '2024-01-12',
        firNumber: 'FIR/2024/007890',
        cctnsVerified: true
      },
      amount: 150000,
      status: 'authority-approved',
      riskScore: 'low',
      aiVerification: {
        duplicateCheck: true,
        documentAuthenticity: true,
        identityVerification: true,
        fraudDetection: true
      },
      evidenceFiles: ['property_documents.pdf', 'threat_letter.jpg', 'police_complaint.pdf'],
      submittedAt: '2024-01-16T09:15:00Z',
      updatedAt: '2024-01-17T16:30:00Z'
    },
    {
      id: 'app_1703123456792',
      userId: 'user_1703123456792',
      applicationType: 'PCR',
      basicDetails: {
        name: 'Sunita Devi',
        gender: 'Female',
        contact: '+91 9876543213',
        address: '321 Civil Lines, Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226001'
      },
      incidentDetails: {
        policeStation: 'Hazratganj Police Station',
        dateOfIncident: '2024-01-08',
        firNumber: 'FIR/2024/003456',
        cctnsVerified: true
      },
      amount: 100000,
      status: 'transferred',
      riskScore: 'low',
      aiVerification: {
        duplicateCheck: true,
        documentAuthenticity: true,
        identityVerification: true,
        fraudDetection: true
      },
      evidenceFiles: ['medical_report.pdf', 'fir_copy.pdf', 'witness_statement.pdf'],
      submittedAt: '2024-01-14T11:20:00Z',
      updatedAt: '2024-01-19T14:45:00Z',
      paymentDetails: {
        transactionId: 'TXN_1703123456792',
        blockchainHash: '0x1234567890abcdef1234567890abcdef12345678',
        transferredAt: '2024-01-19T14:45:00Z'
      }
    },
    {
      id: 'app_1703123456793',
      userId: 'user_1703123456793',
      applicationType: 'INTERCAST_MARRIAGE',
      basicDetails: {
        name: 'Rahul Verma',
        gender: 'Male',
        contact: '+91 9876543214',
        address: '654 Sector 15, Chandigarh',
        state: 'Chandigarh',
        pincode: '160015'
      },
      incidentDetails: {
        policeStation: 'Sector 17 Police Station',
        dateOfIncident: '2024-01-05',
        firNumber: 'FIR/2024/002345',
        cctnsVerified: true
      },
      amount: 75000,
      status: 'ai-verified',
      riskScore: 'low',
      aiVerification: {
        duplicateCheck: true,
        documentAuthenticity: true,
        identityVerification: true,
        fraudDetection: true
      },
      evidenceFiles: ['marriage_certificate.pdf', 'caste_certificate.pdf', 'joint_photo.jpg'],
      submittedAt: '2024-01-12T13:45:00Z',
      updatedAt: '2024-01-13T10:20:00Z'
    },
    {
      id: 'app_1703123456794',
      userId: 'user_1703123456794',
      applicationType: 'POA',
      basicDetails: {
        name: 'Meera Patel',
        gender: 'Female',
        contact: '+91 9876543215',
        address: '987 Satellite Road, Ahmedabad',
        state: 'Gujarat',
        pincode: '380015'
      },
      incidentDetails: {
        policeStation: 'Satellite Police Station',
        dateOfIncident: '2024-01-03',
        firNumber: 'FIR/2024/001789',
        cctnsVerified: true
      },
      amount: 150000,
      status: 'high-risk-review',
      riskScore: 'high',
      aiVerification: {
        duplicateCheck: true,
        documentAuthenticity: false,
        identityVerification: true,
        fraudDetection: true
      },
      evidenceFiles: ['property_papers.pdf', 'bank_statement.pdf'],
      submittedAt: '2024-01-10T08:30:00Z',
      updatedAt: '2024-01-11T12:15:00Z'
    },
    {
      id: 'app_1703123456795',
      userId: 'user_1703123456795',
      applicationType: 'PCR',
      basicDetails: {
        name: 'Vikram Reddy',
        gender: 'Male',
        contact: '+91 9876543216',
        address: '147 Jubilee Hills, Hyderabad',
        state: 'Telangana',
        pincode: '500033'
      },
      incidentDetails: {
        policeStation: 'Jubilee Hills Police Station',
        dateOfIncident: '2024-01-01',
        firNumber: 'FIR/2024/000123',
        cctnsVerified: true
      },
      amount: 100000,
      status: 'contract-triggered',
      riskScore: 'low',
      aiVerification: {
        duplicateCheck: true,
        documentAuthenticity: true,
        identityVerification: true,
        fraudDetection: true
      },
      evidenceFiles: ['incident_report.pdf', 'medical_certificate.pdf', 'witness_video.mp4'],
      submittedAt: '2024-01-08T15:00:00Z',
      updatedAt: '2024-01-18T09:30:00Z'
    }
  ];
  
  applications.push(...dummyApps);
};

// Initialize dummy data
generateDummyApplications();

// Mock API functions
export const mockApi = {
  // OTP Functions
  sendOtp: async (aadhaar: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    currentOtp = '123456';
    otpExpiry = Date.now() + 300000; // 5 minutes
    return { success: true, message: 'OTP sent to registered mobile number' };
  },

  verifyOtp: async (aadhaar: string, otp: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!currentOtp || !otpExpiry || Date.now() > otpExpiry) {
      return { success: false, message: 'OTP expired. Please request a new OTP.' };
    }
    if (otp === currentOtp) {
      currentOtp = null;
      otpExpiry = null;
      return { success: true, message: 'OTP verified successfully' };
    }
    return { success: false, message: 'Invalid OTP. Please try again.' };
  },

  // User Functions
  registerUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    return user;
  },

  getUserByAadhaar: async (aadhaar: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return users.find(user => user.aadhaar === aadhaar) || null;
  },

  // Police Station Functions
  getPoliceStations: async (): Promise<PoliceStation[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return policeStations;
  },

  // CCTNS Verification
  verifyCCTNS: async (firNumber: string, policeStation: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Mock verification - 90% success rate
    const isValid = Math.random() > 0.1;
    if (isValid) {
      return { success: true, message: 'FIR verified successfully with CCTNS database' };
    } else {
      return { success: false, message: 'FIR not found in CCTNS database. Please verify the details.' };
    }
  },

  // AI Verification Simulation
  performAIVerification: async (applicationData: any): Promise<Application['aiVerification']> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate AI checks with random results
    const verification = {
      duplicateCheck: Math.random() > 0.2, // 80% pass rate
      documentAuthenticity: Math.random() > 0.1, // 90% pass rate
      identityVerification: Math.random() > 0.05, // 95% pass rate
      fraudDetection: Math.random() > 0.15 // 85% pass rate
    };
    
    return verification;
  },

  // Application Functions
  submitApplication: async (appData: Omit<Application, 'id' | 'submittedAt' | 'updatedAt' | 'aiVerification'>): Promise<Application> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Perform AI verification
    const aiVerification = await mockApi.performAIVerification(appData);
    
    // Determine risk score based on AI verification
    const failedChecks = Object.values(aiVerification).filter(check => !check).length;
    const riskScore = failedChecks > 1 ? 'high' : 'low';
    const status = riskScore === 'high' ? 'high-risk-review' : 'ai-verified';
    
    const application: Application = {
      ...appData,
      id: `app_${Date.now()}`,
      status,
      riskScore,
      aiVerification,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    applications.push(application);
    return application;
  },

  getApplicationsByUser: async (userId: string): Promise<Application[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return applications.filter(app => app.userId === userId);
  },

  getAllApplications: async (): Promise<Application[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...applications];
  },

  updateApplicationStatus: async (appId: string, status: Application['status'], adminNotes?: string): Promise<Application | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const appIndex = applications.findIndex(app => app.id === appId);
    if (appIndex === -1) return null;
    
    applications[appIndex] = {
      ...applications[appIndex],
      status,
      adminNotes,
      updatedAt: new Date().toISOString()
    };
    
    return applications[appIndex];
  },

  // Smart Contract & Payment Simulation
  triggerSmartContract: async (appId: string): Promise<{ success: boolean; transactionId: string; blockchainHash: string }> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const transactionId = `TXN_${Date.now()}`;
    const blockchainHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Update application with payment details
    const appIndex = applications.findIndex(app => app.id === appId);
    if (appIndex !== -1) {
      applications[appIndex] = {
        ...applications[appIndex],
        status: 'transferred',
        paymentDetails: {
          transactionId,
          blockchainHash,
          transferredAt: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      };
    }
    
    return { success: true, transactionId, blockchainHash };
  },

  // Evidence Functions
  uploadEvidence: async (file: File, applicationId: string): Promise<Evidence> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const evidence: Evidence = {
      id: `evidence_${Date.now()}`,
      applicationId,
      fileName: file.name,
      fileType: file.type,
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString()
    };
    evidences.push(evidence);
    return evidence;
  },

  getEvidenceByApplication: async (applicationId: string): Promise<Evidence[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return evidences.filter(ev => ev.applicationId === applicationId);
  },

  // DigiLocker Simulation
  fetchFromDigiLocker: async (): Promise<{ files: string[]; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return {
      files: ['aadhaar_card.pdf', 'pan_card.pdf', 'income_certificate.pdf', 'caste_certificate.pdf'],
      message: 'Documents fetched successfully from DigiLocker'
    };
  },

  // Admin Functions
  adminLogin: async (email: string, password: string): Promise<{ success: boolean; admin?: Admin; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === mockAdmin.email && password === 'admin123') {
      return { success: true, admin: mockAdmin, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  // Analytics
  getAnalytics: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const totalApps = applications.length;
    const lowRisk = applications.filter(app => app.riskScore === 'low').length;
    const highRisk = applications.filter(app => app.riskScore === 'high').length;
    const transferred = applications.filter(app => app.status === 'transferred').length;
    const totalDisbursed = transferred * 100000;

    return {
      totalApplications: totalApps,
      lowRiskApplications: lowRisk,
      highRiskApplications: highRisk,
      totalDisbursed,
      transferredApplications: transferred,
      monthlyData: [
        { month: 'Jan', applications: 45, disbursed: 4500000 },
        { month: 'Feb', applications: 52, disbursed: 5200000 },
        { month: 'Mar', applications: 38, disbursed: 3800000 },
        { month: 'Apr', applications: 61, disbursed: 6100000 },
        { month: 'May', applications: 55, disbursed: 5500000 },
        { month: 'Jun', applications: 48, disbursed: 4800000 }
      ]
    };
  }
};