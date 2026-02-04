import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { TestCreditButton } from "./_components/test-credit-button";

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<PageHeader
				icon={LayoutDashboard}
				title="Dashboard"
				description="Overview of your activity"
			/>

			{/* Content */}
			<div>
				<TestCreditButton />
			</div>
		</div>
	);
}
