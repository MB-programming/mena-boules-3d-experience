import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Interactive3DScene from '@/components/Interactive3DScene';
import { toast } from 'sonner';
import { useBlogPost, useBlogPosts } from '@/hooks/useBlog';

const BlogPost = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const { data: post, isLoading } = useBlogPost(slug || '');
  const { data: allPosts = [] } = useBlogPosts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === 'ar' ? 'ar-EG' : language === 'de' ? 'de-DE' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = post?.title || '';
    
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(language === 'ar' ? 'تم نسخ الرابط!' : language === 'de' ? 'Link kopiert!' : 'Link copied!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Interactive3DScene />
        <Navbar />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="w-32 h-6 bg-muted rounded mb-8" />
            <div className="w-full h-10 bg-muted rounded mb-4" />
            <div className="flex gap-4 mb-8">
              <div className="w-24 h-4 bg-muted rounded" />
              <div className="w-24 h-4 bg-muted rounded" />
            </div>
            <div className="w-full h-[400px] bg-muted rounded-xl mb-8" />
            <div className="space-y-4">
              <div className="w-full h-4 bg-muted rounded" />
              <div className="w-full h-4 bg-muted rounded" />
              <div className="w-3/4 h-4 bg-muted rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="btn-primary">
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <title>{post.title} | Mena Boules</title>
      <meta name="description" content={post.excerpt} />
      <link rel="canonical" href={`https://menaboules.com/blog/${slug}`} />
      
      <Interactive3DScene />
      <Navbar />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('blog.backToBlog')}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground">
                {post.category_name}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.read_time} {t('blog.minRead')}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {t('blog.share')}
              </motion.button>
            </div>
          </motion.header>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="rounded-2xl overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none mb-16"
          >
            <div className="glass-card p-8 md:p-12">
              {post.content ? (
                <div 
                  className="prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-ul:my-4 prose-li:my-1"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-muted-foreground">{post.excerpt}</p>
              )}
            </div>
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6">{t('blog.relatedPosts')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    to={`/blog/${relatedPost.slug}`}
                    className="glass-card overflow-hidden group hover-glow"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
