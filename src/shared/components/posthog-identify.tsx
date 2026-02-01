"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function PostHogIdentify({
	userId,
	email,
	name,
	role,
	plan,
}: {
	userId: string;
	email: string;
	name: string;
	role: string;
	plan: string;
}) {
	useEffect(() => {
		if (role === "admin") {
			posthog.opt_out_capturing();
			return;
		}

		posthog.opt_in_capturing();
		posthog.identify(userId, {
			email,
			name,
			role,
			plan,
		});
	}, [userId, email, name, role, plan]);

	return null;
}
