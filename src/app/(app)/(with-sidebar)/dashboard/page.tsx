import { requireAuth } from "@/lib/auth/guards";
import { auth } from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardPage() {
	const session = await requireAuth();

	const handleSignOut = async () => {
		"use server";
		await auth.api.signOut({
			headers: await headers(),
		});
		redirect("/auth");
	};

	return (
		<div className="container mx-auto p-8">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<form action={handleSignOut}>
					<Button type="submit" variant="outline">
						Sign out
					</Button>
				</form>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Profile</CardTitle>
						<CardDescription>Your account information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div>
							<p className="text-sm font-medium">Name</p>
							<p className="text-sm text-muted-foreground">
								{session.user.name}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">Email</p>
							<p className="text-sm text-muted-foreground">
								{session.user.email}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">Role</p>
							<p className="text-sm text-muted-foreground">
								{session.user.role}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Plan & Credits</CardTitle>
						<CardDescription>Your subscription details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div>
							<p className="text-sm font-medium">Plan</p>
							<p className="text-sm text-muted-foreground capitalize">
								{session.user.plan}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">Credits</p>
							<p className="text-sm text-muted-foreground">
								{session.user.credits || 0}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Activity</CardTitle>
						<CardDescription>Your login history</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div>
							<p className="text-sm font-medium">First Login</p>
							<p className="text-sm text-muted-foreground">
								{session.user.firstLoginAt
									? new Date(session.user.firstLoginAt).toLocaleDateString()
									: "N/A"}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium">Last Login</p>
							<p className="text-sm text-muted-foreground">
								{session.user.lastLoginAt
									? new Date(session.user.lastLoginAt).toLocaleDateString()
									: "N/A"}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
