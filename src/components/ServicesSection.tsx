import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Palette, Code, Wrench, Shield, Terminal, Server } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { GlowIcon } from './AnimatedIcon';

const services = [
  {
    num: '01',
    icon: Palette,
    titleKey: 'services.uiux.title',
    descKey: 'services.uiux.desc',
  },
  {
    num: '02',
    icon: Code,
    titleKey: 'services.webdev.title',
    descKey: 'services.webdev.desc',
  },
  {
    num: '03',
    icon: Wrench,
    titleKey: 'services.custom.title',
    descKey: 'services.custom.desc',
  },
  {
    num: '04',
    icon: Shield,
    titleKey: 'services.security.title',
    descKey: 'services.security.desc',
  },
  {
    num: '05',
    icon: Terminal,
    titleKey: 'services.coding.title',
    descKey: 'services.coding.desc',
  },
  {
    num: '06',
    icon: Server,
    titleKey: 'services.systems.title',
    descKey: 'services.systems.desc',
  },
];

const ServicesSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-32 px-6 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="section-title mb-4">{t('services.title')}</h2>
          <div className="w-24 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="glass-card p-6 group hover-glow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl font-display font-bold text-primary/30 group-hover:text-primary/60 transition-colors">
                  {service.num}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <GlowIcon Icon={service.icon} size={20} delay={index * 0.2} />
                    </div>
                    <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors">
                      {t(service.titleKey)}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t(service.descKey)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
