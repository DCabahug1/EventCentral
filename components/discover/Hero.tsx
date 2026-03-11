"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

const CATEGORIES = [
  { label: "Music", emoji: "🎵" },
  { label: "Parties", emoji: "🎉" },
  { label: "Tech", emoji: "💻" },
  { label: "Sports", emoji: "🏆" },
  { label: "Food & Drink", emoji: "🍕" },
  { label: "Art", emoji: "🎨" },
  { label: "Outdoor", emoji: "🌿" },
];

function Hero({ onSearch }: { onSearch: (q: string) => void }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], ["0%", "50%"]);

  const submit = () => onSearch(input.trim());

  return (
    <div
      ref={heroRef}
      className="flex flex-col items-center justify-center md:h-[50svh] h-[60svh] p-4 gap-4 relative w-full overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-x-0 -top-[25%] -z-10 h-[150%]"
        style={{ y: parallaxY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Image
          src="/discover-page/Hero.jpg"
          alt="EventCentral"
          fill
          className="object-cover object-[center_40%]"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 dark:from-background to-transparent" />

      {/* Headline */}
      <motion.div
        className="flex flex-col items-center gap-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white">
          Discover{" "}
          <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Events
          </span>
        </h1>
      </motion.div>

      {/* Search bar */}
      <motion.div
        className="dark flex w-full max-w-lg items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 py-1.5 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Search for an event"
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-white placeholder:text-white/50"
        />
        <Button size="sm" className="shrink-0 rounded-full" onClick={submit}>
          <Search />
          Search
        </Button>
      </motion.div>

      {/* Category filter tags */}
      <motion.div
        className="flex flex-wrap justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        {CATEGORIES.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => { setInput(label); onSearch(label); }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            {emoji} {label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

export default Hero;
