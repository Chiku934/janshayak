import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Stepper } from '../../components/ui/Stepper';
import { Modal } from '../../components/ui/Modal';
import { DigiLockerSyncModal } from '../../features/evidence/DigiLockerSyncModal';
import { CaseEvidence, DepartmentType, CasePriority } from '../../types/case';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Building2,
  Truck,
  Zap,
  HelpCircle,
  Mic,
  MicOff,
  Sparkles,
  MapPin,
  Navigation,
  Compass,
  Search,
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Plus,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Send,
  Lock,
  Eye,
  QrCode,
  Calendar,
  Home,
  Clock,
  Check,
  Download,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../utils/cn';

// Categories matching exact prompt specification
const CATEGORIES = [
  {
    id: 'GOVT_SERVICE',
    name: 'Government Service',
    nameHi: 'ସରକାରୀ ସେବା',
    icon: Landmark,
    color: 'blue',
    department: 'Social Welfare & Pensions' as DepartmentType,
    description: 'Pensions, NFSA Ration card, caste/income certificates, DBT subsidy & land mutations.',
    chips: ['Pensions Delay', 'Ration Card NFSA', 'Certificates', 'Land Records 7/12'],
  },
  {
    id: 'CIVIC_ISSUE',
    name: 'Local / Civic Issue',
    nameHi: 'ସ୍ଥାନୀୟ / ନାଗରିକ ସମସ୍ୟା',
    icon: Building2,
    color: 'purple',
    department: 'Urban Development & Housing (PMAY)' as DepartmentType,
    description: 'Public parks, illegal encroachment, high noise pollution, street dogs & stray animals.',
    chips: ['Park Maintenance', 'Encroachment', 'Noise Pollution', 'Stray Animals'],
  },
  {
    id: 'ROADS_SANITATION',
    name: 'Roads & Sanitation',
    nameHi: 'ରାସ୍ତାଘାଟ ଓ ପରିମଳ',
    icon: Truck,
    color: 'amber',
    department: 'Public Works & Roads (PWD)' as DepartmentType,
    description: 'Potholes, broken footpaths, uncollected garbage piles, open drains & overflowing sewage.',
    chips: ['Pothole Repair', 'Garbage Clearance', 'Open Drain Block', 'Footpath Repair'],
  },
  {
    id: 'WATER_ELECTRICITY',
    name: 'Water & Electricity',
    nameHi: 'ଜଳ ଓ ବିଦ୍ୟୁତ୍ ଯୋଗାଣ',
    icon: Zap,
    color: 'cyan',
    department: 'Municipal Water Supply & Sanitation' as DepartmentType,
    description: 'Drinking water pipeline bursts, contaminated supply, dark streetlights & power outages.',
    chips: ['Pipeline Leakage', 'No Water Supply', 'Streetlight Failure', 'Voltage Fluctuation'],
  },
  {
    id: 'OTHER',
    name: 'Other',
    nameHi: 'ଅନ୍ୟାନ୍ୟ ଅଭିଯୋଗ',
    icon: HelpCircle,
    color: 'emerald',
    department: 'Public Health & Family Welfare' as DepartmentType,
    description: 'Public health emergencies, municipal tax disputes, environmental & uncategorized civic issues.',
    chips: ['Public Health', 'Civic Taxes', 'Environment', 'General Grievance'],
  },
];

const WIZARD_STEPS = [
  { id: 1, title: 'Category', description: 'Select Issue Type' },
  { id: 2, title: 'Description', description: 'Explain the Problem' },
  { id: 3, title: 'Location', description: 'GPS & Ward Address' },
  { id: 4, title: 'Evidence', description: 'Photos & Documents' },
  { id: 5, title: 'Review', description: 'Confirm & Submit' },
];

