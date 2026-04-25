"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type Props = {
  imageUrl: string | null;
  title: string;
};

export default function EventHero({ imageUrl, title }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(
    scrollY,
    [0, 500],
    ["0%", prefersReducedMotion ? "8%" : "50%"],
  );

  return (
    <div className="relative h-56 w-full overflow-hidden bg-muted sm:h-72 md:h-96">
      {imageUrl ? (
        <>
          <motion.div
            className="absolute inset-x-0 -top-[25%] h-[150%]"
            style={{ y: parallaxY }}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-muted to-muted" />
      )}
    </div>
  );
}
