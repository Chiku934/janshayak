import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Stepper } from '../../components/ui/Stepper';
import { DigiLockerSyncModal } from '../../features/evidence/DigiLockerSyncModal';
import { DocumentUploadModal } from '../../features/evidence/DocumentUploadModal';
import { DepartmentType, CasePriority, CaseEvidence } from '../../types/case';
import {
  Mic,
  Sparkles,
  ShieldCheck,
  Upload,
  MapPin,
  CheckCircle2,
  Lock,
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const WIZARD_STEPS = [
  { id: 1, title: '1. Describe Issue', description: 'Voice or text description' },
  { id: 2, title: '2. Department & Ward', description: 'AI verified routing' },
  { id: 3, title: '3. Evidence & Proofs', description: 'DigiLocker & Photos' },
  { id: 4, title: '4. Review & Lodge', description: 'SLA & SMS confirmation' },
];

const DEPARTMENTS: DepartmentType[] = [
  'Municipal Water Supply & Sanitation',
  'Electricity & Power Distribution (DISCOM)',
  'Public Works & Roads (PWD)',
  'Social Welfare & Pensions',
  'Food, Civil Supplies & Consumer Affairs',
  'Urban Development & Housing (PMAY)',
  'Public Health & Family Welfare',
  'Revenue & Land Records',
];

export const NewGrievancePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, addCase } = useAppStore();
  const { openVoiceAssistant } = useVoiceStore();

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDigiLockerOpen, setIsDigiLockerOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Drinking Water & Sanitation');
  const [department, setDepartment] = useState<DepartmentType>('Municipal Water Supply & Sanitation');
  const [ward, setWard] = useState('Ward 14 (Shivaji Nagar Sector 3)');
  const [address, setAddress] = useState('Near Datta Mandir, Shivaji Nagar Lane 4');
  const [priority, setPriority] = useState<CasePriority>('HIGH');
  const [evidenceList, setEvidenceList] = useState<CaseEvidence[]>([
    {
      id: 'ev-auto-1',
      name: 'aadhaar_ekyc_verified.pdf',
      type: 'DIGILOCKER_CERT',
      url: '#',
      size: '240 KB',
      uploadedAt: new Date().toISOString(),
      verified: true,
      metadata: {
        digiLockerDocId: 'UIDAI-XXXX-4812',
        issuer: 'UIDAI National Gateway',
      },
    },
  ]);

  // AI Auto-Fill Helper for Instant Demo Magic
  const handleAiAutoFill = () => {
    setTitle('Potable Drinking Water Pipeline Leak & Contamination Risk');
    setDescription(
      'The underground drinking water supply main at Shivaji Nagar Sector 3 has suffered a high-pressure rupture. Muddy water is entering the residential pipelines. 350+ residents affected.'
    );
    setDepartment('Municipal Water Supply & Sanitation');
    setCategory('Drinking Water & Sanitation');
    setPriority('CRITICAL');
    setWard('Ward 14 (Shivaji Nagar Sector 3)');
    setAddress('Plot 42, Shivaji Nagar Main Cross, Pune 411016');
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    const slaDays = priority === 'CRITICAL' ? 2 : priority === 'HIGH' ? 3 : priority === 'MEDIUM' ? 7 : 14;
    const slaDeadline = new Date(Date.now() + 1000 * 60 * 60 * 24 * slaDays).toISOString();

    setTimeout(() => {
      const createdCase = addCase({
        title: title || 'Civic Infrastructure Grievance',
        description: description || 'No description provided.',
        category,
        department,
        ward,
        district: 'Pune District',
        state: 'Maharashtra',
        pincode: '411016',
        address,
        locationCoordinates: { lat: 18.5314, lng: 73.8446 },
        status: 'SUBMITTED',
        priority,
        slaDays,
        slaDeadline,
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
        tags: [category, ward, priority, 'Citizen Logged'],
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSubmitting(false);
      navigate(`/citizen/cases/${createdCase.id}`);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Lodge Public Grievance (ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Backed by statutory Public Service Delivery SLAs and official DigiLocker authentication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAiAutoFill}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-600" />}
            className="text-blue-700 bg-blue-50/60 border-blue-200"
          >
            AI Demo Auto-Fill
          </Button>

          <Button
            variant="saffron"
            size="sm"
            onClick={() => {
              openVoiceAssistant('WATER_CRISIS');
            }}
            leftIcon={<Mic className="w-3.5 h-3.5" />}
          >
            Voice Sahayak (ସ୍ୱର ସହାୟକ)
          </Button>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="bg-white px-6 py-2 rounded-xl border border-slate-200 shadow-2xs">
        <Stepper
          steps={WIZARD_STEPS}
          currentStep={step}
          onStepClick={(s) => setStep(s)}
        />
      </div>

      {/* Wizard Step Forms */}
      <Card className="p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Step 1: Describe Your Grievance
              </h3>
              <span className="text-xs text-slate-400">Step 1 of 4</span>
            </div>

            <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Mic className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-orange-900">
                    Prefer Speaking in your Mother Tongue?
                  </h4>
                  <p className="text-[11px] text-orange-800 mt-0.5">
                    Speak in Odia, Hindi, Marathi, Bengali, Tamil, Telugu or Gujarati. AI will automatically transcribe and fill this form.
                  </p>
                </div>
              </div>
              <Button
                variant="saffron"
                size="sm"
                onClick={() => openVoiceAssistant('WATER_CRISIS')}
                className="shrink-0 font-bold"
              >
                Launch Voice AI
              </Button>
            </div>

            <Input
              label="Grievance Title / Brief Summary"
              placeholder="e.g. Ruptured drinking water pipeline near Shivaji Chowk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Textarea
              label="Detailed Description of the Issue"
              placeholder="Please provide specifics: when did it start, exact landmark, approximate households affected, danger level..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                onClick={() => setStep(1)}
                disabled={!title && !description}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Department & Ward
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Step 2: Department & Location Categorization
              </h3>
              <span className="text-xs text-slate-400">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Responsible Department"
                options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentType)}
              />

              <Input
                label="Category / Sub-Service"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Municipal Ward / Gram Panchayat"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
              />

              <Select
                label="Priority & Target SLA"
                options={[
                  { value: 'CRITICAL', label: 'CRITICAL — 24-48 Hours (Public Safety / No Water)' },
                  { value: 'HIGH', label: 'HIGH — 3 Days (Infrastructure Damage)' },
                  { value: 'MEDIUM', label: 'MEDIUM — 7 Days (Billing / Schemes)' },
                  { value: 'LOW', label: 'STANDARD — 14 Days (General Routine)' },
                ]}
                value={priority}
                onChange={(e) => setPriority(e.target.value as CasePriority)}
              />
            </div>

            <Input
              label="Exact Street Address / Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Plot number, nearby temple, school, or milestone"
            />

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setStep(0)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Evidence & Proofs
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Step 3: Attach Verified Evidence & Certificates
              </h3>
              <span className="text-xs text-slate-400">Step 3 of 4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setIsDigiLockerOpen(true)}
                className="p-5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-500 transition-all cursor-pointer flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Import from DigiLocker
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Attach verified Aadhaar, Ration, 7/12 Land records
                </p>
                <span className="mt-3 text-[11px] text-blue-700 font-bold bg-white px-2.5 py-1 rounded-md border border-blue-200">
                  Open DigiLocker
                </span>
              </div>

              <div
                onClick={() => setIsUploadOpen(true)}
                className="p-5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Upload Site Photos / Videos
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  GPS geotagged camera photos or documents
                </p>
                <span className="mt-3 text-[11px] text-slate-700 font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  Browse Files
                </span>
              </div>
            </div>

            {/* Attached Evidence List */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-700">
                Attached Documents ({evidenceList.length}):
              </h4>
              {evidenceList.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{ev.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {ev.size} • Verified: {ev.verified ? 'Yes (Govt Trust)' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    ATTACHED
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(3)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Review & Lodge
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Step 4: Review Grievance & Confirm SLA Commitment
              </h3>
              <span className="text-xs text-slate-400">Step 4 of 4</span>
            </div>

            {/* Summary preview block */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Grievance Summary
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {title || 'Potable Drinking Water Pipeline Leak & Contamination Risk'}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {description || 'Emergency water line repair required at Shivaji Nagar.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Department:</span>
                  <p className="font-bold text-slate-900">{department}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Ward & Location:</span>
                  <p className="font-bold text-slate-900">{ward}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Complainant:</span>
                  <p className="font-bold text-slate-900">{currentUser.name} ({currentUser.phone})</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Guaranteed SLA:</span>
                  <p className="font-bold text-emerald-700">
                    {priority === 'CRITICAL' ? '48 Hours (Critical Public Safety)' : '3 Business Days'}
                  </p>
                </div>
              </div>
            </div>

            {/* Citizen SMS Alert notice */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold">Instant SMS Dispatch Enabled</h5>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  Upon submission, an official SMS token will be sent to <b>{currentUser.phone}</b>. The case will be assigned to Ward 14 Executive Engineer with live status updates.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinalSubmit}
                isLoading={isSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
                className="font-bold shadow-md"
              >
                Confirm & Lodge Grievance
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* DigiLocker and Upload modals */}
      <DigiLockerSyncModal
        isOpen={isDigiLockerOpen}
        onClose={() => setIsDigiLockerOpen(false)}
        onDocsImported={(names) => {
          const imported: CaseEvidence[] = names.map((name) => ({
            id: `ev-dl-${Date.now()}-${Math.random()}`,
            name: `${name}.pdf`,
            type: 'DIGILOCKER_CERT',
            url: '#',
            size: '480 KB',
            uploadedAt: new Date().toISOString(),
            verified: true,
          }));
          setEvidenceList((prev) => [...prev, ...imported]);
        }}
      />

      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={(ev) => setEvidenceList((prev) => [...prev, ev])}
      />
    </div>
  );
};
