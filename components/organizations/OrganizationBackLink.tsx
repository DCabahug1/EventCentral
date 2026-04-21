import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OrganizationBackLink() {
  return (
    <Link
      href="/"
      className="inline-flex w-fit items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
    >
      <ArrowLeft className="size-4 shrink-0" />
      Back to Discover
    </Link>
  );
}
