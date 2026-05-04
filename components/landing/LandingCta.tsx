"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Compass, MapPin, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingCtaProps {
  isLoggedIn: boolean;
}

export default function LandingCta({ isLoggedIn }: LandingCtaProps) {
  return (
    <section className="py-36 text-center bg-radial-[at_50%_100%] from-primary/15 from-0% to-transparent to-70%">
      <div className="max-w-330 mx-auto px-6 md:px-10 flex flex-col items-center gap-5">
        <motion.h2
          className="font-display text-[clamp(64px,10vw,144px)] leading-[0.9] tracking-[0.02em]"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
        >
          Your next favorite event
          <br />
          <em className="not-italic text-primary">is out there.</em>
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-sm md:text-base lg:text-xl leading-[1.6] max-w-[48ch]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}
        >
          Find something worth showing up for.
        </motion.p>

        <motion.div
          className="flex gap-3 flex-wrap justify-center"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {isLoggedIn ? (
            <Button size="lg" asChild>
              <Link href="/discover">
                <MapPin />
                Find Events
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
