import { AppNotification } from '../types/notification';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Case #JS-2026-8942 Received & Registered',
    message: 'Your civic grievance regarding "Potable Water Pipeline Leak" has been successfully logged into the Jan Sahayak Central Redressal Engine.',
    category: 'Case Received',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12m ago
    channel: 'SMS',
    type: 'CASE_RECEIVED',
    read: false,
    caseId: 'JS-2026-8942',
    actionUrl: '/citizen/cases/JS-2026-8942',
    smsPreview: 'Govt Alert: Case JS-2026-8942 registered with Municipal Water Supply. Track at jansahayak.gov.in/track/JS-2026-8942',
  },
  {
    id: 'notif-2',
    title: 'Assigned to Assistant Engineer Er. Sachin Deshmukh',
    message: 'Ward 14 Engineering Unit has taken ownership of your case. Field deployment scheduled for inspection today.',
    category: 'Assigned',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35m ago
    channel: 'SMS',
    type: 'ASSIGNED',
    read: false,
    caseId: 'JS-2026-8942',
    actionUrl: '/citizen/cases/JS-2026-8942',
    smsPreview: 'Jan Sahayak: Case JS-2026-8942 assigned to AE Er. Sachin Deshmukh. Direct contact: +91 98220 11984.',
  },
  {
    id: 'notif-3',
    title: 'Information Required: Landmark Clarification',
    message: 'The field inspection team has requested clarification on the exact crossroad location near Datta Mandir Lane 4.',
    category: 'Information Required',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5h ago
    channel: 'WHATSAPP',
    type: 'INFO_REQUIRED',
    read: false,
    caseId: 'JS-2026-8942',
    actionUrl: '/citizen/cases/JS-2026-8942',
  },
  {
    id: 'notif-4',
    title: 'Reminder: 24 Hours Remaining on Resolution SLA',
    message: 'Statutory SLA timer countdown is active. Municipal department is committed to resolving the issue within the target window.',
    category: 'Reminder',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3h ago
    channel: 'IN_APP',
    type: 'REMINDER',
    read: false,
    caseId: 'JS-2026-8942',
    actionUrl: '/citizen/cases/JS-2026-8942',
  },
  {
    id: 'notif-5',
    title: 'Authority Response: Replacement Pipe Section Dispatched',
    message: 'Municipal Water Supply Department has logged an action memo: Emergency replacement crew and new 6-inch pipe section deployed on site.',
    category: 'Authority Response',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6h ago
    channel: 'SMS',
    type: 'AUTHORITY_RESPONSE',
    read: true,
    caseId: 'JS-2026-8942',
    actionUrl: '/citizen/cases/JS-2026-8942',
  },
  {
    id: 'notif-6',
    title: 'Escalation: Priority Upgraded to Critical Public Safety',
    message: 'Due to water supply cutoff impacting 350+ households, this grievance has been escalated to District Collectorate Oversight Cell.',
    category: 'Escalation',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14h ago
    channel: 'IN_APP',
    type: 'ESCALATION',
    read: true,
    caseId: 'JS-2026-8942',
    actionUrl: '/citizen/cases/JS-2026-8942',
  },
  {
    id: 'notif-7',
    title: 'Resolution: Water Main Repaired & Flow Restored',
    message: 'Ward 14 Engineering Unit has concluded physical repair and pressure testing. Potable supply restored to normal parameters.',
    category: 'Resolution',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22h ago
    channel: 'SMS',
    type: 'RESOLUTION',
    read: true,
    caseId: 'JS-2026-8942',
    actionUrl: '/citizen/cases/JS-2026-8942',
  },
  {
    id: 'notif-8',
    title: 'Feedback: How was your resolution experience?',
    message: 'Please take 15 seconds to rate the repair quality and field officer communication to help us improve public service standards.',
    category: 'Feedback',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    channel: 'IN_APP',
    type: 'FEEDBACK',
    read: true,
    caseId: 'JS-2026-8942',
    actionUrl: '/citizen/cases/JS-2026-8942',
  },
];
