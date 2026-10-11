import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Globe,
  Users,
  Scale,
  Eye,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  ExternalLink,
  Play,
  Pause,
  Maximize2,
  FileCheck,
  AlertTriangle,
  Upload,
  Hash,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  LayoutGrid,
  List,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export type EvidenceType = 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO';
export type VisibilityLevel = 'Citizen-visible' | 'Team-only' | 'Legal-only' | 'Restricted';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED';

export interface EvidenceItem {
  id: string;
  fileName: string;
  type: EvidenceType;
  caseId: string;
  caseTitle: string;
  uploadedBy: {
    name: string;
    role: string;
  };
  uploadedDate: string;
  visibility: VisibilityLevel;
  verificationStatus: VerificationStatus;
  size: string;
  fileUrl: string;
  hashSha256: string;
  geoTag?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-2026-001',
    fileName: 'site_burst_water_pipe_main_junction.jpg',
    type: 'IMAGE',
    caseId: 'JS-2026-8942',
    caseTitle: 'Major Water Pipeline Burst near Shivaji Chowk',
    uploadedBy: { name: 'Rameshwar Patil', role: 'Citizen' },
    uploadedDate: '2026-10-06T10:14:00Z',
    visibility: 'Citizen-visible',
    verificationStatus: 'VERIFIED',
    size: '3.4 MB',
    fileUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    geoTag: '18.5204° N, 73.8567° E (Shivaji Nagar, Pune)',
    verifiedBy: 'Er. Sachin Deshmukh (Asst. Executive Engineer)',
    notes: 'Visible high-pressure rupture spilling onto pedestrian walkway.',
  },
  {
    id: 'EVD-2026-002',
    fileName: 'municipal_tax_receipt_2025_26.pdf',
    type: 'DOCUMENT',
    caseId: 'JS-2026-8942',
    caseTitle: 'Major Water Pipeline Burst near Shivaji Chowk',
    uploadedBy: { name: 'Rameshwar Patil', role: 'Citizen' },
    uploadedDate: '2026-10-06T10:15:20Z',
    visibility: 'Citizen-visible',
    verificationStatus: 'VERIFIED',
    size: '1.2 MB',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    verifiedBy: 'Verification Desk Automated Engine',
    notes: 'DigiLocker Authenticated Consumer Property Tax Receipt.',
  },
  {
    id: 'EVD-2026-003',
    fileName: 'water_leak_acoustic_inspection_clip.mp4',
    type: 'VIDEO',
    caseId: 'JS-2026-8942',
    caseTitle: 'Major Water Pipeline Burst near Shivaji Chowk',
    uploadedBy: { name: 'Er. Sachin Deshmukh', role: 'Field Officer' },
    uploadedDate: '2026-10-07T09:30:00Z',
    visibility: 'Team-only',
    verificationStatus: 'VERIFIED',
    size: '14.8 MB',
    fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    hashSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    geoTag: '18.5210° N, 73.8570° E',
    verifiedBy: 'Er. Sachin Deshmukh',
    notes: '360 degree underground inspection video confirming joint weld fracture.',
  },
  {
    id: 'EVD-2026-004',
    fileName: 'citizen_voice_complaint_audio.wav',
    type: 'AUDIO',
    caseId: 'JS-2026-7731',
    caseTitle: 'Streetlights Inoperative on Ring Road',
    uploadedBy: { name: 'Ananya Deshmukh', role: 'Citizen' },
    uploadedDate: '2026-10-07T14:22:00Z',
    visibility: 'Citizen-visible',
    verificationStatus: 'VERIFIED',
    size: '840 KB',
    fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    hashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    notes: 'Voice complaint recorded in Marathi regarding safety of female commuters.',
  },
  {
    id: 'EVD-2026-005',
    fileName: 'pothole_asphalt_depth_measurement.jpg',
    type: 'IMAGE',
    caseId: 'JS-2026-6102',
    caseTitle: 'Dangerous Potholes and Open Manhole on NH-48 Bypass',
    uploadedBy: { name: 'Sunil Gokhale', role: 'Citizen' },
    uploadedDate: '2026-10-08T08:10:00Z',
    visibility: 'Citizen-visible',
    verificationStatus: 'PENDING',
    size: '4.1 MB',
    fileUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
    hashSha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    geoTag: '18.5089° N, 73.8012° E (Kothrud Bypass)',
    notes: 'Pothole depth exceeding 18cm, severe accident hazard for two-wheelers.',
  },
  {
    id: 'EVD-2026-006',
    fileName: 'contractor_non_compliance_legal_memo.pdf',
    type: 'DOCUMENT',
    caseId: 'JS-2026-6102',
    caseTitle: 'Dangerous Potholes and Open Manhole on NH-48 Bypass',
    uploadedBy: { name: 'Dr. Neha Rajvanshi, IAS', role: 'District Magistrate' },
    uploadedDate: '2026-10-08T11:45:00Z',
    visibility: 'Legal-only',
    verificationStatus: 'VERIFIED',
    size: '2.5 MB',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    hashSha256: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    notes: 'Official Show-Cause Notice issued to road construction concessionaire under IPC 283.',
  },
  {
    id: 'EVD-2026-007',
    fileName: 'internal_vigilance_investigation_report.pdf',
    type: 'DOCUMENT',
    caseId: 'JS-2026-5590',
    caseTitle: 'Delay in Pension Disbursement - Social Welfare',
    uploadedBy: { name: 'Vigilance Officer', role: 'State Auditor' },
    uploadedDate: '2026-10-08T13:00:00Z',
    visibility: 'Restricted',
    verificationStatus: 'PENDING',
    size: '5.6 MB',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    hashSha256: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    notes: 'Confidential internal audit on block-level DBT transaction logs.',
  },
  {
    id: 'EVD-2026-008',
    fileName: 'transformer_spark_hazard_footage.mp4',
    type: 'VIDEO',
    caseId: 'JS-2026-7731',
    caseTitle: 'Streetlights Inoperative on Ring Road',
    uploadedBy: { name: 'Er. Rajesh Sharma', role: 'DISCOM Engineer' },
    uploadedDate: '2026-10-08T14:30:00Z',
    visibility: 'Team-only',
    verificationStatus: 'VERIFIED',
    size: '22.1 MB',
    fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    hashSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    geoTag: '18.5300° N, 73.8400° E',
    notes: 'Thermal overload spark on junction feeder line.',
  },
];

