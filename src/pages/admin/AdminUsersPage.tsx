import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';
import {
  Users,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Building2,
  Calendar,
  Shield,
  RefreshCw,
  MoreVertical,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { UserRole } from '../../types/user';

export interface ManagedUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  designation: string;
  department?: string;
  ward?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinedDate: string;
  isAadhaarVerified: boolean;
  activeCasesCount: number;
}

const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'usr-001',
    name: 'Dr. Neha Rajvanshi, IAS',
    role: 'ADMIN',
    email: 'collector.office@nic.in',
    phone: '+91 94140 10001',
    designation: 'District Magistrate & Collector',
    department: 'Revenue & Land Records',
    status: 'ACTIVE',
    joinedDate: '2024-06-15T00:00:00Z',
    isAadhaarVerified: true,
    activeCasesCount: 4,
  },
  {
    id: 'usr-002',
    name: 'Er. Sachin Deshmukh',
    role: 'CASE_MANAGER',
    email: 'sachin.deshmukh@punemunicipal.gov.in',
    phone: '+91 94220 18833',
    designation: 'Assistant Executive Engineer',
    department: 'Municipal Water Supply & Sanitation',
    status: 'ACTIVE',
    joinedDate: '2025-01-10T00:00:00Z',
    isAadhaarVerified: true,
    activeCasesCount: 14,
  },
  {
    id: 'usr-003',
    name: 'Er. Anita Kulkarni',
    role: 'CASE_MANAGER',
    email: 'anita.kulkarni@pwd.gov.in',
    phone: '+91 98811 55209',
    designation: 'Senior Road Inspector & PWD Lead',
    department: 'Public Works & Roads (PWD)',
    status: 'ACTIVE',
    joinedDate: '2025-02-18T00:00:00Z',
    isAadhaarVerified: true,
    activeCasesCount: 19,
  },
  {
    id: 'usr-004',
    name: 'Rameshwar Patil',
    role: 'CITIZEN',
    email: 'ramesh.patil88@gmail.com',
    phone: '+91 98231 44520',
    designation: 'Registered Citizen',
    ward: 'Ward 14 (Shivaji Nagar)',
    status: 'ACTIVE',
    joinedDate: '2026-03-01T00:00:00Z',
    isAadhaarVerified: true,
    activeCasesCount: 2,
  },
  {
    id: 'usr-005',
    name: 'Er. Rajesh Sharma',
    role: 'CASE_MANAGER',
    email: 'rajesh.sharma@mahadiscom.in',
    phone: '+91 94140 77312',
    designation: 'Sub-Divisional DISCOM Engineer',
    department: 'Electricity & Power Distribution (DISCOM)',
    status: 'ACTIVE',
    joinedDate: '2025-04-12T00:00:00Z',
    isAadhaarVerified: true,
    activeCasesCount: 8,
  },
  {
    id: 'usr-006',
    name: 'Sunil Gokhale',
    role: 'CITIZEN',
    email: 'sunil.gokhale@outlook.com',
    phone: '+91 98220 33419',
    designation: 'Resident / Citizen',
    ward: 'Ward 08 (Kothrud West)',
    status: 'ACTIVE',
    joinedDate: '2026-05-20T00:00:00Z',
    isAadhaarVerified: true,
    activeCasesCount: 1,
  },
  {
    id: 'usr-007',
    name: 'Vikas Jadhav',
    role: 'CASE_MANAGER',
    email: 'vikas.jadhav@socialwelfare.gov.in',
    phone: '+91 94225 99012',
    designation: 'District Welfare Officer',
    department: 'Social Welfare & Pensions',
    status: 'INACTIVE',
    joinedDate: '2024-11-05T00:00:00Z',
    isAadhaarVerified: false,
    activeCasesCount: 0,
  },
];

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>(() => {
    const saved = localStorage.getItem('jansahayak_admin_users_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const saveUsers = (newUsers: ManagedUser[]) => {
    setUsers(newUsers);
    localStorage.setItem('jansahayak_admin_users_v1', JSON.stringify(newUsers));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modals
  const [viewUser, setViewUser] = useState<ManagedUser | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('CASE_MANAGER');
  const [newDesignation, setNewDesignation] = useState('');
  const [newDepartment, setNewDepartment] = useState('Municipal Water Supply & Sanitation');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.toLowerCase().includes(q);
      const matchDesig = u.designation.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchDesig) return false;
    }
    return true;
  });

  const handleToggleStatus = (userId: string) => {
    const updated = users.map((u) =>
      u.id === userId ? { ...u, status: (u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE') as 'ACTIVE' | 'INACTIVE' } : u
    );
    saveUsers(updated);
    if (viewUser && viewUser.id === userId) {
      setViewUser({ ...viewUser, status: viewUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' });
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser: ManagedUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      role: newRole,
      email: newEmail.trim(),
      phone: newPhone.trim() || '+91 94000 00000',
      designation: newDesignation.trim() || (newRole === 'ADMIN' ? 'Administrator' : 'Department Officer'),
      department: newRole === 'CASE_MANAGER' ? newDepartment : undefined,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString(),
      isAadhaarVerified: true,
      activeCasesCount: 0,
    };

    saveUsers([newUser, ...users]);
    setIsAddUserOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewDesignation('');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            Administrator
          </span>
        );
      case 'CASE_MANAGER':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            Case Manager
          </span>
        );
      case 'CITIZEN':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Citizen
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Header Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                User Management & Access Controls
              </h1>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                {users.length} Users Registered
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage executive administrators, municipal case managers, field engineers, and verified citizens.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAddUserOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-2xs"
        >
          Add New User
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3 bg-white">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-9 pr-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-purple-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Administrator</option>
              <option value="CASE_MANAGER">Case Manager</option>
              <option value="CITIZEN">Citizen</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-purple-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('ALL');
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

      {/* Users Table */}
      <Card className="border border-slate-200 shadow-2xs overflow-hidden bg-white">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[850px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Department / Ward</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Active Cases</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* User Name & Avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-100 to-blue-100 text-purple-800 font-bold flex items-center justify-center text-xs border border-purple-200 shrink-0">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.isAadhaarVerified && (
                            <span title="Aadhaar Verified" className="inline-flex">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500">{user.designation}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>

                  {/* Contact Info */}
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">{user.email}</p>
                    <p className="text-[11px] text-slate-400">{user.phone}</p>
                  </td>

                  {/* Department / Ward */}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {user.department || user.ward || 'General Administration'}
                  </td>

                  {/* Status Toggle Button */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer',
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      )}
                    >
                      {user.status === 'ACTIVE' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Inactive
                        </>
                      )}
                    </button>
                  </td>

                  {/* Active Cases */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {user.activeCasesCount} Cases
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewUser(user)}
                        leftIcon={<Eye className="w-3.5 h-3.5 text-blue-600" />}
                        className="text-[11px] font-bold h-7 px-2.5 bg-white hover:bg-blue-50"
                      >
                        View User
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(user.id)}
                        className={cn(
                          'text-[11px] font-bold h-7 px-2',
                          user.status === 'ACTIVE' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                        )}
                      >
                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 1. VIEW USER MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(viewUser)}
        onClose={() => setViewUser(null)}
        title="User Profile & Access Inspection"
        description="Comprehensive profile, credential status, and access rights."
        size="md"
      >
        {viewUser && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-200 text-purple-900 font-black text-base flex items-center justify-center">
                  {viewUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{viewUser.name}</h3>
                  <p className="text-xs text-slate-500">{viewUser.designation}</p>
                </div>
              </div>
              <div>{getRoleBadge(viewUser.role)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Email Address</span>
                <p className="font-medium text-slate-900 truncate">{viewUser.email}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Phone Number</span>
                <p className="font-medium text-slate-900">{viewUser.phone}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Department / Unit</span>
                <p className="font-medium text-slate-900">{viewUser.department || viewUser.ward || 'General'}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Aadhaar KYC</span>
                <p className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Citizen ID
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant={viewUser.status === 'ACTIVE' ? 'outline' : 'outline'}
                size="sm"
                onClick={() => handleToggleStatus(viewUser.id)}
                className={cn(
                  'text-xs font-bold',
                  viewUser.status === 'ACTIVE' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                )}
              >
                {viewUser.status === 'ACTIVE' ? 'Deactivate User Account' : 'Activate User Account'}
              </Button>

              <Button size="sm" onClick={() => setViewUser(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 2. ADD USER MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New User Account"
        description="Register an executive administrator, case manager, or field engineer."
        size="md"
      >
        <form onSubmit={handleAddUserSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Er. Sunil Mahajan"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Email Address *</label>
              <input
                type="email"
                required
                placeholder="sunil.mahajan@gov.in"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Contact Phone</label>
              <input
                type="text"
                placeholder="+91 94220 00000"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">System Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="CASE_MANAGER">Case Manager</option>
                <option value="ADMIN">Administrator</option>
                <option value="CITIZEN">Citizen</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Official Designation</label>
              <input
                type="text"
                placeholder="e.g. Zonal Road Lead"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          {newRole === 'CASE_MANAGER' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Assigned Department</label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="Municipal Water Supply & Sanitation">Municipal Water Supply & Sanitation</option>
                <option value="Public Works & Roads (PWD)">Public Works & Roads (PWD)</option>
                <option value="Electricity & Power Distribution (DISCOM)">Electricity & Power Distribution (DISCOM)</option>
                <option value="Social Welfare & Pensions">Social Welfare & Pensions</option>
                <option value="Revenue & Land Records">Revenue & Land Records</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="font-bold bg-purple-700 hover:bg-purple-800 text-white">
              Create User Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
