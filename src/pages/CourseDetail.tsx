import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Award,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ShoppingCart,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { GlowIcon } from '@/components/AnimatedIcon';
import menaProfile from '@/assets/mena-profile.png';

const courseData = {
  id: 1,
  title: 'Complete Web Development Bootcamp',
  description: 'Learn HTML, CSS, JavaScript, and modern frameworks from scratch to professional level. This comprehensive course covers everything you need to become a full-stack web developer.',
  longDescription: `This course is designed to take you from complete beginner to a professional web developer. You'll learn by building real-world projects and gain hands-on experience with the latest technologies.

By the end of this course, you will be able to:
• Build responsive websites using HTML, CSS, and JavaScript
• Create dynamic web applications with React
• Understand backend development with Node.js
• Deploy your applications to the web
• Work with databases and APIs`,
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
  instructor: {
    name: 'Mena Boules',
    avatar: menaProfile,
    bio: 'Award-winning web developer and instructor with 5+ years of experience',
    students: 15000,
    courses: 12,
  },
  duration: 60,
  lessons: 200,
  students: 5000,
  rating: 4.9,
  reviews: 450,
  price: 49,
  originalPrice: 99,
  level: 'Beginner to Advanced',
  category: 'Web Development',
  language: 'English / Arabic',
  lastUpdated: 'December 2024',
  features: [
    '60+ hours of video content',
    '200 comprehensive lessons',
    'Lifetime access',
    'Certificate of completion',
    'Project files included',
    '24/7 support',
  ],
  curriculum: [
    {
      title: 'Getting Started',
      lessons: [
        { title: 'Course Introduction', duration: '5:30', preview: true },
        { title: 'Setting Up Your Environment', duration: '12:45', preview: true },
        { title: 'Understanding Web Development', duration: '8:20', preview: false },
      ],
    },
    {
      title: 'HTML Fundamentals',
      lessons: [
        { title: 'HTML Structure', duration: '15:00', preview: false },
        { title: 'Working with Text', duration: '10:30', preview: false },
        { title: 'Links and Images', duration: '12:00', preview: false },
        { title: 'Forms and Inputs', duration: '18:45', preview: false },
      ],
    },
    {
      title: 'CSS Styling',
      lessons: [
        { title: 'CSS Basics', duration: '14:20', preview: false },
        { title: 'Box Model', duration: '11:00', preview: false },
        { title: 'Flexbox Layout', duration: '20:30', preview: false },
        { title: 'CSS Grid', duration: '22:15', preview: false },
        { title: 'Responsive Design', duration: '25:00', preview: false },
      ],
    },
    {
      title: 'JavaScript Essentials',
      lessons: [
        { title: 'Variables and Data Types', duration: '16:40', preview: false },
        { title: 'Functions', duration: '18:30', preview: false },
        { title: 'DOM Manipulation', duration: '24:00', preview: false },
        { title: 'Events', duration: '15:45', preview: false },
      ],
    },
  ],
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleEnroll = () => {
    toast.success('Redirecting to checkout...');
    navigate('/checkout', {
      state: {
        type: 'course',
        title: courseData.title,
        price: courseData.price,
        image: courseData.image,
        courseId: id,
      },
    });
  };

  const totalLessons = courseData.curriculum.reduce((acc, section) => acc + section.lessons.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-20">
        <div className="absolute inset-0 h-[400px]">
          <img
            src={courseData.image}
            alt={courseData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        <div className="relative pt-12 pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            <Link 
              to="/courses" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-lg bg-primary/20 text-primary">
                    {courseData.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    {courseData.title}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6">
                    {courseData.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-semibold">{courseData.rating}</span>
                      <span className="text-muted-foreground">({courseData.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span>{courseData.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      <span>{courseData.duration} hours</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="w-5 h-5" />
                      <span>{courseData.lessons} lessons</span>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-4">
                    <img
                      src={courseData.instructor.avatar}
                      alt={courseData.instructor.name}
                      className="w-12 h-12 rounded-full border-2 border-primary/30"
                    />
                    <div>
                      <p className="font-medium">Created by <span className="text-primary">{courseData.instructor.name}</span></p>
                      <p className="text-sm text-muted-foreground">Last updated {courseData.lastUpdated}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Enrollment Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:row-span-2"
              >
                <div className="glass-card p-6 sticky top-24">
                  {/* Preview */}
                  <div className="relative mb-6 rounded-xl overflow-hidden">
                    <img
                      src={courseData.image}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-7 h-7 ml-1 text-primary-foreground" fill="currentColor" />
                      </div>
                    </motion.button>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl font-display font-bold text-primary">${courseData.price}</span>
                    <span className="text-xl text-muted-foreground line-through">${courseData.originalPrice}</span>
                    <span className="text-green-500 font-medium">
                      {Math.round((1 - courseData.price / courseData.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEnroll}
                      className="w-full btn-primary py-3.5 text-lg font-medium flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Enroll Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsWishlisted(!isWishlisted);
                        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                      }}
                      className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 border transition-all ${
                        isWishlisted 
                          ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                      {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                    </motion.button>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="font-medium">This course includes:</p>
                    {courseData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="lg:max-w-2xl">
            {/* What You'll Learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 mb-8"
            >
              <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <GlowIcon Icon={Award} size={24} className="text-primary" />
                What You'll Learn
              </h2>
              <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-line">
                {courseData.longDescription}
              </div>
            </motion.div>

            {/* Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                  <GlowIcon Icon={BookOpen} size={24} className="text-primary" />
                  Course Curriculum
                </h2>
                <span className="text-sm text-muted-foreground">
                  {courseData.curriculum.length} sections • {totalLessons} lessons
                </span>
              </div>

              <div className="space-y-3">
                {courseData.curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="glass-card overflow-hidden">
                    <button
                      onClick={() => toggleSection(sectionIndex)}
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                          {sectionIndex + 1}
                        </span>
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {section.lessons.length} lessons
                        </span>
                        {expandedSections.includes(sectionIndex) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {expandedSections.includes(sectionIndex) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border"
                      >
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.preview ? (
                                <Play className="w-5 h-5 text-primary" />
                              ) : (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                              )}
                              <span className={lesson.preview ? 'text-primary' : 'text-muted-foreground'}>
                                {lesson.title}
                              </span>
                              {lesson.preview && (
                                <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                                  Preview
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
