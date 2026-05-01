"use client";
import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Zap, BarChart2, Building2, CalendarPlus, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const POINTS = [
  {
    icon: Zap,
    title: "Instant event page",
    desc: "Title, cover, place, capacity, category. Your page goes live the moment you hit publish.",
  },
  {
    icon: BarChart2,
    title: "Live capacity signals",
    desc: "Real RSVP counts, real progress bars. No inflated watching numbers. People can see exactly how full you are before they show up.",
  },
  {
    icon: Building2,
    title: "One org, many events",
    desc: "Bundle recurring events under an organization page.",
  },
];

type CardAnim = {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
};

// ── Shared card bodies ────────────────────────────────────────────────────────

function OrgCardBody() {
  return (
    <>
      <div className="text-[12px] text-muted-foreground">
        Step 1: Create an organization
      </div>
      <div className="flex items-center gap-2.5 text-[18px] font-medium tracking-[-0.01em]">
        <span className="w-7 h-7 flex items-center justify-center text-[11px] font-semibold text-white shrink-0 bg-[color-mix(in_oklch,var(--primary)_80%,transparent)]">
          KC
        </span>
        Knockdown Center
      </div>
    </>
  );
}

function EventCardBody() {
  return (
    <>
      <div className="text-[12px] text-muted-foreground">
        Step 2: Create an event
      </div>
      <div className="text-[18px] font-medium tracking-[-0.01em]">
        Analog Futures
      </div>
      <div className="flex items-center flex-wrap gap-2 text-[12px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border/50 text-[11px] text-[oklch(0.72_0.19_305)]">
          <Music size={11} /> Music
        </span>
        Sat, Apr 26 · 11:00 PM · Knockdown Center
      </div>
    </>
  );
}

function StatsCardBody() {
  return (
    <>
      <div className="text-[12px] text-muted-foreground">
        Step 3: Track live stats
      </div>
      <div className="text-[18px] font-medium tracking-[-0.01em]">
        186 of 280 going
      </div>
      <div className="h-0.75 bg-border relative">
        <div className="absolute inset-y-0 left-0 right-[34%] bg-primary" />
      </div>
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground pt-2 border-t border-border/50">
        <span className="text-[oklch(0.82_0.16_85)]">★★★★★</span>
        <span className="font-medium text-foreground">4.8</span>
        from 12 reviews
      </div>
    </>
  );
}

// ── Desktop: scroll-driven absolutely-positioned cards ────────────────────────

function DesktopCards({ a1, a2, a3 }: { a1: CardAnim; a2: CardAnim; a3: CardAnim }) {
  return (
    <div className="relative w-full h-120 max-w-140 mx-auto">
      <motion.div
        className="absolute top-[6%] left-0 w-[62%] bg-card border border-border/50 p-5 flex flex-col gap-2"
        style={{ transformPerspective: 700, rotateZ: -4, opacity: a1.opacity, y: a1.y, scale: a1.scale }}
      >
        <OrgCardBody />
      </motion.div>

      <motion.div
        className="absolute top-[34%] right-0 w-[55%] bg-card border border-border/50 p-5 flex flex-col gap-2"
        style={{ transformPerspective: 700, rotateZ: 3, opacity: a2.opacity, y: a2.y, scale: a2.scale }}
      >
        <EventCardBody />
      </motion.div>

      <motion.div
        className="absolute bottom-[4%] left-[8%] w-[68%] bg-card border border-border/50 p-5 flex flex-col gap-2"
        style={{ transformPerspective: 700, rotateZ: -5, opacity: a3.opacity, y: a3.y, scale: a3.scale }}
      >
        <StatsCardBody />
      </motion.div>
    </div>
  );
}

// ── Mobile: whileInView stacked cards ─────────────────────────────────────────

