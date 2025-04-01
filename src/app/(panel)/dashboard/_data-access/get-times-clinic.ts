"use server"

import prisma from "@/lib/prisma"
import { time } from "console";

export async function getTimesClinic({ userId }: { userId: string }) {
  if (!userId) {
    return {
      times: [],
      userId: ""
    }
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        times: true
      }
    });
    if (!user) {
      return {
        times: [],
        userId: ""
      }
    }

    return {
      times: user.times,
      userId: user.id
    }
  } catch (error) {
    return {
      times: [],
      userId: ""
    }
  }
}