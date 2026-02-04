interface PageHeaderProps {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
	action?: React.ReactNode;
}

export function PageHeader({
	icon: Icon,
	title,
	description,
	action,
}: PageHeaderProps) {
	return (
		<div className="flex items-start justify-between">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 ring-1 ring-foreground/10">
					<Icon className="h-5 w-5 text-foreground/70" />
				</div>
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
			</div>
			{action}
		</div>
	);
}
