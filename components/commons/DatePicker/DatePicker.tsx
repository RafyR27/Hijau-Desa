"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerWithRangeProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
}

export function DatePickerWithRange({
  value,
  onChange,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={className}>
      <Calendar
        mode="range"
        defaultMonth={value?.from || new Date()}
        selected={value}
        onSelect={onChange}
        numberOfMonths={1}
        className="w-80 p-5"
      />
    </div>
  );
}
