import { List } from "lucide-react";

export default function PagePage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
					<List className="h-5 w-5 text-foreground/70" />
				</div>
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Page</h1>
					<p className="text-sm text-muted-foreground">
						Your content goes here
					</p>
				</div>
			</div>

			{/* Content */}
			<div>
				<p className="text-muted-foreground">This is a placeholder page.</p>
			</div>
		</div>
	);
}
