// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://minaboules.com/api';

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
}

// Skills API
export interface Skill {
  id: number;
  name: string;
  icon: string;
  category: string;
  color: string;
  is_active: number;
}

export interface SkillsResponse {
  success: boolean;
  data: Skill[];
}

export async function getSkills(): Promise<Skill[]> {
  const response = await fetchAPI<SkillsResponse>('/public/portfolio/skills.php');
  return response.data || [];
}

// Companies API
export interface Company {
  id: number;
  name: string;
  role: string;
  period: string;
  logo: string;
  is_active: number;
}

export interface CompaniesResponse {
  success: boolean;
  data: Company[];
}

export async function getCompanies(): Promise<Company[]> {
  const response = await fetchAPI<CompaniesResponse>('/public/portfolio/companies.php');
  return response.data || [];
}

// Certificates API
export interface Certificate {
  id: number;
  institution: string;
  degree: string;
  credential_id: string;
  year: string;
  logo: string;
  verify_url: string;
  is_education: number;
  is_active: number;
}

export interface CertificatesResponse {
  success: boolean;
  data: Certificate[];
}

export async function getCertificates(): Promise<Certificate[]> {
  const response = await fetchAPI<CertificatesResponse>('/public/portfolio/certificates.php');
  return response.data || [];
}

// About Content API
export interface AboutContent {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  years_experience: string;
  projects_count: string;
  clients_count: string;
  cv_url: string;
  whatsapp_number: string;
}

export interface AboutResponse {
  success: boolean;
  data: AboutContent;
}

export async function getAboutContent(): Promise<AboutContent | null> {
  const response = await fetchAPI<AboutResponse>('/public/content/about.php');
  return response.data || null;
}

// Site Info API
export interface SiteInfo {
  site_name: string;
  site_tagline: string;
  site_logo: string;
  site_favicon: string;
  contact_email: string;
  contact_phone: string;
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
  social_github: string;
}

export interface SiteInfoResponse {
  success: boolean;
  data: SiteInfo;
}

export async function getSiteInfo(): Promise<SiteInfo | null> {
  const response = await fetchAPI<SiteInfoResponse>('/public/content/site-info.php');
  return response.data || null;
}

// Home Content API
export interface HomeContent {
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_image: string;
  hero_video_url: string;
}

export interface HomeContentResponse {
  success: boolean;
  content: HomeContent;
}

export async function getHomeContent(): Promise<HomeContent | null> {
  const response = await fetchAPI<HomeContentResponse>('/public/content/home.php');
  return response.content || null;
}
