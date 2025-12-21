import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Eye, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { GlowIcon } from './AnimatedIcon';

// Import project images
import boImg from '@/assets/projects/bo.jpg';
import cozmeticImg from '@/assets/projects/cozmetic.jpg';
import xendouImg from '@/assets/projects/xendou.jpg';
import blvckImg from '@/assets/projects/blvck.jpg';

const projects = [
  {
    id: 1,
    title: 'B & O',
    category: 'branding',
    description: 'Marketing site design and build',
    image: boImg,
    tags: ['Branding', 'Web Design', 'Development'],
    link: 'https://minaboules.com/portfolio/b-o/',
  },
  {
    id: 2,
    title: 'Cozmetic',
    category: 'uiux',
    description: 'Marketing site design and build',
    image: cozmeticImg,
    tags: ['UI/UX', 'E-Commerce', 'Beauty'],
    link: 'https://minaboules.com/portfolio/cozmetic/',
  },
  {
    id: 3,
    title: 'Xendou',
    category: 'product',
    description: 'Marketing site design and build',
    image: xendouImg,
    tags: ['Product', 'Web App', 'SaaS'],
    link: 'https://minaboules.com/portfolio/xendou/',
  },
  {
    id: 4,
    title: 'Blvck',
    category: 'branding',
    description: 'Marketing site design and build',
    image: blvckImg,
    tags: ['Branding', 'Dark Theme', 'Luxury'],
    link: 'https://minaboules.com/portfolio/blvck/',
  },
];

const categories = [
  { key: 'all', label: 'projects.all' },
  { key: 'branding', label: 'projects.branding' },
  { key: 'product', label: 'projects.product' },
  { key: 'uiux', label: 'projects.uiux' },
];

const PortfolioSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredProjects = projects.filter((project) => {
    return activeCategory === 'all' || project.category === activeCategory;
  });

  return (
    <section id="projects" className="py-32 px-6 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="section-title mb-4">{t('projects.title')}</h2>
          <div className="w-24 h-1 bg-primary rounded-full mb-4" />
          <p className="text-muted-foreground text-lg">{t('projects.subtitle')}</p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3 flex-wrap mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === cat.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(cat.label)}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 gap-8">
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
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredId === project.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
                
                {/* Overlay Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                  className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center gap-4"
                >
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center text-primary"
                  >
                    <GlowIcon Icon={Eye} size={22} />
                  </motion.a>
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center text-primary"
                  >
                    <GlowIcon Icon={ExternalLink} size={22} />
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center text-red-500"
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="font-display font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </a>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a 
            href="https://minaboules.com/#works"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            View All Works
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
