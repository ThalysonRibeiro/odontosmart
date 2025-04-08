"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { stripe } from "@/utils/stripe";
import { Plan } from "@prisma/client"

interface SubscriptionProps {
  type: Plan
}

export async function createSubscription({ type }: SubscriptionProps) {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return {
      sessionId: "",
      error: "Erro ao ativar o plano"
    }
  }

  const findeUser = await prisma.user.findFirst({
    where: {
      id: userId
    }
  });
  if (!findeUser) {
    return {
      sessionId: "",
      error: "Erro ao ativar o plano"
    }
  }

  let customerId = findeUser.stripe_customer_id;

  if (!customerId) {
    const stripeCusmtomer = await stripe.customers.create({
      email: findeUser.email
    });
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        stripe_customer_id: stripeCusmtomer.id
      }
    });
    customerId = stripeCusmtomer.id;
  }

  try {
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: type === "BASIC" ? process.env.STRIPE_PLAN_BASIC : process.env.STRIPE_PLAN_PROFESSIONAL,
          quantity: 1,
        }
      ],
      metadata: {
        type: type
      },
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return {
      sessionId: stripeCheckoutSession.id
    }
  } catch (error) {
    return {
      sessionId: "",
      error: "Erro ao ativar o plano"
    }
  }

}