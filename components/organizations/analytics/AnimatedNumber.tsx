"use client";

import { useEffect } from "react";
import { animate, useInView, useMotionValue, useTransform } from "motion/react";
import { motion } from "motion/react";
import { useRef } from "react";

type Props = {
  value: number;
  duration?: number;
  decimals?: number;
  format?: (n: number) => string;
};

export default function AnimatedNumber({
  value,
  duration = 1.1,
  decimals = 0,
  format,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px 0px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => {
    if (format) return format(latest);
    return latest.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration,
      ease: [0.2, 0.7, 0.2, 1],
    });
    return () => controls.stop();
  }, [inView, value, duration, mv]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
