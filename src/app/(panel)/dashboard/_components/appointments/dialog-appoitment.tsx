import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentWithService } from "./appointments-list";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";

interface DialogAppoitmentProps {
  appoitment: AppointmentWithService | null;
}

export function DialogAppoitment({ appoitment }: DialogAppoitmentProps) {

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes do agendamento</DialogTitle>
        <DialogDescription>
          Veja todos os detalhes do agendamento
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        {appoitment && (
          <article>
            <p><span className="font-semibold">Horario: </span>{appoitment.time}</p>
            <p className="mb-2"><span className="font-semibold">
              Data do agendamento:</span> {new Intl.DateTimeFormat('pt-BR', {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(appoitment.appointmentDate))}
            </p>
            <p><span className="font-semibold">Nome: </span>{appoitment.name}</p>
            <p><span className="font-semibold">Telefonde: </span>{appoitment.phone}</p>
            <p><span className="font-semibold">Email: </span>{appoitment.email}</p>

            <section className="bg-gray-200 mt-4 p-2 rounded-md">
              <p><span className="font-semibold">Serviço: </span>{appoitment.service.name}</p>
              <p><span className="font-semibold">Valor: </span>{formatCurrency((appoitment.service.price / 100))}</p>

            </section>
          </article>
        )}
      </div>
    </DialogContent>
  )
}