import { z } from "zod";
import {
  payrollFrequencyEnum,
  timeFormatEnum,
  weekStartDayEnum,
} from "@/server/db/organization-settings";

const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time (use HH:MM)");

export const organizationSettingsSchema = z.object({
  // Localization
  currency: z.string().min(1, "Currency is required"),
  timezone: z.string().min(1, "Timezone is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  timeFormat: z.enum(timeFormatEnum.enumValues),
  weekStartsOn: z.enum(weekStartDayEnum.enumValues),

  // Work schedule
  workingDays: z
    .array(z.string())
    .min(1, "Select at least one working day"),
  workStartTime: timeString,
  workEndTime: timeString,
  workingHoursPerDay: z.coerce
    .number()
    .min(1, "Must be at least 1 hour")
    .max(24, "Cannot exceed 24 hours"),

  // Payroll
  payrollFrequency: z.enum(payrollFrequencyEnum.enumValues),
  payDayOfMonth: z.coerce
    .number()
    .int()
    .min(1, "Must be between 1 and 31")
    .max(31, "Must be between 1 and 31"),
  defaultTaxPercentage: z.coerce
    .number()
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%"),
  fiscalYearStartMonth: z.coerce.number().int().min(1).max(12),

  // Leave
  defaultAnnualLeaveDays: z.coerce
    .number()
    .int()
    .min(0, "Cannot be negative")
    .max(365, "Cannot exceed 365 days"),
  leaveApprovalRequired: z.boolean(),
});

export type OrganizationSettingsInput = z.infer<
  typeof organizationSettingsSchema
>;
