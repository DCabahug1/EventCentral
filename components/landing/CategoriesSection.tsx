"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Music, PartyPopper, Code, Trophy, Sandwich, Paintbrush, Leaf } from "lucide-react";

const CATEGORIES = [
  { name: "Music",        icon: Music,       color: "oklch(0.72 0.19 305)" },
  { name: "Parties",      icon: PartyPopper, color: "oklch(0.74 0.19 0)"   },
  { name: "Tech",         icon: Code,        color: "oklch(0.7 0.17 252)"  },
  { name: "Sports",       icon: Trophy,      color: "oklch(0.77 0.17 55)"  },
  { name: "Food & Drink", icon: Sandwich,    color: "oklch(0.7 0.19 25)"   },
  { name: "Art",          icon: Paintbrush,  color: "oklch(0.82 0.15 85)"  },
  { name: "Outdoor",      icon: Leaf,        color: "oklch(0.78 0.18 150)" },
];

interface CategoryCardProps {
  name: string;
  icon: React.ElementType;
  color: string;
  count: number;
}

function CategoryCard({ name, icon: Icon, color, count }: CategoryCardProps) {
  return (
    <Link
      href="/discover"
      className="flex-none flex flex-row items-center gap-4 px-7 py-5 border border-border/50 bg-transparent cursor-pointer transition-colors duration-300 hover:bg-card/60"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
    >
      <span style={{ color }} className="flex items-center justify-center shrink-0">
        <Icon size={28} strokeWidth={1.6} />
      </span>
      <span>
        <div className="text-[22px] font-medium tracking-[-0.01em] leading-tight">{name}</div>
        <div className="mt-1.5 text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
        {count} upcoming
      </div>
      </span>
    </Link>
  );
}

interface CategoriesSectionProps {
  counts: Record<string, number>;
}

export default function CategoriesSection({ counts }: CategoriesSectionProps) {
  return (
    <section className="py-26 md:py-32 border-b border-border/50">
      <div className="max-w-330 mx-auto px-6 md:px-10">
        <motion.h2
          className="text-[clamp(32px,5.2vw,64px)] leading-[1.02] tracking-[-0.02em] font-semibold max-w-[18ch]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        >
          Find exactly <em className="not-italic text-primary">what you're looking for.</em>
        </motion.h2>

        <motion.p
          className="mt-[18px] text-muted-foreground text-base leading-[1.6] max-w-[58ch]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.9, delay: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
        >
          Filter by what you&apos;re in the mood for. Every listing shows date, location, and capacity.
        </motion.p>

        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.9, delay: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="overflow-hidden relative [-webkit-mask-image:linear-gradient(to_right,transparent,black_60px,black_calc(100%_-_60px),transparent)] [mask-image:linear-gradient(to_right,transparent,black_60px,black_calc(100%_-_60px),transparent)]">
            <div
              className="flex gap-4 w-max [animation:marquee-scroll_48s_linear_infinite]"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
            >
              {CATEGORIES.map((cat) => <CategoryCard key={cat.name} {...cat} count={counts[cat.name] ?? 0} />)}
              {CATEGORIES.map((cat) => <CategoryCard key={`${cat.name}-dup`} {...cat} count={counts[cat.name] ?? 0} />)}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
