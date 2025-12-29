"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

/**
 * Footer Component
 * 
 * Features:
 * - High-contrast BeyondChats Logo visual
 * - Micro-text links for Privacy and Terms
 * - Deep black theme consistent with high-end minimalism
 */

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#000000] overflow-hidden pt-20 pb-12">
      {/* Visual Graphical Section (Logo) */}
      <div className="max-w-[1400px] mx-auto px-[4vw] mb-20">
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Designed BeyondChat Visual */}
          <div className="w-full max-w-[1000px] flex flex-col items-center gap-8 py-12">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <motion.div
                  initial={{ rotate: -10 }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative"
                >
                  <Image
                    src="/beyondchats-logo.png"
                    alt="BeyondChats Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </motion.div>
                <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-full -z-10" />
              </div>

              <div className="flex flex-col">
                <span className="text-[32px] sm:text-[48px] font-light tracking-[-0.04em] leading-none uppercase">
                  Beyond<span className="italic font-serif">Chats</span>
                </span>
                <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.4em] text-white/30 uppercase mt-2">
                  Content Intelligence Systems
                </span>
              </div>
            </motion.div>

            {/* Decorative Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#222222] to-transparent" />
          </div>
        </div>
      </div>

      {/* Access Denied / Closing Message Area */}
      <div className="max-w-[1400px] mx-auto px-[4vw] flex flex-col items-center">
        <div className="w-full h-[1px] bg-[#222222] mb-8" />

        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Copyright & Meta info in Monospace */}
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#808080]">
              © 2025 BeyondChats. All Rights Reserved.
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#4d4d4d]">
              Members only network. Authorized access required.
            </p>
          </div>

          {/* Minimal Links */}
          <div className="flex items-center gap-6">
            <a
              href="/privacy-policy"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#808080] hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <div className="w-[1px] h-3 bg-[#222222]" />
            <a
              href="/terms-of-use"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#808080] hover:text-white transition-colors duration-300"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>

      {/* Decorative side technical lines */}
      <div className="absolute left-[5%] bottom-0 top-0 w-[1px] bg-gradient-to-b from-transparent via-[#222222] to-transparent opacity-30 pointer-events-none" />
      <div className="absolute right-[5%] bottom-0 top-0 w-[1px] bg-gradient-to-b from-transparent via-[#222222] to-transparent opacity-30 pointer-events-none" />
    </footer>
  );
};

export default Footer;