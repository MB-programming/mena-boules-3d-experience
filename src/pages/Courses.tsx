import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star, 
  Play,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { GlowIcon, FloatIcon } from '@/components/AnimatedIcon';

const allCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, and modern frameworks from scratch to professional level',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 60,
    lessons: 200,
    students: 5000,
    rating: 4.9,
    reviews: 450,
    price: 49,
    originalPrice: 99,
    level: 'Beginner to Advanced',
    category: 'Web Development',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    bestseller: true,
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    description: 'Master Figma, Adobe XD, and create stunning user interfaces with modern design principles',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 35,
    lessons: 120,
    students: 3200,
    rating: 4.8,
    reviews: 280,
    price: 39,
    originalPrice: 79,
    level: 'Beginner',
    category: 'Design',
    tags: ['Figma', 'XD', 'UI Design'],
    bestseller: false,
  },
  {
    id: 3,
    title: 'WordPress Development Complete',
    description: 'Build professional websites, customize themes, and create plugins from scratch',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 45,
    lessons: 150,
    students: 4500,
    rating: 5.0,
    reviews: 380,
    price: 59,
    originalPrice: 119,
    level: 'Intermediate',
    category: 'CMS',
    tags: ['WordPress', 'PHP', 'Themes'],
    bestseller: true,
  },
  {
    id: 4,
    title: 'React.js from Zero to Hero',
    description: 'Complete React course with hooks, context, Redux, and real-world projects',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 40,
    lessons: 180,
    students: 2800,
    rating: 4.9,
    reviews: 220,
    price: 45,
    originalPrice: 89,
    level: 'Intermediate',
    category: 'Web Development',
    tags: ['React', 'JavaScript', 'Redux'],
    bestseller: false,
  },
  {
    id: 5,
    title: 'JavaScript Advanced Concepts',
    description: 'Deep dive into closures, prototypes, async/await, and performance optimization',
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 25,
    lessons: 90,
    students: 1900,
    rating: 4.7,
    reviews: 150,
    price: 35,
    originalPrice: 69,
    level: 'Advanced',
    category: 'Web Development',
    tags: ['JavaScript', 'ES6+', 'Performance'],
    bestseller: false,
  },
  {
    id: 6,
    title: 'Tailwind CSS Complete Guide',
    description: 'Master utility-first CSS with Tailwind, build responsive designs faster',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop',
    instructor: 'Mena Boules',
    duration: 20,
    lessons: 75,
    students: 2100,
    rating: 4.8,
    reviews: 180,
    price: 29,
    originalPrice: 59,
    level: 'Beginner',
    category: 'Web Development',
    tags: ['Tailwind', 'CSS', 'Responsive'],
    bestseller: false,
  },
];

const categories = ['All', 'Web Development', 'Design', 'CMS'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.level.includes(selectedLevel);
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FloatIcon Icon={GraduationCap} size={40} className="text-primary" />
              <h1 className="text-4xl md:text-5xl font-display font-bold">All Courses</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Learn from professional courses and boost your career with practical skills
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 rounded-xl bg-input border border-border focus:border-primary outline-none cursor-pointer min-w-[160px]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Level Filter */}
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 rounded-xl bg-input border border-border focus:border-primary outline-none cursor-pointer min-w-[160px]"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredCourses.length}</span> courses
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/course/${course.id}`}
                  className="glass-card overflow-hidden group hover-glow block h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    
                    {/* Bestseller Badge */}
                    {course.bestseller && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-xs font-bold rounded-lg bg-yellow-500 text-black">
                          BESTSELLER
                        </span>
                      </div>
                    )}

                    {/* Play Button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                        <Play className="w-6 h-6 ml-1" fill="currentColor" />
                      </div>
                    </motion.div>

                    {/* Level Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-lg bg-background/90 backdrop-blur-sm text-primary">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-display font-bold text-primary">${course.price}</span>
                        <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                      </div>
                      <span className="text-xs text-green-500 font-medium">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">No courses found</p>
              <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
