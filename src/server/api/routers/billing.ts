import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db";
import {
  plans,
  subscriptions,
  type planTier,
} from "@/server/db/subscriptions";
import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

type PlanTier = (typeof planTier.enumValues)[number];

export const PLANS: Record<
  PlanTier,
  { name: string; priceMonthly: number; seatLimit: number; features: string[] }
> = {
  free: {
    name: "Free",
    priceMonthly: 0,
    seatLimit: 5,
    features: [
      "Up to 5 employees",
      "Basic attendance tracking",
      "Leave management",
      "Community support",
    ],
  },
  starter: {
    name: "Starter",
    priceMonthly: 29,
    seatLimit: 25,
    features: [
      "Up to 25 employees",
      "Attendance + breaks",
      "Leave management + policies",
      "Payroll management",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    priceMonthly: 99,
    seatLimit: 100,
    features: [
      "Up to 100 employees",
      "Everything in Starter",
      "AI recruitment & screening",
      "Document Q&A with AI",
      "Priority support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    priceMonthly: 299,
    seatLimit: 500,
    features: [
      "Up to 500 employees",
      "Everything in Pro",
      "Custom AI models",
      "SSO & SAML",
      "Dedicated account manager",
    ],
  },
};

async function seedPlans() {
  const existing = await db.select().from(plans);
  if (existing.length > 0) return;

  for (const [tier, config] of Object.entries(PLANS)) {
    await db.insert(plans).values({
      name: config.name,
      tier: tier as PlanTier,
      priceMonthly: config.priceMonthly,
      seatLimit: config.seatLimit,
      features: config.features,
    });
  }
}

export const billingRouter = createTRPCRouter({
  getPlans: protectedProcedure.query(async () => {
    await seedPlans();
    return db.select().from(plans).where(eq(plans.isActive, true));
  }),

  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const orgId = ctx.session.session.activeOrganizationId;
    if (!orgId) return null;

    const [sub] = await db
      .select({
        subscription: subscriptions,
        plan: plans,
      })
      .from(subscriptions)
      .innerJoin(plans, eq(subscriptions.planId, plans.id))
      .where(eq(subscriptions.organizationId, orgId));

    return sub ?? null;
  }),

  createCheckoutSession: protectedProcedure
    .input(z.object({ planTier: z.enum(["starter", "pro", "enterprise"]) }))
    .mutation(async ({ ctx, input }) => {
      if (!stripe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not configured",
        });
      }

      const orgId = ctx.session.session.activeOrganizationId;
      if (!orgId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No active organization",
        });
      }

      await seedPlans();
      const [plan] = await db
        .select()
        .from(plans)
        .where(eq(plans.tier, input.planTier));

      if (!plan || !plan.stripePriceId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found or Stripe price not configured",
        });
      }

      const [existingSub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.organizationId, orgId));

      let customerId = existingSub?.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: ctx.session.user.email,
          metadata: { organizationId: orgId },
        });
        customerId = customer.id;
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: plan.stripePriceId, quantity: 1 }],
        success_url: `${env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
        metadata: { organizationId: orgId, planTier: input.planTier },
      });

      return { url: session.url };
    }),

  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    if (!stripe) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Stripe is not configured",
      });
    }

    const orgId = ctx.session.session.activeOrganizationId;
    if (!orgId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "No active organization" });
    }

    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, orgId));

    if (!sub?.stripeCustomerId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No billing account found",
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return { url: session.url };
  }),
});
