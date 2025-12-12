import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code2, Brain, BarChart3, Users, Zap, Globe as GlobeIcon, Info, Layout, DollarSign } from 'lucide-react';
import { BeautifulFooter } from "@/components/BeautifulFooter";
import Lenis from 'lenis';
import { Globe } from '@/components/ui/globe';
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal';
import { StatsSection } from '@/components/landing/StatsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FloatingDock } from '@/components/ui/floating-dock';
import { InteractiveFooter } from '@/components/landing/InteractiveFooter';
import { FallingStars } from '@/components/landing/FallingStars';
import ColorBends from '@/components/ColorBends';
import { InfiniteMovingCardsDemo } from '@/components/testimonials';

// Discover styled button used in hero
import styled from 'styled-components';

const DiscoverButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        <span className="text">Start Learning</span>
        <span className="svg">
          <svg xmlns="http://www.w3.org/2000/svg" width={50} height={20} viewBox="0 0 38 15" fill="none">
            <path fill="white" d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z" />
          </svg>
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    background-color: #06446b;
    border: 4px solid #5a90ac;
    color: white;
    gap: 8px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .text {
    font-size: 1.2em;
    font-weight: 500;
    letter-spacing: 1px;
  }
  .svg {
    padding-top: 5px;
    height: 100%;
    width: fit-content;
  }
  .svg svg {
    width: 50px;
    height: 30px;
  }
  .button:hover {
    border: 8px solid #06446b;
    background-color: #06446b;
  }
  .button:active {
    border: 5px solid #c0dfff;
  }
  .button:hover .svg svg {
    animation: jello-vertical 0.9s both;
    transform-origin: left;
  }

  @keyframes jello-vertical {
    0% {
      transform: scale3d(1, 1, 1);
    }
    30% {
      transform: scale3d(0.75, 1.25, 1);
    }
    40% {
      transform: scale3d(1.25, 0.75, 1);
    }
    50% {
      transform: scale3d(0.85, 1.15, 1);
    }
    65% {
      transform: scale3d(1.05, 0.95, 1);
    }
    75% {
      transform: scale3d(0.95, 1.05, 1);
    }
    100% {
      transform: scale3d(1, 1, 1);
    }
  }`;

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroSubRef = useRef(null);
  const globeSectionRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling with friction
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Hero Animations
      const tl = gsap.timeline();
      
      tl.from(heroTextRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.5
      })
      .from(heroSubRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.5")
      .from(".hero-btn", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2
      }, "-=0.3");

      // Globe Section Parallax
      gsap.to(globeSectionRef.current, {
        scrollTrigger: {
          trigger: globeSectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        y: -50,
        ease: "none"
      });

    });

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const stickyScrollContent = [
    {
      title: "AI-Powered Learning",
      description:
        "Experience personalized study paths tailored to your unique learning style. Our AI analyzes your progress and adapts the curriculum in real-time.",
      content: (
        <div className="w-full h-full flex items-center justify-center">
            {/* AI Mockup */}
            <div className="w-[90%] h-[80%] bg-white rounded-xl border border-slate-200 p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e976c6] via-[#8b5cf6] to-[#22d3ee]" />
               <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-full bg-[#e976c6]/15 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-[#e976c6]" />
                     </div>
                     <div>
                        <div className="h-2 w-24 bg-slate-200 rounded-full mb-2" />
                        <div className="h-2 w-16 bg-slate-100 rounded-full" />
                     </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-3">
                     <div className="h-2 w-full bg-slate-200 rounded-full" />
                     <div className="h-2 w-[80%] bg-slate-200 rounded-full" />
                     <div className="h-2 w-[90%] bg-slate-200 rounded-full" />
                  </div>
                  <div className="flex gap-2 text-xs text-[#e976c6]">
                     <span className="px-2 py-1 rounded-full bg-[#e976c6]/10 border border-[#e976c6]/20">Personalized</span>
                     <span className="px-2 py-1 rounded-full bg-[#e976c6]/10 border border-[#e976c6]/20">Adaptive</span>
                  </div>
               </div>
               
               {/* Floating elements */}
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#e976c6]/15 rounded-full blur-3xl group-hover:bg-[#e976c6]/25 transition-colors" />
            </div>
        </div>
      ),
    },
    {
      title: "Interactive Code Playground",
      description:
        "Write, test, and debug code instantly our advanced browser-based editor. Support for multiple languages and real-time collaboration features.",
      content: (
        <div className="w-full h-full flex items-center justify-center">
          {/* Code Editor Mockup */}
          <div className="w-[90%] h-[80%] bg-white rounded-xl border border-slate-200 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
             <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-400/60" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                   <div className="w-3 h-3 rounded-full bg-green-400/60" />
                 </div>
               <div className="ml-4 text-xs text-slate-500 font-mono">main.tsx</div>
              </div>
             <div className="p-6 font-mono text-xs space-y-1 text-slate-800">
                <div className="flex"><span className="text-purple-500 mr-2">import</span> React <span className="text-purple-500 mx-2">from</span> 'react';</div>
                <div className="flex"><span className="text-purple-500 mr-2">function</span> App() {'{'}</div>
                <div className="pl-4 flex"><span className="text-purple-500 mr-2">return</span> (</div>
                <div className="pl-8 flex text-green-600 animate-pulse">&lt;div&gt;Hello World&lt;/div&gt;</div>
                 <div className="pl-4">);</div>
                 <div>{'}'}</div>
                 
                <div className="mt-4 pt-4 border-t border-slate-100 text-slate-500">
                    // Real-time compilation...
                 </div>
              </div>
             <div className="absolute bottom-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded text-xs border border-green-200">
                 Compiled successfully
              </div>
           </div>
        </div>
      ),
    },
    {
      title: "Deep Analytics Dashboard",
      description:
        "Track every metric that matters. From time spent learning to concept mastery, visualize your growth with beautiful, data-rich charts.",
      content: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-[90%] h-[80%] bg-white rounded-xl border border-slate-200 p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="flex justify-between items-end h-full gap-4">
                <div className="w-full bg-slate-100 rounded-t-lg h-[40%] relative group-hover:h-[60%] transition-all duration-500">
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">Mon</div>
                 </div>
                <div className="w-full bg-[#e976c6]/40 rounded-t-lg h-[70%] relative group-hover:h-[85%] transition-all duration-500 shadow-[0_0_20px_rgba(233,118,198,0.35)]">
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-600">Tue</div>
                 </div>
                <div className="w-full bg-slate-100 rounded-t-lg h-[50%] relative group-hover:h-[55%] transition-all duration-500">
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">Wed</div>
                 </div>
                <div className="w-full bg-slate-200 rounded-t-lg h-[80%] relative group-hover:h-[65%] transition-all duration-500">
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-600">Thu</div>
                 </div>
              </div>
           </div>
        </div>
      ),
    },
    {
      title: "Global Collaboration",
      description:
        "Connect with peers worldwide. Join study groups, participate in hackathons, and share resources in a thriving community ecosystem.",
      content: (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-[90%] h-[80%] bg-white rounded-xl border border-slate-200 p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 grid place-items-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
               <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-[#e976c6]/50 flex items-center justify-center animate-spin-slow">
                     <div className="w-20 h-20 rounded-full border border-slate-200" />
                  </div>
                  <Users className="w-8 h-8 text-slate-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  
                  {/* Satellites */}
                  <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               </div>
               <div className="text-center mt-6">
                  <div className="text-2xl font-bold text-slate-900">5,231</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest">Online Now</div>
               </div>
            </div>
        </div>
      ),
    },
  ];

  const dockItems = [
    { title: "About", icon: <Info className="h-full w-full text-white" />, href: "#hero" },
    { title: "Features", icon: <Layout className="h-full w-full text-white" />, href: "#features" },
    { title: "Global", icon: <GlobeIcon className="h-full w-full text-white" />, href: "#global" },
    { title: "Pricing", icon: <DollarSign className="h-full w-full text-white" />, href: "#pricing" },
  ];

  return (<>
    <FallingStars />
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-[#8a5cff]/30 selection:text-slate-900 overflow-x-hidden">
      {/* Header */}
      <header ref={headerRef} className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-black/5 shadow-sm">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <a href='/' className='cursor-pointer'>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src='/logo-Elysiar.jpeg' className='w-full h-full object-contain rounded-xl' />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">
                    Elysiar
                    </span>
                </div>
            </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#community" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Community</a>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              className="bg-white text-black hover:bg-white/90 rounded-full px-6"
              onClick={() => navigate('/dashboard')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden bg-[#f4f6ff] rounded-b-[80px]">
        {/* White curved background under the hero - ensures rounded curves show white behind the video */}
        <div className="absolute inset-0 bg-white rounded-b-[80px] z-0" aria-hidden="true" />

        <video
          className="absolute inset-0 w-full h-full object-cover z-10"
          src="https://res.cloudinary.com/dnbbbrbhl/video/upload/v1765364795/27411-363524243_xpualx.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#d8c7ff]/35 rounded-full blur-[140px] z-0 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#b3f0e5]/30 rounded-full blur-[140px] z-0 animate-pulse" style={{ animationDuration: '6s' }} />

        <div className="container mx-auto text-center relative z-10">
          <div ref={heroTextRef} className="mb-8">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-4 text-slate-900 drop-shadow-sm">
              <span className="block">A new dawn for</span>
              <span className="block text-[#B6F0D3] bg-clip-text bg-gradient-to-r from-[#4338ca] via-[#8b5cf6] to-[#22d3ee]">
                modern education
              </span>
            </h1>
          </div>
          
          <div ref={heroSubRef} className="max-w-2xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-white leading-relaxed">
              Experience the future of education with AI-powered learning, 
              real-time collaboration, and a community that grows with you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <DiscoverButton onClick={() => navigate('/dashboard')} />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce z-10 text-white">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-slate-700 to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Sticky Features Section */}
      <section id="features" className="py-20 relative bg-[#fafafa]">
          <div className="text-center mb-10 container mx-auto px-6 bg-[#fafafa]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 bg-white backdrop-blur-sm text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#ff5c7a] to-[#8a5cff] animate-pulse shadow-[0_0_0_6px_rgba(255,92,122,0.15)]" />
              Innovate Your Classroom
            </div>
            <h2 className="text-4xl md:text-6xl font-bold pt-2">
              <span className="bg-clip-text text-[#004f6a] bg-gradient-to-r from-[#111827] via-[#4338ca] to-[#0ea5e9]">
                Build immersive, <br/> AI-powered learning spaces
              </span>
            </h2>
            <p className="text-slate-600 text-lg pt-8">
              Explore the tools that keep students engaged, informed, and collaborating in real time—designed to feel premium and effortless.
            </p>
          </div>
          <StickyScroll content={stickyScrollContent} />
      </section>

      {/* 3D Globe Section */}
      <section id="global" ref={globeSectionRef} className="relative py-20 overflow-hidden bg-[#e4f3eb] rounded-[80px]">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[600px] flex items-center justify-center">
             <div className="absolute inset-0 bg-[#d8cafd] blur-[100px] rounded-full" />
             <Globe className="w-full h-full max-w-[600px] relative z-10" />
          </div>
          <div className="space-y-8">
            <h2 className="text-5xl font-bold bg-clip-text text-black bg-gradient-to-r from-[#111827] via-[#4338ca] to-[#0ea5e9] pb-2">
              Connect Globally,<br /> Learn Locally
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Join a vibrant ecosystem of learners from around the world. Share knowledge, compete in challenges, and grow together in real-time.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
                <GlobeIcon className="w-8 h-8 text-[#7c3aed] mb-2" />
                <div className="text-2xl font-bold text-slate-900">150+</div>
                <div className="text-sm text-slate-500">Countries</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
                <Users className="w-8 h-8 text-[#e11d48] mb-2" />
                <div className="text-2xl font-bold text-slate-900">50K+</div>
                <div className="text-sm text-slate-500">Community Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InfiniteMovingCardsDemo />

      <PricingSection />

      <InteractiveFooter />
      
      {/* Floating Dock */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} />
      </div>
    </div>
  </>);
};

export default Landing;

