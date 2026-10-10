import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { WelfareScheme } from '../../types/scheme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  Gift,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  Check,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SchemesDiscoveryPage: React.FC = () => {
  const { schemes, applyForScheme, currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedScheme, setSelectedScheme] = useState<WelfareScheme | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const categories = [
    { value: 'ALL', label: 'All Schemes' },
    { value: 'FARMERS', label: 'Agriculture & Farmers' },
    { value: 'HEALTH', label: 'Health & Ayushman' },
    { value: 'HOUSING', label: 'Housing (PMAY)' },
    { value: 'PENSION', label: 'Senior Pensions' },
    { value: 'EMPLOYMENT', label: 'Micro-Credit & Loans' },
    { value: 'WOMEN_CHILD', label: 'Women & Child Welfare' },
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleApply = (schemeId: string) => {
    setIsApplying(true);
    setTimeout(() => {
      applyForScheme(schemeId);
      setIsApplying(false);
      setSelectedScheme(null);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Schemes Discovery Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              AI Profile Matched (Aadhaar + BPL NFSA)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Central & State Welfare Scheme Discovery
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Direct DBT subsidies and health insurance schemes automatically verified via your DigiLocker profile.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-900">1-Click Fast Track</span>
            <p className="text-[10px] text-slate-500">Zero physical paperwork</p>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search schemes by name, ministry, or benefit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} hoverable className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {scheme.matchScore}% Match
                </span>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {scheme.code}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                {scheme.name}
              </h4>
              <p className="text-[11px] text-orange-600 font-medium mb-2">
                {scheme.nameHi}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                {scheme.description}
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Direct Benefit Amount:
                </span>
                <span className="font-bold text-slate-900">{scheme.benefitAmount}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {scheme.applicationStatus === 'APPROVED' ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Enrolled
                  </span>
                ) : scheme.applicationStatus === 'SUBMITTED' ? (
                  <span className="text-blue-700 font-bold">In Review</span>
                ) : (
                  'Eligible (Not Applied)'
                )}
              </span>

              <Button
                variant={scheme.applicationStatus === 'APPROVED' ? 'outline' : 'primary'}
                size="sm"
                onClick={() => setSelectedScheme(scheme)}
              >
                {scheme.applicationStatus === 'APPROVED' ? 'View Sanction' : '1-Click Apply'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Scheme Application Modal */}
      {selectedScheme && (
        <Modal
          isOpen={!!selectedScheme}
          onClose={() => setSelectedScheme(null)}
          title={selectedScheme.name}
          description={selectedScheme.department}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
              <span className="font-bold">Sanction Benefit:</span> {selectedScheme.benefitAmount}
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-900 mb-2">Eligibility Criteria:</h5>
              <ul className="text-xs text-slate-600 space-y-1">
                {selectedScheme.eligibilityCriteria.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-900 mb-2">
                Auto-Attached DigiLocker Documents:
              </h5>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs space-y-1">
                <p className="font-bold text-blue-900 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Aadhaar e-KYC + Ration BPL + Bank Passbook verified</span>
                </p>
                <p className="text-[11px] text-blue-700">
                  Beneficiary: {currentUser.name} (DBT mapped to Aadhaar)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setSelectedScheme(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleApply(selectedScheme.id)}
                isLoading={isApplying}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                Submit Direct Application
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
