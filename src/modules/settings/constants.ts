export const CURRENCIES = [
  { label: "US Dollar (USD)", value: "USD", symbol: "$" },
  { label: "Euro (EUR)", value: "EUR", symbol: "€" },
  { label: "British Pound (GBP)", value: "GBP", symbol: "£" },
  { label: "Indian Rupee (INR)", value: "INR", symbol: "₹" },
  { label: "Canadian Dollar (CAD)", value: "CAD", symbol: "C$" },
  { label: "Australian Dollar (AUD)", value: "AUD", symbol: "A$" },
  { label: "Japanese Yen (JPY)", value: "JPY", symbol: "¥" },
  { label: "Swiss Franc (CHF)", value: "CHF", symbol: "CHF" },
  { label: "Chinese Yuan (CNY)", value: "CNY", symbol: "¥" },
  { label: "UAE Dirham (AED)", value: "AED", symbol: "د.إ" },
  { label: "Singapore Dollar (SGD)", value: "SGD", symbol: "S$" },
  { label: "Brazilian Real (BRL)", value: "BRL", symbol: "R$" },
] as const;

export const TIMEZONES = [
  { label: "(UTC+00:00) Coordinated Universal Time", value: "UTC" },
  { label: "(UTC-08:00) Pacific Time", value: "America/Los_Angeles" },
  { label: "(UTC-07:00) Mountain Time", value: "America/Denver" },
  { label: "(UTC-06:00) Central Time", value: "America/Chicago" },
  { label: "(UTC-05:00) Eastern Time", value: "America/New_York" },
  { label: "(UTC-03:00) São Paulo", value: "America/Sao_Paulo" },
  { label: "(UTC+00:00) London", value: "Europe/London" },
  { label: "(UTC+01:00) Berlin / Paris", value: "Europe/Berlin" },
  { label: "(UTC+02:00) Cairo", value: "Africa/Cairo" },
  { label: "(UTC+03:00) Istanbul", value: "Europe/Istanbul" },
  { label: "(UTC+04:00) Dubai", value: "Asia/Dubai" },
  { label: "(UTC+05:00) Karachi", value: "Asia/Karachi" },
  { label: "(UTC+05:30) India", value: "Asia/Kolkata" },
  { label: "(UTC+07:00) Bangkok", value: "Asia/Bangkok" },
  { label: "(UTC+08:00) Singapore", value: "Asia/Singapore" },
  { label: "(UTC+09:00) Tokyo", value: "Asia/Tokyo" },
  { label: "(UTC+10:00) Sydney", value: "Australia/Sydney" },
] as const;

export const DATE_FORMATS = [
  { label: "MM/DD/YYYY (12/31/2025)", value: "MM/DD/YYYY" },
  { label: "DD/MM/YYYY (31/12/2025)", value: "DD/MM/YYYY" },
  { label: "YYYY-MM-DD (2025-12-31)", value: "YYYY-MM-DD" },
  { label: "DD MMM YYYY (31 Dec 2025)", value: "DD MMM YYYY" },
  { label: "MMM DD, YYYY (Dec 31, 2025)", value: "MMM DD, YYYY" },
] as const;

export const TIME_FORMATS = [
  { label: "12-hour (05:30 PM)", value: "12h" },
  { label: "24-hour (17:30)", value: "24h" },
] as const;

export const WEEK_START_DAYS = [
  { label: "Sunday", value: "sunday" },
  { label: "Monday", value: "monday" },
] as const;

export const WORKING_DAYS = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
] as const;

export const PAYROLL_FREQUENCIES = [
  { label: "Weekly", value: "weekly" },
  { label: "Bi-weekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
] as const;

export const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
] as const;
