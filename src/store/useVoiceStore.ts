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
  selectedLanguage: 'en-IN' | 'or-IN' | 'hi-IN' | 'mr-IN' | 'bn-IN' | 'ta-IN' | 'te-IN';
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
  selectedLanguage: 'or-IN',
  activeScenarioId: null,
  currentTranscript: '',
  conversation: [
    {
      id: 'vm-init',
      sender: 'ASSISTANT',
      text: 'Namaste! I am your Jan Sahayak Voice Assistant. How can I help you with government services or grievances today?',
      textHi: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ଜନ ସହାୟକ ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କେଉଁ ସରକାରୀ ସେବା କିମ୍ବା ଅଭିଯୋଗରେ ସାହାଯ୍ୟ କରିପାରିବି?',
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
          textHi: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ଜନ ସହାୟକ ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କି ସାହାଯ୍ୟ କରିପାରିବି?',
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
          text: 'ଆମ ଶିବାଜୀ ନଗର ୱାର୍ଡ ୧୪ରେ ମୁଖ୍ୟ ପାଣି ପାଇପଲାଇନ ଗତକାଲିଠାରୁ ଫାଟିଯାଇଛି, ୪୦୦ ଘରେ ପିଇବା ପାଣି ଆସୁନାହିଁ। ଦୟାକରି ତୁରନ୍ତ ସାହାଯ୍ୟ କରନ୍ତୁ।',
          textHi: 'ଆମ ଶିବାଜୀ ନଗର ୱାର୍ଡ ୧୪ରେ ମୁଖ୍ୟ ପାଣି ପାଇପଲାଇନ ଗତକାଲିଠାରୁ ଫାଟିଯାଇଛି, ୪୦୦ ଘରେ ପିଇବା ପାଣି ଆସୁନାହିଁ।',
          detectedEntities: {
            category: 'Drinking Water & Sanitation',
            location: 'Shivaji Nagar, Ward 14',
            urgency: 'CRITICAL',
            language: 'Odia / English',
          },
        });

        setTimeout(() => {
          get().addMessage({
            sender: 'ASSISTANT',
            text: 'ମୁଁ ଆପଣଙ୍କ ଅଭିଯୋଗ ବୁଝିପାରିଲି। ଆପଣଙ୍କ ମାମଲା ପଞ୍ଜିକୃତ ହୋଇଛି (Ref #JS-2026-8942) ଏବଂ ଏହାକୁ ପୌରପାଳିକା ଜଳ ଯୋଗାଣ ବିଭାଗକୁ ୪୮ ଘଣ୍ଟାର SLA ସହିତ ପଠାଯାଇଛି।',
            textHi: 'ଆପଣଙ୍କ ଅଭିଯୋଗ ଦାଖଲ ହୋଇଛି (JS-2026-8942)। ଜରୁରୀକାଳୀନ ମରାମତି ଦଳ ପଠାଯାଇଛି।',
          });
          set({ isProcessing: false });
        }, 1200);
      }, 800);
    } else if (scenarioType === 'PENSION_HELP') {
      setTimeout(() => {
        get().addMessage({
          sender: 'CITIZEN',
          text: 'ମୋ ଜେଜେମାଙ୍କ ବାର୍ଦ୍ଧକ୍ୟ ପେନସନ ଗତ ୩ ମାସ ଧରି ଖାତାକୁ ଆସିନାହିଁ। ଆଧାର କାର୍ଡ ବ୍ୟାଙ୍କ ସହ ଲିଙ୍କ ଅଛି।',
          textHi: 'ମୋ ଜେଜେମାଙ୍କ ବାର୍ଦ୍ଧକ୍ୟ ପେନସନ ଗତ ୩ ମାସ ଧରି ଖାତାକୁ ଆସିନାହିଁ।',
          detectedEntities: {
            category: 'Social Welfare & Pensions',
            urgency: 'HIGH',
            language: 'Odia',
          },
        });

        setTimeout(() => {
          get().addMessage({
            sender: 'ASSISTANT',
            text: 'ଆମେ ଡିଜିଲକର ରେକର୍ଡରୁ ଯାଞ୍ଚ କରିଛୁ। ବ୍ୟାଙ୍କ ମିଶ୍ରଣ ଯୋଗୁଁ IFSC କୋଡ୍ ଅପଡେଟ୍ ଆବଶ୍ୟକ ଥିଲା ଯାହା ଟ୍ରେଜେରୀ ପୋର୍ଟାଲରେ ସଂଶୋଧନ କରାଯାଇଛି। ₹୪,୫୦୦ ବକେୟା ରାଶି ଆଜି ରାତିରେ DBT ମାଧ୍ୟମରେ ସ୍ଥାନାନ୍ତର କରାଯିବ।',
            textHi: 'ଟ୍ରେଜେରୀ IFSC ଅପଡେଟ୍ ସମ୍ପୂର୍ଣ୍ଣ। ₹୪,୫୦୦ ବକେୟା ରାଶି ଆଜି ରାତିରେ ସ୍ଥାନାନ୍ତରିତ ହେବ।',
          });
          set({ isProcessing: false });
        }, 1200);
      }, 800);
    } else {
      setTimeout(() => {
        get().addMessage({
          sender: 'CITIZEN',
          text: 'ବାଳିକା ଉଚ୍ଚ ବିଦ୍ୟାଳୟ ନିକଟରେ ଟ୍ରାନ୍ସଫର୍ମରରୁ ନିଆଁ ଝୁଲ ବାହାରୁଛି ଏବଂ ବିଦ୍ୟୁତ୍ ତାର ଖୁବ୍ ତଳକୁ ଝୁଲି ରହିଛି।',
          textHi: 'ବାଳିକା ବିଦ୍ୟାଳୟ ନିକଟରେ ଟ୍ରାନ୍ସଫର୍ମରରୁ ନିଆଁ ଝୁଲ ବାହାରୁଛି, ତୁରନ୍ତ ଲାଇନ୍ ବନ୍ଦ କରନ୍ତୁ।',
          detectedEntities: {
            category: 'Electricity & Power Distribution',
            location: 'Near Govt Girls High School, Ward 19',
            urgency: 'CRITICAL (Safety Hazard)',
          },
        });

        setTimeout(() => {
          get().addMessage({
            sender: 'ASSISTANT',
            text: 'ଏହା ଏକ ଗମ୍ଭୀର ସୁରକ୍ଷା ବିପଦ! ବିଦ୍ୟୁତ୍ ବିତରଣ ନିୟନ୍ତ୍ରଣ କକ୍ଷ (DISCOM) କୁ ଜରୁରୀକାଳୀନ ଆଲର୍ଟ ପଠାଯାଇଛି ଏବଂ ୨୪ ଘଣ୍ଟାର ସମୟସୀମା ଧାର୍ଯ୍ୟ କରାଯାଇଛି।',
          });
          set({ isProcessing: false });
        }, 1200);
      }, 800);
    }
  },
}));
