import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Building2,
  Plus,
  Edit2,
  Tag,
  Users,
  CheckCircle2,
  Phone,
  Mail,
  Search,
  RefreshCw,
  FolderKanban,
  Check,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AdminDepartmentItem {
  id: string;
  name: string;
  code: string;
  leadOfficer: string;
  contactPhone: string;
  contactEmail: string;
  assignedCategories: string[];
  activeCaseload: number;
  slaCompliance: string;
  headquarters: string;
}

const ALL_CATEGORIES = [
  'Water & Electricity',
  'Roads & Sanitation',
  'Government Service',
  'Local / Civic Issue',
  'Public Health & Sanitation',
  'Social Welfare & Pensions',
  'Urban Housing & Encroachment',
];

const INITIAL_DEPARTMENTS: AdminDepartmentItem[] = [
  {
    id: 'dept-001',
    name: 'Municipal Water Supply & Sanitation',
    code: 'WTR-SAN',
    leadOfficer: 'Er. Sachin Deshmukh (Asst. Executive Engineer)',
    contactPhone: '+91 94220 18833',
    contactEmail: 'water.cell@punemunicipal.gov.in',
    assignedCategories: ['Water & Electricity', 'Public Health & Sanitation'],
    activeCaseload: 28,
    slaCompliance: '96.2%',
    headquarters: 'Municipal Divisional HQ, Zone 4, Shivajinagar',
  },
  {
    id: 'dept-002',
    name: 'Public Works & Roads (PWD)',
    code: 'PWD-ROADS',
    leadOfficer: 'Er. Anita Kulkarni (Senior Road Inspector)',
    contactPhone: '+91 98811 55209',
    contactEmail: 'anita.kulkarni@pwd.gov.in',
    assignedCategories: ['Roads & Sanitation', 'Local / Civic Issue'],
    activeCaseload: 44,
    slaCompliance: '91.8%',
    headquarters: 'PWD Central Division, Senapati Bapat Road',
  },
  {
    id: 'dept-003',
    name: 'Electricity & Power Distribution (DISCOM)',
    code: 'DISCOM-PWR',
    leadOfficer: 'Er. Rajesh Sharma (Sub-Divisional Engineer)',
    contactPhone: '+91 94140 77312',
    contactEmail: 'rajesh.sharma@mahadiscom.in',
    assignedCategories: ['Water & Electricity', 'Local / Civic Issue'],
    activeCaseload: 16,
    slaCompliance: '98.0%',
    headquarters: 'DISCOM Zonal Substation, Kothrud',
  },
  {
    id: 'dept-004',
    name: 'Social Welfare & Pensions',
    code: 'SOC-WLF',
    leadOfficer: 'Vikas Jadhav (District Welfare Officer)',
    contactPhone: '+91 94225 99012',
    contactEmail: 'vikas.jadhav@socialwelfare.gov.in',
    assignedCategories: ['Government Service', 'Social Welfare & Pensions'],
    activeCaseload: 19,
    slaCompliance: '94.5%',
    headquarters: 'District Social Welfare Directorate, Collectorate Compound',
  },
  {
    id: 'dept-005',
    name: 'Revenue & Land Records',
    code: 'REV-LND',
    leadOfficer: 'Dr. Neha Rajvanshi, IAS (District Magistrate)',
    contactPhone: '+91 94140 10001',
    contactEmail: 'collector.office@nic.in',
    assignedCategories: ['Government Service'],
    activeCaseload: 8,
    slaCompliance: '99.1%',
    headquarters: 'Apex District Collectorate Complex',
  },
];

