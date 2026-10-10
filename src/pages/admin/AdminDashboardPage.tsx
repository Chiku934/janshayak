import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import {
  FileText,
  Clock,
  Activity,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ChevronDown,
  UserPlus,
  Building2,
  FileSpreadsheet,
  Layers,
  AlertTriangle,
  UserCheck,
  Check,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  ExternalLink,
  Users,
  Zap,
  Plus,
  Bell,
  BarChart3,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { cases } = useAppStore();

  const [activeZone, setActiveZone] = useState('Ward 12, Hadi Market');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  const [activePage, setActivePage] = useState(1);

  // Quick Action Modals
  const [isAddUserModal, setIsAddUserModal] = useState(false);
  const [isAddDeptModal, setIsAddDeptModal] = useState(false);
  const [isAddServiceModal, setIsAddServiceModal] = useState(false);

  return (
    <div className="space-y-6 w-full pb-12">
      {/* ========================================================================= */}
      {/* 1. HERO HEADER BANNER (Exact Match to Screenshot) */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
        {/* Clean Subtle Enterprise Mesh Gradient Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-blue-50/50 via-slate-50/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            {/* Breadcrumb Pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
              Administrator Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              System overview, case management and operational insights.
            </p>
          </div>

          {/* Active Zone Selector Chip on Top Right */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-white/95 backdrop-blur-xs p-2.5 pr-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left leading-tight">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Active Zone
              </span>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span>{activeZone}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </p>
              <p className="text-[10px] text-slate-500 font-medium">Sundargarh, Odisha</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 4 KPI STAT CARDS WITH SPARKLINES (Exact Match) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Cases */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D68FF] flex items-center justify-center shrink-0 border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            {/* Blue Mini Wave Sparkline */}
            <svg className="w-24 h-10 text-blue-500 overflow-visible" viewBox="0 0 100 35" fill="none">
              <path
                d="M0 28 Q 20 25, 35 15 T 70 12 T 100 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="4" r="3" fill="#1D68FF" />
            </svg>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400">Total Cases</span>
            <div className="text-3xl font-black text-[#0B1528] tracking-tight mt-0.5">
              <AnimatedCounter value={1248} />
            </div>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <span>↑ +12% from last month</span>
            </p>
          </div>
        </div>

        {/* Card 2: Pending Triage */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
            {/* Orange Mini Wave Sparkline */}
            <svg className="w-24 h-10 text-amber-500 overflow-visible" viewBox="0 0 100 35" fill="none">
              <path
                d="M0 25 Q 25 30, 45 18 T 75 22 T 100 8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="8" r="3" fill="#F59E0B" />
            </svg>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400">Pending Triage</span>
            <div className="text-3xl font-black text-[#0B1528] tracking-tight mt-0.5">
              <AnimatedCounter value={86} />
            </div>
            <p className="text-xs text-amber-600 font-bold mt-1">
              Needs review
            </p>
          </div>
        </div>

        {/* Card 3: Active Assignments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Activity className="w-5 h-5" />
            </div>
            {/* Green Mini Wave Sparkline */}
            <svg className="w-24 h-10 text-emerald-500 overflow-visible" viewBox="0 0 100 35" fill="none">
              <path
                d="M0 28 Q 20 22, 40 26 T 70 14 T 100 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="6" r="3" fill="#10B981" />
            </svg>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400">Active Assignments</span>
            <div className="text-3xl font-black text-[#0B1528] tracking-tight mt-0.5">
              <AnimatedCounter value={320} />
            </div>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              In progress
            </p>
          </div>
        </div>

        {/* Card 4: Resolved This Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            {/* Purple Mini Wave Sparkline */}
            <svg className="w-24 h-10 text-purple-500 overflow-visible" viewBox="0 0 100 35" fill="none">
              <path
                d="M0 30 Q 30 28, 50 16 T 80 18 T 100 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="5" r="3" fill="#8B5CF6" />
            </svg>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400">Resolved This Month</span>
            <div className="text-3xl font-black text-[#0B1528] tracking-tight mt-0.5">
              <AnimatedCounter value={842} />
            </div>
            <p className="text-xs text-purple-600 font-bold mt-1">
              98.2% SLA compliance
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TWO-COLUMN MAIN GRID (72% Left / 28% Right Exact Proportion) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================================= */}
        {/* LEFT COLUMN (8 of 12 columns ~ 67-72%) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Row 1: Two Visual Charts Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Chart 1: Cases Trend Area/Line Chart */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#1D68FF]" />
                    <h2 className="text-sm font-bold text-slate-900">Cases Trend</h2>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-semibold">
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-[#1D68FF]" />
                      <span>Submitted</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span>Resolved</span>
                    </span>
                  </div>
                </div>

                {/* SVG Line / Area Graph */}
                <div className="w-full h-44 relative">
                  <svg viewBox="0 0 320 140" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1D68FF" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#1D68FF" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Y-Axis Grid Lines & Labels */}
                    <line x1="25" y1="10" x2="315" y2="10" stroke="#F1F5F9" strokeWidth="1" />
                    <text x="18" y="13" fill="#94A3B8" fontSize="8" textAnchor="end">200</text>

                    <line x1="25" y1="40" x2="315" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                    <text x="18" y="43" fill="#94A3B8" fontSize="8" textAnchor="end">150</text>

                    <line x1="25" y1="70" x2="315" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                    <text x="18" y="73" fill="#94A3B8" fontSize="8" textAnchor="end">100</text>

                    <line x1="25" y1="100" x2="315" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                    <text x="18" y="103" fill="#94A3B8" fontSize="8" textAnchor="end">50</text>

                    <line x1="25" y1="125" x2="315" y2="125" stroke="#E2E8F0" strokeWidth="1" />
                    <text x="18" y="128" fill="#94A3B8" fontSize="8" textAnchor="end">0</text>

                    {/* Blue Curve (Submitted): [70, 95, 65, 110, 100, 130] mapped to Y coordinates */}
                    {/* Apr(35), May(90), Jun(145), Jul(200), Aug(255), Sep(305) */}
                    <path
                      d="M35 85 L90 70 L145 55 L200 68 L255 45 L305 38 L305 125 L35 125 Z"
                      fill="url(#blueArea)"
                    />
                    <path
                      d="M35 85 L90 70 L145 55 L200 68 L255 45 L305 38"
                      fill="none"
                      stroke="#1D68FF"
                      strokeWidth="2"
                    />

                    {/* Green Curve (Resolved) */}
                    <path
                      d="M35 105 L90 90 L145 80 L200 92 L255 68 L305 52 L305 125 L35 125 Z"
                      fill="url(#greenArea)"
                    />
                    <path
                      d="M35 105 L90 90 L145 80 L200 92 L255 68 L305 52"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                    />

                    {/* Node Dots Blue */}
                    <circle cx="35" cy="85" r="2.5" fill="#1D68FF" />
                    <circle cx="90" cy="70" r="2.5" fill="#1D68FF" />
                    <circle cx="145" cy="55" r="2.5" fill="#1D68FF" />
                    <circle cx="200" cy="68" r="2.5" fill="#1D68FF" />
                    <circle cx="255" cy="45" r="2.5" fill="#1D68FF" />
                    <circle cx="305" cy="38" r="2.5" fill="#1D68FF" />

                    {/* Node Dots Green */}
                    <circle cx="35" cy="105" r="2.5" fill="#10B981" />
                    <circle cx="90" cy="90" r="2.5" fill="#10B981" />
                    <circle cx="145" cy="80" r="2.5" fill="#10B981" />
                    <circle cx="200" cy="92" r="2.5" fill="#10B981" />
                    <circle cx="255" cy="68" r="2.5" fill="#10B981" />
                    <circle cx="305" cy="52" r="2.5" fill="#10B981" />

                    {/* X-Axis Month Labels */}
                    <text x="35" y="137" fill="#64748B" fontSize="8" textAnchor="middle">Apr</text>
                    <text x="90" y="137" fill="#64748B" fontSize="8" textAnchor="middle">May</text>
                    <text x="145" y="137" fill="#64748B" fontSize="8" textAnchor="middle">Jun</text>
                    <text x="200" y="137" fill="#64748B" fontSize="8" textAnchor="middle">Jul</text>
                    <text x="255" y="137" fill="#64748B" fontSize="8" textAnchor="middle">Aug</text>
                    <text x="305" y="137" fill="#64748B" fontSize="8" textAnchor="middle">Sep</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Chart 2: Cases by Category Donut Chart */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <h2 className="text-sm font-bold text-slate-900">Cases by Category</h2>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold cursor-pointer">
                    <span>All Categories</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Donut Chart & Legend */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  {/* SVG Multi-Colored Donut */}
                  <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {/* Segment 1: Water & Electricity (28%) -> stroke-dasharray 28 72 */}
                      <circle
                        cx="18" cy="18" r="14" fill="transparent"
                        stroke="#3B82F6" strokeWidth="4.5"
                        strokeDasharray="28 72" strokeDashoffset="0"
                      />
                      {/* Segment 2: Roads & Sanitation (22%) -> stroke-dasharray 22 78 */}
                      <circle
                        cx="18" cy="18" r="14" fill="transparent"
                        stroke="#10B981" strokeWidth="4.5"
                        strokeDasharray="22 78" strokeDashoffset="-28"
                      />
                      {/* Segment 3: Govt Service (18%) */}
                      <circle
                        cx="18" cy="18" r="14" fill="transparent"
                        stroke="#F59E0B" strokeWidth="4.5"
                        strokeDasharray="18 82" strokeDashoffset="-50"
                      />
                      {/* Segment 4: Public Health (12%) */}
                      <circle
                        cx="18" cy="18" r="14" fill="transparent"
                        stroke="#8B5CF6" strokeWidth="4.5"
                        strokeDasharray="12 88" strokeDashoffset="-68"
                      />
                      {/* Segment 5: Urban Dev (10%) */}
                      <circle
                        cx="18" cy="18" r="14" fill="transparent"
                        stroke="#EC4899" strokeWidth="4.5"
                        strokeDasharray="10 90" strokeDashoffset="-80"
                      />
                      {/* Segment 6: Others (10%) */}
                      <circle
                        cx="18" cy="18" r="14" fill="transparent"
                        stroke="#F97316" strokeWidth="4.5"
                        strokeDasharray="10 90" strokeDashoffset="-90"
                      />
                    </svg>
                    {/* Center Text inside Donut */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-base font-black text-slate-900 leading-none">1,248</span>
                      <span className="text-[9px] text-slate-400 font-bold mt-0.5">Total Cases</span>
                    </div>
                  </div>

                  {/* Right Legend */}
                  <div className="flex-1 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                        <span>Water & Electricity</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span>Roads & Sanitation</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono">22%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        <span>Government Service</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono">18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                        <span>Public Health</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono">12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                        <span>Urban Development</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono">10%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                        <span>Others</span>
                      </span>
                      <span className="font-bold text-slate-900 font-mono">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Recent Cases Table (Exact Match to Reference UI) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1D68FF]" />
                <h2 className="text-sm font-bold text-slate-900">Recent Cases</h2>
              </div>

              <Link
                to="/admin/cases"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All Cases</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-[#F8FAFC] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Case ID</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">SLA</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">JS-2026-8942</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Water Pipeline Burst</td>
                    <td className="py-3.5 px-4 text-slate-600">Water & Electricity</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                        High
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        Triaged
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-slate-500">7 Oct 2026</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        2d left
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate('/admin/cases/JS-2026-8942')}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">JS-2026-8610</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Transformer Sparking</td>
                    <td className="py-3.5 px-4 text-slate-600">Electricity</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                        Critical
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                        Escalated
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">Collectorate</td>
                    <td className="py-3.5 px-4 text-slate-500">7 Oct 2026</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                        Breached
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate('/admin/cases/JS-2026-8610')}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">JS-2026-7761</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Road Repair</td>
                    <td className="py-3.5 px-4 text-slate-600">Roads & Sanitation</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        Medium
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        In Progress
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">Field Team</td>
                    <td className="py-3.5 px-4 text-slate-500">6 Oct 2026</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        4d left
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate('/admin/cases/JS-2026-7761')}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">JS-2026-7450</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Street Light Issue</td>
                    <td className="py-3.5 px-4 text-slate-600">Civic Issue</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        Medium
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        Assigned
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">Er. Amit Shah</td>
                    <td className="py-3.5 px-4 text-slate-500">6 Oct 2026</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        6d left
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate('/admin/cases/JS-2026-7450')}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">JS-2026-7201</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Drainage Overflow</td>
                    <td className="py-3.5 px-4 text-slate-600">Public Health</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                        High
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Resolved
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-slate-500">5 Oct 2026</td>
                    <td className="py-3.5 px-4 text-slate-400">—</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate('/admin/cases/JS-2026-7201')}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button className="p-1 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span>Showing 1–5 of 1,248 cases</span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={activePage === 1}
                  onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage(1)}
                  className={cn(
                    'w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs',
                    activePage === 1 ? 'bg-[#1D68FF] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                  )}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage(2)}
                  className={cn(
                    'w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs',
                    activePage === 2 ? 'bg-[#1D68FF] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                  )}
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage(3)}
                  className={cn(
                    'w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs',
                    activePage === 3 ? 'bg-[#1D68FF] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                  )}
                >
                  3
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage(4)}
                  className={cn(
                    'w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs',
                    activePage === 4 ? 'bg-[#1D68FF] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                  )}
                >
                  4
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage(5)}
                  className={cn(
                    'w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs',
                    activePage === 5 ? 'bg-[#1D68FF] text-white shadow-xs' : 'hover:bg-slate-100 text-slate-700'
                  )}
                >
                  5
                </button>
                <span className="px-1 text-slate-400 font-bold">...</span>
                <button
                  type="button"
                  onClick={() => setActivePage(250)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-xs"
                >
                  250
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage((p) => p + 1)}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (4 of 12 columns ~ 28-33%) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget 1: Quick Actions (2x2 Grid Exact Match) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-bold">⚡</span>
              <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Button 1: Manage Users */}
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="p-3.5 rounded-2xl bg-[#EFF6FF] hover:bg-blue-100 transition-colors flex flex-col items-center justify-center text-center gap-2 group cursor-pointer border border-blue-100"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#1D68FF] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Manage Users</span>
              </button>

              {/* Button 2: Add Department */}
              <button
                type="button"
                onClick={() => navigate('/admin/departments')}
                className="p-3.5 rounded-2xl bg-[#F0FDF4] hover:bg-emerald-100 transition-colors flex flex-col items-center justify-center text-center gap-2 group cursor-pointer border border-emerald-100"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#10B981] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Add Department</span>
              </button>

              {/* Button 3: Add Service */}
              <button
                type="button"
                onClick={() => navigate('/admin/services')}
                className="p-3.5 rounded-2xl bg-[#FFF7ED] hover:bg-amber-100 transition-colors flex flex-col items-center justify-center text-center gap-2 group cursor-pointer border border-amber-100"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#F59E0B] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Add Service</span>
              </button>

              {/* Button 4: View Audit Logs */}
              <button
                type="button"
                onClick={() => navigate('/admin/audit')}
                className="p-3.5 rounded-2xl bg-[#FAF5FF] hover:bg-purple-100 transition-colors flex flex-col items-center justify-center text-center gap-2 group cursor-pointer border border-purple-100"
              >
                <div className="w-8 h-8 rounded-xl bg-white text-[#8B5CF6] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">View Audit Logs</span>
              </button>
            </div>
          </div>

          {/* Widget 2: Recent Notifications (Exact Match) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1D68FF]" />
                <h2 className="text-sm font-bold text-slate-900">Recent Notifications</h2>
              </div>
              <Link
                to="/case-manager/notifications"
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {/* Notif 1: SLA Breach Alert */}
              <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>SLA Breach Alert</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">10 min ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    JS-2026-7581 has crossed SLA limit
                  </p>
                </div>
              </div>

              {/* Notif 2: New Case Submitted */}
              <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900">New Case Submitted</p>
                    <span className="text-[10px] text-slate-400 font-medium">34 min ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    JS-2026-8942 - Water Pipeline Burst
                  </p>
                </div>
              </div>

              {/* Notif 3: Case Assigned */}
              <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900">Case Assigned</p>
                    <span className="text-[10px] text-slate-400 font-medium">1 hour ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    JS-2026-8610 assigned to Field Team
                  </p>
                </div>
              </div>

              {/* Notif 4: Case Resolved */}
              <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900">Case Resolved</p>
                    <span className="text-[10px] text-slate-400 font-medium">2 hours ago</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    JS-2026-7201 has been resolved
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 3: Department Workload (Exact Match) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1D68FF]" />
                <h2 className="text-sm font-bold text-slate-900">Department Workload</h2>
              </div>
              <Link
                to="/admin/departments"
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3 pt-1">
              {/* 1. Water Supply */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Water Supply & Sanitation</span>
                  <span className="font-bold text-slate-900 font-mono">320</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#1D68FF]" style={{ width: '85%' }} />
                </div>
              </div>

              {/* 2. Electricity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Electricity & Power</span>
                  <span className="font-bold text-slate-900 font-mono">280</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#10B981]" style={{ width: '74%' }} />
                </div>
              </div>

              {/* 3. Roads */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Roads & Infrastructure</span>
                  <span className="font-bold text-slate-900 font-mono">210</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#F59E0B]" style={{ width: '56%' }} />
                </div>
              </div>

              {/* 4. Public Health */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Public Health</span>
                  <span className="font-bold text-slate-900 font-mono">160</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#8B5CF6]" style={{ width: '42%' }} />
                </div>
              </div>

              {/* 5. Urban Dev */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Urban Development</span>
                  <span className="font-bold text-slate-900 font-mono">98</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#64748B]" style={{ width: '26%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
