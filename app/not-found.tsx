import NotFoundContent from "@/components/ui/not-found-content";

export default function NotFound() {
  return (
    <NotFoundContent
      code="404"
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      href="/"
      linkLabel="Back to Home"
    />
  );
}
