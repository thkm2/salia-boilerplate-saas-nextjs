import { Input } from "@/shared/components/ui/input";

export default function SearchPage() {
	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-2xl font-bold">Search</h1>
				<p className="text-muted-foreground">Find what you&apos;re looking for</p>
			</header>

			<Input placeholder="Search..." className="w-full" />

			<div className="space-y-4">
				<h2 className="font-semibold text-sm text-muted-foreground">
					Recent searches
				</h2>
				{["React hooks", "Tailwind CSS", "Next.js App Router"].map((term) => (
					<div
						key={term}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
					>
						<div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
							#
						</div>
						<span>{term}</span>
					</div>
				))}
			</div>
		</div>
	);
}
