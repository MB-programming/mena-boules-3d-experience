import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Interactive3DScene from '../components/Interactive3DScene';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import CoursesSection from '../components/CoursesSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { LanguageProvider } from '../contexts/LanguageContext';

// Import project images for preview
import boImg from '@/assets/projects/bo.jpg';
import cozmeticImg from '@/assets/projects/cozmetic.jpg';
import xendouImg from '@/assets/projects/xendou.jpg';

const projectsPreview = [
  { id: 1, title: 'B & O', image: boImg, slug: 'b-and-o' },
  { id: 2, title: 'Cozmetic', image: cozmeticImg, slug: 'cozmetic' },
  { id: 3, title: 'Xendou', image: xendouImg, slug: 'xendou' },
];

const Index = () => {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-background overflow-x-hidden">
        {/* Interactive 3D Background */}
        <Suspense fallback={null}>
          <Interactive3DScene />
        </Suspense>

        {/* Content */}
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          
          {/* Projects Preview Section */}
          <section id="projects" className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="section-title mb-4">Featured Projects</h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-4" />
                <p className="text-muted-foreground text-lg">Some of my recent work</p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {projectsPreview.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -10 }}
                    className="glass-card overflow-hidden group hover-glow"
                  >
                    <Link to={`/project/${project.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
                  View All Projects <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </section>

          <CoursesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
