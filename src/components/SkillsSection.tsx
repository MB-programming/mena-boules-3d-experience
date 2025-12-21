import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Skill icons from the website
const skills = [
  { name: 'Figma', icon: 'https://minaboules.com/wp-content/uploads/2024/08/figma-icon.png', category: 'Design' },
  { name: 'Illustrator', icon: 'https://minaboules.com/wp-content/uploads/2024/08/Ai-icon.png', category: 'Design' },
  { name: 'XD', icon: 'https://minaboules.com/wp-content/uploads/2025/10/images-1.png', category: 'Design' },
  { name: 'HTML5', icon: 'https://minaboules.com/wp-content/uploads/2025/10/HTML5.webp', category: 'Frontend' },
  { name: 'CSS3', icon: 'https://minaboules.com/wp-content/uploads/2025/10/css3-square-e1759403344295.png', category: 'Frontend' },
  { name: 'JavaScript', icon: 'https://minaboules.com/wp-content/uploads/2025/10/image-1.png', category: 'Frontend' },
  { name: 'PHP', icon: 'https://minaboules.com/wp-content/uploads/2025/10/php-1-logo-png-transparent.png', category: 'Backend' },
  { name: 'jQuery', icon: 'https://minaboules.com/wp-content/uploads/2025/10/0_eFomJUFua8tuqe8g.png', category: 'Frontend' },
  { name: 'GSAP', icon: 'https://minaboules.com/wp-content/uploads/2025/10/2386673.png', category: 'Frontend' },
  { name: 'Bootstrap', icon: 'https://minaboules.com/wp-content/uploads/2025/10/bootstrap-stack.png', category: 'Frontend' },
  { name: 'Tailwind', icon: 'https://minaboules.com/wp-content/uploads/2025/10/tailwind-css-logo-rounded-free-png.webp', category: 'Frontend' },
  { name: 'WordPress', icon: 'https://minaboules.com/wp-content/uploads/2025/10/WordPress.com-Logo.wine_-scaled.png', category: 'CMS' },
  { name: 'PrestaShop', icon: 'https://minaboules.com/wp-content/uploads/2025/10/825533.png', category: 'CMS' },
  { name: 'Next.js', icon: 'https://minaboules.com/wp-content/uploads/2025/10/dango-inner-2.webp', category: 'Frontend' },
  { name: 'React', icon: 'https://minaboules.com/wp-content/uploads/2025/10/react-icon_svg_.webp', category: 'Frontend' },
];

const categories = ['All', 'Design', 'Frontend', 'Backend', 'CMS'];

const SkillsSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="section-title mb-4">{t('skills.title')}</h2>
          <div className="w-24 h-1 bg-primary rounded-full mb-4" />
          <p className="text-muted-foreground text-lg">{t('skills.subtitle')}</p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * index }}
              whileHover={{ 
                scale: 1.1, 
                y: -10,
                transition: { duration: 0.2 }
              }}
              className="glass-card p-4 flex flex-col items-center gap-3 hover-glow cursor-pointer group"
            >
              <motion.div 
                className="w-12 h-12 flex items-center justify-center"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              >
                <img 
                  src={skill.icon} 
                  alt={skill.name}
                  className="w-full h-full object-contain filter group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]"
                />
              </motion.div>
              <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                {skill.name}
              </span>
            </motion.div>
          ))}
          
          {/* And More */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.05 * skills.length }}
            whileHover={{ scale: 1.1, y: -10 }}
            className="glass-card p-4 flex flex-col items-center justify-center gap-3 hover-glow cursor-pointer group bg-primary/5"
          >
            <motion.span 
              className="text-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <span className="text-sm font-medium text-center text-primary">
              And More...
            </span>
          </motion.div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {categories.map((category, index) => (
            <motion.span
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary cursor-pointer transition-all"
            >
              {category}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
