"use server";

import { cache } from "react";
import { db } from "@/lib/db";
import { user, creditTransaction } from "@/lib/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/guards";

const TRANSACTIONS_PER_PAGE = 20;

export const getUserById = cache(async (id: string) => {
	await requireRole("admin");
	const result = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			emailVerified: user.emailVerified,
			image: user.image,
			role: user.role,
			plan: user.plan,
			credits: user.credits,
			firstLoginAt: user.firstLoginAt,
			lastLoginAt: user.lastLoginAt,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})
		.from(user)
		.where(eq(user.id, id))
		.then((r) => r[0] ?? null);

	return result;
});

export const getUserCreditTransactions = cache(
	async (userId: string, page: number = 1) => {
		await requireRole("admin");
		const offset = (page - 1) * TRANSACTIONS_PER_PAGE;

		const [transactions, total] = await Promise.all([
			db
				.select({
					id: creditTransaction.id,
					amount: creditTransaction.amount,
					type: creditTransaction.type,
					description: creditTransaction.description,
					metadata: creditTransaction.metadata,
					createdAt: creditTransaction.createdAt,
				})
				.from(creditTransaction)
				.where(eq(creditTransaction.userId, userId))
				.orderBy(desc(creditTransaction.createdAt))
				.limit(TRANSACTIONS_PER_PAGE)
				.offset(offset),
			db
				.select({ count: count() })
				.from(creditTransaction)
				.where(eq(creditTransaction.userId, userId))
				.then((r) => r[0]?.count ?? 0),
		]);

		return {
			transactions,
			total,
			hasMore: offset + transactions.length < total,
		};
	},
);
