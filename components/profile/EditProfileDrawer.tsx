"use client";

import { Phone, Upload, UserRound } from "lucide-react";
import { cn, formatUsPhoneInput } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  saving: boolean;
  formError: string;
  username: string;
  description: string;
  phone: string;
  avatarInputId: string;
  avatarPreview: string | null;
  profileAvatarUrl: string | null;
  formErrorRef: React.RefObject<HTMLParagraphElement | null>;
  formScrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAvatarChange: (file: File | null) => void;
  onUsernameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
};

export default function EditProfileDrawer({
  open,
  saving,
  formError,
  username,
  description,
  phone,
  avatarInputId,
  avatarPreview,
  profileAvatarUrl,
  formErrorRef,
  formScrollContainerRef,
  onOpenChange,
  onSubmit,
  onAvatarChange,
  onUsernameChange,
  onDescriptionChange,
  onPhoneChange,
}: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex max-h-[92vh] min-h-0 flex-col gap-0 overflow-hidden p-0">
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <DrawerHeader className="shrink-0">
            <DrawerTitle>Edit profile</DrawerTitle>
          </DrawerHeader>
          <div
            ref={formScrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2 [-webkit-overflow-scrolling:touch]"
          >
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor={avatarInputId} className="text-muted-foreground">
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
                      // eslint-disable-next-line @next/next/no-img-element -- blob preview
                      <img src={avatarPreview} alt="" className="size-full object-cover" />
                    ) : profileAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- existing avatar preview
                      <img src={profileAvatarUrl} alt="" className="size-full object-cover" />
                    ) : (
                      <span className="flex flex-col items-center gap-2">
                        <Upload className="size-5 text-muted-foreground" />
                        <span className="text-center text-xs text-muted-foreground">
                          Square image
                        </span>
                      </span>
                    )}
                    <Input
                      id={avatarInputId}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => onAvatarChange(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-username" className="text-muted-foreground">
                  Username
                </FieldLabel>
                <FieldContent className="gap-2">
                  <div className="relative">
                    <UserRound
                      className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="edit-username"
                      placeholder="Your display name"
                      className="pl-10"
                      required
                      value={username}
                      onChange={(e) => onUsernameChange(e.target.value)}
                    />
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-description" className="text-muted-foreground">
                  Description
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    id="edit-description"
                    className="min-h-24 resize-none"
                    value={description}
                    placeholder="Tell people about yourself..."
                    onChange={(e) => onDescriptionChange(e.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-phone" className="text-muted-foreground">
                  Phone
                </FieldLabel>
                <FieldContent>
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
                      onChange={(e) => onPhoneChange(formatUsPhoneInput(e.target.value))}
                    />
                  </div>
                  {formError ? (
                    <FieldError ref={formErrorRef} id="edit-profile-error">
                      {formError}
                    </FieldError>
                  ) : null}
                </FieldContent>
              </Field>
            </FieldGroup>
          </div>
          <DrawerFooter className="shrink-0 border-t bg-background pt-4">
            <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
