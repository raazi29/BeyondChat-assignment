"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const VisionIntro = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Title animation
            if (titleRef.current) {
                gsap.fromTo(
                    titleRef.current,
                    { opacity: 0, y: 80, filter: 'blur(10px)' },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: titleRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        }
                    }
                );
            }

            // Description stagger
            if (descRef.current) {
                const paragraphs = descRef.current.querySelectorAll('p');
                gsap.fromTo(
                    paragraphs,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: descRef.current,
                            start: 'top 75%',
                            toggleActions: 'play none none none',
                        }
                    }
                );
            }

            // Grid columns stagger
            const columns = sectionRef.current?.querySelectorAll('.vision-col');
            if (columns) {
                gsap.fromTo(
                    columns,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: columns[0],
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        }
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="bg-black text-white selection:bg-white selection:text-black">
            {/* Intro Section */}
            <section id="vision" className="relative min-h-screen py-[8rem] px-[4vw]">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-24 lg:mb-32">
                        {/* Header Micro-meta and SVGs */}
                        <div className="col-span-1 flex items-start">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                className="opacity-40"
                                aria-hidden="true"
                            >
                                <path d="M16 0V32M0 16H32" stroke="currentColor" strokeWidth="0.5" />
                            </svg>
                        </div>

                        <div className="col-span-12 md:col-span-4 lg:col-span-3">
                            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#666666] leading-relaxed">
                                Where others see noise,<br />
                                we synthesize signals.
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-3 lg:col-span-4 flex justify-center md:justify-end opacity-20">
                            <svg width="90" height="16" viewBox="0 0 90 16" fill="none" className="w-full max-w-[120px]">
                                <rect x="0" y="7" width="90" height="1" fill="#333333" />
                                <rect x="10" y="0" width="1" height="16" fill="#333333" />
                                <rect x="30" y="0" width="1" height="16" fill="#333333" />
                                <rect x="50" y="0" width="1" height="16" fill="#333333" />
                                <rect x="70" y="0" width="1" height="16" fill="#333333" />
                            </svg>
                        </div>

                        <div className="col-span-1 md:col-span-4 lg:col-span-4 flex justify-end">
                            <div className="flex gap-1">
                                <span className="font-mono text-[10px] text-[#333333]">BC</span>
                                <span className="font-mono text-[10px] text-[#666666]">001</span>
                            </div>
                        </div>

                        {/* Large Title */}
                        <div className="col-span-12 mt-16 md:mt-32">
                            <h2 ref={titleRef} className="text-[clamp(48px,10vw,100px)] leading-[0.9] tracking-[-0.04em] font-display mb-12">
                                Elite Content<br />
                                Intelligence. <span className="text-gradient-metallic">Synthesized.</span>
                            </h2>

                            <div className="max-w-[100px] mb-12 opacity-40">
                                <svg width="100%" height="20" viewBox="0 0 100 20" fill="none">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <circle key={i} cx={i * 10} cy="10" r="1" fill="currentColor" />
                                    ))}
                                </svg>
                            </div>
                        </div>

                        {/* Description Text */}
                        <div ref={descRef} className="col-span-12 md:col-start-1 md:col-span-5 lg:col-span-4 mt-8">
                            <p className="text-[24px] leading-[1.4] font-display text-white mb-6">
                                Automated scraping, competitive analysis, and AI-driven expansion for the most influential insights.
                            </p>
                            <p className="text-[24px] leading-[1.4] font-display text-white">
                                Compounding Intelligence, seamlessly.
                            </p>
                        </div>
                    </div>

                    {/* Cinematic Video Background Overlay - Removed Scroll Trigger Parallax for Stability */}
                    <div ref={videoRef} className="relative w-full h-[60vh] mt-16 overflow-hidden bg-muted">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover grayscale opacity-60"
                        >
                            <source src="https://player.vimeo.com/progressive_redirect/playback/1125885537/rendition/1440p/file.mp4?loc=external&signature=a5520ff66674eb10bf783202d865de09bb8ae399c074133d636c102b19173d59" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                    </div>
                </div>
            </section>

            {/* 3-Columns Vision Grid */}
            <div className="border-t border-[#333333] border-b border-[#333333]">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 min-h-[300px]">
                        {/* Column 1: Our Mission */}
                        <div className="vision-col p-[4vw] border-r border-[#333333] flex flex-col justify-between">
                            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#666666]">
                                Our Mission
                            </div>
                            <div className="mt-8">
                                <p className="font-mono text-[12px] leading-relaxed text-white/60 mb-8 max-w-[300px] tracking-wide">
                                    To automate the synthesis of high-ranking content, enabling companies to stay ahead of market narratives through AI-driven intelligence.
                                </p>
                                <div className="w-8 h-[1px] bg-white mb-4" />
                            </div>
                        </div>

                        {/* Column 2: System Architecture */}
                        <div className="vision-col p-[4vw] border-r border-[#333333] flex flex-col justify-between">
                            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#666666]">
                                System Architecture
                            </div>
                            <div className="mt-8">
                                <p className="font-mono text-[12px] leading-relaxed text-white/60 mb-8 max-w-[300px] tracking-wide">
                                    Our neural pipeline orchestrates automated extraction, vector-sync storage, and LLM-driven synthesis to produce high-density intelligence.
                                </p>
                                <div className="w-8 h-[1px] bg-white mb-4" />
                            </div>
                        </div>

                        {/* Column 3: The Thesis */}
                        <div className="vision-col p-[4vw] flex flex-col justify-between overflow-hidden">
                            <div className="font-mono text-[10px] tracking-[0.05em] leading-[1.6] text-[#666666] max-w-[280px]">
                                WHERE OTHERS READ THE OBVIOUS, WE EXTRACT THE ESSENCE BEHIND THE NOISE. THIS IS THE EVOLUTION OF CONTENT. OUR PIPELINE TURNS RAW DATA INTO STRATEGIC INTELLIGENCE.
                            </div>
                            <div className="h-[150px] flex items-end justify-center opacity-20">
                                <div className="w-[1px] h-full bg-gradient-to-b from-white to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionIntro;
