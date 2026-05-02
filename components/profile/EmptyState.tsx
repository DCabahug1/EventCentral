"use client";

import React from "react";
import ListEmptyState from "@/components/ui/list-empty-state";

export default function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) {
  return <ListEmptyState message={message} action={action} />;
}
