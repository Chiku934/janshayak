import { create } from 'zustand';

export interface VoiceMessage {
  id: string;
  sender: 'CITIZEN' | 'ASSISTANT';
  text: string;
  textHi?: string;
  audioDuration?: string;
  timestamp: string;
  detectedEntities?: {
    category?: string;
    location?: string;
    urgency?: string;
    language?: string;
  };
}

interface VoiceStore {
  isOpen: boolean;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  selectedLanguage: 'en-IN' | 'hi-IN' | 'mr-IN' | 'bn-IN' | 'ta-IN' | 'te-IN';
  activeScenarioId: string | null;
  conversation: VoiceMessage[];
  currentTranscript: string;
  
  // Actions
  openVoiceAssistant: (scenarioId?: string) => void;
  closeVoiceAssistant: () => void;
  setLanguage: (lang: VoiceStore['selectedLanguage']) => void;
  startListening: () => void;
  stopListening: () => void;
  addMessage: (msg: Omit<VoiceMessage, 'id' | 'timestamp'>) => void;
  resetConversation: () => void;
  simulateScenario: (scenarioType: 'WATER_CRISIS' | 'PENSION_HELP' | 'ELECTRICITY_HAZARD') => void;
}

export const useVoiceStore = create<VoiceStore>((set, get) => ({
  isOpen: false,
  isListening: false,
  isProcessing: false,
  isSpeaking: false,
  selectedLanguage: 'hi-IN',
  activeScenarioId: null,
  currentTranscript: '',
  conversation: [
    {
      id: 'vm-init',
      sender: 'ASSISTANT',
      text: 'Namaste! I am your Jan Sahayak Voice Assistant. How can I help you with government services or grievances today?',
      textHi: 'नमस्ते! मैं आपका जन सहायक वॉइस असिस्टेंट हूँ। आज मैं आपकी किस सरकारी सेवा या शिकायत में सहायता कर सकता हूँ?',
      timestamp: new Date().toISOString(),
    },
  ],

  openVoiceAssistant: (scenarioId) => set({ isOpen: true, activeScenarioId: scenarioId || null }),
  closeVoiceAssistant: () => set({ isOpen: false, isListening: false, isSpeaking: false }),
  setLanguage: (lang) => set({ selectedLanguage: lang }),
  startListening: () => set({ isListening: true }),
  stopListening: () => set({ isListening: false }),
  
  addMessage: (msg) => {
    const newMessage: VoiceMessage = {
      ...msg,
      id: `vm-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    set({ conversation: [...get().conversation, newMessage] });
  },

  resetConversation: () => {
    set({
      conversation: [
        {
          id: 'vm-init',
          sender: 'ASSISTANT',
          text: 'Namaste! I am your Jan Sahayak Voice Assistant. How can I help you today?',
          textHi: 'नमस्ते! मैं आपका जन सहायक वॉइस असिस्टेंट हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?',
          timestamp: new Date().toISOString(),
        },
      ],
      currentTranscript: '',
      isListening: false,
      isSpeaking: false,
    });
  },

  simulateScenario: (scenarioType) => {
    set({ isProcessing: true });
    
    if (scenarioType === 'WATER_CRISIS') {
      setTimeout(() => {
        get().addMessage({
          sender: 'CITIZEN',
          text: 'हमारे शिवाजी नगर वार्ड 14 में मुख्य पानी की पाइपलाइन कल से फटी हुई है, 400 घरों में पीने का पानी नहीं आ रहा है। कृपया तुरंत मदद करें।',
          textHi: 'हमारे शिवाजी नगर वार्ड 14 में मुख्य पानी की पाइपलाइन कल से फटी हुई है, 400 घरों में पीने का पानी नहीं आ रहा है।',
          detectedEntities: {
            category: 'Drinking Water & Sanitation',
            location: 'Shivaji Nagar, Ward 14',
            urgency: 'CRITICAL',
            language: 'Hindi / Marathi',
          },
        });

        setTimeout(() => {
          get().addMessage({
            sender: 'ASSISTANT',
            text: 'मैंने आपकी शिकायत समझ ली है। आपका मामला दर्ज कर लिया गया है (Ref #JS-2026-8942) और इसे नगर निगम जल आपूर्ति विभाग के सहायक अभियंता सचिन देशमुख को 48 घंटे के SLA के साथ अग्रेषित कर दिया गया है।',
            textHi: 'आपकी शिकायत दर्ज कर ली गई है (JS-2026-8942)। आपातकालीन मरम्मत दल रवाना किया गया है।',
          });
          set({ isProcessing: false });
        }, 1200);
      }, 800);
    } else if (scenarioType === 'PENSION_HELP') {
      setTimeout(() => {
        get().addMessage({
          sender: 'CITIZEN',
          text: 'मेरी दादी जी की वृद्धावस्था पेंशन पिछले 3 महीने से खाते में नहीं आई है। आधार कार्ड बैंक से लिंक है।',
          textHi: 'मेरी दादी जी की वृद्धावस्था पेंशन पिछले 3 महीने से खाते में नहीं आई है।',
          detectedEntities: {
            category: 'Social Welfare & Pensions',
            urgency: 'HIGH',
            language: 'Hindi',
          },
        });

        setTimeout(() => {
          get().addMessage({
            sender: 'ASSISTANT',
            text: 'हमने डिजी लॉकर रिकॉर्ड्स से जांच की है। बैंक विलय के कारण IFSC कोड अपडेट की आवश्यकता थी जिसे ट्रेजरी पोर्टल में सुधार दिया गया है। ₹4,500 का पिछला बकाया आज रात डीबीटी के माध्यम से ट्रांसफर कर दिया जाएगा।',
            textHi: 'ट्रेजरी आईएफएससी अपडेट पूर्ण। ₹4,500 की बकाया राशि आज रात हस्तांतरित होगी।',
          });
          set({ isProcessing: false });
        }, 1200);
      }, 800);
    } else {
      setTimeout(() => {
        get().addMessage({
          sender: 'CITIZEN',
          text: 'गर्ल्स स्कूल के पास ट्रांसफार्मर में बहुत चिंगारियां निकल रही हैं और तार बहुत नीचे लटके हैं।',
          textHi: 'गर्ल्स स्कूल के पास ट्रांसफार्मर में चिंगारियां निकल रही हैं, तुरंत लाइन बंद करें।',
          detectedEntities: {
            category: 'Electricity & Power Distribution',
            location: 'Near Govt Girls High School, Ward 19',
            urgency: 'CRITICAL (Safety Hazard)',
          },
        });

        setTimeout(() => {
          get().addMessage({
            sender: 'ASSISTANT',
            text: 'यह एक गंभीर सुरक्षा जोखिम है! विद्युत वितरण नियंत्रण कक्ष (DISCOM) को आपातकालीन अलार्म भेज दिया गया है और 24 घंटे की समयसीमा निर्धारित की गई है।',
          });
          set({ isProcessing: false });
        }, 1200);
      }, 800);
    }
  },
}));
