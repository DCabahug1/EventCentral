import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function AnalyticsSectionCard({ title, children }: Props) {
  return (
    <div className="flex flex-col border bg-card">
      <div className="flex items-center border-b px-5 py-4">
        <span className="text-sm font-semibold tracking-wide">{title}</span>
      </div>
      <div className="flex flex-col gap-5 p-5">{children}</div>
    </div>
  );
}
