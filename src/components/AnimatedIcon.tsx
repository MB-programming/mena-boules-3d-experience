import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  Icon: LucideIcon;
  className?: string;
  size?: number;
  delay?: number;
  color?: string;
}

// Pulse animation for icons
export const PulseIcon = ({ Icon, className = '', size = 24, delay = 0 }: AnimatedIconProps) => (
  <motion.div
    initial={{ scale: 1 }}
    animate={{ 
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7]
    }}
    transition={{ 
      duration: 2, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut"
    }}
    className={className}
  >
    <Icon size={size} />
  </motion.div>
);

// Floating animation for icons
export const FloatIcon = ({ Icon, className = '', size = 24, delay = 0 }: AnimatedIconProps) => (
  <motion.div
    animate={{ 
      y: [0, -8, 0],
    }}
    transition={{ 
      duration: 3, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut"
    }}
    className={className}
  >
    <Icon size={size} />
  </motion.div>
);

// Spin animation for icons
export const SpinIcon = ({ Icon, className = '', size = 24, delay = 0 }: AnimatedIconProps) => (
  <motion.div
    animate={{ 
      rotate: 360,
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity, 
      delay,
      ease: "linear"
    }}
    className={className}
  >
    <Icon size={size} />
  </motion.div>
);

// Bounce animation for icons
export const BounceIcon = ({ Icon, className = '', size = 24, delay = 0 }: AnimatedIconProps) => (
  <motion.div
    animate={{ 
      y: [0, -10, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{ 
      duration: 0.6, 
      repeat: Infinity, 
      repeatDelay: 2,
      delay,
      ease: "easeOut"
    }}
    className={className}
  >
    <Icon size={size} />
  </motion.div>
);

// Glow pulse animation for icons
export const GlowIcon = ({ Icon, className = '', size = 24, delay = 0, color = 'hsl(var(--primary))' }: AnimatedIconProps) => (
  <motion.div
    animate={{ 
      filter: [
        `drop-shadow(0 0 2px ${color})`,
        `drop-shadow(0 0 12px ${color})`,
        `drop-shadow(0 0 2px ${color})`
      ]
    }}
    transition={{ 
      duration: 2, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut"
    }}
    className={className}
  >
    <Icon size={size} />
  </motion.div>
);

// Shake animation for icons
export const ShakeIcon = ({ Icon, className = '', size = 24, delay = 0 }: AnimatedIconProps) => (
  <motion.div
    animate={{ 
      x: [0, -3, 3, -3, 3, 0],
      rotate: [0, -5, 5, -5, 5, 0]
    }}
    transition={{ 
      duration: 0.5, 
      repeat: Infinity, 
      repeatDelay: 3,
      delay,
      ease: "easeInOut"
    }}
    className={className}
  >
    <Icon size={size} />
  </motion.div>
);

// Typing cursor animation
export const TypeCursor = ({ className = '' }: { className?: string }) => (
  <motion.span
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 1, repeat: Infinity }}
    className={`inline-block w-0.5 h-6 bg-primary ml-1 ${className}`}
  />
);

// Animated sparkle emoji
export const AnimatedSparkle = ({ className = '' }: { className?: string }) => (
  <motion.img
    src="https://fonts.gstatic.com/s/e/notoemoji/latest/2728/512.gif"
    alt="✨"
    className={`w-6 h-6 inline-block ${className}`}
    animate={{ rotate: [0, 10, -10, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
  />
);

// Animated wave emoji
export const AnimatedWave = ({ className = '' }: { className?: string }) => (
  <motion.img
    src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif"
    alt="👋"
    className={`w-8 h-8 inline-block ${className}`}
  />
);

// Animated peace sign
export const AnimatedPeace = ({ className = '' }: { className?: string }) => (
  <motion.img
    src="https://fonts.gstatic.com/s/e/notoemoji/latest/270c_fe0f/512.gif"
    alt="✌️"
    className={`w-6 h-6 inline-block ${className}`}
  />
);
