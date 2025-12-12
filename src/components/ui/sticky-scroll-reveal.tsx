import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray(".sticky-slide") as HTMLElement[];
      
      // Initial state: Hide all except first
      gsap.set(slides, { opacity: 0, y: 100 });
      gsap.set(slides[0], { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: `+=${content.length * 100}%`,
          scrub: true,
          pin: true,
        }
      });

      // Create sequence for each transition
      slides.forEach((slide, index) => {
        if (index === slides.length - 1) return; // Last slide just stays visible until end
        
        const nextSlide = slides[index + 1];
        
        tl.to(slide, { 
          opacity: 0, 
          y: -100, 
          duration: 1, 
          ease: "power2.inOut" 
        })
        .fromTo(nextSlide, 
          { opacity: 0, y: 100 }, 
          { opacity: 1, y: 0, duration: 1, ease: "power2.inOut" }, 
          "<" // Start at same time as fade out
        )
        .to({}, { duration: 1 }); // Hold/Pause between transitions
      });

    }, triggerRef);

    return () => ctx.revert();
  }, [content]);

  return (
    <div ref={triggerRef} className="h-screen relative bg-transparent overflow-hidden">
      <div ref={containerRef} className="h-full w-full relative">
        {content.map((item, index) => (
          <div 
            key={item.title + index} 
            className={cn(
                "sticky-slide absolute inset-0 w-full h-full flex items-center justify-center",
                index === 0 ? "z-10" : "z-0" // Ensure first slide starts on top visually if no animation yet
            )}
            style={{ zIndex: index + 1 }} // Stacking order
          >
             <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center h-full max-w-6xl bg-[#fafafa]">
                {/* Text Content */}
                <div className="space-y-8">
                   <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-black bg-gradient-to-r from-white to-white/50 leading-tight pb-4">
                      {item.title}
                   </h2>
                   <p className="text-xl md:text-2xl text-black/40 max-w-lg leading-relaxed">
                      {item.description}
                   </p>
                </div>

                {/* Visual Content */}
                <div className={cn(
                   "h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-[#ac1ed6]/10 relative bg-[#0c0c0c] flex items-center justify-center",
                   contentClassName
                )}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ac1ed6]/5 to-[#c26e73]/5 z-10" />
                    <div className="relative z-20 w-full h-full p-8">
                       {item.content}
                    </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
