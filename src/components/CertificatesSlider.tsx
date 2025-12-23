import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useCertificates } from '@/hooks/useCertificates';

const CertificatesSlider = () => {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();
  const { data: certificates = [], isLoading } = useCertificates();

  // Duplicate for seamless loop
  const duplicatedCertificates = [...certificates, ...certificates];

  useEffect(() => {
    if (!isPaused && certificates.length > 0) {
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
  }, [isPaused, controls, certificates.length]);

  if (isLoading) {
    return (
      <div className="relative h-[500px] overflow-hidden">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-card p-3 flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-muted" />
              <div className="flex-1">
                <div className="w-40 h-4 bg-muted rounded mb-2" />
                <div className="w-24 h-3 bg-muted rounded mb-1" />
                <div className="w-16 h-3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
