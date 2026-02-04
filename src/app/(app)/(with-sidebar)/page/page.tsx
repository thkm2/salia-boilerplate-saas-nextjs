import { List } from "lucide-react";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function PagePage() {
	return (
		<div className="space-y-6">
			<PageHeader
				icon={List}
				title="Page"
				description="Your content goes here"
			/>

			{/* Content */}
			<div>
				<p className="text-muted-foreground">This is a placeholder page.</p>
			</div>
		</div>
	);
}
