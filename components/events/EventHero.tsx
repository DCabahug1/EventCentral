"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

type Props = {
  imageUrl: string | null;
  title: string;
};

export default function EventHero({ imageUrl, title }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
        <motion.div
          className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" as const }}
        >
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1024px"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-muted to-muted" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
