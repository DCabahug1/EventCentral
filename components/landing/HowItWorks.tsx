"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

const STEPS = [
  {
    label: "01",
    image: "/landing-page/HowItWorksImages/Discover.png",
    heading: "Discover what's happening",
    description:
      "Browse upcoming events by category, date, or location. Filter down to exactly what you're looking for.",
  },
  {
    label: "02",
    image: "/landing-page/HowItWorksImages/MapView.png",
    heading: "Find events near you",
    description:
      "Switch to map view and see everything happening around you, with live capacity indicators.",
  },
  {
    label: "03",
    image: "/landing-page/HowItWorksImages/RSVP.png",
    heading: "RSVP and show up",
    description:
      "Open an event page, see all the details, and reserve your spot in seconds.",
  },
];

function StepCard({ image, heading }: { image: string; heading: string }) {
  return (
    <motion.div
      className="w-full aspect-3/2 overflow-hidden rounded-md border border-border/50 flex flex-col"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {/* Brows container */}
      <div className="shrink-0 flex items-center justify-center gap-3 px-4 h-9 bg-card border-b border-border/50 relative">
        <div className="absolute left-4 flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-2/5 max-w-45 h-4.5 rounded-full bg-muted flex items-center justify-center gap-1.5 px-3">
            <Globe size={10} className="text-muted-foreground/70" />
            <span className="text-[9px] text-muted-foreground/50 truncate">
              https://eventcentral-us.vercel.app
            </span>
          </div>
        </div>
      </div>
      {/* Screenshot */}
      <div className="relative flex-1">
        <Image
          src={image}
          alt={heading}
          fill
          className="object-cover object-top"
        />
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const update = () => {
      const midpoint = window.innerHeight * 0.5;
      let next = 0;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        if (el.getBoundingClientRect().top <= midpoint) next = i;
      });
      if (next !== activeStepRef.current) {
        activeStepRef.current = next;
        setActiveStep(next);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section className="border-b border-border/50 bg-secondary dark:bg-secondary/10">
      {/* Two-column body — even 50/50 split on desktop */}
      <div className="max-w-330 mx-auto px-6 md:px-10 py-26 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-start">
        {/* Left: sticky text panel */}
        <div className="hidden md:flex w-full aspect-3/2 self-start sticky top-[25svh] flex-col justify-center gap-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-5"
            >
              <span className="text-xl tracking-[0.12em] uppercase">
                <span className="text-primary">{STEPS[activeStep].label}</span>
                <span className="text-muted-foreground"> / 03</span>
              </span>
              <h3 className="text-[clamp(40px,5.2vw,64px)] leading-[1.02] tracking-[-0.02em] font-semibold">
                {STEPS[activeStep].heading}
              </h3>
              <p className="text-base text-muted-foreground leading-[1.6] max-w-[44ch]">
                {STEPS[activeStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Step progress bars */}
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-px w-8 transition-all duration-500",
                  i === activeStep ? "bg-primary w-12" : "bg-border",
                )}
              />
            ))}
          </div>
        </div>

        {/* Right: parallax image stack */}
        <div className="w-full flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <div
              key={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="flex flex-col gap-3"
            >
              <StepCard image={step.image} heading={step.heading} />
              {/* Mobile-only label */}
              <div className="md:hidden flex flex-col gap-1">
                <span className="text-[11px] font-mono tracking-[0.1em] uppercase text-primary">
                  {step.label}
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.01em]">
                  {step.heading}
                </h3>
                <p className="text-sm text-muted-foreground leading-[1.6]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
