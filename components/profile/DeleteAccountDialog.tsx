"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  deleting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteAccountDialog({
  open,
  deleting,
  error,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-profile-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Card className="w-full max-w-md border-border shadow-xl">
        <div className="space-y-4 p-6">
          <h2 id="delete-profile-title" className="text-lg font-semibold">
            Delete account?
          </h2>
          <p className="text-sm text-muted-foreground">
            This permanently deletes your EventCentral account and associated profile,
            organizations, and events.
          </p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={deleting}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete account"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
