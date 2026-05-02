"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function AuthMarketingHero() {
  return (
    <div className="relative order-1 min-h-[min(40vh,22rem)] w-full lg:order-0 lg:min-h-0 lg:w-2/3 lg:shrink-0">
      <Image
        src="/auth-pages/AuthFormSideImage.jpg"
        alt=""
        fill
        className="border border-border object-cover"
        sizes="(max-width: 1024px) 100vw, 67vw"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 flex items-end p-10 w-full">
        <motion.div
          className="max-w-6xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-balance text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          >
            Your next experience<br />starts <span className="text-primary">here.</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-balance text-sm text-white/90 drop-shadow sm:text-base md:text-lg lg:text-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
          >
            Discover events happening around you.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
