import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import Interactive3DScene from '@/components/Interactive3DScene';
import { LanguageProvider } from '@/contexts/LanguageContext';

const About = () => {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-background overflow-x-hidden">
        {/* Interactive 3D Background */}
        <Suspense fallback={null}>
          <Interactive3DScene />
        </Suspense>

        <Navbar />
        
        <main className="pt-20">
          <AboutSection />
          <SkillsSection />
        </main>
        
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default About;
