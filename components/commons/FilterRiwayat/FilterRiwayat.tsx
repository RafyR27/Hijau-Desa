"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Check,
  Filter,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { DatePickerWithRange } from "../DatePicker/DatePicker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export type FilterJenisType = "all" | "in" | "out";

export interface FilterDateProps {
  selectedDateRange?: DateRange;
  onSelectDateRange: (range?: DateRange) => void;
  onResetDateRange: () => void;
}

export interface FilterJenisProps {
  selectedJenis: FilterJenisType;
  onSelectJenis: (jenis: FilterJenisType) => void;
  onResetJenis: () => void;
}

/* ─────────────────────────────────────────────────────────────
   1. FILTER TANGGAL (Desktop: Dialog / Mobile: Drawer)
   ───────────────────────────────────────────────────────────── */

function FilterDateContent({
  selectedDateRange,
  onSelectDateRange,
  onResetDateRange,
  onClose,
}: FilterDateProps & { onClose?: () => void }) {
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    selectedDateRange,
  );

  const handleApply = () => {
    onSelectDateRange(tempDateRange);
    onClose?.();
  };

  const handleReset = () => {
    setTempDateRange(undefined);
    onResetDateRange();
    onClose?.();
  };

  return (
    <div className="flex flex-col gap-4 px-5 py-5">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3 h-5">
          <Label className="text-xs font-semibold text-foreground">
            Pilih Rentang Tanggal
          </Label>

          {tempDateRange?.from && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleReset}
              className="rounded-xl h-7 text-xs px-2.5"
            >
              Hapus
            </Button>
          )}
        </div>

        <DatePickerWithRange
        className="self-center"
          value={tempDateRange}
          onChange={setTempDateRange}
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button
          type="button"
          variant="destructive"
          onClick={handleReset}
          className="flex-1 rounded-xl h-10 text-xs gap-1.5 hidden md:flex"
        >
          Hapus
        </Button>

        <Button
          type="button"
          variant="default"
          onClick={handleApply}
          className="flex-1 rounded-xl h-10 text-xs font-semibold"
        >
          Terapkan
        </Button>
      </div>
    </div>
  );
}

