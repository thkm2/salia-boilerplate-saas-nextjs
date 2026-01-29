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
import { Search } from "lucide-react";

export function UsersFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();
	const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

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

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search by name or email..."
					defaultValue={searchParams.get("search") ?? ""}
					className="pl-9"
					onChange={(e) => {
						const value = e.target.value;
						if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
						searchTimeoutRef.current = setTimeout(() => {
							updateParams("search", value);
						}, 300);
					}}
				/>
			</div>
			<Select
				defaultValue={searchParams.get("role") ?? "all"}
				onValueChange={(value) => updateParams("role", value)}
			>
				<SelectTrigger className="w-[130px]">
					<SelectValue placeholder="Role" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Roles</SelectItem>
					<SelectItem value="admin">Admin</SelectItem>
					<SelectItem value="user">User</SelectItem>
					<SelectItem value="beta">Beta</SelectItem>
				</SelectContent>
			</Select>
			<Select
				defaultValue={searchParams.get("plan") ?? "all"}
				onValueChange={(value) => updateParams("plan", value)}
			>
				<SelectTrigger className="w-[130px]">
					<SelectValue placeholder="Plan" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Plans</SelectItem>
					<SelectItem value="free">Free</SelectItem>
					<SelectItem value="basic">Basic</SelectItem>
					<SelectItem value="pro">Pro</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
