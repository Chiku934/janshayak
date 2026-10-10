import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CaseItem, CaseStatusType, CasePriority, DepartmentType } from '../types/case';
import { WelfareScheme } from '../types/scheme';
import { UserProfile, UserRole } from '../types/user';
import { AppNotification } from '../types/notification';
import { AuditLogEntry, AuditStatusType, INITIAL_AUDIT_LOGS } from '../types/audit';
import { DEMO_SCENARIOS, DemoScenario } from '../types/demoScenario';
import { INITIAL_CASES } from '../mock/casesData';
import { WELFARE_SCHEMES } from '../mock/schemesData';
import { MOCK_USERS } from '../mock/officersData';
import { INITIAL_NOTIFICATIONS } from '../mock/notificationsData';

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'gu';

const generateBlockHash = () => {
  const hex = Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
  return `0x${hex}`;
};

interface AppState {
  // Current user & role
  currentUser: UserProfile;
  activeRole: UserRole;
  language: SupportedLanguage;
  
  // Client Demo Mode state
  isDemoModeActive: boolean;
  activeScenarioId: string | null;
  activeDemoCaseId: string | null;

  // Onboarding state
  isOnboarded: boolean;
  onboardingPhone: string;
  hasConsented: boolean;
  
  // Data lists
  cases: CaseItem[];
  schemes: WelfareScheme[];
  notifications: AppNotification[];
  auditLogs: AuditLogEntry[];
  
  // Simulated Toast/SMS alert popups
  activeSmsAlert: {
    visible: boolean;
    phone: string;
    text: string;
    sender: string;
  } | null;
  
  // Actions
  setRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setOnboardingPhone: (phone: string) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
  setConsentAgreed: (agreed: boolean) => void;
  completeOnboarding: () => void;

  // Client Demo Actions
  startDemoScenario: (scenarioId: string) => { route: string; role: UserRole; caseId: string };
  stopDemoMode: () => void;
  setActiveDemoCaseId: (caseId: string | null) => void;
  
  // Case Actions
  addCase: (newCase: Omit<CaseItem, 'id' | 'submittedAt' | 'updatedAt' | 'timeline' | 'isSlaBreached'>) => CaseItem;
  updateCaseStatus: (caseId: string, status: CaseStatusType, comment?: string, actorName?: string) => void;
  addCaseTimelineItem: (caseId: string, item: { title: string; description: string; status: CaseStatusType; comment?: string }) => void;
  assignCaseOfficer: (caseId: string, officer: NonNullable<CaseItem['assignedOfficer']>, notes?: string) => void;
  requestCaseInformation: (caseId: string, query: string) => void;
  provideRequestedInformation: (caseId: string, responseText: string, docName?: string) => void;
  escalateCase: (
    caseId: string,
    levelOrData: string | { reason: string; targetDepartment?: string; priority?: CasePriority; notes?: string },
    reasonArg?: string
  ) => void;
  resolveCase: (caseId: string, resolutionSummary: string, remarks?: string) => void;
  closeCase: (caseId: string, reason: string) => void;
  sendCaseCommunication: (caseId: string, message: string, channel?: string) => void;
  addCaseEvidence: (caseId: string, evidence: CaseItem['evidence'][0]) => void;
  rateCaseResolution: (caseId: string, rating: number, feedback: string) => void;
  
