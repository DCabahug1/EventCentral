"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Props = {
  bannerUrl: string | null;
};

export default function OrganizationBanner({ bannerUrl }: Props) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerUrl) return;
    const el = parallaxRef.current;
    if (!el) return;

    const update = () => {
      el.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [bannerUrl]);

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-muted border-b">
      <div className="relative h-48 w-full overflow-hidden sm:h-64 md:h-72 lg:h-80">
        {bannerUrl ? (
          <div
            ref={parallaxRef}
            className="absolute -bottom-[25%] -top-[25%] left-0 right-0"
            style={{ willChange: "transform" }}
          >
            <Image
              src={bannerUrl}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-muted to-muted" />
        )}
      </div>
    </div>
  );
}
