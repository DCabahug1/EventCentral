import Image from "next/image";

type Props = {
  imageUrl: string | null;
  title: string;
};

export default function EventHero({ imageUrl, title }: Props) {
  return (
    <div className="relative h-48 w-full bg-muted sm:h-64 md:h-72">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-primary/30 via-muted to-muted" />
      )}
    </div>
  );
}
