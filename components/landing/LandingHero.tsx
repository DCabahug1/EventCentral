"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MapPin, UserPlus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LandingHeroProps {
  isLoggedIn: boolean;
}

const LINES = [
  { words: ["Discover"], primary: false },
  { words: ["What's"], primary: true },
  { words: ["Happening."], primary: false },
];

function WordReveal({
  word,
  delay,
  primary,
}: {
  word: string;
  delay: number;
  primary?: boolean;
}) {
  return (
    <span
      className={cn(
        "overflow-hidden inline-block mr-[0.12em] last:mr-0",
        primary && "text-primary",
      )}
    >
      <motion.span
        className="inline-block"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.75, delay, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function LandingHero({ isLoggedIn }: LandingHeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 252]);
  const scale = useTransform(scrollY, [0, 900], [1, 1.225]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  let wordIndex = 0;

  return (
    <section className="relative w-full overflow-hidden flex flex-col justify-end border-b border-border/50 h-[101svh] min-h-175">
      {/* Parallax background */}
      <motion.div
        className="absolute -top-[8%] -bottom-[8%] inset-x-0 z-0 will-change-transform"
        style={{ y, scale }}
      >
        <video
          ref={videoRef}
          src="/landing-page/HeroVideo.mp4"
          poster="/landing-page/HeroImage.jpg"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,oklch(0.68_0.17_254/0.3),transparent_60%)]" />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-30 [background-image:linear-gradient(to_right,oklch(1_0_0/0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.08)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute hidden sm:flex bottom-8 left-1/2 -translate-x-1/2 z-2 flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center"
        >
          <ChevronDown size={16} className="text-white/70" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-[2] w-full px-6 md:px-10 pb-10 md:pb-14 lg:pb-18">
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <span className="text-[11px] tracking-[0.2em] uppercase text-primary">
            Discover · Attend · Host
          </span>
        </motion.div>

        {/* Heading */}
        <h1 className="font-display font-bold text-7xl sm:text-8xl lg:text-9xl leading-[0.92] tracking-[0.01em] text-white">
          {LINES.map((line) => (
            <span key={line.words.join()} className="block">
              {line.words.map((word) => {
                const delay = 0.08 + wordIndex++ * 0.2;
                return (
                  <WordReveal
                    key={word}
                    word={word}
                    delay={delay}
                    primary={line.primary}
                  />
                );
              })}
            </span>
          ))}
        </h1>

        {/* Description + Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
          <motion.p
            className="text-sm md:text-base lg:text-xl text-white/65 max-w-[44ch] leading-[1.55]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 1.0, ease: "easeOut" }}
          >
            Events, RSVPs, and organizations all in one place. Find something
            worth showing up for.
          </motion.p>

          <motion.div
            className="shrink-0 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 1.1, ease: "easeOut" }}
          >
            <Button size="lg" asChild>
              <Link href="/discover">
                <MapPin />
                Find Events
              </Link>
            </Button>
            {!isLoggedIn && (
              <span className="dark text-white!">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/register">
                    <UserPlus />
                    Get Started
                  </Link>
                </Button>
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
