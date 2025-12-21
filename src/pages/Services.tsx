import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Palette, Code, Wrench, Shield, Terminal, Server, ArrowRight, MessageCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GlowIcon } from '../components/AnimatedIcon';

export const allServices = [
  {
    num: '01',
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Crafting modern, user-friendly interfaces and seamless experiences that combine creativity with functionality.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'User Testing', 'Design Systems'],
    price: 'From $500',
  },
  {
    num: '02',
    icon: Code,
    title: 'Web Development',
    description: 'Building responsive, high-performance websites using WordPress and other CMS platforms tailored to client needs.',
    features: ['React/Next.js', 'WordPress', 'E-Commerce', 'API Integration', 'Performance Optimization'],
    price: 'From $800',
  },
  {
    num: '03',
    icon: Wrench,
    title: 'Customization & Maintenance',
    description: 'Customizing themes, plugins, and delivering ongoing support to ensure smooth and scalable website performance.',
    features: ['Theme Customization', 'Plugin Development', 'Bug Fixes', 'Updates & Backups', '24/7 Support'],
    price: 'From $200/mo',
  },
  {
    num: '04',
    icon: Shield,
    title: 'Problem Solving & Security',
    description: 'Providing solutions for technical issues, performance optimization, and securing websites against vulnerabilities.',
    features: ['Security Audits', 'Malware Removal', 'SSL Setup', 'Performance Tuning', 'Firewall Setup'],
    price: 'From $300',
  },
  {
    num: '05',
    icon: Terminal,
    title: 'Custom Coding & Web Applications',
    description: 'Developing tailored web applications and private coding solutions to match unique business needs.',
    features: ['Custom Dashboards', 'SaaS Development', 'API Development', 'Database Design', 'Third-party Integrations'],
    price: 'From $1,500',
  },
  {
    num: '06',
    icon: Server,
    title: 'Systems & Infrastructure',
    description: 'Managing systems and servers to ensure reliable performance, scalability, and security.',
    features: ['Server Setup', 'Cloud Migration', 'DevOps', 'Monitoring', 'Scalability Planning'],
    price: 'From $400',
  },
  {
    num: '07',
    icon: Palette,
    title: 'Brand Identity Design',
    description: 'Creating unique visual identities that capture the essence of your brand and resonate with your target audience.',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Marketing Materials', 'Social Media Assets'],
    price: 'From $600',
  },
  {
    num: '08',
    icon: Code,
    title: 'Mobile-First Development',
    description: 'Building mobile-optimized websites and progressive web apps that work seamlessly across all devices.',
    features: ['PWA Development', 'Responsive Design', 'Touch Optimization', 'Offline Support', 'App-like Experience'],
    price: 'From $1,000',
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              My <span className="gradient-text">Services</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Professional web development and design services tailored to bring your vision to life
            </p>
            <a
              href="https://wa.me/201222112819"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Get a Quote
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {allServices.map((service, index) => (
              <motion.div
                key={service.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-8 group hover-glow"
              >
                <div className="flex items-start gap-6">
                  <span className="text-5xl font-display font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                    {service.num}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <GlowIcon Icon={service.icon} size={24} />
                      </div>
                      <h3 className="font-display font-bold text-xl group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">Starting</span>
                        <p className="text-xl font-display font-bold gradient-text">{service.price}</p>
                      </div>
                      <motion.a
                        href={`https://wa.me/201222112819?text=Hi, I'm interested in ${service.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-outline text-sm py-2 px-4 inline-flex items-center gap-2"
                      >
                        Inquire <ArrowRight className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Let's discuss your ideas and create something amazing together. Get in touch today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/201222112819"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
                <Link to="/projects" className="btn-outline inline-flex items-center justify-center gap-2">
                  View My Work <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
