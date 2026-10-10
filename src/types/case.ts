export type CasePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type CaseStatusType =
  | 'SUBMITTED'
  | 'TRIAGED'
  | 'AI_TRIAGED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'UNDER_INVESTIGATION'
  | 'FIELD_INSPECTION'
  | 'ACTION_IN_PROGRESS'
  | 'RESPONSE'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED'
  | 'ESCALATED';

export type DepartmentType =
  | 'Public Works & Roads (PWD)'
  | 'Municipal Water Supply & Sanitation'
  | 'Electricity & Power Distribution (DISCOM)'
  | 'Food, Civil Supplies & Consumer Affairs'
  | 'Social Welfare & Pensions'
  | 'Revenue & Land Records'
  | 'Public Health & Family Welfare'
  | 'Urban Development & Housing (PMAY)'
  | 'Education & Scholarships';

export interface CaseEvidence {
  id: string;
  name: string;
  type: 'IMAGE' | 'PDF' | 'AUDIO' | 'DIGILOCKER_CERT';
  url: string;
  size: string;
  uploadedAt: string;
  verified: boolean;
  metadata?: {
    geoTag?: string;
    timestamp?: string;
    digiLockerDocId?: string;
    issuer?: string;
  };
}

export interface CaseTimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: {
    name: string;
    role: string;
    avatar?: string;
  };
  status: CaseStatusType;
  comment?: string;
  isAutomated?: boolean;
}

export interface CaseItem {
  id: string; // e.g. "JS-2026-8942"
  title: string;
  description: string;
  category: string;
  department: DepartmentType;
  ward: string;
  district: string;
  state: string;
  pincode: string;
  address: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  status: CaseStatusType;
  priority: CasePriority;
  slaDays: number;
  slaDeadline: string; // ISO date string
  isSlaBreached: boolean;
  submittedAt: string;
  updatedAt: string;
  citizen: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    aadhaarMasked: string;
    language: string;
    isVerified: boolean;
  };
  assignedOfficer?: {
    id: string;
    name: string;
    designation: string;
    department: DepartmentType;
    phone: string;
    email: string;
  };
  evidence: CaseEvidence[];
  timeline: CaseTimelineItem[];
  aiAnalysis?: {
    sentiment: 'URGENT' | 'DISTRESSED' | 'MODERATE' | 'NEUTRAL';
    confidenceScore: number;
    summary: string;
    suggestedDepartment: DepartmentType;
    duplicateRiskScore: number; // 0-100%
    similarCaseIds?: string[];
    extractedKeywords: string[];
    suggestedResolutionWorkflow: string[];
  };
  tags: string[];
  citizenRating?: number;
  citizenFeedback?: string;
}
