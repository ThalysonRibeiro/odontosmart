"use server"
import prisma from "@/lib/prisma";

export async function getPermissionReports({ userId }: { userId: string }) {

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId
    },
    include: {
      subscription: true,
    }
  });
  if (!user?.subscription || user.subscription.plan !== "PROFESSIONAL") {
    return null;
  }

  return user;
}