"use client";

import { useTransition } from "react";
import { Button } from "@/shared/components/ui/button";
import { useCredits } from "@/shared/actions/credits";
import { toast } from "sonner";

export function TestCreditButton() {
	const [pending, startTransition] = useTransition();

	return (
		<Button
			disabled={pending}
			onClick={() => {
				startTransition(async () => {
					const result = await useCredits(1, "test", "Test button");
					if ("error" in result) {
						toast.error("Crédits insuffisants");
					} else {
						toast.success("-1 crédit");
					}
				});
			}}
		>
			{pending ? "..." : "Utiliser 1 crédit"}
		</Button>
	);
}
