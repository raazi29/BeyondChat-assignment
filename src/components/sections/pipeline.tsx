"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const steps = [
    {
        number: "01",
        title: "Scrape",
        description: "Fetch the 5 oldest articles from BeyondChats blog using intelligent pagination detection and content extraction.",
        action: "Automated data collection"
    },
    {
        number: "02",
        title: "Analyze",
        description: "Search Google for top-ranking competitor articles and scrape their content for cross-referencing.",
        action: "Competitive intelligence"
    },
    {
        number: "03",
        title: "Enhance",
        description: "Use LLM to rewrite and improve articles with SEO optimization, proper citations, and better structure.",
        action: "AI-powered synthesis"
    },
    {
        number: "04",
        title: "Compare",
        description: "View original and enhanced versions side-by-side. Chat with any article using our AI assistant.",
        action: "Interactive analysis"
    }
];

const ProcessSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Simple fade-in for cards, ensuring stability
            stepRefs.current.forEach((el, i) => {
                if (el) {
                    gsap.fromTo(el,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            delay: i * 0.15,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: el,
                                start: "top 85%"
                            }
                        }
                    );
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="pipeline" className="relative bg-black py-32 px-[4vw] border-t border-white/5 overflow-hidden">
            {/* Background glow for ambience */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-white/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1400px] mx-auto">
                {/* Section Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <div>
                        <div className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase mb-6">
                            How It Works
                        </div>
                        <h2 className="text-[clamp(32px,5vw,56px)] leading-[1.1] tracking-[-0.02em] font-light text-white">
                            From Raw Data to <br />
                            <span className="italic font-serif">Refined Intelligence.</span>
                        </h2>
                    </div>
                    <div className="flex items-end">
                        <p className="text-white/40 text-lg leading-relaxed max-w-md">
                            Our pipeline transforms scattered blog content into optimized, SEO-ready
                            articles with competitive insights and AI-powered enhancements.
                        </p>
                    </div>
                </div>

                {/* Steps Grid - Ensuring uniform height cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <div
                            key={step.number}
                            ref={(el) => { stepRefs.current[i] = el; }}
                            className="group flex flex-col h-full"
                        >
                            <div className="border-t border-white/10 pt-8 group-hover:border-white/30 transition-colors duration-500 h-full flex flex-col justify-between">
                                <div>
                                    <div className="font-mono text-[48px] font-light text-white/10 mb-4 group-hover:text-white/20 transition-colors">
                                        {step.number}
                                    </div>
                                    <h3 className="text-2xl font-medium mb-4 tracking-tight text-white">{step.title}</h3>
                                    <p className="text-sm text-white/40 leading-relaxed mb-6">{step.description}</p>
                                </div>
                                <div className="font-mono text-[9px] tracking-[0.2em] text-sky-500/70 uppercase group-hover:text-sky-400 transition-colors mt-auto">
                                    {step.action}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA Bar */}
                <div className="mt-24 p-8 border border-white/10 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-colors duration-500">
                    <div>
                        <h4 className="text-xl font-medium mb-2 text-white">Ready to see it in action?</h4>
                        <p className="text-white/40 text-sm">Experience the full pipeline with live data.</p>
                    </div>
                    <Link
                        href="/lab"
                        className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-white/90 transition-all"
                    >
                        <span>Enter Lab</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
