import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';

const certificates = [
  {
    institution: 'Suez Canal University',
    degree: 'Commerce, Business, Management',
    credentialId: '',
    year: '2021 - Present',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1631351054305.jpeg',
    verifyUrl: '',
    isEducation: true,
  },
  {
    institution: 'Microsoft',
    degree: 'Microsoft Technology Associate Developer',
    credentialId: 'eQQq-4TkJ',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/microsoft_logo-1.jpeg',
    verifyUrl: 'https://www.microsoft.com/en-us/learning/mta-certification.aspx',
    isEducation: false,
  },
  {
    institution: 'MCIT',
    degree: 'Egypt FWD Web Development Challenger Track',
    credentialId: 'FFFYMXGS',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/ministry_of_communications_and_information_technology_logo.jpeg',
    verifyUrl: 'https://egfwd.com/',
    isEducation: false,
  },
  {
    institution: 'Udacity',
    degree: 'Full Stack Development Track',
    credentialId: 'KGAQCUGH',
    year: '2019',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/udacity_logo.jpeg',
    verifyUrl: 'https://confirm.udacity.com/KGAQCUGH',
    isEducation: false,
  },
  {
    institution: 'IBM',
    degree: 'HTML & CSS & JavaScript Advanced',
    credentialId: '2c6c17cc-5d82-4dd4-a20a-057d2cf8711b',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/ibm_logo.jpeg',
    verifyUrl: 'https://www.ibm.com/training/',
    isEducation: false,
  },
  {
    institution: 'Google',
    degree: 'Google Digital Marketing',
    credentialId: 'ZCS T5H ZQ8',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/google_logo.jpeg',
    verifyUrl: 'https://learndigital.withgoogle.com/digitalgarage',
    isEducation: false,
  },
  {
    institution: 'Udemy',
    degree: 'Advanced UI/UX Design',
    credentialId: '',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/unnamed-1.png',
    verifyUrl: 'https://www.udemy.com/',
    isEducation: false,
  },
  {
    institution: 'Eduonix',
    degree: 'E-Learning Websites',
    credentialId: 'd2dc8a14e5',
    year: '2020',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1630567253611.jpeg',
    verifyUrl: 'https://www.eduonix.com/',
    isEducation: false,
  },
  {
    institution: 'Edraak',
    degree: 'ICDL Specto & Edraak',
    credentialId: '24f2e9c304b2474da5c2d1064c7a32c7',
    year: '2019',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/edraak_logo.jpeg',
    verifyUrl: 'https://www.edraak.org/',
    isEducation: false,
  },
  {
    institution: 'Kingston Business Academy',
    degree: 'Certified Technology Trainer',
    credentialId: 'MENA 00391',
    year: '2021',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1630635170868.jpeg',
    verifyUrl: '#',
    isEducation: false,
  },
  {
    institution: 'Ministry of Education',
    degree: 'Certified Technology Trainer',
    credentialId: '',
    year: '2019 - 2025',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/unnamed-1.jpg',
    verifyUrl: '#',
    isEducation: false,
  },
];

// Duplicate for seamless loop
const duplicatedCertificates = [...certificates, ...certificates];

const CertificatesSlider = () => {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        y: [0, -76 * certificates.length],
        transition: {
          y: {
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          },
        },
      });
    } else {
      controls.stop();
    }
  }, [isPaused, controls]);

  return (
    <div 
      className="relative h-[500px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={controls}
        className="space-y-3"
      >
        {duplicatedCertificates.map((cert, index) => (
          <motion.div
            key={`${cert.institution}-${cert.degree}-${index}`}
            whileHover={{ scale: 1.02, x: 5 }}
            className="glass-card p-3 flex items-center gap-3 cursor-pointer hover-glow group"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-card border border-border flex-shrink-0">
              <img
                src={cert.logo}
                alt={cert.institution}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cert.institution)}&background=random&size=48`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {cert.degree}
              </p>
              <p className="text-xs text-primary">@{cert.institution}</p>
              <p className="text-xs text-muted-foreground">{cert.year}</p>
            </div>
            {cert.verifyUrl && cert.verifyUrl !== '#' && !cert.isEducation && (
              <motion.a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <CheckCircle className="w-3 h-3" />
              </motion.a>
            )}
            {/* Neon glow indicator */}
            <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_hsl(var(--primary)),0_0_20px_hsl(var(--primary))]" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CertificatesSlider;
