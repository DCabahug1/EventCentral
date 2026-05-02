import { AuthError } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth/user";
import { getCategoryCounts } from "@/lib/events/server";
import LandingHero from "@/components/landing/LandingHero";
import CategoriesSection from "@/components/landing/CategoriesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedEventsSection from "@/components/landing/FeaturedEventsSection";
import HostSection from "@/components/landing/HostSection";
import LandingCta from "@/components/landing/LandingCta";
import LenisProvider from "@/components/providers/LenisProvider";

export default async function Page() {
  const [userResult, categoryCounts] = await Promise.all([
    getCurrentUser(),
    getCategoryCounts(),
  ]);
  const isLoggedIn = !(userResult instanceof AuthError) && !!userResult.user;

  return (
    <LenisProvider>
      <div className="flex flex-col w-full">
        <LandingHero isLoggedIn={isLoggedIn} />
        <CategoriesSection counts={categoryCounts} />
        <HowItWorks />
        <FeaturedEventsSection />
        <HostSection />
        <LandingCta isLoggedIn={isLoggedIn} />
      </div>
    </LenisProvider>
  );
}
