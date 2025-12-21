import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Figma, 
  Palette, 
  PenTool,
  FileCode2,
  Code2,
  Braces,
  Database,
  Layers,
  Sparkles,
  Box,
  Wind,
  Globe,
  ShoppingCart,
  Atom,
  Zap
} from 'lucide-react';

const skills = [
  { name: 'Figma', icon: Figma, category: 'Design', color: '#F24E1E' },
  { name: 'Illustrator', icon: Palette, category: 'Design', color: '#FF9A00' },
  { name: 'XD', icon: PenTool, category: 'Design', color: '#FF61F6' },
  { name: 'HTML5', icon: FileCode2, category: 'Frontend', color: '#E34F26' },
  { name: 'CSS3', icon: Code2, category: 'Frontend', color: '#1572B6' },
  { name: 'JavaScript', icon: Braces, category: 'Frontend', color: '#F7DF1E' },
  { name: 'PHP', icon: Database, category: 'Backend', color: '#777BB4' },
  { name: 'jQuery', icon: Layers, category: 'Frontend', color: '#0769AD' },
  { name: 'GSAP', icon: Sparkles, category: 'Frontend', color: '#88CE02' },
  { name: 'Bootstrap', icon: Box, category: 'Frontend', color: '#7952B3' },
  { name: 'Tailwind', icon: Wind, category: 'Frontend', color: '#06B6D4' },
  { name: 'WordPress', icon: Globe, category: 'CMS', color: '#21759B' },
  { name: 'PrestaShop', icon: ShoppingCart, category: 'CMS', color: '#DF0067' },
  { name: 'Next.js', icon: Zap, category: 'Frontend', color: '#ffffff' },
  { name: 'React', icon: Atom, category: 'Frontend', color: '#61DAFB' },
];

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

        {/* Skills Grid with Neon Icons */}
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
                scale: 1.15, 
                y: -10,
                transition: { duration: 0.2 }
              }}
              className="glass-card p-5 flex flex-col items-center gap-4 cursor-pointer group relative overflow-hidden"
              style={{
                '--skill-color': skill.color,
              } as React.CSSProperties}
            >
              {/* Neon glow background */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center, ${skill.color}20 0%, transparent 70%)`,
                }}
              />
              
              {/* Icon with neon effect */}
              <motion.div 
                className="relative z-10"
                animate={{ 
                  filter: [
                    `drop-shadow(0 0 3px ${skill.color}40)`,
                    `drop-shadow(0 0 8px ${skill.color}60)`,
                    `drop-shadow(0 0 3px ${skill.color}40)`
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: index * 0.1,
                  ease: "easeInOut"
                }}
              >
                <skill.icon 
                  size={36} 
                  style={{ color: skill.color }}
                  className="transition-all duration-300 group-hover:scale-110"
                />
              </motion.div>
              
              {/* Skill name */}
              <span 
                className="text-sm font-medium text-center relative z-10 transition-colors duration-300"
                style={{ 
                  textShadow: `0 0 20px ${skill.color}00`,
                }}
              >
                <motion.span
                  className="group-hover:text-white transition-colors"
                  style={{
                    textShadow: `0 0 10px ${skill.color}`,
                  }}
                >
                  {skill.name}
                </motion.span>
              </span>

              {/* Bottom neon line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)`,
                  boxShadow: `0 0 10px ${skill.color}, 0 0 20px ${skill.color}`,
                }}
              />
            </motion.div>
          ))}
          
          {/* And More */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.05 * skills.length }}
            whileHover={{ scale: 1.15, y: -10 }}
            className="glass-card p-5 flex flex-col items-center justify-center gap-4 cursor-pointer group relative overflow-hidden"
          >
            <motion.div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at center, hsl(var(--primary) / 0.2) 0%, transparent 70%)`,
              }}
            />
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="relative z-10"
            >
              <Sparkles size={36} className="text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-center text-primary relative z-10">
              And More...
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
