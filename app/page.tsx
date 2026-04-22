import { AuthError } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/user";
import LandingHero from "@/components/landing/LandingHero";
import CategoriesSection from "@/components/landing/CategoriesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedEventsSection from "@/components/landing/FeaturedEventsSection";
import HostSection from "@/components/landing/HostSection";
import LandingCta from "@/components/landing/LandingCta";

export default async function Page() {
  const userResult = await getCurrentUser();
  const isLoggedIn = !(userResult instanceof AuthError) && !!userResult.user;

  return (
    <div className="flex flex-col w-full">
      <LandingHero isLoggedIn={isLoggedIn} />
      <CategoriesSection />
      <HowItWorks />
      <FeaturedEventsSection />
      <HostSection />
      <LandingCta isLoggedIn={isLoggedIn} />
    </div>
  );
}
