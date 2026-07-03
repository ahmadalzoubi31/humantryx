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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrganizationSettingsInput } from "../schemas/organization-settings.schema";
import { WORKING_DAYS } from "../constants";

type Props = {
  form: UseFormReturn<OrganizationSettingsInput>;
};

export function WorkScheduleSettings({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Schedule</CardTitle>
        <CardDescription>
          Define the standard working days and hours used for attendance and
          payroll calculations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="workingDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Days</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  value={field.value}
                  onValueChange={(value) => {
                    if (value.length > 0) field.onChange(value);
                  }}
                  className="flex-wrap"
                >
                  {WORKING_DAYS.map((day) => (
                    <ToggleGroupItem key={day.value} value={day.value}>
                      {day.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormDescription>
                Select the days considered working days for your organization.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="workStartTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workEndTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workingHoursPerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Working Hours / Day</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    min={1}
                    max={24}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
