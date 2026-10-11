import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Timeline } from '../../components/ui/Timeline';
import { Textarea } from '../../components/ui/Textarea';
import { formatDate, formatDateTime, getRemainingSlaDays } from '../../utils/formatters';
import { getPriorityConfig } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Volume2,
  Star,
  CheckCircle2,
  Share2,
  Download,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Eye,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../utils/cn';

export const CaseDetailPage: React.FC = () => {
  const { caseId, id } = useParams<{ caseId?: string; id?: string }>();
  const activeId = caseId || id;
  const navigate = useNavigate();
  const { cases, rateCaseResolution, provideRequestedInformation } = useAppStore();

  const caseItem = cases.find((c) => c.id === activeId) || cases[0];
  const [rating, setRating] = useState<number>(caseItem?.citizenRating || 5);
  const [feedback, setFeedback] = useState<string>(caseItem?.citizenFeedback || '');
  const [feedbackSaved, setFeedbackSaved] = useState(!!caseItem?.citizenRating);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  // Clarification / Requested Information state
  const [clarificationText, setClarificationText] = useState('');
  const [clarificationDocName, setClarificationDocName] = useState('Meter_Reading_Photo_Ward14.jpg');
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [infoSubmittedSuccess, setInfoSubmittedSuccess] = useState(false);

  if (!caseItem) {
    return (
      <div className="p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Case Not Found</h3>
        <p className="text-xs text-slate-500">
          The requested case ID could not be located in your local storage.
        </p>
        <Button onClick={() => navigate('/citizen/cases')} variant="primary" size="sm">
          Back to My Cases
        </Button>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(caseItem.priority);
  const slaInfo = getRemainingSlaDays(caseItem.slaDeadline);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateCaseResolution(caseItem.id, rating, feedback);
    setFeedbackSaved(true);
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 } });
  };

  const handleClarificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationText.trim()) return;
    setIsSubmittingInfo(true);
    provideRequestedInformation(caseItem.id, clarificationText.trim(), clarificationDocName);
    setIsSubmittingInfo(false);
    setInfoSubmittedSuccess(true);
    setClarificationText('');
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setInfoSubmittedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/citizen/cases')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="text-slate-600 hover:text-slate-900 font-bold"
        >
          Back to My Cases
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Official PDF Receipt
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Case reference link copied to clipboard!');
            }}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Share Case
          </Button>
        </div>
      </div>

      {/* Main Case Summary Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                  {caseItem.id}
                </span>
                <StatusBadge status={caseItem.status} />
                <span
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full font-bold border',
                    priorityConfig.badge
                  )}
                >
                  {priorityConfig.label}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  Category: {caseItem.category}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {caseItem.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {caseItem.description}
              </p>
            </div>

            {/* SLA Timer Card */}
            <div className="lg:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Statutory SLA Target
              </span>
              <div className="text-lg font-black text-slate-900 mt-1">
                {caseItem.status === 'RESOLVED' || caseItem.status === 'CLOSED' ? (
                  <span className="text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-5 h-5" /> Resolved within SLA
                  </span>
                ) : slaInfo.isBreached ? (
                  <span className="text-rose-600 flex items-center justify-center gap-1">
                    <AlertTriangle className="w-5 h-5" /> SLA Breached
                  </span>
                ) : (
                  <span className="text-blue-700">{slaInfo.text}</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Resolution SLA: {caseItem.slaDays} Days
              </p>
            </div>
          </div>

          {/* Core Case Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Department</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{caseItem.department}</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Location & Ward</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{caseItem.ward}</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Lodged Date</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{formatDate(caseItem.submittedAt)}</span>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium">Citizen Complainant</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">{caseItem.citizen.name}</span>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main 2-Column Layout: Left (Animated Timeline & Evidence) / Right (Assigned Team & AI Triage) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Vertical Case Timeline & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Required: Information Request Banner (When Status is UNDER_INVESTIGATION) */}
          {caseItem.status === 'UNDER_INVESTIGATION' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-linear-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 border-amber-300 shadow-md">
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <HelpCircle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-amber-950">
                        Action Required: Department Inquiry
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                        Awaiting Your Reply
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 font-medium mt-0.5">
                      The assigned officer has paused field inspection pending the following clarification:
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 text-xs font-semibold text-slate-800 mb-4 shadow-2xs">
                  <p className="italic text-slate-700">
                    "{caseItem.timeline[caseItem.timeline.length - 1]?.comment || caseItem.timeline[caseItem.timeline.length - 1]?.description || 'Please provide specific landmark or updated photo of the site to deploy emergency repair crew.'}"
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    — Sent by {caseItem.timeline[caseItem.timeline.length - 1]?.actor.name} ({caseItem.timeline[caseItem.timeline.length - 1]?.actor.role})
                  </p>
                </div>

                {infoSubmittedSuccess ? (
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        Clarification Submitted Successfully!
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Field team has been notified. Investigation status updated to In Progress.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleClarificationSubmit} className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                        Your Response / Clarification *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Type clarification, updated street landmark, or meter reading number..."
                        value={clarificationText}
                        onChange={(e) => setClarificationText(e.target.value)}
                        className="w-full rounded-xl border border-amber-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all shadow-2xs"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-amber-900">Mock Attachment:</span>
                        <select
                          value={clarificationDocName}
                          onChange={(e) => setClarificationDocName(e.target.value)}
                          className="rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 font-medium shadow-2xs focus:outline-none"
                        >
                          <option value="Meter_Reading_Photo_Ward14.jpg">Meter_Reading_Photo_Ward14.jpg</option>
                          <option value="Property_Tax_Receipt_2026.pdf">Property_Tax_Receipt_2026.pdf</option>
                          <option value="Aadhaar_Address_Proof.pdf">Aadhaar_Address_Proof.pdf</option>
                          <option value="Site_Video_Proof.mp4">Site_Video_Proof.mp4</option>
                        </select>
                      </div>

                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSubmittingInfo || !clarificationText.trim()}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                      >
                        {isSubmittingInfo ? 'Sending...' : 'Submit Clarification to Officer'}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </motion.div>
          )}

          {/* Animated Vertical Timeline Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <Card className="p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Vertical Action & Redressal Timeline
                    </h3>
                    <p className="text-xs text-slate-500">
                      Step-by-step verified trail from submission to resolution.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {caseItem.timeline.length} Milestones Logged
                </span>
              </div>

              {/* Interactive Animated Vertical Timeline */}
              <Timeline items={caseItem.timeline} />
            </Card>
          </motion.div>

          {/* Attached Evidence & Media Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <Card className="p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Attached Evidence & Verification Documents
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {caseItem.evidence.length} Files Attached
                </span>
              </div>

              {caseItem.evidence.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No evidence files attached.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {caseItem.evidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between group hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                          {ev.type === 'IMAGE' ? (
                            <ImageIcon className="w-4 h-4 text-blue-600" />
                          ) : ev.type === 'AUDIO' ? (
                            <Volume2 className="w-4 h-4 text-orange-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{ev.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {ev.size} • {ev.type}
                          </p>
                          {ev.metadata?.geoTag && (
                            <span className="inline-block text-[9px] font-mono text-blue-700 bg-blue-100/60 px-1.5 py-0.2 rounded mt-1">
                              GPS: {ev.metadata.geoTag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Image Thumbnail Preview */}
                      {ev.type === 'IMAGE' && ev.url && ev.url !== '#' && (
                        <div
                          onClick={() => setSelectedPreviewImage(ev.url)}
                          className="relative mt-3 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group"
                        >
                          <img
                            src={ev.url}
                            alt={ev.name}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <Eye className="w-4 h-4" />
                            <span>Preview Full Photo</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Citizen Rating & Feedback (Shown if Resolved) */}
          {(caseItem.status === 'RESOLVED' || caseItem.status === 'CLOSED') && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <Card className="p-6 bg-linear-to-r from-emerald-50/50 via-teal-50/30 to-blue-50/50 border-emerald-200">
                <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Citizen Satisfaction Rating</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Rate your satisfaction with the field team's repair speed and communication.
                </p>

                {feedbackSaved ? (
                  <div className="p-4 bg-white rounded-xl border border-emerald-200 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">
                        Official Feedback Recorded ({rating} / 5 Stars)
                      </h5>
                      <p className="text-xs text-slate-600 mt-0.5">
                        "{feedback || caseItem.citizenFeedback || 'Prompt and satisfactory civic resolution.'}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Your Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <Textarea
                      placeholder="Share your feedback: Did the team inspect the site promptly? Was the issue fully resolved?"
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />

                    <Button type="submit" variant="success" size="sm" className="font-bold">
                      Submit Citizen Feedback
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column: Assigned Team & Diagnostic Panel */}
        <div className="space-y-6">
          {/* Assigned Team Card */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <Card className="p-5 border border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                Assigned Field Team
              </h4>

              {caseItem.assignedOfficer ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm border border-blue-200 shrink-0">
                      AE
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">
                        {caseItem.assignedOfficer.name}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {caseItem.assignedOfficer.designation}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold">{caseItem.assignedOfficer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{caseItem.assignedOfficer.email}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold">Automated AI Ward Routing</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Assigning to nearest Ward 14 Executive Field Engineer.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* AI Triaging Diagnostics */}
          {caseItem.aiAnalysis && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              <Card className="p-5 bg-linear-to-b from-indigo-50/50 to-white border-indigo-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Jan Sahayak AI Triage</span>
                  </h4>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                    {caseItem.aiAnalysis.confidenceScore}% Confidence
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {caseItem.aiAnalysis.summary}
                </p>

                <div className="space-y-2 pt-2 border-t border-indigo-100 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-500">Urgency Assessment:</span>
                    <span className="ml-1.5 font-bold text-amber-700">
                      {caseItem.aiAnalysis.sentiment}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-500">Extracted Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {caseItem.aiAnalysis.extractedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="bg-white border border-indigo-200 text-indigo-900 px-2 py-0.5 rounded text-[10px]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* District Helpline Help Card */}
          <div className="p-4 bg-blue-50 text-slate-800 rounded-2xl border border-blue-200/80 text-xs space-y-2">
            <h5 className="font-bold flex items-center gap-1.5 text-blue-900">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>Need Immediate Voice Update?</span>
            </h5>
            <p className="text-[11px] text-slate-600">
              Call the 24x7 Civic Toll-Free Line <b className="text-slate-800">1800-11-2026</b> with Case ID <b className="text-slate-800">{caseItem.id}</b>.
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedPreviewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden p-2">
            <img
              src={selectedPreviewImage}
              alt="Evidence Full View"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPreviewImage(null)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
