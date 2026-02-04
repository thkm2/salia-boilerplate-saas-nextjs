export default function MessagesPage() {
	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-2xl font-bold">Messages</h1>
				<p className="text-muted-foreground">Your conversations</p>
			</header>

			<div className="space-y-2">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer"
					>
						<div className="w-12 h-12 rounded-full bg-muted" />
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between">
								<p className="font-medium">Contact {i + 1}</p>
								<span className="text-xs text-muted-foreground">
									{i === 0 ? "Now" : `${i}h`}
								</span>
							</div>
							<p className="text-sm text-muted-foreground truncate">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit...
							</p>
						</div>
						{i < 2 && (
							<div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
						)}
					</div>
				))}
			</div>
		</div>
	);
}
