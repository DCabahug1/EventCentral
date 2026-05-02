"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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

function StepCard({ image, heading, index, isActive }: { image: string; heading: string; index: number; isActive: boolean }) {
  return (
    <motion.div
      className={cn(
        "w-full aspect-3/2 overflow-hidden rounded-md border border-border/50 flex flex-col transition-[filter] duration-500 ",
        !isActive && "lg:brightness-50",
      )}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.85, delay: index * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="shrink-0 flex items-center justify-center gap-3 px-4 h-9 bg-card border-b border-border/50 relative ">
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

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [mobileStep, setMobileStep] = useState(0);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const isInViewRef = useRef(false);

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

  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => setMobileStep(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);

    const stopAutoPlay = () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayRef.current = setInterval(() => {
        if (carouselApi.canScrollNext()) {
          carouselApi.scrollNext();
        } else {
          carouselApi.scrollTo(0);
        }
      }, 3000);
    };

    const onPointerDown = () => stopAutoPlay();
    const onSettle = () => { if (isInViewRef.current) startAutoPlay(); };

    carouselApi.on("pointerDown", onPointerDown);
    carouselApi.on("settle", onSettle);

    const el = carouselContainerRef.current;
    let observer: IntersectionObserver | null = null;
    if (el) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isInViewRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            startAutoPlay();
          } else {
            stopAutoPlay();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
    }

    return () => {
      stopAutoPlay();
      observer?.disconnect();
      carouselApi.off("select", onSelect);
      carouselApi.off("pointerDown", onPointerDown);
      carouselApi.off("settle", onSettle);
    };
  }, [carouselApi]);

  return (
    <section className="border-b border-border/50 bg-secondary dark:bg-secondary/10">
      <div className="max-w-330 mx-auto px-6 md:px-10 py-26 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

        {/* Left: sticky text panel, desktop only */}
        <div className="hidden lg:flex w-full aspect-3/2 self-start sticky top-[25svh] flex-col justify-center gap-12">
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
              <h3 className="font-display text-[clamp(56px,5.2vw,72px)] leading-[0.95] tracking-[0.02em]">
                {STEPS[activeStep].heading}
              </h3>
              <p className="text-base lg:text-lg text-muted-foreground leading-[1.6] max-w-[44ch]">
                {STEPS[activeStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
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

        {/* Right: stacked images, desktop only */}
        <div className="hidden lg:flex flex-col gap-[35svh]">
          {STEPS.map((step, i) => (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              className='sticky top-[25svh]'
            >
              <StepCard image={step.image} heading={step.heading} index={i} isActive={i === activeStep} />
            </div>
          ))}
        </div>

        {/* Carousel, mobile and tablet */}
        <div ref={carouselContainerRef} className="lg:hidden flex flex-col gap-6">
          <Carousel setApi={setCarouselApi} opts={{ loop: false }} className="w-full">
            <CarouselContent>
              {STEPS.map((step, i) => (
                <CarouselItem key={i}>
                  <div className="flex flex-col gap-4 md:gap-5">
                    <StepCard image={step.image} heading={step.heading} index={i} isActive={true} />
                    <div className="flex flex-col gap-1 md:gap-2 px-1">
                      <span className="text-sm md:text-base tracking-[0.1em] uppercase text-primary">
                        {step.label}
                      </span>
                      <h3 className="font-display text-3xl md:text-5xl leading-[0.95] tracking-[0.02em]">
                        {step.heading}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-[1.6]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Progress bars synced to carousel */}
          <div className="flex gap-2 px-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-px w-8 transition-all duration-500",
                  i === mobileStep ? "bg-primary w-12" : "bg-border",
                )}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
