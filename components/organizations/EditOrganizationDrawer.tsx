import Image from "next/image";
import type { RefObject } from "react";
import {
  Building2,
  ImageIcon,
  Link as LinkIcon,
  Mail,
  Phone,
  Upload,
} from "lucide-react";
import { LocationInput } from "@/components/ui/location-input";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn, formatUsPhoneInput } from "@/lib/utils";

export type EditOrganizationDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  avatarInputId: string;
  bannerInputId: string;
  formScrollContainerRef: RefObject<HTMLDivElement | null>;
  formErrorRef: RefObject<HTMLDivElement | null>;
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  website: string;
  onWebsiteChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  avatarPreview: string | null;
  bannerPreview: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  onAvatarFileChange: (file: File | null) => void;
  onBannerFileChange: (file: File | null) => void;
  formError: string;
  saving: boolean;
  onRequestDelete: () => void;
};

export default function EditOrganizationDrawer({
  open,
  onOpenChange,
  onSubmit,
  avatarInputId,
  bannerInputId,
  formScrollContainerRef,
  formErrorRef,
  name,
  onNameChange,
  description,
  onDescriptionChange,
  location,
  onLocationChange,
  website,
  onWebsiteChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  avatarPreview,
  bannerPreview,
  avatarUrl,
  bannerUrl,
  onAvatarFileChange,
  onBannerFileChange,
  formError,
  saving,
  onRequestDelete,
}: EditOrganizationDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex max-h-[92vh] min-h-0 flex-col gap-0 overflow-hidden p-0">
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <DrawerHeader className="shrink-0">
            <DrawerTitle>Edit organization</DrawerTitle>
          </DrawerHeader>
          <div
            ref={formScrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2 [-webkit-overflow-scrolling:touch]"
          >
            <FieldGroup className="gap-5">
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
                      "flex size-32 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed border-border transition-colors hover:border-muted-foreground",
                    )}
                  >
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt=""
                        width={128}
                        height={128}
                        unoptimized
                        className="size-full border border-border object-cover"
                      />
                    ) : avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt=""
                        width={128}
                        height={128}
                        className="size-full border border-border object-cover"
                      />
                    ) : (
                      <>
                        <Upload className="mb-2 size-5 text-muted-foreground" />
                        <span className="text-center text-xs text-muted-foreground">
                          Square image
                        </span>
                      </>
                    )}
                    <Input
                      id={avatarInputId}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) =>
                        onAvatarFileChange(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor={bannerInputId}
                  className="text-muted-foreground"
                >
                  Banner
                </FieldLabel>
                <FieldDescription className="text-xs text-muted-foreground">
                  Wide image recommended.
                </FieldDescription>
                <FieldContent className="gap-2">
                  <label
                    htmlFor={bannerInputId}
                    className={cn(
                      "flex h-48 w-full max-w-[600px] cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed border-border transition-colors hover:border-muted-foreground",
                    )}
                  >
                    {bannerPreview ? (
                      <Image
                        src={bannerPreview}
                        alt=""
                        width={800}
                        height={192}
                        unoptimized
                        className="h-full w-full border border-border object-cover"
                      />
                    ) : bannerUrl ? (
                      <Image
                        src={bannerUrl}
                        alt=""
                        width={800}
                        height={200}
                        className="h-full w-full border border-border object-cover"
                      />
                    ) : (
                      <>
                        <ImageIcon className="mb-2 size-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload banner
                        </span>
                      </>
                    )}
                    <Input
                      id={bannerInputId}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) =>
                        onBannerFileChange(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="edit-name"
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
                      className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="edit-name"
                      placeholder="e.g. SoundWave Productions"
                      required
                      className="pl-10"
                      value={name}
                      onChange={(e) => onNameChange(e.target.value)}
                    />
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="edit-description"
                  className="text-muted-foreground"
                >
                  Description
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    id="edit-description"
                    className="min-h-24 resize-none"
                    value={description}
                    placeholder="Tell people about your organization..."
                    onChange={(e) => onDescriptionChange(e.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="edit-location"
                  className="text-muted-foreground"
                >
                  Location
                </FieldLabel>
                <FieldContent>
                  <LocationInput
                    id="edit-location"
                    placeholder="City, neighborhood, state, or country"
                    value={location}
                    onChange={onLocationChange}
                    mapPinSide="left"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel className="text-muted-foreground">
                  Contact &amp; links
                </FieldLabel>
                <FieldContent className="gap-3">
                  <div className="relative">
                    <LinkIcon
                      className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="edit-website"
                      type="url"
                      inputMode="url"
                      placeholder="Website URL"
                      className="pl-10"
                      value={website}
                      onChange={(e) => onWebsiteChange(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="edit-email"
                      type="email"
                      placeholder="Contact email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => onEmailChange(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Phone
                      className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="edit-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="Phone"
                      className="pl-10"
                      value={phone}
                      onChange={(e) =>
                        onPhoneChange(formatUsPhoneInput(e.target.value))
                      }
                    />
                  </div>
                  {formError ? (
                    <FieldError
                      ref={formErrorRef}
                      id="edit-org-error"
                      className="mb-4"
                    >
                      {formError}
                    </FieldError>
                  ) : null}
                </FieldContent>
              </Field>
            </FieldGroup>
          </div>
          <DrawerFooter className="shrink-0 border-t bg-background pt-4">
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="destructive"
                onClick={onRequestDelete}
              >
                Delete organization
              </Button>
              <DrawerClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
