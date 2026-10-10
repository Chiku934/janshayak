import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SlaIndicator } from '../../components/ui/SlaIndicator';
import { EscalationModal } from '../../components/modals/EscalationModal';
import { Modal } from '../../components/ui/Modal';
import { formatDate, formatDateTime, getRemainingSlaDays } from '../../utils/formatters';
import { getPriorityConfig } from '../../utils/helpers';
import { CaseStatusType, CasePriority, DepartmentType } from '../../types/case';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  MessageSquare,
  Send,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Copy,
  ExternalLink,
  ChevronRight,
  Eye,
  Download,
  Flame,
  HelpCircle,
  Building2,
  Sparkles,
  Info,
  Check,
  Maximize2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const OFFICER_ROSTER = [
  {
    id: 'user-officer-01',
    name: 'Er. Sachin Deshmukh',
    designation: 'Assistant Executive Engineer',
    department: 'Municipal Water Supply & Sanitation' as DepartmentType,
    phone: '+91 94220 18833',
    email: 'sachin.deshmukh@punemunicipal.gov.in',
  },
  {
    id: 'user-officer-02',
    name: 'Er. Anita Kulkarni',
    designation: 'Senior Road Inspector & PWD Lead',
    department: 'Public Works & Roads (PWD)' as DepartmentType,
    phone: '+91 98811 55209',
    email: 'anita.kulkarni@pwd.gov.in',
  },
  {
    id: 'user-officer-03',
    name: 'Er. Rajesh Sharma',
    designation: 'Sub-Divisional DISCOM Engineer',
    department: 'Electricity & Power Distribution (DISCOM)' as DepartmentType,
    phone: '+91 94140 77312',
    email: 'rajesh.sharma@mahadiscom.in',
  },
  {
    id: 'user-officer-04',
    name: 'Dr. Neha Rajvanshi, IAS',
    designation: 'District Magistrate & Redressal Commissioner',
    department: 'Revenue & Land Records' as DepartmentType,
    phone: '+91 94140 10001',
    email: 'collector.office@nic.in',
  },
];

