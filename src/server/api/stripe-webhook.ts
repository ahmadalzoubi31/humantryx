import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { plans, subscriptions } from "@/server/db/subscriptions";
import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

async function syncSubscription(
  stripeSub: Stripe.Subscription,
  organizationId: string,
) {
  const priceId = stripeSub.items.data[0]?.price?.id;
  if (!priceId) return;

  const [plan] = await db
    .select()
    .from(plans)
    .where(eq(plans.stripePriceId, priceId));

  if (!plan) return;

  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.organizationId, organizationId));

  const data = {
    organizationId,
    planId: plan.id,
    status: stripeSub.status as (typeof subscriptions.status.enumValues)[number],
    stripeCustomerId: stripeSub.customer as string,
    stripeSubscriptionId: stripeSub.id,
    stripeCurrentPeriodEnd: new Date(
      (stripeSub as unknown as { current_period_end: number }).current_period_end * 1000,
    ),
    seatCount: stripeSub.items.data[0]?.quantity ?? 1,
  };

  if (existing) {
    await db
      .update(subscriptions)
      .set(data)
      .where(eq(subscriptions.id, existing.id));
  } else {
    await db.insert(subscriptions).values({
      id: `sub_${stripeSub.id}`,
      ...data,
    });
  }
}

export async function handleStripeWebhook(req: Request) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe not configured", { status: 501 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.metadata?.organizationId;
        if (organizationId && session.subscription) {
          const stripeSub = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );
          await syncSubscription(stripeSub, organizationId);
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const stripeSub = event.data.object as Stripe.Subscription;
        const organizationId = stripeSub.metadata?.organizationId;
        if (organizationId) {
          await syncSubscription(stripeSub, organizationId);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const stripeSub = event.data.object as Stripe.Subscription;
        const organizationId = stripeSub.metadata?.organizationId;
        if (organizationId) {
          await db
            .update(subscriptions)
            .set({ status: "canceled" })
            .where(eq(subscriptions.organizationId, organizationId));
        }
        break;
      }

      default:
        break;
    }

    return new Response(null, { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response("Internal error", { status: 500 });
  }
}
