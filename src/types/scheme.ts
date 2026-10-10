export interface WelfareScheme {
  id: string;
  name: string;
  nameHi: string;
  code: string;
  category: 'FARMERS' | 'WOMEN_CHILD' | 'HEALTH' | 'HOUSING' | 'PENSION' | 'EDUCATION' | 'EMPLOYMENT';
  department: string;
  description: string;
  benefitAmount: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  targetAudience: string;
  applicationDeadline?: string;
  applicationUrl?: string;
  isActive: boolean;
  matchScore?: number; // Calculated dynamic match for citizen profile
  isEnrolled?: boolean;
  applicationStatus?: 'NOT_APPLIED' | 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'DISBURSED';
}
