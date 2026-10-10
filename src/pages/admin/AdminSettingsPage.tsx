import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Settings,
  ShieldCheck,
  Bell,
  Clock,
  Save,
  CheckCircle2,
  Server,
  Key,
  Database,
  Lock,
  Smartphone,
  Cpu,
  RefreshCw,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [criticalSlaHours, setCriticalSlaHours] = useState('24');
  const [highSlaDays, setHighSlaDays] = useState('3');
  const [mediumSlaDays, setMediumSlaDays] = useState('7');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState('85');
  const [smsGatewayEnabled, setSmsGatewayEnabled] = useState(true);
  const [whatsappGatewayEnabled, setWhatsappGatewayEnabled] = useState(true);
  const [autoEscalateBreached, setAutoEscalateBreached] = useState(true);
  const [auditLogRetentionYears, setAuditLogRetentionYears] = useState('7');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              District Administration & System Settings
            </h1>
            <p className="text-xs text-slate-500">
              Statutory SLA timeframes, AI auto-classification thresholds & communications gateway parameters.
            </p>
          </div>
        </div>

        {isSaved && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Parameters Updated
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Statutory SLA Parameters */}
        <Card className="p-6 border border-slate-200 shadow-2xs space-y-4 bg-white">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-700" />
            Statutory Grievance Redressal SLA Timelines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Critical Priority SLA (Hours)
              </label>
              <input
                type="number"
                value={criticalSlaHours}
                onChange={(e) => setCriticalSlaHours(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-purple-100 focus:border-purple-600 font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">Water contamination, power grid sparks</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                High Priority SLA (Days)
              </label>
              <input
                type="number"
                value={highSlaDays}
                onChange={(e) => setHighSlaDays(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-purple-100 focus:border-purple-600 font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">Main road potholes, drainage block</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Medium / Standard SLA (Days)
              </label>
              <input
                type="number"
                value={mediumSlaDays}
                onChange={(e) => setMediumSlaDays(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-purple-100 focus:border-purple-600 font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">Pensions delay, certificate queries</p>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={autoEscalateBreached}
                onChange={(e) => setAutoEscalateBreached(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <span>Auto-escalate cases to District Collectorate upon statutory SLA breach</span>
            </label>
          </div>
        </Card>

        {/* Section 2: AI Classification & Triage */}
        <Card className="p-6 border border-slate-200 shadow-2xs space-y-4 bg-white">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-700" />
            AI Intake & Auto-Routing Threshold
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Minimum AI Department Routing Confidence (%)
              </label>
              <input
                type="number"
                value={aiConfidenceThreshold}
                onChange={(e) => setAiConfidenceThreshold(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-purple-100 focus:border-purple-600 font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">Below this confidence score, cases flag for manual verification.</p>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] text-purple-900 leading-relaxed">
              <span className="font-bold block mb-0.5">Bhashini Multilingual Speech Engine Active</span>
              Automatic real-time translation enabled for Hindi, Marathi, Bengali, Tamil, Telugu, and Gujarati.
            </div>
          </div>
        </Card>

        {/* Section 3: Notification Gateways */}
        <Card className="p-6 border border-slate-200 shadow-2xs space-y-4 bg-white">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-700" />
            Citizen Notification Channels & SMS Gateways
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <div>
                  <p className="font-bold text-slate-900">National SMS DLT Gateway (TRAI Compliant)</p>
                  <p className="text-[10px] text-slate-500">Sends instant registration, officer assignment & resolution tokens</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsGatewayEnabled}
                onChange={(e) => setSmsGatewayEnabled(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-bold text-slate-900">WhatsApp Citizen Notification Broadcast</p>
                  <p className="text-[10px] text-slate-500">Sends photo receipts and live milestone tracking links</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={whatsappGatewayEnabled}
                onChange={(e) => setWhatsappGatewayEnabled(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
            </label>
          </div>
        </Card>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 shadow-md"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Administrative Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};
