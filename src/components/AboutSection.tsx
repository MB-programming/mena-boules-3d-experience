import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedWave, AnimatedPeace, GlowIcon } from './AnimatedIcon';
import menaProfile from '@/assets/mena-profile.png';

const experiences = [
  { company: 'Wida', role: 'Web Developer', period: 'Jan 2025 - Present' },
  { company: 'Sunweb Solution', role: 'Team Leader', period: 'Apr 2023 - Present' },
  { company: 'Pessarde', role: 'Senior Web Developer', period: 'Jan 2024 - Mar 2025' },
  { company: 'SUNGROUP', role: 'Team Leader', period: 'May 2020 - Present' },
  { company: 'Winmarket Agency', role: 'Team Leader', period: 'May 2020 - Present' },
  { company: 'Netlab Academy', role: 'CEO - Founder', period: 'Jan 2018' },
];

const AboutSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '5+', label: t('about.experience') },
    { value: '100+', label: t('about.projects') },
    { value: '50+', label: t('about.clients') },
  ];

  return (
    <section id="about" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="section-title mb-4">{t('about.title')}</h2>
          <div className="w-24 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-8 hover-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <motion.img
                  src={menaProfile}
                  alt="Mena Boules"
                  className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-primary/50 object-cover"
                  whileHover={{ scale: 1.05 }}
                />
                
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 text-2xl mb-2">
                    <span>{t('about.greeting')}</span>
                    <AnimatedWave />
                  </div>
                  <p className="text-muted-foreground mb-1">{t('about.iam')}</p>
                  <h3 className="text-2xl font-display font-bold gradient-text">
                    {t('about.fullname')}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t('about.description')}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('about.description2')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Experience & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Experience */}
            <div>
              <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
                Experience
              </h3>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="glass-card p-4 flex items-center gap-4 hover-glow"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {exp.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{exp.role} <span className="text-primary">@{exp.company}</span></p>
                      <p className="text-sm text-muted-foreground">{exp.period}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="glass-card p-4 text-center hover-glow"
                >
                  <div className="text-3xl md:text-4xl font-display font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="https://minaboules.com/wp-content/uploads/2025/10/Mena-Kelta-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline flex items-center gap-2"
              >
                <GlowIcon Icon={FileText} size={18} />
                {t('about.resume')}
              </motion.a>
              <motion.a
                href="https://wa.me/201222112819"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2"
              >
                <GlowIcon Icon={MessageCircle} size={18} />
                {t('about.hire')}
                <AnimatedPeace />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
