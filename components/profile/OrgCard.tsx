"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Organization } from "@/lib/types";

export default function OrgCard({ org }: { org: Organization }) {
  return (
    <Link href={`/organizations/${org.id}`} className="group block">
      <Card className="flex flex-row items-center gap-4 p-4 transition-colors group-hover:bg-muted/50">
        <div className="relative flex size-14 shrink-0 items-center justify-center self-center overflow-hidden rounded-none bg-primary/10">
          {org.avatar_url ? (
            <Image
              src={org.avatar_url}
              alt=""
              width={56}
              height={56}
              className="size-full border border-border object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-primary">
              {org.name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 justify-center">
          <p className="truncate font-semibold leading-tight">{org.name}</p>
          <p className="flex min-h-5 items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="min-w-0 truncate">
              {org.location ?? "Location TBD"}
            </span>
          </p>
        </div>
      </Card>
    </Link>
  );
}
