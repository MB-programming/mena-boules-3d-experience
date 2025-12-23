import { useQuery } from '@tanstack/react-query';
import { getAboutContent, AboutContent } from '@/lib/api';

// Default about content for fallback
const defaultAboutContent = {
  title: 'About Me',
  subtitle: 'UI/UX Designer & Web Developer',
  description: 'I am a passionate UI/UX Designer and Web Developer with over 5 years of experience creating beautiful and functional digital experiences.',
  image: '',
  yearsExperience: '5+',
  projectsCount: '100+',
  clientsCount: '50+',
  cvUrl: 'https://minaboules.com/wp-content/uploads/2025/10/Mena-Kelta-cv.pdf',
  whatsappNumber: '+201222112819',
};

export interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  yearsExperience: string;
  projectsCount: string;
  clientsCount: string;
  cvUrl: string;
  whatsappNumber: string;
}

export function useAboutContent() {
  return useQuery({
    queryKey: ['aboutContent'],
    queryFn: async (): Promise<AboutData> => {
      try {
        const data = await getAboutContent();
        if (data) {
          return {
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            image: data.image,
            yearsExperience: data.years_experience,
            projectsCount: data.projects_count,
            clientsCount: data.clients_count,
            cvUrl: data.cv_url,
            whatsappNumber: data.whatsapp_number,
          };
        }
        return defaultAboutContent;
      } catch (error) {
        console.error('Failed to fetch about content, using defaults:', error);
        return defaultAboutContent;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
