import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Tag,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Search,
  RefreshCw,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AdminCategoryItem {
  id: string;
  name: string;
  code: string;
  slaDays: number;
  autoDepartment: string;
  description: string;
  active: boolean;
  casesLoggedCount: number;
}

const INITIAL_CATEGORIES: AdminCategoryItem[] = [
  {
    id: 'cat-01',
    name: 'Water & Electricity',
    code: 'WTR-ELEC',
    slaDays: 3,
    autoDepartment: 'Municipal Water Supply & Sanitation',
    description: 'Pipeline leakages, water contamination, low pressure, transformer sparks, and power blackouts.',
    active: true,
    casesLoggedCount: 42,
  },
  {
    id: 'cat-02',
    name: 'Roads & Sanitation',
    code: 'RDS-SNT',
    slaDays: 5,
    autoDepartment: 'Public Works & Roads (PWD)',
    description: 'Potholes, asphalt damage, open manholes, uncollected garbage, and sewer overflow.',
    active: true,
    casesLoggedCount: 38,
  },
  {
    id: 'cat-03',
    name: 'Government Service',
    code: 'GOV-SRV',
    slaDays: 7,
    autoDepartment: 'Revenue & Land Records',
    description: 'Ration card delays, caste/income certificates, pension disbursements, and land record updates.',
    active: true,
    casesLoggedCount: 19,
  },
  {
    id: 'cat-04',
    name: 'Local / Civic Issue',
    code: 'LCL-CIVIC',
    slaDays: 4,
    autoDepartment: 'Urban Development & Housing (PMAY)',
    description: 'Illegal encroachment, street lighting failure, stray animal menace, and park maintenance.',
    active: true,
    casesLoggedCount: 25,
  },
  {
    id: 'cat-05',
    name: 'Public Health & Sanitation',
    code: 'HLTH-SNT',
    slaDays: 2,
    autoDepartment: 'Public Health & Family Welfare',
    description: 'Mosquito fogging, hospital hygiene issues, vaccination access, and food safety inspection.',
    active: true,
    casesLoggedCount: 14,
  },
];

const DEPARTMENTS = [
  'Municipal Water Supply & Sanitation',
  'Public Works & Roads (PWD)',
  'Electricity & Power Distribution (DISCOM)',
  'Social Welfare & Pensions',
  'Urban Development & Housing (PMAY)',
  'Public Health & Family Welfare',
  'Revenue & Land Records',
  'Food, Civil Supplies & Consumer Affairs',
];

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(() => {
    const saved = localStorage.getItem('jansahayak_admin_categories_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CATEGORIES;
      }
    }
    return INITIAL_CATEGORIES;
  });

  const saveCategories = (newCats: AdminCategoryItem[]) => {
    setCategories(newCats);
    localStorage.setItem('jansahayak_admin_categories_v1', JSON.stringify(newCats));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DISABLED'>('ALL');

  // Create & Edit Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<AdminCategoryItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlaDays, setFormSlaDays] = useState(3);
  const [formDept, setFormDept] = useState(DEPARTMENTS[0]);
  const [formDesc, setFormDesc] = useState('');

  const filteredCategories = categories.filter((c) => {
    if (statusFilter === 'ACTIVE' && !c.active) return false;
    if (statusFilter === 'DISABLED' && c.active) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchDept = c.autoDepartment.toLowerCase().includes(q);
      const matchCode = c.code.toLowerCase().includes(q);
      if (!matchName && !matchDept && !matchCode) return false;
    }
    return true;
  });

  const handleToggleActive = (id: string) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, active: !c.active } : c
    );
    saveCategories(updated);
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormSlaDays(3);
    setFormDept(DEPARTMENTS[0]);
    setFormDesc('');
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newCategory: AdminCategoryItem = {
      id: `cat-${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      code: formName.trim().slice(0, 4).toUpperCase() + '-GEN',
      slaDays: formSlaDays,
      autoDepartment: formDept,
      description: formDesc.trim() || 'Standard public grievance intake stream.',
      active: true,
      casesLoggedCount: 0,
    };

    saveCategories([...categories, newCategory]);
    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (cat: AdminCategoryItem) => {
    setEditCategory(cat);
    setFormName(cat.name);
    setFormSlaDays(cat.slaDays);
    setFormDept(cat.autoDepartment);
    setFormDesc(cat.description);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory || !formName.trim()) return;

    const updated = categories.map((c) =>
      c.id === editCategory.id
        ? {
            ...c,
            name: formName.trim(),
            slaDays: formSlaDays,
            autoDepartment: formDept,
            description: formDesc.trim(),
          }
        : c
    );

    saveCategories(updated);
    setEditCategory(null);
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Civic Grievance Categories & SLA Engine
              </h1>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {categories.length} Active Streams
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Configure grievance categories, target SLA turnaround days (1–30d), and automated department dispatch rules.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-2xs"
        >
          Add New Category
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3 bg-white">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search categories by name, code, or assigned department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-purple-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="DISABLED">Disabled Only</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => (
          <Card
            key={cat.id}
            className="border border-slate-200 shadow-2xs p-5 bg-white flex flex-col justify-between space-y-4 hover:shadow-md hover:border-purple-200 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    {cat.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                </div>

                <button
                  onClick={() => handleToggleActive(cat.id)}
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer',
                    cat.active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  )}
                >
                  {cat.active ? 'Active' : 'Disabled'}
                </button>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Default Department:</span>
                  <span className="font-bold text-slate-900 text-right truncate max-w-[170px]">
                    {cat.autoDepartment}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Target SLA:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {cat.slaDays} Days ({cat.slaDays * 24}h)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bottom Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                <strong>{cat.casesLoggedCount}</strong> cases logged
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(cat)}
                  leftIcon={<Edit2 className="w-3 h-3 text-purple-600" />}
                  className="text-[11px] font-bold h-7 px-2.5 bg-white hover:bg-purple-50"
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleToggleActive(cat.id)}
                  className={cn(
                    'text-[11px] font-bold h-7 px-2',
                    cat.active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                  )}
                >
                  {cat.active ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. CREATE CATEGORY MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Grievance Category"
        description="Define a new civic issue category, SLA turnaround target, and default routing department."
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Street Lighting & Electrical Hazards"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Target SLA (Days) *</label>
              <input
                type="number"
                required
                min={1}
                max={30}
                value={formSlaDays}
                onChange={(e) => setFormSlaDays(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Default Department</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Description & Scope</label>
            <textarea
              rows={3}
              placeholder="Detail what types of citizen grievances fall under this category..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold bg-purple-700 hover:bg-purple-800 text-white">
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. EDIT CATEGORY MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(editCategory)}
        onClose={() => setEditCategory(null)}
        title={`Edit Category: ${editCategory?.name}`}
        description="Update category name, SLA turnaround limits, and auto-dispatch rules."
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Category Name *</label>
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
              <label className="text-xs font-bold text-slate-700 uppercase">Target SLA (Days) *</label>
              <input
                type="number"
                required
                min={1}
                max={30}
                value={formSlaDays}
                onChange={(e) => setFormSlaDays(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Default Department</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Description</label>
            <textarea
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditCategory(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold bg-purple-700 hover:bg-purple-800 text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
