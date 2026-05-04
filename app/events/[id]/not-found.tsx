import NotFoundContent from "@/components/ui/not-found-content";

export default function EventNotFound() {
  return (
    <NotFoundContent
      title="Event not found"
      description="This event doesn't exist or may have been removed."
      href="/discover"
      linkLabel="Browse events"
    />
  );
}
