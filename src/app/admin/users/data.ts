import { cache } from "react";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count, desc, eq, ilike, or, and, gte, inArray } from "drizzle-orm";
import { requireRole } from "@/lib/auth/guards";

const USERS_PER_PAGE = 20;

export const getUsersStats = cache(async () => {
	await requireRole("admin");

	const now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const startOfWeek = new Date(startOfToday);
	startOfWeek.setDate(startOfWeek.getDate() - 7);

	const [activeTodayResult, newThisWeekResult] = await Promise.all([
		db
			.select({ count: count() })
			.from(user)
			.where(gte(user.lastLoginAt, startOfToday))
			.then((r) => r[0]?.count ?? 0),
		db
			.select({ count: count() })
			.from(user)
			.where(gte(user.createdAt, startOfWeek))
			.then((r) => r[0]?.count ?? 0),
	]);

	return {
		activeToday: activeTodayResult,
		newThisWeek: newThisWeekResult,
	};
});

function escapeIlike(value: string) {
	return value.replace(/[%_\\]/g, "\\$&");
}

interface GetUsersFilters {
	search?: string;
	role?: string;
	plan?: string;
	page?: number;
}

export const getUsers = cache(
	async (filters: GetUsersFilters = {}) => {
		await requireRole("admin");
		const { search, role, plan, page = 1 } = filters;
		const offset = (page - 1) * USERS_PER_PAGE;

		const conditions = [];

		if (search) {
			const escaped = escapeIlike(search);
			conditions.push(
				or(
					ilike(user.name, `%${escaped}%`),
					ilike(user.email, `%${escaped}%`),
				),
			);
		}

		if (role && role !== "all") {
			const roles = role.split(",").filter(Boolean);
			if (roles.length === 1) {
				conditions.push(eq(user.role, roles[0]));
			} else if (roles.length > 1) {
				conditions.push(inArray(user.role, roles));
			}
		}

		if (plan && plan !== "all") {
			const plans = plan.split(",").filter(Boolean);
			if (plans.length === 1) {
				conditions.push(eq(user.plan, plans[0]));
			} else if (plans.length > 1) {
				conditions.push(inArray(user.plan, plans));
			}
		}

		const where = conditions.length > 0 ? and(...conditions) : undefined;

		const [users, total] = await Promise.all([
			db
				.select({
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					role: user.role,
					plan: user.plan,
					credits: user.credits,
					lastLoginAt: user.lastLoginAt,
					firstLoginAt: user.firstLoginAt,
				})
				.from(user)
				.where(where)
				.orderBy(desc(user.createdAt))
				.limit(USERS_PER_PAGE)
				.offset(offset),
			db
				.select({ count: count() })
				.from(user)
				.where(where)
				.then((r) => r[0]?.count ?? 0),
		]);

		return {
			users,
			total,
			totalPages: Math.ceil(total / USERS_PER_PAGE),
			page,
		};
	},
);

