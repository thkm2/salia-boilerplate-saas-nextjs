"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useCallback, useRef } from "react";
import { Input } from "@/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Search, X, Filter, Shield, Crown, Sparkles, User } from "lucide-react";

export function UsersFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

	const activeFilters = {
		search: searchParams.get("search"),
		role: searchParams.get("role"),
		plan: searchParams.get("plan"),
	};

	const hasActiveFilters = activeFilters.search || activeFilters.role || activeFilters.plan;

	const updateParams = useCallback(
		(key: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value && value !== "all") {
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

				{/* Filter Selects */}
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<Filter className="h-4 w-4" />
					</div>

					<Select
						value={activeFilters.role ?? "all"}
						onValueChange={(value) => updateParams("role", value)}
					>
						<SelectTrigger className={`w-[140px] transition-all ${activeFilters.role ? "ring-2 ring-foreground/10 bg-foreground/5" : ""}`}>
							<SelectValue placeholder="Role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								<span className="flex items-center gap-2">
									All Roles
								</span>
							</SelectItem>
							<SelectItem value="admin">
								<span className="flex items-center gap-2">
									<Shield className="h-3.5 w-3.5 text-amber-500" />
									Admin
								</span>
							</SelectItem>
							<SelectItem value="user">
								<span className="flex items-center gap-2">
									<User className="h-3.5 w-3.5 text-muted-foreground" />
									User
								</span>
							</SelectItem>
							<SelectItem value="beta">
								<span className="flex items-center gap-2">
									<Sparkles className="h-3.5 w-3.5 text-purple-500" />
									Beta
								</span>
							</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={activeFilters.plan ?? "all"}
						onValueChange={(value) => updateParams("plan", value)}
					>
						<SelectTrigger className={`w-[140px] transition-all ${activeFilters.plan ? "ring-2 ring-foreground/10 bg-foreground/5" : ""}`}>
							<SelectValue placeholder="Plan" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Plans</SelectItem>
							<SelectItem value="free">
								<span className="flex items-center gap-2">
									<span className="h-2 w-2 rounded-full bg-muted-foreground" />
									Free
								</span>
							</SelectItem>
							<SelectItem value="basic">
								<span className="flex items-center gap-2">
									<span className="h-2 w-2 rounded-full bg-blue-500" />
									Basic
								</span>
							</SelectItem>
							<SelectItem value="pro">
								<span className="flex items-center gap-2">
									<Crown className="h-3.5 w-3.5 text-amber-500" />
									Pro
								</span>
							</SelectItem>
						</SelectContent>
					</Select>
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
					{activeFilters.role && (
						<FilterPill
							label={`Role: ${activeFilters.role}`}
							onRemove={() => updateParams("role", "all")}
						/>
					)}
					{activeFilters.plan && (
						<FilterPill
							label={`Plan: ${activeFilters.plan}`}
							onRemove={() => updateParams("plan", "all")}
						/>
					)}

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

function FilterPill({
	label,
	onRemove,
}: {
	label: string;
	onRemove: () => void;
}) {
	return (
		<span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-foreground/10">
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
