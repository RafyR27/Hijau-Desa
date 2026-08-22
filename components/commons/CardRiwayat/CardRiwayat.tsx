import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { MdOutlineRecycling } from "react-icons/md";

export default function CardRiwayat({
  title,
  date,
  poin,
}: {
  title: string;
  date: string;
  poin: string;
}) {
  return (
    <Card className="py-3 rounded-lg">
      <CardContent className="flex justify-between px-5">
        <div className="flex gap-4 items-center">
          <span
            className={cn(
              "text-[1.5rem] p-3 rounded-full",
              poin.includes("+")
                ? "text-primary bg-secondary/20"
                : "text-destructive/60 bg-destructive/10",
            )}
          >
            {poin.includes("+") ? <MdOutlineRecycling /> : <ShoppingBag />}
          </span>
          <div className="flex flex-col max-w-40 md:max-w-full gap-1">
            <p className="capitalize font-medium">{title}</p>
            <p className="font-light text-muted-foreground text-[0.8rem]">
              {date}
            </p>
          </div>
        </div>

        <p
          className={cn(
            "h-full self-center font-bold text-primary text-xl",
            poin.includes("+") ? "text-primary" : "text-destructive/60",
          )}
        >
          {poin}
        </p>
      </CardContent>
    </Card>
  );
}
