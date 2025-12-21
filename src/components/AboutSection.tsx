import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, MessageCircle, Briefcase, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedWave, AnimatedPeace, GlowIcon } from './AnimatedIcon';
import menaProfile from '@/assets/mena-profile.png';

const experiences = [
  { company: 'Wida', role: 'Web Developer', period: 'Jan 2025 - Present', logo: 'WD' },
  { company: 'Sunweb Solution', role: 'Team Leader', period: 'Apr 2023 - Present', logo: 'SW' },
  { company: 'Pessarde', role: 'Senior Web Developer', period: 'Jan 2024 - Mar 2025', logo: 'PS' },
  { company: 'SUNGROUP', role: 'Team Leader', period: 'May 2020 - Present', logo: 'SG' },
  { company: 'Winmarket Agency', role: 'Team Leader', period: 'May 2020 - Present', logo: 'WM' },
  { company: 'Entreprenelle', role: 'Web Developer', period: 'May 2020 - Dec 2025', logo: 'EN' },
  { company: 'SOFM', role: 'Web Developer', period: 'May 2020 - Dec 2022', logo: 'SF' },
  { company: 'Makyn', role: 'Web Developer & Designer', period: 'Jan 2022 - Oct 2023', logo: 'MK' },
  { company: 'Silvertech', role: 'Team Leader', period: 'Feb 2019', logo: 'ST' },
  { company: 'IT Sharks', role: 'Instructor', period: 'Feb 2019', logo: 'IT' },
  { company: 'Maaref', role: 'Instructor', period: 'Feb 2019', logo: 'M3' },
  { company: 'Netlab Academy', role: 'CEO - Founder', period: 'Jan 2018', logo: 'NL' },
  { company: 'Kingston Business', role: 'Web Developer & Instructor', period: 'Jan 2018', logo: 'KB' },
  { company: 'Undercontrol', role: 'Web Developer', period: 'Jan 2019', logo: 'UC' },
  { company: 'TeraCourses', role: 'Instructor', period: 'Jan 2024', logo: 'TC' },
  { company: 'Udemy', role: 'Instructor', period: 'Jan 2025', logo: 'UD' },
];

const education = [
  { institution: 'Suez Canal University', degree: 'Commerce, Business, Management', period: '2021 - Present' },
  { institution: 'Microsoft', degree: 'Microsoft Technology Associate Developer', period: '2022' },
  { institution: 'MCIT', degree: 'Egypt FWD Web Development', period: '2022' },
  { institution: 'Udacity', degree: 'Full Stack Development Track', period: '2019' },
  { institution: 'IBM', degree: 'HTML & CSS & JavaScript Advanced', period: '2022' },
  { institution: 'Google', degree: 'Google Digital Marketing', period: '2022' },
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

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <GlowIcon Icon={Briefcase} size={24} className="text-primary" />
              Experience
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="glass-card p-3 flex items-center gap-3 hover-glow cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/30">
                    {exp.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {exp.role} <span className="text-primary">@{exp.company}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{exp.period}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <GlowIcon Icon={GraduationCap} size={24} className="text-primary" />
              Education & Certificates
            </h3>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="glass-card p-4 hover-glow cursor-pointer"
                >
                  <p className="font-medium text-sm mb-1">
                    {edu.degree}
                  </p>
                  <p className="text-primary text-sm">@{edu.institution}</p>
                  <p className="text-xs text-muted-foreground mt-1">{edu.period}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
