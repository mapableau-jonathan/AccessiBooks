import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY not set - Stripe payments will not work");
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2025-12-15.clover" })
  : null;

export const PREMIUM_PRICE_MONTHLY = 999; // $9.99/month in cents
export const PREMIUM_PRICE_YEARLY = 9999; // $99.99/year in cents

export interface SubscriptionConfig {
  priceId?: string;
  productName: string;
  amount: number;
  interval: "month" | "year";
}

export const SUBSCRIPTION_CONFIG: SubscriptionConfig = {
  productName: "AccessiBooks Premium",
  amount: PREMIUM_PRICE_MONTHLY,
  interval: "month",
};

export const DONATION_AMOUNTS = [500, 1000, 2500, 5000]; // $5, $10, $25, $50 in cents

export interface DonationConfig {
  productName: string;
  description: string;
}

export const DONATION_CONFIG: DonationConfig = {
  productName: "AccessiBooks Donation",
  description: "Thank you for supporting accessible audiobooks!",
};

export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event | null {
  if (!stripe) return null;
  
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return null;
  }
}
