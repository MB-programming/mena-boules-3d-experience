import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, User, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Interactive3DScene from '@/components/Interactive3DScene';
import { toast } from 'sonner';

const blogPosts = [
  {
    id: 1,
    slug: 'mastering-ui-ux-design',
    title: {
      en: 'Mastering UI/UX Design: A Complete Guide',
      ar: 'إتقان تصميم UI/UX: دليل شامل',
      de: 'UI/UX-Design meistern: Ein vollständiger Leitfaden',
    },
    excerpt: {
      en: 'Learn the fundamentals of creating stunning user interfaces and seamless user experiences that convert visitors into customers.',
      ar: 'تعلم أساسيات إنشاء واجهات مستخدم مذهلة وتجارب مستخدم سلسة تحول الزوار إلى عملاء.',
      de: 'Lernen Sie die Grundlagen der Erstellung beeindruckender Benutzeroberflächen und nahtloser Benutzererlebnisse.',
    },
    content: {
      en: `
## Introduction to UI/UX Design

User Interface (UI) and User Experience (UX) design are crucial elements in creating successful digital products. In this comprehensive guide, we'll explore the fundamental principles and best practices that separate good design from great design.

## Understanding the Difference

**UI Design** focuses on the visual elements - colors, typography, buttons, icons, and overall aesthetic appeal. It's about making interfaces beautiful and intuitive.

**UX Design** encompasses the entire user journey - from the moment a user discovers your product to when they become a loyal customer. It's about creating seamless, enjoyable experiences.

## Key Principles of Great Design

### 1. User-Centered Approach
Always design with your users in mind. Conduct research, create personas, and test your designs with real users.

### 2. Consistency
Maintain consistent design patterns throughout your product. This includes colors, fonts, spacing, and interaction patterns.

### 3. Accessibility
Design for everyone. Ensure your interfaces are usable by people with different abilities and disabilities.

### 4. Visual Hierarchy
Guide users' attention through thoughtful use of size, color, contrast, and positioning.

## Best Practices

- Start with wireframes and prototypes
- Use a design system for consistency
- Test early and often
- Iterate based on feedback
- Keep it simple and intuitive

## Conclusion

Mastering UI/UX design is a continuous journey. Stay curious, keep learning, and always prioritize your users' needs.
      `,
      ar: `
## مقدمة في تصميم UI/UX

تصميم واجهة المستخدم (UI) وتجربة المستخدم (UX) عناصر حاسمة في إنشاء منتجات رقمية ناجحة. في هذا الدليل الشامل، سنستكشف المبادئ الأساسية وأفضل الممارسات.

## فهم الفرق

**تصميم UI** يركز على العناصر المرئية - الألوان والطباعة والأزرار والأيقونات والجاذبية الجمالية العامة.

**تصميم UX** يشمل رحلة المستخدم بالكامل - من لحظة اكتشاف منتجك حتى يصبح عميلاً مخلصاً.

## المبادئ الأساسية للتصميم الرائع

### 1. نهج يركز على المستخدم
صمم دائماً مع وضع المستخدمين في الاعتبار. أجرِ البحوث وأنشئ شخصيات واختبر تصميماتك.

### 2. الاتساق
حافظ على أنماط تصميم متسقة في جميع أنحاء منتجك.

### 3. إمكانية الوصول
صمم للجميع. تأكد من أن واجهاتك قابلة للاستخدام من قبل أشخاص ذوي قدرات مختلفة.

### 4. التسلسل الهرمي البصري
وجه انتباه المستخدمين من خلال الاستخدام المدروس للحجم واللون والتباين.

## الخلاصة

إتقان تصميم UI/UX رحلة مستمرة. ابقَ فضولياً واستمر في التعلم.
      `,
      de: `
## Einführung in UI/UX-Design

Benutzeroberflächen (UI) und Benutzererfahrung (UX) Design sind entscheidende Elemente bei der Erstellung erfolgreicher digitaler Produkte. In diesem umfassenden Leitfaden werden wir die grundlegenden Prinzipien und Best Practices erkunden.

## Den Unterschied verstehen

**UI-Design** konzentriert sich auf visuelle Elemente - Farben, Typografie, Schaltflächen, Symbole und die allgemeine ästhetische Anziehungskraft.

**UX-Design** umfasst die gesamte User Journey - vom Moment, in dem ein Benutzer Ihr Produkt entdeckt, bis er ein treuer Kunde wird.

## Schlüsselprinzipien großartigen Designs

### 1. Benutzerzentrierter Ansatz
Designen Sie immer mit Ihren Benutzern im Sinn. Führen Sie Recherchen durch, erstellen Sie Personas und testen Sie Ihre Designs.

### 2. Konsistenz
Behalten Sie konsistente Designmuster in Ihrem gesamten Produkt bei.

### 3. Barrierefreiheit
Designen Sie für alle. Stellen Sie sicher, dass Ihre Oberflächen von Menschen mit unterschiedlichen Fähigkeiten nutzbar sind.

### 4. Visuelle Hierarchie
Lenken Sie die Aufmerksamkeit der Benutzer durch durchdachten Einsatz von Größe, Farbe und Kontrast.

## Fazit

Das Meistern von UI/UX-Design ist eine kontinuierliche Reise. Bleiben Sie neugierig und lernen Sie weiter.
      `,
    },
    category: { en: 'Design', ar: 'تصميم', de: 'Design' },
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
    date: '2024-12-15',
    readTime: 8,
    author: 'Mena Boules',
  },
  {
    id: 2,
    slug: 'wordpress-development-tips',
    title: {
      en: '10 WordPress Development Tips for 2024',
      ar: '10 نصائح لتطوير ووردبريس في 2024',
      de: '10 WordPress-Entwicklungstipps für 2024',
    },
    excerpt: {
      en: 'Discover the best practices and techniques to build high-performance WordPress websites that stand out.',
      ar: 'اكتشف أفضل الممارسات والتقنيات لبناء مواقع ووردبريس عالية الأداء.',
      de: 'Entdecken Sie die besten Praktiken und Techniken für leistungsstarke WordPress-Websites.',
    },
    content: {
      en: `
## WordPress Development in 2024

WordPress powers over 40% of all websites on the internet. Here are essential tips to help you build better WordPress sites.

## 1. Use a Modern Development Environment
Set up Local by Flywheel or Docker for consistent development across teams.

## 2. Embrace Block-Based Development
The Gutenberg editor is the future. Learn to create custom blocks for unique functionality.

## 3. Optimize for Performance
- Use caching plugins
- Optimize images
- Minimize HTTP requests
- Use a CDN

## 4. Security First
- Keep WordPress updated
- Use strong passwords
- Implement two-factor authentication
- Regular backups

## 5. Custom Post Types
Leverage custom post types for structured content that goes beyond posts and pages.

## Conclusion
Stay updated with WordPress development trends and continuously improve your skills.
      `,
      ar: `
## تطوير ووردبريس في 2024

يشغل ووردبريس أكثر من 40% من جميع المواقع على الإنترنت. إليك نصائح أساسية لبناء مواقع أفضل.

## 1. استخدم بيئة تطوير حديثة
قم بإعداد Local by Flywheel أو Docker للتطوير المتسق.

## 2. تبنى التطوير المبني على الكتل
محرر Gutenberg هو المستقبل. تعلم إنشاء كتل مخصصة.

## 3. حسّن الأداء
- استخدم إضافات التخزين المؤقت
- حسّن الصور
- قلل طلبات HTTP
- استخدم CDN

## 4. الأمان أولاً
- حافظ على تحديث ووردبريس
- استخدم كلمات مرور قوية
- نفذ المصادقة الثنائية

## الخلاصة
ابقَ محدثاً مع اتجاهات تطوير ووردبريس.
      `,
      de: `
## WordPress-Entwicklung 2024

WordPress betreibt über 40% aller Websites im Internet. Hier sind wesentliche Tipps für bessere WordPress-Sites.

## 1. Moderne Entwicklungsumgebung
Richten Sie Local by Flywheel oder Docker für konsistente Entwicklung ein.

## 2. Block-basierte Entwicklung
Der Gutenberg-Editor ist die Zukunft. Lernen Sie, benutzerdefinierte Blöcke zu erstellen.

## 3. Performance optimieren
- Caching-Plugins verwenden
- Bilder optimieren
- HTTP-Anfragen minimieren
- CDN nutzen

## 4. Sicherheit zuerst
- WordPress aktuell halten
- Starke Passwörter verwenden
- Zwei-Faktor-Authentifizierung implementieren

## Fazit
Bleiben Sie mit WordPress-Entwicklungstrends auf dem Laufenden.
      `,
    },
    category: { en: 'Development', ar: 'تطوير', de: 'Entwicklung' },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    date: '2024-12-10',
    readTime: 6,
    author: 'Mena Boules',
  },
  {
    id: 3,
    slug: 'branding-strategy-guide',
    title: {
      en: 'Building a Strong Brand Identity',
      ar: 'بناء هوية علامة تجارية قوية',
      de: 'Eine starke Markenidentität aufbauen',
    },
    excerpt: {
      en: 'Explore the key elements of brand identity and how to create a memorable presence in the digital landscape.',
      ar: 'استكشف العناصر الأساسية لهوية العلامة التجارية وكيفية إنشاء حضور لا يُنسى.',
      de: 'Erkunden Sie die Schlüsselelemente der Markenidentität und wie Sie eine unvergessliche Präsenz schaffen.',
    },
    content: {
      en: `
## What is Brand Identity?

Brand identity is the collection of visual elements that represent and differentiate your brand. It's how your audience perceives and remembers you.

## Key Elements

### 1. Logo Design
Your logo is the face of your brand. It should be simple, memorable, and versatile.

### 2. Color Palette
Colors evoke emotions. Choose a palette that reflects your brand's personality.

### 3. Typography
Fonts communicate tone. Select typefaces that align with your brand voice.

### 4. Visual Style
Create a consistent visual language across all touchpoints.

## Building Your Brand

1. Define your mission and values
2. Research your target audience
3. Analyze competitors
4. Create your visual identity
5. Develop brand guidelines
6. Apply consistently

## Conclusion
A strong brand identity builds trust and recognition. Invest time in getting it right.
      `,
      ar: `
## ما هي هوية العلامة التجارية؟

هوية العلامة التجارية هي مجموعة العناصر المرئية التي تمثل وتميز علامتك التجارية.

## العناصر الأساسية

### 1. تصميم الشعار
شعارك هو وجه علامتك التجارية. يجب أن يكون بسيطاً ولا يُنسى ومتعدد الاستخدامات.

### 2. لوحة الألوان
الألوان تثير المشاعر. اختر لوحة تعكس شخصية علامتك التجارية.

### 3. الطباعة
الخطوط تنقل النبرة. اختر خطوطاً تتوافق مع صوت علامتك التجارية.

### 4. الأسلوب البصري
أنشئ لغة بصرية متسقة عبر جميع نقاط الاتصال.

## بناء علامتك التجارية

1. حدد مهمتك وقيمك
2. ابحث عن جمهورك المستهدف
3. حلل المنافسين
4. أنشئ هويتك البصرية

## الخلاصة
هوية العلامة التجارية القوية تبني الثقة والاعتراف.
      `,
      de: `
## Was ist Markenidentität?

Markenidentität ist die Sammlung visueller Elemente, die Ihre Marke repräsentieren und differenzieren.

## Schlüsselelemente

### 1. Logo-Design
Ihr Logo ist das Gesicht Ihrer Marke. Es sollte einfach, einprägsam und vielseitig sein.

### 2. Farbpalette
Farben wecken Emotionen. Wählen Sie eine Palette, die die Persönlichkeit Ihrer Marke widerspiegelt.

### 3. Typografie
Schriften kommunizieren Ton. Wählen Sie Schriften, die zu Ihrer Markenstimme passen.

### 4. Visueller Stil
Erstellen Sie eine konsistente visuelle Sprache über alle Berührungspunkte hinweg.

## Ihre Marke aufbauen

1. Definieren Sie Mission und Werte
2. Recherchieren Sie Ihre Zielgruppe
3. Analysieren Sie Wettbewerber
4. Erstellen Sie Ihre visuelle Identität

## Fazit
Eine starke Markenidentität baut Vertrauen und Wiedererkennung auf.
      `,
    },
    category: { en: 'Branding', ar: 'علامات تجارية', de: 'Branding' },
    image: 'https://images.unsplash.com/photo-1493421419110-74f4e85ba126?w=1200&h=600&fit=crop',
    date: '2024-12-05',
    readTime: 10,
    author: 'Mena Boules',
  },
];

