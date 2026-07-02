import { type NextRequest } from "next/server";
import { handleStripeWebhook } from "@/server/api/stripe-webhook";

export async function POST(req: NextRequest) {
  return handleStripeWebhook(req);
}
