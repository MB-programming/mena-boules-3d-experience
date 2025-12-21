import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  Download,
  Printer,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

// Demo quotations data - in real app this would come from database
const quotations: Record<string, {
  password: string;
  client: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  project: {
    title: string;
    description: string;
    deliveryDate: string;
  };
  items: {
    id: number;
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
  validUntil: string;
  createdAt: string;
}> = {
  'QT-2024-001': {
    password: '1234',
    client: {
      name: 'Ahmed Hassan',
      email: 'ahmed@company.com',
      phone: '+20 123 456 7890',
      company: 'Tech Solutions Ltd.',
    },
    project: {
      title: 'E-Commerce Website Development',
      description: 'Full-stack e-commerce platform with payment integration, inventory management, and admin dashboard.',
      deliveryDate: '2025-02-15',
    },
    items: [
      { id: 1, name: 'UI/UX Design', description: 'Complete website design including mobile responsive layouts', quantity: 1, unitPrice: 5000 },
      { id: 2, name: 'Frontend Development', description: 'React.js development with TypeScript', quantity: 1, unitPrice: 8000 },
      { id: 3, name: 'Backend Development', description: 'Node.js API development with database', quantity: 1, unitPrice: 7000 },
      { id: 4, name: 'Payment Integration', description: 'Stripe and local payment gateways', quantity: 1, unitPrice: 2000 },
      { id: 5, name: 'Hosting & Deployment', description: '1 year hosting with SSL certificate', quantity: 1, unitPrice: 1500 },
    ],
    notes: 'This quotation includes 3 months of free maintenance and support. Additional features can be discussed separately.',
    validUntil: '2025-01-31',
    createdAt: '2024-12-21',
  },
  'QT-2024-002': {
    password: 'client2024',
    client: {
      name: 'Sara Mohamed',
      email: 'sara@startup.io',
      phone: '+20 100 200 3000',
      company: 'Startup IO',
    },
    project: {
      title: 'Brand Identity Design',
      description: 'Complete brand identity including logo, color palette, typography, and brand guidelines.',
      deliveryDate: '2025-01-20',
    },
    items: [
      { id: 1, name: 'Logo Design', description: 'Primary logo with variations (horizontal, vertical, icon)', quantity: 1, unitPrice: 3000 },
      { id: 2, name: 'Color Palette', description: 'Primary and secondary colors with usage guidelines', quantity: 1, unitPrice: 500 },
      { id: 3, name: 'Typography', description: 'Font selection and hierarchy guidelines', quantity: 1, unitPrice: 500 },
      { id: 4, name: 'Brand Guidelines', description: 'Complete PDF document with usage rules', quantity: 1, unitPrice: 1500 },
      { id: 5, name: 'Social Media Kit', description: 'Templates for all major platforms', quantity: 1, unitPrice: 1000 },
    ],
    notes: 'Includes 2 rounds of revisions for logo design. Final files in all formats (AI, EPS, PNG, SVG).',
    validUntil: '2025-01-15',
    createdAt: '2024-12-20',
  },
};

const Quotation = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const currency = isAr ? 'ج.م' : 'EGP';
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const quotation = id ? quotations[id] : null;

  const handleUnlock = () => {
    if (!quotation) return;
    
    if (password === quotation.password) {
      setIsUnlocked(true);
      setError('');
      toast.success(t('quotation.unlocked'));
    } else {
      setError(t('quotation.wrongPassword'));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    if (!quotation) return 0;
    return quotation.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  if (!quotation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md"
        >
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold mb-2">{t('quotation.notFound')}</h1>
          <p className="text-muted-foreground mb-6">{t('quotation.notFoundDesc')}</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('common.returnHome')}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">{t('quotation.protected')}</h1>
            <p className="text-muted-foreground">{t('quotation.enterPassword')}</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder={t('quotation.passwordPlaceholder')}
                className={`w-full px-4 py-3 bg-input rounded-lg border ${error ? 'border-red-500' : 'border-border'} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUnlock}
              className="w-full btn-primary py-3"
            >
              {t('quotation.unlock')}
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('quotation.quotationId')}: <strong className="text-primary">{id}</strong>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-6 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions - Hide on print */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.returnHome')}
          </Link>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="btn-outline flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              {t('quotation.print')}
            </motion.button>
          </div>
        </div>

        {/* Quotation Document */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 print:shadow-none print:border-none"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-8 border-b border-border">
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text mb-2">mina.</h1>
              <p className="text-muted-foreground">Web Developer & Designer</p>
              <p className="text-sm text-muted-foreground mt-2">menaboules.dev@gmail.com</p>
            </div>
            
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary mb-3">
                <FileText className="w-5 h-5" />
                <span className="font-semibold">{t('quotation.title')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>{t('quotation.quotationId')}:</strong> {id}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>{t('quotation.date')}:</strong> {quotation.createdAt}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>{t('quotation.validUntil')}:</strong> {quotation.validUntil}
              </p>
            </div>
          </div>

          {/* Client & Project Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Client Info */}
            <div className="p-6 rounded-xl bg-muted/30">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {t('quotation.clientInfo')}
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-lg">{quotation.client.name}</p>
                {quotation.client.company && (
                  <p className="text-muted-foreground">{quotation.client.company}</p>
                )}
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {quotation.client.email}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {quotation.client.phone}
                </p>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6 rounded-xl bg-muted/30">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t('quotation.projectInfo')}
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-lg">{quotation.project.title}</p>
                <p className="text-sm text-muted-foreground">{quotation.project.description}</p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                  <Calendar className="w-4 h-4" />
                  {t('quotation.deliveryDate')}: {quotation.project.deliveryDate}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-10">
            <h3 className="font-semibold mb-4">{t('quotation.items')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t('quotation.item')}</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">{t('quotation.qty')}</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">{t('quotation.unitPrice')}</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">{t('quotation.total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-4 px-4 text-muted-foreground">{index + 1}</td>
                      <td className="py-4 px-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </td>
                      <td className="py-4 px-4 text-center">{item.quantity}</td>
                      <td className="py-4 px-4 text-right">{item.unitPrice.toLocaleString()} {currency}</td>
                      <td className="py-4 px-4 text-right font-medium">
                        {(item.quantity * item.unitPrice).toLocaleString()} {currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end mt-6">
              <div className="w-64 space-y-3">
                <div className="flex justify-between py-3 border-t-2 border-primary">
                  <span className="font-bold text-lg">{t('quotation.grandTotal')}</span>
                  <span className="font-bold text-lg text-primary">
                    {calculateTotal().toLocaleString()} {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quotation.notes && (
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 mb-10">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                {t('quotation.notes')}
              </h3>
              <p className="text-muted-foreground">{quotation.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="pt-8 border-t border-border text-center">
            <p className="text-muted-foreground mb-4">{t('quotation.thankYou')}</p>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:menaboules.dev@gmail.com"
                className="text-primary hover:underline flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                menaboules.dev@gmail.com
              </a>
            </div>
          </div>
        </motion.div>

        {/* Accept Button - Hide on print */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center print:hidden"
        >
          <motion.a
            href={`https://wa.me/201014959132?text=${encodeURIComponent(`Hi! I'd like to accept quotation ${id}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
          >
            <Send className="w-5 h-5" />
            {t('quotation.acceptQuotation')}
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default Quotation;
