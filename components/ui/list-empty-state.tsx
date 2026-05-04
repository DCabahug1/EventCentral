"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  action?: ReactNode;
  className?: string;
};

export default function ListEmptyState({ message, action, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center gap-4 py-12 text-center", className)}>
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
