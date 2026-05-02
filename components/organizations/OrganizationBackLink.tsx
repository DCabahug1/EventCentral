import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function OrganizationBackLink() {
  return (
    <Link
      href="/discover"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft className="size-4" />
      Back to Discover
    </Link>
  );
}
