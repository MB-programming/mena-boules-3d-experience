import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Camera, 
  Settings, 
  BookOpen, 
  Award,
  LogOut,
  ArrowLeft,
  Edit2,
  Save,
  Wallet,
  Plus,
  CreditCard,
  History,
  Heart,
  Trash2,
  ShoppingCart,
  Smartphone,
  Copy,
  Check,
  Lock,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { AnimatedSparkle, GlowIcon } from '@/components/AnimatedIcon';
import { useLanguage } from '@/contexts/LanguageContext';

const Profile = () => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const currency = isAr ? 'ج.م' : 'EGP';
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone'>('instapay');
  const [transactionRef, setTransactionRef] = useState('');
  const [copiedInstapay, setCopiedInstapay] = useState(false);
  const [copiedVodafone, setCopiedVodafone] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ahmed Mohamed',
    email: 'ahmed@example.com',
    bio: 'Passionate web developer learning new skills every day.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    walletBalance: 250.00,
  });

  const enrolledCourses = [
    { id: 1, title: 'Complete Web Development', progress: 65, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop' },
    { id: 2, title: 'UI/UX Design Masterclass', progress: 30, image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=300&h=200&fit=crop' },
  ];

  const certificates = [
    { id: '1', title: 'Web Development Fundamentals', date: 'Dec 2024', courseId: 'WD-001' },
    { id: '2', title: 'React Basics', date: 'Nov 2024', courseId: 'RB-001' },
  ];

  const [wishlist, setWishlist] = useState([
    { id: 3, title: 'Advanced Node.js Development', price: 79, image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop' },
    { id: 4, title: 'Mobile App Development', price: 89, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop' },
    { id: 5, title: 'Python for Data Science', price: 69, image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop' },
  ]);

  const transactions = [
    { id: 1, type: 'credit', amount: 100, description: 'Funds Added', date: 'Dec 20, 2024', status: 'completed' },
    { id: 2, type: 'debit', amount: 50, description: 'Course Purchase: React Basics', date: 'Dec 18, 2024', status: 'completed' },
    { id: 3, type: 'credit', amount: 200, description: 'Funds Added', date: 'Dec 15, 2024', status: 'completed' },
  ];

  const pendingRequests = [
    { id: 1, amount: 150, paymentMethod: 'InstaPay', transactionRef: 'TRX123456', date: 'Dec 21, 2024', status: 'pending' },
    { id: 2, amount: 300, paymentMethod: 'Vodafone Cash', transactionRef: 'TRX789012', date: 'Dec 20, 2024', status: 'reviewing' },
  ];

  const handleChangePassword = () => {
    if (!currentPassword) {
      toast.error(t('profile.enterCurrentPassword'));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t('auth.passwordTooShort'));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }
    // Simulate password change
    toast.success(t('profile.passwordChanged'));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowChangePassword(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const copyToClipboard = (text: string, type: 'instapay' | 'vodafone') => {
    navigator.clipboard.writeText(text);
    if (type === 'instapay') {
      setCopiedInstapay(true);
      setTimeout(() => setCopiedInstapay(false), 2000);
    } else {
      setCopiedVodafone(true);
      setTimeout(() => setCopiedVodafone(false), 2000);
    }
    toast.success(t('checkout.copied'));
  };

  const handleAddFunds = () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error(t('profile.enterAmount'));
      return;
    }
    
    if (!transactionRef.trim()) {
      toast.error(t('checkout.refRequired'));
      return;
    }

    // Simulate adding funds after verification
    toast.success(t('profile.fundsRequestSubmitted'));
    setAddAmount('');
    setTransactionRef('');
    setShowAddFunds(false);
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from wishlist');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-6 text-center sticky top-24">
                <div className="relative inline-block mb-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-28 h-28 rounded-full border-4 border-primary/30 object-cover"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5" />
                  </motion.button>
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="text-xl font-display font-bold text-center w-full bg-transparent border-b border-primary mb-2 outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-display font-bold mb-2">{profile.name}</h2>
                )}
                
                <p className="text-muted-foreground text-sm mb-4">{profile.email}</p>

                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full p-2 bg-input rounded-lg border border-border text-sm mb-4"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mb-6">{profile.bio}</p>
                )}

                <div className="space-y-2">
                  {isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(true)}
                      className="w-full btn-outline flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </motion.button>
                  )}
                  
                  <Link
                    to="/auth"
                    className="w-full btn-outline flex items-center justify-center gap-2 text-red-500 border-red-500/30 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Wallet Section */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                  <GlowIcon Icon={Wallet} size={24} className="text-primary" />
                  {t('profile.myWallet')}
                </h3>
                <div className="glass-card p-6 hover-glow">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t('profile.availableBalance')}</p>
                      <p className="text-4xl font-display font-bold gradient-text">
                        {profile.walletBalance.toFixed(0)} {currency}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddFunds(!showAddFunds)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('profile.addFunds')}
                    </motion.button>
                  </div>

                  {/* Add Funds Form with Payment Methods */}
                  {showAddFunds && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-6 space-y-4"
                    >
                      {/* Amount Selection */}
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary" />
                          {t('profile.selectAmount')}
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {[50, 100, 200, 500].map((amount) => (
                            <motion.button
                              key={amount}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setAddAmount(amount.toString())}
                              className={`px-4 py-2 rounded-lg border ${
                                addAmount === amount.toString()
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              {amount} {currency}
                            </motion.button>
                          ))}
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            placeholder={t('profile.customAmount')}
                            className="w-full px-4 py-2 bg-input rounded-lg border border-border"
                          />
                        </div>
                      </div>

                      {/* Payment Method Selection */}
                      <div className="space-y-3">
                        <h4 className="font-medium">{t('checkout.paymentMethod')}</h4>
                        
                        {/* InstaPay Option */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setPaymentMethod('instapay')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === 'instapay'
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-border hover:border-blue-500/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                              <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium">{t('checkout.instapay')}</p>
                              <p className="text-sm text-muted-foreground">{t('checkout.instantTransfer')}</p>
                            </div>
                          </div>
                          
                          {paymentMethod === 'instapay' && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-3 pt-3 border-t border-blue-500/20"
                            >
                              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                <li>{t('checkout.openBankApp')}</li>
                                <li>{t('checkout.chooseInstapay')}</li>
                                <li>{t('checkout.enterAccount')}</li>
                              </ol>
                              <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                                <code className="flex-1 text-blue-400 font-mono">mina_boules@instapay</code>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard('mina_boules@instapay', 'instapay');
                                  }}
                                  className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                                >
                                  {copiedInstapay ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              {addAmount && (
                                <p className="text-sm">
                                  {t('checkout.enterAmount')}: <strong className="text-primary">{addAmount} {currency}</strong>
                                </p>
                              )}
                            </motion.div>
                          )}
                        </motion.div>

                        {/* Vodafone Cash Option */}
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setPaymentMethod('vodafone')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === 'vodafone'
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-border hover:border-red-500/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                              <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium">{t('checkout.vodafone')}</p>
                              <p className="text-sm text-muted-foreground">{t('checkout.mobileWallet')}</p>
                            </div>
                          </div>
                          
                          {paymentMethod === 'vodafone' && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-3 pt-3 border-t border-red-500/20"
                            >
                              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                <li>{t('checkout.openVodafone')}</li>
                                <li>{t('checkout.chooseSendMoney')}</li>
                                <li>{t('checkout.enterNumber')}</li>
                              </ol>
                              <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                                <code className="flex-1 text-red-400 font-mono text-lg">01014959132</code>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard('01014959132', 'vodafone');
                                  }}
                                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                  {copiedVodafone ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              {addAmount && (
                                <p className="text-sm">
                                  {t('checkout.enterAmount')}: <strong className="text-primary">{addAmount} {currency}</strong>
                                </p>
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      </div>

                      {/* Transaction Reference */}
                      <div className="p-4 bg-muted/30 rounded-xl">
                        <label className="block text-sm font-medium mb-2">
                          {t('checkout.transactionRef')}
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder={t('checkout.enterRefAfter')}
                          className="w-full px-4 py-2 bg-input rounded-lg border border-border"
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddFunds}
                        className="w-full btn-primary py-3"
                      >
                        {t('profile.submitFundsRequest')}
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Pending Requests */}
                  {pendingRequests.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        {t('profile.pendingRequests')}
                      </h4>
                      <div className="space-y-2">
                        {pendingRequests.map((req) => (
                          <div
                            key={req.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                req.status === 'pending' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                              }`}>
                                {req.status === 'pending' ? (
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                ) : (
                                  <Eye className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  +{req.amount} {currency}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {req.paymentMethod} • {req.transactionRef}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                req.status === 'pending' 
                                  ? 'bg-yellow-500/20 text-yellow-500' 
                                  : 'bg-blue-500/20 text-blue-500'
                              }`}>
                                {req.status === 'pending' ? t('profile.pending') : t('profile.reviewing')}
                              </span>
                              <p className="text-xs text-muted-foreground mt-1">{req.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transaction History */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <History className="w-4 h-4 text-muted-foreground" />
                      {t('profile.transactionHistory')}
                    </h4>
                    <div className="space-y-2">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              tx.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}>
                              {tx.status === 'completed' ? (
                                <CheckCircle className={`w-4 h-4 ${
                                  tx.type === 'credit' ? 'text-green-500' : 'text-red-500'
                                }`} />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tx.description}</p>
                              <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                          </div>
                          <span className={`font-semibold ${
                            tx.type === 'credit' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {tx.type === 'credit' ? '+' : '-'}{tx.amount} {currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password Section */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                  <GlowIcon Icon={Lock} size={24} className="text-primary" />
                  {t('profile.changePassword')}
                </h3>
                <div className="glass-card p-6 hover-glow">
                  {!showChangePassword ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowChangePassword(true)}
                      className="btn-outline flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {t('profile.changePassword')}
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('profile.currentPassword')}
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-input rounded-lg border border-border pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('auth.newPassword')}
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-input rounded-lg border border-border pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('auth.passwordRequirements')}
                        </p>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('auth.confirmNewPassword')}
                        </label>
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full px-4 py-2 bg-input rounded-lg border border-border"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleChangePassword}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {t('profile.savePassword')}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setShowChangePassword(false);
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmNewPassword('');
                          }}
                          className="btn-outline"
                        >
                          {t('common.cancel')}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Enrolled Courses */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                  <GlowIcon Icon={BookOpen} size={24} className="text-primary" />
                  My Courses
                </h3>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/course/${course.id}`}
                      className="glass-card p-4 flex gap-4 hover-glow group block"
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-24 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {course.title}
                        </h4>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-primary">{course.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Wishlist */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                  <GlowIcon Icon={Heart} size={24} className="text-primary" />
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">({wishlist.length} items)</span>
                  )}
                </h3>
                {wishlist.length === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                    <Link to="/courses" className="btn-primary inline-flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlist.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="glass-card p-4 flex gap-4 hover-glow group"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/course/${item.id}`}
                            className="font-medium group-hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                          <p className="text-lg font-bold text-primary mt-1">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              toast.success('Redirecting to checkout...')
                            }
                            className="btn-primary flex items-center gap-2 text-sm px-3 py-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Buy
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificates */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                  <GlowIcon Icon={Award} size={24} className="text-primary" />
                  Certificates
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <Link
                      key={cert.id}
                      to={`/certificate/${cert.id}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-4 hover-glow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium mb-1">{cert.title}</h4>
                            <p className="text-sm text-muted-foreground">{cert.date}</p>
                          </div>
                          <AnimatedSparkle />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
