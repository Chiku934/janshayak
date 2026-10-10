import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatDate, formatDateTime } from '../../utils/formatters';
import {
  User,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileText,
  Key,
  Bell,
  Save,
  Shield,
  Activity,
} from 'lucide-react';

export const CaseManagerProfilePage: React.FC = () => {
  const { currentUser, cases } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone || '+91 98230 11442');
  const [emailAddress, setEmailAddress] = useState(currentUser.email || 'sachin.deshmukh@pmc.gov.in');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Statistics for the officer
  const myAssignedCases = cases.filter(
    (c) => c.assignedOfficer?.name.includes('Sachin') || c.assignedOfficer?.name.includes(currentUser.name)
  );
  const resolvedCount = myAssignedCases.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
  const inProgressCount = myAssignedCases.filter((c) => c.status === 'ACTION_IN_PROGRESS' || c.status === 'ASSIGNED').length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-200 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" title="Active Duty" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentUser.name}
              </h1>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Official Staff
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Assistant Executive Engineer • Municipal Water Supply & Sanitation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Saved
            </span>
          )}
          <Button
            size="sm"
            variant={isEditing ? 'outline' : 'primary'}
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-bold"
          >
            {isEditing ? 'Cancel' : 'Edit Contact Details'}
          </Button>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Official Nodal Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Official Assignment & Jurisdiction */}
          <Card className="p-6 border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Jurisdiction & Assigned Command
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 font-medium">Department</span>
                <p className="font-bold text-slate-900 mt-1">Municipal Water Supply & Sanitation</p>
                <p className="text-[11px] text-slate-500">Public Health Engineering Division</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 font-medium">Primary Ward Jurisdiction</span>
                <p className="font-bold text-slate-900 mt-1">Zone 4 / Ward 14 (Shivaji Nagar)</p>
                <p className="text-[11px] text-slate-500">Sub-jurisdiction: Model Colony, FC Road</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 font-medium">Employee / Badge ID</span>
                <p className="font-mono font-bold text-blue-700 mt-1">GOV-MH-PMC-ENG-4419</p>
                <p className="text-[11px] text-slate-500">Class-I Gazetted Engineering Cadre</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 font-medium">Security Clearance</span>
                <p className="font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Level-3 Operational Authority
                </p>
                <p className="text-[11px] text-slate-500">SLA Override & Escalation Authorized</p>
              </div>
            </div>
          </Card>

          {/* Card 2: Contact Information Form */}
          <Card className="p-6 border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              Official Communication Channels
            </h2>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Mobile (SMS Dispatches)</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Government Email (NIC / Gov)</label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Duty Phone</span>
                    <p className="font-bold text-slate-900">{phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Official Email</span>
                    <p className="font-bold text-slate-900">{emailAddress}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Performance & SLA Stats */}
        <div className="space-y-6">
          <Card className="p-6 border border-slate-200 shadow-2xs space-y-4 bg-white">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              SLA Performance
            </h2>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Statutory SLA Compliance
                </span>
                <p className="text-2xl font-black text-emerald-700">96.8%</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Rank #1 in Zone 4 Pune Municipal</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-lg font-black text-slate-900">{resolvedCount + 38}</p>
                  <span className="text-[10px] text-slate-500 font-semibold">Cases Resolved</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-lg font-black text-blue-700">{inProgressCount + 6}</p>
                  <span className="text-[10px] text-slate-500 font-semibold">Active Caseload</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Avg. Resolution Speed</span>
                  <span className="font-bold text-slate-800">2.1 Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Citizen Satisfaction</span>
                  <span className="font-bold text-emerald-700">4.8 / 5.0 Stars</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Shift Schedule */}
          <Card className="p-6 border border-slate-200 shadow-2xs space-y-3 bg-white">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Duty Schedule & Dispatch
            </h2>

            <div className="text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Current Shift</span>
                <span className="font-bold text-slate-900">09:00 - 18:00 IST</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Emergency Dispatch</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                  On-Call Available
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