  // Audit Actions
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'blockHash'> & { timestamp?: string; blockHash?: string }) => void;

  // Scheme Actions
  applyForScheme: (schemeId: string) => void;
  
  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  triggerSmsSimulation: (phone: string, text: string, sender?: string) => void;
  dismissSmsSimulation: () => void;
  
  // Reset demo state
  resetToDefaultData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: MOCK_USERS[0], // Rameshwar Patil (Citizen)
      activeRole: 'CITIZEN',
      language: 'en',
      isDemoModeActive: false,
      activeScenarioId: null,
      activeDemoCaseId: null,
      isOnboarded: true,
      onboardingPhone: '+91 98231 44520',
      hasConsented: true,
      cases: INITIAL_CASES,
      schemes: WELFARE_SCHEMES,
      notifications: INITIAL_NOTIFICATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      activeSmsAlert: null,

      setRole: (role: UserRole) => {
        const matchingUser = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
        set({ activeRole: role, currentUser: matchingUser });
      },

      setUser: (user: UserProfile) => set({ currentUser: user }),
      
      setLanguage: (lang: SupportedLanguage) => set({ language: lang }),

      startDemoScenario: (scenarioId: string) => {
        const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId) || DEMO_SCENARIOS[0];
        const { cases, notifications, auditLogs } = get();
        const now = new Date().toISOString();

        // 1. Ensure targetCase exists with tailored mock data
        const existingIdx = cases.findIndex((c) => c.id === scenario.targetCaseId);
        let updatedCases: CaseItem[];
        if (existingIdx >= 0) {
          updatedCases = cases.map((c) => (c.id === scenario.targetCaseId ? scenario.mockDataSetup.targetCase : c));
        } else {
          updatedCases = [scenario.mockDataSetup.targetCase, ...cases];
        }

        // 2. Prepare tailored notification
        const notif: AppNotification = {
          id: `notif-sc-${Date.now()}`,
          title: scenario.mockDataSetup.notificationTitle,
          message: scenario.mockDataSetup.notificationMsg,
          timestamp: now,
          channel: 'IN_APP',
          type: 'CASE_UPDATE',
          read: false,
          caseId: scenario.targetCaseId,
          actionUrl: `/citizen/cases/${scenario.targetCaseId}`,
        };

        // 3. Prepare tailored audit log
        const audit: AuditLogEntry = {
          id: `LOG-SC-${Date.now().toString().slice(-4)}`,
          actor: {
            name: scenario.initialRole === 'ADMIN' ? 'Dr. Neha Rajvanshi, IAS' : scenario.initialRole === 'CASE_MANAGER' ? 'Er. Sachin Deshmukh' : scenario.mockDataSetup.targetCase.citizen.name,
            role: scenario.initialRole === 'ADMIN' ? 'District Magistrate' : scenario.initialRole === 'CASE_MANAGER' ? 'Case Manager' : 'Citizen',
          },
          action: `[Demo Preload]: ${scenario.mockDataSetup.auditAction}`,
          entity: `Case #${scenario.targetCaseId}`,
          timestamp: now,
          ipAddress: '10.42.19.88 (Govt Demonstration Sentinel)',
          status: scenario.number === 4 ? 'ESCALATED' : 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        // 4. Match User Profile
        const matchingUser = MOCK_USERS.find((u) => u.role === scenario.initialRole) || MOCK_USERS[0];

        set({
          isDemoModeActive: true,
          activeScenarioId: scenario.id,
          activeDemoCaseId: scenario.targetCaseId,
          activeRole: scenario.initialRole,
          currentUser: matchingUser,
          cases: updatedCases,
          notifications: [notif, ...notifications],
          auditLogs: [audit, ...auditLogs],
        });

        return {
          route: scenario.startRoute,
          role: scenario.initialRole,
          caseId: scenario.targetCaseId,
        };
      },

      stopDemoMode: () => {
        set({ isDemoModeActive: false, activeScenarioId: null, activeDemoCaseId: null });
      },

      setActiveDemoCaseId: (caseId) => {
        set({ activeDemoCaseId: caseId });
      },

      setOnboardingPhone: (phone: string) => set({ onboardingPhone: phone }),

      updateUserProfile: (profileData) => {
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            ...profileData,
            address: {
              ...state.currentUser.address,
              ...(profileData.address || {}),
            },
          },
        }));
      },

      setConsentAgreed: (agreed: boolean) => set({ hasConsented: agreed }),

      completeOnboarding: () => set({ isOnboarded: true, hasConsented: true, activeRole: 'CITIZEN' }),

      addAuditLog: (entry) => {
        const now = entry.timestamp || new Date().toISOString();
        const logId = `LOG-${Date.now().toString().slice(-4)}`;
        const newLog: AuditLogEntry = {
          id: logId,
          timestamp: now,
          blockHash: entry.blockHash || generateBlockHash(),
          ...entry,
        };
        set({ auditLogs: [newLog, ...get().auditLogs] });
      },

      addCase: (caseInput) => {
        const newId = `JS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date().toISOString();
        const fullCase: CaseItem = {
          ...caseInput,
          id: newId,
          submittedAt: now,
          updatedAt: now,
          isSlaBreached: false,
          timeline: [
            {
              id: `tl-${Date.now()}-1`,
              title: 'Grievance Registered Successfully',
              description: 'Your issue has been logged into the Jan Sahayak Central Redressal Engine.',
              timestamp: now,
              actor: { name: caseInput.citizen.name, role: 'Citizen' },
              status: 'SUBMITTED',
            },
            {
              id: `tl-${Date.now()}-2`,
              title: 'AI Classification & Ward Triaging',
              description: `Automated routing to ${caseInput.department} with target SLA of ${caseInput.slaDays} days.`,
              timestamp: now,
              actor: { name: 'Jan Sahayak AI Engine', role: 'System' },
              status: 'AI_TRIAGED',
              isAutomated: true,
            },
          ],
        };

        const updatedCases = [fullCase, ...get().cases];

        // Create SMS notification for the citizen
        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `Grievance #${newId} Registered`,
          message: `Your grievance regarding "${fullCase.title}" has been registered and assigned to ${fullCase.department}.`,
          timestamp: now,
          channel: 'SMS',
          type: 'CASE_UPDATE',
          read: false,
          caseId: newId,
          actionUrl: `/citizen/cases/${newId}`,
          smsPreview: `Govt Alert: Grievance ${newId} logged for ${fullCase.department}. Track real-time SLA status on Jan Sahayak.`,
        };

        // Create Audit Log
        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: caseInput.citizen.name, role: 'Citizen' },
          action: `Submitted grievance: "${fullCase.title}" (${fullCase.category})`,
          entity: `Case #${newId}`,
          timestamp: now,
          ipAddress: '49.36.12.18 (Jio Mobile Portal)',
          status: 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
          activeSmsAlert: {
            visible: true,
            phone: fullCase.citizen.phone,
            text: `[Govt Alert] Grievance ${newId} registered successfully. Track at jansahayak.gov.in/track/${newId}`,
            sender: 'Govt of India - JAN SAHAYAK',
          },
        });

        return fullCase;
      },

      updateCaseStatus: (caseId, status, comment, actorName) => {
        const { cases, currentUser, activeRole } = get();
        const now = new Date().toISOString();
        const actor = actorName
          ? { name: actorName, role: activeRole === 'ADMIN' ? 'District Administrator' : 'Assigned Officer' }
          : { name: currentUser.name, role: currentUser.designation || 'Officer' };

        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: `Status Changed to ${status.replace(/_/g, ' ')}`,
            description: comment || `Action taken by ${actor.name} (${actor.role}).`,
            timestamp: now,
            actor,
            status,
            comment,
          };
          return {
            ...c,
            status,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
          };
        });

        // Push notification
        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `Case #${caseId} Status: ${status.replace(/_/g, ' ')}`,
          message: comment || `Officer updated case status to ${status}.`,
          timestamp: now,
          channel: 'SMS',
          type: 'CASE_UPDATE',
          read: false,
          caseId,
          actionUrl: `/citizen/cases/${caseId}`,
        };

        // Create Audit Log
        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: actor.name, role: actor.role },
          action: `Updated case status to ${status.replace(/_/g, ' ')}${comment ? `: ${comment}` : ''}`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '10.42.21.104 (PMC Zone 4 Intranet)',
          status: 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
          activeSmsAlert: {
            visible: true,
            phone: '+91 98231 44520',
            text: `Govt Update on ${caseId}: Status is now ${status.replace(/_/g, ' ')}. ${comment ? 'Note: ' + comment : ''}`,
            sender: 'JAN SAHAYAK SEVA',
          },
        });
      },

      addCaseTimelineItem: (caseId, item) => {
        const now = new Date().toISOString();
        const { cases, currentUser } = get();
        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          return {
            ...c,
            status: item.status,
            updatedAt: now,
            timeline: [
              ...c.timeline,
              {
                id: `tl-${Date.now()}`,
                title: item.title,
                description: item.description,
                timestamp: now,
                actor: { name: currentUser.name, role: currentUser.designation || 'Authority' },
                status: item.status,
                comment: item.comment,
              },
            ],
          };
        });
        set({ cases: updatedCases });
      },

      assignCaseOfficer: (caseId, officer, notes) => {
        const now = new Date().toISOString();
        const { cases, currentUser } = get();
        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: `Assigned to ${officer.name}`,
            description: notes || `Transferred to ${officer.name} (${officer.designation}, ${officer.department}) for immediate field inspection and resolution.`,
            timestamp: now,
            actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
            status: 'ASSIGNED' as CaseStatusType,
            comment: notes,
          };
          return {
            ...c,
            assignedOfficer: officer,
            status: 'ASSIGNED' as CaseStatusType,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
          };
        });

        const targetCase = cases.find((c) => c.id === caseId);
        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `Case #${caseId} Assigned to Field Officer`,
          message: `Your grievance has been assigned to ${officer.name} (${officer.designation}).`,
          timestamp: now,
          channel: 'SMS',
          type: 'CASE_UPDATE',
          read: false,
          caseId,
          actionUrl: `/citizen/cases/${caseId}`,
        };

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
          action: `Assigned grievance to ${officer.name} (${officer.designation}, ${officer.department})${notes ? ` | Notes: ${notes}` : ''}`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '10.42.21.104 (PMC Zone 4 Intranet)',
          status: 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
          activeSmsAlert: {
            visible: true,
            phone: targetCase?.citizen.phone || '+91 98231 44520',
            text: `[JAN SAHAYAK Alert] Grievance ${caseId} assigned to ${officer.name}, ${officer.designation}. Field action initiated.`,
            sender: 'Govt Case Desk',
          },
        });
      },

      requestCaseInformation: (caseId, query) => {
        const now = new Date().toISOString();
        const { cases, currentUser } = get();
        const targetCase = cases.find((c) => c.id === caseId);
        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: 'Information Requested from Citizen',
            description: query,
            timestamp: now,
            actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
            status: 'UNDER_INVESTIGATION' as CaseStatusType,
            comment: query,
          };
          return {
            ...c,
            status: 'UNDER_INVESTIGATION' as CaseStatusType,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
          };
        });

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `Action Required: Clarification Needed for #${caseId}`,
          message: `Official inquiry: "${query}". Please submit details via Jan Sahayak.`,
          timestamp: now,
          channel: 'SMS',
          type: 'CASE_UPDATE',
          read: false,
          caseId,
          actionUrl: `/citizen/cases/${caseId}`,
        };

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
          action: `Official inquiry sent to citizen: "${query}"`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '10.42.21.104 (PMC Zone 4 Intranet)',
          status: 'WARNING',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
          activeSmsAlert: {
            visible: true,
            phone: targetCase?.citizen.phone || '+91 98231 44520',
            text: `[Govt Urgent] Information required for Grievance ${caseId}: "${query}". Reply or upload doc on portal.`,
            sender: 'JAN SAHAYAK INQUIRY',
          },
        });
      },

      provideRequestedInformation: (caseId, responseText, docName) => {
        const now = new Date().toISOString();
        const { cases, currentUser } = get();
        const targetCase = cases.find((c) => c.id === caseId);

        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          
          const newEvidenceList = [...c.evidence];
          if (docName) {
            newEvidenceList.push({
              id: `evd-${Date.now()}`,
              name: docName,
              type: 'PDF' as const,
              size: '1.2 MB',
              url: '#',
              uploadedAt: now,
              verified: true,
            });
          }

          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: 'Citizen Clarification Provided',
            description: responseText + (docName ? ` (Uploaded verification: ${docName})` : ''),
            timestamp: now,
            actor: { name: targetCase?.citizen.name || currentUser.name, role: 'Citizen' },
            status: 'IN_PROGRESS' as CaseStatusType,
            comment: responseText,
          };

          return {
            ...c,
            status: 'IN_PROGRESS' as CaseStatusType,
            evidence: newEvidenceList,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
          };
        });

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `Clarification Received for #${caseId}`,
          message: `Citizen provided requested information: "${responseText}". Investigation resumed.`,
          timestamp: now,
          channel: 'IN_APP',
          category: 'Authority Response',
          type: 'AUTHORITY_RESPONSE',
          read: false,
          caseId,
          actionUrl: `/case-manager/cases/${caseId}`,
        };

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: targetCase?.citizen.name || 'Citizen', role: 'Citizen' },
          action: `Submitted requested information: "${responseText}"${docName ? ` (Uploaded: ${docName})` : ''}`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '49.36.12.18 (Jio Mobile Portal)',
          status: 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
          activeSmsAlert: {
            visible: true,
            phone: targetCase?.assignedOfficer?.phone || '+91 94220 18833',
            text: `[Jan Sahayak Case Desk] Citizen provided clarification on Case ${caseId}: "${responseText}". Field action active.`,
            sender: 'JAN SAHAYAK DESK',
          },
        });
      },

      escalateCase: (caseId, levelOrData, reasonArg) => {
        const now = new Date().toISOString();
        const { cases, currentUser } = get();
        const targetCase = cases.find((c) => c.id === caseId);

        let reason = '';
        let targetDept = targetCase?.department || 'Public Works & Roads (PWD)';
        let priority: CasePriority = 'CRITICAL';
        let notes = '';
        let targetAuthority = 'District Collectorate Taskforce (Tier 2)';

        if (typeof levelOrData === 'string') {
          targetAuthority = levelOrData;
          reason = reasonArg || 'SLA breach / operational priority escalation';
        } else {
          reason = levelOrData.reason;
          if (levelOrData.targetDepartment) targetDept = levelOrData.targetDepartment as DepartmentType;
          if (levelOrData.priority) priority = levelOrData.priority;
          notes = levelOrData.notes || '';
          targetAuthority = `${targetDept} (Special Oversight Taskforce)`;
        }

        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: `Case Escalated to ${targetAuthority}`,
            description: `Escalation Reason: ${reason}${notes ? ` | Notes: ${notes}` : ''}`,
            timestamp: now,
            actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
            status: 'ESCALATED' as CaseStatusType,
            comment: notes || reason,
          };
          return {
            ...c,
            status: 'ESCALATED' as CaseStatusType,
            priority,
            department: targetDept as DepartmentType,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
          };
        });

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `Case #${caseId} Escalated to ${targetAuthority}`,
          message: `Case escalated due to: "${reason}". Priority set to ${priority}. Direct oversight initiated.`,
          timestamp: now,
          channel: 'SMS',
          type: 'ESCALATION',
          read: false,
          caseId,
          actionUrl: `/citizen/cases/${caseId}`,
        };

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
          action: `Executive Escalation to ${targetAuthority}. Reason: "${reason}" (Priority: ${priority})`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '10.42.19.90 (Collectorate Secretarial)',
          status: 'ESCALATED',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
          activeSmsAlert: {
            visible: true,
            phone: targetCase?.citizen.phone || '+91 98231 44520',
            text: `[Govt Urgent Escalation] Grievance ${caseId} escalated to ${targetAuthority}. Priority: ${priority}. Action team dispatched.`,
            sender: 'DISTRICT COLLECTORATE',
          },
        });
      },

      resolveCase: (caseId, resolutionSummary, remarks) => {
        const now = new Date().toISOString();
        const { cases, currentUser } = get();
        const targetCase = cases.find((c) => c.id === caseId);
        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: 'Grievance Resolved & Work Completed',
            description: resolutionSummary + (remarks ? ` | Notes: ${remarks}` : ''),
            timestamp: now,
            actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
            status: 'RESOLVED' as CaseStatusType,
            comment: remarks,
          };
          return {
            ...c,
            status: 'RESOLVED' as CaseStatusType,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
          };
        });

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `Grievance #${caseId} Resolved!`,
          message: `Department has completed required work: ${resolutionSummary}. Please provide citizen feedback.`,
          timestamp: now,
          channel: 'SMS',
          type: 'RESOLUTION',
          read: false,
          caseId,
          actionUrl: `/citizen/cases/${caseId}`,
        };

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
          action: `Grievance marked RESOLVED. Work Summary: "${resolutionSummary}"`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '10.42.21.104 (PMC Zone 4 Intranet)',
          status: 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
          activeSmsAlert: {
            visible: true,
            phone: targetCase?.citizen.phone || '+91 98231 44520',
            text: `[Govt Notice] Grievance ${caseId} has been successfully RESOLVED. Please rate service satisfaction on Jan Sahayak.`,
            sender: 'JAN SAHAYAK REDRESSAL',
          },
        });
      },

      closeCase: (caseId, reason) => {
        const now = new Date().toISOString();
        const { cases, currentUser } = get();
        const targetCase = cases.find((c) => c.id === caseId);
        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: 'Case Formally Closed',
            description: reason,
            timestamp: now,
            actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
            status: 'CLOSED' as CaseStatusType,
            comment: reason,
          };
          return {
            ...c,
            status: 'CLOSED' as CaseStatusType,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
          };
        });

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `Case #${caseId} Formally Closed`,
          message: `Redressal record archived. Reason: ${reason}`,
          timestamp: now,
          channel: 'SMS',
          type: 'CASE_UPDATE',
          read: false,
          caseId,
          actionUrl: `/citizen/cases/${caseId}`,
        };

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
          action: `Grievance formally CLOSED. Reason: "${reason}"`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '10.42.19.88 (NIC Govt Gateway)',
          status: 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
          activeSmsAlert: {
            visible: true,
            phone: targetCase?.citizen.phone || '+91 98231 44520',
            text: `[Jan Sahayak] Case ${caseId} has been closed. File record finalized.`,
            sender: 'JAN SAHAYAK ARCHIVE',
          },
        });
      },

      sendCaseCommunication: (caseId, message, channel = 'SMS') => {
        const now = new Date().toISOString();
        const { cases, currentUser } = get();
        const targetCase = cases.find((c) => c.id === caseId);
        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: `Official Message Sent (${channel})`,
            description: `"${message}"`,
            timestamp: now,
            actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
            status: c.status,
            comment: `Dispatched via ${channel}`,
          };
          return {
            ...c,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
          };
        });

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: currentUser.name, role: currentUser.designation || 'Case Manager' },
          action: `Dispatched official ${channel} to citizen: "${message}"`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '10.42.21.104 (PMC Zone 4 Intranet)',
          status: 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          auditLogs: [auditEntry, ...get().auditLogs],
          activeSmsAlert: {
            visible: true,
            phone: targetCase?.citizen.phone || '+91 98231 44520',
            text: `[Official Notice - ${caseId}]: ${message}`,
            sender: 'Govt Case Officer',
          },
        });
      },

      addCaseEvidence: (caseId, evidence) => {
        const { cases, currentUser } = get();
        const now = new Date().toISOString();
        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          return {
            ...c,
            evidence: [evidence, ...c.evidence],
            updatedAt: now,
          };
        });

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: currentUser.name, role: currentUser.designation || 'Officer' },
          action: `Uploaded evidence attachment: "${evidence.name}" (${evidence.type})`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '10.42.21.104 (PMC Zone 4 Intranet)',
          status: 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          auditLogs: [auditEntry, ...get().auditLogs],
        });
      },

      rateCaseResolution: (caseId, rating, feedback) => {
        const { cases, currentUser } = get();
        const now = new Date().toISOString();
        const targetCase = cases.find((c) => c.id === caseId);

        const updatedCases = cases.map((c) => {
          if (c.id !== caseId) return c;
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            title: `Citizen Satisfaction Rating: ${rating} / 5 Stars`,
            description: feedback ? `Citizen Feedback: "${feedback}"` : 'Citizen confirmed satisfactory resolution.',
            timestamp: now,
            actor: { name: targetCase?.citizen.name || currentUser.name, role: 'Citizen' },
            status: c.status,
            comment: `${rating} Stars: ${feedback}`,
          };
          return {
            ...c,
            citizenRating: rating,
            citizenFeedback: feedback,
            updatedAt: now,
            timeline: [...c.timeline, newTimelineItem],
          };
        });

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `Citizen Feedback Submitted (#${caseId})`,
          message: `Citizen gave ${rating} stars rating. Thank you for making our civic services accountable.`,
          timestamp: now,
          channel: 'SMS',
          type: 'FEEDBACK',
          read: false,
          caseId,
          actionUrl: `/citizen/cases/${caseId}`,
        };

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: targetCase?.citizen.name || currentUser.name, role: 'Citizen' },
          action: `Recorded citizen resolution rating (${rating}/5 stars)${feedback ? `: "${feedback}"` : ''}`,
          entity: `Case #${caseId}`,
          timestamp: now,
          ipAddress: '49.36.12.18 (Jio Mobile Portal)',
          status: 'AUDITED',
          blockHash: generateBlockHash(),
        };

        set({
          cases: updatedCases,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
        });
      },

      applyForScheme: (schemeId) => {
        const { schemes, currentUser } = get();
        const now = new Date().toISOString();
        const targetScheme = schemes.find((s) => s.id === schemeId);

        const updated = schemes.map((s) => {
          if (s.id !== schemeId) return s;
          return {
            ...s,
            applicationStatus: 'SUBMITTED' as const,
          };
        });

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: 'Scheme Application Lodged',
          message: `Your application for "${targetScheme?.name || 'Welfare Scheme'}" with DigiLocker verified documents has been sent for DBT sanctioning.`,
          timestamp: now,
          channel: 'WHATSAPP',
          type: 'SCHEME_MATCH',
          read: false,
          actionUrl: '/citizen/schemes',
        };

        const auditEntry: AuditLogEntry = {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          actor: { name: currentUser.name, role: 'Citizen' },
          action: `Applied for welfare scheme: "${targetScheme?.name || schemeId}" (Auto-attached DigiLocker KYC)`,
          entity: `Scheme #${schemeId}`,
          timestamp: now,
          ipAddress: '49.36.12.18 (Jio Mobile Portal)',
          status: 'SUCCESS',
          blockHash: generateBlockHash(),
        };

        set({
          schemes: updated,
          notifications: [notif, ...get().notifications],
          auditLogs: [auditEntry, ...get().auditLogs],
        });
      },

      markNotificationRead: (id) => {
        const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
        set({ notifications: updated });
      },

      markAllNotificationsRead: () => {
        const updated = get().notifications.map((n) => ({ ...n, read: true }));
        set({ notifications: updated });
      },

      triggerSmsSimulation: (phone, text, sender = 'JAN SAHAYAK') => {
        set({
          activeSmsAlert: {
            visible: true,
            phone,
            text,
            sender,
          },
        });
      },

      dismissSmsSimulation: () => {
        set({ activeSmsAlert: null });
      },

      resetToDefaultData: () => {
        // Clear auxiliary storage items to guarantee clean slate
        try {
          localStorage.removeItem('jansahayak_admin_users_v1');
          localStorage.removeItem('jansahayak_admin_categories_v1');
          localStorage.removeItem('jansahayak_admin_departments_v1');
          localStorage.removeItem('jansahayak_admin_services_v1');
        } catch (e) {
          // ignore
        }

        set({
          currentUser: MOCK_USERS[0],
          activeRole: 'CITIZEN',
          isOnboarded: true,
          onboardingPhone: '+91 98231 44520',
          hasConsented: true,
          cases: INITIAL_CASES,
          schemes: WELFARE_SCHEMES,
          notifications: INITIAL_NOTIFICATIONS,
          auditLogs: INITIAL_AUDIT_LOGS,
          activeSmsAlert: null,
          language: 'en',
        });
      },
    }),
    {
      name: 'jansahayak_store_v1',
    }
  )
);

