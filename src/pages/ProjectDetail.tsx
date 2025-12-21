import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Tag, Code, CheckCircle, MessageCircle, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GlowIcon } from '../components/AnimatedIcon';
import { allProjects } from './Projects';
import { useToast } from '@/hooks/use-toast';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const project = allProjects.find(p => p.slug === slug);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Project Not Found</h1>
          <Link to="/projects" className="btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Request Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: '', email: '', phone: '', budget: '', description: '' });
    setIsSubmitting(false);
  };

  const features = [
    'Responsive Design',
    'SEO Optimized',
    'Fast Loading Speed',
    'Modern UI/UX',
    'Cross-Browser Compatible',
    'Mobile First Approach',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="glass-card overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 left-6 right-6 glass-card p-4 flex justify-around"
              >
                <div className="text-center">
                  <div className="text-2xl font-display font-bold gradient-text">100%</div>
                  <div className="text-xs text-muted-foreground">Satisfaction</div>
                </div>
                <div className="text-center border-x border-border px-6">
                  <div className="text-2xl font-display font-bold gradient-text">2 Weeks</div>
                  <div className="text-xs text-muted-foreground">Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-bold gradient-text">3 Revisions</div>
                  <div className="text-xs text-muted-foreground">Included</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:pt-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  {project.category}
                </span>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> 2024
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {project.title}
              </h1>
              
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card border border-border text-sm">
                    <Tag className="w-3 h-3 text-primary" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Technologies */}
              <div className="glass-card p-4 mb-6">
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <GlowIcon Icon={Code} size={18} />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Starting from</div>
                  <div className="text-3xl font-display font-bold gradient-text">{project.price}</div>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2"
                >
                  Live Preview <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features & Request Form */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-display font-bold mb-6">What's Included</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-card p-4 flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Related Projects */}
            <h2 className="text-2xl font-display font-bold mt-12 mb-6">Similar Projects</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {allProjects.filter(p => p.id !== project.id).slice(0, 2).map((p) => (
                <Link key={p.id} to={`/project/${p.slug}`} className="glass-card overflow-hidden group hover-glow">
                  <img src={p.image} alt={p.title} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h4 className="font-display font-semibold group-hover:text-primary transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-8 sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">Request Similar Project</h2>
                  <p className="text-sm text-muted-foreground">Get a quote within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="+20 XXX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select budget</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2500">$1,000 - $2,500</option>
                      <option value="2500-5000">$2,500 - $5,000</option>
                      <option value="5000+">$5,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Project Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="Describe your project requirements..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Request Quote
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
