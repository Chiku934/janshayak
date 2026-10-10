import { CasePriority, CaseStatusType } from '../types/case';

export function getStatusConfig(status: CaseStatusType): {
  label: string;
  labelHi: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'SUBMITTED':
      return {
        label: 'Grievance Submitted',
        labelHi: 'शिकायत दर्ज',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'AI_TRIAGED':
    case 'TRIAGED':
      return {
        label: 'Triaged',
        labelHi: 'एआई द्वारा वर्गीकृत',
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        dot: 'bg-indigo-500',
      };
    case 'VERIFIED':
      return {
        label: 'Verified',
        labelHi: 'सत्यापित',
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
        dot: 'bg-teal-500',
      };
    case 'ASSIGNED':
      return {
        label: 'Assigned',
        labelHi: 'अधिकारी नियुक्त',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
      };
    case 'UNDER_INVESTIGATION':
      return {
        label: 'Under Review',
        labelHi: 'समीक्षाधीन',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'FIELD_INSPECTION':
      return {
        label: 'Field Inspection',
        labelHi: 'मौके पर निरीक्षण',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
      };
    case 'ACTION_IN_PROGRESS':
      return {
        label: 'Action in Progress',
        labelHi: 'समाधान प्रगति पर',
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
        dot: 'bg-cyan-500',
      };
    case 'RESPONSE':
      return {
        label: 'Response',
        labelHi: 'विभागीय उत्तर',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'RESOLVED':
      return {
        label: 'Resolved',
        labelHi: 'समाधान पूर्ण',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'CLOSED':
      return {
        label: 'Closed',
        labelHi: 'बंद',
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-300',
        dot: 'bg-slate-500',
      };
    case 'ESCALATED':
      return {
        label: 'Escalated to Collectorate',
        labelHi: 'कलेक्टर कार्यालय को प्रेषित',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'REJECTED':
      return {
        label: 'Rejected / Invalid',
        labelHi: 'अस्वीकृत / अमान्य',
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-300',
        dot: 'bg-slate-500',
      };
    default:
      return {
        label: status,
        labelHi: status,
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function getPriorityConfig(priority: CasePriority): {
  label: string;
  bg: string;
  text: string;
  badge: string;
} {
  switch (priority) {
    case 'CRITICAL':
      return {
        label: 'Critical SLA (24h)',
        bg: 'bg-red-50',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-800 border-red-200',
      };
    case 'HIGH':
      return {
        label: 'High Priority (3d)',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-800 border-orange-200',
      };
    case 'MEDIUM':
      return {
        label: 'Medium Priority (7d)',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
      };
    case 'LOW':
      return {
        label: 'Standard SLA (14d)',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
      };
  }
}
