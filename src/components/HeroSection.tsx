import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedSparkle, GlowIcon, FloatIcon } from './AnimatedIcon';
import VideoPopup from './VideoPopup';
import menaProfile from '@/assets/mena-profile.png';

const HeroSection = () => {
  const { t } = useLanguage();
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-2 justify-center lg:justify-start mb-4"
            >
              <AnimatedSparkle />
              <span className="text-primary font-medium text-lg md:text-xl">
                {t('hero.title')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
            >
              {t('hero.tagline').split(' ').slice(0, -2).join(' ')}{' '}
              <span className="gradient-text glow-text">{t('hero.tagline').split(' ').slice(-2).join(' ')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8"
            >
              <a href="#projects" className="btn-primary">
                {t('hero.cta')}
              </a>
              <motion.button
                onClick={() => setIsVideoOpen(true)}
                className="group flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    boxShadow: [
                      '0 0 20px hsl(var(--primary) / 0.3)',
                      '0 0 40px hsl(var(--primary) / 0.5)',
                      '0 0 20px hsl(var(--primary) / 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                </motion.div>
                <span className="font-medium">{t('hero.watchVideo')}</span>
              </motion.button>
            </motion.div>

            {/* Floating Tags */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex gap-3 justify-center lg:justify-start"
            >
              <motion.span 
                className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm font-medium"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
              >
                {t('hero.contentCreator')}
              </motion.span>
              <motion.span 
                className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 text-sm font-medium"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                {t('hero.webDeveloper')}
              </motion.span>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex gap-4 justify-center lg:justify-start mt-10"
            >
              {[
                { icon: Github, href: 'https://github.com/menaboules' },
                { icon: Linkedin, href: 'https://linkedin.com/in/menaboules' },
                { icon: Mail, href: 'mailto:hello@minaboules.com' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/10 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GlowIcon Icon={social.icon} size={20} delay={index * 0.3} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-3xl scale-110" />
              
              {/* Profile Circle */}
              <motion.div 
                className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-primary/30"
                animate={{ 
                  boxShadow: [
                    '0 0 30px hsl(var(--primary) / 0.3)',
                    '0 0 60px hsl(var(--primary) / 0.5)',
                    '0 0 30px hsl(var(--primary) / 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <img 
                  src={menaProfile} 
                  alt="Mena Boules"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating Labels */}
              <motion.div
                className="absolute top-1/3 -left-4 px-4 py-2 rounded-lg bg-background/90 backdrop-blur-sm border border-border shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-sm font-medium">{t('hero.contentCreator')}</span>
              </motion.div>

              <motion.div
                className="absolute bottom-1/3 -right-4 px-4 py-2 rounded-lg bg-background/90 backdrop-blur-sm border border-border shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <span className="text-sm font-medium">{t('hero.webDeveloper')}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <FloatIcon Icon={ArrowDown} size={20} />
          </motion.a>
        </motion.div>
      </div>

      {/* Video Popup */}
      <VideoPopup isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </section>
  );
};

export default HeroSection;
