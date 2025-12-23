import { useQuery } from '@tanstack/react-query';
import { getProjects, getProject, Project } from '@/lib/api';

// Import project images
import boImg from '@/assets/projects/bo.jpg';
import cozmeticImg from '@/assets/projects/cozmetic.jpg';
import xendouImg from '@/assets/projects/xendou.jpg';
import blvckImg from '@/assets/projects/blvck.jpg';

// Default projects for fallback
const defaultProjects = [
  {
    id: 1,
    title: 'B & O',
    slug: 'b-and-o',
    category: 'branding',
    description: 'Premium audio brand with elegant marketing site design and sophisticated visual identity.',
    image: boImg,
    tags: 'Branding,Web Design,Development',
    link: 'https://minaboules.com/portfolio/b-o/',
    price: '$1,500',
    technologies: 'React,GSAP,Tailwind CSS',
    is_active: 1,
  },
  {
    id: 2,
    title: 'Cozmetic',
    slug: 'cozmetic',
    category: 'uiux',
    description: 'Beauty e-commerce platform with stunning product showcases and seamless shopping experience.',
    image: cozmeticImg,
    tags: 'UI/UX,E-Commerce,Beauty',
    link: 'https://minaboules.com/portfolio/cozmetic/',
    price: '$2,000',
    technologies: 'Next.js,Shopify,Framer Motion',
    is_active: 1,
  },
  {
    id: 3,
    title: 'Xendou',
    slug: 'xendou',
    category: 'product',
    description: 'SaaS platform with intuitive dashboard design and powerful analytics features.',
    image: xendouImg,
    tags: 'Product,Web App,SaaS',
    link: 'https://minaboules.com/portfolio/xendou/',
    price: '$3,000',
    technologies: 'React,Node.js,PostgreSQL',
    is_active: 1,
  },
  {
    id: 4,
    title: 'Blvck',
    slug: 'blvck',
    category: 'branding',
    description: 'Luxury lifestyle brand with dark aesthetic and minimalist design approach.',
    image: blvckImg,
    tags: 'Branding,Dark Theme,Luxury',
    link: 'https://minaboules.com/portfolio/blvck/',
    price: '$2,500',
    technologies: 'WordPress,Custom Theme,WooCommerce',
    is_active: 1,
  },
];

export interface ProjectData {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  price: string;
  technologies: string[];
}

function parseProject(project: Project | typeof defaultProjects[0]): ProjectData {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    description: project.description,
    image: project.image,
    tags: typeof project.tags === 'string' ? project.tags.split(',').map(t => t.trim()) : project.tags,
    link: project.link,
    price: project.price,
    technologies: typeof project.technologies === 'string' ? project.technologies.split(',').map(t => t.trim()) : project.technologies,
  };
}

export function useProjects(category?: string) {
  return useQuery({
    queryKey: ['projects', category],
    queryFn: async (): Promise<ProjectData[]> => {
      try {
        const data = await getProjects(category);
        return data.map(parseProject);
      } catch (error) {
        console.error('Failed to fetch projects, using defaults:', error);
        let filtered = defaultProjects;
        if (category && category !== 'all') {
          filtered = defaultProjects.filter(p => p.category === category);
        }
        return filtered.map(parseProject);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: async (): Promise<ProjectData | null> => {
      try {
        const data = await getProject(slug);
        return data ? parseProject(data) : null;
      } catch (error) {
        console.error('Failed to fetch project:', error);
        // Find in defaults
        const project = defaultProjects.find(p => p.slug === slug);
        return project ? parseProject(project) : null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!slug,
  });
}
