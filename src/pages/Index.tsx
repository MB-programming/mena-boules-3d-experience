import { Suspense } from 'react';
import Scene3D from '../components/Scene3D';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { LanguageProvider } from '../contexts/LanguageContext';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-background overflow-x-hidden">
        {/* 3D Background */}
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>

        {/* Content */}
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
