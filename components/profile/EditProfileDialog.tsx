"use client";

import Image from "next/image";
import { Phone, Upload, UserRound } from "lucide-react";
import { cn, formatUsPhoneInput } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type EditProfileDialogProps = {
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
  onRequestDelete: () => void;
};

export default function EditProfileDialog({
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
  onRequestDelete,
}: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(92vh,900px)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader className="shrink-0 px-4 py-4 sm:px-6">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Edit profile
            </DialogTitle>
          </DialogHeader>
          <div
            ref={formScrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [-webkit-overflow-scrolling:touch] sm:p-6"
          >
            <FieldGroup className="gap-5">
              <Field>
                <div className="flex w-full justify-center">
                  <FieldLabel htmlFor={avatarInputId} className="text-muted-foreground">
                    Avatar
                  </FieldLabel>
                </div>
                <FieldContent className="items-center gap-2">
                  <label
                    htmlFor={avatarInputId}
                    className={cn(
                      "flex size-32 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-border transition-colors hover:border-muted-foreground",
                    )}
                  >
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt=""
                        width={128}
                        height={128}
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : profileAvatarUrl ? (
                      <Image
                        src={profileAvatarUrl}
                        alt=""
                        width={128}
                        height={128}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex flex-col items-center gap-2">
                        <Upload className="size-5 text-muted-foreground" />
                        <span className="text-center text-xs text-muted-foreground">
                          Click to upload
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
          <DialogFooter className="shrink-0 border-t bg-background px-4 py-4 sm:px-6">
            <Button
              type="button"
              variant="destructive"
              onClick={onRequestDelete}
            >
              Delete Account
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
