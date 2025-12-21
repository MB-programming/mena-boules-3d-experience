import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Eye, Search, Filter, Star, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'websites',
    description: 'Full-featured online store with payment integration and admin dashboard',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    tags: ['React', 'Node.js', 'Stripe'],
    price: '$299',
    rating: 4.9,
    sales: 156,
  },
  {
    id: 2,
    title: 'Dashboard UI Kit',
    category: 'uiux',
    description: 'Modern dashboard design with 100+ components and dark mode',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    tags: ['Figma', 'UI/UX', 'Components'],
    price: '$79',
    rating: 4.8,
    sales: 342,
  },
  {
    id: 3,
    title: 'Mobile Banking App',
    category: 'uiux',
    description: 'Complete mobile banking UI with transactions and analytics',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
    tags: ['Figma', 'Mobile', 'Finance'],
    price: '$129',
    rating: 5.0,
    sales: 89,
  },
  {
    id: 4,
    title: 'Corporate Website',
    category: 'websites',
    description: 'Professional business website with CMS and SEO optimization',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    tags: ['Next.js', 'Tailwind', 'SEO'],
    price: '$199',
    rating: 4.7,
    sales: 234,
  },
  {
    id: 5,
    title: 'SaaS Landing Page',
    category: 'websites',
    description: 'High-converting landing page with animations and integrations',
    image: 'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600&h=400&fit=crop',
    tags: ['React', 'Framer', 'Marketing'],
    price: '$149',
    rating: 4.9,
    sales: 567,
  },
  {
    id: 6,
    title: 'Health & Fitness App',
    category: 'apps',
    description: 'Complete fitness tracking app with workout plans and nutrition',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop',
    tags: ['React Native', 'Firebase', 'Health'],
    price: '$349',
    rating: 4.8,
    sales: 123,
  },
  {
    id: 7,
    title: 'Food Delivery UI',
    category: 'uiux',
    description: 'Complete food ordering app design with restaurant dashboard',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
    tags: ['Figma', 'Mobile', 'Food'],
    price: '$99',
    rating: 4.6,
    sales: 445,
  },
  {
    id: 8,
    title: 'Real Estate Platform',
    category: 'websites',
    description: 'Property listing website with map integration and virtual tours',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    tags: ['Vue.js', 'Maps', 'Real Estate'],
    price: '$399',
    rating: 4.9,
    sales: 78,
  },
];

const categories = [
  { key: 'all', label: 'projects.all' },
  { key: 'websites', label: 'projects.websites' },
  { key: 'uiux', label: 'projects.uiux' },
  { key: 'apps', label: 'projects.apps' },
];

const PortfolioSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-32 px-6 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">{t('projects.title')}</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground text-lg">{t('projects.subtitle')}</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(cat.label)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="glass-card overflow-hidden group hover-glow cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
                
                {/* Overlay Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                  className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-background/90 flex items-center justify-center text-primary"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-background/90 flex items-center justify-center text-primary"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-background/90 flex items-center justify-center text-red-500"
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </motion.div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/80 text-primary-foreground">
                    {t(`projects.${project.category === 'uiux' ? 'uiux' : project.category}`)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors truncate">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{project.rating}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xl font-display font-bold text-primary">{project.price}</span>
                  <span className="text-sm text-muted-foreground">{project.sales} sales</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No projects found</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;
