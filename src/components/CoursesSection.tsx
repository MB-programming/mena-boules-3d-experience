import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Users, BookOpen, Star, ChevronRight, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { GlowIcon, FloatIcon } from './AnimatedIcon';

const courses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    titleAr: 'دورة تطوير الويب الشاملة',
    description: 'Learn HTML, CSS, JavaScript, and modern frameworks from scratch to professional level',
    descriptionAr: 'تعلم HTML و CSS و JavaScript والأطر الحديثة من الصفر إلى المستوى الاحترافي',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 60,
    lessons: 200,
    students: 5000,
    rating: 4.9,
    price: '$49',
    originalPrice: '$99',
    level: 'Beginner to Advanced',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    platform: 'Udemy',
    link: 'https://www.udemy.com',
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    titleAr: 'ماستركلاس تصميم UI/UX',
    description: 'Master Figma, Adobe XD, and create stunning user interfaces with modern design principles',
    descriptionAr: 'أتقن Figma و Adobe XD وأنشئ واجهات مستخدم مذهلة بمبادئ التصميم الحديثة',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 35,
    lessons: 120,
    students: 3200,
    rating: 4.8,
    price: '$39',
    originalPrice: '$79',
    level: 'Beginner',
    tags: ['Figma', 'XD', 'UI Design'],
    platform: 'TeraCourses',
    link: 'https://teracourses.com',
  },
  {
    id: 3,
    title: 'WordPress Development Complete',
    titleAr: 'تطوير WordPress الكامل',
    description: 'Build professional websites, customize themes, and create plugins from scratch',
    descriptionAr: 'بناء مواقع احترافية وتخصيص القوالب وإنشاء الإضافات من الصفر',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 45,
    lessons: 150,
    students: 4500,
    rating: 5.0,
    price: '$59',
    originalPrice: '$119',
    level: 'Intermediate',
    tags: ['WordPress', 'PHP', 'Themes'],
    platform: 'Maaref',
    link: 'https://m3aarf.com',
  },
  {
    id: 4,
    title: 'React.js from Zero to Hero',
    titleAr: 'React.js من الصفر إلى الاحتراف',
    description: 'Complete React course with hooks, context, Redux, and real-world projects',
    descriptionAr: 'دورة React كاملة مع hooks و context و Redux ومشاريع حقيقية',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 40,
    lessons: 180,
    students: 2800,
    rating: 4.9,
    price: '$45',
    originalPrice: '$89',
    level: 'Intermediate',
    tags: ['React', 'JavaScript', 'Redux'],
    platform: 'IT Sharks',
    link: 'https://itsharks.com',
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

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <FloatIcon Icon={GraduationCap} size={32} className="text-primary" />
            <h2 className="section-title">{t('courses.title')}</h2>
          </div>
          <div className="w-24 h-1 bg-primary rounded-full mb-4" />
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

                  {/* Platform Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-background/90 backdrop-blur-sm text-primary">
                      {course.platform}
                    </span>
                  </div>

                  {/* Level Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/90 text-primary-foreground">
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
                        <GlowIcon Icon={Clock} size={16} delay={index * 0.2} />
                        <span>{course.duration} {t('courses.hours')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <GlowIcon Icon={BookOpen} size={16} delay={index * 0.2 + 0.1} />
                        <span>{course.lessons} {t('courses.lessons')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <GlowIcon Icon={Users} size={16} delay={index * 0.2 + 0.2} />
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
                    
                    <Link
                      to={`/course/${course.id}`}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:scale-105 transition-transform"
                    >
                      {t('courses.enroll')}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
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
