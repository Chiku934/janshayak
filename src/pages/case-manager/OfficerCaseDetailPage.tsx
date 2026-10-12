import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CaseStatus } from '../../components/ui/CaseStatus';
import { Timeline } from '../../components/ui/Timeline';
import { CaseActionModal } from '../../features/cases/CaseActionModal';
import { formatDate, formatDateTime, getRemainingSlaDays } from '../../utils/formatters';
import { getPriorityConfig } from '../../utils/helpers';
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
  Image,
  Send,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const OfficerCaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cases } = useAppStore();

  const caseItem = cases.find((c) => c.id === id) || cases[0];
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  if (!caseItem) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-bold">Case not found</h3>
        <Button onClick={() => navigate('/officer/queue')} className="mt-4">
          Back to Queue
        </Button>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(caseItem.priority);
  const slaInfo = getRemainingSlaDays(caseItem.slaDeadline);

  return (
    <div className="space-y-6">
      {/* Back bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/officer/queue')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Officer Queue
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsActionModalOpen(true)}
          leftIcon={<Zap className="w-4 h-4" />}
          className="font-bold shadow-xs"
        >
          Take Action / Update Case
        </Button>
      </div>

      {/* Main Case Details */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {caseItem.id}
              </span>
              <StatusBadge status={caseItem.status} odiaSubtext />
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${priorityConfig.badge}`}>
                {priorityConfig.label}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {caseItem.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {caseItem.description}
            </p>
          </div>

          <div className="lg:w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Statutory SLA Target
            </span>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {slaInfo.isBreached ? (
                <span className="text-rose-600">{slaInfo.text}</span>
              ) : (
                <span className="text-blue-700">{slaInfo.text}</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Deadline: {formatDateTime(caseItem.slaDeadline)}
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="py-4 border-b border-slate-100">
          <CaseStatus currentStatus={caseItem.status} />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 font-medium">Department</span>
            <p className="font-bold text-slate-900">{caseItem.department}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Ward & Location</span>
            <p className="font-bold text-slate-900">{caseItem.ward}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Citizen</span>
            <p className="font-bold text-slate-900">{caseItem.citizen.name} ({caseItem.citizen.phone})</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Aadhaar e-KYC</span>
            <p className="font-bold text-emerald-700">Verified ({caseItem.citizen.aadhaarMasked})</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Official Action Timeline & Inspection Logs</span>
            </h3>
            <Timeline items={caseItem.timeline} />
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Evidence & Inspection Photographs</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseItem.evidence.map((ev) => (
                <div key={ev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{ev.name}</p>
                      <p className="text-[10px] text-slate-400">{ev.size} • Verified</p>
                    </div>
                  </div>
                  {ev.type === 'IMAGE' && ev.url && ev.url !== '#' && (
                    <img
                      src={ev.url}
                      alt={ev.name}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200 mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Triage & Quick Workflow Actions */}
        <div className="space-y-6">
          {caseItem.aiAnalysis && (
            <Card className="p-5 bg-linear-to-b from-indigo-50/50 to-white border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Recommended Resolution Plan</span>
                </h4>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                  {caseItem.aiAnalysis.confidenceScore}% Score
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {caseItem.aiAnalysis.suggestedResolutionWorkflow.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Quick Officer Action
            </h4>
            <Button
              variant="primary"
              className="w-full mb-2"
              onClick={() => setIsActionModalOpen(true)}
            >
              Update Status / Issue Work Order
            </Button>
          </Card>
        </div>
      </div>

      {isActionModalOpen && (
        <CaseActionModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          caseItem={caseItem}
        />
      )}
    </div>
  );
};
