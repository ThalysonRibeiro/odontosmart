"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans";
import { Subscription } from "@prisma/client";
import { CheckCircleIcon } from "lucide-react";
import { createPortalCustomer } from "../_actions/creata-portal-customer";
import { toast } from "sonner";

interface SubscriptionDetailProps {
  subscription: Subscription;
}

export function SubscriptionDetail({ subscription }: SubscriptionDetailProps) {
  const subscriptionInfo = subscriptionPlans.find(plan => plan.id === subscription.plan);
  async function handleManageSubscription() {
    const portal = await createPortalCustomer();
    if (portal.error) {
      toast.error("Ocorreu um erro ao criar o portal de assinatura");
      return;
    }
    window.location.href = portal.sessionId;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Seu plano atual
        </CardTitle>
        <CardDescription>
          Sua assinatura está ativa!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg md:text-xl">
            {subscription.plan === "BASIC" ? "BASIC" : "PROFISSIONAL"}
          </h3>
          <div className="bg-blue-500 text-white w-fit px-4 py-1 rounded-md">
            {subscription.status === "active" ? "ATIVO" : "INATIVO"}
          </div>
        </div>
        <ul className="space-y-2">
          {subscriptionInfo && subscriptionInfo.features.map(feature => (
            <li key={feature} className="flex gap-2.5">
              <CheckCircleIcon className="w-5 h-5 text-blue-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleManageSubscription}
          className="w-fit text-white bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300 hover:from-indigo-600 hover:to-blue-500"
          type="submit"
        >
          Gerenciar assinatura
        </Button>
      </CardFooter>
    </Card>
  )
}