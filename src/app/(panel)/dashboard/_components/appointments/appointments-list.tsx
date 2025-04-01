"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

interface ApointmentsListProps {
  times: string[];
}

type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true,
  }
}>

export function AppointmentsList({ times }: ApointmentsListProps) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const { data, isLoading } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async () => {
      let activeDate = date;

      if (!activeDate) {
        const today = format(new Date(), "yyyy-MM-DD");
        activeDate = today;
      }

      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`;

      const response = await fetch(url);

      const json = await response.json() as AppointmentWithService[];

      if (!response.ok) {
        return [];
      }

      return json;

    },
    staleTime: 20000,
    refetchInterval: 30000,
  });

  const occupantMap: Record<string, AppointmentWithService> = {}

  if (data && data.length > 0) {
    for (const appointment of data) {
      const resquiredSlots = Math.ceil(appointment.service.duration / 15);

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


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl md:text-2xl">
          Agendamentos
        </CardTitle>
        <button>data</button>
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
  )
}