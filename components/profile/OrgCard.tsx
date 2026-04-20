"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Organization } from "@/lib/types";

export default function OrgCard({ org }: { org: Organization }) {
  return (
    <Link href={`/organizations/${org.id}`} className="group block">
      <Card className="flex items-center gap-4 p-4 transition-colors group-hover:bg-muted/50">
        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
          {org.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.avatar_url} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-primary">
              {org.name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate font-semibold leading-tight">{org.name}</p>
          {org.location ? (
            <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              {org.location}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Organization</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
