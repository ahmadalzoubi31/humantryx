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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrganizationSettingsInput } from "../schemas/organization-settings.schema";
import { MONTHS, PAYROLL_FREQUENCIES } from "../constants";

type Props = {
  form: UseFormReturn<OrganizationSettingsInput>;
};

export function PayrollSettings({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll</CardTitle>
        <CardDescription>
          Set the payroll cycle, default tax rate, and fiscal year used when
          generating payslips.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="payrollFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payroll Frequency</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYROLL_FREQUENCIES.map((frequency) => (
                    <SelectItem key={frequency.value} value={frequency.value}>
                      {frequency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payDayOfMonth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pay Day of Month</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={31} {...field} />
              </FormControl>
              <FormDescription>
                Day of the month salaries are paid out.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultTaxPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Tax Percentage (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  max={100}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fiscalYearStartMonth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fiscal Year Start Month</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
