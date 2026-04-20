"use client";

import { Mail, Pencil, Phone } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/types";

type Props = {
  profile: Profile;
  phoneDisplay: string;
  onEdit: () => void;
};

export default function ProfileHeaderCard({
  profile,
  phoneDisplay,
  onEdit,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-20 shrink-0">
            <AvatarImage src={profile.avatar_url ?? ""} />
            <AvatarFallback className="text-2xl">
              {profile.username?.charAt(0).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl font-semibold leading-tight">{profile.username}</h2>
            <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
              {profile.email ? (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" />
                  {profile.email}
                </span>
              ) : null}
              {phoneDisplay ? (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="size-3.5 shrink-0" />
                  {phoneDisplay}
                </span>
              ) : null}
            </div>
            {profile.description ? (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {profile.description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          <Button type="button" variant="secondary" onClick={onEdit}>
            <Pencil className="size-4" />
            Edit Profile
          </Button>
        </div>
        </div>
      </Card>
    </motion.div>
  );
}
