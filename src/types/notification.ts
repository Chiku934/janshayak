export type NotificationChannel = 'IN_APP' | 'SMS' | 'WHATSAPP' | 'VOICE_IVR';

export type NotificationCategory =
  | 'Case Received'
  | 'Assigned'
  | 'Information Required'
  | 'Reminder'
  | 'Authority Response'
  | 'Escalation'
  | 'Resolution'
  | 'Feedback';

export type NotificationType =
  | 'CASE_RECEIVED'
  | 'ASSIGNED'
  | 'INFO_REQUIRED'
  | 'REMINDER'
  | 'AUTHORITY_RESPONSE'
  | 'ESCALATION'
  | 'RESOLUTION'
  | 'FEEDBACK'
  | 'CASE_UPDATE'
  | 'SLA_ALERT'
  | 'SCHEME_MATCH'
  | 'DOC_VERIFIED'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category?: NotificationCategory;
  channel: NotificationChannel;
  type: NotificationType;
  read: boolean;
  caseId?: string;
  actionUrl?: string;
  smsPreview?: string;
}
