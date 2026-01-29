import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { parseFeatureFlags } from "@/lib/auth/types";

interface UserInfoCardProps {
	user: {
		id: string;
		email: string;
		role: string;
		plan: string;
		credits: number;
		featureFlags: string;
		firstLoginAt: Date | null;
		lastLoginAt: Date | null;
	};
}

export function UserInfoCard({ user }: UserInfoCardProps) {
	const flags = parseFeatureFlags(user.featureFlags);
	const flagKeys = Object.keys(flags).filter((k) => flags[k]);

	return (
		<Card className="min-w-0">
			<CardHeader>
				<CardTitle>User Information</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<InfoRow label="ID" value={user.id} />
				<InfoRow label="Email" value={user.email} />
				<InfoRow label="Role" value={<Badge variant={user.role === "admin" ? "default" : user.role === "beta" ? "secondary" : "outline"}>{user.role}</Badge>} />
				<InfoRow label="Plan" value={<Badge variant={user.plan === "pro" || user.plan === "admin" ? "default" : user.plan === "basic" ? "secondary" : "outline"}>{user.plan}</Badge>} />
				<InfoRow label="Credits" value={user.credits.toLocaleString()} />
				<InfoRow
					label="Feature Flags"
					value={
						flagKeys.length > 0 ? (
							<div className="flex flex-wrap gap-1">
								{flagKeys.map((flag) => (
									<Badge key={flag} variant="secondary">
										{flag}
									</Badge>
								))}
							</div>
						) : (
							"None"
						)
					}
				/>
				<InfoRow
					label="First Login"
					value={
						user.firstLoginAt
							? new Date(user.firstLoginAt).toLocaleString()
							: "Never"
					}
				/>
				<InfoRow
					label="Last Login"
					value={
						user.lastLoginAt
							? new Date(user.lastLoginAt).toLocaleString()
							: "Never"
					}
				/>
			</CardContent>
		</Card>
	);
}

function InfoRow({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="flex items-start justify-between gap-4">
			<span className="text-sm text-muted-foreground shrink-0">{label}</span>
			<span className="text-sm font-medium text-right min-w-0 break-all">{value}</span>
		</div>
	);
}
