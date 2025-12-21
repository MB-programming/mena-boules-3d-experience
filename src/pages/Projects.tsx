import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ExternalLink, Eye, ArrowRight, Grid, LayoutList } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GlowIcon } from '../components/AnimatedIcon';

// Import project images
import boImg from '@/assets/projects/bo.jpg';
import cozmeticImg from '@/assets/projects/cozmetic.jpg';
import xendouImg from '@/assets/projects/xendou.jpg';
import blvckImg from '@/assets/projects/blvck.jpg';

export const allProjects = [
  {
    id: 1,
    title: 'B & O',
    slug: 'b-and-o',
    category: 'branding',
    description: 'Premium audio brand with elegant marketing site design and sophisticated visual identity.',
    image: boImg,
    tags: ['Branding', 'Web Design', 'Development'],
    link: 'https://minaboules.com/portfolio/b-o/',
    price: '$1,500',
    technologies: ['React', 'GSAP', 'Tailwind CSS'],
  },
  {
    id: 2,
    title: 'Cozmetic',
    slug: 'cozmetic',
    category: 'uiux',
    description: 'Beauty e-commerce platform with stunning product showcases and seamless shopping experience.',
    image: cozmeticImg,
    tags: ['UI/UX', 'E-Commerce', 'Beauty'],
    link: 'https://minaboules.com/portfolio/cozmetic/',
    price: '$2,000',
    technologies: ['Next.js', 'Shopify', 'Framer Motion'],
  },
  {
    id: 3,
    title: 'Xendou',
    slug: 'xendou',
    category: 'product',
    description: 'SaaS platform with intuitive dashboard design and powerful analytics features.',
    image: xendouImg,
    tags: ['Product', 'Web App', 'SaaS'],
    link: 'https://minaboules.com/portfolio/xendou/',
    price: '$3,000',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 4,
    title: 'Blvck',
    slug: 'blvck',
    category: 'branding',
    description: 'Luxury lifestyle brand with dark aesthetic and minimalist design approach.',
    image: blvckImg,
    tags: ['Branding', 'Dark Theme', 'Luxury'],
    link: 'https://minaboules.com/portfolio/blvck/',
    price: '$2,500',
    technologies: ['WordPress', 'Custom Theme', 'WooCommerce'],
  },
];

const categories = [
  { key: 'all', label: 'All Projects' },
  { key: 'branding', label: 'Branding' },
  { key: 'product', label: 'Product Design' },
  { key: 'uiux', label: 'UI/UX Design' },
  { key: 'website', label: 'Websites' },
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredProjects = allProjects.filter((project) => {
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore my portfolio of web development, UI/UX design, and branding projects
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:border-primary'}`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 flex-wrap mb-10"
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-card border border-border hover:border-primary text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid/List */}
          <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
            {filteredProjects.map((project, index) => (
              viewMode === 'grid' ? (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="glass-card overflow-hidden group hover-glow"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      animate={{ scale: hoveredId === project.id ? 1.1 : 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {project.price}
                    </div>

                    {/* Hover Actions */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                      className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center gap-3"
                    >
                      <Link
                        to={`/project/${project.slug}`}
                        className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center text-primary hover:scale-110 transition-transform"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-background/90 flex items-center justify-center text-primary hover:scale-110 transition-transform"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <Link to={`/project/${project.slug}`}>
                      <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="glass-card p-4 flex gap-6 items-center hover-glow"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg mb-1">{project.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{project.description}</p>
                    <div className="flex gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-bold mb-2">{project.price}</div>
                    <Link
                      to={`/project/${project.slug}`}
                      className="btn-primary text-sm py-2 px-4 inline-flex items-center gap-2"
                    >
                      View <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">No projects found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;
