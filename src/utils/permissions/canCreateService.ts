"use server"

import prisma from "@/lib/prisma";
import { Subscription } from "@prisma/client";
import { Session } from "next-auth";
import { getPlan } from "./get-plans";
import { PLANS } from "../plans";
import { checkSubscriptionExpired } from "./checkSubscriptionExpired";
import { ResultPermissionProps } from "./canPremission";

export async function canCreateService(subscription: Subscription | null, session: Session): Promise<ResultPermissionProps> {
  try {
    const serviceCount = await prisma.service.count({
      where: {
        userId: session?.user?.id,
        status: true,
      }
    });

    if (subscription && subscription.status === "active") {
      const plan = subscription.plan;
      const planLimits = await getPlan(plan);
      console.log("limites do plano: ", planLimits);
      return {
        hasPermission: planLimits.maxServices === null || serviceCount < planLimits.maxServices,
        planId: subscription.plan,
        expired: false,
        Plan: PLANS[subscription.plan],
      }
    }

    const checkUserLimit = await checkSubscriptionExpired(session);

    return checkUserLimit;

  } catch (error) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      Plan: null
    }
  }
}