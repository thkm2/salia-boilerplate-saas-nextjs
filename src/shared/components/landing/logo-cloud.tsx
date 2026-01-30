interface LogoCloudProps {
	title: string;
	logos: { name: string }[];
}

export function LogoCloud({ title, logos }: LogoCloudProps) {
	return (
		<section className="py-12 lg:py-16">
			<div className="mx-auto max-w-6xl px-6 lg:px-12">
				<p className="text-center text-sm font-medium text-muted-foreground mb-8">
					{title}
				</p>
				<div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
					{logos.map((logo) => (
						<div
							key={logo.name}
							className="text-lg font-semibold text-muted-foreground/40 select-none"
						>
							{logo.name}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
