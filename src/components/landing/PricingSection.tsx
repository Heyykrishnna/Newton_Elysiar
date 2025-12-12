import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const CARD_ANIMATION_DELAY = 0.1;

type PriceFlowProps = {
  value: number;
  className?: string;
};

function PriceFlow({ value, className = "" }: PriceFlowProps) {
  const [prevValue, setPrevValue] = useState(value);
  const direction = value > prevValue ? 1 : -1;

  useEffect(() => {
    if (value !== prevValue) {
        setPrevValue(value);
    }
  }, [value, prevValue]);

  const digits = value.toString().split("");

  return (
    <span className={cn("inline-flex items-center overflow-hidden h-[1.1em]", className)}>
        {digits.map((digit, i) => (
            <div key={i} className="relative w-[0.6em] h-[1em] flex justify-center">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={digit}
                        initial={{ y: direction === 1 ? "100%" : "-100%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: direction === 1 ? "-100%" : "100%", opacity: 0 }}
                        transition={{ 
                            duration: 0.3, 
                            ease: "circOut",
                            delay: i * 0.02 // Stagger slightly for effect
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {digit}
                    </motion.span>
                </AnimatePresence>
            </div>
        ))}
    </span>
  );
}

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section>
      <div className="relative bg-[#fafafa] py-16 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-bold text-5xl md:text-5xl lg:text-5xl lg:tracking-tight text-black">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9195fb] to-[#cd80eb]">Learning plan</span>
            <svg className="absolute w-[300%] h-[200%] -top-10 -left-60 text-[#FFD700] z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M5,50 Q25,20 50,50 T95,50" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
                <path d="M5,60 Q50,90 95,60" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
            </svg>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-black/70 text-lg italic">
            Modern, adaptive pricing tailored for students, creators, 
            and fast-moving teams.
            </p>
            <div className="my-12">
              <div
                className="relative mx-auto grid w-fit grid-cols-2 rounded-full border bg-background p-1 *:block *:h-8 *:w-24 *:rounded-full *:text-foreground *:text-sm"
                data-period={isAnnual ? "annually" : "monthly"}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-1 w-1/2 rounded-full border border-transparent bg-primary shadow ring-1 ring-foreground/5 transition-transform duration-500 ease-in-out ${
                    isAnnual ? "translate-x-full" : "translate-x-0"
                  }`}
                />
                <button
                  className="relative duration-500 data-[active=true]:font-medium data-[active=true]:text-primary-foreground z-10"
                  data-active={!isAnnual}
                  onClick={() => setIsAnnual(false)}
                  type="button"
                >
                  Monthly
                </button>
                <button
                  className="relative duration-500 data-[active=true]:font-medium data-[active=true]:text-primary-foreground z-10"
                  data-active={isAnnual}
                  onClick={() => setIsAnnual(true)}
                  type="button"
                >
                  Annually
                </button>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-6 *:p-8 md:grid-cols-3">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative flex h-[650px] cursor-pointer flex-col overflow-hidden rounded-2xl border bg-background p-8 hover:border-primary/50 transition-colors"
                  data-animate-card
                  initial={{ opacity: 0, y: 40 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                    delay: CARD_ANIMATION_DELAY * 2,
                  }}
                >
                  <div className="card-content relative z-10 flex h-full flex-col">
                    {/* Title */}
                    <h3 className="mb-4 font-bold text-2xl text-foreground">
                      Trial Plan
                    </h3>
                    {/* Price & Duration */}
                    <div className="mb-6">
                      <span className="font-semibold text-3xl text-foreground">
                        Free
                      </span>
                      <br/>
                      <span className="text-foreground/70">
                        Tailored solutions
                      </span>
                    </div>
                    {/* CTA Button */}
                    <a
                      href="/coming"
                      className="mb-6 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-secondary text-secondary-foreground px-4 py-2 font-medium text-sm transition-colors hover:bg-secondary/80"
                    >
                      Experience Elysiar
                    </a>
                    {/* Description */}
                    <p className="mb-6 flex-grow text-foreground/70 text-sm leading-relaxed">
                      Explore Elysiar with limited AI learning tools and starter courses.
                      Perfect for trying out the platform before upgrading.
                    </p>
                    {/* What's Included */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground/70 text-xs uppercase tracking-wider">
                        What&apos;s included:
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Limited daily AI learning sessions",
                          "2–3 starter courses",
                          "Basic community access & analytics",
                          "Limited progress tracking",
                          "Basic quizzes and progress tracking",
                        ].map((item) => (
                          <li
                            className="flex items-center gap-3 text-foreground text-sm"
                            key={item}
                          >
                            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                              <svg
                                aria-hidden="true"
                                className="h-2 w-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
                {/* Basic Plan */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative flex h-[650px] cursor-pointer flex-col overflow-hidden rounded-2xl border bg-background p-8 hover:border-primary/50 transition-colors"
                  data-animate-card
                  initial={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="card-content relative z-10 flex h-full flex-col">
                    {/* Title */}
                    <h3 className="mb-4 font-bold text-2xl text-foreground">
                      Basic
                    </h3>
                    {/* Price & Duration */}
                    <div className="mb-6">
                      <span className="font-semibold text-3xl text-foreground flex items-center">
                        <PriceFlow value={isAnnual ? 1000 : 150} />₹
                      </span>
                      <span className="text-foreground/70">
                        Perfect for students
                      </span>
                    </div>
                    {/* CTA Button */}
                    <a
                      href="/coming"
                      className="mb-6 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-secondary text-secondary-foreground px-4 py-2 font-medium text-sm transition-colors hover:bg-secondary/80"
                    >
                      Get Started
                    </a>
                    {/* Description */}
                    <p className="mb-6 flex-grow text-foreground/70 text-sm leading-relaxed">
                      Unlock full access to core learning features for steady, consistent progress.
                      Ideal for learners who want structure, speed, and better results.
                    </p>
                    {/* What's Included */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground/70 text-xs uppercase tracking-wider">
                        What&apos;s included:
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "More AI learning sessions",
                          "Community access",
                          "AI-generated notes, summaries, and flashcards",
                          "Core features + priority response speed",
                          "Progress tracking with analytics",
                        ].map((item) => (
                          <li
                            className="flex items-center gap-3 text-foreground text-sm"
                            key={item}
                          >
                            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                              <svg
                                aria-hidden="true"
                                className="h-2 w-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
                {/* Pro Plan (Featured) */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative flex h-[650px] cursor-pointer flex-col overflow-hidden rounded-2xl border bg-primary p-8 text-primary-foreground"
                  data-animate-card
                  initial={{ opacity: 0, y: 40 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                    delay: CARD_ANIMATION_DELAY,
                  }}
                >
                  {/* Gradient Accent */}
                  <div className="gradient-accent absolute top-0 right-0 h-4 w-32 rounded-bl-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

                  <div className="card-content relative z-10 flex h-full flex-col">
                    {/* Title */}
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-2xl">
                      Pro{" "}
                      <div className="rounded-full bg-background/20 px-2 py-1 font-bold text-xs backdrop-blur-sm">
                        Most Popular
                      </div>
                    </h3>
                    {/* Price & Duration */}
                    <div className="mb-6">
                      <span className="font-semibold text-3xl flex items-center">
                        <PriceFlow value={isAnnual ? 3000 : 350} className="text-white" />₹
                      </span>
                      <span className="opacity-70">Best for coder and students</span>
                    </div>
                    {/* CTA Button */}
                    <a
                      href="/coming"
                      className="mb-6 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-background text-primary px-4 py-2 font-medium text-sm transition-colors hover:bg-background/90"
                    >
                      Get Started
                    </a>
                    {/* Description */}
                    <p className="mb-6 flex-grow opacity-90 text-sm leading-relaxed">
                      Get advanced tools, unlimited projects, and AI-driven guidance for deep skill growth.
                      Designed for serious learners who want the fastest path to mastery.
                    </p>
                    {/* What's Included */}
                    <div className="space-y-4">
                      <h4 className="font-medium opacity-70 text-xs uppercase tracking-wider">
                        What&apos;s included:
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Unlimited AI use",
                          "Priority Support",
                          "Team Collaboration",
                          "Advanced Analytics",
                          "AI Mentor Mode",
                          "Priority Updates",
                        ].map((item) => (
                          <li
                            className="flex items-center gap-3 text-sm"
                            key={item}
                          >
                            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-background text-primary">
                              <svg
                                aria-hidden="true"
                                className="h-2 w-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
