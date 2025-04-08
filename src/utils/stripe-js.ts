import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
  const stripejS = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);
  return stripejS;
}