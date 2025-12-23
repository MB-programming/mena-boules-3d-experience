import { useQuery } from '@tanstack/react-query';
import { getCertificates, Certificate } from '@/lib/api';

// Default certificates for fallback
const defaultCertificates = [
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
];

export interface CertificateData {
  institution: string;
  degree: string;
  credentialId: string;
  year: string;
  logo: string;
  verifyUrl: string;
  isEducation: boolean;
}

export function useCertificates() {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: async (): Promise<CertificateData[]> => {
      try {
        const data = await getCertificates();
        return data.map(cert => ({
          institution: cert.institution,
          degree: cert.degree,
          credentialId: cert.credential_id,
          year: cert.year,
          logo: cert.logo,
          verifyUrl: cert.verify_url,
          isEducation: cert.is_education === 1,
        }));
      } catch (error) {
        console.error('Failed to fetch certificates, using defaults:', error);
        return defaultCertificates;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
