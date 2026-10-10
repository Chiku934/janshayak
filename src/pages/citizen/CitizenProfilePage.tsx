import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { maskAadhaar } from '../../utils/formatters';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Lock,
  Building,
  CheckCircle2,
  FileCheck,
  Smartphone,
} from 'lucide-react';

export const CitizenProfilePage: React.FC = () => {
  const { currentUser } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-600/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  UIDAI Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Citizen ID: <span className="font-mono font-bold text-slate-700">{currentUser.id}</span> • Member since Jan 2024
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Edit Preferences
            </Button>
          </div>
        </div>

        {/* KYC & Identity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              National Identity & Welfare Records
            </h4>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Aadhaar Number:</span>
                <span className="font-mono font-bold text-slate-900">
                  {maskAadhaar(currentUser.aadhaarMasked)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">PAN Card:</span>
                <span className="font-mono font-bold text-slate-900">
                  {currentUser.panMasked || 'ABCDE****F'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ration Card (NFSA):</span>
                <span className="font-mono font-bold text-slate-900">
                  {currentUser.rationCardNo || 'MH-PUN-BPL-88190'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Economic Category:</span>
                <span className="font-bold text-emerald-700">
                  {currentUser.incomeCategory || 'BPL (Below Poverty Line)'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact & Residential Ward
            </h4>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-bold">{currentUser.phone}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded ml-auto">
                  SMS Active
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{currentUser.email}</span>
              </div>

              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{currentUser.address.villageOrStreet}</p>
                  <p className="text-slate-500">
                    {currentUser.address.ward}, {currentUser.address.district}, {currentUser.address.state} - {currentUser.address.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
