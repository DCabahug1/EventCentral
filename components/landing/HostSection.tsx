"use client";
import Link from "next/link";
import { motion } from "motion/react";
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

function FloatingCards() {
  return (
    <div className="relative aspect-square w-full max-w-[560px] mx-auto ">
      {/* Card 1: Create organization */}
      <motion.div
        className="absolute top-[6%] left-0 w-[62%] bg-card border border-border/50 p-5 flex flex-col gap-2"
        style={{ rotate: -1.5 }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 0.95, y: 0 }}
        viewport={{ once: true, margin: "-40px 0px" }}
        transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="text-[12px] text-muted-foreground">Step 1: Create an organization</div>
        <div className="flex items-center gap-2.5 text-[18px] font-medium tracking-[-0.01em]">
          <span className="w-7 h-7 flex items-center justify-center text-[11px] font-semibold text-white shrink-0 bg-[color-mix(in_oklch,var(--primary)_80%,transparent)]">
            KC
          </span>
          Knockdown Center
        </div>
      </motion.div>

      {/* Card 2: Create event */}
      <motion.div
        className="absolute top-[34%] right-0 w-[55%] bg-card border border-border/50 p-5 flex flex-col gap-2"
        style={{ rotate: 1.2 }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 0.95, y: 0 }}
        viewport={{ once: true, margin: "-40px 0px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="text-[12px] text-muted-foreground">Step 2: Create an event</div>
        <div className="text-[18px] font-medium tracking-[-0.01em]">Analog Futures</div>
        <div className="flex items-center flex-wrap gap-2 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-border/50 text-[11px] text-[oklch(0.72_0.19_305)]">
            <Music size={11} /> Music
          </span>
          Sat, Apr 26 · 11:00 PM · Knockdown Center
        </div>
      </motion.div>

      {/* Card 3: Live stats */}
      <motion.div
        className="absolute bottom-[4%] left-[8%] w-[68%] bg-card border border-border/50 p-5 flex flex-col gap-2"
        style={{ rotate: -0.8 }}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 0.95, y: 0 }}
        viewport={{ once: true, margin: "-40px 0px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="text-[12px] text-muted-foreground">Step 3: Track live stats</div>
        <div className="text-[18px] font-medium tracking-[-0.01em]">186 of 280 going</div>
        <div className="h-[3px] bg-border relative">
          <div className="absolute inset-y-0 left-0 right-[34%] bg-primary" />
        </div>
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground pt-2 border-t border-border/50">
          <span className="text-[oklch(0.82_0.16_85)]">★★★★★</span>
          <span className="font-medium text-foreground">4.8</span>
          from 12 reviews
        </div>
      </motion.div>
    </div>
  );
}

export default function HostSection() {
  return (
    <section className="py-26 md:py-32 border-b border-border/50 bg-primary/5">
      <div className="max-w-330 mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20 items-center">
          <FloatingCards />

          <div>
            <motion.h2
              className="text-[clamp(32px,5.2vw,64px)] leading-[1.02] tracking-[-0.02em] font-semibold max-w-[18ch]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px 0px" }}
              transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            >
              Publish in <em className="not-italic text-primary">minutes.</em> Reach your crowd.
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-base leading-[1.6] max-w-[58ch] mt-4.5"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px 0px" }}
              transition={{ duration: 0.9, delay: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
            >
              Built for venues, community groups, run clubs and solo hosts. No commissions, no
              surprise fees. Just a clean page people will actually remember.
            </motion.p>

            <ul className="flex flex-col gap-5 mt-8">
              {POINTS.map((pt, i) => {
                const Icon = pt.icon;
                return (
                  <motion.li
                    key={pt.title}
                    className="grid grid-cols-[auto_1fr] gap-4 items-start"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px 0px" }}
                    transition={{ duration: 0.9, delay: 0.16 + i * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
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
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px 0px" }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <Button size="lg" asChild>
                <Link href="/organizations/new">
                  <CalendarPlus />
                  Create Your Organization
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
