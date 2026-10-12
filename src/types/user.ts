import { DepartmentType } from './case';

export type UserRole = 'CITIZEN' | 'CASE_MANAGER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  phone: string;
  email: string;
  aadhaarMasked?: string;
  panMasked?: string;
  rationCardNo?: string;
  address: {
    villageOrStreet: string;
    ward: string;
    district: string;
    state: string;
    pincode: string;
  };
  language: 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'gu' | 'or';
  incomeCategory?: 'BPL' | 'EWS' | 'LIG' | 'MIG' | 'GENERAL';
  occupation?: string;
  familyMembersCount?: number;
  isDigiLockerLinked: boolean;
  isAadhaarVerified: boolean;
  department?: DepartmentType; // For Case Managers / Officers
  designation?: string;
  employeeId?: string;
  activeCasesCount?: number;
}
