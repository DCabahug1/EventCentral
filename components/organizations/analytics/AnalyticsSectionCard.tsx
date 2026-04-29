"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type Props = {
  title: string;
  children: ReactNode;
  delay?: number;
};

export default function AnalyticsSectionCard({
  title,
  children,
  delay = 0,
}: Props) {
  return (
    <motion.div
      className="flex flex-col border bg-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.2, 0.7, 0.2, 1],
      }}
    >
      <div className="flex items-center border-b px-5 py-4">
        <span className="text-sm font-semibold tracking-wide">{title}</span>
      </div>
      <div className="flex flex-col gap-5 p-5">{children}</div>
    </motion.div>
  );
}
