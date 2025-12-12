import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function FallingStars() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const starElements: HTMLDivElement[] = [];
    const scrollTriggers: ScrollTrigger[] = [];
    const continuousAnimations: gsap.core.Tween[] = [];

    // Create 3 beautiful falling stars
    for (let i = 0; i < 3; i++) {
      const star = document.createElement('div');
      star.className = 'falling-star';
      
      // Random starting positions across the viewport
      const startX = 15 + Math.random() * 70; // 15-85% of viewport width
      const startY = -50 - Math.random() * 100; // Start well above viewport
      
      // Star styling - beautiful gradient with glow (more visible colors)
      const starColors = [
        'rgba(138,92,255,1)', // Purple
        'rgba(0,209,255,1)',  // Cyan
        'rgba(255,92,122,1)'  // Pink
      ];
      
      star.style.position = 'fixed';
      star.style.left = '0';
      star.style.top = '0';
      star.style.width = '4px';
      star.style.height = '100px';
      star.style.background = `linear-gradient(to bottom, ${starColors[i]}, ${starColors[i]}80, ${starColors[i]}40, transparent)`;
      star.style.borderRadius = '50%';
      star.style.opacity = '0.8';
      star.style.pointerEvents = 'none';
      star.style.zIndex = '10';
      star.style.filter = 'blur(1px)';
      star.style.boxShadow = `
        0 0 20px ${starColors[i]},
        0 0 40px ${starColors[i]}80,
        0 0 60px ${starColors[i]}40
      `;
      star.style.transformOrigin = 'center top';
      
      container.appendChild(star);
      starElements.push(star);

      // Calculate scroll distance
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        window.innerHeight * 2
      );
      
      // Different speeds and paths for each star
      const speed = 1.2 + (i * 0.3); // Different speeds
      const horizontalDrift = (Math.random() - 0.5) * 30; // Horizontal movement in percentage
      const rotation = 15 + (Math.random() - 0.5) * 20; // Rotation angle
      
      // Set initial position with visible opacity
      gsap.set(star, {
        xPercent: startX,
        y: startY,
        rotation: 0,
        opacity: 0.8
      });
      
      // Create scroll-triggered animation
      const trigger = gsap.to(star, {
        y: startY + (scrollHeight * speed),
        xPercent: startX + horizontalDrift,
        rotation: rotation,
        opacity: 0.9,
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smoothly follows scroll
        },
        ease: 'none'
      });

      scrollTriggers.push(trigger.scrollTrigger!);

      // Also add continuous falling animation for visibility
      const fallDuration = 4 + Math.random() * 3; // 4-7 seconds
      const repeatDelay = 2 + Math.random() * 3; // 2-5 seconds between falls
      
      let timeoutId: NodeJS.Timeout;
      const continuousFall = () => {
        // Reset position
        gsap.set(star, {
          y: -150,
          xPercent: 15 + Math.random() * 70,
          opacity: 0
        });

        // Animate falling
        const tween = gsap.to(star, {
          y: window.innerHeight + 200,
          xPercent: startX + (Math.random() - 0.5) * 30,
          rotation: rotation,
          opacity: 0.9,
          duration: fallDuration,
          ease: 'power1.in',
          onComplete: () => {
            timeoutId = setTimeout(continuousFall, repeatDelay * 1000);
          }
        });

        continuousAnimations.push(tween);
      };

      // Start continuous animation after delay
      timeoutId = setTimeout(continuousFall, i * 1500);
    }

    // Cleanup function
    return () => {
      starElements.forEach(star => {
        gsap.killTweensOf(star);
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
      });
      scrollTriggers.forEach(trigger => trigger.kill());
      continuousAnimations.forEach(anim => anim.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-[5]"
      aria-hidden="true"
    />
  );
}

