"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { date, z } from "zod"


const formSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  price: z.number().min(1, { message: "O preço do serviço é obrigatório" }),
  duration: z.number(),
});
type FormSchema = z.infer<typeof formSchema>;

export async function createNewService(formData: FormSchema) {
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
    const newService = await prisma.service.create({
      data: {
        name: formData.name,
        price: formData.price,
        duration: formData.duration,
        userId: session?.user?.id
      }
    });

    revalidatePath("/dashboard/services");

    return {
      date: newService
    }
  } catch (error) {
    return {
      error: "Falha ao cadastrar serviço"
    }
  }
}