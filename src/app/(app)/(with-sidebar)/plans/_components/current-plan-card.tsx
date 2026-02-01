"use client";

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
}: {
  plan: string;
  credits: number;
  hasSubscription: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const planId = plan as PlanId;
  const planConfig = PLANS[planId] ?? PLANS.free;
  const maxCredits = planConfig.credits;
  const percentage = Math.min(Math.round((credits / maxCredits) * 100), 100);

  return (
    <div className="rounded-lg border bg-card p-6">
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
        Credits renew every month with your subscription.
      </p>
    </div>
  );
}
