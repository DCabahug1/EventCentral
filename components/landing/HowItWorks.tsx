"use client";
import { motion } from "motion/react";

const STEPS = [
  {
    n: "01",
    title: "Find your event",
    desc: "Search by name, browse categories, or filter by date.",
  },
  {
    n: "02",
    title: "Filter the noise",
    desc: "Seven categories, real capacity counts, live status.",
  },
  {
    n: "03",
    title: "RSVP and show up",
    desc: "Find an event, open the page, and reserve your spot in seconds.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-26 md:py-32 border-b border-border/50 dark:bg-card bg-muted">
      <div className="max-w-330 mx-auto px-6 md:px-10">
        <motion.h2
          className="text-[clamp(40px,5.2vw,64px)] leading-[1.02] tracking-[-0.02em] font-semibold max-w-[18ch]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        >
          From scrolling to showing up,{" "}
          <em className="not-italic text-primary">just like that.</em>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-border/50 md:divide-y-0 md:divide-x mt-16">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              className="flex flex-col gap-4 py-8 md:px-8 md:first:pl-0 md:last:pr-0"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px 0px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.2, 0.7, 0.2, 1],
              }}
            >
              <div className="text-2xl md:text-4xl font-normal text-muted-foreground/40 leading-none">
                {step.n}
              </div>
              <h3 className="text-xl md:text-4xl font-medium tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-lg leading-[1.6]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
