import React from 'react';
import LandingNav from '@/components/landing/LandingNav';
import LandingHero from '@/components/landing/LandingHero';
import LandingHowItWorks from '@/components/landing/LandingHowItWorks';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingStats from '@/components/landing/LandingStats';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <div id="how-it-works"><LandingHowItWorks /></div>
        <div id="features"><LandingFeatures /></div>
        <div id="stats"><LandingStats /></div>
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
