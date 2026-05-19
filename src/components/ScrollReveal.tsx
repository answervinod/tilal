'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationType = 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideLeft' | 'slideRight' | 'revealUp' | 'staggerChildren' | 'parallax' | 'clipReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  ease?: string;
  distance?: number;
  stagger?: number;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  markers?: boolean;
  className?: string;
  parallaxSpeed?: number;
  as?: keyof JSX.IntrinsicElements;
}

const easeMap: Record<string, string> = {
  luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
  expo: 'expo.out',
  power3: 'power3.out',
  power2: 'power2.out',
  elastic: 'elastic.out(1, 0.5)',
};

export function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 1,
  ease = 'luxury',
  distance = 40,
  stagger = 0.1,
  scrub = false,
  start = 'top 85%',
  end = 'bottom 20%',
  markers = false,
  className = '',
  parallaxSpeed = 0.5,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const gsapEase = easeMap[ease] || ease;
    let tween: gsap.core.Tween | gsap.core.Timeline;
    const ctx = gsap.context(() => {
      switch (animation) {
        case 'fadeUp':
          tween = gsap.from(el, {
            y: distance,
            opacity: 0,
            duration,
            delay,
            ease: gsapEase,
            scrollTrigger: {
              trigger: el,
              start,
              end,
              toggleActions: 'play none none none',
              markers,
            },
          });
          break;

        case 'fadeIn':
          tween = gsap.from(el, {
            opacity: 0,
            duration,
            delay,
            ease: gsapEase,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: 'play none none none',
              markers,
            },
          });
          break;

        case 'scaleIn':
          tween = gsap.from(el, {
            scale: 0.92,
            opacity: 0,
            duration,
            delay,
            ease: gsapEase,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: 'play none none none',
              markers,
            },
          });
          break;

        case 'slideLeft':
          tween = gsap.from(el, {
            x: distance,
            opacity: 0,
            duration,
            delay,
            ease: gsapEase,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: 'play none none none',
              markers,
            },
          });
          break;

        case 'slideRight':
          tween = gsap.from(el, {
            x: -distance,
            opacity: 0,
            duration,
            delay,
            ease: gsapEase,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: 'play none none none',
              markers,
            },
          });
          break;

        case 'revealUp':
          tween = gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
              markers,
            },
          });
          break;

        case 'staggerChildren': {
          const childrenEls = el.children;
          tween = gsap.from(childrenEls, {
            y: distance,
            opacity: 0,
            duration,
            stagger,
            delay,
            ease: gsapEase,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: 'play none none none',
              markers,
            },
          });
          break;
        }

        case 'parallax':
          tween = gsap.to(el, {
            y: () => distance * parallaxSpeed * -1,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: scrub === true ? 1 : scrub,
              markers,
            },
          });
          break;

        case 'clipReveal':
          tween = gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              duration,
              delay,
              ease: gsapEase,
              scrollTrigger: {
                trigger: el,
                start,
                toggleActions: 'play none none none',
                markers,
              },
            }
          );
          break;
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [animation, delay, duration, ease, distance, stagger, scrub, start, end, markers, parallaxSpeed]);

  const Component = Tag as any;
  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  );
}

/* Specialized components for common patterns */

export function TextReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll('.text-line');
      gsap.from(lines, {
        y: '100%',
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, el);
    return () => ctx.revert();
  }, [delay]);

  return <div ref={ref} className={className}>{children}</div>;
}

export function ParallaxImage({ children, speed = 0.3, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [speed]);

  return <div ref={ref} className={className}>{children}</div>;
}

export function MagneticElement({ children, className = '', strength = 0.3 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return <div ref={ref} className={className}>{children}</div>;
}
