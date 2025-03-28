"use client"
import { useState } from "react"
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ptBR", ptBR);

interface DateTimePickerProps {
  minDate?: Date;
  className?: string;
  inititalDate?: Date;
  onChange: (date: Date) => void;
}
export function DateTimePicker({ className, minDate, inititalDate, onChange }: DateTimePickerProps) {
  const [startDate, setStartDate] = useState(inititalDate || new Date());

  function handleChange(date: Date | null) {
    if (date) {
      setStartDate(date);
      onChange(date)
    }

  }
  return (
    <DatePicker
      selected={startDate}
      locale="ptBR"
      minDate={minDate ?? new Date()}
      className={className}
      onChange={handleChange}
      dateFormat="dd/MM/yyyy"
    />
  )
}