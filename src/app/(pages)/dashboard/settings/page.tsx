import { OrganizationSettingsForm } from "@/modules/settings/components/organization-settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Organization Settings</h1>
        <p className="text-muted-foreground">
          Manage organization-wide preferences for localization, work schedule,
          payroll, and leave.
        </p>
      </div>

      <OrganizationSettingsForm />
    </div>
  );
}
