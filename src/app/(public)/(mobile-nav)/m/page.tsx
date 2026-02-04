export default function MobileHomePage() {
	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-2xl font-bold">Home</h1>
				<p className="text-muted-foreground">Welcome back</p>
			</header>

			<div className="space-y-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<article
						key={i}
						className="rounded-xl border bg-card p-4 space-y-3"
					>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-muted" />
							<div>
								<p className="font-medium">User {i + 1}</p>
								<p className="text-xs text-muted-foreground">2h ago</p>
							</div>
						</div>
						<p className="text-sm">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua.
						</p>
					</article>
				))}
			</div>
		</div>
	);
}
