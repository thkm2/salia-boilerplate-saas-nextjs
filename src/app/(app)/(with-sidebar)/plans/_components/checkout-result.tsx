"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function CheckoutResult() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      toast.success("Subscription activated! Your credits have been updated.");
    } else if (canceled === "true") {
      toast.info("Checkout canceled. No changes were made.");
    }

    if (success || canceled) {
      // Clean up URL params
      router.replace("/plans");
    }
  }, [searchParams, router]);

  return null;
}
