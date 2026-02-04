import { cache } from "react";
import { db } from "@/lib/db";
import { user, creditTransaction } from "@/lib/db/schema";
import { count, desc, eq, gte, sql, and } from "drizzle-orm";
import { formatRelativeDate } from "@/shared/utils/format-date";

/**
 * Get total number of users
 */
export const getTotalUsers = cache(async (): Promise<number> => {
	const result = await db.select({ count: count() }).from(user);
	return result[0]?.count ?? 0;
});

/**
 * Get number of active users in the last 30 days
 * Active = users who used at least one credit (negative transaction) in the last 30 days
 */
export const getActiveUsers = cache(async (): Promise<number> => {
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

	const activeUsersQuery = await db
		.selectDistinct({ userId: creditTransaction.userId })
		.from(creditTransaction)
		.where(
			and(
				gte(creditTransaction.createdAt, thirtyDaysAgo),
				sql`${creditTransaction.amount} < 0`, // Only credit usage (negative amounts)
			),
		);

	return activeUsersQuery.length;
});

/**
 * Get distribution of users by plan
 */
export const getPlanDistribution = cache(async (): Promise<
	{ plan: string; users: number }[]
> => {
	const result = await db
		.select({
			plan: user.plan,
			users: count(),
		})
		.from(user)
		.groupBy(user.plan);

	// Ensure all plans are present
	const plans = ["free", "basic", "pro"];
	return plans.map((plan) => ({
		plan: plan.charAt(0).toUpperCase() + plan.slice(1),
		users: result.find((r) => r.plan === plan)?.users ?? 0,
	}));
});

/**
 * Get user growth data for the last 28 days (4 weeks)
 * Week 1: 28-21 days ago, Week 2: 21-14 days ago, Week 3: 14-7 days ago, Week 4: last 7 days
 */
export const getUserGrowth = cache(async (): Promise<
	{ label: string; users: number }[]
> => {
	const now = new Date();

	// Create 4 weekly buckets (Week 4 is the most recent)
	const buckets = [1, 2, 3, 4].map((week) => {
		const start = new Date(now);
		// Week 1: -28 to -21 days, Week 2: -21 to -14 days, Week 3: -14 to -7 days, Week 4: -7 to now
		start.setDate(start.getDate() - (5 - week) * 7);
		start.setHours(0, 0, 0, 0);

		const end = new Date(start);
		end.setDate(end.getDate() + 7);

		// For Week 4 (most recent), end should be NOW, not truncated to midnight
		if (week === 4) {
			end.setTime(now.getTime()); // Use current time
		} else {
			end.setHours(0, 0, 0, 0);
		}

		return { label: `Week ${week}`, start, end };
	});

	// Count users in each bucket
	const results = await Promise.all(
		buckets.map(async (bucket) => {
			const result = await db
				.select({ count: count() })
				.from(user)
				.where(
					and(
						gte(user.createdAt, bucket.start),
						sql`${user.createdAt} < ${bucket.end}`,
					),
				);
			return {
				label: bucket.label,
				users: result[0]?.count ?? 0,
			};
		}),
	);

	return results;
});

/**
 * Get recent users (last 20 by default)
 */
export const getRecentUsers = cache(async (limit: number = 20): Promise<
	{
		id: string;
		name: string;
		email: string;
		plan: string;
		isPaid: boolean;
		date: string;
	}[]
> => {
	const users = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			plan: user.plan,
			createdAt: user.createdAt,
		})
		.from(user)
		.orderBy(desc(user.createdAt))
		.limit(limit);

	return users.map((u) => {
		const isPaid = u.plan !== "free";

		return {
			id: u.id,
			name: u.name,
			email: u.email,
			plan: u.plan.charAt(0).toUpperCase() + u.plan.slice(1),
			isPaid,
			date: formatRelativeDate(u.createdAt, "long"),
		};
	});
});

/**
 * Get dashboard stats for header
 */
export const getDashboardStats = cache(async (): Promise<{
	totalUsers: number;
	activeUsers: number;
	growthRate: number;
	totalCreditsUsed: number;
}> => {
	const now = new Date();
	const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
	const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

	// Total users
	const totalResult = await db.select({ count: count() }).from(user);
	const totalUsers = totalResult[0]?.count ?? 0;

	// Active users (last 30 days)
	const activeUsersQuery = await db
		.selectDistinct({ userId: creditTransaction.userId })
		.from(creditTransaction)
		.where(
			and(
				gte(creditTransaction.createdAt, thirtyDaysAgo),
				sql`${creditTransaction.amount} < 0`,
			),
		);
	const activeUsers = activeUsersQuery.length;

	// Growth rate: compare new users last 30 days vs previous 30 days
	const newUsersLast30 = await db
		.select({ count: count() })
		.from(user)
		.where(gte(user.createdAt, thirtyDaysAgo));
	const newUsersPrev30 = await db
		.select({ count: count() })
		.from(user)
		.where(
			and(
				gte(user.createdAt, sixtyDaysAgo),
				sql`${user.createdAt} < ${thirtyDaysAgo}`,
			),
		);

	const current = newUsersLast30[0]?.count ?? 0;
	const previous = newUsersPrev30[0]?.count ?? 0;
	const growthRate =
		previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;

	// Total credits used (sum of negative transactions)
	const creditsResult = await db
		.select({
			total: sql<number>`COALESCE(ABS(SUM(CASE WHEN ${creditTransaction.amount} < 0 THEN ${creditTransaction.amount} ELSE 0 END)), 0)`,
		})
		.from(creditTransaction);
	const totalCreditsUsed = Math.round(Number(creditsResult[0]?.total) || 0);

	return { totalUsers, activeUsers, growthRate, totalCreditsUsed };
});

/**
 * Get recent credit actions (last 20 by default)
 */
export const getRecentCreditActions = cache(async (limit: number = 20): Promise<
	{
		id: string;
		user: string;
		action: string;
		credits: number;
		date: string;
	}[]
> => {
	const transactions = await db
		.select({
			id: creditTransaction.id,
			email: user.email,
			type: creditTransaction.type,
			description: creditTransaction.description,
			amount: creditTransaction.amount,
			createdAt: creditTransaction.createdAt,
		})
		.from(creditTransaction)
		.innerJoin(user, eq(creditTransaction.userId, user.id))
		.orderBy(desc(creditTransaction.createdAt))
		.limit(limit);

	return transactions.map((t) => {
		// Format action name
		const action =
			t.description ||
			t.type
				.split("_")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

		return {
			id: t.id,
			user: t.email,
			action,
			credits: t.amount,
			date: formatRelativeDate(t.createdAt, "long"),
		};
	});
});
