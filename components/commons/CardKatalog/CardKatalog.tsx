import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function CardKatalog({
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
        <Image src={image || "/garbage-can.webp"} alt={name} fill className="object-cover" />
      </div>

      <CardContent className="flex flex-col gap-1 px-3 py-3">
        <h3 className="text-sm font-medium leading-5">{name}</h3>

        <p className="text-sm font-semibold text-orange-500">{poin} Poin</p>
      </CardContent>
    </Card>
  );
}
