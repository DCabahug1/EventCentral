import Image from "next/image";
import Link from "next/link";
import { BarChart3, Globe, Mail, MapPin, Pencil, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableDescription } from "@/components/ui/expandable-description";
import { cn, formatUsPhoneDisplay, phoneDigitsForTel } from "@/lib/utils";
import { normalizeWebsite } from "@/lib/organizations/page";
import type { Organization, Profile } from "@/lib/types";

type Props = {
  org: Organization;
  founderProfile: Profile | null;
  isOwner: boolean;
  onEdit: () => void;
};

export default function OrganizationProfileHeader({
  org,
  founderProfile,
  isOwner,
  onEdit,
}: Props) {
  const avatarSrc = org.avatar_url;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
      <div
        className={cn(
          "relative size-40 shrink-0 self-center overflow-hidden rounded-sm bg-muted",
        )}
      >
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt=""
            fill
            className="border border-border object-cover"
            sizes="(max-width: 768px) 96px, 112px"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center border border-border text-4xl font-medium text-muted-foreground md:text-5xl"
            aria-hidden
          >
            {org.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex min-w-0 w-full flex-1 flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h1 className="min-w-0 flex-1 text-2xl font-bold tracking-tight">
            {org.name}
          </h1>
          {org.website || isOwner ? (
            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
              {org.website ? (
                <Button asChild className="w-full sm:w-auto" size="sm">
                  <a
                    href={normalizeWebsite(org.website) ?? org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="size-4" />
                    Visit website
                  </a>
                </Button>
              ) : null}
              {isOwner ? (
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Link href={`/organizations/${org.id}/analytics`}>
                    <BarChart3 className="size-4" />
                    Analytics
                  </Link>
                </Button>
              ) : null}
              {isOwner ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={onEdit}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {org.location ? (
            <div className="flex min-w-0 max-w-full items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 wrap-break-word">{org.location}</span>
            </div>
          ) : null}
          {founderProfile ? (
            <div className="flex min-w-0 max-w-full items-center gap-2">
              <User className="size-4 shrink-0 text-muted-foreground" />
              <span className="shrink-0 text-muted-foreground">Founded by</span>
              <span className="min-w-0 truncate font-medium text-foreground">
                {founderProfile.username ?? "Unknown"}
              </span>
            </div>
          ) : null}
          {org.email ? (
            <a
              href={`mailto:${org.email}`}
              className="flex min-w-0 max-w-full items-center gap-2 break-all text-primary hover:underline"
            >
              <Mail className="size-4 shrink-0" />
              {org.email}
            </a>
          ) : null}
          {phoneDigitsForTel(org.phone) ? (
            <a
              href={`tel:${phoneDigitsForTel(org.phone)}`}
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Phone className="size-4 shrink-0" />
              {formatUsPhoneDisplay(org.phone)}
            </a>
          ) : null}
        </div>

        {org.description ? (
          <ExpandableDescription
            text={org.description}
            dialogTitle="About"
            align="start"
            previewClassName="text-base leading-relaxed"
          />
        ) : null}
      </div>
    </div>
  );
}
