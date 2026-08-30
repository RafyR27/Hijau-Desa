import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

function CardKatalog({
  name,
  image,
  poin,
}: {
  name: string;
  image: string;
  poin: number;
}) {
  return (
    <Card
      key={name}
      className="overflow-hidden rounded-xl py-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-muted">
        <Image
          src={
            image ||
            "https://res.cloudinary.com/dejhqj1te/image/upload/v1787953889/no-image_skmrix.jpg"
          }
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-1 px-3 py-3 justify-between">
        <h3 className="text-sm font-medium leading-5">{name}</h3>

        <p className="text-sm font-semibold text-orange-500">{poin} Poin</p>
      </CardContent>
    </Card>
  );
}

export {CardKatalog}
