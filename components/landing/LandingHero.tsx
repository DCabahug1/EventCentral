"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { MapPin, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingHeroProps {
  isLoggedIn: boolean;
}

export default function LandingHero({ isLoggedIn }: LandingHeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 252]);
  const scale = useTransform(scrollY, [0, 900], [1, 1.225]);

  return (
    <section className="relative w-full overflow-hidden flex items-stretch border-b border-border/50 h-[min(78svh,720px)] min-h-[560px] dark">
      {/* Parallax background */}
      <motion.div
        className="absolute -top-[8%] -bottom-[8%] inset-x-0 z-0 will-change-transform"
        style={{ y, scale }}
      >
        <Image
          src="/discover-page/Hero.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[center_40%]"
        />
        {/* Bottom-to-top fade to background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        {/* Primary radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,oklch(0.68_0.17_254/0.3),transparent_60%)]" />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-30 [background-image:linear-gradient(to_right,oklch(1_0_0/0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.08)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* Content */}
      <div className="relative z-[2] flex flex-col justify-center w-full max-w-330 mx-auto px-6 md:px-10 pt-[72px] pb-[72px]">
        <motion.h1
          className="mt-4 text-[clamp(40px,6.4vw,88px)] leading-[0.98] font-bold tracking-[-0.025em] max-w-[14ch] text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
        >
          Discover what&apos;s happening
          <br />
          <em className="not-italic text-primary">around you.</em>
        </motion.h1>

        <motion.p
          className="mt-[22px] text-[clamp(15px,1.55vw,19px)] text-muted-foreground max-w-[54ch] leading-[1.55]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
        >
          Discover events, RSVP, and host your own through your organization.
          All in one place.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
        >
          <Button size="lg" asChild>
            <Link href="/discover">
              <MapPin />
              Find Events Near Me
            </Link>
          </Button>
          {!isLoggedIn && (
            <Button size="lg" variant="outline" className="text-white" asChild>
              <Link href="/auth/register">
                <CalendarPlus />
                Get Started
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
