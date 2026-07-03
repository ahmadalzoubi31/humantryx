"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { api } from "@/trpc/react";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAbility } from "@/providers/ability-context";
import {
  organizationSettingsSchema,
  type OrganizationSettingsInput,
} from "../schemas/organization-settings.schema";
import { LocalizationSettings } from "./localization-settings";
import { WorkScheduleSettings } from "./work-schedule-settings";
import { PayrollSettings } from "./payroll-settings";
import { LeaveSettings } from "./leave-settings";
import type { RouterOutputs } from "@/trpc/react";

type Settings = RouterOutputs["organizationSettings"]["get"];

function toFormValues(settings: Settings): OrganizationSettingsInput {
  return {
    currency: settings.currency,
    timezone: settings.timezone,
    dateFormat: settings.dateFormat,
    timeFormat: settings.timeFormat,
    weekStartsOn: settings.weekStartsOn,
    workingDays: settings.workingDays,
    workStartTime: settings.workStartTime,
    workEndTime: settings.workEndTime,
    workingHoursPerDay: Number(settings.workingHoursPerDay),
    payrollFrequency: settings.payrollFrequency,
    payDayOfMonth: settings.payDayOfMonth,
    defaultTaxPercentage: Number(settings.defaultTaxPercentage),
    fiscalYearStartMonth: settings.fiscalYearStartMonth,
    defaultAnnualLeaveDays: settings.defaultAnnualLeaveDays,
    leaveApprovalRequired: settings.leaveApprovalRequired,
  };
}

function SettingsForm({ settings }: { settings: Settings }) {
  const ability = useAbility();
  const utils = api.useUtils();
  const canManage = ability.can("manage", "OrganizationSettings");

  const form = useForm<OrganizationSettingsInput>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: toFormValues(settings),
  });

  const updateMutation = api.organizationSettings.update.useMutation({
    onSuccess: (updated) => {
      toast.success("Settings saved successfully");
      form.reset(toFormValues(updated));
      void utils.organizationSettings.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save settings");
    },
  });

  const onSubmit = (data: OrganizationSettingsInput) => {
    updateMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="localization" className="w-full">
          <TabsList className="flex-wrap">
            <TabsTrigger value="localization">Localization</TabsTrigger>
            <TabsTrigger value="work-schedule">Work Schedule</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
          </TabsList>

          <TabsContent value="localization" className="mt-4">
            <LocalizationSettings form={form} />
          </TabsContent>
          <TabsContent value="work-schedule" className="mt-4">
            <WorkScheduleSettings form={form} />
          </TabsContent>
          <TabsContent value="payroll" className="mt-4">
            <PayrollSettings form={form} />
          </TabsContent>
          <TabsContent value="leave" className="mt-4">
            <LeaveSettings form={form} />
          </TabsContent>
        </Tabs>

        {canManage && (
          <div className="flex justify-end">
            <LoadingButton
              type="submit"
              pending={updateMutation.isPending}
              disabled={!form.formState.isDirty}
              className="w-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </LoadingButton>
          </div>
        )}
      </form>
    </Form>
  );
}

export function OrganizationSettingsForm() {
  const settingsQuery = api.organizationSettings.get.useQuery();

  if (settingsQuery.isLoading || !settingsQuery.data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-80" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return <SettingsForm settings={settingsQuery.data} />;
}
