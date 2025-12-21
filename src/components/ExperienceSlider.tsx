import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';

const companies = [
  { name: 'Wida', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQGyCe6u3gtQ8g/company-logo_100_100/company-logo_100_100/0/1630586282286/widaeg_logo?e=1751500800&v=beta&t=C-fIDzRd3h2MlgZbnYy-eG0SH2TpIWZjgRvVG3xWg9I' },
  { name: 'Sunweb Solution', logo: 'https://media.licdn.com/dms/image/v2/C560BAQEONk2MF6KMCA/company-logo_100_100/company-logo_100_100/0/1631375568850?e=1751500800&v=beta&t=Y8o7ggTf3jS6F33KUXWXpTMKCWS27dGLJgmvlhZvvv8' },
  { name: 'Pessarde', logo: 'https://media.licdn.com/dms/image/v2/D4D0BAQF5O9rUuqbgLw/company-logo_100_100/company-logo_100_100/0/1694871174664/pessarde_logo?e=1751500800&v=beta&t=nxrSTQOLf2E01qeNLRmEQIaVH3c8H-RUezKJ5ixEJEI' },
  { name: 'SUNGROUP', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQELm79nVomZZw/company-logo_100_100/company-logo_100_100/0/1652956227200/sun_group_eg_logo?e=1751500800&v=beta&t=kv5_RCK8_21Oi_FX0f4elPh5TfKbgZjdyPZHXkQCg2I' },
  { name: 'Winmarket Agency', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQFCDVlhWxw9hQ/company-logo_100_100/company-logo_100_100/0/1652888619206?e=1751500800&v=beta&t=6rKYvxK1q8R2L-O1vU9gzgxDzHGMw7zNO8D2_mOOLhQ' },
  { name: 'Entreprenelle', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQFrVcnLYPNhQw/company-logo_100_100/company-logo_100_100/0/1630542052810/entreprenelle_logo?e=1751500800&v=beta&t=6dYZPlbMZq6oqKvdCeZq3SxJzCPqJxUzQV-OV-2cXHw' },
  { name: 'SOFM', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQFmMxaXEHmHjQ/company-logo_100_100/company-logo_100_100/0/1630649419969/sofm_company_logo?e=1751500800&v=beta&t=nKmWk1xpY0fG_E_s6tl8Q7THPXZY7rj5wgCPgIrOZls' },
  { name: 'Makyn', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQEZVxQhB7RUDA/company-logo_100_100/company-logo_100_100/0/1656505655604/makyn_logo?e=1751500800&v=beta&t=XxL3hQ4zIjz4Y7Yp5YnKjgOzTLvhkNg5mfU0jqZx7eY' },
  { name: 'Silvertech', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQFZmW1kA_4YzQ/company-logo_100_100/company-logo_100_100/0/1656669987909/silvertech_eg_logo?e=1751500800&v=beta&t=k3Y7x8Q6xO1mz8B7vAcHr_Zxq8e6LJYcA4lDWxMc_Eg' },
  { name: 'IT Sharks', logo: 'https://media.licdn.com/dms/image/v2/C4D0BAQGHwxqxJLxI4g/company-logo_100_100/company-logo_100_100/0/1631308093006?e=1751500800&v=beta&t=P5q0hCf0eD0UpU2n7WnEhZpGlL_z7dON4mP1vJJyH1c' },
  { name: 'TeraCourses', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQEONk2MF6KMCA/company-logo_100_100/company-logo_100_100/0/1631375568850?e=1751500800&v=beta&t=Y8o7ggTf3jS6F33KUXWXpTMKCWS27dGLJgmvlhZvvv8' },
  { name: 'Udemy', logo: 'https://media.licdn.com/dms/image/v2/D560BAQFAMBSQWnHmyQ/company-logo_100_100/company-logo_100_100/0/1723593055106/udemy_logo?e=1751500800&v=beta&t=GEu_61xHq5eXsRZvU6H3Gu5A4SqNJQaS0LGQpH3D6D8' },
];

// Duplicate for seamless loop
const duplicatedCompanies = [...companies, ...companies];

const ExperienceSlider = () => {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        y: [0, -50 * companies.length],
        transition: {
          y: {
            duration: 20,
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
      className="relative h-[400px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={controls}
        className="space-y-3"
      >
        {duplicatedCompanies.map((company, index) => (
          <motion.div
            key={`${company.name}-${index}`}
            whileHover={{ scale: 1.05, x: 10 }}
            className="glass-card p-3 flex items-center gap-4 cursor-pointer hover-glow group"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-card border border-border flex-shrink-0 relative">
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-primary font-bold text-sm hidden">
                {company.name.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {company.name}
              </p>
            </div>
            {/* Neon glow effect on hover */}
            <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_hsl(var(--primary)),0_0_20px_hsl(var(--primary))]" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ExperienceSlider;
