import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-display font-bold gradient-text">404</h1>
        <p className="mb-2 text-2xl font-display font-bold">{t('common.oops')}</p>
        <p className="mb-6 text-xl text-muted-foreground">{t('common.pageNotFound')}</p>
        <Link to="/" className="btn-primary">
          {t('common.returnHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
