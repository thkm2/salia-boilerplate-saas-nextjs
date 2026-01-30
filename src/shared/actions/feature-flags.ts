"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { featureFlag, userFeatureFlag } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

const FLAG_NAME_REGEX = /^[a-z0-9_]+$/;

const createFlagSchema = z.object({
	name: z.string().min(1).regex(FLAG_NAME_REGEX, "Only lowercase letters, numbers, and underscores"),
	description: z.string().optional(),
});

export async function createFeatureFlag(input: z.infer<typeof createFlagSchema>) {
	await requireRole("admin");
	const { name, description } = createFlagSchema.parse(input);

	await db.insert(featureFlag).values({
		id: crypto.randomUUID(),
		name,
		description: description || null,
	});

	revalidatePath("/admin/feature-flags");
	return { success: true };
}

const toggleGlobalFlagSchema = z.object({
	flagId: z.string().min(1),
	enabled: z.boolean(),
});

export async function toggleGlobalFlag(input: z.infer<typeof toggleGlobalFlagSchema>) {
	await requireRole("admin");
	const { flagId, enabled } = toggleGlobalFlagSchema.parse(input);

	await db
		.update(featureFlag)
		.set({ enabled, updatedAt: new Date() })
		.where(eq(featureFlag.id, flagId));

	revalidatePath("/admin/feature-flags");
	revalidatePath("/admin/users");
	return { success: true };
}

const deleteFlagSchema = z.object({
	flagId: z.string().min(1),
});

export async function deleteFeatureFlag(input: z.infer<typeof deleteFlagSchema>) {
	await requireRole("admin");
	const { flagId } = deleteFlagSchema.parse(input);

	await db.delete(featureFlag).where(eq(featureFlag.id, flagId));

	revalidatePath("/admin/feature-flags");
	revalidatePath("/admin/users");
	return { success: true };
}

const assignFlagSchema = z.object({
	userId: z.string().min(1),
	flagId: z.string().min(1),
});

export async function assignFlagToUser(input: z.infer<typeof assignFlagSchema>) {
	await requireRole("admin");
	const { userId, flagId } = assignFlagSchema.parse(input);

	await db
		.insert(userFeatureFlag)
		.values({ userId, flagId })
		.onConflictDoNothing();

	revalidatePath("/admin/feature-flags");
	revalidatePath(`/admin/users/${userId}`);
	return { success: true };
}

export async function unassignFlagFromUser(input: z.infer<typeof assignFlagSchema>) {
	await requireRole("admin");
	const { userId, flagId } = assignFlagSchema.parse(input);

	await db
		.delete(userFeatureFlag)
		.where(
			and(
				eq(userFeatureFlag.userId, userId),
				eq(userFeatureFlag.flagId, flagId),
			),
		);

	revalidatePath("/admin/feature-flags");
	revalidatePath(`/admin/users/${userId}`);
	return { success: true };
}
