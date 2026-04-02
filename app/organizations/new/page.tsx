"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Link as LinkIcon,
  FileText,
  Building2,
  Mail,
  Phone,
  ImageIcon,
} from "lucide-react";
import { APIProvider } from "@vis.gl/react-google-maps";
import LocationInput from "@/components/map-view/LocationInput";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
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
import { createOrganization } from "@/lib/organizations";
import { uploadOrganizationAsset } from "@/lib/bucketHandler";
import { createClient } from "@/lib/supabase/client";
import type { Organization } from "@/lib/types";

function isOrganization(value: unknown): value is Organization {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as Organization).id === "number"
  );
}

function normalizeWebsite(input: string): string | null {
  const t = input.trim();
  if (!t) return null;
  if (!/^https?:\/\//i.test(t)) return `https://${t}`;
  return t;
}

export default function Page() {
  const router = useRouter();
  const avatarInputId = useId();
  const bannerInputId = useId();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreview(null);
      return;
    }
    const url = URL.createObjectURL(bannerFile);
    setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerFile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be signed in to create an organization.");
        return;
      }

      let avatarUrl: string | null = null;
      let bannerUrl: string | null = null;

      try {
        if (avatarFile) {
          avatarUrl = await uploadOrganizationAsset(
            avatarFile,
            user.id,
            "avatar",
          );
        }
        if (bannerFile) {
          bannerUrl = await uploadOrganizationAsset(
            bannerFile,
            user.id,
            "banner",
          );
        }
      } catch (uploadErr) {
        setError(
          uploadErr instanceof Error
            ? uploadErr.message
            : "Image upload failed.",
        );
        return;
      }

      const result = await createOrganization(
        name.trim(),
        description.trim(),
        avatarUrl,
        bannerUrl,
        normalizeWebsite(website),
        email.trim() || null,
        phone.trim() || null,
        location.trim() || null,
      );

      if (isOrganization(result)) {
        router.push("/");
        router.refresh();
        return;
      }

      // Postgres unique violation on organizations.name (organizations_name_key)
      if (
        result &&
        typeof result === "object" &&
        "code" in result &&
        (result as { code?: string }).code === "23505" &&
        typeof (result as { message?: string }).message === "string" &&
        (result as { message: string }).message.includes("organizations_name")
      ) {
        setError("Name must be unique.");
        return;
      }

      if (result instanceof Error) {
        setError(result.message || "Could not create organization.");
        return;
      }

      if (
        result &&
        typeof result === "object" &&
        "message" in result &&
        typeof (result as { message: unknown }).message === "string"
      ) {
        setError(
          (result as { message: string }).message ||
            "Could not create organization.",
        );
        return;
      }

      setError("Could not create organization.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="min-h-svh flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              New Organization
            </CardTitle>
            <CardDescription>
              Add your organization details and branding. You can edit these
              later. Required fields are marked with{" "}
              <span className="text-destructive" aria-hidden>
                *
              </span>
              .
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel
                    htmlFor={avatarInputId}
                    className="text-muted-foreground"
                  >
                    Avatar
                  </FieldLabel>
                  <FieldContent className="gap-2">
                    <label
                      htmlFor={avatarInputId}
                      className={cn(
                        "flex size-32 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border transition-colors hover:border-muted-foreground",
                      )}
                    >
                      {avatarPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                        <img
                          src={avatarPreview}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <>
                          <Upload className="text-muted-foreground mb-2 size-5" />
                          <span className="text-muted-foreground text-sm text-center">
                            Click to upload avatar
                          </span>
                        </>
                      )}
                      <Input
                        id={avatarInputId}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) =>
                          setAvatarFile(e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                    {avatarFile ? (
                      <p className="text-muted-foreground text-xs">
                        {avatarFile.name}
                      </p>
                    ) : null}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor={bannerInputId}
                    className="text-muted-foreground"
                  >
                    Banner
                  </FieldLabel>
                  <FieldDescription className="text-muted-foreground text-xs">
                    Wide image recommended (e.g. 1200×400).
                  </FieldDescription>
                  <FieldContent className="gap-2">
                    <label
                      htmlFor={bannerInputId}
                      className={cn(
                        "flex h-28 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border transition-colors hover:border-muted-foreground",
                      )}
                    >
                      {bannerPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                        <img
                          src={bannerPreview}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <ImageIcon className="text-muted-foreground mb-2 size-5" />
                          <span className="text-muted-foreground text-sm">
                            Click to upload banner
                          </span>
                        </>
                      )}
                      <Input
                        id={bannerInputId}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) =>
                          setBannerFile(e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                    {bannerFile ? (
                      <p className="text-muted-foreground text-xs">
                        {bannerFile.name}
                      </p>
                    ) : null}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="org-name"
                    className="text-muted-foreground"
                  >
                    Organization name{" "}
                    <span className="text-destructive" aria-hidden>
                      *
                    </span>
                  </FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Building2
                        className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                        aria-hidden
                      />
                      <Input
                        id="org-name"
                        name="name"
                        required
                        placeholder="e.g. SoundWave Productions"
                        className="pl-10"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                    <div className="flex gap-2">
                      <FileText
                        className="text-muted-foreground mt-2.5 size-[18px] shrink-0"
                        aria-hidden
                      />
                      <Textarea
                        id="org-description"
                        name="description"
                        placeholder="Tell people about your organization..."
                        className="min-h-24 resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="org-location"
                    className="text-muted-foreground"
                  >
                    Location
                  </FieldLabel>
                  <FieldContent>
                    <LocationInput
                      id="org-location"
                      value={location}
                      onChange={setLocation}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel className="text-muted-foreground">
                    Contact & links
                  </FieldLabel>
                  <FieldContent className="gap-3">
                    <div className="relative">
                      <LinkIcon
                        className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                        aria-hidden
                      />
                      <Input
                        id="org-website"
                        name="website"
                        type="url"
                        inputMode="url"
                        placeholder="Website URL"
                        className="pl-10"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Mail
                        className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                        aria-hidden
                      />
                      <Input
                        id="org-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Contact email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Phone
                        className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                        aria-hidden
                      />
                      <Input
                        id="org-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="Phone"
                        className="pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </CardContent>
            <CardFooter className="flex-col gap-2 border-t pt-6">
              {error ? <FieldError className="mb-4">{error}</FieldError> : null}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Creating…" : "Create organization"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </APIProvider>
  );
}
