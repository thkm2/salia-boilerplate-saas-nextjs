"use server";

import { cache } from "react";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count, desc, eq, ilike, or, and } from "drizzle-orm";
import { requireRole } from "@/lib/auth/guards";

const USERS_PER_PAGE = 20;

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
			conditions.push(eq(user.role, role));
		}

		if (plan && plan !== "all") {
			conditions.push(eq(user.plan, plan));
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

