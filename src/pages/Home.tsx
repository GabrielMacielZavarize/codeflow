import React from 'react';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StorySection from '@/components/home/StorySection';
import TeamSection from '@/components/home/TeamSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Footer from '@/components/home/Footer';
import { Pricing } from '@/components/Pricing';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      <HeroSection />
      <StorySection />
      <FeaturesSection />
      <TeamSection />
      <TestimonialsSection />
      <Pricing></Pricing>
      <Footer />
    </div>
  );
};

export default Home;