export const ReportProblemPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, addCase, triggerSmsSimulation } = useAppStore();
  const { openVoiceAssistant } = useVoiceStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);

  // STEP 1: Category
  const [selectedCategory, setSelectedCategory] = useState<string>('WATER_ELECTRICITY');

  // STEP 2: Description
  const [title, setTitle] = useState('Drinking Water Pipeline Burst & Flooding');
  const [description, setDescription] = useState(
    'The main potable water distribution line at Shivaji Nagar Sector 3 has burst under high pressure. Muddy water is gushing into the roadway and 250+ households have zero drinking water supply.'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // STEP 3: Location
  const [address, setAddress] = useState('Plot 42, Near Datta Mandir, Shivaji Nagar Lane 4');
  const [ward, setWard] = useState('Ward 14 (Shivaji Nagar Sector 3)');
  const [city, setCity] = useState('Pune');
  const [pincode, setPincode] = useState('411016');
  const [coordinates, setCoordinates] = useState({ lat: 18.5204, lng: 73.8567 });
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [mapZoom, setMapZoom] = useState(15);

  // STEP 4: Evidence & Real Document Upload States
  const [evidenceList, setEvidenceList] = useState<CaseEvidence[]>([
    {
      id: 'ev-preset-1',
      name: 'broken_pipeline_ground_photo.jpg',
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      size: '2.4 MB',
      uploadedAt: new Date().toISOString(),
      verified: true,
      metadata: {
        geoTag: '18.5204° N, 73.8567° E',
        timestamp: new Date().toISOString(),
      },
    },
    {
      id: 'ev-preset-2',
      name: 'aadhaar_ekyc_verified.pdf',
      type: 'DIGILOCKER_CERT',
      url: '#',
      size: '180 KB',
      uploadedAt: new Date().toISOString(),
      verified: true,
      metadata: {
        digiLockerDocId: 'UIDAI-EKYC-8812',
        issuer: 'UIDAI National Gateway',
      },
    },
  ]);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingDoc, setIsDraggingDoc] = useState(false);
  const [previewItem, setPreviewItem] = useState<CaseEvidence | null>(null);
  const [isDigiLockerOpen, setIsDigiLockerOpen] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = (files: FileList | null, forceType?: 'IMAGE' | 'PDF') => {
    if (!files || files.length === 0) return;

    const newItems: CaseEvidence[] = [];
    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const detectedType: CaseEvidence['type'] = forceType || (isImg ? 'IMAGE' : 'PDF');
      const objectUrl = isImg ? URL.createObjectURL(file) : '#';

      newItems.push({
        id: `ev-real-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        type: detectedType,
        url: objectUrl,
        size: formatFileSize(file.size),
        uploadedAt: new Date().toISOString(),
        verified: true,
        metadata: {
          geoTag: `${coordinates.lat.toFixed(4)}° N, ${coordinates.lng.toFixed(4)}° E`,
          timestamp: new Date().toLocaleString(),
        },
      });
    });

    setEvidenceList((prev) => [...prev, ...newItems]);
    setUploadFeedback(`Successfully attached ${files.length} real document${files.length > 1 ? 's' : ''}`);
    setTimeout(() => setUploadFeedback(null), 3500);
  };

  const handleClearAllEvidence = () => {
    setEvidenceList([]);
  };

  const handleLoadSampleEvidence = () => {
    setEvidenceList([
      {
        id: 'ev-preset-1',
        name: 'broken_pipeline_ground_photo.jpg',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
        size: '2.4 MB',
        uploadedAt: new Date().toISOString(),
        verified: true,
        metadata: {
          geoTag: '18.5204° N, 73.8567° E',
          timestamp: new Date().toISOString(),
        },
      },
      {
        id: 'ev-preset-2',
        name: 'aadhaar_ekyc_verified.pdf',
        type: 'DIGILOCKER_CERT',
        url: '#',
        size: '180 KB',
        uploadedAt: new Date().toISOString(),
        verified: true,
        metadata: {
          digiLockerDocId: 'UIDAI-EKYC-8812',
          issuer: 'UIDAI National Gateway',
        },
      },
    ]);
  };

  const handleDigiLockerImport = (docNames: string[]) => {
    const digiDocs: CaseEvidence[] = docNames.map((name, idx) => ({
      id: `ev-digi-${Date.now()}-${idx}`,
      name: `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      type: 'DIGILOCKER_CERT',
      url: '#',
      size: '220 KB',
      uploadedAt: new Date().toISOString(),
      verified: true,
      metadata: {
        digiLockerDocId: `UIDAI-VERIFIED-${Math.floor(1000 + Math.random() * 9000)}`,
        issuer: 'DigiLocker National Cloud Gateway',
      },
    }));
    setEvidenceList((prev) => [...prev, ...digiDocs]);
    setUploadFeedback(`Imported ${docNames.length} verified document(s) from DigiLocker`);
    setTimeout(() => setUploadFeedback(null), 3500);
  };

  const handleAddSampleImage = () => {
    imageInputRef.current?.click();
  };

  const handleAddSampleDoc = () => {
    docInputRef.current?.click();
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidenceList(evidenceList.filter((e) => e.id !== id));
  };

  const selectedCategoryObj =
    CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  // Helper to simulate GPS Fetch
  const handleUseCurrentLocation = () => {
    setIsGpsLoading(true);
    setTimeout(() => {
      setCoordinates({ lat: 18.5314, lng: 73.8446 });
      setWard('Ward 14 (Shivaji Nagar Sector 3)');
      setAddress('Shivaji Nagar Main Road, Near PMC Water Tank, Pune');
      setPincode('411016');
      setIsGpsLoading(false);
    }, 700);
  };

  // Helper to toggle simulated voice dictation
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setVoiceTranscript('Listening... Speak now in Odia or English');
      setTimeout(() => {
        const sampleText =
          ' ମୁଖ୍ୟ ପାଣି ପାଇପଲାଇନ ଫାଟିଯାଇଛି ଏବଂ ରାସ୍ତାରେ ପାଣି ଭାସୁଛି। ଦୟାକରି ତୁରନ୍ତ ମରାମତି କରାନ୍ତୁ। (Main water pipeline has ruptured and road is flooded. Please dispatch repair team immediately.)';
        setDescription((prev) => (prev ? prev + '\n' + sampleText : sampleText));
        setIsRecording(false);
        setVoiceTranscript('');
      }, 2500);
    }
  };

  // Handle Submission
  const handleSubmitCase = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      // Mock generated Case ID matching requirement (e.g. JS-2026-000123)
      const randomSeq = String(Math.floor(100 + Math.random() * 900)).padStart(6, '0');
      const generatedId = `JS-2026-${randomSeq}`;

      const createdCase = addCase({
        title: title || `${selectedCategoryObj.name} Grievance`,
        description: description || 'Civic issue reported by citizen via Jan Sahayak Portal.',
        category: selectedCategoryObj.name,
        department: selectedCategoryObj.department,
        ward,
        district: 'Pune District',
        state: 'Maharashtra',
        pincode,
        address,
        locationCoordinates: coordinates,
        status: 'SUBMITTED',
        priority: 'HIGH',
        slaDays: 2,
        slaDeadline: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        citizen: {
          id: currentUser.id,
          name: currentUser.name,
          phone: currentUser.phone,
          email: currentUser.email,
          aadhaarMasked: currentUser.aadhaarMasked || 'XXXX-XXXX-4812',
          language: currentUser.language,
          isVerified: currentUser.isAadhaarVerified,
        },
        evidence: evidenceList,
        tags: [selectedCategoryObj.name, ward, 'Citizen Web Portal', 'GPS Geotagged'],
      });

      // Override the auto-generated ID with the exact mock format
      createdCase.id = generatedId;

      triggerSmsSimulation(
        currentUser.phone,
        `[Govt Alert] Grievance #${generatedId} registered for ${selectedCategoryObj.department}. Target SLA: 48 hours. Track at jansahayak.gov.in/track/${generatedId}`,
        'JAN SAHAYAK SEVA'
      );

      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
      });

      setCreatedCaseId(generatedId);
      setIsSubmitting(false);
    }, 900);
  };

  // SUCCESS SCREEN
  if (createdCaseId) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-300">
        <Card className="p-8 sm:p-10 border-2 border-emerald-500/30 shadow-xl text-center space-y-6 bg-white relative overflow-hidden">
          {/* Subtle top decoration */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-emerald-500 via-teal-500 to-blue-600" />

          {/* Big Green Success Checkmark */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              Official Grievance Lodged
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Case Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your grievance has been cryptographically registered on the Jan Sahayak Central Redressal Engine and routed to designated field officers.
            </p>
          </div>

          {/* Case Reference Token Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-semibold text-slate-500">Your Case Reference ID:</span>
              <span className="font-mono text-base font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                {createdCaseId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left text-xs">
              <div>
                <span className="text-slate-400 font-medium">Category:</span>
                <p className="font-bold text-slate-900">{selectedCategoryObj.name}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Target SLA:</span>
                <p className="font-bold text-emerald-700">48 Hours (Guaranteed)</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Jurisdiction:</span>
                <p className="font-bold text-slate-900">{ward}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">SMS Sent To:</span>
                <p className="font-bold text-slate-900">{currentUser.phone}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/citizen/track`)}
              leftIcon={<Search className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold px-8 shadow-md"
            >
              Track Case
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/citizen/home')}
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold px-8"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Report a Problem
            </h1>
            <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-200">
              5-Step Redressal Wizard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            File civic grievances with GPS location, photo evidence, and statutory resolution commitments.
          </p>
        </div>

        <Button
          variant="saffron"
          size="sm"
          onClick={() => openVoiceAssistant('WATER_CRISIS')}
          leftIcon={<Mic className="w-3.5 h-3.5" />}
          className="font-bold shrink-0 shadow-xs"
        >
          କହିକି ଦାଖଲ କରନ୍ତୁ (Voice AI)
        </Button>
      </div>

      {/* 5-Step Stepper Header */}
      <div className="bg-white px-4 sm:px-6 py-2 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <Stepper
          steps={WIZARD_STEPS}
          currentStep={currentStep - 1}
          onStepClick={(idx) => setCurrentStep(idx + 1)}
        />
      </div>

      {/* Main Form Body */}
      <Card className="p-6 sm:p-8 shadow-md border border-slate-200">
        <AnimatePresence mode="wait">
          {/* =========================================================
              STEP 1: Select Category
             ========================================================= */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    STEP 1: Select Category
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose the sector that best describes your civic complaint.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Step 1 of 5
                </span>
              </div>

              {/* 5 Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group',
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-100/70 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div
                            className={cn(
                              'w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700'
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div
                            className={cn(
                              'w-5 h-5 rounded-full border flex items-center justify-center',
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-300 bg-white'
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {cat.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium">
                              ({cat.nameHi})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Sub-chips */}
                      <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-slate-100">
                        {cat.chips.map((chip, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate('/citizen/home')}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setCurrentStep(2)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-xs px-6"
                >
                  Proceed to Describe Problem
                </Button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              STEP 2: Describe Problem
             ========================================================= */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    STEP 2: Describe Problem
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Category:{' '}
                    <span className="font-bold text-blue-700">
                      {selectedCategoryObj.name}
                    </span>
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Step 2 of 5
                </span>
              </div>

              {/* Problem Title Input */}
              <Input
                label="Problem Title / Short Summary (ସମସ୍ୟାର ସଂକ୍ଷିପ୍ତ ଶୀର୍ଷକ)"
                placeholder="e.g. Drinking Water Pipeline Burst & Flooding"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* Detailed Description Textarea with Character Count & Voice Input Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Detailed Description (ବିସ୍ତୃତ ବିବରଣୀ)
                  </label>

                  {/* Voice input button */}
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border',
                      isRecording
                        ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                        : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                    )}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-rose-600" />
                        <span>Recording... Tap to finish</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-orange-600" />
                        <span>Speak to Dictate (କହିକି ଲେଖନ୍ତୁ)</span>
                      </>
                    )}
                  </button>
                </div>

                {isRecording && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-3 text-xs text-rose-900 animate-pulse">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span className="font-semibold">{voiceTranscript}</span>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    rows={6}
                    maxLength={1000}
                    placeholder="Describe specific details: when did the issue begin, landmark nearby, approximate households impacted, hazard urgency..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-2xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 leading-relaxed resize-y"
                    required
                  />

                  {/* Live Character Count */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
                    <span>Minimum 10 characters recommended for automated AI triage.</span>
                    <span
                      className={cn(
                        'font-mono font-semibold',
                        description.length > 900
                          ? 'text-rose-600'
                          : description.length > 500
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      )}
                    >
                      {description.length} / 1000 characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Templates */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 block mb-2">
                  Sample Quick Templates:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle('Potable Drinking Water Pipeline Rupture');
                      setDescription(
                        'High pressure pipeline burst near Shivaji Nagar Sector 3 chowk. Clean drinking water is flowing on the road and contamination is entering surrounding buildings.'
                      );
                    }}
                    className="text-[11px] font-semibold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    💧 Water Pipeline Rupture
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTitle('Uncollected Garbage Heap & Open Drain Block');
                      setDescription(
                        'Large accumulation of municipal solid waste for over 5 days near the primary school. Foul smell and stray dogs are blocking access to the lane.'
                      );
                    }}
                    className="text-[11px] font-semibold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    🚛 Garbage Heap
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTitle('Old Age Pension Scheme Application Delay');
                      setDescription(
                        'Application #MH-PUN-PEN-9912 was submitted with DigiLocker verified certificates 45 days ago. Statutory SLA has elapsed without disbursement.'
                      );
                    }}
                    className="text-[11px] font-semibold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    🏛️ Pension Application Stuck
                  </button>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={!title || !description}
                  onClick={() => setCurrentStep(3)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-xs px-6"
                >
                  Proceed to Add Location
                </Button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              STEP 3: Add Location
             ========================================================= */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    STEP 3: Add Location
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Specify the precise municipal location and jurisdictional ward.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Step 3 of 5
                </span>
              </div>

              {/* Location Preview & GPS Button Bar */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        GPS Geotag Preview
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        High Accuracy (±5m)
                      </span>
                    </div>
                    <p className="font-mono text-xs font-semibold text-blue-800 mt-0.5">
                      {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E • {ward}
                    </p>
                  </div>
                </div>

                {/* "Use Current Location" mock button */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUseCurrentLocation}
                  isLoading={isGpsLoading}
                  leftIcon={<Navigation className="w-3.5 h-3.5" />}
                  className="shrink-0 font-bold"
                >
                  Use Current Location
                </Button>
              </div>

              {/* Map Placeholder (Vector Stylized Civic Mock Map) */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-slate-100 border-2 border-slate-300 overflow-hidden shadow-inner flex items-center justify-center">
                {/* Stylized Vector Grid & Road Patterns */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid-pattern"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                  {/* Mock Roads */}
                  <path
                    d="M 0 80 Q 200 120 400 90 T 800 140"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="16"
                  />
                  <path
                    d="M 250 0 L 250 300"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="14"
                  />
                  <path
                    d="M 500 0 L 520 300"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                </svg>

                {/* Radar Pulse Effect at Pin Location */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 animate-ping absolute -top-3 pointer-events-none" />
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white transform -translate-y-2">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white/95 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 mt-1 border border-slate-200">
                    <span>{ward}</span>
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1 bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.min(z + 1, 18))}
                    className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.max(z - 1, 12))}
                    className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                  >
                    -
                  </button>
                </div>

                <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 px-2 py-1 rounded border border-slate-300">
                  🗺️ Mock Civic Map Engine (Frontend Prototype)
                </div>
              </div>

              {/* Address Form Inputs */}
              <div className="space-y-4">
                <Input
                  label="Exact Street Address / Landmark (ସ୍ଥାନ ଓ ଲ୍ୟାଣ୍ଡମାର୍କ)"
                  placeholder="e.g. Plot 42, Near Datta Mandir, Shivaji Nagar Lane 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Municipal Ward (ୱାର୍ଡ)"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    required
                  />
                  <Input
                    label="City / District (ସହର / ଜିଲ୍ଲା)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <Input
                    label="Pincode (ପିନ୍ କୋଡ୍)"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={!address || !ward}
                  onClick={() => setCurrentStep(4)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-xs px-6"
                >
                  Proceed to Upload Evidence
                </Button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              STEP 4: Upload Evidence & Documents
             ========================================================= */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Hidden file inputs for real documents and photos */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleFileUpload(e.target.files, 'IMAGE');
                  e.target.value = '';
                }}
              />
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleFileUpload(e.target.files, 'PDF');
                  e.target.value = '';
                }}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    STEP 4: Upload Evidence & Documents
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Attach real site photographs, camera shots, or official PDF petitions from your device or DigiLocker.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDigiLockerOpen(true)}
                    leftIcon={<Lock className="w-3.5 h-3.5 text-blue-600" />}
                    className="text-xs text-blue-700 bg-blue-50/70 border-blue-200 hover:bg-blue-100 font-semibold h-8"
                  >
                    Fetch from DigiLocker
                  </Button>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Step 4 of 5
                  </span>
                </div>
              </div>

              {/* Upload Success Banner */}
              <AnimatePresence>
                {uploadFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between gap-2 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{uploadFeedback}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadFeedback(null)}
                      className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload Selection Action Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Real Image / Photo Upload Box */}
                <div
                  onClick={() => imageInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                    handleFileUpload(e.dataTransfer.files, 'IMAGE');
                  }}
                  className={cn(
                    'p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center text-center group relative',
                    isDraggingImage
                      ? 'border-blue-600 bg-blue-100/60 ring-4 ring-blue-100'
                      : 'border-blue-300 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-500'
                  )}
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    + Upload Real Site Photo / Image
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Click to browse your device or drag & drop JPEG, PNG, WebP, HEIC from camera or gallery
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-blue-700 font-bold bg-white px-3.5 py-1.5 rounded-lg border border-blue-200 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      Choose Photo from Device
                    </span>
                  </div>
                </div>

                {/* Real Document / PDF Upload Box */}
                <div
                  onClick={() => docInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingDoc(true);
                  }}
                  onDragLeave={() => setIsDraggingDoc(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingDoc(false);
                    handleFileUpload(e.dataTransfer.files, 'PDF');
                  }}
                  className={cn(
                    'p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center text-center group relative',
                    isDraggingDoc
                      ? 'border-indigo-600 bg-indigo-100/60 ring-4 ring-indigo-100'
                      : 'border-slate-300 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-400'
                  )}
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    + Upload Real PDF / Document
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Click to browse or drag & drop official PDF petitions, village letters, receipts, affidavits
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-slate-700 font-bold bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs group-hover:bg-slate-800 group-hover:text-white transition-colors">
                      Choose Document from Device
                    </span>
                  </div>
                </div>
              </div>

              {/* Attached Evidence List & Previews */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Attached Files ({evidenceList.length})
                    </h4>
                    {evidenceList.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllEvidence}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {evidenceList.length === 0 && (
                      <button
                        type="button"
                        onClick={handleLoadSampleEvidence}
                        className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Load Demo Samples
                      </button>
                    )}
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Encrypted Local Storage
                    </span>
                  </div>
                </div>

                {evidenceList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 text-xs space-y-2">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1 opacity-70" />
                    <p className="font-semibold text-slate-700">No documents or photos attached yet</p>
                    <p className="text-[11px] text-slate-400">Click the upload cards above or drag files directly from your computer to attach your real files.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {evidenceList.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 group hover:border-blue-400 hover:shadow-xs transition-all"
                      >
                        <div
                          className="flex items-center gap-3 truncate cursor-pointer flex-1"
                          onClick={() => setPreviewItem(ev)}
                          title="Click to preview"
                        >
                          {ev.type === 'IMAGE' ? (
                            <div className="relative shrink-0">
                              <img
                                src={ev.url}
                                alt={ev.name}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className={cn(
                              "w-12 h-12 rounded-lg border flex items-center justify-center shrink-0",
                              ev.type === 'DIGILOCKER_CERT'
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            )}>
                              {ev.type === 'DIGILOCKER_CERT' ? (
                                <Lock className="w-6 h-6" />
                              ) : (
                                <FileText className="w-6 h-6" />
                              )}
                            </div>
                          )}

                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {ev.name}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {ev.size} • {ev.type}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {ev.type === 'DIGILOCKER_CERT' && (
                                <span className="inline-block text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  DigiLocker Verified
                                </span>
                              )}
                              {ev.metadata?.geoTag && (
                                <span className="inline-block text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  Geotagged
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(ev)}
                            title="Preview file"
                            aria-label="Preview file"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveEvidence(ev.id)}
                            title="Remove attachment"
                            aria-label="Remove attachment"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setCurrentStep(5)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-xs px-6"
                >
                  Proceed to Review & Submit
                </Button>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              STEP 5: Review & Submit
             ========================================================= */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    STEP 5: Review & Submit
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please verify all case parameters before final statutory logging.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Step 5 of 5
                </span>
              </div>

              {/* Review Overview Card */}
              <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
                {/* Category & Title */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                      {selectedCategoryObj.name}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                      SLA: 48 Hours Commitment
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    {description}
                  </p>
                </div>

                {/* Location Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Jurisdictional Department:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedCategoryObj.department}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Location & Ward:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{address}, {ward}</p>
                    <p className="font-mono text-[11px] text-slate-500">
                      GPS: {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
                    </p>
                  </div>
                </div>

                {/* Citizen Details */}
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Complainant Information (ନାଗରିକ ବିବରଣୀ)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400">Citizen Name:</span>
                      <p className="font-bold text-slate-900">{currentUser.name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Mobile (SMS Active):</span>
                      <p className="font-bold text-slate-900">{currentUser.phone}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Aadhaar Status:</span>
                      <p className="font-bold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        e-KYC Verified
                      </p>
                    </div>
                  </div>
                </div>

                {/* Evidence Attachments */}
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Attached Evidence ({evidenceList.length} files)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {evidenceList.map((ev) => (
                      <span
                        key={ev.id}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>{ev.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statutory Confirmation Guarantee */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3 text-xs text-blue-950">
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold">Automated Public Service Delivery Guarantee</h5>
                  <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                    By submitting this case, an official ticket will be assigned to the Ward 14 Junior Engineer. Real-time SMS status dispatches will be broadcast to <b>{currentUser.phone}</b>.
                  </p>
                </div>
              </div>

              {/* Navigation & Submit Button */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  disabled={isSubmitting}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmitCase}
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="font-bold shadow-md px-8 text-base bg-blue-600 hover:bg-blue-700"
                >
                  Submit Case
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* DigiLocker Sync Modal */}
      <DigiLockerSyncModal
        isOpen={isDigiLockerOpen}
        onClose={() => setIsDigiLockerOpen(false)}
        onDocsImported={handleDigiLockerImport}
      />

      {/* Real Document / Photo Preview Modal */}
      <Modal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {previewItem?.type === 'IMAGE' ? (
                <ImageIcon className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <div className="truncate">
              <h4 className="text-sm font-bold text-slate-900 truncate">{previewItem?.name}</h4>
              <p className="text-[10px] text-slate-400">{previewItem?.size} • {previewItem?.type}</p>
            </div>
          </div>
        }
        size="lg"
      >
        {previewItem && (
          <div className="space-y-4">
            {previewItem.type === 'IMAGE' ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-[440px]">
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-h-[440px] w-auto object-contain"
                />
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center shadow-xs">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{previewItem.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Official Document Attachment ({previewItem.size})</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tamper-Proof DigiLocker / Local Cryptographic Integrity Verified</span>
                </div>
              </div>
            )}

            {/* Document Metadata Details */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl text-xs border border-slate-200">
              <div>
                <span className="text-slate-400 font-medium">Uploaded At:</span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {new Date(previewItem.uploadedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Verification Status:</span>
                <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Attachment
                </p>
              </div>
              {previewItem.metadata?.geoTag && (
                <div className="col-span-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-400 font-medium">GPS Coordinates / Geotag:</span>
                  <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {previewItem.metadata.geoTag}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setPreviewItem(null)}>
                Close Preview
              </Button>
              {previewItem.url && previewItem.url !== '#' && (
                <a
                  href={previewItem.url}
                  download={previewItem.name}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Open File</span>
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
