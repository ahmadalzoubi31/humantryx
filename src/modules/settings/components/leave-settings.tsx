"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrganizationSettingsInput } from "../schemas/organization-settings.schema";

type Props = {
  form: UseFormReturn<OrganizationSettingsInput>;
};

export function LeaveSettings({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave</CardTitle>
        <CardDescription>
          Configure default leave entitlements and approval requirements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="defaultAnnualLeaveDays"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>Default Annual Leave Days</FormLabel>
              <FormControl>
                <Input type="number" min={0} max={365} {...field} />
              </FormControl>
              <FormDescription>
                Default number of paid leave days granted per year.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leaveApprovalRequired"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Require Leave Approval</FormLabel>
                <FormDescription>
                  When enabled, leave requests must be approved by a manager
                  before taking effect.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
