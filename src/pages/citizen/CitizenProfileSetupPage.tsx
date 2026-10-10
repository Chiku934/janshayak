import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { OnboardingHeader } from '../../components/ui/OnboardingHeader';
import { useAppStore, SupportedLanguage } from '../../store/useAppStore';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Languages,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  CheckCircle2,
} from 'lucide-react';

const INDIAN_STATES = [
  'Maharashtra',
  'Uttar Pradesh',
  'Rajasthan',
  'Karnataka',
  'Delhi NCR',
  'Gujarat',
  'Tamil Nadu',
  'West Bengal',
  'Telangana',
  'Madhya Pradesh',
  'Bihar',
  'Punjab',
];

const DISTRICT_MAP: Record<string, string[]> = {
  Maharashtra: ['Pune District', 'Mumbai City', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Noida', 'Agra', 'Prayagraj'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer'],
  Karnataka: ['Bengaluru Urban', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
  'Delhi NCR': ['Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'New Delhi'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
  'West Bengal': ['Kolkata', 'Howrah', 'North 24 Parganas', 'Darjeeling'],
  Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
};

const LANGUAGE_OPTIONS: { value: SupportedLanguage; label: string }[] = [
  { value: 'en', label: 'English (Indian Standard)' },
  { value: 'hi', label: 'Hindi (हिन्दी)' },
  { value: 'mr', label: 'Marathi (मराठी)' },
  { value: 'bn', label: 'Bengali (বাংলা)' },
  { value: 'ta', label: 'Tamil (தமிழ்)' },
  { value: 'te', label: 'Telugu (తెలుగు)' },
  { value: 'gu', label: 'Gujarati (ગુજરાતી)' },
];

export const CitizenProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile, setLanguage } = useAppStore();

  const [name, setName] = useState(currentUser.name || 'Rameshwar Patil');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(currentUser.language || 'en');
  const [state, setState] = useState(currentUser.address?.state || 'Maharashtra');
  const [district, setDistrict] = useState(currentUser.address?.district || 'Pune District');
  const [locality, setLocality] = useState(currentUser.address?.ward || 'Ward 14 (Shivaji Nagar Sector 3)');
  const [streetAddress, setStreetAddress] = useState(
    currentUser.address?.villageOrStreet || 'Plot 42, Near Datta Mandir, Shivaji Nagar Lane 4'
  );
  const [pincode, setPincode] = useState(currentUser.address?.pincode || '411016');

  const districts = DISTRICT_MAP[state] || ['Central District', 'North District', 'South District'];

  const handleStateChange = (newState: string) => {
    setState(newState);
    const newDistricts = DISTRICT_MAP[newState] || ['Central District'];
    setDistrict(newDistricts[0]);
  };

  const handleDemoFill = () => {
    setName('Rameshwar Patil');
    setSelectedLang('mr');
    setState('Maharashtra');
    setDistrict('Pune District');
    setLocality('Ward 14 (Shivaji Nagar Sector 3)');
    setStreetAddress('Plot 42, Near Datta Mandir, Shivaji Nagar Lane 4');
    setPincode('411016');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserProfile({
      name,
      language: selectedLang,
      address: {
        villageOrStreet: streetAddress,
        ward: locality,
        district,
        state,
        pincode,
      },
    });
    setLanguage(selectedLang);

    navigate('/citizen/consent');
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
          currentStep={2}
          title="Citizen Profile & Locality"
          subtitle="Set your preferred communication language and jurisdictional ward."
        />

        <Card className="p-6 sm:p-8 shadow-md border border-slate-200">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Personal Details (नागरिक विवरण)</span>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDemoFill}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-orange-600" />}
              className="text-[11px] text-blue-700 bg-blue-50/60 border-blue-200 py-1 h-7"
            >
              Demo Auto-Fill
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Input
              label="Citizen Full Name (पूरा नाम)"
              placeholder="e.g. Rameshwar Patil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {/* Preferred Language */}
            <div>
              <Select
                label="Preferred Language (भाषा का चयन)"
                options={LANGUAGE_OPTIONS}
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Voice assistant prompts, SMS alerts & portal UI will adapt to this dialect.
              </p>
            </div>

            {/* State & District Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Select
                label="State / UT (राज्य)"
                options={INDIAN_STATES}
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
              />

              <Select
                label="District (ज़िला)"
                options={districts}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>

            {/* Locality & Pincode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Municipal Ward / Panchayat (वार्ड)"
                  placeholder="e.g. Ward 14 (Shivaji Nagar)"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
                  required
                />
              </div>

              <div>
                <Input
                  label="Pincode (पिन कोड)"
                  placeholder="411016"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>

            {/* Street Address */}
            <Input
              label="Street Address / Landmark (पता)"
              placeholder="Plot/Flat number, road or landmark"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/citizen/login')}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>

              <Button
                variant="primary"
                type="submit"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-xs"
              >
                Continue to Consent
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
