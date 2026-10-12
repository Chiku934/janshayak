import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OnboardingHeader } from '../../components/ui/OnboardingHeader';
import { useAppStore } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CitizenOtpLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setOnboardingPhone, triggerSmsSimulation, setRole } = useAppStore();

  const [phone, setPhone] = useState('9823144520');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (isOtpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setErrorMsg('');
    setIsOtpSent(true);
    setCountdown(30);
    const mockOtp = '481290';
    setOtpDigits(['4', '8', '1', '2', '9', '0']);

    // Trigger simulated phone SMS popup
    triggerSmsSimulation(
      `+91 ${phone}`,
      `[Govt OTP] ${mockOtp} is your Jan Sahayak verification code. Valid for 10 minutes. Do not share with anyone.`,
      'JAN SAHAYAK AUTH'
    );
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance focus to next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setOnboardingPhone(`+91 ${phone}`);
      setRole('CITIZEN');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        navigate('/citizen/profile');
      }, 1000);
    }, 900);
  };

  const handleDemoAutoFill = () => {
    setPhone('9823144520');
    setIsOtpSent(true);
    setCountdown(30);
    setOtpDigits(['4', '8', '1', '2', '9', '0']);
    triggerSmsSimulation(
      '+91 98231 44520',
      '[Govt OTP] 481290 is your Jan Sahayak verification code. Auto-filled for demonstration.',
      'JAN SAHAYAK AUTH'
    );
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        <OnboardingHeader
          currentStep={1}
          title="Citizen Mobile Verification"
          subtitle="Enter your 10-digit mobile number to receive a secure Government OTP."
        />

        <Card className="p-6 sm:p-8 shadow-md border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Passwordless Fast Login</span>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDemoAutoFill}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-orange-600" />}
              className="text-[11px] text-blue-700 bg-blue-50/60 border-blue-200 py-1 h-7"
            >
              Demo Auto-Fill
            </Button>
          </div>

          {!isOtpSent ? (
            /* Step A: Mobile Number Input */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Indian Mobile Number (ମୋବାଇଲ୍ ନମ୍ବର)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 pointer-events-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98231 44520"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-lg border border-slate-300 bg-white pl-20 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 tracking-wider shadow-2xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  We'll send a 6-digit OTP via official SMS gateway.
                </p>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded-md border border-rose-200">
                  {errorMsg}
                </p>
              )}

              <Button
                variant="primary"
                type="submit"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full font-bold shadow-xs"
              >
                Send Verification OTP
              </Button>
            </form>
          ) : (
            /* Step B: 6-Digit OTP Input */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Enter 6-Digit OTP sent to <span className="font-bold text-slate-900">+91 {phone}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* 6 OTP boxes */}
                <div className="flex justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-bold rounded-lg border border-slate-300 bg-white text-slate-900 shadow-2xs focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded-md border border-rose-200">
                  {errorMsg}
                </p>
              )}

              {/* Countdown / Resend */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  {countdown > 0 ? (
                    <span>Resend OTP in <b>00:{countdown < 10 ? `0${countdown}` : countdown}</b></span>
                  ) : (
                    <span className="text-slate-400">Didn't receive code?</span>
                  )}
                </span>

                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={() => handleSendOtp()}
                  className="font-semibold text-blue-600 hover:text-blue-800 disabled:text-slate-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  Resend OTP
                </button>
              </div>

              {isVerified ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-center gap-2 text-emerald-800 font-bold text-xs animate-in zoom-in-95">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>OTP Verified! Proceeding to Profile Setup...</span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  isLoading={isVerifying}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full font-bold shadow-xs"
                >
                  Verify & Continue
                </Button>
              )}
            </form>
          )}
        </Card>

        {/* Security Trust Footnote */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Secured by National Informatics Centre (NIC) e-Pramaan</span>
        </div>
      </motion.div>
    </div>
  );
};
