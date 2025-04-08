"use server"

import { addDays, isAfter } from "date-fns";
import { Session } from "next-auth";
import { ResultPermissionProps } from "./canPremission";
import { TRIAL_DAYS } from "./trial-limits";


export async function checkSubscriptionExpired(session: Session): Promise<ResultPermissionProps> {
  const trialEndDate = addDays(session?.user?.createdAt!, TRIAL_DAYS);
  if (isAfter(new Date(), trialEndDate)) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      Plan: null
    }
  }
  return {
    hasPermission: true,
    planId: "TRIAL",
    expired: false,
    Plan: null
  }
}