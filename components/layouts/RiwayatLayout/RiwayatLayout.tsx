"use client";

import { CardRiwayat } from "@/components/commons/CardRiwayat/CardRiwayat";
import {
  FilterDatePopup,
  FilterJenisPopup,
  FilterJenisType,
} from "@/components/commons/FilterRiwayat/FilterRiwayat";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChartNoAxesColumn, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useRiwayat } from "./useRiwayat";
import { TransactionItem } from "@/types/riwayat";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CardRiwayatSkeleton } from "@/components/commons/CardSkeleton/CardSkeleton";

const RiwayatLayout = () => {
  const [filterJenis, setFilterJenis] = useState<FilterJenisType>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const startDate = selectedDateRange?.from
    ? format(selectedDateRange.from, "yyyy-MM-dd")
    : undefined;

  const endDate = selectedDateRange?.to
    ? format(selectedDateRange.to, "yyyy-MM-dd")
    : startDate;

  const { riwayat, isLoadingRiwayat } = useRiwayat({
    filter: filterJenis,
    startDate,
    endDate,
  });

  console.log(riwayat)

  const groupedByMonthAndDate = useMemo(() => {
    const transactions = riwayat?.transactions ?? [];

    const months: {
      [monthYear: string]: {
        [dateLabel: string]: TransactionItem[];
      };
    } = {};

    for (const item of transactions) {
      if (!months[item.monthYear]) {
        months[item.monthYear] = {};
      }

      if (!months[item.monthYear][item.dateLabel]) {
        months[item.monthYear][item.dateLabel] = [];
      }

      months[item.monthYear][item.dateLabel].push(item);
    }

    return months;
  }, [riwayat]);

  const isAnyFilterActive =
    Boolean(selectedDateRange?.from) || filterJenis !== "all";

  const handleResetAll = () => {
    setSelectedDateRange(undefined);
    setFilterJenis("all");
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 md:gap-7">
      <div className="flex items-center gap-2.5">
        <FilterDatePopup
          selectedDateRange={selectedDateRange}
          onSelectDateRange={setSelectedDateRange}
          onResetDateRange={() => setSelectedDateRange(undefined)}
        />
        <FilterJenisPopup
          selectedJenis={filterJenis}
          onSelectJenis={setFilterJenis}
          onResetJenis={() => setFilterJenis("all")}
        />

        {/* Tombol Reset Filter Cepat */}
        {isAnyFilterActive && (
          <Button
            size="icon"
            variant="destructive"
            onClick={handleResetAll}
            title="Reset Semua Filter"
          >
            <RotateCcw className="size-3" />
          </Button>
        )}
      </div>

      {/* ── Grouped Transaction List: Month -> Date -> Items ── */}
      <div className="flex flex-col gap-8">
        {isLoadingRiwayat ? (
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-4 w-20 self-start" />

            {[1, 2, 3].map((item) => (
              <CardRiwayatSkeleton key={item} />
            ))}
          </div>
        ) : Object.keys(groupedByMonthAndDate).length > 0 ? (
          Object.entries(groupedByMonthAndDate).map(([monthYear, dates]) => (
            <div key={monthYear} className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                  <ChartNoAxesColumn className="size-4 text-primary" />
                  {monthYear}
                </span>
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col gap-5">
                {Object.entries(dates).map(([dateLabel, items]) => (
                  <div key={dateLabel} className="flex flex-col gap-2.5">
                    {/* Date Subheader */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {dateLabel}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {items.map((item) => (
                        <CardRiwayat
                          key={item.id}
                          title={item.title}
                          date={`${item.time}`}
                          poin={item.poin}
                          weight={item.weight}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-30 flex flex-col items-center justify-center gap-2 text-center text-sm">
            <p className="font-medium text-foreground">
              Tidak ada transaksi ditemukan
            </p>
            <p className="text-xs max-w-xs text-muted-foreground">
              {isAnyFilterActive
                ? "Tidak ada aktivitas pada filter yang dipilih."
                : "Belum ada riwayat transaksi pada kategori ini."}
            </p>
            {isAnyFilterActive && (
              <Button
                size="sm"
                variant="link"
                onClick={handleResetAll}
                className="mt-1 text-xs rounded-xl gap-1.5 text-primary"
              >
                <RotateCcw className="size-3" />
                Reset Semua Filter
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiwayatLayout;
