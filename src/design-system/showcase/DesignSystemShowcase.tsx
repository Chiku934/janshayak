import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { Drawer } from '../../components/ui/Drawer';
import { Tabs } from '../../components/ui/Tabs';
import { Stepper } from '../../components/ui/Stepper';
import { Timeline } from '../../components/ui/Timeline';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Checkbox, Radio, Switch } from '../../components/ui/FormControls';
import { BottomNav } from '../../components/ui/BottomNav';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ToastItem, ToastMessage } from '../../components/ui/Toast';
import { GovEmblem } from '../../components/ui/GovEmblem';
import { colors, typography, spacing, radii, shadows } from '../tokens';
import { CaseStatusType } from '../../types/case';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Send,
  Eye,
  Layers,
  Smartphone,
  Tablet,
  Monitor,
  Bell,
  Shield,
  FileText,
  User,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SampleRow {
  id: string;
  dept: string;
  ward: string;
  sla: string;
  status: CaseStatusType;
}

export const DesignSystemShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<'right' | 'bottom'>('right');
  const [currentStep, setCurrentStep] = useState(1);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);

  // Toasts state for demo
  const [demoToasts, setDemoToasts] = useState<ToastMessage[]>([
    {
      id: 't-1',
      type: 'success',
      title: 'Aadhaar e-KYC Verified',
      message: 'DigiLocker token #UIDAI-4812 authenticated successfully.',
    },
  ]);

  const triggerToast = (type: 'success' | 'warning' | 'error' | 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      type,
      title:
        type === 'success'
          ? 'Grievance JS-2026-9041 Lodged'
          : type === 'warning'
          ? 'SLA Nearing Expiry (4h Remaining)'
          : type === 'error'
          ? 'Connection to PFMS Gateway Failed'
          : 'Officer Er. Sachin Assigned to Ward 14',
      message: 'Real-time alert dispatched to citizen mobile.',
    };
    setDemoToasts((prev) => [newToast, ...prev]);
    if (type === 'success') confetti({ particleCount: 40, spread: 60 });
  };

  const sampleTableData: SampleRow[] = [
    { id: 'JS-8942', dept: 'Water Supply & Sanitation', ward: 'Ward 14', sla: '48h', status: 'FIELD_INSPECTION' },
    { id: 'JS-8920', dept: 'Social Welfare & Pensions', ward: 'Ward 08', sla: '7d', status: 'ACTION_IN_PROGRESS' },
    { id: 'JS-8790', dept: 'Public Works & Roads', ward: 'Ward 03', sla: '5d', status: 'RESOLVED' },
  ];

  const tableColumns: Column<SampleRow>[] = [
    {
      header: 'Case ID',
      accessorKey: 'id',
      cell: (r: SampleRow) => <span className="font-mono font-bold text-blue-700">{r.id}</span>,
    },
    { header: 'Department', accessorKey: 'dept' },
    { header: 'Ward', accessorKey: 'ward' },
    { header: 'SLA Target', accessorKey: 'sla' },
    {
      header: 'Status',
      cell: (r: SampleRow) => <StatusBadge status={r.status} />,
    },
  ];

  const showcaseTabs = [
    {
      id: 'tokens',
      label: '1. Tokens (Color, Type, Space)',
      icon: <Layers className="w-4 h-4" />,
      content: (
        <div className="space-y-8">
          {/* Colors */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Color Palette & Contrast</h3>
            <p className="text-xs text-slate-500 mb-4">Enterprise civic light-theme colors meeting WCAG AAA standard.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow-xs">
                <span className="text-[11px] font-bold block">Primary Blue</span>
                <span className="font-mono text-[10px] opacity-80">#2563eb (600)</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-900 text-white shadow-xs">
                <span className="text-[11px] font-bold block">Gov Navy</span>
                <span className="font-mono text-[10px] opacity-80">#1e3a8a (900)</span>
              </div>
              <div className="p-3 rounded-xl bg-orange-600 text-white shadow-xs">
                <span className="text-[11px] font-bold block">National Saffron</span>
                <span className="font-mono text-[10px] opacity-80">#ea580c (600)</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-xs">
                <span className="text-[11px] font-bold block">Emerald Trust</span>
                <span className="font-mono text-[10px] opacity-80">#16a34a (600)</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-600 text-white shadow-xs">
                <span className="text-[11px] font-bold block">Authority Purple</span>
                <span className="font-mono text-[10px] opacity-80">#9333ea (600)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                <span className="text-[11px] font-bold block">App Canvas</span>
                <span className="font-mono text-[10px] opacity-70">#f8fafc (50)</span>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 mb-1">Typography Scale</h3>
            <div className="space-y-3 border-t border-slate-100 pt-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400">Display 2XL (48px / 800)</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Jan Sahayak Public Service</h1>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400">Heading 1 (24px / 700)</span>
                <h2 className="text-xl font-bold text-slate-900">Unified Citizen Grievance Redressal</h2>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400">Body Large (16px / 400)</span>
                <p className="text-base text-slate-700">Connecting 1.4B citizens with guaranteed SLA accountability.</p>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400">Caption & Overline (11px / 10px)</span>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">DIGILOCKER VERIFIED • IT ACT 2000 COMPLIANT</p>
              </div>
            </div>
          </Card>

          {/* Spacing & Elevation */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">4px Spacing Grid & Elevation Stack</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs text-center">
                <span className="text-xs font-bold block">Shadow 2xs</span>
                <span className="text-[10px] text-slate-400">Micro cards</span>
              </div>
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs text-center">
                <span className="text-xs font-bold block">Shadow xs</span>
                <span className="text-[10px] text-slate-400">Standard buttons</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-xs font-bold block">Shadow sm</span>
                <span className="text-[10px] text-slate-400">Standard cards</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-md text-center">
                <span className="text-xs font-bold block">Shadow md</span>
                <span className="text-[10px] text-slate-400">Hover states</span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xl text-center">
                <span className="text-xs font-bold block">Shadow xl</span>
                <span className="text-[10px] text-slate-400">Modals & Drawers</span>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'controls',
      label: '2. Buttons & Form Controls',
      icon: <Send className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          {/* Button Variants */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Button Variants & Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="saffron">Saffron (Voice)</Button>
              <Button variant="success">Success / Verify</Button>
              <Button variant="danger">Danger / Reject</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" isLoading>Loading</Button>
            </div>
          </Card>

          {/* Form Inputs */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">Inputs, Selects & Toggles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Citizen Full Name" placeholder="e.g. Rameshwar Patil" />
              <Input label="Aadhaar Number (Masked)" value="XXXX-XXXX-4812" disabled />
              <Select
                label="Public Department"
                options={[
                  'Municipal Water Supply & Sanitation',
                  'Electricity & Power Distribution (DISCOM)',
                  'Public Works & Roads (PWD)',
                ]}
              />
              <Textarea label="Grievance Details" placeholder="Describe issue location and severity..." />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100">
              <Checkbox
                label="Auto-attach DigiLocker Aadhaar e-KYC"
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
              <Switch
                label="Send SMS alerts in Hindi (हिन्दी)"
                checked={switchChecked}
                onChange={(e) => setSwitchChecked(e.target.checked)}
              />
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'feedback',
      label: '3. Alerts, Badges & Overlays',
      icon: <Bell className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          {/* Alerts */}
          <Card className="p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900 mb-2">Status Alerts</h3>
            <Alert variant="info" title="Aadhaar Link Status">
              Your biometric authentication is synchronized with the state citizen database.
            </Alert>
            <Alert variant="success" title="Water Repair Dispatched">
              Emergency unit #TR-4420 has arrived at Shivaji Chowk.
            </Alert>
            <Alert variant="warning" title="SLA Countdown Risk">
              4 hours remaining before automated escalation to District Magistrate.
            </Alert>
            <Alert variant="error" title="PFMS Bank IFSC Mismatch">
              Bank merger update required in treasury records before DBT credit.
            </Alert>
          </Card>

          {/* Badges & Status Pills */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Status Badges</h3>
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status="SUBMITTED" />
              <StatusBadge status="AI_TRIAGED" />
              <StatusBadge status="ASSIGNED" />
              <StatusBadge status="FIELD_INSPECTION" />
              <StatusBadge status="ACTION_IN_PROGRESS" />
              <StatusBadge status="RESOLVED" />
              <StatusBadge status="ESCALATED" />
            </div>
          </Card>

          {/* Overlays / Modals / Drawers */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Accessible Dialogs & Toasts</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Trigger Modal
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDrawerPosition('right');
                  setIsDrawerOpen(true);
                }}
              >
                Trigger Slide-Over Drawer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDrawerPosition('bottom');
                  setIsDrawerOpen(true);
                }}
              >
                Trigger Mobile Bottom Sheet
              </Button>
              <Button variant="success" onClick={() => triggerToast('success')}>
                Trigger Success Toast
              </Button>
              <Button variant="danger" onClick={() => triggerToast('error')}>
                Trigger Error Toast
              </Button>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'navigation',
      label: '4. Steppers, Tables & Empty States',
      icon: <Smartphone className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          {/* Stepper */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">Multi-step Wizard Progress</h3>
            <Stepper
              steps={[
                { id: 1, title: 'Intake', description: 'Voice / Form' },
                { id: 2, title: 'Department', description: 'AI Routing' },
                { id: 3, title: 'Evidence', description: 'DigiLocker' },
                { id: 4, title: 'Confirmation', description: 'SMS Dispatch' },
              ]}
              currentStep={currentStep}
              onStepClick={(s) => setCurrentStep(s)}
            />
            <div className="flex justify-center gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}>
                Previous Step
              </Button>
              <Button size="sm" variant="primary" onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}>
                Next Step
              </Button>
            </div>
          </Card>

          {/* Table */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-3">Accessible Data Table</h3>
            <DataTable columns={tableColumns} data={sampleTableData} />
          </Card>

          {/* Feedback States */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4">
              <EmptyState title="No Grievances Found" description="Try adjusting search terms." />
            </Card>
            <Card className="p-4">
              <LoadingState message="Connecting to UIDAI Gateway..." />
            </Card>
            <Card className="p-4">
              <ErrorState title="Service Temporarily Down" onRetry={() => alert('Retrying...')} />
            </Card>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Design System Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <GovEmblem size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Jan Sahayak Design System Foundation
              </h2>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete 20-point reusable component architecture • Responsive Mobile (360px) to Desktop (1280px+) • WCAG Accessible.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
            <Tablet className="w-3.5 h-3.5 text-slate-500" />
            <Monitor className="w-3.5 h-3.5 text-blue-600" />
            <span className="ml-1">All Viewports Responsive</span>
          </div>
        </div>
      </div>

      {/* Showcase Tabs */}
      <Tabs tabs={showcaseTabs} variant="boxed" defaultTab="tokens" />

      {/* Floating Demo Toasts */}
      <div className="fixed top-20 right-6 z-50 space-y-2 pointer-events-none">
        {demoToasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={(id) => setDemoToasts((prev) => prev.filter((t) => t.id !== id))}
          />
        ))}
      </div>

      {/* Demo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Accessible Government Dialog"
        description="Featuring smooth Framer Motion entrance, focus trap, and escape key listener."
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            This modal follows WAI-ARIA 1.2 modal dialog practices. All animations run with subtle enterprise easing.
          </p>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 font-medium">
            ✓ Backdrop blur • Responsive max-width • Keyboard Esc trapped
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Confirm Action
            </Button>
          </div>
        </div>
      </Modal>

      {/* Demo Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={drawerPosition}
        title={drawerPosition === 'bottom' ? 'Mobile Bottom Sheet Drawer' : 'Officer Work Order Drawer'}
        description="Adaptive slide-over drawer with gesture dismiss."
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            This drawer supports both right-side slide-over (desktop/tablet) and bottom-sheet expansion for compact mobile screens (360px–430px).
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsDrawerOpen(false)} className="w-full">
            Done
          </Button>
        </div>
      </Drawer>
    </div>
  );
};
