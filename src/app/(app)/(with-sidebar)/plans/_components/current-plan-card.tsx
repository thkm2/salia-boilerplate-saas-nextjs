"use client";

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { PLANS, type PlanId } from "@/lib/plans";
import { createBillingPortalSession } from "@/shared/actions/stripe";
import { useTransition } from "react";

export function CurrentPlanCard({
  plan,
  credits,
  hasSubscription,
  paymentFailed,
  creditsResetAt,
}: {
  plan: string;
  credits: number;
  hasSubscription: boolean;
  paymentFailed?: boolean;
  creditsResetAt?: Date | null;
}) {
  const [isPending, startTransition] = useTransition();
  const planId = plan as PlanId;
  const planConfig = PLANS[planId] ?? PLANS.free;
  const maxCredits = planConfig.credits;
  const percentage = Math.min(Math.round((credits / maxCredits) * 100), 100);

  const nextRenewalDate = creditsResetAt
    ? new Date(new Date(creditsResetAt).setMonth(new Date(creditsResetAt).getMonth() + 1))
    : null;

  return (
    <div className="rounded-lg border bg-card p-6">
      {paymentFailed && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive mb-4">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            Your last payment failed. Please update your billing information to
            continue receiving credits.
          </span>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Current plan</h2>
          <Badge variant="secondary">{planConfig.label}</Badge>
        </div>
        {hasSubscription ? (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => startTransition(() => createBillingPortalSession())}
          >
            {isPending ? "Redirecting..." : "Manage subscription"}
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled variant="outline" size="sm">
                  Manage subscription
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Available on paid plans</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Credits remaining</span>
          <span className="font-medium">
            {credits} / {maxCredits}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        {paymentFailed ? (
          "Credits won't renew until payment is resolved. Update your billing to avoid losing access"
        ) : nextRenewalDate ? (
          `Credits renew on ${nextRenewalDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
        ) : (
          "Credits renew monthly"
        )}
      </p>
    </div>
  );
}
