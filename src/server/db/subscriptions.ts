import { pgEnum, pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { organizations } from "./organizations";
import { timestamps } from "./columns";

export const planTier = pgEnum("plan_tier", [
  "free",
  "starter",
  "pro",
  "enterprise",
]);

export const subscriptionStatus = pgEnum("subscription_status", [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "incomplete",
  "paused",
]);

export const plans = pgTable("plans", {
  id: text("id").primaryKey().default("plan_" + "gen_random_uuid()"),
  name: text("name").notNull(),
  tier: planTier("tier").notNull().unique(),
  stripePriceId: text("stripe_price_id"),
  priceMonthly: integer("price_monthly").notNull().default(0),
  seatLimit: integer("seat_limit").notNull().default(5),
  features: text("features").array().default([]).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .unique()
    .references(() => organizations.id, { onDelete: "cascade" }),
  planId: text("plan_id")
    .notNull()
    .references(() => plans.id),
  status: subscriptionStatus("status").notNull().default("active"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  trialEndsAt: timestamp("trial_ends_at"),
  seatCount: integer("seat_count").notNull().default(1),
  ...timestamps,
});

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
}));
