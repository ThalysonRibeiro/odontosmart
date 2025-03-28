"use client"

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from "@/lib/utils";
import { isSlotInThePast, isSlotSequenceAvailable, isToday } from "./schedule-utils";

interface ScheduleTimeListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimeSlots: TimeSlot[];
  clinicTimes: string[];
  onSelecTime: (time: string) => void;
}

export function ScheduleTimeList({
  availableTimeSlots,
  blockedTimes,
  clinicTimes,
  requiredSlots,
  selectedDate,
  selectedTime,
  onSelecTime
}: ScheduleTimeListProps) {

  const dateIsToday = isToday(selectedDate);

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {availableTimeSlots.map((slot) => {

        const sequenceOK = isSlotSequenceAvailable(
          slot.time,
          requiredSlots,
          clinicTimes,
          blockedTimes,
        )
        const slotIsPast = dateIsToday && isSlotInThePast(slot.time);
        const slotEnabled = slot.available && sequenceOK && !slotIsPast;

        return (
          <Button
            key={slot.time}
            onClick={() => onSelecTime(slot.time)}
            variant="outline"
            type="button"
            className={cn("h-10 select-none",
              selectedTime === slot.time && "border-2 border-blue-500 text-primary",
              !slotEnabled && "opacity-50 cursor-not-allowed border-2 border-red-500"
            )
            }
            disabled={!slotEnabled}
          >
            {slot.time}
          </Button>
        )
      })}
    </div >
  )
}