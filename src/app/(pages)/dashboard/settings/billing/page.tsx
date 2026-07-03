"use client";

import { Suspense, useState } from "react";
import { Check, Loader2, Crown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { siteConfig } from "@/lib/site-config";

function BillingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const plansQuery = api.billing.getPlans.useQuery();
  const subQuery = api.billing.getCurrentSubscription.useQuery();

  const checkoutMutation = api.billing.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) router.push(data.url);
    },
    onError: (error) => {
      toast.error(error.message);
      setLoadingTier(null);
    },
  });

  const portalMutation = api.billing.createBillingPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) router.push(data.url);
    },
    onError: (error) => toast.error(error.message),
  });

  if (searchParams.get("success")) {
    toast.success("Subscription activated successfully!");
  }

  const currentTier = subQuery.data?.plan?.tier;

  const handleUpgrade = (tier: "starter" | "pro" | "enterprise") => {
    setLoadingTier(tier);
    checkoutMutation.mutate({ planTier: tier });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your {siteConfig.name} subscription and billing
        </p>
      </div>

      {subQuery.data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Current Plan
              <Badge variant="default">{subQuery.data.plan.name}</Badge>
              {subQuery.data.subscription.status === "trialing" && (
                <Badge variant="secondary">Trial</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">
                  Seats: {subQuery.data.subscription.seatCount} /{" "}
                  {subQuery.data.plan.seatLimit}
                </p>
                {subQuery.data.subscription.stripeCurrentPeriodEnd && (
                  <p className="text-muted-foreground text-sm">
                    Renews on{" "}
                    {new Date(
                      subQuery.data.subscription.stripeCurrentPeriodEnd,
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
              >
                {portalMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plansQuery.isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          plansQuery.data?.map((plan) => {
            const isCurrent = currentTier === plan.tier;
            const isFree = plan.tier === "free";

            return (
              <Card
                key={plan.id}
                className={
                  isCurrent ? "border-primary ring-primary ring-2" : ""
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {isCurrent && (
                      <Badge variant="default">
                        <Check className="mr-1 h-3 w-3" /> Current
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.priceMonthly}
                    <span className="text-muted-foreground text-sm font-normal">
                      /mo
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Up to {plan.seatLimit} employees
                  </p>

                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {!isFree && !isCurrent && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleUpgrade(
                          plan.tier as "starter" | "pro" | "enterprise",
                        )
                      }
                      disabled={loadingTier === plan.tier}
                    >
                      {loadingTier === plan.tier ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : plan.tier === "enterprise" ? (
                        <Crown className="mr-2 h-4 w-4" />
                      ) : null}
                      Upgrade to {plan.name}
                    </Button>
                  )}

                  {isFree && !isCurrent && (
                    <Button variant="outline" className="w-full" disabled>
                      {plan.tier === "free" ? "Free Tier" : "Current Plan"}
                    </Button>
                  )}

                  {isCurrent && (
                    <Button variant="outline" className="w-full" disabled>
                      Active
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<Loader2 className="m-auto h-6 w-6 animate-spin" />}>
      <BillingPageContent />
    </Suspense>
  );
}
