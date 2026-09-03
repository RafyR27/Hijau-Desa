import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { MdOutlineRecycling } from "react-icons/md";

interface CardRiwayatProps {
  title: string;
  date: string;
  poin: string;
  weight?: string;
  className?: string;
}

function CardRiwayat({
  title,
  date,
  poin,
  weight,
  className,
}: CardRiwayatProps) {
  const isPositive = poin.includes("+");
  const router = usePathname()

  return (
    <Card
      className={cn("py-3.5 px-4 md:px-5 rounded-xl bg-card ring-1", className)}
    >
      <CardContent className="flex items-center justify-between p-0">
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl text-xl",
              isPositive || router.includes("warung")
                ? "bg-tertiary text-primary"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {isPositive ? (
              <MdOutlineRecycling className="size-6" />
            ) : (
              <ShoppingBag className="size-5" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm text-foreground leading-snug">
                {title}
              </span>
              {weight && (
                <span className="text-[0.7rem] bg-tertiary text-primary font-semibold px-2 py-0.5 rounded-md">
                  {weight}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{date}</span>
            </div>
          </div>
        </div>

        <span
          className={cn(
            "font-bold text-base md:text-lg shrink-0 ml-3",
            isPositive || router.includes("warung")
              ? "text-primary"
              : "text-destructive",
          )}
        >
          {router.includes("warung") ? `${poin.replace("-", "+")}` : poin}
        </span>
      </CardContent>
    </Card>
  );
}

function CardPetugasGrid({
  title,
  totalSetor,
  totalSampah,
}: {
  title: string;
  totalSetor?: number;
  totalSampah?: number;
}) {
  return (
    <Card className="py-3.5 px-4 md:px-5 rounded-xl bg-card ring-1">
      <CardContent className="flex flex-col items-start justify-between p-0 h-20">
        <h4 className="font-semibold">{title}</h4>
        {!totalSetor && !totalSampah ? (
          <p className="text-2xl font-semibold">
            0
          </p>
        ) : (
          <p className="text-2xl font-semibold">
            {totalSetor ? totalSetor : totalSampah + " Kg"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export { CardRiwayat, CardPetugasGrid };
