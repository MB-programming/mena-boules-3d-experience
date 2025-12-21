import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.greeting': "Hello, I'm",
    'hero.name': 'Mena Boules',
    'hero.title': 'Full-Stack Developer',
    'hero.subtitle': 'Crafting digital experiences with clean code and creative solutions',
    'hero.cta': 'View My Work',
    'hero.contact': 'Get In Touch',
    
    // About
    'about.title': 'About Me',
    'about.description': "I'm a passionate programmer dedicated to building innovative solutions. With expertise in modern web technologies, I transform ideas into functional, beautiful applications. I believe in writing clean, maintainable code and staying updated with the latest industry trends.",
    'about.experience': 'Years Experience',
    'about.projects': 'Projects Completed',
    'about.clients': 'Happy Clients',
    
    // Skills
    'skills.title': 'Skills & Technologies',
    'skills.subtitle': 'Technologies I work with',
    
    // Projects
    'projects.title': 'Featured Projects',
    'projects.subtitle': 'Some of my recent work',
    'projects.view': 'View Project',
    'projects.code': 'View Code',
    
    // Contact
    'contact.title': 'Get In Touch',
    'contact.subtitle': "Let's work together on your next project",
    'contact.name': 'Your Name',
    'contact.email': 'Your Email',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    
    // Footer
    'footer.rights': 'All rights reserved.',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'عني',
    'nav.skills': 'المهارات',
    'nav.projects': 'المشاريع',
    'nav.contact': 'تواصل',
    
    // Hero
    'hero.greeting': 'مرحباً، أنا',
    'hero.name': 'مينا بولس',
    'hero.title': 'مطور متكامل',
    'hero.subtitle': 'أصنع تجارب رقمية بكود نظيف وحلول إبداعية',
    'hero.cta': 'شاهد أعمالي',
    'hero.contact': 'تواصل معي',
    
    // About
    'about.title': 'عني',
    'about.description': 'أنا مبرمج شغوف ملتزم ببناء حلول مبتكرة. مع خبرة في تقنيات الويب الحديثة، أحول الأفكار إلى تطبيقات جميلة وفعالة. أؤمن بكتابة كود نظيف وقابل للصيانة والبقاء على اطلاع بأحدث اتجاهات الصناعة.',
    'about.experience': 'سنوات الخبرة',
    'about.projects': 'مشاريع مكتملة',
    'about.clients': 'عملاء سعداء',
    
    // Skills
    'skills.title': 'المهارات والتقنيات',
    'skills.subtitle': 'التقنيات التي أعمل بها',
    
    // Projects
    'projects.title': 'مشاريع مميزة',
    'projects.subtitle': 'بعض أعمالي الأخيرة',
    'projects.view': 'عرض المشروع',
    'projects.code': 'عرض الكود',
    
    // Contact
    'contact.title': 'تواصل معي',
    'contact.subtitle': 'لنعمل معاً على مشروعك القادم',
    'contact.name': 'اسمك',
    'contact.email': 'بريدك الإلكتروني',
    'contact.message': 'رسالتك',
    'contact.send': 'إرسال الرسالة',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
