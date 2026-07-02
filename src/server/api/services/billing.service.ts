import { and, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { employees } from "@/server/db/schema";
import { plans, subscriptions } from "@/server/db/subscriptions";
import type { planTier } from "@/server/db/subscriptions";

type PlanTier = (typeof planTier.enumValues)[number];

export const PLAN_FEATURES: Record<
  PlanTier,
  { hasAI: boolean; hasPayroll: boolean; hasRecruitment: boolean }
> = {
  free: { hasAI: false, hasPayroll: false, hasRecruitment: false },
  starter: { hasAI: false, hasPayroll: true, hasRecruitment: false },
  pro: { hasAI: true, hasPayroll: true, hasRecruitment: true },
  enterprise: { hasAI: true, hasPayroll: true, hasRecruitment: true },
};

export async function getOrgSubscription(organizationId: string) {
  const [row] = await db
    .select({
      subscription: subscriptions,
      plan: plans,
    })
    .from(subscriptions)
    .innerJoin(plans, eq(subscriptions.planId, plans.id))
    .where(eq(subscriptions.organizationId, organizationId));

  return row;
}

export async function checkSeatLimit(organizationId: string) {
  const sub = await getOrgSubscription(organizationId);

  if (!sub) {
    return { allowed: true, seatLimit: Infinity, currentCount: 0 };
  }

  const seatLimit = sub.plan.seatLimit;
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(employees)
    .where(
      and(
        eq(employees.organizationId, organizationId),
        sql`${employees.deletedAt} IS NULL`,
      ),
    );

  const currentCount = result[0]?.count ?? 0;

  return { allowed: currentCount < seatLimit, seatLimit, currentCount };
}

export async function assertFeatureAccess(
  organizationId: string,
  feature: "ai" | "payroll" | "recruitment",
) {
  const sub = await getOrgSubscription(organizationId);

  if (!sub) return;

  const tier = sub.plan.tier as PlanTier;
  const features = PLAN_FEATURES[tier];

  const hasAccess =
    feature === "ai"
      ? features.hasAI
      : feature === "payroll"
        ? features.hasPayroll
        : features.hasRecruitment;

  if (!hasAccess) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Your plan (${sub.plan.name}) does not include ${feature} features. Please upgrade.`,
    });
  }
}

export async function assertSeatAvailable(organizationId: string) {
  const { allowed, seatLimit, currentCount } =
    await checkSeatLimit(organizationId);

  if (!allowed) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Seat limit reached (${currentCount}/${seatLimit}). Please upgrade your plan.`,
    });
  }
}
