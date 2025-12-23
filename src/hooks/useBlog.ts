import { useQuery } from '@tanstack/react-query';
import { getBlogPosts, getBlogPost, getBlogCategories, BlogPost, BlogCategory } from '@/lib/api';

// Default blog posts for fallback
const defaultBlogPosts = [
  {
    id: 1,
    slug: 'mastering-ui-ux-design',
    title: 'Mastering UI/UX Design: A Complete Guide',
    excerpt: 'Learn the fundamentals of creating stunning user interfaces and seamless user experiences that convert visitors into customers.',
    content: '',
    category_id: 1,
    category_name: 'Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
    date: '2024-12-15',
    read_time: 8,
    author: 'Mena Boules',
    is_active: 1,
  },
  {
    id: 2,
    slug: 'wordpress-development-tips',
    title: '10 WordPress Development Tips for 2024',
    excerpt: 'Discover the best practices and techniques to build high-performance WordPress websites that stand out.',
    content: '',
    category_id: 2,
    category_name: 'Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    date: '2024-12-10',
    read_time: 6,
    author: 'Mena Boules',
    is_active: 1,
  },
  {
    id: 3,
    slug: 'branding-strategy-guide',
    title: 'Building a Strong Brand Identity',
    excerpt: 'Explore the key elements of brand identity and how to create a memorable presence in the digital landscape.',
    content: '',
    category_id: 3,
    category_name: 'Branding',
    image: 'https://images.unsplash.com/photo-1493421419110-74f4e85ba126?w=800&h=500&fit=crop',
    date: '2024-12-05',
    read_time: 10,
    author: 'Mena Boules',
    is_active: 1,
  },
];

const defaultCategories = [
  { id: 0, name: 'All', slug: 'all', is_active: 1 },
  { id: 1, name: 'Design', slug: 'design', is_active: 1 },
  { id: 2, name: 'Development', slug: 'development', is_active: 1 },
  { id: 3, name: 'Branding', slug: 'branding', is_active: 1 },
];

export function useBlogPosts(category?: string) {
  return useQuery({
    queryKey: ['blogPosts', category],
    queryFn: async (): Promise<BlogPost[]> => {
      try {
        const data = await getBlogPosts(category);
        return data;
      } catch (error) {
        console.error('Failed to fetch blog posts, using defaults:', error);
        return defaultBlogPosts;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async (): Promise<BlogPost | null> => {
      try {
        const data = await getBlogPost(slug);
        return data;
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
        // Find in defaults
        return defaultBlogPosts.find(p => p.slug === slug) || null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: !!slug,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blogCategories'],
    queryFn: async (): Promise<BlogCategory[]> => {
      try {
        const data = await getBlogCategories();
        // Add "All" option at the beginning
        return [{ id: 0, name: 'All', slug: 'all', is_active: 1 }, ...data];
      } catch (error) {
        console.error('Failed to fetch blog categories, using defaults:', error);
        return defaultCategories;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
