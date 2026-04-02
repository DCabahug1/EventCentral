"use client";

import { useId, useState } from "react";
import {
  Upload,
  Link as LinkIcon,
  MapPin,
  FileText,
  Building2,
} from "lucide-react";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Page() {
  const [logo, setLogo] = useState<File | null>(null);
  const logoInputId = useId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">New organization</CardTitle>
          <CardDescription>
            Create a new organization to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel
                  htmlFor={logoInputId}
                  className="text-muted-foreground"
                >
                  Organization logo
                </FieldLabel>
                <FieldContent>
                  <label
                    htmlFor={logoInputId}
                    className={cn(
                      "flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border transition-colors hover:border-muted-foreground",
                    )}
                  >
                    <Upload className="text-muted-foreground mb-2 size-5" />
                    <span className="text-muted-foreground text-sm">
                      Click to upload
                    </span>
                    <Input
                      id={logoInputId}
                      ƒ
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  {logo ? (
                    <p className="text-muted-foreground text-xs">{logo.name}</p>
                  ) : null}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="org-name"
                  className="text-muted-foreground"
                >
                  Organization name
                </FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Building2
                      className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                      aria-hidden
                    />
                    <Input
                      id="org-name"
                      placeholder="e.g. SoundWave Productions"
                      className="pl-10"
                    />
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="org-description"
                  className="text-muted-foreground"
                >
                  Description
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    id="org-description"
                    placeholder="Tell people about your organization..."
                    className="min-h-24 resize-none"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="org-location"
                  className="text-muted-foreground"
                >
                  Location (optional)
                </FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <MapPin
                      className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                      aria-hidden
                    />
                    <Input
                      id="org-location"
                      placeholder="City, State"
                      className="pl-10"
                    />
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-muted-foreground">
                  Social links
                </FieldLabel>
                <FieldContent className="gap-3">
                  <div className="relative">
                    <LinkIcon
                      className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                      aria-hidden
                    />
                    <Input
                      id="org-website"
                      type="url"
                      inputMode="url"
                      placeholder="Website URL"
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <LinkIcon
                      className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                      aria-hidden
                    />
                    <Input
                      id="org-social"
                      placeholder="Instagram, Twitter, etc."
                      className="pl-10"
                    />
                  </div>
                </FieldContent>
              </Field>
            </FieldGroup>
          </CardContent>
        </form>
        <CardFooter className="flex-col gap-2 border-t pt-6 sm:flex-row">
          <Button type="button" className="w-full" size="lg">
            Create organization
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
