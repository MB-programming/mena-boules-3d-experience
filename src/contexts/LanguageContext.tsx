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
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Works',
    'nav.courses': 'Courses',
    'nav.contact': 'Say Hello',
    
    // Hero
    'hero.greeting': "Hello, I'm",
    'hero.name': 'Mena Boules',
    'hero.title': 'Award Winning Branding Expert',
    'hero.subtitle': 'Specialize in creating unique visual identities for digital products and believe that a stunning design starts with common values, open communication, and respect for your audience.',
    'hero.cta': 'View Portfolio',
    'hero.contact': 'Get In Touch',
    
    // Services
    'services.title': 'Services',
    'services.subtitle': 'What I can do for you',
    'services.uiux.title': 'UI UX Design',
    'services.uiux.desc': 'Crafting modern, user-friendly interfaces and seamless experiences that combine creativity with functionality.',
    'services.webdev.title': 'Web Development',
    'services.webdev.desc': 'Building responsive, high-performance websites using WordPress and other CMS platforms tailored to client needs.',
    'services.custom.title': 'Customization & Maintenance',
    'services.custom.desc': 'Customizing themes, plugins, and delivering ongoing support to ensure smooth and scalable website performance.',
    'services.security.title': 'Problem Solving & Security',
    'services.security.desc': 'Providing solutions for technical issues, performance optimization, and securing websites against vulnerabilities.',
    'services.coding.title': 'Custom Coding & Web Applications',
    'services.coding.desc': 'Developing tailored web applications and private coding solutions to match unique business needs.',
    'services.systems.title': 'Systems & Infrastructure',
    'services.systems.desc': 'Managing systems and servers to ensure reliable performance, scalability, and security.',
    
    // About
    'about.title': 'About Me',
    'about.greeting': 'Hi',
    'about.iam': 'I am',
    'about.fullname': 'Mena Boules Fouad',
    'about.description': "I am a dedicated and passionate programmer with over 5 years of experience in the field of Web development. Throughout my career, I have been involved in the development and maintenance of various applications and websites. I possess strong skills in programming languages such as JavaScript and I have the ability to design and implement innovative and efficient software solutions for complex problems.",
    'about.description2': "I am a lifelong learner and am committed to software development principles and best practices. I am a self-driven individual who excels both independently and as part of a team. I take pride in my work and always strive for excellence in everything I do.",
    'about.experience': 'Years Experience',
    'about.projects': 'Projects Completed',
    'about.clients': 'Happy Clients',
    'about.resume': 'View Resume',
    'about.hire': 'Get in Touch',
    
    // Skills
    'skills.title': 'Skills & Technologies',
    'skills.subtitle': 'Technologies I work with',
    
    // Projects
    'projects.title': 'Works',
    'projects.subtitle': 'Explore my creative work',
    'projects.view': 'View Project',
    'projects.code': 'View Code',
    'projects.all': 'All',
    'projects.branding': 'Branding',
    'projects.product': 'Product',
    'projects.websites': 'Websites',
    'projects.uiux': 'UX/UI',
    'projects.apps': 'Applications',
    'projects.preview': 'Live Preview',
    'projects.details': 'View Details',
    
    // Courses
    'courses.title': 'My Courses',
    'courses.subtitle': 'Learn from my experience',
    'courses.students': 'Students',
    'courses.hours': 'Hours',
    'courses.lessons': 'Lessons',
    'courses.enroll': 'Enroll Now',
    'courses.preview': 'Preview',
    
    // Contact
    'contact.title': "It's time to talk about your project",
    'contact.subtitle': "Let's embark on creative journey together by shaping a visual narrative of your brand in the crowded digital space.",
    'contact.name': 'Your Name',
    'contact.email': 'Your Email',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message',
    'contact.phone': 'Phone',
    'contact.whatsapp': 'WhatsApp',
    'contact.address': 'Address',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.cta': "Let's work together!",
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.about': 'عني',
    'nav.skills': 'المهارات',
    'nav.projects': 'أعمالي',
    'nav.courses': 'الكورسات',
    'nav.contact': 'تواصل',
    
    // Hero
    'hero.greeting': 'مرحباً، أنا',
    'hero.name': 'مينا بولس',
    'hero.title': 'خبير العلامات التجارية الحائز على جوائز',
    'hero.subtitle': 'متخصص في إنشاء هويات بصرية فريدة للمنتجات الرقمية وأؤمن بأن التصميم المذهل يبدأ بالقيم المشتركة والتواصل المفتوح واحترام جمهورك.',
    'hero.cta': 'شاهد أعمالي',
    'hero.contact': 'تواصل معي',
    
    // Services
    'services.title': 'الخدمات',
    'services.subtitle': 'ما يمكنني فعله لك',
    'services.uiux.title': 'تصميم UI/UX',
    'services.uiux.desc': 'صياغة واجهات حديثة وسهلة الاستخدام وتجارب سلسة تجمع بين الإبداع والوظائف.',
    'services.webdev.title': 'تطوير الويب',
    'services.webdev.desc': 'بناء مواقع ويب متجاوبة وعالية الأداء باستخدام WordPress ومنصات CMS أخرى مصممة حسب احتياجات العميل.',
    'services.custom.title': 'التخصيص والصيانة',
    'services.custom.desc': 'تخصيص القوالب والإضافات وتقديم الدعم المستمر لضمان أداء سلس وقابل للتوسع.',
    'services.security.title': 'حل المشكلات والأمان',
    'services.security.desc': 'تقديم حلول للمشاكل التقنية وتحسين الأداء وتأمين المواقع ضد الثغرات.',
    'services.coding.title': 'برمجة مخصصة وتطبيقات ويب',
    'services.coding.desc': 'تطوير تطبيقات ويب مخصصة وحلول برمجية خاصة لتلبية احتياجات الأعمال الفريدة.',
    'services.systems.title': 'الأنظمة والبنية التحتية',
    'services.systems.desc': 'إدارة الأنظمة والخوادم لضمان الأداء الموثوق والقابلية للتوسع والأمان.',
    
    // About
    'about.title': 'عني',
    'about.greeting': 'مرحباً',
    'about.iam': 'أنا',
    'about.fullname': 'مينا بولس فؤاد',
    'about.description': 'أنا مبرمج ملتزم وشغوف ولدي أكثر من 5 سنوات من الخبرة في مجال تطوير الويب. خلال مسيرتي المهنية، شاركت في تطوير وصيانة مختلف التطبيقات والمواقع. أمتلك مهارات قوية في لغات البرمجة مثل JavaScript ولدي القدرة على تصميم وتنفيذ حلول برمجية مبتكرة وفعالة للمشاكل المعقدة.',
    'about.description2': 'أنا متعلم مدى الحياة وملتزم بمبادئ تطوير البرمجيات وأفضل الممارسات. أنا شخص يعتمد على الذات ويتفوق سواء بشكل مستقل أو كجزء من فريق. أفتخر بعملي وأسعى دائمًا للتميز في كل ما أقوم به.',
    'about.experience': 'سنوات الخبرة',
    'about.projects': 'مشاريع مكتملة',
    'about.clients': 'عملاء سعداء',
    'about.resume': 'عرض السيرة الذاتية',
    'about.hire': 'تواصل معي',
    
    // Skills
    'skills.title': 'المهارات والتقنيات',
    'skills.subtitle': 'التقنيات التي أعمل بها',
    
    // Projects
    'projects.title': 'أعمالي',
    'projects.subtitle': 'استكشف أعمالي الإبداعية',
    'projects.view': 'عرض المشروع',
    'projects.code': 'عرض الكود',
    'projects.all': 'الكل',
    'projects.branding': 'هوية',
    'projects.product': 'منتجات',
    'projects.websites': 'مواقع',
    'projects.uiux': 'UX/UI',
    'projects.apps': 'تطبيقات',
    'projects.preview': 'معاينة مباشرة',
    'projects.details': 'عرض التفاصيل',
    
    // Courses
    'courses.title': 'كورساتي',
    'courses.subtitle': 'تعلم من خبرتي',
    'courses.students': 'طالب',
    'courses.hours': 'ساعة',
    'courses.lessons': 'درس',
    'courses.enroll': 'سجل الآن',
    'courses.preview': 'معاينة',
    
    // Contact
    'contact.title': 'حان الوقت للحديث عن مشروعك',
    'contact.subtitle': 'لننطلق في رحلة إبداعية معًا من خلال تشكيل سرد بصري لعلامتك التجارية في الفضاء الرقمي المزدحم.',
    'contact.name': 'اسمك',
    'contact.email': 'بريدك الإلكتروني',
    'contact.message': 'رسالتك',
    'contact.send': 'إرسال الرسالة',
    'contact.phone': 'الهاتف',
    'contact.whatsapp': 'واتساب',
    'contact.address': 'العنوان',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.cta': 'لنعمل معًا!',
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
