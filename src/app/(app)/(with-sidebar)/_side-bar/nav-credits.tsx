"use client";

import Link from "next/link";
import { ArrowUpRight, AlertTriangle } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { PLANS, type PlanId } from "@/lib/plans";

export function NavCredits({
  plan,
  credits,
  paymentFailed,
}: {
  plan: string;
  credits: number;
  paymentFailed?: boolean;
}) {
  const planId = plan as PlanId;
  const planConfig = PLANS[planId] ?? PLANS.free;
  const maxCredits = planConfig.credits;
  const percentage = Math.min(Math.round((credits / maxCredits) * 100), 100);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex flex-col gap-2 rounded-lg bg-sidebar-accent/50 p-3">
          {paymentFailed && (
            <Link
              href="/plans"
              className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/20 transition-colors"
            >
              <AlertTriangle className="size-3 shrink-0" />
              <span>Payment failed — update billing</span>
            </Link>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sidebar-foreground">
              Credits
            </span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {planConfig.label}
            </Badge>
          </div>
          <Progress value={percentage} className="h-1.5" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {credits} / {maxCredits}
            </span>
            {planId !== "pro" && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/plans">
                  Upgrade
                  <ArrowUpRight className="ml-0.5 size-3" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
