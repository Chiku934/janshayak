import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/FormControls';
import { OnboardingHeader } from '../../components/ui/OnboardingHeader';
import { useAppStore } from '../../store/useAppStore';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CitizenConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding, setConsentAgreed, currentUser } = useAppStore();

  const [termsAgreed, setTermsAgreed] = useState(true);
  const [dataSharingAgreed, setDataSharingAgreed] = useState(true);
  const [smsAgreed, setSmsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = termsAgreed && dataSharingAgreed;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed) return;

    setIsSubmitting(true);
    setConsentAgreed(true);

    setTimeout(() => {
      completeOnboarding();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
      setIsSubmitting(false);
      navigate('/citizen/home');
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg space-y-6"
      >
        <OnboardingHeader
          currentStep={3}
          title="Consent & Data Protection"
          subtitle="Review our statutory privacy guarantees and consent policies before proceeding."
        />

        <Card className="p-6 sm:p-8 shadow-md border border-slate-200">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
          </div>

          <form onSubmit={handleFinish} className="space-y-5">
            {/* Privacy Explanation Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-3 max-h-48 overflow-y-auto">
              <div>
                <h4 className="font-bold text-slate-900 mb-0.5">1. Purpose-Limited Data Collection</h4>
                <p className="leading-relaxed">
                  Your Aadhaar e-KYC, mobile number, and GPS location are used solely to triage, assign, and track the resolution of civic grievances by designated government engineers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-0.5">2. DigiLocker Document Security</h4>
                <p className="leading-relaxed">
                  Verified certificates (Ration card, Land records, Pension sanction orders) are cryptographically authenticated via Government of India national repositories with zero unauthorized third-party sharing.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-0.5">3. Multi-channel Public Communication</h4>
                <p className="leading-relaxed">
                  Automated bilingual notifications (SMS, WhatsApp, and Voice IVR) are transmitted strictly for grievance milestone status updates and statutory SLA countdown reminders.
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <Checkbox
                  label="I agree to the Jan Sahayak Terms of Public Service Delivery"
                  description="Accept statutory timelines, citizen grievance resolution charters, and appeal protocols."
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                />
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <Checkbox
                  label="I consent to sharing my grievance details & verified evidence with municipal field officers"
                  description="Allows assigned engineers to view geotagged photographs and contact you for on-ground inspection."
                  checked={dataSharingAgreed}
                  onChange={(e) => setDataSharingAgreed(e.target.checked)}
                />
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <Checkbox
                  label="Receive official updates on SMS and WhatsApp (+91 98231 44520)"
                  description="Real-time SMS tokens, field dispatch tracking, and SLA countdown alerts."
                  checked={smsAgreed}
                  onChange={(e) => setSmsAgreed(e.target.checked)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/citizen/profile')}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                Back
              </Button>

              <Button
                variant="success"
                type="submit"
                size="lg"
                disabled={!canProceed || isSubmitting}
                isLoading={isSubmitting}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="font-bold shadow-md flex-1 sm:flex-initial"
              >
                Complete Onboarding & Enter Home
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
