"use client"

import { format } from "date-fns"
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react"

export function ButtonPickerAppointment() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const route = useRouter();

  function handleChangeDate(event: ChangeEvent<HTMLInputElement>) {
    setSelectedDate(event.target.value);
    const url = new URL(window.location.href);
    url.searchParams.set("date", event.target.value);

    route.push(url.toString());
  }
  return (
    <input type="date"
      id="start"
      className="border-2 px-2 py-1 rounded-md text-sm md:text-base"
      value={selectedDate}
      onChange={handleChangeDate}
    />
  )
}