import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Interactive3DScene from '@/components/Interactive3DScene';

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
    category: { en: 'Design', ar: 'تصميم', de: 'Design' },
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
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
    category: { en: 'Development', ar: 'تطوير', de: 'Entwicklung' },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
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
    category: { en: 'Branding', ar: 'علامات تجارية', de: 'Branding' },
    image: 'https://images.unsplash.com/photo-1493421419110-74f4e85ba126?w=800&h=500&fit=crop',
    date: '2024-12-05',
    readTime: 10,
    author: 'Mena Boules',
  },
  {
    id: 4,
    slug: 'web-security-essentials',
    title: {
      en: 'Web Security Essentials for Developers',
      ar: 'أساسيات أمان الويب للمطورين',
      de: 'Web-Sicherheitsgrundlagen für Entwickler',
    },
    excerpt: {
      en: 'Protect your websites from common vulnerabilities and learn essential security practices every developer should know.',
      ar: 'احمِ مواقعك من الثغرات الشائعة وتعلم ممارسات الأمان الأساسية.',
      de: 'Schützen Sie Ihre Websites vor häufigen Schwachstellen und lernen Sie wesentliche Sicherheitspraktiken.',
    },
    category: { en: 'Security', ar: 'أمان', de: 'Sicherheit' },
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop',
    date: '2024-11-28',
    readTime: 7,
    author: 'Mena Boules',
  },
  {
    id: 5,
    slug: 'javascript-best-practices',
    title: {
      en: 'JavaScript Best Practices in 2024',
      ar: 'أفضل ممارسات JavaScript في 2024',
      de: 'JavaScript Best Practices 2024',
    },
    excerpt: {
      en: 'Master modern JavaScript techniques and patterns that will make your code cleaner and more efficient.',
      ar: 'أتقن تقنيات وأنماط JavaScript الحديثة التي ستجعل كودك أنظف وأكثر كفاءة.',
      de: 'Beherrschen Sie moderne JavaScript-Techniken und -Muster für saubereren und effizienteren Code.',
    },
    category: { en: 'Development', ar: 'تطوير', de: 'Entwicklung' },
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=500&fit=crop',
    date: '2024-11-20',
    readTime: 9,
    author: 'Mena Boules',
  },
  {
    id: 6,
    slug: 'responsive-design-techniques',
    title: {
      en: 'Responsive Design Techniques That Work',
      ar: 'تقنيات التصميم المتجاوب الفعالة',
      de: 'Responsive Design-Techniken, die funktionieren',
    },
    excerpt: {
      en: 'Create websites that look amazing on every device with these proven responsive design strategies.',
      ar: 'أنشئ مواقع ويب تبدو رائعة على كل جهاز باستخدام استراتيجيات التصميم المتجاوب.',
      de: 'Erstellen Sie Websites, die auf jedem Gerät großartig aussehen, mit bewährten Responsive-Design-Strategien.',
    },
    category: { en: 'Design', ar: 'تصميم', de: 'Design' },
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=500&fit=crop',
    date: '2024-11-15',
    readTime: 5,
    author: 'Mena Boules',
  },
];

const categories = [
  { en: 'All', ar: 'الكل', de: 'Alle' },
  { en: 'Design', ar: 'تصميم', de: 'Design' },
  { en: 'Development', ar: 'تطوير', de: 'Entwicklung' },
  { en: 'Branding', ar: 'علامات تجارية', de: 'Branding' },
  { en: 'Security', ar: 'أمان', de: 'Sicherheit' },
];

const Blog = () => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title[language as keyof typeof post.title]
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      post.category.en === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === 'ar' ? 'ar-EG' : language === 'de' ? 'de-DE' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>{t('blog.title')} | Mena Boules</title>
      <meta name="description" content={t('blog.subtitle')} />
      <link rel="canonical" href="https://menaboules.com/blog" />
      
      <Interactive3DScene />
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gradient-text">{t('blog.title')}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('blog.subtitle')}
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 space-y-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('blog.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.en}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.en)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.en
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:border-primary/50'
                  }`}
                >
                  {category[language as keyof typeof category]}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Blog Grid */}
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">{t('blog.noResults')}</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card overflow-hidden group hover-glow"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title[language as keyof typeof post.title]}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground">
                          {post.category[language as keyof typeof post.category]}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime} {t('blog.minRead')}
                        </span>
                      </div>
                      <h2 className="text-xl font-display font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title[language as keyof typeof post.title]}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {post.excerpt[language as keyof typeof post.excerpt]}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        {t('blog.readMore')}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
