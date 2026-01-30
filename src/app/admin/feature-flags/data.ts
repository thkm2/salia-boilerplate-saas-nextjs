import { cache } from "react";
import { db } from "@/lib/db";
import { featureFlag, userFeatureFlag, user } from "@/lib/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/guards";

export const getFeatureFlags = cache(async () => {
	await requireRole("admin");

	const flags = await db
		.select({
			id: featureFlag.id,
			name: featureFlag.name,
			description: featureFlag.description,
			enabled: featureFlag.enabled,
			createdAt: featureFlag.createdAt,
			userCount: count(userFeatureFlag.userId),
		})
		.from(featureFlag)
		.leftJoin(userFeatureFlag, eq(featureFlag.id, userFeatureFlag.flagId))
		.groupBy(featureFlag.id)
		.orderBy(desc(featureFlag.createdAt));

	return flags;
});

export const getFeatureFlagById = cache(async (id: string) => {
	await requireRole("admin");

	const result = await db
		.select({
			id: featureFlag.id,
			name: featureFlag.name,
			description: featureFlag.description,
			enabled: featureFlag.enabled,
			createdAt: featureFlag.createdAt,
			updatedAt: featureFlag.updatedAt,
		})
		.from(featureFlag)
		.where(eq(featureFlag.id, id))
		.then((r) => r[0] ?? null);

	return result;
});

export const getFlagAssignedUsers = cache(async (flagId: string) => {
	await requireRole("admin");

	const users = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			assignedAt: userFeatureFlag.createdAt,
		})
		.from(userFeatureFlag)
		.innerJoin(user, eq(userFeatureFlag.userId, user.id))
		.where(eq(userFeatureFlag.flagId, flagId))
		.orderBy(desc(userFeatureFlag.createdAt));

	return users;
});

export const getAllFlagsForUser = cache(async (userId: string) => {
	await requireRole("admin");

	const [allFlags, userAssignments] = await Promise.all([
		db
			.select({
				id: featureFlag.id,
				name: featureFlag.name,
				description: featureFlag.description,
				enabled: featureFlag.enabled,
			})
			.from(featureFlag)
			.orderBy(featureFlag.name),
		db
			.select({ flagId: userFeatureFlag.flagId })
			.from(userFeatureFlag)
			.where(eq(userFeatureFlag.userId, userId)),
	]);

	const assignedFlagIds = new Set(userAssignments.map((a) => a.flagId));

	return allFlags.map((flag) => ({
		...flag,
		assigned: assignedFlagIds.has(flag.id),
	}));
});
