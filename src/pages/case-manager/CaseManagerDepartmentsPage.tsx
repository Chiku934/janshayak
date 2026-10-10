import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Building2,
  Phone,
  Mail,
  UserCheck,
  Zap,
  Truck,
  Landmark,
  HelpCircle,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

interface DepartmentCard {
  id: string;
  name: string;
  code: string;
  leadOfficer: string;
  leadDesignation: string;
  phone: string;
  email: string;
  activeCaseload: number;
  slaCompliance: string;
  zone: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const DEPARTMENTS: DepartmentCard[] = [
  {
    id: 'dept-1',
    name: 'Municipal Water Supply & Sanitation',
    code: 'WATER-SAN',
    leadOfficer: 'Er. Sachin Deshmukh',
    leadDesignation: 'Assistant Executive Engineer',
    phone: '+91 98230 11442',
    email: 'water.sanitation@pmc.gov.in',
    activeCaseload: 28,
    slaCompliance: '96.2%',
    zone: 'Zone 4 / Ward 14',
    icon: Zap,
    color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  },
  {
    id: 'dept-2',
    name: 'Public Works & Roads (PWD)',
    code: 'PWD-ROADS',
    leadOfficer: 'Er. Anita Kulkarni',
    leadDesignation: 'Senior PWD Lead',
    phone: '+91 98230 55210',
    email: 'pwd.roads@pmc.gov.in',
    activeCaseload: 44,
    slaCompliance: '91.8%',
    zone: 'Zone 4 (East & Central)',
    icon: Truck,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    id: 'dept-3',
    name: 'Electricity & Power Distribution (DISCOM)',
    code: 'DISCOM-PWR',
    leadOfficer: 'Er. Rajesh Sharma',
    leadDesignation: 'DISCOM Power Lead',
    phone: '+91 98231 77890',
    email: 'power.dispatch@pmc.gov.in',
    activeCaseload: 16,
    slaCompliance: '98.0%',
    zone: 'District Sub-grid 02',
    icon: Zap,
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    id: 'dept-4',
    name: 'Social Welfare & Pensions',
    code: 'SOC-WELFARE',
    leadOfficer: 'Vikas Jadhav',
    leadDesignation: 'Welfare Nodal Director',
    phone: '+91 98232 44100',
    email: 'social.welfare@pmc.gov.in',
    activeCaseload: 19,
    slaCompliance: '94.5%',
    zone: 'Collectorate HQ',
    icon: Landmark,
    color: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  {
    id: 'dept-5',
    name: 'Revenue & Land Records',
    code: 'REV-LAND',
    leadOfficer: 'Dr. Neha Rajvanshi, IAS',
    leadDesignation: 'District Magistrate & Collector',
    phone: '+91 98233 99001',
    email: 'collector.pune@nic.in',
    activeCaseload: 8,
    slaCompliance: '99.1%',
    zone: 'Apex Collectorate',
    icon: ShieldCheck,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'dept-6',
    name: 'Urban Development & Housing (PMAY)',
    code: 'URBAN-DEV',
    leadOfficer: 'Er. Sandeep Borde',
    leadDesignation: 'Chief Town Planner',
    phone: '+91 98234 11223',
    email: 'townplanning@pmc.gov.in',
    activeCaseload: 12,
    slaCompliance: '93.4%',
    zone: 'PMC Headquarters',
    icon: Building2,
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
];

export const CaseManagerDepartmentsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredDepts = DEPARTMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.leadOfficer.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Departmental Directory & Escalation Contacts
              </h1>
              <p className="text-xs text-slate-500">
                Nodal municipal departments, field leads, active caseload velocity & rapid dispatch channels.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search department or officer..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepts.map((dept) => {
          const Icon = dept.icon;

          return (
            <Card
              key={dept.id}
              className="p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full bg-white space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${dept.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {dept.code}
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-snug">
                    {dept.name}
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {dept.zone}
                  </p>
                </div>

                {/* Nodal Officer Contact */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{dept.leadOfficer}</p>
                      <p className="text-[10px] text-slate-500">{dept.leadDesignation}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{dept.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{dept.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Caseload</span>
                  <span className="font-bold text-slate-900">{dept.activeCaseload} Active</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">SLA Met</span>
                  <span className="font-bold text-emerald-700">{dept.slaCompliance}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
