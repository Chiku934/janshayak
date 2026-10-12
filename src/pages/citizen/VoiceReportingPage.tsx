import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CaseEvidence, DepartmentType } from '../../types/case';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  RefreshCw,
  Edit3,
  CheckCircle2,
  MapPin,
  Upload,
  ArrowRight,
  ArrowLeft,
  Send,
  Home,
  Search,
  Check,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Radio,
  Zap,
  Tag,
  Clock,
  Sparkle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../utils/cn';

type SupportedVoiceLang = 'English' | 'Hindi' | 'Odia';

interface MockScenario {
  transcript: string;
  category: string;
  department: DepartmentType;
  ward: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

const VOICE_LANG_PRESETS: Record<SupportedVoiceLang, MockScenario> = {
  English: {
    transcript:
      'There is a water leakage near the main road and it has been continuing for two days.',
    category: 'Water & Electricity',
    department: 'Municipal Water Supply & Sanitation',
    ward: 'Ward 14 (Shivaji Nagar Sector 3), Pune',
    priority: 'HIGH',
  },
  Hindi: {
    transcript:
      'मुख्य सड़क के पास पानी का लीकेज है और यह दो दिनों से लगातार बह रहा है। सड़क पर पानी भरने से आवागमन बंद है।',
    category: 'Water & Electricity',
    department: 'Municipal Water Supply & Sanitation',
    ward: 'वार्ड 14 (शिवाजी नगर), पुणे',
    priority: 'HIGH',
  },
  Odia: {
    transcript:
      'ମୁଖ୍ୟ ରାସ୍ତା ନିକଟରେ ପାଣି ଲିକେଜ୍ ହେଉଛି ଏବଂ ଏହା ଦୁଇ ଦିନ ଧରି ଚାଲିଛି | ରାସ୍ତାରେ ପାଣି ଜମି ରହିଛି |',
    category: 'Water & Electricity',
    department: 'Municipal Water Supply & Sanitation',
    ward: 'ୱାର୍ଡ ୧୪, ଶିବାଜୀ ନଗର',
    priority: 'HIGH',
  },
};

const CATEGORIES_LIST = [
  'Water & Electricity',
  'Roads & Sanitation',
  'Government Service',
  'Local / Civic Issue',
  'Other',
];

export const VoiceReportingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, addCase, triggerSmsSimulation } = useAppStore();

  // Voice Recording Flow States: 'IDLE' | 'RECORDING' | 'TRANSCRIBING' | 'REVIEW' | 'SUCCESS'
  const [voiceState, setVoiceState] = useState<
    'IDLE' | 'RECORDING' | 'TRANSCRIBING' | 'REVIEW' | 'SUCCESS'
  >('IDLE');

  const [selectedLang, setSelectedLang] = useState<SupportedVoiceLang>('Odia');
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Review & Edit form state
  const [transcript, setTranscript] = useState(VOICE_LANG_PRESETS.Odia.transcript);
  const [category, setCategory] = useState(VOICE_LANG_PRESETS.English.category);
  const [location, setLocation] = useState(
    'Near Main Road Water Pipeline Junction, Shivaji Nagar, Ward 14, Pune - 411016'
  );
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showEvidenceInput, setShowEvidenceInput] = useState(false);
  const [evidenceList, setEvidenceList] = useState<CaseEvidence[]>([
    {
      id: 'ev-voice-1',
      name: 'voice_audio_memo.wav',
      type: 'AUDIO',
      url: '#',
      size: '1.2 MB',
      uploadedAt: new Date().toISOString(),
      verified: true,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);

  // Recording Timer
  useEffect(() => {
    let interval: any;
    if (voiceState === 'RECORDING') {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [voiceState]);

  // Language Change handler
  const handleLanguageChange = (lang: SupportedVoiceLang) => {
    setSelectedLang(lang);
    setTranscript(VOICE_LANG_PRESETS[lang].transcript);
    setCategory(VOICE_LANG_PRESETS[lang].category);
  };

  // Start Mock Recording
  const handleStartRecording = () => {
    setVoiceState('RECORDING');
    setRecordingSeconds(0);
  };

  // Stop Mock Recording & Trigger AI Transcription
  const handleStopRecording = () => {
    setVoiceState('TRANSCRIBING');

    // Simulate AI transcription delay
    setTimeout(() => {
      setTranscript(VOICE_LANG_PRESETS[selectedLang].transcript);
      setCategory(VOICE_LANG_PRESETS[selectedLang].category);
      setVoiceState('REVIEW');
    }, 1400);
  };

  // Add mock photo evidence
  const handleAddPhotoEvidence = () => {
    const newEv: CaseEvidence = {
      id: `ev-photo-${Date.now()}`,
      name: 'voice_complaint_site_photo.jpg',
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      size: '2.1 MB',
      uploadedAt: new Date().toISOString(),
      verified: true,
      metadata: {
        geoTag: '18.5204° N, 73.8567° E',
      },
    };
    setEvidenceList((prev) => [...prev, newEv]);
  };

  // Final Submit Action
  const handleSubmitVoiceCase = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const randomSeq = String(Math.floor(100 + Math.random() * 900)).padStart(6, '0');
      const generatedId = `JS-2026-${randomSeq}`;

      const createdCase = addCase({
        title: `Voice Reported: ${category} Issue`,
        description: transcript,
        category,
        department: VOICE_LANG_PRESETS[selectedLang].department,
        ward: 'Ward 14 (Shivaji Nagar Sector 3)',
        district: 'Pune District',
        state: 'Maharashtra',
        pincode: '411016',
        address: location,
        locationCoordinates: { lat: 18.5204, lng: 73.8567 },
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
        tags: [category, 'Voice AI Lodged', selectedLang, 'Demo Phase 02'],
      });

      createdCase.id = generatedId;

      triggerSmsSimulation(
        currentUser.phone,
        `[Govt Voice Alert] Voice grievance #${generatedId} registered in ${selectedLang}. Category: ${category}. Track at jansahayak.gov.in/track/${generatedId}`,
        'JAN SAHAYAK VOICE'
      );

      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
      });

      setCreatedCaseId(generatedId);
      setVoiceState('SUCCESS');
      setIsSubmitting(false);
    }, 900);
  };

  // Reset to record again
  const handleReset = () => {
    setVoiceState('IDLE');
    setRecordingSeconds(0);
  };

  // Formatter for timer: mm:ss
  const formattedTimer = `00:${recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* 1. Official Phase 02 Demo Banner */}
      <div className="bg-linear-to-r from-purple-50 via-indigo-50/60 to-blue-50 text-slate-800 p-4 sm:p-5 rounded-2xl border border-purple-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 animate-pulse text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
                Demo Capability — Phase 02
              </span>
              <span className="text-[10px] text-purple-700 hidden sm:inline font-semibold">
                Simulated AI Speech Engine
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Zero typing required. Speak in regional Indian dialects for automated AI transcription & category classification.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/citizen/report')}
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 text-xs shrink-0 shadow-2xs"
        >
          Standard Form
        </Button>
      </div>

      {/* SUCCESS SCREEN */}
      {voiceState === 'SUCCESS' && createdCaseId ? (
        <Card className="p-8 sm:p-10 border-2 border-emerald-500/30 shadow-xl text-center space-y-6 bg-white animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              Voice Grievance Logged
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Voice Case Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your spoken complaint in <b>{selectedLang}</b> has been transcribed, classified, and registered with high priority.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-semibold text-slate-500">Case Reference ID:</span>
              <span className="font-mono text-base font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                {createdCaseId}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Auto-Classified Category:</span>
                <p className="font-bold text-slate-900">{category}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Spoken Language:</span>
                <p className="font-bold text-slate-900">{selectedLang}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Verified Transcript:</span>
                <p className="italic text-slate-700 bg-white p-2 rounded-lg border border-slate-200 mt-0.5">
                  "{transcript}"
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/citizen/track')}
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
      ) : (
        /* 2. Main Voice Interaction Card */
        <Card className="p-6 sm:p-10 shadow-md border border-slate-200 space-y-8">
          {/* Header & Language Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Report Your Problem Just by Voice
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Tap the microphone below and speak naturally. Our AI will transcribe and route your grievance.
              </p>
            </div>

            {/* Language Selector: English, Hindi, Odia */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Language:
              </span>
              {(['English', 'Hindi', 'Odia'] as SupportedVoiceLang[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                    selectedLang === lang
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  )}
                >
                  {lang === 'Hindi' ? 'हिन्दी (Hindi)' : lang === 'Odia' ? 'ଓଡ଼ିଆ (Odia)' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* =========================================================
              A. RECORDING & IDLE INTERACTION ZONE
             ========================================================= */}
          {voiceState === 'IDLE' || voiceState === 'RECORDING' || voiceState === 'TRANSCRIBING' ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-6 text-center">
              {/* Animated Waveform Bars (Framer Motion) */}
              <div className="h-16 flex items-center justify-center gap-1.5 px-4 w-full max-w-sm">
                {[12, 24, 40, 60, 32, 50, 68, 44, 28, 56, 36, 18, 48, 62, 30].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={
                      voiceState === 'RECORDING'
                        ? {
                            height: [
                              `${Math.max(10, (h * 0.3))}%`,
                              `${Math.min(100, h * 1.3)}%`,
                              `${Math.max(15, (h * 0.5))}%`,
                            ],
                            backgroundColor: ['#3b82f6', '#f97316', '#3b82f6'],
                          }
                        : {
                            height: '15%',
                            backgroundColor: '#cbd5e1',
                          }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + (i % 5) * 0.1,
                      ease: 'easeInOut',
                    }}
                    className="w-1.5 rounded-full"
                  />
                ))}
              </div>

              {/* Large Microphone Button with Animated Ripple Rings */}
              <div className="relative flex items-center justify-center">
                {/* Outer Ripple Rings during Recording */}
                {voiceState === 'RECORDING' && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.45, 1.7], opacity: [0.6, 0.3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                      className="absolute w-28 h-28 rounded-full bg-rose-500/25 pointer-events-none"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.25, 1.45], opacity: [0.8, 0.4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.8, delay: 0.4, ease: 'easeOut' }}
                      className="absolute w-28 h-28 rounded-full bg-orange-500/30 pointer-events-none"
                    />
                  </>
                )}

                <button
                  type="button"
                  onClick={voiceState === 'RECORDING' ? handleStopRecording : handleStartRecording}
                  disabled={voiceState === 'TRANSCRIBING'}
                  aria-label={voiceState === 'RECORDING' ? 'Stop recording' : 'Start voice recording'}
                  className={cn(
                    'relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 cursor-pointer select-none',
                    voiceState === 'RECORDING'
                      ? 'bg-linear-to-tr from-rose-600 to-orange-500 text-white ring-8 ring-rose-100 scale-105 shadow-rose-500/30'
                      : voiceState === 'TRANSCRIBING'
                      ? 'bg-slate-700 text-slate-300 cursor-wait'
                      : 'bg-linear-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white hover:scale-105 ring-8 ring-blue-50 hover:ring-blue-100 shadow-blue-600/30'
                  )}
                >
                  {voiceState === 'TRANSCRIBING' ? (
                    <RefreshCw className="w-9 h-9 animate-spin text-white" />
                  ) : voiceState === 'RECORDING' ? (
                    <>
                      <div className="w-8 h-8 rounded-lg bg-white text-rose-600 flex items-center justify-center shadow-xs">
                        <div className="w-4 h-4 rounded-xs bg-rose-600" />
                      </div>
                      <span className="text-[10px] font-black uppercase mt-1 tracking-wider">
                        Stop
                      </span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-9 h-9 sm:w-10 sm:h-10 animate-bounce text-white" />
                      <span className="text-[10px] font-black uppercase mt-0.5 tracking-wider">
                        Tap to Speak
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Text & Timer */}
              <div className="space-y-1">
                {voiceState === 'RECORDING' ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                      <span>Recording Spoken Audio in {selectedLang}...</span>
                    </span>
                    <span className="font-mono text-xl font-black text-slate-800">
                      {formattedTimer}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Tap the red button when finished speaking.
                    </p>
                  </div>
                ) : voiceState === 'TRANSCRIBING' ? (
                  <div className="flex flex-col items-center gap-1 text-slate-700">
                    <span className="text-sm font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
                      Jan Sahayak AI transcribing speech in {selectedLang}...
                    </span>
                    <p className="text-xs text-slate-400">
                      Analyzing audio waveform and extracting grievance intent.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">
                      Tap the microphone and describe your issue
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try saying: <i>"{VOICE_LANG_PRESETS[selectedLang].transcript}"</i>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* =========================================================
              B. REVIEW & EDIT TRANSCRIPT ZONE
             ========================================================= */}
          {voiceState === 'REVIEW' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* AI Detection Banner */}
              <div className="p-4 bg-linear-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-emerald-900">
                        Speech Transcribed Successfully
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        98% AI Confidence Match
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Transcribed from spoken {selectedLang} audio recording.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-record Audio</span>
                </button>
              </div>

              {/* 1. Editable Transcript Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Editable Transcript (ଟ୍ରାନ୍ସକ୍ରିପ୍ଟ ସମ୍ପାଦନ କରନ୍ତୁ)</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    You can edit the text directly if needed
                  </span>
                </div>

                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={3}
                  className="text-sm font-medium leading-relaxed"
                  required
                />
              </div>

              {/* 2. Auto-Suggested Category */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Suggested Category (ସ୍ୱୟଂଚାଳିତ ଭାବେ ବର୍ଗୀକୃତ):
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                    AI Classified
                  </span>
                </div>

                {/* Category Pill Selector */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES_LIST.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5',
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-100'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        )}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Add Location & Evidence Expansion Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>Jurisdictional Location:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLocationInput(!showLocationInput)}
                      className="text-[11px] text-blue-600 hover:underline font-bold"
                    >
                      {showLocationInput ? 'Hide' : 'Edit Location'}
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">
                    {location}
                  </p>

                  {showLocationInput && (
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter street, landmark & ward"
                      className="mt-2 text-xs"
                    />
                  )}
                </div>

                {/* Evidence Attachments Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      <span>Attached Evidence ({evidenceList.length}):</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddPhotoEvidence}
                      className="text-[11px] text-purple-700 bg-purple-100/60 hover:bg-purple-100 font-bold px-2 py-0.5 rounded border border-purple-200 transition-colors"
                    >
                      + Add Photo
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {evidenceList.map((ev) => (
                      <span
                        key={ev.id}
                        className="inline-flex items-center gap-1 text-[11px] font-medium bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-700"
                      >
                        {ev.type === 'AUDIO' ? (
                          <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                        )}
                        <span>{ev.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Final Submit Button Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleReset}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  Record Again
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmitVoiceCase}
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="font-bold shadow-md px-8 text-base bg-blue-600 hover:bg-blue-700"
                >
                  Submit Voice Grievance
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      )}
    </div>
  );
};
