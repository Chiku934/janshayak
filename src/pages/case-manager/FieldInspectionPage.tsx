import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MobileFrame } from '../../components/ui/MobileFrame';
import { Camera, MapPin, CheckCircle2, UploadCloud, Smartphone, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import confetti from 'canvas-confetti';

export const FieldInspectionPage: React.FC = () => {
  const { cases, updateCaseStatus } = useAppStore();
  const activeCase = cases[0]; // Water burst or current case

  const [hasCapturedPhoto, setHasCapturedPhoto] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleResolveInspection = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      updateCaseStatus(
        activeCase.id,
        'RESOLVED',
        'Field repair successfully completed. 200mm ductile iron sleeve replaced and potable water pressure restored. Verified on site.'
      );
      setIsSubmitting(false);
      setCompleted(true);
      confetti({ particleCount: 70, spread: 60 });
    }, 900);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Field Inspection & Mobile Proof Capture Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Simulate the mobile inspector app used by on-ground field engineers with geotagged GPS camera.
          </p>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
          <Smartphone className="w-4 h-4" /> Field PWA Simulation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Field Inspector Mobile Simulation */}
        <div className="lg:col-span-5 flex justify-center">
          <MobileFrame title="Jan Sahayak Field Inspector">
            <div className="p-4 space-y-4 text-xs">
              <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-xs">
                <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block">
                  Active Dispatch Order
                </span>
                <h4 className="text-sm font-bold mt-0.5">{activeCase.id}</h4>
                <p className="text-[11px] text-blue-100 line-clamp-1">{activeCase.title}</p>
                <div className="mt-2 pt-2 border-t border-blue-500 flex items-center justify-between text-[10px]">
                  <span>Ward 14 (Shivaji Nagar)</span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded font-bold">CRITICAL</span>
                </div>
              </div>

              {/* Camera viewfinder box */}
              <div className="bg-slate-100 text-slate-800 rounded-2xl p-4 text-center relative overflow-hidden border border-slate-200">
                <div className="absolute top-2 left-2 bg-white/95 shadow-2xs backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-emerald-700 border border-slate-200 flex items-center gap-1 font-bold">
                  <MapPin className="w-2.5 h-2.5 text-emerald-600" /> 18.5314° N, 73.8446° E
                </div>

                <img
                  src="https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80"
                  alt="Inspection site"
                  className="w-full h-44 object-cover rounded-xl mt-4 mb-3 border border-slate-200"
                />

                <p className="text-[10px] text-slate-500 font-medium">
                  Site photo captured • Timestamp: {new Date().toLocaleTimeString()}
                </p>
              </div>

              {/* Action */}
              {completed ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="font-bold">Case Resolved on Site!</p>
                  <p className="text-[10px] text-emerald-700">Citizen SMS confirmation dispatched.</p>
                </div>
              ) : (
                <button
                  onClick={handleResolveInspection}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Uploading & Notifying...' : 'Submit Resolution & Notify Citizen'}</span>
                </button>
              )}
            </div>
          </MobileFrame>
        </div>

        {/* Right: Technical Explanation */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              How Jan Sahayak Prevents Ghost Repairs & Falsified Closures
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Traditional grievance redressal systems suffer from premature closure by field staff without actual repairs. Jan Sahayak enforces strict <b>proof-of-work protocols</b>:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Cryptographic GPS Geotag Lock</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Field photos can only be uploaded if the technician's mobile device is physically within 50 meters of the reported grievance coordinates.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">AI Visual Before/After Verification</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Computer vision analyzes repaired asphalt, closed pipeline trenches, or restored streetlights before status changes to RESOLVED.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">Citizen Confirmation SMS with 48h Reopen Window</h5>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Citizen receives high-resolution before/after images via SMS/WhatsApp with a 1-click option to dispute or rate the resolution.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