export function FilterDatePopup({
  selectedDateRange,
  onSelectDateRange,
  onResetDateRange,
}: FilterDateProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const isDateActive = Boolean(selectedDateRange?.from);

  const formattedDateLabel = useMemo(() => {
    if (!selectedDateRange?.from) return "Tanggal";
    if (
      selectedDateRange.to &&
      selectedDateRange.from.getTime() !== selectedDateRange.to.getTime()
    ) {
      return `${format(selectedDateRange.from, "d MMM", { locale: id })} - ${format(selectedDateRange.to, "d MMM yyyy", { locale: id })}`;
    }
    return format(selectedDateRange.from, "d MMM yyyy", { locale: id });
  }, [selectedDateRange]);

  return (
    <>
      {/* Desktop Dialog Trigger */}
      <div className="hidden md:block">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger
            render={
              <Button
                size="sm"
                variant={isDateActive ? "default" : "outline"}
                className="rounded-xl text-xs h-8.5 px-3.5 gap-2 transition-all cursor-pointer"
              >
                <CalendarIcon className="size-3.5" />
                <span>{formattedDateLabel}</span>
              </Button>
            }
          />
          <DialogContent className="max-w-md rounded-2xl p-0 gap-0">
            <DialogHeader className="border-b px-5 py-4">
              <DialogTitle className="text-base font-bold">
                Filter Tanggal
              </DialogTitle>
              <DialogDescription className="sr-only">
                Pilih rentang tanggal transaksi
              </DialogDescription>
            </DialogHeader>
            <FilterDateContent
              selectedDateRange={selectedDateRange}
              onSelectDateRange={onSelectDateRange}
              onResetDateRange={onResetDateRange}
              onClose={() => setOpenDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Drawer Trigger */}
      <div className="block md:hidden">
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer} showSwipeHandle>
          <DrawerTrigger
            render={
              <Button
                size="sm"
                variant={isDateActive ? "default" : "outline"}
                className="rounded-xl text-xs h-8.5 px-3.5 gap-2 cursor-pointer"
              >
                <CalendarIcon className="size-3.5" />
                <span>{formattedDateLabel}</span>
              </Button>
            }
          />
          <DrawerContent className="max-h-[90vh] m-0 rounded-t-2xl rounded-b-none">
            <DrawerHeader className="border-b px-5 py-4">
              <DrawerTitle className="text-base font-bold text-center">
                Filter Tanggal
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Pilih rentang tanggal transaksi
              </DrawerDescription>
            </DrawerHeader>
            <FilterDateContent
              selectedDateRange={selectedDateRange}
              onSelectDateRange={onSelectDateRange}
              onResetDateRange={onResetDateRange}
              onClose={() => setOpenDrawer(false)}
            />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. FILTER JENIS (Desktop: Dialog / Mobile: Drawer)
   ───────────────────────────────────────────────────────────── */

function FilterJenisContent({
  selectedJenis,
  onSelectJenis,
  onResetJenis,
  onClose,
}: FilterJenisProps & { onClose?: () => void }) {
  const [tempJenis, setTempJenis] = useState<FilterJenisType>(selectedJenis);

  const handleApply = () => {
    onSelectJenis(tempJenis);
    onClose?.();
  };

  const handleReset = () => {
    setTempJenis("all");
    onResetJenis();
    onClose?.();
  };

  const options: {
    value: FilterJenisType;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "all",
      label: "Semua Transaksi",
      description: "Menampilkan semua perolehan dan penukaran poin",
      icon: <Filter className="size-4 text-primary" />,
    },
    {
      value: "in",
      label: "Poin Masuk (Setoran)",
      description: "Poin yang didapatkan dari setoran sampah",
      icon: <ArrowDownLeft className="size-4 text-primary" />,
    },
    {
      value: "out",
      label: "Poin Keluar (Penukaran)",
      description: "Poin yang digunakan untuk penukaran hadiah",
      icon: <ArrowUpRight className="size-4 text-destructive" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-5 pb-6 pt-3">
      <div className="flex justify-between h-5 mt-2">
        <Label className="text-xs font-semibold text-foreground">
          Pilih Jenis Transaksi
        </Label>
        {tempJenis !== "all" && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleReset}
            className="flex rounded-xl h-7 text-xs md:hidden px-2.5 self-end"
          >
            Hapus
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 min-h-60 md:min-h-30">
        {options.map((opt) => {
          const isSelected = tempJenis === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTempJenis(opt.value)}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/40"
                  : "border-border bg-background hover:bg-muted text-muted-foreground",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg shrink-0",
                    isSelected ? "bg-primary/10" : "bg-muted",
                  )}
                >
                  {opt.icon}
                </div>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isSelected ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[0.7rem] text-muted-foreground leading-tight mt-0.5">
                    {opt.description}
                  </span>
                </div>
              </div>

              {isSelected && (
                <Check className="size-4 text-primary shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button
          type="button"
          variant="destructive"
          onClick={handleReset}
          className="flex-1 rounded-xl h-10 text-xs gap-1.5 hidden md:flex"
        >
          Hapus
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleApply}
          className="flex-1 rounded-xl h-10 text-xs font-semibold"
        >
          Terapkan
        </Button>
      </div>
    </div>
  );
}

export function FilterJenisPopup({
  selectedJenis,
  onSelectJenis,
  onResetJenis,
}: FilterJenisProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const isJenisActive = selectedJenis !== "all";

  const getJenisLabel = () => {
    if (selectedJenis === "in") return "Poin Masuk";
    if (selectedJenis === "out") return "Poin Keluar";
    return "Jenis";
  };

  return (
    <>
      {/* Desktop Dialog Trigger */}
      <div className="hidden md:block">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger
            render={
              <Button
                size="sm"
                variant={isJenisActive ? "default" : "outline"}
                className="rounded-xl text-xs h-8.5 px-3.5 gap-2 transition-all cursor-pointer"
              >
                <Filter className="size-3.5" />
                <span>{getJenisLabel()}</span>
              </Button>
            }
          />
          <DialogContent className="max-w-sm rounded-2xl p-0 gap-0">
            <DialogHeader className="border-b px-5 py-4">
              <DialogTitle className="text-base font-bold">
                Filter Jenis Transaksi
              </DialogTitle>
              <DialogDescription className="sr-only">
                Pilih jenis transaksi riwayat
              </DialogDescription>
            </DialogHeader>
            <FilterJenisContent
              selectedJenis={selectedJenis}
              onSelectJenis={onSelectJenis}
              onResetJenis={onResetJenis}
              onClose={() => setOpenDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Drawer Trigger */}
      <div className="block md:hidden">
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer} showSwipeHandle>
          <DrawerTrigger
            render={
              <Button
                size="sm"
                variant={isJenisActive ? "default" : "outline"}
                className="rounded-xl text-xs h-8.5 px-3.5 gap-2 transition-all cursor-pointer"
              >
                <Filter className="size-3.5" />
                <span>{getJenisLabel()}</span>
              </Button>
            }
          />
          <DrawerContent className="max-h-[90vh] m-0 rounded-t-2xl rounded-b-none">
            <DrawerHeader className="border-b px-5 py-4">
              <DrawerTitle className="text-base font-bold text-center">
                Filter Jenis Transaksi
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Pilih jenis transaksi riwayat
              </DrawerDescription>
            </DrawerHeader>
            <FilterJenisContent
              selectedJenis={selectedJenis}
              onSelectJenis={onSelectJenis}
              onResetJenis={onResetJenis}
              onClose={() => setOpenDrawer(false)}
            />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
