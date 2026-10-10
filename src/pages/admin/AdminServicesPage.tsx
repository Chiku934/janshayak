import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAppStore } from '../../store/useAppStore';
import { WelfareScheme } from '../../types/scheme';
import {
  FileCheck2,
  Plus,
  Edit2,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Sparkles,
  Sliders,
  DollarSign,
  FileText,
  Check,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const AdminServicesPage: React.FC = () => {
  const { schemes } = useAppStore();
  const [managedSchemes, setManagedSchemes] = useState<WelfareScheme[]>(() => {
    const saved = localStorage.getItem('jansahayak_admin_schemes_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return schemes;
      }
    }
    return schemes;
  });

  const saveSchemes = (newList: WelfareScheme[]) => {
    setManagedSchemes(newList);
    localStorage.setItem('jansahayak_admin_schemes_v1', JSON.stringify(newList));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editScheme, setEditScheme] = useState<WelfareScheme | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<WelfareScheme['category']>('HOUSING');
  const [formDept, setFormDept] = useState('Urban Development & Housing (PMAY)');
  const [formBenefit, setFormBenefit] = useState('₹1,20,000 Direct Subsidy');
  const [formTarget, setFormTarget] = useState('BPL & EWS Urban Families');
  const [formDesc, setFormDesc] = useState('');
  const [formEligibility, setFormEligibility] = useState('Annual household income under ₹3 Lakh; No existing pucca house in India');
  const [formDocs, setFormDocs] = useState('Aadhaar Card, Ration Card, Bank Passbook, Land Title Proof');

  const filteredSchemes = managedSchemes.filter((s) => {
    if (categoryFilter !== 'ALL' && s.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchDept = s.department.toLowerCase().includes(q);
      const matchTarget = s.targetAudience.toLowerCase().includes(q);
      if (!matchName && !matchDept && !matchTarget) return false;
    }
    return true;
  });

  const handleToggleActive = (id: string) => {
    const updated = managedSchemes.map((s) =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    saveSchemes(updated);
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormCode('');
    setFormCategory('HOUSING');
    setFormDept('Urban Development & Housing (PMAY)');
    setFormBenefit('₹1,20,000 Direct Subsidy');
    setFormTarget('BPL & EWS Families');
    setFormDesc('');
    setFormEligibility('Annual household income under ₹3 Lakh; Resident of State');
    setFormDocs('Aadhaar Card, Ration Card, Bank Passbook');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newScheme: WelfareScheme = {
      id: `scheme-${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      nameHi: formName.trim(),
      code: formCode.trim() || 'GOV-SCH-' + Date.now().toString().slice(-3),
      category: formCategory,
      department: formDept,
      benefitAmount: formBenefit.trim(),
      targetAudience: formTarget.trim(),
      description: formDesc.trim() || 'Government direct benefit assistance scheme.',
      eligibilityCriteria: formEligibility.split(';').map((s) => s.trim()).filter(Boolean),
      requiredDocuments: formDocs.split(',').map((s) => s.trim()).filter(Boolean),
      isActive: true,
    };

    saveSchemes([newScheme, ...managedSchemes]);
    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (scheme: WelfareScheme) => {
    setEditScheme(scheme);
    setFormName(scheme.name);
    setFormCode(scheme.code);
    setFormCategory(scheme.category);
    setFormDept(scheme.department);
    setFormBenefit(scheme.benefitAmount);
    setFormTarget(scheme.targetAudience);
    setFormDesc(scheme.description);
    setFormEligibility(scheme.eligibilityCriteria.join('; '));
    setFormDocs(scheme.requiredDocuments.join(', '));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editScheme || !formName.trim()) return;

    const updated = managedSchemes.map((s) =>
      s.id === editScheme.id
        ? {
            ...s,
            name: formName.trim(),
            code: formCode.trim(),
            category: formCategory,
            department: formDept,
            benefitAmount: formBenefit.trim(),
            targetAudience: formTarget.trim(),
            description: formDesc.trim(),
            eligibilityCriteria: formEligibility.split(';').map((i) => i.trim()).filter(Boolean),
            requiredDocuments: formDocs.split(',').map((i) => i.trim()).filter(Boolean),
          }
        : s
    );

    saveSchemes(updated);
    setEditScheme(null);
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Public Assistance & Welfare Scheme Registry
              </h1>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {managedSchemes.length} Active Services
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Configure government welfare schemes, direct financial subsidies, and document eligibility requirements.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-2xs"
        >
          Add New Scheme
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3 bg-white">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search schemes by name, ministry, department, or beneficiary type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-purple-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="HOUSING">Housing & Urban</option>
              <option value="FARMERS">Farmers & Agriculture</option>
              <option value="PENSION">Social Pensions</option>
              <option value="HEALTH">Health & Ayushman</option>
              <option value="WOMEN_CHILD">Women & Child</option>
              <option value="EDUCATION">Education & Scholarships</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme) => (
          <Card
            key={scheme.id}
            className="border border-slate-200 shadow-2xs p-5 bg-white flex flex-col justify-between space-y-4 hover:shadow-md hover:border-purple-200 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                    {scheme.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{scheme.name}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{scheme.department}</p>
                </div>

                <button
                  onClick={() => handleToggleActive(scheme.id)}
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer shrink-0',
                    scheme.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  )}
                >
                  {scheme.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Financial Benefit:</span>
                  <span className="font-bold text-emerald-700">{scheme.benefitAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Group:</span>
                  <span className="font-semibold text-slate-800">{scheme.targetAudience}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Required Documents</span>
                <div className="flex flex-wrap gap-1">
                  {scheme.requiredDocuments.map((doc, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Direct Benefit Transfer (DBT)
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(scheme)}
                  leftIcon={<Edit2 className="w-3 h-3 text-purple-600" />}
                  className="text-[11px] font-bold h-7 px-2.5 bg-white hover:bg-purple-50"
                >
                  Configure
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleToggleActive(scheme.id)}
                  className={cn(
                    'text-[11px] font-bold h-7 px-2',
                    scheme.isActive ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                  )}
                >
                  {scheme.isActive ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. CREATE SCHEME MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Welfare Scheme"
        description="Configure public assistance programs, financial benefit amounts, and eligibility criteria."
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Scheme Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Pradhan Mantri Awas Yojana (Urban Assistance)"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Scheme Code</label>
              <input
                type="text"
                placeholder="e.g. PMAY-U-2026"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="HOUSING">Housing & Urban</option>
                <option value="FARMERS">Farmers & Agriculture</option>
                <option value="PENSION">Social Pensions</option>
                <option value="HEALTH">Health & Ayushman</option>
                <option value="WOMEN_CHILD">Women & Child</option>
                <option value="EDUCATION">Education & Scholarships</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Benefit Amount *</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹1,20,000 Direct Subsidy"
                value={formBenefit}
                onChange={(e) => setFormBenefit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Target Beneficiaries *</label>
              <input
                type="text"
                required
                placeholder="e.g. BPL & EWS Urban Families"
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Eligibility Criteria (semicolon-separated)</label>
            <textarea
              rows={2}
              placeholder="e.g. Annual income below ₹3L; Resident of district for 3+ years"
              value={formEligibility}
              onChange={(e) => setFormEligibility(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Required Documents (comma-separated)</label>
            <input
              type="text"
              placeholder="Aadhaar Card, Ration Card, Income Certificate, Bank Passbook"
              value={formDocs}
              onChange={(e) => setFormDocs(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold bg-purple-700 hover:bg-purple-800 text-white">
              Register Scheme
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. EDIT SCHEME MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(editScheme)}
        onClose={() => setEditScheme(null)}
        title={`Configure Scheme: ${editScheme?.name}`}
        description="Update eligibility rules, financial benefit numbers, and document checklist."
        size="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Scheme Title *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Benefit Amount</label>
              <input
                type="text"
                required
                value={formBenefit}
                onChange={(e) => setFormBenefit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Target Beneficiaries</label>
              <input
                type="text"
                required
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Eligibility Criteria (semicolon-separated)</label>
            <textarea
              rows={2}
              value={formEligibility}
              onChange={(e) => setFormEligibility(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Required Documents (comma-separated)</label>
            <input
              type="text"
              value={formDocs}
              onChange={(e) => setFormDocs(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditScheme(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold bg-purple-700 hover:bg-purple-800 text-white">
              Save Configuration
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
