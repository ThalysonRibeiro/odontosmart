"use server"
import { Plan } from "@prisma/client"
import { PlanProps } from "../plans"

export interface PlanDetailInfo {
  maxServices: number;
}

const PLANS_LIMITS: PlanProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
    maxServices: 40,
  }
}

export async function getPlan(planId: Plan) {
  return PLANS_LIMITS[planId]
}