const relatedPosts = [
  {
    slug: 'wordpress-development-tips',
    title: {
      en: '10 WordPress Development Tips for 2024',
      ar: '10 نصائح لتطوير ووردبريس في 2024',
      de: '10 WordPress-Entwicklungstipps für 2024',
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
  },
  {
    slug: 'branding-strategy-guide',
    title: {
      en: 'Building a Strong Brand Identity',
      ar: 'بناء هوية علامة تجارية قوية',
      de: 'Eine starke Markenidentität aufbauen',
    },
    image: 'https://images.unsplash.com/photo-1493421419110-74f4e85ba126?w=400&h=250&fit=crop',
  },
];

const BlogPost = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="btn-primary">
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === 'ar' ? 'ar-EG' : language === 'de' ? 'de-DE' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = post.title[language as keyof typeof post.title];
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(language === 'ar' ? 'تم نسخ الرابط!' : language === 'de' ? 'Link kopiert!' : 'Link copied!');
    }
  };

  const filteredRelated = relatedPosts.filter((p) => p.slug !== slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>{post.title[language as keyof typeof post.title]} | Mena Boules</title>
      <meta name="description" content={post.excerpt[language as keyof typeof post.excerpt]} />
      <link rel="canonical" href={`https://menaboules.com/blog/${slug}`} />
      
      <Interactive3DScene />
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('blog.backToBlog')}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground">
                {post.category[language as keyof typeof post.category]}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              {post.title[language as keyof typeof post.title]}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} {t('blog.minRead')}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {t('blog.share')}
              </motion.button>
            </div>
          </motion.header>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 rounded-2xl overflow-hidden"
          >
            <img
              src={post.image}
              alt={post.title[language as keyof typeof post.title]}
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none mb-16"
          >
            <div 
              className="blog-content space-y-6 text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: post.content[language as keyof typeof post.content]
                  .replace(/## (.*)/g, '<h2 class="text-2xl font-display font-bold mt-8 mb-4 text-foreground">$1</h2>')
                  .replace(/### (.*)/g, '<h3 class="text-xl font-display font-semibold mt-6 mb-3 text-foreground">$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                  .replace(/- (.*)/g, '<li class="ml-4 list-disc">$1</li>')
                  .replace(/\n\n/g, '</p><p class="mb-4">')
              }}
            />
          </motion.article>

          {/* Related Posts */}
          {filteredRelated.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6">
                {t('blog.relatedPosts')}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredRelated.map((relPost) => (
                  <Link
                    key={relPost.slug}
                    to={`/blog/${relPost.slug}`}
                    className="glass-card overflow-hidden group hover-glow"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relPost.image}
                        alt={relPost.title[language as keyof typeof relPost.title]}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold group-hover:text-primary transition-colors">
                        {relPost.title[language as keyof typeof relPost.title]}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
