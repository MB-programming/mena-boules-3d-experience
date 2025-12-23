import { useQuery } from '@tanstack/react-query';
import { getSkills, Skill } from '@/lib/api';
import { 
  Figma, 
  Palette, 
  PenTool,
  FileCode2,
  Code2,
  Braces,
  Database,
  Layers,
  Sparkles,
  Box,
  Wind,
  Globe,
  ShoppingCart,
  Atom,
  Zap,
  LucideIcon
} from 'lucide-react';

// Map icon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  Figma,
  Palette,
  PenTool,
  FileCode2,
  Code2,
  Braces,
  Database,
  Layers,
  Sparkles,
  Box,
  Wind,
  Globe,
  ShoppingCart,
  Atom,
  Zap,
};

// Default skills for fallback
const defaultSkills = [
  { name: 'Figma', icon: 'Figma', category: 'Design', color: '#F24E1E' },
  { name: 'Illustrator', icon: 'Palette', category: 'Design', color: '#FF9A00' },
  { name: 'XD', icon: 'PenTool', category: 'Design', color: '#FF61F6' },
  { name: 'HTML5', icon: 'FileCode2', category: 'Frontend', color: '#E34F26' },
  { name: 'CSS3', icon: 'Code2', category: 'Frontend', color: '#1572B6' },
  { name: 'JavaScript', icon: 'Braces', category: 'Frontend', color: '#F7DF1E' },
  { name: 'PHP', icon: 'Database', category: 'Backend', color: '#777BB4' },
  { name: 'jQuery', icon: 'Layers', category: 'Frontend', color: '#0769AD' },
  { name: 'GSAP', icon: 'Sparkles', category: 'Frontend', color: '#88CE02' },
  { name: 'Bootstrap', icon: 'Box', category: 'Frontend', color: '#7952B3' },
  { name: 'Tailwind', icon: 'Wind', category: 'Frontend', color: '#06B6D4' },
  { name: 'WordPress', icon: 'Globe', category: 'CMS', color: '#21759B' },
  { name: 'PrestaShop', icon: 'ShoppingCart', category: 'CMS', color: '#DF0067' },
  { name: 'Next.js', icon: 'Zap', category: 'Frontend', color: '#ffffff' },
  { name: 'React', icon: 'Atom', category: 'Frontend', color: '#61DAFB' },
];

export interface SkillWithIcon {
  name: string;
  icon: LucideIcon;
  category: string;
  color: string;
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async (): Promise<SkillWithIcon[]> => {
      try {
        const data = await getSkills();
        return data.map(skill => ({
          name: skill.name,
          icon: iconMap[skill.icon] || Sparkles,
          category: skill.category,
          color: skill.color,
        }));
      } catch (error) {
        console.error('Failed to fetch skills, using defaults:', error);
        return defaultSkills.map(skill => ({
          ...skill,
          icon: iconMap[skill.icon] || Sparkles,
        }));
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
