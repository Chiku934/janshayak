export interface DepartmentKpi {
  id?: string;
  department: string;
  totalGrievances: number;
  resolved: number;
  inProgress: number;
  pendingTriage: number;
  escalated: number;
  slaAdherenceRate: number; // e.g. 94.2%
  avgResolutionDays: number;
  citizenSatisfactionScore: number; // 1-5 scale
}

export interface WardMetric {
  id?: string;
  wardNumber: string;
  wardName: string;
  activeIssues: number;
  hotspotCategory: string;
  slaRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  officerInCharge: string;
}

export interface SystemAnalytics {
  totalCasesLogged: number;
  totalResolved: number;
  overallSlaAdherence: number;
  activeFieldInspections: number;
  averageTriageTimeMin: number;
  voiceGrievancePercent: number;
  digiLockerAutoVerificationRate: number;
  departmentKpis: DepartmentKpi[];
  recentWards: WardMetric[];
}
