import { Button } from "@/shared/components/ui/button";

export default function ProfilePage() {
	return (
		<div className="space-y-6">
			<header className="text-center space-y-4">
				<div className="w-24 h-24 rounded-full bg-muted mx-auto" />
				<div>
					<h1 className="text-2xl font-bold">John Doe</h1>
					<p className="text-muted-foreground">@johndoe</p>
				</div>
				<Button variant="outline" size="sm">
					Edit Profile
				</Button>
			</header>

			<div className="grid grid-cols-3 gap-4 text-center py-4 border-y">
				<div>
					<p className="text-2xl font-bold">128</p>
					<p className="text-xs text-muted-foreground">Posts</p>
				</div>
				<div>
					<p className="text-2xl font-bold">1.2k</p>
					<p className="text-xs text-muted-foreground">Followers</p>
				</div>
				<div>
					<p className="text-2xl font-bold">456</p>
					<p className="text-xs text-muted-foreground">Following</p>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="font-semibold">Recent Activity</h2>
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="rounded-xl border bg-card p-4">
						<p className="text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						</p>
						<p className="text-xs text-muted-foreground mt-2">
							{i + 1} day{i > 0 ? "s" : ""} ago
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
