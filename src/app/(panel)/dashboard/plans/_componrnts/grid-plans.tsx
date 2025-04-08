import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans";
import { CheckCircleIcon } from "lucide-react";
import { SubscriptionButton } from "./subscription-button";

export function GridPlans() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
      {subscriptionPlans.map((plan, index) => (
        <Card
          key={plan.id}
          className={`flex flex-col w-full mx-auto ${index === 1 && "border-blue-500"}`}>
          {index === 1 ? (
            <div className="bg-blue-500 w-full py-3 text-center rounded-t-xl relative -top-6 ">
              <p className="text-white font-semibold">PROMOÇÂO EXCLUSIVA</p>
            </div>
          ) : (
            <div className="w-full py-3 text-center rounded-t-xl relative -top-6 ">
              {/* <p className="text-white font-semibold">PROMOÇÂO EXCLUSIVA</p> */}
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              {plan.name}
            </CardTitle>
            <CardDescription>
              {plan.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-1.5">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm md:text-base flex gap-2.5">
                  <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <p className="text-gray-600 line-through">{plan.oldProce}</p>
              <p className="text-black text-2xl font-bold">{plan.price}</p>
            </div>
          </CardContent>

          <CardFooter>
            <SubscriptionButton
              type={plan.id === "BASIC" ? "BASIC" : "PROFESSIONAL"}
            />
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}