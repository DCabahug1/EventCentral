import { cn } from "@/lib/utils";

/** Red asterisk after required field labels (app-wide standard). */
export function RequiredMark({ className }: { className?: string }) {
  return (
    <span className={cn("text-destructive", className)} aria-hidden>
      *
    </span>
  );
}

/** Muted “(optional)” after optional field labels. */
export function OptionalFieldHint({ className }: { className?: string }) {
  return (
    <span
      className={cn("text-xs font-normal text-muted-foreground", className)}
    >
      {" "}
      (optional)
    </span>
  );
}

/** Shown once at the top of forms that mix required and optional fields. */
export function FormRequiredLegend({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)} role="note">
      Required fields are marked with <RequiredMark className="inline" />.
    </p>
  );
}