function MobileCards() {
  return (
    <div className="relative w-full max-w-140 mx-auto flex flex-col gap-12">
      <motion.div
        className="w-full bg-card border border-border/50 p-5 flex flex-col gap-2"
        style={{ transformPerspective: 700, rotateZ: -4 }}
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        whileInView={{ opacity: 0.95, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px 0px" }}
        transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <OrgCardBody />
      </motion.div>

      <motion.div
        className="w-full self-end bg-card border border-border/50 p-5 flex flex-col gap-2"
        style={{ transformPerspective: 700, rotateZ: 3 }}
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        whileInView={{ opacity: 0.95, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px 0px" }}
        transition={{ duration: 0.65, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <EventCardBody />
      </motion.div>

      <motion.div
        className="w-full bg-card border border-border/50 p-5 flex flex-col gap-2"
        style={{ transformPerspective: 700, rotateZ: -5 }}
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        whileInView={{ opacity: 0.95, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px 0px" }}
        transition={{ duration: 0.65, delay: 0.24, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <StatsCardBody />
      </motion.div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────

export default function HostSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ── Left cards ──────────────────────────────────────────────────────────────
  const c1 = {
    opacity: useTransform(scrollYProgress, [0, 0.18], [0.4, 0.95]),
    y:       useTransform(scrollYProgress, [0, 0.18], [12, 0]),
    scale:   useTransform(scrollYProgress, [0, 0.18], [0.97, 1]),
  };
  const c2 = {
    opacity: useTransform(scrollYProgress, [0.3, 0.47], [0, 0.95]),
    y:       useTransform(scrollYProgress, [0.3, 0.47], [20, 0]),
    scale:   useTransform(scrollYProgress, [0.3, 0.47], [0.95, 1]),
  };
  const c3 = {
    opacity: useTransform(scrollYProgress, [0.55, 0.72], [0, 0.95]),
    y:       useTransform(scrollYProgress, [0.55, 0.72], [20, 0]),
    scale:   useTransform(scrollYProgress, [0.55, 0.72], [0.95, 1]),
  };

  // ── Right panel ─────────────────────────────────────────────────────────────
  const headingOpacity = useTransform(scrollYProgress, [0, 0.08],   [0.5, 1]);
  const headingY       = useTransform(scrollYProgress, [0, 0.08],   [10, 0]);
  const paraOpacity    = useTransform(scrollYProgress, [0, 0.12],   [0.3, 1]);
  const paraY          = useTransform(scrollYProgress, [0, 0.12],   [8, 0]);
  // List items synced 1-to-1 with their card
  const ptOpacity = [
    useTransform(scrollYProgress, [0.05, 0.22], [0, 1]),
    useTransform(scrollYProgress, [0.3,  0.47], [0, 1]),
    useTransform(scrollYProgress, [0.55, 0.72], [0, 1]),
  ];
  const ptX = [
    useTransform(scrollYProgress, [0.05, 0.22], [-8, 0]),
    useTransform(scrollYProgress, [0.3,  0.47], [-8, 0]),
    useTransform(scrollYProgress, [0.55, 0.72], [-8, 0]),
  ];
  const btnOpacity = useTransform(scrollYProgress, [0.72, 0.85], [0, 1]);
  const btnScale   = useTransform(scrollYProgress, [0.72, 0.85], [0.95, 1]);
  const btnY       = useTransform(scrollYProgress, [0.72, 0.85], [8, 0]);

  return (
    <div ref={containerRef} className="lg:min-h-[200vh] relative">
      <section className="py-26 md:py-32 lg:py-0 lg:sticky lg:top-0 lg:h-svh lg:flex lg:items-center border-b border-border/50 bg-primary/5">
        <div className="max-w-330 mx-auto px-6 md:px-10 w-full">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20 items-center">

            {/* Cards — mobile uses whileInView, desktop uses scroll-driven */}
            <div className="lg:hidden">
              <MobileCards />
            </div>
            <div className="hidden lg:block">
              <DesktopCards a1={c1} a2={c2} a3={c3} />
            </div>

            {/* Right panel */}
            <div>
              <motion.h2
                className="text-[clamp(40px,5.2vw,64px)] leading-[1.02] tracking-[-0.02em] font-semibold max-w-[18ch]"
                style={{ opacity: headingOpacity, y: headingY }}
              >
                Publish in <em className="not-italic text-primary">minutes.</em>{" "}
                Reach your crowd.
              </motion.h2>

              <motion.p
                className="text-muted-foreground text-base leading-[1.6] max-w-[58ch] mt-4.5"
                style={{ opacity: paraOpacity, y: paraY }}
              >
                Built for venues, community groups, run clubs and solo hosts. No
                commissions, no surprise fees. Just a clean page people will
                actually remember.
              </motion.p>

              <ul className="flex flex-col gap-5 mt-8">
                {POINTS.map((pt, i) => {
                  const Icon = pt.icon;
                  return (
                    <motion.li
                      key={pt.title}
                      className="grid grid-cols-[auto_1fr] gap-4 items-start"
                      style={{ opacity: ptOpacity[i], x: ptX[i] }}
                    >
                      <div className="w-8 h-8 border border-border flex items-center justify-center text-primary shrink-0">
                        <Icon size={15} />
                      </div>
                      <div>
                        <h4 className="text-[17px] font-medium">{pt.title}</h4>
                        <p className="text-muted-foreground text-[14px] leading-[1.55] max-w-[48ch] mt-1">
                          {pt.desc}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                className="mt-8"
                style={{ opacity: btnOpacity, scale: btnScale, y: btnY }}
              >
                <Button size="lg" asChild>
                  <Link href="/profile">
                    <CalendarPlus />
                    Create Your Organization
                  </Link>
                </Button>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