export const CaseManagerEvidencePage: React.FC = () => {
  const navigate = useNavigate();
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(() => {
    const saved = localStorage.getItem('jansahayak_evidence_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_EVIDENCE;
      }
    }
    return INITIAL_EVIDENCE;
  });

  const saveEvidence = (newList: EvidenceItem[]) => {
    setEvidenceList(newList);
    localStorage.setItem('jansahayak_evidence_v1', JSON.stringify(newList));
  };

  // Filter States
  const [typeFilter, setTypeFilter] = useState<'ALL' | EvidenceType>('ALL');
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | VisibilityLevel>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | VerificationStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID');

  // Modal States
  const [activePreviewItem, setActivePreviewItem] = useState<EvidenceItem | null>(null);
  const [changeVisItem, setChangeVisItem] = useState<EvidenceItem | null>(null);
  const [selectedVis, setSelectedVis] = useState<VisibilityLevel>('Citizen-visible');
  const [rejectItem, setRejectItem] = useState<EvidenceItem | null>(null);
  const [rejectReason, setRejectReason] = useState('Blurry or unreadable photo/document');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Evidence Upload Form
  const [newFileName, setNewFileName] = useState('');
  const [newType, setNewType] = useState<EvidenceType>('IMAGE');
  const [newCaseId, setNewCaseId] = useState('JS-2026-8942');
  const [newVisibility, setNewVisibility] = useState<VisibilityLevel>('Citizen-visible');
  const [newNotes, setNewNotes] = useState('');

  // Audio Playback State inside preview
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Filter logic
  const filteredEvidence = evidenceList.filter((item) => {
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (visibilityFilter !== 'ALL' && item.visibility !== visibilityFilter) return false;
    if (statusFilter !== 'ALL' && item.verificationStatus !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.fileName.toLowerCase().includes(q);
      const matchCase = item.caseId.toLowerCase().includes(q);
      const matchTitle = item.caseTitle.toLowerCase().includes(q);
      const matchUploader = item.uploadedBy.name.toLowerCase().includes(q);
      if (!matchName && !matchCase && !matchTitle && !matchUploader) return false;
    }

    return true;
  });

  // Action: Verify
  const handleVerify = (item: EvidenceItem) => {
    const updated = evidenceList.map((e) =>
      e.id === item.id
        ? {
            ...e,
            verificationStatus: 'VERIFIED' as VerificationStatus,
            verifiedBy: 'Case Manager Officer',
            rejectionReason: undefined,
          }
        : e
    );
    saveEvidence(updated);
  };

  // Action: Reject
  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectItem) return;
    const updated = evidenceList.map((e) =>
      e.id === rejectItem.id
        ? {
            ...e,
            verificationStatus: 'REJECTED' as VerificationStatus,
            rejectionReason: rejectReason,
          }
        : e
    );
    saveEvidence(updated);
    setRejectItem(null);
  };

  // Action: Change Visibility
  const handleChangeVisibilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeVisItem) return;
    const updated = evidenceList.map((e) =>
      e.id === changeVisItem.id
        ? {
            ...e,
            visibility: selectedVis,
          }
        : e
    );
    saveEvidence(updated);
    setChangeVisItem(null);
  };

  // Action: Mock Download
  const handleDownloadMock = (item: EvidenceItem) => {
    const element = document.createElement('a');
    const file = new Blob([`Jan Sahayak Mock Digital Evidence Record\n\nFile: ${item.fileName}\nCase ID: ${item.caseId}\nSHA-256: ${item.hashSha256}\nTimestamp: ${item.uploadedDate}\nVerified By: ${item.verifiedBy || 'N/A'}`], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = item.fileName.includes('.') ? item.fileName : `${item.fileName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Action: Upload Mock Evidence
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `EVD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const mockFile: EvidenceItem = {
      id: newId,
      fileName: newFileName || `officer_inspection_${Date.now()}.${newType === 'IMAGE' ? 'jpg' : newType === 'DOCUMENT' ? 'pdf' : newType === 'VIDEO' ? 'mp4' : 'wav'}`,
      type: newType,
      caseId: newCaseId,
      caseTitle: 'Official Site Inspection Record',
      uploadedBy: { name: 'Case Manager Officer', role: 'Municipal Authority' },
      uploadedDate: new Date().toISOString(),
      visibility: newVisibility,
      verificationStatus: 'VERIFIED',
      size: '2.8 MB',
      fileUrl:
        newType === 'IMAGE'
          ? 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80'
          : newType === 'VIDEO'
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      hashSha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      geoTag: '18.5204° N, 73.8567° E (Geo-stamped by Jan Sahayak)',
      verifiedBy: 'Case Manager Officer',
      notes: newNotes || 'Uploaded via Case Manager Evidence Vault.',
    };

    saveEvidence([mockFile, ...evidenceList]);
    setIsUploadModalOpen(false);
    setNewFileName('');
    setNewNotes('');
  };

  const getTypeIcon = (type: EvidenceType) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'IMAGE':
        return <ImageIcon className="w-4 h-4 text-emerald-600" />;
      case 'VIDEO':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'AUDIO':
        return <Mic className="w-4 h-4 text-amber-600" />;
    }
  };

  const getVisibilityBadge = (vis: VisibilityLevel) => {
    switch (vis) {
      case 'Citizen-visible':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Globe className="w-3 h-3" /> Citizen-visible
          </span>
        );
      case 'Team-only':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Users className="w-3 h-3" /> Team-only
          </span>
        );
      case 'Legal-only':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <Scale className="w-3 h-3" /> Legal-only
          </span>
        );
      case 'Restricted':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <Lock className="w-3 h-3" /> Restricted
          </span>
        );
    }
  };

  const getVerificationBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
    }
  };

  const counts = {
    ALL: evidenceList.length,
    DOCUMENT: evidenceList.filter((e) => e.type === 'DOCUMENT').length,
    IMAGE: evidenceList.filter((e) => e.type === 'IMAGE').length,
    VIDEO: evidenceList.filter((e) => e.type === 'VIDEO').length,
    AUDIO: evidenceList.filter((e) => e.type === 'AUDIO').length,
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Evidence & Document Management
                </h1>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {evidenceList.length} Total Files
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tamper-proof digital repository for grievance evidence, on-site photographs, video logs & legal documents.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
            className="text-xs font-bold shadow-2xs"
          >
            Upload Evidence
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECURE EVIDENCE VAULT VISUAL SECTION */}
      {/* ========================================================================= */}
      <Card className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-linear-to-r from-blue-50/80 via-indigo-50/50 to-sky-50 text-slate-900 shadow-2xs relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                DigiLocker & SHA-256 Vault Active
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Chain of Custody: Immutable
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Secure Evidence Vault & Audit Integrity
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              Every citizen photo, inspection video, audio statement, and PDF is hashed with SHA-256 and stamped with cryptographic location metadata for legal admissibility in municipal tribunal proceedings.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto text-center">
            <div className="bg-white/90 p-3 rounded-xl border border-blue-100 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-slate-900">100%</span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Integrity Sealed
              </p>
            </div>
            <div className="bg-white/90 p-3 rounded-xl border border-blue-100 shadow-2xs">
              <span className="text-xl sm:text-2xl font-black text-emerald-600">
                {evidenceList.filter((e) => e.verificationStatus === 'VERIFIED').length}
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Verified Files
              </p>
            </div>
            <div className="bg-white/90 p-3 rounded-xl border border-blue-100 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-xl sm:text-2xl font-black text-amber-600">
                {evidenceList.filter((e) => e.verificationStatus === 'PENDING').length}
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Pending Triage
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 4 EVIDENCE TYPE TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { key: 'ALL', label: 'All Files', icon: Layers, count: counts.ALL },
          { key: 'DOCUMENT', label: 'Documents', icon: FileText, count: counts.DOCUMENT },
          { key: 'IMAGE', label: 'Images', icon: ImageIcon, count: counts.IMAGE },
          { key: 'VIDEO', label: 'Videos', icon: Video, count: counts.VIDEO },
          { key: 'AUDIO', label: 'Audio Recordings', icon: Mic, count: counts.AUDIO },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = typeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key as 'ALL' | EvidenceType)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-full text-[10px]',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar + View Toggle */}
      <Card className="p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3 bg-white">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by file name, case ID (e.g. JS-2026-8942), or uploader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Visibility Filter */}
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as 'ALL' | VisibilityLevel)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Visibility Levels</option>
              <option value="Citizen-visible">Citizen-visible</option>
              <option value="Team-only">Team-only</option>
              <option value="Legal-only">Legal-only</option>
              <option value="Restricted">Restricted</option>
            </select>

            {/* Verification Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | VerificationStatus)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending Review</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('GRID')}
                className={cn(
                  'p-1.5 rounded-lg transition-all',
                  viewMode === 'GRID' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                )}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={cn(
                  'p-1.5 rounded-lg transition-all',
                  viewMode === 'TABLE' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                )}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTypeFilter('ALL');
                setVisibilityFilter('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* EVIDENCE CARDS GRID VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'GRID' ? (
        filteredEvidence.length === 0 ? (
          <div className="p-12 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Evidence Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No files match your current filters. Try changing category, status, or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvidence.map((item) => (
              <Card
                key={item.id}
                className="border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between overflow-hidden bg-white group"
              >
                <div>
                  {/* Media Preview Header */}
                  <div className="relative h-44 bg-slate-100 border-b border-slate-100 overflow-hidden flex items-center justify-center">
                    {item.type === 'IMAGE' && (
                      <img
                        src={item.fileUrl}
                        alt={item.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {item.type === 'VIDEO' && (
                      <div className="w-full h-full relative bg-slate-900 flex items-center justify-center">
                        <video
                          src={item.fileUrl}
                          className="w-full h-full object-cover opacity-75"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-slate-900 text-slate-900" />
                          </div>
                        </div>
                      </div>
                    )}

                    {item.type === 'DOCUMENT' && (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-linear-to-b from-blue-50/50 to-slate-100 text-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                          <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">
                          PDF DOCUMENT ({item.size})
                        </span>
                      </div>
                    )}

                    {item.type === 'AUDIO' && (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-linear-to-b from-amber-50/50 to-slate-100 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Mic className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">
                          AUDIO RECORDING ({item.size})
                        </span>
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {getVisibilityBadge(item.visibility)}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {getVerificationBadge(item.verificationStatus)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate" title={item.fileName}>
                          {item.fileName}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{item.size}</span>
                      </div>

                      <p
                        onClick={() => navigate(`/case-manager/cases/${item.caseId}`)}
                        className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Case #{item.caseId}</span>
                        <ChevronRight className="w-3 h-3" />
                      </p>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {item.notes}
                      </p>
                    )}

                    {/* Metadata Footer */}
                    <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span>Uploaded by:</span>
                        <span className="font-semibold text-slate-800">
                          {item.uploadedBy.name} ({item.uploadedBy.role})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Date:</span>
                        <span className="font-medium text-slate-700">
                          {formatDate(item.uploadedDate)}
                        </span>
                      </div>
                      {item.geoTag && (
                        <div className="flex items-center justify-between">
                          <span>Geo-Location:</span>
                          <span className="font-medium text-blue-700 truncate max-w-[170px]">
                            {item.geoTag}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActivePreviewItem(item)}
                    leftIcon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
                    className="text-[11px] font-bold h-7 px-2.5 bg-white hover:bg-blue-50"
                  >
                    Preview
                  </Button>

                  <div className="flex items-center gap-1">
                    {item.verificationStatus !== 'VERIFIED' && (
                      <button
                        onClick={() => handleVerify(item)}
                        title="Verify Evidence"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}

                    {item.verificationStatus !== 'REJECTED' && (
                      <button
                        onClick={() => {
                          setRejectItem(item);
                        }}
                        title="Reject Evidence"
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setChangeVisItem(item);
                        setSelectedVis(item.visibility);
                      }}
                      title="Change Visibility Level"
                      className="p-1.5 rounded-lg bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDownloadMock(item)}
                      title="Download Mock Record"
                      className="p-1.5 rounded-lg bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* ========================================================================= */
        /* EVIDENCE TABLE VIEW */
        /* ========================================================================= */
        <Card className="border border-slate-200 shadow-2xs overflow-hidden bg-white">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Uploaded By</th>
                  <th className="py-3 px-4">Uploaded Date</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvidence.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* 1. File Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="max-w-[200px] truncate">
                          <p className="font-bold text-slate-900 truncate" title={item.fileName}>
                            {item.fileName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">{item.size}</p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Type */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{item.type}</td>

                    {/* 3. Case ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      <button
                        onClick={() => navigate(`/case-manager/cases/${item.caseId}`)}
                        className="hover:underline"
                      >
                        {item.caseId}
                      </button>
                    </td>

                    {/* 4. Uploaded By */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 leading-tight">
                        {item.uploadedBy.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.uploadedBy.role}</p>
                    </td>

                    {/* 5. Uploaded Date */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {formatDate(item.uploadedDate)}
                    </td>

                    {/* 6. Visibility */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getVisibilityBadge(item.visibility)}
                    </td>

                    {/* 7. Verification */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getVerificationBadge(item.verificationStatus)}
                    </td>

                    {/* 8. Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActivePreviewItem(item)}
                          className="text-[11px] font-bold h-7 px-2"
                        >
                          Preview
                        </Button>

                        {item.verificationStatus !== 'VERIFIED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerify(item)}
                            className="text-[11px] font-bold h-7 px-2 bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          >
                            Verify
                          </Button>
                        )}

                        {item.verificationStatus !== 'REJECTED' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setRejectItem(item)}
                            className="text-[11px] font-bold h-7 px-2 text-rose-700 hover:bg-rose-50"
                          >
                            Reject
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setChangeVisItem(item);
                            setSelectedVis(item.visibility);
                          }}
                          className="text-[11px] font-bold h-7 px-2 text-slate-600 hover:bg-slate-100"
                        >
                          Visibility
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadMock(item)}
                          className="text-[11px] font-bold h-7 px-2 text-slate-600 hover:bg-slate-100"
                        >
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 1. PREVIEW MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(activePreviewItem)}
        onClose={() => {
          setActivePreviewItem(null);
          setIsPlayingAudio(false);
        }}
        title={
          <div className="flex items-center gap-2">
            {activePreviewItem && getTypeIcon(activePreviewItem.type)}
            <span>{activePreviewItem?.fileName}</span>
          </div>
        }
        description={`Associated with Case #${activePreviewItem?.caseId} • Stored in Secure Evidence Vault`}
        size="lg"
      >
        {activePreviewItem && (
          <div className="space-y-4 pt-2">
            {/* Interactive Preview Canvas */}
            <div className="rounded-2xl border border-slate-200 bg-black/90 overflow-hidden flex items-center justify-center min-h-[280px] max-h-[420px] relative">
              {activePreviewItem.type === 'IMAGE' && (
                <img
                  src={activePreviewItem.fileUrl}
                  alt={activePreviewItem.fileName}
                  className="w-full h-full max-h-[400px] object-contain"
                />
              )}

              {activePreviewItem.type === 'VIDEO' && (
                <video
                  src={activePreviewItem.fileUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[380px] rounded-xl"
                />
              )}

              {activePreviewItem.type === 'DOCUMENT' && (
                <div className="p-8 text-center bg-white w-full h-full min-h-[300px] flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{activePreviewItem.fileName}</h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Verified PDF document stream attached to municipal grievance audit log.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleDownloadMock(activePreviewItem)}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    className="text-xs font-bold"
                  >
                    Open Document Copy
                  </Button>
                </div>
              )}

              {activePreviewItem.type === 'AUDIO' && (
                <div className="p-8 text-center bg-amber-50/60 text-slate-800 w-full h-full min-h-[260px] flex flex-col items-center justify-center space-y-4 border border-amber-200/60 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                    <Mic className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{activePreviewItem.fileName}</p>
                    <p className="text-xs text-slate-500">Citizen Audio Voice Statement</p>
                  </div>

                  <div className="w-full max-w-sm">
                    <audio src={activePreviewItem.fileUrl} controls className="w-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Cryptographic Metadata Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Visibility</span>
                  <p className="font-bold text-slate-900">{activePreviewItem.visibility}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Verification</span>
                  <p className="font-bold text-slate-900">{activePreviewItem.verificationStatus}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">File Size</span>
                  <p className="font-bold text-slate-900">{activePreviewItem.size}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Uploaded</span>
                  <p className="font-bold text-slate-900">{formatDate(activePreviewItem.uploadedDate)}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                  <Hash className="w-3 h-3" /> SHA-256 Cryptographic Hash
                </span>
                <p className="font-mono text-[10px] text-slate-700 bg-white p-1.5 rounded border border-slate-200 break-all select-all">
                  {activePreviewItem.hashSha256}
                </p>
              </div>

              {activePreviewItem.geoTag && (
                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-blue-700 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Geo-Stamp: {activePreviewItem.geoTag}</span>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadMock(activePreviewItem)}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download Mock
              </Button>

              <div className="flex items-center gap-2">
                {activePreviewItem.verificationStatus !== 'VERIFIED' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => {
                      handleVerify(activePreviewItem);
                      setActivePreviewItem({ ...activePreviewItem, verificationStatus: 'VERIFIED' });
                    }}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Mark Verified
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setActivePreviewItem(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 2. CHANGE VISIBILITY MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(changeVisItem)}
        onClose={() => setChangeVisItem(null)}
        title="Change Evidence Visibility Level"
        description={`Configure who is authorized to view "${changeVisItem?.fileName}".`}
        size="md"
      >
        <form onSubmit={handleChangeVisibilitySubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            {[
              {
                level: 'Citizen-visible',
                icon: Globe,
                title: 'Citizen-visible',
                desc: 'Visible to the citizen on their Jan Sahayak portal tracking page.',
              },
              {
                level: 'Team-only',
                icon: Users,
                title: 'Team-only',
                desc: 'Visible to internal municipal engineers and Case Managers only.',
              },
              {
                level: 'Legal-only',
                icon: Scale,
                title: 'Legal-only',
                desc: 'Restricted to Department Legal Officers and Administrative Tribunal.',
              },
              {
                level: 'Restricted',
                icon: Lock,
                title: 'Restricted (Vigilance)',
                desc: 'Confidential investigation record locked to District Collectorate.',
              },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = selectedVis === option.level;
              return (
                <label
                  key={option.level}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <input
                    type="radio"
                    name="visibilityLevel"
                    checked={isSelected}
                    onChange={() => setSelectedVis(option.level as VisibilityLevel)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-blue-600" />
                      {option.title}
                    </p>
                    <p className="text-slate-500">{option.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setChangeVisItem(null)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold">
              Update Visibility
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. REJECT EVIDENCE MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(rejectItem)}
        onClose={() => setRejectItem(null)}
        title={
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5" />
            <span>Reject Evidence Attachment</span>
          </div>
        }
        description={`Record reason for rejecting "${rejectItem?.fileName}".`}
        size="md"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Rejection Reason *
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
            >
              <option value="Blurry or unreadable photo/document">
                Blurry or unreadable photo/document
              </option>
              <option value="Evidence does not match reported incident location">
                Evidence does not match reported incident location
              </option>
              <option value="Duplicate attachment already uploaded">
                Duplicate attachment already uploaded
              </option>
              <option value="Incomplete document or missing pages">
                Incomplete document or missing pages
              </option>
              <option value="Unrelated third-party material">
                Unrelated third-party material
              </option>
            </select>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>
              Rejecting will mark this file as inadmissible in case audit logs and notify the citizen to re-upload.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRejectItem(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-bold bg-rose-600 hover:bg-rose-700 text-white"
            >
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. UPLOAD MOCK EVIDENCE MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Inspection Evidence to Vault"
        description="Add a new digital asset to the grievance case file (frontend mock file simulation)."
        size="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Target Case ID
            </label>
            <select
              value={newCaseId}
              onChange={(e) => setNewCaseId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
            >
              <option value="JS-2026-8942">JS-2026-8942 (Water Pipeline Burst)</option>
              <option value="JS-2026-7731">JS-2026-7731 (Streetlights Inoperative)</option>
              <option value="JS-2026-6102">JS-2026-6102 (Dangerous Potholes)</option>
              <option value="JS-2026-5590">JS-2026-5590 (Pension Disbursement)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Asset Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as EvidenceType)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="IMAGE">Image / Photograph</option>
                <option value="DOCUMENT">Document / PDF</option>
                <option value="VIDEO">Video Recording</option>
                <option value="AUDIO">Audio Recording</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Initial Visibility
              </label>
              <select
                value={newVisibility}
                onChange={(e) => setNewVisibility(e.target.value as VisibilityLevel)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="Citizen-visible">Citizen-visible</option>
                <option value="Team-only">Team-only</option>
                <option value="Legal-only">Legal-only</option>
                <option value="Restricted">Restricted</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Custom File Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. site_inspection_post_repair_pressure.jpg"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Inspection Notes / Geo Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Conducted pressure test on site; flow normalized to 4.2 bar."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
            Frontend Simulation: Automatically generates SHA-256 checksum and marks file as verified by Case Manager.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold">
              Seal & Store in Vault
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
