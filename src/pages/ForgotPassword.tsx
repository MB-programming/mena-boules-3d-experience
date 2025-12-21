import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedSparkle } from '@/components/AnimatedIcon';
import { useLanguage } from '@/contexts/LanguageContext';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success(t('auth.resetEmailSent'));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <Link 
          to="/auth" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('auth.backToLogin')}
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <AnimatedSparkle />
              <span className="text-3xl font-display font-bold gradient-text">mina.</span>
            </motion.div>
            <h1 className="text-2xl font-display font-bold mb-2">
              {t('auth.forgotPasswordTitle')}
            </h1>
            <p className="text-muted-foreground">
              {t('auth.forgotPasswordSubtitle')}
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">{t('auth.checkEmail')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('auth.resetEmailSentTo')} <span className="text-primary">{email}</span>
              </p>
              <Link to="/auth" className="btn-primary inline-block">
                {t('auth.backToLogin')}
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary py-3.5 text-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('auth.sendResetLink')}
                  </>
                )}
              </motion.button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {t('auth.rememberPassword')}{' '}
              <Link to="/auth" className="text-primary font-medium hover:underline">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
