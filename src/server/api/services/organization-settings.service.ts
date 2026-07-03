import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { organizationSettings } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import type { OrganizationSettingsInput } from "@/modules/settings/schemas/organization-settings.schema";

export class OrganizationSettingsService {
  static async get(organizationId: string) {
    const existing = await db.query.organizationSettings.findFirst({
      where: eq(organizationSettings.organizationId, organizationId),
    });

    if (existing) {
      return existing;
    }

    const [created] = await db
      .insert(organizationSettings)
      .values({ organizationId })
      .returning();

    if (!created) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to initialize organization settings",
      });
    }

    return created;
  }

  static async update(input: {
    organizationId: string;
    data: OrganizationSettingsInput;
  }) {
    const { organizationId, data } = input;

    const values = {
      currency: data.currency,
      timezone: data.timezone,
      dateFormat: data.dateFormat,
      timeFormat: data.timeFormat,
      weekStartsOn: data.weekStartsOn,
      workingDays: data.workingDays,
      workStartTime: data.workStartTime,
      workEndTime: data.workEndTime,
      workingHoursPerDay: data.workingHoursPerDay.toString(),
      payrollFrequency: data.payrollFrequency,
      payDayOfMonth: data.payDayOfMonth,
      defaultTaxPercentage: data.defaultTaxPercentage.toString(),
      fiscalYearStartMonth: data.fiscalYearStartMonth,
      defaultAnnualLeaveDays: data.defaultAnnualLeaveDays,
      leaveApprovalRequired: data.leaveApprovalRequired,
    };

    const [updated] = await db
      .insert(organizationSettings)
      .values({ organizationId, ...values })
      .onConflictDoUpdate({
        target: organizationSettings.organizationId,
        set: { ...values, updatedAt: new Date() },
      })
      .returning();

    if (!updated) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update organization settings",
      });
    }

    return updated;
  }
}
