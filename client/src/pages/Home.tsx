import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { SignalDivider } from '@/components/SignalDivider';
import { ExperienceSection } from '@/components/ExperienceSection';
import { PhilosophySection } from '@/components/PhilosophySection';
import ExplodedView from '@/components/ExplodedView';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SkillsSection } from '@/components/SkillsSection';
import { EducationSection } from '@/components/EducationSection';
import { ContactSection, Footer } from '@/components/ContactSection';
import { useAuth } from '@/_core/hooks/useAuth';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  // Initialize GSAP ScrollTrigger defaults
  useEffect(() => {
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
    });

    return () => {
      // Clean up all ScrollTrigger instances on unmount
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <ExplodedView />
      <AboutSection />
      <SignalDivider />
      <ExperienceSection />
      <PhilosophySection />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
