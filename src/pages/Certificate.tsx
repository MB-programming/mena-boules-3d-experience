import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Award, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

// Mock certificates data
const certificatesData: Record<string, {
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
  '1': {
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
  '2': {
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

const Certificate = () => {
  const { t, language } = useLanguage();
  const { id } = useParams();
  const certificateRef = useRef<HTMLDivElement>(null);

  const certificate = certificatesData[id || '1'] || certificatesData['1'];
  const verificationUrl = `${window.location.origin}/certificate/${certificate.id}`;

  const getCourseName = () => {
    switch (language) {
      case 'ar':
        return certificate.courseNameAr;
      case 'de':
        return certificate.courseNameDe;
      default:
        return certificate.courseName;
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

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#0a0f1a',
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `certificate-${certificate.certificateId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success(t('certificate.downloaded'));
    } catch (error) {
      toast.error(t('certificate.downloadError'));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareUrl = verificationUrl;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('certificate.shareTitle'),
          text: `${t('certificate.shareText')} ${getCourseName()}`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success(t('certificate.linkCopied'));
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto">
        {/* Header - Hidden when printing */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 print:hidden">
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('certificate.backToProfile')}
          </Link>
          
          <div className="flex gap-3">
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline flex items-center gap-2 px-4 py-2"
            >
              <Share2 className="w-4 h-4" />
              {t('certificate.share')}
            </motion.button>
            <motion.button
              onClick={handlePrint}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline flex items-center gap-2 px-4 py-2"
            >
              <Printer className="w-4 h-4" />
              {t('certificate.print')}
            </motion.button>
            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 px-4 py-2"
            >
              <Download className="w-4 h-4" />
              {t('certificate.download')}
            </motion.button>
          </div>
        </div>

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="print:m-0"
        >
          <div 
            ref={certificateRef}
            className="relative bg-gradient-to-br from-card via-background to-card border-4 border-primary/30 rounded-2xl p-8 sm:p-12 overflow-hidden print:border-2 print:border-gray-300 print:bg-white print:rounded-none"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl print:hidden" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl print:hidden" />
            <div className="absolute top-4 left-4 w-20 h-20 border-2 border-primary/20 rounded-tl-3xl rounded-br-3xl print:border-gray-200" />
            <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-primary/20 rounded-tr-3xl rounded-bl-3xl print:border-gray-200" />

            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-4 h-20 bg-gradient-to-b from-primary to-transparent print:from-gray-400" />
            <div className="absolute top-0 left-0 w-20 h-4 bg-gradient-to-r from-primary to-transparent print:from-gray-400" />
            <div className="absolute top-0 right-0 w-4 h-20 bg-gradient-to-b from-secondary to-transparent print:from-gray-400" />
            <div className="absolute top-0 right-0 w-20 h-4 bg-gradient-to-l from-secondary to-transparent print:from-gray-400" />
            <div className="absolute bottom-0 left-0 w-4 h-20 bg-gradient-to-t from-secondary to-transparent print:from-gray-400" />
            <div className="absolute bottom-0 left-0 w-20 h-4 bg-gradient-to-r from-secondary to-transparent print:from-gray-400" />
            <div className="absolute bottom-0 right-0 w-4 h-20 bg-gradient-to-t from-primary to-transparent print:from-gray-400" />
            <div className="absolute bottom-0 right-0 w-20 h-4 bg-gradient-to-l from-primary to-transparent print:from-gray-400" />

            <div className="relative text-center">
              {/* Logo */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Award className="w-10 h-10 text-primary print:text-gray-700" />
                <span className="text-3xl font-display font-bold gradient-text print:text-gray-900">mina.</span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl text-muted-foreground uppercase tracking-widest mb-4 print:text-gray-600">
                {t('certificate.certificateOf')}
              </h2>
              <h1 className="text-4xl sm:text-5xl font-display font-bold gradient-text mb-8 print:text-gray-900">
                {t('certificate.completion')}
              </h1>

              {/* Presented To */}
              <p className="text-muted-foreground mb-2 print:text-gray-600">{t('certificate.presentedTo')}</p>
              <h3 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-8 print:text-gray-900">
                {certificate.studentName}
              </h3>

              {/* Course */}
              <p className="text-muted-foreground mb-2 print:text-gray-600">{t('certificate.forCompletion')}</p>
              <h4 className="text-xl sm:text-2xl font-bold text-primary mb-2 print:text-gray-800">
                {getCourseName()}
              </h4>
              <p className="text-muted-foreground mb-8 print:text-gray-600">
                {certificate.completionHours} {t('certificate.hoursOfStudy')}
              </p>

              {/* Signature, Date & QR Code */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 pt-8 border-t border-border/50 print:border-gray-200">
                <div className="text-center">
                  <div className="font-display text-2xl italic text-primary mb-2 print:text-gray-800">
                    {certificate.instructorName}
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider print:text-gray-600">
                    {t('certificate.instructor')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg mb-2 print:text-gray-900">
                    {formatDate(certificate.issueDate)}
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider print:text-gray-600">
                    {t('certificate.issueDate')}
                  </p>
                </div>
                {/* QR Code */}
                <div className="text-center">
                  <div className="bg-white p-2 rounded-lg inline-block mb-2">
                    <QRCodeSVG 
                      value={verificationUrl}
                      size={80}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider print:text-gray-600">
                    {t('certificate.scanToVerify')}
                  </p>
                </div>
              </div>

              {/* Certificate ID */}
              <div className="mt-8 pt-4 border-t border-border/30 print:border-gray-200">
                <p className="text-xs text-muted-foreground print:text-gray-600">
                  {t('certificate.id')}: {certificate.certificateId}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verification Note - Hidden when printing */}
        <div className="mt-8 text-center print:hidden">
          <p className="text-sm text-muted-foreground">
            {t('certificate.verificationNote')}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.5in;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;