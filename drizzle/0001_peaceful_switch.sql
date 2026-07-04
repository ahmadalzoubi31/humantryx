CREATE TYPE "public"."payroll_frequency" AS ENUM('weekly', 'biweekly', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."time_format" AS ENUM('12h', '24h');--> statement-breakpoint
CREATE TYPE "public"."week_start_day" AS ENUM('sunday', 'monday');--> statement-breakpoint
CREATE TABLE "organization_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"date_format" text DEFAULT 'MM/DD/YYYY' NOT NULL,
	"time_format" time_format DEFAULT '12h' NOT NULL,
	"week_starts_on" "week_start_day" DEFAULT 'monday' NOT NULL,
	"working_days" json DEFAULT '["monday","tuesday","wednesday","thursday","friday"]'::json NOT NULL,
	"work_start_time" text DEFAULT '09:00' NOT NULL,
	"work_end_time" text DEFAULT '17:00' NOT NULL,
	"working_hours_per_day" numeric(4, 2) DEFAULT '8' NOT NULL,
	"payroll_frequency" "payroll_frequency" DEFAULT 'monthly' NOT NULL,
	"pay_day_of_month" integer DEFAULT 1 NOT NULL,
	"default_tax_percentage" numeric(5, 2) DEFAULT '0' NOT NULL,
	"fiscal_year_start_month" integer DEFAULT 1 NOT NULL,
	"default_annual_leave_days" integer DEFAULT 20 NOT NULL,
	"leave_approval_required" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organization_settings_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
ALTER TABLE "organization_settings" ADD CONSTRAINT "organization_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;