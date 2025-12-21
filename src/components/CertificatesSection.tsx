import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Award, CheckCircle } from 'lucide-react';
import { GlowIcon } from './AnimatedIcon';

const certificates = [
  {
    institution: 'Microsoft',
    degree: 'Microsoft Technology Associate Developer',
    credentialId: 'eQQq-4TkJ',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/microsoft_logo-1.jpeg',
    verifyUrl: 'https://www.microsoft.com/en-us/learning/mta-certification.aspx',
  },
  {
    institution: 'MCIT',
    degree: 'Egypt FWD Web Development Challenger Track',
    credentialId: 'FFFYMXGS',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/ministry_of_communications_and_information_technology_logo.jpeg',
    verifyUrl: 'https://egfwd.com/',
  },
  {
    institution: 'Udacity',
    degree: 'Full Stack Development Track',
    credentialId: 'KGAQCUGH',
    year: '2019',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/udacity_logo.jpeg',
    verifyUrl: 'https://confirm.udacity.com/KGAQCUGH',
  },
  {
    institution: 'IBM',
    degree: 'HTML & CSS & JavaScript Advanced',
    credentialId: '2c6c17cc-5d82-4dd4-a20a-057d2cf8711b',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/ibm_logo.jpeg',
    verifyUrl: 'https://www.ibm.com/training/',
  },
  {
    institution: 'Google',
    degree: 'Google Digital Marketing',
    credentialId: 'ZCS T5H ZQ8',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/google_logo.jpeg',
    verifyUrl: 'https://learndigital.withgoogle.com/digitalgarage',
  },
  {
    institution: 'Udemy',
    degree: 'Advanced UI/UX Design',
    credentialId: '',
    year: '2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/unnamed-1.png',
    verifyUrl: 'https://www.udemy.com/',
  },
  {
    institution: 'Eduonix',
    degree: 'E-Learning Websites',
    credentialId: 'd2dc8a14e5',
    year: '2020',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1630567253611.jpeg',
    verifyUrl: 'https://www.eduonix.com/',
  },
  {
    institution: 'Edraak',
    degree: 'ICDL Specto & Edraak',
    credentialId: '24f2e9c304b2474da5c2d1064c7a32c7',
    year: '2019',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/edraak_logo.jpeg',
    verifyUrl: 'https://www.edraak.org/',
  },
  {
    institution: 'Kingston Business Academy',
    degree: 'Certified Technology Trainer',
    credentialId: 'MENA 00391',
    year: '2021',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1630635170868.jpeg',
    verifyUrl: '#',
  },
  {
    institution: 'Ministry of Education',
    degree: 'Certified Technology Trainer',
    credentialId: '',
    year: '2019 - 2025',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/unnamed-1.jpg',
    verifyUrl: '#',
  },
];

const education = [
  {
    institution: 'Suez Canal University',
    degree: 'Commerce, Business, Management',
    year: '2021 - Present',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1631351054305.jpeg',
  },
];

const CertificatesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
      {/* Education */}
      {education.map((edu, index) => (
        <motion.div
          key={edu.institution}
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 * index }}
          className="glass-card p-4 hover-glow"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-card border border-border flex-shrink-0">
              <img
                src={edu.logo}
                alt={edu.institution}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{edu.degree}</p>
              <p className="text-primary text-sm">@{edu.institution}</p>
              <p className="text-xs text-muted-foreground">{edu.year}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Certificates */}
      {certificates.map((cert, index) => (
        <motion.div
          key={cert.credentialId || cert.degree}
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
          whileHover={{ scale: 1.02, x: 5 }}
          className="glass-card p-4 hover-glow group cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-card border border-border flex-shrink-0">
              <img
                src={cert.logo}
                alt={cert.institution}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm group-hover:text-primary transition-colors">
                {cert.degree}
              </p>
              <p className="text-primary text-xs">@{cert.institution}</p>
              {cert.credentialId && (
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {cert.credentialId}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{cert.year}</p>
            </div>
            {cert.verifyUrl && cert.verifyUrl !== '#' && (
              <motion.a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <CheckCircle className="w-3 h-3" />
                Verify
              </motion.a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CertificatesSection;
