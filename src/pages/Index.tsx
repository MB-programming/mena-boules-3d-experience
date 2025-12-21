import { Suspense } from 'react';
import Interactive3DScene from '../components/Interactive3DScene';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import PortfolioSection from '../components/PortfolioSection';
import CoursesSection from '../components/CoursesSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { LanguageProvider } from '../contexts/LanguageContext';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-background overflow-x-hidden">
        {/* Interactive 3D Background */}
        <Suspense fallback={null}>
          <Interactive3DScene />
        </Suspense>

        {/* Content */}
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <PortfolioSection />
          <CoursesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
