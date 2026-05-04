import Link from "next/link";
import Image from "next/image";
import type { Organization } from "@/lib/types";

type Props = {
  organization: Organization;
};

export default function EventHostedByCard({ organization }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Hosted by
      </p>
      <div className="flex items-center gap-3">
        {organization.avatar_url ? (
          <Image
            src={organization.avatar_url}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-sm object-cover"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-muted text-lg font-semibold text-muted-foreground">
            {organization.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <span className="font-semibold leading-tight">{organization.name}</span>
      </div>
      {organization.description && (
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {organization.description}
        </p>
      )}
      <Link
        href={`/organizations/${organization.id}`}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        View organization <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
