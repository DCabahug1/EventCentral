import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  orgName: string;
  deleteError: string;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteOrganizationDialog({
  orgName,
  deleteError,
  deleting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-org-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardContent className="space-y-4 p-6">
          <h2 id="delete-org-title" className="text-lg font-semibold">
            Delete organization?
          </h2>
          <p className="text-sm text-muted-foreground">
            This will permanently remove{" "}
            <span className="font-medium text-foreground">{orgName}</span>. This
            cannot be undone.
          </p>
          {deleteError ? (
            <p className="text-sm text-destructive">{deleteError}</p>
          ) : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete organization"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
