import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedSparkle } from '@/components/AnimatedIcon';
import { useLanguage } from '@/contexts/LanguageContext';

const ResetPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }

    if (formData.password.length < 8) {
      toast.error(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success(t('auth.passwordResetSuccess'));
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
              {t('auth.resetPasswordTitle')}
            </h1>
            <p className="text-muted-foreground">
              {t('auth.resetPasswordSubtitle')}
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">{t('auth.passwordResetSuccess')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('auth.canNowLogin')}
              </p>
              <Link to="/auth" className="btn-primary inline-block">
                {t('auth.signIn')}
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.newPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t('auth.passwordRequirements')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.confirmNewPassword')}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary py-3.5 text-lg font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  t('auth.resetPassword')
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
