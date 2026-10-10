export type AuditStatusType = 'SUCCESS' | 'WARNING' | 'ESCALATED' | 'AUDITED';

export interface AuditLogEntry {
  id: string;
  actor: {
    name: string;
    role: string;
  };
  action: string;
  entity: string;
  timestamp: string;
  ipAddress: string;
  status: AuditStatusType;
  blockHash: string;
}

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-001',
    actor: { name: 'Dr. Neha Rajvanshi, IAS', role: 'District Magistrate' },
    action: 'Reviewed District Collectorate SLA Sentinel Docket',
    entity: 'District Sentinel Docket',
    timestamp: '2026-10-08T14:45:00Z',
    ipAddress: '10.42.19.88 (NIC Govt Gateway)',
    status: 'SUCCESS',
    blockHash: '0x8f19bb4421aa0092',
  },
  {
    id: 'LOG-002',
    actor: { name: 'Er. Sachin Deshmukh', role: 'Case Manager (Water)' },
    action: 'Updated field inspection evidence and acoustic report',
    entity: 'Case #JS-2026-8942',
    timestamp: '2026-10-08T14:32:00Z',
    ipAddress: '10.42.21.104 (PMC Zone 4 Intranet)',
    status: 'SUCCESS',
    blockHash: '0x3c90aa8123dd99b2',
  },
  {
    id: 'LOG-003',
    actor: { name: 'System AI Engine', role: 'Automated Redressal Core' },
    action: 'Auto-triaged grievance to DISCOM Power division with 3d SLA',
    entity: 'Case #JS-2026-7731',
    timestamp: '2026-10-08T14:15:00Z',
    ipAddress: '127.0.0.1 (Jan Sahayak AI Cluster)',
    status: 'AUDITED',
    blockHash: '0xaa12884100ffee10',
  },
  {
    id: 'LOG-004',
    actor: { name: 'District Collectorate Taskforce', role: 'Apex Authority' },
    action: 'Executive SLA Override: Escalated priority to CRITICAL',
    entity: 'Case #JS-2026-6102',
    timestamp: '2026-10-08T12:00:00Z',
    ipAddress: '10.42.19.90 (Collectorate Secretarial)',
    status: 'ESCALATED',
    blockHash: '0x99dd441200331c44',
  },
  {
    id: 'LOG-005',
    actor: { name: 'Er. Anita Kulkarni', role: 'Senior PWD Lead' },
    action: 'Assigned emergency asphalt repair gang to Ward 14',
    entity: 'Work Order #WO-8819',
    timestamp: '2026-10-08T10:20:00Z',
    ipAddress: '10.42.33.12 (PWD Central Division)',
    status: 'SUCCESS',
    blockHash: '0x12ffaa9944bb4488',
  },
  {
    id: 'LOG-006',
    actor: { name: 'Rameshwar Patil', role: 'Citizen' },
    action: 'Submitted grievance with geo-tagged burst pipe photo',
    entity: 'Case #JS-2026-8942',
    timestamp: '2026-10-06T10:14:00Z',
    ipAddress: '49.36.12.18 (Jio Mobile Portal)',
    status: 'SUCCESS',
    blockHash: '0x77ee1188002233aa',
  },
  {
    id: 'LOG-007',
    actor: { name: 'Vigilance Officer', role: 'State Auditor' },
    action: 'Marked internal DBT transaction audit log as Restricted',
    entity: 'Evidence #EVD-2026-007',
    timestamp: '2026-10-06T08:00:00Z',
    ipAddress: '10.42.19.12 (State Audit Nodal)',
    status: 'WARNING',
    blockHash: '0x44bb883399002211',
  },
];
