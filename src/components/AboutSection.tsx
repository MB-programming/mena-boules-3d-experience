import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, MessageCircle, Briefcase, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedWave, AnimatedPeace, GlowIcon } from './AnimatedIcon';
import ExperienceSlider from './ExperienceSlider';
import CertificatesSection from './CertificatesSection';
import menaProfile from '@/assets/mena-profile.png';

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
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="section-title mb-4">{t('about.title')}</h2>
          <div className="w-24 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-card p-6 hover-glow relative overflow-hidden sticky top-24">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <motion.img
                  src={menaProfile}
                  alt="Mena Boules"
                  className="w-28 h-28 mx-auto mb-4 rounded-full border-2 border-primary/50 object-cover"
                  whileHover={{ scale: 1.05 }}
                />
                
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 text-lg mb-1">
                    <span>{t('about.greeting')}</span>
                    <AnimatedWave />
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">{t('about.iam')}</p>
                  <h3 className="text-xl font-display font-bold gradient-text">
                    {t('about.fullname')}
                  </h3>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t('about.description')}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      className="glass-card p-3 text-center"
                    >
                      <div className="text-xl font-display font-bold gradient-text">
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-2">
                  <motion.a
                    href="https://minaboules.com/wp-content/uploads/2025/10/Mena-Kelta-cv.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-outline flex items-center justify-center gap-2 text-sm py-2"
                  >
                    <GlowIcon Icon={FileText} size={16} />
                    {t('about.resume')}
                  </motion.a>
                  <motion.a
                    href="https://wa.me/201222112819"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary flex items-center justify-center gap-2 text-sm py-2"
                  >
                    <GlowIcon Icon={MessageCircle} size={16} />
                    {t('about.hire')}
                    <AnimatedPeace />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Experience Slider */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <GlowIcon Icon={Briefcase} size={24} className="text-primary" />
              Companies I Worked With
            </h3>
            <ExperienceSlider />
          </motion.div>

          {/* Education & Certificates */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <GlowIcon Icon={Award} size={24} className="text-primary" />
              Education & Certificates
            </h3>
            <CertificatesSection />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
