import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'te';

const translations = {
  en: {
    // Header & Sidebar
    sign_out: "Sign Out",
    menu_home: "Home",
    menu_vault: "Evidence Vault",
    menu_ai: "AI Consultant",
    menu_find: "Find Lawyer",
    menu_profile: "My Profile",

    // Dashboard - Welcome
    welcome: "Welcome, Citizen.",
    welcome_sub: "Your legal protection hub is active.",
    secure_badge: "System Secure",

    // Dashboard - Big Cards
    ai_advisor: "AI Consultant",
    ai_desc: "Get instant answers to legal questions.",
    start_chat: "Start Chat",
    
    find_lawyer: "Find a Lawyer",
    find_desc: "Connect with top advocates near you.",
    search_now: "Search Now",
    
    vault: "Evidence Vault",
    vault_desc: "Securely store documents and records.",
    open_vault: "Open Vault",

    // Dashboard - Bottom Section
    recent_activity: "Recent Activity",
    view_history: "View Full History",
    rent_agree: "Rent_Agreement.pdf",
    vault_log: "Vault Access Log",
    
    tip_title: "Legal Tip of the Day",
    tip_text: "Always carry a digital copy of your vehicle registration. Under the Motor Vehicles Act, digital documents in DigiLocker are legally valid.",
    ask_ai: "Ask AI More"
  },
  te: {
    // Header & Sidebar
    sign_out: "లాగ్ అవుట్",
    menu_home: "హోమ్",
    menu_vault: "సాక్ష్యాధారాల వాల్ట్",
    menu_ai: "AI సలహాదారు",
    menu_find: "న్యాయవాదిని వెతకండి",
    menu_profile: "నా ప్రొఫైల్",

    // Dashboard - Welcome
    welcome: "నమస్కారం, పౌరుడా.",
    welcome_sub: "మీ చట్టపరమైన రక్షణ కేంద్రం సిద్ధంగా ఉంది.",
    secure_badge: "సురక్షిత వ్యవస్థ",

    // Dashboard - Big Cards
    ai_advisor: "AI న్యాయ సలహాదారు",
    ai_desc: "మీ చట్టపరమైన ప్రశ్నలకు తక్షణ సమాధానాలు పొందండి.",
    start_chat: "చాట్ ప్రారంభించండి",

    find_lawyer: "న్యాయవాదిని వెతకండి",
    find_desc: "మీ దగ్గరలోని ఉత్తమ న్యాయవాదులను సంప్రదించండి.",
    search_now: "వెతకండి",

    vault: "సాక్ష్యాధారాల వాల్ట్",
    vault_desc: "మీ పత్రాలు మరియు రికార్డులను భద్రపరచండి.",
    open_vault: "వాల్ట్ తెరవండి",

    // Dashboard - Bottom Section
    recent_activity: "ఇటీవలి కార్యకలాపాలు",
    view_history: "పూర్తి చరిత్ర చూడండి",
    rent_agree: "అద్దె_ఒప్పందం.pdf",
    vault_log: "వాల్ట్ యాక్సెస్ లాగ్",

    tip_title: "ఈ రోజు న్యాయ చిట్కా",
    tip_text: "మీ వాహన రిజిస్ట్రేషన్ కాపీని ఎల్లప్పుడూ డిజిటల్ రూపంలో ఉంచుకోండి. మోటారు వాహనాల చట్టం ప్రకారం, డిజిలాకర్‌లోని పత్రాలు చట్టపరంగా చెల్లుతాయి.",
    ask_ai: "మరింత అడగండి"
  }
};

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: keyof typeof translations['en']) => {
    return translations[lang][key] || key;
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);