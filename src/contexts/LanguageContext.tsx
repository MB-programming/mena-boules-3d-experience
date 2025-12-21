import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar' | 'de';

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
    'nav.blog': 'Blog',
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
    
    // Blog
    'blog.title': 'Blog',
    'blog.subtitle': 'Insights, tutorials and stories',
    'blog.readMore': 'Read More',
    'blog.backToBlog': 'Back to Blog',
    'blog.minRead': 'min read',
    'blog.share': 'Share',
    'blog.relatedPosts': 'Related Posts',
    'blog.categories': 'Categories',
    'blog.allPosts': 'All Posts',
    'blog.search': 'Search articles...',
    'blog.noResults': 'No articles found',
    'blog.author': 'Author',
    'blog.publishedOn': 'Published on',
    
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
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.wallet': 'Wallet',
    'profile.wishlist': 'Wishlist',
    'profile.certificates': 'Certificates',
    'profile.myCourses': 'My Courses',
    'profile.settings': 'Settings',
    'profile.logout': 'Logout',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.orderSummary': 'Order Summary',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.wallet': 'Wallet',
    'checkout.instapay': 'InstaPay',
    'checkout.vodafone': 'Vodafone Cash',
    'checkout.confirmPayment': 'Confirm Payment',
    'checkout.transactionRef': 'Transaction Reference',
    'checkout.copyNumber': 'Copy Number',
    'checkout.total': 'Total',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.buy': 'Buy',
    'common.free': 'Free',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.about': 'عني',
    'nav.skills': 'المهارات',
    'nav.projects': 'أعمالي',
    'nav.courses': 'الكورسات',
    'nav.blog': 'المدونة',
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
    
    // Blog
    'blog.title': 'المدونة',
    'blog.subtitle': 'رؤى ودروس وقصص',
    'blog.readMore': 'اقرأ المزيد',
    'blog.backToBlog': 'العودة للمدونة',
    'blog.minRead': 'دقيقة قراءة',
    'blog.share': 'مشاركة',
    'blog.relatedPosts': 'مقالات ذات صلة',
    'blog.categories': 'التصنيفات',
    'blog.allPosts': 'جميع المقالات',
    'blog.search': 'البحث في المقالات...',
    'blog.noResults': 'لا توجد مقالات',
    'blog.author': 'الكاتب',
    'blog.publishedOn': 'نُشر في',
    
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
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',
    
    // Profile
    'profile.title': 'ملفي الشخصي',
    'profile.wallet': 'المحفظة',
    'profile.wishlist': 'المفضلة',
    'profile.certificates': 'الشهادات',
    'profile.myCourses': 'كورساتي',
    'profile.settings': 'الإعدادات',
    'profile.logout': 'تسجيل الخروج',
    
    // Checkout
    'checkout.title': 'إتمام الشراء',
    'checkout.orderSummary': 'ملخص الطلب',
    'checkout.paymentMethod': 'طريقة الدفع',
    'checkout.wallet': 'المحفظة',
    'checkout.instapay': 'إنستا باي',
    'checkout.vodafone': 'فودافون كاش',
    'checkout.confirmPayment': 'تأكيد الدفع',
    'checkout.transactionRef': 'رقم المعاملة',
    'checkout.copyNumber': 'نسخ الرقم',
    'checkout.total': 'الإجمالي',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.buy': 'شراء',
    'common.free': 'مجاني',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.services': 'Dienstleistungen',
    'nav.about': 'Über mich',
    'nav.skills': 'Fähigkeiten',
    'nav.projects': 'Arbeiten',
    'nav.courses': 'Kurse',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    
    // Hero
    'hero.greeting': 'Hallo, ich bin',
    'hero.name': 'Mena Boules',
    'hero.title': 'Preisgekrönter Branding-Experte',
    'hero.subtitle': 'Spezialisiert auf die Erstellung einzigartiger visueller Identitäten für digitale Produkte. Ich glaube, dass großartiges Design mit gemeinsamen Werten, offener Kommunikation und Respekt für Ihr Publikum beginnt.',
    'hero.cta': 'Portfolio ansehen',
    'hero.contact': 'Kontakt aufnehmen',
    
    // Services
    'services.title': 'Dienstleistungen',
    'services.subtitle': 'Was ich für Sie tun kann',
    'services.uiux.title': 'UI/UX Design',
    'services.uiux.desc': 'Gestaltung moderner, benutzerfreundlicher Oberflächen und nahtloser Erlebnisse, die Kreativität mit Funktionalität verbinden.',
    'services.webdev.title': 'Webentwicklung',
    'services.webdev.desc': 'Erstellung responsiver, leistungsstarker Websites mit WordPress und anderen CMS-Plattformen, maßgeschneidert auf Kundenbedürfnisse.',
    'services.custom.title': 'Anpassung & Wartung',
    'services.custom.desc': 'Anpassung von Themes, Plugins und kontinuierlicher Support für reibungslose und skalierbare Website-Leistung.',
    'services.security.title': 'Problemlösung & Sicherheit',
    'services.security.desc': 'Lösungen für technische Probleme, Leistungsoptimierung und Absicherung von Websites gegen Schwachstellen.',
    'services.coding.title': 'Individuelle Programmierung & Web-Apps',
    'services.coding.desc': 'Entwicklung maßgeschneiderter Webanwendungen und privater Programmierlösungen für einzigartige Geschäftsanforderungen.',
    'services.systems.title': 'Systeme & Infrastruktur',
    'services.systems.desc': 'Verwaltung von Systemen und Servern für zuverlässige Leistung, Skalierbarkeit und Sicherheit.',
    
    // About
    'about.title': 'Über mich',
    'about.greeting': 'Hallo',
    'about.iam': 'Ich bin',
    'about.fullname': 'Mena Boules Fouad',
    'about.description': 'Ich bin ein engagierter und leidenschaftlicher Programmierer mit über 5 Jahren Erfahrung in der Webentwicklung. Im Laufe meiner Karriere war ich an der Entwicklung und Wartung verschiedener Anwendungen und Websites beteiligt. Ich verfüge über starke Fähigkeiten in Programmiersprachen wie JavaScript und bin in der Lage, innovative und effiziente Softwarelösungen für komplexe Probleme zu entwerfen und umzusetzen.',
    'about.description2': 'Ich lerne lebenslang und bin den Prinzipien der Softwareentwicklung und Best Practices verpflichtet. Ich bin eine selbstständige Person, die sowohl unabhängig als auch im Team hervorragende Leistungen erbringt. Ich bin stolz auf meine Arbeit und strebe stets nach Exzellenz in allem, was ich tue.',
    'about.experience': 'Jahre Erfahrung',
    'about.projects': 'Abgeschlossene Projekte',
    'about.clients': 'Zufriedene Kunden',
    'about.resume': 'Lebenslauf ansehen',
    'about.hire': 'Kontakt aufnehmen',
    
    // Skills
    'skills.title': 'Fähigkeiten & Technologien',
    'skills.subtitle': 'Technologien, mit denen ich arbeite',
    
    // Projects
    'projects.title': 'Arbeiten',
    'projects.subtitle': 'Entdecken Sie meine kreativen Arbeiten',
    'projects.view': 'Projekt ansehen',
    'projects.code': 'Code ansehen',
    'projects.all': 'Alle',
    'projects.branding': 'Branding',
    'projects.product': 'Produkt',
    'projects.websites': 'Websites',
    'projects.uiux': 'UX/UI',
    'projects.apps': 'Anwendungen',
    'projects.preview': 'Live-Vorschau',
    'projects.details': 'Details ansehen',
    
    // Courses
    'courses.title': 'Meine Kurse',
    'courses.subtitle': 'Lernen Sie aus meiner Erfahrung',
    'courses.students': 'Studenten',
    'courses.hours': 'Stunden',
    'courses.lessons': 'Lektionen',
    'courses.enroll': 'Jetzt anmelden',
    'courses.preview': 'Vorschau',
    
    // Blog
    'blog.title': 'Blog',
    'blog.subtitle': 'Einblicke, Tutorials und Geschichten',
    'blog.readMore': 'Weiterlesen',
    'blog.backToBlog': 'Zurück zum Blog',
    'blog.minRead': 'Min. Lesezeit',
    'blog.share': 'Teilen',
    'blog.relatedPosts': 'Ähnliche Beiträge',
    'blog.categories': 'Kategorien',
    'blog.allPosts': 'Alle Beiträge',
    'blog.search': 'Artikel suchen...',
    'blog.noResults': 'Keine Artikel gefunden',
    'blog.author': 'Autor',
    'blog.publishedOn': 'Veröffentlicht am',
    
    // Contact
    'contact.title': 'Zeit, über Ihr Projekt zu sprechen',
    'contact.subtitle': 'Lassen Sie uns gemeinsam eine kreative Reise beginnen, indem wir eine visuelle Geschichte Ihrer Marke im überfüllten digitalen Raum gestalten.',
    'contact.name': 'Ihr Name',
    'contact.email': 'Ihre E-Mail',
    'contact.message': 'Ihre Nachricht',
    'contact.send': 'Nachricht senden',
    'contact.phone': 'Telefon',
    'contact.whatsapp': 'WhatsApp',
    'contact.address': 'Adresse',
    
    // Footer
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.cta': 'Lass uns zusammenarbeiten!',
    
    // Auth
    'auth.login': 'Anmelden',
    'auth.signup': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.name': 'Vollständiger Name',
    
    // Profile
    'profile.title': 'Mein Profil',
    'profile.wallet': 'Geldbörse',
    'profile.wishlist': 'Wunschliste',
    'profile.certificates': 'Zertifikate',
    'profile.myCourses': 'Meine Kurse',
    'profile.settings': 'Einstellungen',
    'profile.logout': 'Abmelden',
    
    // Checkout
    'checkout.title': 'Kasse',
    'checkout.orderSummary': 'Bestellübersicht',
    'checkout.paymentMethod': 'Zahlungsmethode',
    'checkout.wallet': 'Geldbörse',
    'checkout.instapay': 'InstaPay',
    'checkout.vodafone': 'Vodafone Cash',
    'checkout.confirmPayment': 'Zahlung bestätigen',
    'checkout.transactionRef': 'Transaktionsreferenz',
    'checkout.copyNumber': 'Nummer kopieren',
    'checkout.total': 'Gesamt',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.view': 'Ansehen',
    'common.buy': 'Kaufen',
    'common.free': 'Kostenlos',
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
