import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navItems = [
    { key: 'nav.home', href: isHomePage ? '#home' : '/' },
    { key: 'nav.services', href: isHomePage ? '#services' : '/#services' },
    { key: 'nav.projects', href: '/projects' },
    { key: 'nav.courses', href: '/courses' },
    { key: 'nav.about', href: isHomePage ? '#about' : '/#about' },
    { key: 'nav.contact', href: isHomePage ? '#contact' : '/#contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="text-2xl font-display font-bold gradient-text">
              mina.
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.href.startsWith('/') && !item.href.includes('#') ? (
                <Link
                  key={item.key}
                  to={item.href}
                  className="nav-link font-medium"
                >
                  {t(item.key)}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  className="nav-link font-medium"
                >
                  {t(item.key)}
                </a>
              )
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'عربي' : 'EN'}</span>
            </motion.button>

            <Link to="/auth">
              <motion.button
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-4 h-4" />
                Login
              </motion.button>
            </Link>

            <button
              className="md:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 glass-card overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {navItems.map((item) => (
                  item.href.startsWith('/') && !item.href.includes('#') ? (
                    <Link
                      key={item.key}
                      to={item.href}
                      className="nav-link font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ) : (
                    <a
                      key={item.key}
                      href={item.href}
                      className="nav-link font-medium py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.key)}
                    </a>
                  )
                ))}
                <Link
                  to="/auth"
                  className="btn-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