export const CaseManagerCaseDetailPage: React.FC = () => {
  const { caseId, id } = useParams<{ caseId?: string; id?: string }>();
  const activeId = caseId || id;
  const navigate = useNavigate();

  const {
    cases,
    currentUser,
    assignCaseOfficer,
    requestCaseInformation,
    escalateCase,
    resolveCase,
    closeCase,
    sendCaseCommunication,
  } = useAppStore();

  const currentCase = cases.find((c) => c.id === activeId) || cases[0];

  // Action Modals State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
  const [isCommunicateModalOpen, setIsCommunicateModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form Fields inside Modals
  const [selectedOfficerId, setSelectedOfficerId] = useState(
    currentCase?.assignedOfficer?.id || OFFICER_ROSTER[0].id
  );
  const [assignNotes, setAssignNotes] = useState('');
  const [infoQuery, setInfoQuery] = useState('');
  const [commMessage, setCommMessage] = useState('');
  const [commChannel, setCommChannel] = useState<'SMS' | 'WHATSAPP' | 'PORTAL'>('SMS');
  const [escalateLevel, setEscalateLevel] = useState('District Collectorate Taskforce (Tier 2)');
  const [escalateReason, setEscalateReason] = useState('');
  const [resolveSummary, setResolveSummary] = useState('');
  const [resolveRemarks, setResolveRemarks] = useState('');
  const [closeReason, setCloseReason] = useState('Citizen confirmed problem resolved on-site');
  const [copied, setCopied] = useState(false);

  // Quick In-page Communication input
  const [quickMessage, setQuickMessage] = useState('');

  if (!currentCase) {
    return (
      <div className="p-12 text-center space-y-4 max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900">Case Record Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested grievance ID "{activeId}" does not exist in local registry.
        </p>
        <Button onClick={() => navigate('/case-manager/cases')}>Back to Cases</Button>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(currentCase.priority);
  const slaInfo = getRemainingSlaDays(currentCase.slaDeadline);

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentCase.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit Handlers
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const officer = OFFICER_ROSTER.find((o) => o.id === selectedOfficerId) || OFFICER_ROSTER[0];
    assignCaseOfficer(currentCase.id, officer, assignNotes);
    setIsAssignModalOpen(false);
    setAssignNotes('');
  };

  const handleRequestInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoQuery.trim()) return;
    requestCaseInformation(currentCase.id, infoQuery.trim());
    setIsRequestInfoModalOpen(false);
    setInfoQuery('');
  };

  const handleCommunicateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commMessage.trim()) return;
    sendCaseCommunication(currentCase.id, commMessage.trim(), commChannel);
    setIsCommunicateModalOpen(false);
    setCommMessage('');
  };

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;
    sendCaseCommunication(currentCase.id, quickMessage.trim(), 'SMS');
    setQuickMessage('');
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalateReason.trim()) return;
    escalateCase(currentCase.id, escalateLevel, escalateReason.trim());
    setIsEscalateModalOpen(false);
    setEscalateReason('');
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveSummary.trim()) return;
    resolveCase(currentCase.id, resolveSummary.trim(), resolveRemarks.trim());
    setIsResolveModalOpen(false);
    setResolveSummary('');
    setResolveRemarks('');
  };

  const handleCloseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closeReason.trim()) return;
    closeCase(currentCase.id, closeReason.trim());
    setIsCloseModalOpen(false);
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Top Breadcrumb & Quick Nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/case-manager/cases')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 -ml-2"
        >
          Back to Case Table
        </Button>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-400">Viewing Case Manager View</span>
          <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            {currentCase.id}
          </span>
        </div>
      </div>

      {/* Header Banner with Case ID, Status & Action Control Bar */}
      <Card className="p-5 sm:p-6 border border-slate-200 shadow-2xs bg-white space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentCase.title}
              </h1>
              <button
                onClick={handleCopyId}
                title="Copy Case ID"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md border border-blue-200 transition-colors"
              >
                <span>{currentCase.id}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                Filed by <strong>{currentCase.citizen.name}</strong> on {formatDate(currentCase.submittedAt)}
              </span>
              <span>•</span>
              <span className="text-slate-700 font-semibold">{currentCase.department}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'text-xs px-2.5 py-1 rounded-full font-bold border flex items-center gap-1.5',
                priorityConfig.badge
              )}
            >
              <Flame className="w-3.5 h-3.5" />
              {priorityConfig.label}
            </span>
            <StatusBadge status={currentCase.status} />
          </div>
        </div>

        {/* 6 Actions Command Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Action 1: Assign */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAssignModalOpen(true)}
            leftIcon={<UserCheck className="w-4 h-4 text-blue-600" />}
            className="text-xs font-bold bg-white hover:bg-blue-50 border-slate-300 hover:border-blue-300"
          >
            {currentCase.assignedOfficer ? 'Re-Assign Officer' : 'Assign Case'}
          </Button>

          {/* Action 2: Request Information */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsRequestInfoModalOpen(true)}
            leftIcon={<HelpCircle className="w-4 h-4 text-amber-600" />}
            className="text-xs font-bold bg-white hover:bg-amber-50 border-slate-300 hover:border-amber-300"
          >
            Request Info
          </Button>

          {/* Action 3: Communicate */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCommunicateModalOpen(true)}
            leftIcon={<MessageSquare className="w-4 h-4 text-indigo-600" />}
            className="text-xs font-bold bg-white hover:bg-indigo-50 border-slate-300 hover:border-indigo-300"
          >
            Communicate
          </Button>

          {/* Action 4: Escalate */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEscalateModalOpen(true)}
            leftIcon={<AlertOctagon className="w-4 h-4 text-rose-600" />}
            className="text-xs font-bold bg-rose-50/60 hover:bg-rose-100 text-rose-800 border-rose-200 hover:border-rose-300"
          >
            Escalate Case
          </Button>

          {/* Action 5: Resolve */}
          {currentCase.status !== 'RESOLVED' && currentCase.status !== 'CLOSED' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => setIsResolveModalOpen(true)}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              className="text-xs font-bold"
            >
              Resolve Issue
            </Button>
          )}

          {/* Action 6: Close */}
          {currentCase.status !== 'CLOSED' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsCloseModalOpen(true)}
              leftIcon={<XCircle className="w-4 h-4 text-slate-500" />}
              className="text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-slate-100"
            >
              Close Case
            </Button>
          )}
        </div>
      </Card>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Details, Citizen Info, Location, Evidence, Communication */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Issue Details & AI Triage */}
          <Card className="p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Issue Description & Details
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                {currentCase.category}
              </span>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
              {currentCase.description}
            </div>

            {/* AI Triage & Analysis Card */}
            {currentCase.aiAnalysis && (
              <div className="p-4 rounded-xl bg-linear-to-br from-indigo-50/60 to-blue-50/60 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Grievance Triage & Smart Sentiment</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                    {Math.round(currentCase.aiAnalysis.confidenceScore * 100)}% Confidence
                  </span>
                </div>

                <p className="text-xs text-indigo-950 font-medium">
                  {currentCase.aiAnalysis.summary}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded border border-indigo-200">
                    Sentiment: <strong>{currentCase.aiAnalysis.sentiment}</strong>
                  </span>
                  <span className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded border border-indigo-200">
                    Duplicate Risk: <strong>{currentCase.aiAnalysis.duplicateRiskScore}%</strong>
                  </span>
                  <span className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded border border-indigo-200">
                    Suggested Dept: <strong>{currentCase.aiAnalysis.suggestedDepartment}</strong>
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Section 2: Citizen Information */}
          <Card className="p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Citizen Information
              </h2>
              {currentCase.citizen.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" /> Aadhaar Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Full Name</span>
                <p className="text-sm font-bold text-slate-900">{currentCase.citizen.name}</p>
                <p className="text-[11px] text-slate-500">
                  Citizen ID: {currentCase.citizen.id} • Prefers {currentCase.citizen.language.toUpperCase()}
                </p>
              </div>

              <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Contact Phone</span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  {currentCase.citizen.phone}
                </p>
                <p className="text-[11px] text-slate-500">
                  Masked Aadhaar: {currentCase.citizen.aadhaarMasked}
                </p>
              </div>
            </div>
          </Card>

          {/* Section 3: Location Details */}
          <Card className="p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              Incident Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Ward / Sector</span>
                <p className="font-bold text-slate-900">{currentCase.ward}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">District & State</span>
                <p className="font-bold text-slate-900">
                  {currentCase.district}, {currentCase.state}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Postal PIN Code</span>
                <p className="font-bold text-slate-900">{currentCase.pincode}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-medium text-slate-400">Street Address & Landmark</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">{currentCase.address}</p>
              {currentCase.locationCoordinates && (
                <div className="flex items-center gap-2 text-[11px] text-blue-700 font-mono pt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    GPS: {currentCase.locationCoordinates.lat.toFixed(4)}° N,{' '}
                    {currentCase.locationCoordinates.lng.toFixed(4)}° E (Geo-tagged by citizen)
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Section 4: Evidence & Supporting Documents */}
          <Card className="p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Evidence & Attached Files ({currentCase.evidence.length})
              </h2>
              <span className="text-xs text-slate-400">Click to expand preview</span>
            </div>

            {currentCase.evidence.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No attachments uploaded by citizen.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentCase.evidence.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-300 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {file.type === 'IMAGE' ? 'IMG' : 'DOC'}
                        </div>
                        <div className="truncate max-w-[150px]">
                          <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400">{file.size}</p>
                        </div>
                      </div>

                      {file.verified && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>

                    {file.type === 'IMAGE' && file.url && (
                      <div
                        onClick={() => setPreviewImage(file.url)}
                        className="relative h-28 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group"
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <Maximize2 className="w-4 h-4" /> Expand
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Section 7: Communication Hub & Quick SMS Sender */}
          <Card className="p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Citizen Communication Hub
              </h2>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Live Gateway Connected
              </span>
            </div>

            <form onSubmit={handleQuickSend} className="space-y-3">
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder={`Type quick SMS update to ${currentCase.citizen.name} (${currentCase.citizen.phone})...`}
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Templates:</span>
                  <button
                    type="button"
                    onClick={() => setQuickMessage('Site inspection scheduled for tomorrow 11:00 AM.')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                  >
                    Inspection tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickMessage('Repair parts dispatched to municipal ward team.')}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium"
                  >
                    Parts dispatched
                  </button>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  disabled={!quickMessage.trim()}
                  rightIcon={<Send className="w-3.5 h-3.5" />}
                  className="text-xs font-bold"
                >
                  Send Direct SMS
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right 1 Column: SLA, Assignment, and Activity Timeline */}
        <div className="space-y-6">
          {/* Section 5: Status & SLA Monitoring */}
          <Card className="p-5 border border-slate-200 shadow-2xs space-y-4 bg-linear-to-b from-white to-slate-50">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              SLA & Escalation Status
            </h2>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
              <SlaIndicator
                slaDays={currentCase.slaDays}
                slaDeadline={currentCase.slaDeadline}
                submittedAt={currentCase.submittedAt}
                status={currentCase.status}
                showProgressBar
              />

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Statutory Deadline:</span>
                <span className="font-bold text-slate-800">
                  {formatDate(currentCase.slaDeadline)}
                </span>
              </div>
            </div>
          </Card>

          {/* Section 6: Assignment Card */}
          <Card className="p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Assigned Authority
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAssignModalOpen(true)}
                className="text-[11px] font-bold text-blue-700 h-6 px-2"
              >
                Change
              </Button>
            </div>

            {currentCase.assignedOfficer ? (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200">
                    {currentCase.assignedOfficer.name
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {currentCase.assignedOfficer.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {currentCase.assignedOfficer.designation}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 pt-1 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {currentCase.assignedOfficer.department}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {currentCase.assignedOfficer.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {currentCase.assignedOfficer.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                <p className="text-xs font-bold text-amber-900">No Officer Assigned Yet</p>
                <p className="text-[11px] text-amber-700">
                  Assign this grievance to a department field engineer to begin inspection.
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="w-full text-xs font-bold mt-1"
                >
                  Assign Field Engineer
                </Button>
              </div>
            )}
          </Card>

          {/* Section 8: Complete Activity Timeline */}
          <Card className="p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Activity Timeline ({currentCase.timeline.length})
              </h2>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {currentCase.timeline.map((item, idx) => {
                const isLatest = idx === currentCase.timeline.length - 1;
                return (
                  <div key={item.id || idx} className="relative group">
                    {/* Dot */}
                    <div
                      className={cn(
                        'absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all',
                        isLatest
                          ? 'border-blue-600 ring-4 ring-blue-100 scale-110'
                          : 'border-slate-300'
                      )}
                    >
                      {isLatest && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateTime(item.timestamp)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{item.description}</p>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                        <span className="font-semibold text-slate-700">
                          {item.actor.name} ({item.actor.role})
                        </span>
                        {item.comment && (
                          <span className="italic text-slate-500">"{item.comment}"</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ASSIGN OFFICER MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Case to Field Officer"
        description="Select the official engineer or field inspector responsible for ground verification and resolution."
        size="md"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Select Field Officer
            </label>
            <div className="space-y-2">
              {OFFICER_ROSTER.map((officer) => (
                <label
                  key={officer.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                    selectedOfficerId === officer.id
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <input
                    type="radio"
                    name="assignedOfficer"
                    checked={selectedOfficerId === officer.id}
                    onChange={() => setSelectedOfficerId(officer.id)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{officer.name}</p>
                    <p className="text-slate-500">{officer.designation}</p>
                    <p className="text-[11px] text-blue-700 font-medium">{officer.department}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Special Instructions / Site Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Please conduct site inspection within 24 hours and take geotagged photograph."
              value={assignNotes}
              onChange={(e) => setAssignNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold">
              Confirm Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. REQUEST INFORMATION MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isRequestInfoModalOpen}
        onClose={() => setIsRequestInfoModalOpen(false)}
        title="Request Clarification from Citizen"
        description="Notify the citizen about missing documents, photos, or clarification required to proceed."
        size="md"
      >
        <form onSubmit={handleRequestInfoSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Quick Query Presets
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Please provide clear photo of electricity meter reading.',
                'Kindly share the municipal water bill or consumer number.',
                'Please specify the exact house or landmark near the drainage block.',
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInfoQuery(preset)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg text-left transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Official Inquiry Message *
            </label>
            <textarea
              rows={3}
              required
              placeholder="State exactly what additional details are needed from the citizen..."
              value={infoQuery}
              onChange={(e) => setInfoQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Submitting this will automatically send an SMS to <strong>{currentCase.citizen.phone}</strong> and set status to <strong>Under Investigation</strong>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRequestInfoModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!infoQuery.trim()} className="font-bold">
              Dispatch Inquiry Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. COMMUNICATE MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCommunicateModalOpen}
        onClose={() => setIsCommunicateModalOpen(false)}
        title="Official Citizen Communication"
        description="Dispatch an official progress notice or status communication directly to the citizen."
        size="md"
      >
        <form onSubmit={handleCommunicateSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Dispatch Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['SMS', 'WHATSAPP', 'PORTAL'] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setCommChannel(ch)}
                  className={cn(
                    'py-2 px-3 rounded-xl border text-xs font-bold transition-all',
                    commChannel === ch
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  )}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Official Message Content *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Write official notice text..."
              value={commMessage}
              onChange={(e) => setCommMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCommunicateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!commMessage.trim()} className="font-bold">
              Dispatch Message
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. ESCALATE CASE MODAL (Destructive Confirmation Dialog) */}
      {/* ========================================================================= */}
      <EscalationModal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        caseItem={currentCase}
      />

      {/* ========================================================================= */}
      {/* 5. RESOLVE CASE MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title={
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <span>Mark Grievance as Resolved</span>
          </div>
        }
        description="Record ground work completion and notify the citizen for satisfaction review."
        size="md"
      >
        <form onSubmit={handleResolveSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Resolution Summary / Work Carried Out *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Main 4-inch pipeline joint replaced and pressure restored. Verified by on-site field team."
              value={resolveSummary}
              onChange={(e) => setResolveSummary(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Work Order / Inspection Ref Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. WO-MH-2026-88192"
              value={resolveRemarks}
              onChange={(e) => setResolveRemarks(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Resolving this grievance will send an instant SMS alert to <strong>{currentCase.citizen.phone}</strong> with a satisfaction rating link.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResolveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!resolveSummary.trim()}
              className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Complete & Resolve Case
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 6. CLOSE CASE MODAL (Destructive Confirmation Dialog) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        title="Confirm Case Closure"
        description="Formal closure finalizes the file and archives the redressal audit entry."
        size="md"
      >
        <form onSubmit={handleCloseSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Reason for Closure *
            </label>
            <select
              value={closeReason}
              onChange={(e) => setCloseReason(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
            >
              <option value="Citizen confirmed problem resolved on-site">
                Citizen confirmed problem resolved on-site
              </option>
              <option value="Resolution verified by Zonal Officer inspection">
                Resolution verified by Zonal Officer inspection
              </option>
              <option value="Duplicate grievance merged with primary work order">
                Duplicate grievance merged with primary work order
              </option>
              <option value="Grievance not actionable under municipal bylaws">
                Grievance not actionable under municipal bylaws
              </option>
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            Note: Closed cases are moved to historical archives and cannot be modified without administrator re-opening.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCloseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-bold bg-slate-900 hover:bg-black text-white"
            >
              Confirm Final Closure
            </Button>
          </div>
        </form>
      </Modal>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] bg-black rounded-2xl overflow-hidden">
            <img src={previewImage} alt="Evidence Preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
