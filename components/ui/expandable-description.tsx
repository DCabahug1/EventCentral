"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ExpandableDescriptionProps = {
  text: string;
  dialogTitle: string;
  /** `center`: mobile-centered like profile card; `start`: left-aligned */
  align?: "center" | "start";
  previewClassName?: string;
};

export function ExpandableDescription({
  text,
  dialogTitle,
  align = "start",
  previewClassName,
}: ExpandableDescriptionProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      setTruncated(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  return (
    <>
      <div
        className={cn(
          "flex w-full max-w-full flex-col gap-1",
          align === "center" && "items-center sm:items-start",
          align === "start" && "items-start",
        )}
      >
        <p
          ref={ref}
          className={cn(
            "line-clamp-2 max-w-full text-sm text-muted-foreground",
            align === "center" && "text-center sm:text-left",
            previewClassName,
          )}
        >
          {text}
        </p>
        {truncated ? (
          <Button
            type="button"
            variant="link"
            className={cn(
              "h-auto min-h-0 p-0 text-sm font-medium text-primary",
              align === "center" && "self-center sm:self-start",
            )}
            onClick={() => setOpen(true)}
          >
            Show more
          </Button>
        ) : null}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[min(92vh,560px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="shrink-0 border-b px-4 py-4 sm:px-6">
            <DialogTitle className="text-left text-2xl font-bold tracking-tight">
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {text}
            </p>
          </div>
          <DialogFooter className="shrink-0 border-t px-4 py-4 sm:px-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
