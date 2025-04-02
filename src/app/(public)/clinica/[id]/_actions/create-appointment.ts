"use server"

import prisma from '@/lib/prisma'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatórios"),
  email: z.string().min(1, "O email é obrigatórios"),
  phone: z.string().min(1, "O telefone é obrigatórios"),
  date: z.date(),
  serviceId: z.string().min(1, "O serviço é obrigatórios"),
  time: z.string().min(1, "O horário é obrigatórios"),
  clinicId: z.string().min(1, "O horário é obrigatórios"),
});

type FormSchema = z.infer<typeof formSchema>;
export async function createNewAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const selectedDate = new Date(formData.date)

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    const appointmentDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

    const newAppoitment = await prisma.appointment.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        time: formData.time,
        appointmentDate: appointmentDate,
        serviceId: formData.serviceId,
        userId: formData.clinicId
      }
    });
    return {
      date: newAppoitment
    }

  } catch (error) {
    return {
      error: "Error a buscar agendamento"
    }
  }
}