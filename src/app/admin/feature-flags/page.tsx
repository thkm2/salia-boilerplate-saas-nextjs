import { getFeatureFlags, getFeatureFlagsStats } from "./data";
import { FeatureFlagsHeader } from "./_components/feature-flags-header";
import { FeatureFlagsTable } from "./_components/feature-flags-table";
import { Flag } from "lucide-react";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
} from "@/shared/components/ui/empty";

const FeatureFlagsPage = async () => {
	const [flags, stats] = await Promise.all([
		getFeatureFlags(),
		getFeatureFlagsStats(),
	]);

	return (
		<div className="space-y-6 pb-8">
			<FeatureFlagsHeader total={flags.length} stats={stats} />

			{flags.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Flag className="h-5 w-5" />
						</EmptyMedia>
						<EmptyTitle>No feature flags yet</EmptyTitle>
						<EmptyDescription>
							Create your first feature flag to start controlling feature access across your application.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : (
				<FeatureFlagsTable flags={flags} />
			)}
		</div>
	);
};

export default FeatureFlagsPage;
