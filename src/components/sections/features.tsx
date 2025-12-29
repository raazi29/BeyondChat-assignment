"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
    const phases = [
        {
            id: "Phase 1",
            title: "Automated Scraping",
            description: "Intelligently extracts historical articles from the BeyondChats blog, capturing the foundational insights of the platform."
        },
        {
            id: "Phase 2",
            title: "Competitive Analysis",
            description: "Scans the global web for top-ranking competitor content to identify market gaps and strategic opportunities."
        },
        {
            id: "Phase 3",
            title: "AI Enhancement",
            description: "Our LLM-powered engine synthesizes multi-source data to restructure articles with citations and SEO depth."
        },
        {
            id: "Phase 4",
            title: "Intelligence Chat",
            description: "Engage in context-aware dialogue with any synthesized article to extract deeper strategic value."
        }
    ];

    return (
        <section id="features" className="relative w-full py-24 bg-black overflow-hidden border-t border-white/10">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="max-w-[1400px] mx-auto px-[4vw]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <span className="font-mono text-[10px] tracking-[0.5em] text-white/40 uppercase mb-4 block">
                            System Capabilities
                        </span>
                        <h2 className="text-[clamp(32px,5vw,64px)] font-light tracking-tight leading-[1.1] text-white">
                            Intelligence <span className="italic font-serif">Pipeline.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/lab"
                            className="group relative inline-flex items-center gap-4 border border-white/20 px-8 py-4 transition-all duration-500 hover:border-white"
                        >
                            <span className="font-mono text-[11px] tracking-[0.2em] uppercase">Enter Lab</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10">
                    {phases.map((phase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-8 border-white/10 hover:bg-white/[0.02] transition-colors duration-500 ${index !== phases.length - 1 ? 'md:border-r border-b lg:border-b-0' : 'border-b md:border-b-0'
                                }`}
                        >
                            <div className="flex flex-col h-full">
                                <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-6">
                                    {phase.id}
                                </span>
                                <h3 className="text-xl font-light mb-4 text-white/90">
                                    {phase.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/40 font-light mt-auto">
                                    {phase.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-4 text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">
                        <span>Scrape</span>
                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                        <span>Analyze</span>
                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                        <span>Enhance</span>
                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                        <span>Compare</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