export const AdminDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<AdminDepartmentItem[]>(() => {
    const saved = localStorage.getItem('jansahayak_admin_depts_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_DEPARTMENTS;
      }
    }
    return INITIAL_DEPARTMENTS;
  });

  const saveDepartments = (newDepts: AdminDepartmentItem[]) => {
    setDepartments(newDepts);
    localStorage.setItem('jansahayak_admin_depts_v1', JSON.stringify(newDepts));
  };

  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editDept, setEditDept] = useState<AdminDepartmentItem | null>(null);
  const [assignCatDept, setAssignCatDept] = useState<AdminDepartmentItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formLead, setFormLead] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formHq, setFormHq] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const filteredDepartments = departments.filter((d) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchCode = d.code.toLowerCase().includes(q);
      const matchLead = d.leadOfficer.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchLead) return false;
    }
    return true;
  });

  const handleOpenCreate = () => {
    setFormName('');
    setFormCode('');
    setFormLead('');
    setFormPhone('');
    setFormEmail('');
    setFormHq('');
    setSelectedCats([ALL_CATEGORIES[0]]);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newDept: AdminDepartmentItem = {
      id: `dept-${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      code: formCode.trim() || formName.slice(0, 4).toUpperCase(),
      leadOfficer: formLead.trim() || 'Assigned Nodal Lead',
      contactPhone: formPhone.trim() || '+91 94000 00000',
      contactEmail: formEmail.trim() || 'dept@punemunicipal.gov.in',
      assignedCategories: selectedCats.length > 0 ? selectedCats : [ALL_CATEGORIES[0]],
      activeCaseload: 0,
      slaCompliance: '99.0%',
      headquarters: formHq.trim() || 'District Municipal Complex',
    };

    saveDepartments([...departments, newDept]);
    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (dept: AdminDepartmentItem) => {
    setEditDept(dept);
    setFormName(dept.name);
    setFormCode(dept.code);
    setFormLead(dept.leadOfficer);
    setFormPhone(dept.contactPhone);
    setFormEmail(dept.contactEmail);
    setFormHq(dept.headquarters);
    setSelectedCats(dept.assignedCategories);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDept || !formName.trim()) return;

    const updated = departments.map((d) =>
      d.id === editDept.id
        ? {
            ...d,
            name: formName.trim(),
            code: formCode.trim(),
            leadOfficer: formLead.trim(),
            contactPhone: formPhone.trim(),
            contactEmail: formEmail.trim(),
            headquarters: formHq.trim(),
            assignedCategories: selectedCats,
          }
        : d
    );

    saveDepartments(updated);
    setEditDept(null);
  };

  const handleToggleCategorySelection = (cat: string) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(selectedCats.filter((c) => c !== cat));
    } else {
      setSelectedCats([...selectedCats, cat]);
    }
  };

  const handleSaveAssignedCategories = () => {
    if (!assignCatDept) return;
    const updated = departments.map((d) =>
      d.id === assignCatDept.id ? { ...d, assignedCategories: selectedCats } : d
    );
    saveDepartments(updated);
    setAssignCatDept(null);
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Municipal Departments & Nodal Authority Setup
              </h1>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {departments.length} Municipal Bodies
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Create municipal departments, assign jurisdiction categories, and configure nodal officer responsibilities.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-2xs"
        >
          Add New Department
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 border border-slate-200 shadow-2xs space-y-3 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search departments by name, code, or nodal officer lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all shadow-2xs"
          />
        </div>
      </Card>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDepartments.map((dept) => (
          <Card
            key={dept.id}
            className="border border-slate-200 shadow-2xs p-5 bg-white flex flex-col justify-between space-y-4 hover:shadow-md hover:border-purple-200 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold border border-purple-200">
                    {dept.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{dept.name}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">SLA Compliance</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                    {dept.slaCompliance}
                  </span>
                </div>
              </div>

              {/* Nodal Officer & Contact */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Nodal Lead: {dept.leadOfficer}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {dept.contactPhone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {dept.contactEmail}
                  </span>
                </div>
              </div>

              {/* Assigned Categories Badges */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Tag className="w-3 h-3 text-purple-600" /> Assigned Categories ({dept.assignedCategories.length})
                  </span>
                  <button
                    onClick={() => {
                      setAssignCatDept(dept);
                      setSelectedCats(dept.assignedCategories);
                    }}
                    className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    Configure
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {dept.assignedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-800 border border-purple-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                Active Load: <strong>{dept.activeCaseload} work orders</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(dept)}
                  leftIcon={<Edit2 className="w-3 h-3 text-purple-600" />}
                  className="text-[11px] font-bold h-7 px-2.5 bg-white hover:bg-purple-50"
                >
                  Edit Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAssignCatDept(dept);
                    setSelectedCats(dept.assignedCategories);
                  }}
                  leftIcon={<Tag className="w-3 h-3 text-emerald-600" />}
                  className="text-[11px] font-bold h-7 px-2.5 bg-white hover:bg-emerald-50"
                >
                  Assign Categories
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. CREATE DEPARTMENT MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Register New Municipal Department"
        description="Add an administrative body, contact leadership, and assign grievance intake streams."
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Department Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Public Health & Vector Control Cell"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Department Code</label>
              <input
                type="text"
                placeholder="e.g. HLT-VEC"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Nodal Officer Lead *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rajesh Kute"
                value={formLead}
                onChange={(e) => setFormLead(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Contact Phone</label>
              <input
                type="text"
                placeholder="+91 94220 00000"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Contact Email</label>
              <input
                type="email"
                placeholder="dept@punemunicipal.gov.in"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Headquarters / Division Office</label>
            <input
              type="text"
              placeholder="e.g. Municipal Health Directorate, Zone 2"
              value={formHq}
              onChange={(e) => setFormHq(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold bg-purple-700 hover:bg-purple-800 text-white">
              Create Department
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. EDIT DEPARTMENT MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(editDept)}
        onClose={() => setEditDept(null)}
        title={`Edit Department: ${editDept?.name}`}
        description="Update contact details, leadership officer, and operational location."
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Department Name *</label>
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
              <label className="text-xs font-bold text-slate-700 uppercase">Department Code</label>
              <input
                type="text"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Nodal Officer Lead *</label>
              <input
                type="text"
                required
                value={formLead}
                onChange={(e) => setFormLead(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Contact Phone</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Contact Email</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setEditDept(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold bg-purple-700 hover:bg-purple-800 text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. ASSIGN CATEGORIES MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(assignCatDept)}
        onClose={() => setAssignCatDept(null)}
        title={`Assign Categories to ${assignCatDept?.name}`}
        description="Select which grievance intake streams should be routed to this municipal department."
        size="md"
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {ALL_CATEGORIES.map((cat) => {
              const isSelected = selectedCats.includes(cat);
              return (
                <label
                  key={cat}
                  onClick={() => handleToggleCategorySelection(cat)}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all',
                    isSelected
                      ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-600 text-purple-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  )}
                >
                  <span className="text-xs font-bold">{cat}</span>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md flex items-center justify-center border',
                      isSelected
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setAssignCatDept(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAssignedCategories}
              className="font-bold bg-purple-700 hover:bg-purple-800 text-white"
            >
              Save Category Assignments
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
