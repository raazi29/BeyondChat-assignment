"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    y?: number;
    stagger?: number;
    once?: boolean;
}

export const ScrollReveal = ({
    children,
    className = "",
    delay = 0,
    duration = 1,
    y = 60,
    once = true
}: ScrollRevealProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ref.current,
                {
                    opacity: 0,
                    y: y,
                    filter: 'blur(10px)'
                },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: duration,
                    delay: delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 85%',
                        end: 'top 20%',
                        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
                    }
                }
            );
        });

        return () => ctx.revert();
    }, [delay, duration, y, once]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

interface ParallaxProps {
    children: React.ReactNode;
    className?: string;
    speed?: number;
}

export const Parallax = ({ children, className = "", speed = 0.5 }: ParallaxProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            gsap.to(ref.current, {
                y: () => -100 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            });
        });

        return () => ctx.revert();
    }, [speed]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

interface StaggerRevealProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
}

export const StaggerReveal = ({ children, className = "", staggerDelay = 0.1 }: StaggerRevealProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ctx = gsap.context(() => {
            const elements = ref.current?.children;
            if (!elements) return;

            gsap.fromTo(
                elements,
                {
                    opacity: 0,
                    y: 40,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: staggerDelay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    }
                }
            );
        });

        return () => ctx.revert();
    }, [staggerDelay]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

// Smooth scroll hook for navbar
export const useSmoothScroll = () => {
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: element, offsetY: 80 },
                ease: 'power3.inOut'
            });
        }
    };
    return scrollTo;
};

export default ScrollReveal;
