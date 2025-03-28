"use client"
import Image from "next/image"
import imgTest from "../../../../../../public/foto1.png";
import { MapPin } from "lucide-react";
import { Prisma } from "@prisma/client";
import { AppoitmentFormData, useAppoitmentForm } from "./schedule-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatPhone } from "@/utils/formatPhone";
import { DateTimePicker } from "./date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { ScheduleTimeList } from "./schedule-time-list";
import { createNewAppointment } from "../_actions/create-appointment";
import { toast } from "sonner";

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
    services: true,
  }
}>
interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription
}
export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppoitmentForm();
  const { watch } = form;


  const selectedDate = watch("date")
  const selectedServiceId = watch("serviceId")

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Quais os horários bloqueados 01/02/2025 > ["15:00", "18:00"]
  const [blockedTimes, setBlockedTimes] = useState<string[]>([])


  // Função que busca os horários bloqueados (via Fetch HTTP)
  const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
    setLoadingSlots(true);
    try {
      const dateString = date.toISOString().split("T")[0]
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`)

      const json = await response.json();
      setLoadingSlots(false);
      return json; // Retornar o array com horarios que já tem bloqueado desse Dia e dessa clinica.

    } catch (err) {
      console.log(err)
      setLoadingSlots(false);
      return [];
    }
  }, [clinic.id])


  useEffect(() => {

    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked)

        const times = clinic.times || [];

        const finalSlots = times.map((time) => ({
          time: time,
          available: !blocked.includes(time)
        }));

        setAvailableTimeSlots(finalSlots);

        const stilAvailable = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.available
        );
        if (!stilAvailable) {
          setSelectedTime("");
        }

      })
    }

  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])


  async function handleRegisterAppointmnent(formData: AppoitmentFormData) {
    if (!selectedTime) {
      return;
    }

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: selectedTime,
      date: formData.date,
      serviceId: formData.serviceId,
      clinicId: clinic.id
    })

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success("Consulta agendada com sucesso!")
    form.reset();
    setSelectedTime("")

  }
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors" />
      <section className="container mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">

            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={clinic.image ? clinic.image : imgTest}
                alt="foto da clinica"
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-2xl capitalize font-bold mb-2">
              {clinic.name}
            </h1>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>
                {clinic.address ? clinic.address : "Enderenço não informado"}
              </span>
            </div>

          </article>
        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
            className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Digite seu nome completo..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Digite seu e-mail..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="(xx) xxxxx-xxxx"
                      onChange={(e) => {
                        const formatedValue = formatPhone(e.target.value)
                        field.onChange(formatedValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-2">
                  <FormLabel>Data do agendamento</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      inititalDate={new Date()}
                      className="w-full rounded border p-2"
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date)
                          setSelectedTime("")
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Selecione o Serviço</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedTime("")
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} ({Math.floor(service.duration / 60)}h {service.duration % 60}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedServiceId && (
              <div className="space-y-2">
                <Label>Horários disponiveis</Label>
                <div className="bg-gray-100 p-4  rounded-lg">
                  {loadingSlots ? (
                    <p>Carregando...</p>
                  ) : availableTimeSlots.length === 0 ? (
                    <p>Nenhum horário disponivel</p>
                  ) : (
                    <ScheduleTimeList
                      onSelecTime={(time) => setSelectedTime(time)}
                      clinicTimes={clinic.times}
                      blockedTimes={blockedTimes}
                      availableTimeSlots={availableTimeSlots}
                      selectedTime={selectedTime}
                      selectedDate={selectedDate}
                      requiredSlots={
                        clinic.services.find(service => service.id === selectedServiceId)
                          ? Math.ceil(clinic.services.find(service => service.id === selectedServiceId)!.duration / 15)
                          : 1
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {clinic.status ? (
              <Button
                type="submit"
                className="w-full text-white bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300 hover:from-indigo-600 hover:to-blue-500"
                disabled={
                  !watch("name") ||
                  !watch("email") ||
                  !watch("phone") ||
                  !watch("date") ||
                  !watch("serviceId")}
              >
                Realizar agendamento
              </Button>
            ) : (
              <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">
                Aclinica está fechada nesse momentio
              </p>
            )}
          </form>
        </Form>
      </section>

    </div>
  )
}