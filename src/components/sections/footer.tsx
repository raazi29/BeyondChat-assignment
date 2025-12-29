"use client";

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Footer Component
 * 
 * Features:
 * - Massive full-width BeyondChats typography (TRAUM-style)
 * - Micro-text links for Privacy and Terms
 * - Deep black theme consistent with high-end minimalism
 */

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#000000] overflow-hidden">
      {/* Massive Typography Section */}
      <div className="relative w-full py-16 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="w-full flex justify-center items-center"
        >
          <h2 className="text-[clamp(60px,14vw,200px)] font-black tracking-[-0.05em] leading-[0.85] uppercase text-white/20 select-none whitespace-nowrap">
            Beyond<span className="italic font-serif">Chats</span>
          </h2>
        </motion.div>
      </div>

      {/* Bottom Bar with Info & Links */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-[4vw] py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left: Company Info */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-medium tracking-tight uppercase text-white/80">
                  Beyond<span className="italic font-serif">Chats</span>
                </span>
                <span className="font-mono text-[9px] tracking-[0.3em] text-white/20 uppercase">
                  Intelligence
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
                © 2025 BeyondChats. All Rights Reserved.
              </p>
            </div>

            {/* Right: Links */}
            <div className="flex items-center gap-6">
              <a
                href="/privacy-policy"
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <div className="w-[1px] h-3 bg-white/10" />
              <a
                href="/terms-of-use"
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors duration-300"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;