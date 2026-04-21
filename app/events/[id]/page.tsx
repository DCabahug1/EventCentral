import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getEventById } from "@/lib/eventsServer";
import { formatDateTime } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) notFound();

  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-4 sm:p-8">
      <div className="flex flex-col gap-2">
        {event.organization_name ? (
          <p className="text-sm text-muted-foreground">{event.organization_name}</p>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
        {event.description ? (
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        ) : null}
      </div>

      <dl className="grid gap-3 text-sm">
        <div>
          <dt className="font-medium text-muted-foreground">Starts</dt>
          <dd>{formatDateTime(event.start_time)}</dd>
        </div>
        <div>
          <dt className="font-medium text-muted-foreground">Ends</dt>
          <dd>{formatDateTime(event.end_time)}</dd>
        </div>
        {event.address ? (
          <div>
            <dt className="font-medium text-muted-foreground">Location</dt>
            <dd>{event.address}</dd>
          </div>
        ) : null}
        {event.max_capacity != null ? (
          <div>
            <dt className="font-medium text-muted-foreground">Capacity</dt>
            <dd>{event.max_capacity} attendees</dd>
          </div>
        ) : null}
        {event.category ? (
          <div>
            <dt className="font-medium text-muted-foreground">Category</dt>
            <dd>{event.category}</dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href="/">Discover</Link>
        </Button>
        {event.organization_id != null ? (
          <Button asChild variant="outline">
            <Link href={`/organizations/${event.organization_id}`}>
              Organization page
            </Link>
          </Button>
        ) : null}
      </div>
    </main>
  );
}
