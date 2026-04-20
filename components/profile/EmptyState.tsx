"use client";

import React from "react";

export default function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
