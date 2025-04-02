"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prisma } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cancelAppointment } from "../../_actions/cansel-appointment";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogAppoitment } from "./dialog-appoitment";
import { ButtonPickerAppointment } from "./button-date";

interface ApointmentsListProps {
  times: string[];
}

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true,
  }
}>

export function AppointmentsList({ times }: ApointmentsListProps) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async () => {

      let activeDate = date;

      if (!activeDate) {
        const today = format(new Date(), "yyyy-MM-dd")
        activeDate = today;
      }


      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`

      const response = await fetch(url)

      const json = await response.json() as AppointmentWithService[];

      console.log(json);

      if (!response.ok) {
        return []
      }

      return json

    },
    staleTime: 20000, // 20 segundos
    refetchInterval: 60000, // 60 segundos
  })

  const occupantMap: Record<string, AppointmentWithService> = {}

  if (data && data.length > 0) {
    for (const appointment of data) {
      const resquiredSlots = Math.ceil(appointment.service.duration / 15);//receber os minutos do bacndo passados no perfil

      const startIndex = times.indexOf(appointment.time);

      if (startIndex !== - 1) {
        for (let i = 0; i < resquiredSlots; i++) {
          const slotIndex = startIndex + i;

          if (slotIndex < times.length) {
            occupantMap[times[slotIndex]] = appointment;
          }
        }
      }
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    const response = await cancelAppointment({ appointmentId });
    if (response.error) {
      toast.error(response.error);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
    await refetch();
    toast.success(response.data);
  }


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl">
            Agendamentos
          </CardTitle>
          <ButtonPickerAppointment />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-15rem)] pr-4">
            {isLoading ? (
              <p>Carregando agenda...</p>
            ) : (
              times.map((slot) => {
                const occupant = occupantMap[slot];
                if (occupant) {
                  return (
                    <div
                      key={slot}
                      className="flex items-center py-2 border-t last:border-b"
                    >
                      <div className="w-16 text-sm font-semibold">
                        {slot}
                      </div>
                      <div className="flex-1 text-sm">
                        <div className="font-semibold capitalize">{occupant.name}</div>
                        <div className="text-sm text-gray-500">{occupant.phone}</div>
                      </div>
                      <div className="ml-auto">
                        <div className="flex">
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setDetailAppointment(occupant)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <Button variant="ghost" size="icon" onClick={() => handleCancelAppointment(occupant.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                }
                return (
                  <div
                    key={slot}
                    className="flex items-center py-2 border-t last:border-b"
                  >
                    <div className="w-16 text-sm font-semibold">
                      {slot}
                    </div>
                    <div className="flex-1 text-sm text-gray-500">
                      Disponivel
                    </div>
                  </div>
                )
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <DialogAppoitment appoitment={detailAppointment} />
    </Dialog>
  )
}