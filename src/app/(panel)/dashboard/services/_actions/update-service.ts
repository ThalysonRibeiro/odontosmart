"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { date, z } from "zod"


const formSchema = z.object({
  serviceId: z.string().min(1, "O id do servoço é obrtigatório"),
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  price: z.number().min(1, { message: "O preço do serviço é obrigatório" }),
  duration: z.number(),
});
type FormSchema = z.infer<typeof formSchema>;

export async function updateService(formData: FormSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Falha ao atualizar serviço"
    }
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    await prisma.service.update({
      where: {
        id: formData.serviceId,
        userId: session?.user?.id
      },
      data: {
        name: formData.name,
        price: formData.price,
        duration: formData.duration < 15 ? 15 : formData.duration,
      }
    });

    revalidatePath("/dashboard/services");

    return {
      data: "Serviço atualizado com sucesso!"
    }

  } catch (error) {
    return {
      error: "Falha ao atualizar serviço"
    }
  }
}