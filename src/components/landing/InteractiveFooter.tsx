"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tags = [
  "Innovative",
  "Analytics",
  "AI-Powered",
  "Real-time",
  "Secure",
  "Scalable",
  "Interactive",
  "Gamified",
  "Cloud",
  "Mobile",
  "Community",
  "Insights",
  "Automated",
  "Personalized",
  "Personalized"
];

export function InteractiveFooter() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const hasStartedRef = useRef(false);

  const initPhysics = (): (() => void) | undefined => {
    if (!sceneRef.current || hasStartedRef.current) return undefined;
    hasStartedRef.current = true;

    // Module aliases
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Events = Matter.Events,
      Common = Matter.Common;

    // Create engine
    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // Get dimensions
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: "transparent",
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      },
    });
    renderRef.current = render;

    // Create boundaries
    const ground = Bodies.rectangle(width / 2, height + 30, width, 60, {
      isStatic: true,
      render: { visible: false },
    });
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, {
      isStatic: true,
      render: { visible: false },
    });
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, {
      isStatic: true,
      render: { visible: false },
    });

    Composite.add(world, [ground, leftWall, rightWall]);

    // Create falling tags
    const pillBodies: Matter.Body[] = [];
    
    // Vibrant colors for pills
    const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33F6", "#33FFF6", 
        "#F6FF33", "#FF8C33", "#8C33FF", "#FF338C", "#33FF8C"
    ];

    tags.forEach((tag, i) => {
      const x = Math.random() * (width - 200) + 100;
      const y = -Math.random() * 500 - 50; // Start above viewport
      
      // Calculate approximated width based on text length - make them bigger
      const pillWidth = tag.length * 16 + 80; 
      const pillHeight = 60;
      const color = Common.choose(colors);

      const pill = Bodies.rectangle(x, y, pillWidth, pillHeight, {
        chamfer: { radius: 30 }, // Make it pill-shaped with larger radius
        restitution: 0.5,
        friction: 0.5,
        render: {
          fillStyle: color,
          strokeStyle: "#ffffff",
          lineWidth: 3,
        },
        label: tag, // Store text in label
      });

      pillBodies.push(pill);
    });

    Composite.add(world, pillBodies);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Custom rendering for text with blur effect
    Events.on(render, "afterRender", () => {
      const context = render.context;
      context.font = "bold 18px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";

      pillBodies.forEach((body) => {
        const { x, y } = body.position;
        const angle = body.angle;

        context.save();
        context.translate(x, y);
        context.rotate(angle);
        
        // Clear text rendering - no blur
        context.shadowBlur = 0;
        context.shadowColor = "transparent";
        
        // Ensure text color contrasts well - using black for bright pill colors
        context.fillStyle = "#000000"; 
        
        // If label exists, draw it
        if (body.label) {
            context.fillText(body.label, 0, 0);
        }

        context.restore();
      });
    });

    // Run the engine
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      const newWidth = sceneRef.current.clientWidth;
      const newHeight = sceneRef.current.clientHeight;

      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      
      // Check if we need to update bodies/boundaries? 
      // Matter.js needs manual update for boundaries usually.
      // For simplicity, we just reload or boundaries are simpler static objects. 
      // Ideally we reposition ground/walls.
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 30 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 30, y: newHeight / 2 });
       // leftWall stays at -30
    };

    window.addEventListener("resize", handleResize);

    // Store cleanup function
    const cleanup = () => {
      window.removeEventListener("resize", handleResize);
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
      Composite.clear(world, false);
      Engine.clear(engine);
    };

    // Return cleanup function for component unmount
    return cleanup;
  };

  useEffect(() => {
    if (!footerRef.current) return;

    let cleanupPhysics: (() => void) | undefined;

    // Set up ScrollTrigger to start animation when footer enters viewport
    const trigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top 80%", // Start when footer is 80% from top of viewport
      onEnter: () => {
        cleanupPhysics = initPhysics();
      },
      once: true, // Only trigger once
    });

    return () => {
      trigger.kill();
      if (cleanupPhysics) {
        cleanupPhysics();
      }
    };
  }, []);

  return (
    <div ref={footerRef} className="relative h-[80vh] w-full bg-[#e976c6] overflow-hidden flex flex-col justify-between rounded-t-[80px]">
      {/* Physics Scene (Background) */}
      <div ref={sceneRef} className="absolute inset-0 z-0" />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-5xl md:text-7xl font-bold text-white text-center leading-tight mb-8">
            Start innovation <br />
            of education <span className="relative inline-block">
                <span className="relative z-10 text-[#FFD700]">Today</span>
                <svg className="absolute w-[120%] h-[120%] -top-2 -left-2 text-[#FFD700] z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M5,50 Q25,20 50,50 T95,50" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
                    <path d="M5,60 Q50,90 95,60" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
                </svg>
            </span>
        </h2>
        
        <div className="pointer-events-auto">
            <a href="/dashboard">
              <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
                  Get started
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </a>
        </div>
      </div>

      {/* Footer Links (Absolute Bottom) */}
      <div className="relative z-20 w-full p-8 border-t border-white/10 bg-black/50 backdrop-blur-sm pointer-events-auto">
         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                 <div className="w-6 h-6 rounded-md flex items-center justify-center">
                    <img src="/logo-Elysiar.jpeg" className="w-full h-full object-contain rounded-lg" />
                 </div>
                 <span className="font-semibold text-white">Elysiar</span>
            </div>
            
            <div className="flex gap-8">
                <p>© 2025 Elysiar. All rights reserved.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
