"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { date, z } from "zod"


const formSchema = z.object({
  serverId: z.string().min(1, "o id do serviço é obrigatório")
});
type FormSchema = z.infer<typeof formSchema>;

export async function deleteService(formData: FormSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Falha ao cadastrar serviço"
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
        id: formData.serverId,
        userId: session?.user?.id
      },
      data: {
        status: false
      }
    });

    revalidatePath("/dashboard/services");

    return {
      date: "Serviço deletado com sucesso"
    }
  } catch (error) {
    if (!session?.user?.id) {
      return {
        error: "Falha ao cadastrar serviço"
      }
    }
  }
}