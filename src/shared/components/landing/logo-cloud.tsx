import { Separator } from "@/shared/components/ui/separator";

interface LogoCloudProps {
	title: string;
	logos: { name: string }[];
}

export function LogoCloud({ title, logos }: LogoCloudProps) {
	return (
		<section className="pb-20 lg:pb-28">
			<div className="mx-auto max-w-6xl px-6 lg:px-12">
				<p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
					{title}
				</p>
				<div className="flex items-center justify-center">
					<div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-4">
						{logos.map((logo, index) => (
							<div key={logo.name} className="flex items-center">
								<span className="px-6 text-sm font-semibold tracking-wide text-muted-foreground/30 select-none sm:text-base">
									{logo.name}
								</span>
								{index < logos.length - 1 && (
									<Separator
										orientation="vertical"
										className="hidden h-4 sm:block"
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
