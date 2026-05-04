import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  code?: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
};

export default function NotFoundContent({
  code,
  title,
  description,
  href = "/",
  linkLabel = "Go home",
}: Props) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      {code && (
        <p className="text-8xl font-bold tracking-tighter text-muted-foreground">
          {code}
        </p>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button asChild>
        <Link href={href}>{linkLabel}</Link>
      </Button>
    </div>
  );
}
