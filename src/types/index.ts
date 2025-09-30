export interface User {
  id: string;
  aadhaar: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  pincode: string;
  gender: string;
  bankAccount: string;
  ifscCode: string;
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  applicationType: 'PCR' | 'POA' | 'INTERCAST_MARRIAGE';
  basicDetails: {
    name: string;
    gender: string;
    contact: string;
    address: string;
    state: string;
    pincode: string;
  };
  incidentDetails: {
    policeStation: string;
    dateOfIncident: string;
    firNumber: string;
    cctnsVerified: boolean;
  };
  amount: number;
  status: 'submitted' | 'ai-verified' | 'authority-approved' | 'contract-triggered' | 'transferred' | 'high-risk-review';
  riskScore: 'low' | 'high';
  aiVerification: {
    duplicateCheck: boolean;
    documentAuthenticity: boolean;
    identityVerification: boolean;
    fraudDetection: boolean;
  };
  evidenceFiles: string[];
  submittedAt: string;
  updatedAt: string;
  adminNotes?: string;
  paymentDetails?: {
    transactionId: string;
    blockchainHash: string;
    transferredAt: string;
  };
}

export interface Evidence {
  id: string;
  applicationId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'central_admin' | 'field_officer';
}

export type Language = 'en' | 'hi' | 'regional';

export interface PoliceStation {
  id: string;
  name: string;
  district: string;
  state: string;
  code: string;
}