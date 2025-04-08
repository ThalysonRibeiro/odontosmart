"use client"
import { Button } from "@/components/ui/button";
import { Plan } from "@prisma/client";
import { createSubscription } from "../_actions/create-subscription";
import { toast } from "sonner";
import { getStripeJs } from "@/utils/stripe-js";

interface SubscriptionButtonProps {
  type: Plan;
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {

  async function handleCreateBilling() {
    const { sessionId, error } = await createSubscription({ type: type });
    if (error) {
      toast.error(error);
      return;
    }
    const stripe = await getStripeJs();
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: sessionId });
    }
  }

  return (
    <Button
      onClick={handleCreateBilling}
      className={`w-full text-white  ${type === "PROFESSIONAL" && "bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300 hover:from-indigo-600 hover:to-blue-500"}`}
    >Ativar assinatura</Button>
  )
}