"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { CATEGORY_CONFIG } from "@/lib/categoryConfig";

function Hero({
  onSearch,
  onTagSelect,
  activeTag,
}: {
  onSearch: (q: string) => void;
  onTagSelect: (tag: string) => void;
  activeTag: string;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], ["0%", "50%"]);

  const submit = () => {
    setInput(""); // clear input after submitting so it doesn't linger
    onSearch(input.trim());
  };

  return (
    <div
      ref={heroRef}
      className="flex flex-col items-center justify-center md:h-[60svh] h-[70svh] p-4 gap-4 relative w-full overflow-hidden"
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
        className="dark flex w-full max-w-2xl items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 py-1.5 backdrop-blur-sm"
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
        {CATEGORY_CONFIG.map(({ label, icon: Icon, colorClass }) => (
          <Badge
            key={label}
            asChild
            className={`cursor-pointer backdrop-blur-sm transition-colors px-3 py-1 text-xs ${
              activeTag === label
                ? "border-primary bg-primary text-primary-foreground [&>svg]:text-primary-foreground"
                : "border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <button onClick={() => onTagSelect(label)}>
              <Icon className={activeTag === label ? "" : colorClass} />
              {label}
            </button>
          </Badge>
        ))}
      </motion.div>
    </div>
  );
}

export default Hero;
