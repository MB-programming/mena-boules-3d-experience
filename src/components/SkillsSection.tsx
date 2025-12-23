import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles } from 'lucide-react';
import { useSkills } from '@/hooks/useSkills';

const SkillsSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { data: skills = [], isLoading } = useSkills();

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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="glass-card p-5 flex flex-col items-center gap-4 animate-pulse">
                <div className="w-9 h-9 bg-muted rounded-full" />
                <div className="w-16 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Skills Grid with Neon Icons */}
        {!isLoading && (
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
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
