"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Compass, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingCtaProps {
  isLoggedIn: boolean;
}

export default function LandingCta({ isLoggedIn }: LandingCtaProps) {
  return (
    <section className="py-36 text-center">
      <div className="max-w-330 mx-auto px-6 md:px-10 flex flex-col items-center gap-5">
        <motion.h2
          className="text-[clamp(44px,7vw,96px)] leading-[0.98] tracking-[-0.03em] font-semibold"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        >
          Your next favorite event
          <br />
          <em className="not-italic text-primary">is out there.</em>
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-base leading-[1.6] max-w-[48ch]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.2, 0.7, 0.2, 1] }}
        >
          Find something worth showing up for.
        </motion.p>

        <motion.div
          className="flex gap-3 flex-wrap justify-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.9, delay: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {isLoggedIn ? (
            <Button size="lg" asChild>
              <Link href="/map-view">
                <Compass />
                Open the Map
              </Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link href="/auth/register">
                <UserPlus />
                Get Started
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
