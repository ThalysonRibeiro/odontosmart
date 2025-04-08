import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GridPlans } from "./_componrnts/grid-plans";
import { getSubscription } from "@/utils/get-subscription";
import { SubscriptionDetail } from "./_componrnts/subscription-detail";

export default async function Planos() {

  const session = await getSession();

  if (!session) {
    redirect("/")
  }

  const subScription = await getSubscription({ userId: session?.user?.id! })

  return (
    <div>
      {subScription?.status !== "active" && (
        <GridPlans />
      )}

      {subScription?.status === "active" && (
        <SubscriptionDetail subscription={subScription!} />
      )}
    </div>
  )
}