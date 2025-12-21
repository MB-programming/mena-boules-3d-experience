import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';

const companies = [
  { 
    name: 'Wida', 
    role: 'Web Developer',
    period: 'Jan 2025 - Present',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/widaksa_logo.jpeg' 
  },
  { 
    name: 'Sunweb Solution', 
    role: 'Team Leader',
    period: 'Apr 2023 - Present',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/538933942_17847275187550557_1849076569739551831_n.jpg' 
  },
  { 
    name: 'Pessarde', 
    role: 'Senior Web Developer',
    period: 'Jan 2024 - Mar 2025',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/pissarde_logo.jpeg' 
  },
  { 
    name: 'SUNGROUP', 
    role: 'Team Leader',
    period: 'May 2020 - Present',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/sunmed_eg_logo.jpeg' 
  },
  { 
    name: 'Winmarket Agency', 
    role: 'Team Leader',
    period: 'May 2020 - Present',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/win_market_agency_logo.jpeg' 
  },
  { 
    name: 'Entreprenelle', 
    role: 'Web Developer',
    period: 'May 2020 - Dec 2025',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1631335871500-1.jpeg' 
  },
  { 
    name: 'SOFM', 
    role: 'Web Developer',
    period: 'May 2020 - Dec 2022',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1653832939195.jpeg' 
  },
  { 
    name: 'Makyn', 
    role: 'Web Developer & Designer',
    period: 'Jan 2022 - Oct 2023',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1726023987459.jpeg' 
  },
  { 
    name: 'Silvertech', 
    role: 'Team Leader',
    period: 'Feb 2019',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/silver_tech_app_logo.jpeg' 
  },
  { 
    name: 'IT Sharks', 
    role: 'Instructor',
    period: 'Feb 2019',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/it_sharks_logo.jpeg' 
  },
  { 
    name: 'Maaref', 
    role: 'Instructor',
    period: 'Feb 2019',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/m3aarf_logo.jpeg' 
  },
  { 
    name: 'Netlab Academy', 
    role: 'CEO - Founder',
    period: 'Jan 2018',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1697760756927.jpeg' 
  },
  { 
    name: 'Kingston Business', 
    role: 'Web Developer & Instructor',
    period: 'Jan 2018',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/1630635170868.jpeg' 
  },
  { 
    name: 'Undercontrol', 
    role: 'Web Developer',
    period: 'Jan 2019',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/under_controleg_logo.jpeg' 
  },
  { 
    name: 'TeraCourses', 
    role: 'Instructor',
    period: 'Jan 2024',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/teracourses_logo.jpeg' 
  },
  { 
    name: 'Udemy', 
    role: 'Instructor',
    period: 'Jan 2025',
    logo: 'https://minaboules.com/wp-content/uploads/2025/10/unnamed-1.png' 
  },
];

// Duplicate for seamless loop
const duplicatedCompanies = [...companies, ...companies];

const ExperienceSlider = () => {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        y: [0, -76 * companies.length],
        transition: {
          y: {
            duration: 25,
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
        {duplicatedCompanies.map((company, index) => (
          <motion.div
            key={`${company.name}-${index}`}
            whileHover={{ scale: 1.02, x: 5 }}
            className="glass-card p-3 flex items-center gap-3 cursor-pointer hover-glow group"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-card border border-border flex-shrink-0">
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random&size=48`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {company.role} <span className="text-primary">@{company.name}</span>
              </p>
              <p className="text-xs text-muted-foreground">{company.period}</p>
            </div>
            {/* Neon glow indicator */}
            <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_hsl(var(--primary)),0_0_20px_hsl(var(--primary))]" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ExperienceSlider;
