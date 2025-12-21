import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, Clock, Users, BookOpen, Star, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const courses = [
  {
    id: 1,
    title: 'Complete React Masterclass',
    titleAr: 'دورة React الشاملة',
    description: 'Learn React from scratch to advanced concepts including hooks, context, and Redux',
    descriptionAr: 'تعلم React من الصفر إلى المفاهيم المتقدمة بما في ذلك hooks و context و Redux',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 42,
    lessons: 156,
    students: 2450,
    rating: 4.9,
    price: '$99',
    originalPrice: '$199',
    level: 'Beginner to Advanced',
    tags: ['React', 'JavaScript', 'Frontend'],
  },
  {
    id: 2,
    title: 'UI/UX Design Fundamentals',
    titleAr: 'أساسيات تصميم UI/UX',
    description: 'Master the principles of user interface and user experience design with Figma',
    descriptionAr: 'أتقن مبادئ تصميم واجهات المستخدم وتجربة المستخدم باستخدام Figma',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 28,
    lessons: 89,
    students: 1830,
    rating: 4.8,
    price: '$79',
    originalPrice: '$159',
    level: 'Beginner',
    tags: ['Figma', 'UI/UX', 'Design'],
  },
  {
    id: 3,
    title: 'Full-Stack Web Development',
    titleAr: 'تطوير الويب المتكامل',
    description: 'Build complete web applications with Node.js, Express, MongoDB, and React',
    descriptionAr: 'بناء تطبيقات ويب كاملة باستخدام Node.js و Express و MongoDB و React',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 65,
    lessons: 234,
    students: 3200,
    rating: 5.0,
    price: '$149',
    originalPrice: '$299',
    level: 'Intermediate',
    tags: ['Node.js', 'MongoDB', 'Full-Stack'],
  },
  {
    id: 4,
    title: 'TypeScript Deep Dive',
    titleAr: 'الغوص في TypeScript',
    description: 'Advanced TypeScript patterns, generics, and best practices for large applications',
    descriptionAr: 'أنماط TypeScript المتقدمة والأنماط العامة وأفضل الممارسات للتطبيقات الكبيرة',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 18,
    lessons: 67,
    students: 1120,
    rating: 4.9,
    price: '$69',
    originalPrice: '$139',
    level: 'Advanced',
    tags: ['TypeScript', 'JavaScript', 'Frontend'],
  },
];

const CoursesSection = () => {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="courses" className="py-32 px-6 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">{t('courses.title')}</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground text-lg">{t('courses.subtitle')}</p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * index }}
              onMouseEnter={() => setHoveredId(course.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="glass-card overflow-hidden group hover-glow"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="relative lg:w-2/5 h-56 lg:h-auto overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: hoveredId === course.id ? 1 : 0, scale: hoveredId === course.id ? 1 : 0.8 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg"
                      style={{ boxShadow: '0 0 30px hsl(var(--primary) / 0.5)' }}
                    >
                      <Play className="w-7 h-7 ml-1" fill="currentColor" />
                    </motion.button>
                  </motion.div>

                  {/* Level Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-background/90 backdrop-blur-sm text-primary">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-3/5 p-6 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      {language === 'ar' ? course.titleAr : course.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {language === 'ar' ? course.descriptionAr : course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration} {t('courses.hours')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.lessons} {t('courses.lessons')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()} {t('courses.students')}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-display font-bold text-primary">{course.price}</span>
                        <span className="text-sm text-muted-foreground line-through">{course.originalPrice}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
                    >
                      {t('courses.enroll')}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
