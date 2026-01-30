"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { user, creditTransaction } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { requireRole } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

const updateRoleSchema = z.object({
	userId: z.string().min(1),
	role: z.enum(["admin", "user", "beta"]),
});

export async function updateUserRole(input: z.infer<typeof updateRoleSchema>) {
	await requireRole("admin");
	const { userId, role } = updateRoleSchema.parse(input);

	await db.update(user).set({ role }).where(eq(user.id, userId));

	revalidatePath("/admin/users");
	revalidatePath(`/admin/users/${userId}`);
	return { success: true };
}

const grantCreditsSchema = z.object({
	userId: z.string().min(1),
	amount: z.number().int(),
	description: z.string().optional(),
});

export async function grantCredits(input: z.infer<typeof grantCreditsSchema>) {
	await requireRole("admin");
	const { userId, amount, description } = grantCreditsSchema.parse(input);

	await db.transaction(async (tx) => {
		await tx.insert(creditTransaction).values({
			id: crypto.randomUUID(),
			userId,
			amount,
			type: "admin_grant",
			description: description || `Admin granted ${amount} credits`,
		});

		await tx
			.update(user)
			.set({ credits: sql`${user.credits} + ${amount}` })
			.where(eq(user.id, userId));
	});

	revalidatePath("/admin/users");
	revalidatePath(`/admin/users/${userId}`);
	return { success: true };
}
