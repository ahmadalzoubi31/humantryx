import {
  pgEnum,
  pgTable,
  text,
  uuid,
  integer,
  decimal,
  boolean,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { organizations } from "./organizations";
import { timestamps } from "./columns";

export const payrollFrequencyEnum = pgEnum("payroll_frequency", [
  "weekly",
  "biweekly",
  "monthly",
]);

export const timeFormatEnum = pgEnum("time_format", ["12h", "24h"]);

export const weekStartDayEnum = pgEnum("week_start_day", [
  "sunday",
  "monday",
]);

export const organizationSettings = pgTable("organization_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .unique()
    .references(() => organizations.id, { onDelete: "cascade" }),

  // Localization
  currency: text("currency").notNull().default("USD"),
  timezone: text("timezone").notNull().default("UTC"),
  dateFormat: text("date_format").notNull().default("MM/DD/YYYY"),
  timeFormat: timeFormatEnum("time_format").notNull().default("12h"),
  weekStartsOn: weekStartDayEnum("week_starts_on").notNull().default("monday"),

  // Work schedule
  workingDays: json("working_days")
    .$type<string[]>()
    .notNull()
    .default(["monday", "tuesday", "wednesday", "thursday", "friday"]),
  workStartTime: text("work_start_time").notNull().default("09:00"),
  workEndTime: text("work_end_time").notNull().default("17:00"),
  workingHoursPerDay: decimal("working_hours_per_day", {
    precision: 4,
    scale: 2,
  })
    .notNull()
    .default("8"),

  // Payroll
  payrollFrequency: payrollFrequencyEnum("payroll_frequency")
    .notNull()
    .default("monthly"),
  payDayOfMonth: integer("pay_day_of_month").notNull().default(1),
  defaultTaxPercentage: decimal("default_tax_percentage", {
    precision: 5,
    scale: 2,
  })
    .notNull()
    .default("0"),
  fiscalYearStartMonth: integer("fiscal_year_start_month").notNull().default(1),

  // Leave
  defaultAnnualLeaveDays: integer("default_annual_leave_days")
    .notNull()
    .default(20),
  leaveApprovalRequired: boolean("leave_approval_required")
    .notNull()
    .default(true),

  ...timestamps,
});

export const organizationSettingsRelations = relations(
  organizationSettings,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationSettings.organizationId],
      references: [organizations.id],
    }),
  }),
);
