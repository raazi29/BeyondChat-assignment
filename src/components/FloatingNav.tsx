"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin);
}

const FloatingNav = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const pathname = usePathname();

    const isLabPage = pathname === '/lab';

    const handleScroll = useCallback(() => {
        setIsVisible(window.scrollY > 100);

        const sections = ['vision', 'features', 'pipeline'];
        for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 200 && rect.bottom >= 200) {
                    setActiveSection(id);
                    return;
                }
            }
        }
        if (window.scrollY < 300) setActiveSection('');
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: element, offsetY: 100 },
                ease: 'power3.inOut'
            });
        }
    };

    if (isLabPage || !isVisible) return null;

    return (
        <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-[100]">
            <div className="flex items-center gap-2 h-12 px-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 h-8 px-3 rounded-full hover:bg-white/10 transition-colors"
                >
                    <Image
                        src="/beyondchats-logo.png"
                        alt="BeyondChats"
                        width={20}
                        height={20}
                        className="object-contain"
                    />
                    <span className="font-mono text-[10px] tracking-[0.12em] text-white/90 hidden sm:block">
                        BEYONDCHATS
                    </span>
                </Link>

                <div className="w-px h-5 bg-white/20" />

                {/* Nav Links - Updated to match screenshot style "VISION FEATURES PIPELINE" */}
                <div className="flex items-center gap-0.5">
                    {['vision', 'features', 'pipeline'].map((section) => (
                        <button
                            key={section}
                            onClick={() => scrollTo(section)}
                            className={`h-8 px-4 rounded-full font-mono text-[10px] tracking-[0.1em] uppercase transition-all duration-300 ${activeSection === section
                                    ? 'text-white bg-white/15'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {section}
                        </button>
                    ))}
                </div>

                <div className="w-px h-5 bg-white/20" />

                {/* CTA */}
                <Link
                    href="/lab"
                    className="h-8 px-5 rounded-full bg-white text-black font-mono text-[10px] tracking-[0.12em] uppercase flex items-center font-medium hover:bg-white/90 transition-colors"
                >
                    Lab
                </Link>
            </div>
        </nav>
    );
};

export default FloatingNav;
