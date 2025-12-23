import { useQuery } from '@tanstack/react-query';
import { getCompanies, Company } from '@/lib/api';

// Default companies for fallback
const defaultCompanies = [
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
];

export interface CompanyData {
  name: string;
  role: string;
  period: string;
  logo: string;
}

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<CompanyData[]> => {
      try {
        const data = await getCompanies();
        return data.map(company => ({
          name: company.name,
          role: company.role,
          period: company.period,
          logo: company.logo,
        }));
      } catch (error) {
        console.error('Failed to fetch companies, using defaults:', error);
        return defaultCompanies;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
