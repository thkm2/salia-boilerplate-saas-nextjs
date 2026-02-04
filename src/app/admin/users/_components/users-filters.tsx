"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useCallback, useRef } from "react";
import { Input } from "@/shared/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { Button } from "@/shared/components/ui/button";
import { Search, X, Filter, Shield, Crown, FlaskConical, User } from "lucide-react";

export function UsersFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	const activeFilters = {
		search: searchParams.get("search"),
		roles: searchParams.get("role")?.split(",").filter(Boolean) ?? [],
		plans: searchParams.get("plan")?.split(",").filter(Boolean) ?? [],
	};

	const hasActiveFilters = activeFilters.search || activeFilters.roles.length > 0 || activeFilters.plans.length > 0;

	const updateParams = useCallback(
		(key: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
			params.delete("page");
			startTransition(() => {
				router.push(`/admin/users?${params.toString()}`);
			});
		},
		[router, searchParams, startTransition],
	);

	const updateMultiParam = useCallback(
		(key: string, values: string[]) => {
			const params = new URLSearchParams(searchParams.toString());
			if (values.length > 0) {
				params.set(key, values.join(","));
			} else {
				params.delete(key);
			}
			params.delete("page");
			startTransition(() => {
				router.push(`/admin/users?${params.toString()}`);
			});
		},
		[router, searchParams, startTransition],
	);

	const removeFilter = useCallback(
		(key: string, value?: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value) {
				const current = params.get(key)?.split(",").filter(Boolean) ?? [];
				const updated = current.filter((v) => v !== value);
				if (updated.length > 0) {
					params.set(key, updated.join(","));
				} else {
					params.delete(key);
				}
			} else {
				params.delete(key);
			}
			params.delete("page");
			startTransition(() => {
				router.push(`/admin/users?${params.toString()}`);
			});
		},
		[router, searchParams, startTransition],
	);

	const clearAllFilters = useCallback(() => {
		startTransition(() => {
			router.push("/admin/users");
		});
	}, [router, startTransition]);

	return (
		<div className="space-y-3">
			{/* Main Filters Row */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				{/* Search Input */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search by name or email..."
						defaultValue={activeFilters.search ?? ""}
						className="pl-9 pr-9 bg-background transition-shadow focus-visible:shadow-md"
						onChange={(e) => {
							const value = e.target.value;
							if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
							searchTimeoutRef.current = setTimeout(() => {
								updateParams("search", value);
							}, 300);
						}}
					/>
					{activeFilters.search && (
						<button
							onClick={() => updateParams("search", "")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				{/* Filter Toggle Groups */}
				<div className="flex items-center gap-3 flex-wrap">
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<Filter className="h-4 w-4" />
					</div>

					{/* Role Filter */}
					<ToggleGroup
						type="multiple"
						value={activeFilters.roles}
						onValueChange={(values) => updateMultiParam("role", values)}
						variant="outline"
						size="sm"
					>
						<ToggleGroupItem value="admin" className="gap-1.5">
							<Shield className="h-3.5 w-3.5 text-amber-500" />
							Admin
						</ToggleGroupItem>
						<ToggleGroupItem value="user" className="gap-1.5">
							<User className="h-3.5 w-3.5 text-muted-foreground" />
							User
						</ToggleGroupItem>
						<ToggleGroupItem value="beta" className="gap-1.5">
							<FlaskConical className="h-3.5 w-3.5 text-purple-500" />
							Beta
						</ToggleGroupItem>
					</ToggleGroup>

					{/* Plan Filter */}
					<ToggleGroup
						type="multiple"
						value={activeFilters.plans}
						onValueChange={(values) => updateMultiParam("plan", values)}
						variant="outline"
						size="sm"
					>
						<ToggleGroupItem value="free" className="gap-1.5">
							<span className="h-2 w-2 rounded-full bg-muted-foreground" />
							Free
						</ToggleGroupItem>
						<ToggleGroupItem value="basic" className="gap-1.5">
							<span className="h-2 w-2 rounded-full bg-blue-500" />
							Basic
						</ToggleGroupItem>
						<ToggleGroupItem value="pro" className="gap-1.5">
							<Crown className="h-3.5 w-3.5 text-amber-500" />
							Pro
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</div>

			{/* Active Filters Pills */}
			{hasActiveFilters && (
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-xs text-muted-foreground">Active filters:</span>

					{activeFilters.search && (
						<FilterPill
							label={`"${activeFilters.search}"`}
							onRemove={() => updateParams("search", "")}
						/>
					)}
					{activeFilters.roles.map((role) => (
						<FilterPill
							key={role}
							label={role}
							icon={getRoleIcon(role)}
							onRemove={() => removeFilter("role", role)}
						/>
					))}
					{activeFilters.plans.map((plan) => (
						<FilterPill
							key={plan}
							label={plan}
							icon={getPlanIcon(plan)}
							onRemove={() => removeFilter("plan", plan)}
						/>
					))}

					<Button
						variant="ghost"
						size="sm"
						onClick={clearAllFilters}
						disabled={isPending}
						className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
					>
						Clear all
					</Button>
				</div>
			)}
		</div>
	);
}

function getRoleIcon(role: string) {
	switch (role) {
		case "admin":
			return <Shield className="h-3 w-3 text-amber-500" />;
		case "beta":
			return <FlaskConical className="h-3 w-3 text-purple-500" />;
		case "user":
			return <User className="h-3 w-3 text-muted-foreground" />;
		default:
			return null;
	}
}

function getPlanIcon(plan: string) {
	switch (plan) {
		case "pro":
			return <Crown className="h-3 w-3 text-amber-500" />;
		case "basic":
			return <span className="h-2 w-2 rounded-full bg-blue-500" />;
		case "free":
			return <span className="h-2 w-2 rounded-full bg-muted-foreground" />;
		default:
			return null;
	}
}

function FilterPill({
	label,
	icon,
	onRemove,
}: {
	label: string;
	icon?: React.ReactNode;
	onRemove: () => void;
}) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-foreground/10 capitalize">
			{icon}
			{label}
			<button
				onClick={onRemove}
				className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
			>
				<X className="h-3 w-3" />
			</button>
		</span>
	);
}
