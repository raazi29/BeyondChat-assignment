"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HeroSection = () => {
  // Generate stable random particles for the background only on client
  // Using simple array of objects for CSS variables
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate particles only once on mount
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 1}px`,
        height: `${Math.random() * 2 + 1}px`,
        animationDuration: `${Math.random() * 20 + 20}s`,
        animationDelay: `${Math.random() * -20}s`,
        '--opacity': 0.4, // Custom property for max opacity
      } as React.CSSProperties
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="relative w-full h-[100vh] min-h-[600px] overflow-hidden bg-black flex flex-col items-center justify-between text-white selection:bg-white selection:text-black">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#111_0%,#000_100%)]"></div>

        {/* CSS Animated Particles - Independent of scroll & Main Thread */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white blur-[1px] animate-particle"
            style={p.style}
          />
        ))}

        {/* Moving Light Rays - CSS Animation */}
        <div
          className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.05),transparent,transparent,rgba(255,255,255,0.05),transparent)] animate-spin-slow pointer-events-none"
        />

        {/* Vignette & Grain */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="relative z-20 w-full flex items-center justify-between px-[4vw] py-4"
      >
        <div className="flex items-center">
          <Link href="/" className="transition-opacity hover:opacity-70">
            <div className="flex items-center gap-2">
              <Image
                src="/beyondchats-logo.png"
                alt="BeyondChats Logo"
                width={28}
                height={28}
                className="object-contain"
                priority // LCP Optimization
              />
              <span className="text-[14px] font-medium tracking-tight uppercase">BeyondChats Intelligence</span>
            </div>
          </Link>
        </div>

        <Link
          href="/lab"
          className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-mono text-[11px] tracking-[0.15em] font-medium uppercase hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <span>Enter Lab</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </motion.nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        {/* CSS Animation for immediate LCP paint */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="font-mono text-[10px] sm:text-[12px] tracking-[0.6em] text-white/40 uppercase">
            Quantized Content Synthesis
          </span>
        </div>

        <h1 className="text-[clamp(42px,12vw,140px)] leading-[0.85] tracking-[-0.06em] font-light flex flex-col items-center gap-0">
          <span className="block opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Deep
          </span>
          <span className="block italic font-serif animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Intelligence.
          </span>
        </h1>

        <div className="mt-8 flex items-center gap-6 text-[11px] font-mono tracking-[0.3em] text-white/30 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link href="#vision" className="hover:text-white transition-colors duration-500">VISION</Link>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <Link href="#features" className="hover:text-white transition-colors duration-500">SYSTEMS</Link>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <Link href="/lab" className="hover:text-white transition-colors duration-500">ARTICLES</Link>
        </div>
      </div>

      {/* Bottom Sub-heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 w-full px-[4vw] pb-8 flex flex-col items-center"
      >
        <div className="max-w-[1400px] w-full border-t border-white/10 pt-6 flex flex-col items-center text-center">
          <div className="flex flex-col gap-3 items-center">
            <h2 className="text-[18px] sm:text-[22px] tracking-tight font-light text-white/80">
              The Next Evolution of Narrative Engineering.
            </h2>
            <div className="text-[16px] sm:text-[18px] tracking-wide font-light text-white/40 max-w-2xl">
              Automated scraping, competitive analysis, and AI-driven expansion for the most influential insights.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
