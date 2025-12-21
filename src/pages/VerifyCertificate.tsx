import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, CheckCircle, XCircle, Award, Calendar, Clock, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock certificates database
const certificatesDatabase: Record<string, {
  id: string;
  courseName: string;
  courseNameAr: string;
  courseNameDe: string;
  studentName: string;
  instructorName: string;
  issueDate: string;
  certificateId: string;
  completionHours: number;
}> = {
  'CERT-2024-WD-001': {
    id: '1',
    courseName: 'Web Development Fundamentals',
    courseNameAr: 'أساسيات تطوير الويب',
    courseNameDe: 'Grundlagen der Webentwicklung',
    studentName: 'Ahmed Mohamed',
    instructorName: 'Mena Boules',
    issueDate: '2024-12-15',
    certificateId: 'CERT-2024-WD-001',
    completionHours: 42,
  },
  'CERT-2024-RB-001': {
    id: '2',
    courseName: 'React Basics',
    courseNameAr: 'أساسيات React',
    courseNameDe: 'React Grundlagen',
    studentName: 'Ahmed Mohamed',
    instructorName: 'Mena Boules',
    issueDate: '2024-11-20',
    certificateId: 'CERT-2024-RB-001',
    completionHours: 28,
  },
};

const VerifyCertificate = () => {
  const { t, language } = useLanguage();
  const [certificateId, setCertificateId] = useState('');
  const [searchResult, setSearchResult] = useState<'idle' | 'found' | 'not-found'>('idle');
  const [foundCertificate, setFoundCertificate] = useState<typeof certificatesDatabase[string] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const getCourseName = (cert: typeof certificatesDatabase[string]) => {
    switch (language) {
      case 'ar':
        return cert.courseNameAr;
      case 'de':
        return cert.courseNameDe;
      default:
        return cert.courseName;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'de' ? 'de-DE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const normalizedId = certificateId.trim().toUpperCase();
      const certificate = certificatesDatabase[normalizedId];
      
      if (certificate) {
        setFoundCertificate(certificate);
        setSearchResult('found');
      } else {
        setFoundCertificate(null);
        setSearchResult('not-found');
      }
      setIsSearching(false);
    }, 1000);
  };

  const resetSearch = () => {
    setCertificateId('');
    setSearchResult('idle');
    setFoundCertificate(null);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('verify.backToHome')}
        </Link>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            {t('verify.title')}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('verify.subtitle')}
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="glass-card p-6 mb-8"
        >
          <label className="block text-sm font-medium mb-2">
            {t('verify.certificateId')}
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder={t('verify.placeholder')}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <motion.button
              type="submit"
              disabled={isSearching || !certificateId.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary px-6 disabled:opacity-50"
            >
              {isSearching ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                t('verify.search')
              )}
            </motion.button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t('verify.example')}: CERT-2024-WD-001
          </p>
        </motion.form>

        {/* Search Results */}
        {searchResult === 'found' && foundCertificate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 border-2 border-green-500/30"
          >
            {/* Success Header */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-500">{t('verify.valid')}</h3>
                <p className="text-sm text-muted-foreground">{t('verify.validDesc')}</p>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('verify.courseName')}</p>
                  <p className="font-medium">{getCourseName(foundCertificate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('verify.studentName')}</p>
                  <p className="font-medium">{foundCertificate.studentName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('verify.issueDate')}</p>
                  <p className="font-medium">{formatDate(foundCertificate.issueDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('verify.completionHours')}</p>
                  <p className="font-medium">{foundCertificate.completionHours} {t('certificate.hoursOfStudy')}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-border">
              <Link
                to={`/certificate/${foundCertificate.id}`}
                className="btn-primary flex-1 text-center"
              >
                {t('verify.viewCertificate')}
              </Link>
              <button
                onClick={resetSearch}
                className="btn-outline flex-1"
              >
                {t('verify.searchAnother')}
              </button>
            </div>
          </motion.div>
        )}

        {searchResult === 'not-found' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 border-2 border-red-500/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-500">{t('verify.invalid')}</h3>
                <p className="text-sm text-muted-foreground">{t('verify.invalidDesc')}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {t('verify.checkId')}
            </p>

            <button
              onClick={resetSearch}
              className="btn-outline w-full"
            >
              {t('verify.tryAgain')}
            </button>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {t('verify.helpText')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyCertificate;