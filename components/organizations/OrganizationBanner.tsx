import Image from "next/image";

type Props = {
  bannerUrl: string | null;
};

export default function OrganizationBanner({ bannerUrl }: Props) {
  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-border bg-muted">
      <div className="relative w-full sm:h-44 md:h-48 lg:h-52">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt=""
            fill
            className="border border-border object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-muted to-muted" />
        )}
      </div>
    </div>
  );
}
