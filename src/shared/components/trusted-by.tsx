import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Star } from "lucide-react";

interface AvatarData {
	src: string;
	alt: string;
	fallback: string;
}

interface TrustedByProps {
	avatars?: AvatarData[];
	rating?: number;
	text?: string;
	showStars?: boolean;
}

const defaultAvatars: AvatarData[] = [
	{
		src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50",
		alt: "User Avatar",
		fallback: "U",
	},
	{
		src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50",
		alt: "User Avatar",
		fallback: "U",
	},
	{
		src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50",
		alt: "User Avatar",
		fallback: "U",
	},
];

export function TrustedBy({
	avatars = defaultAvatars,
	rating = 5,
	text = "Trusted by our customers",
	showStars = true,
}: TrustedByProps) {
	const stars = Array.from({ length: Math.min(5, Math.max(0, rating)) });

	return (
		<div className="mt-10 max-md:w-2/3 mx-auto flex items-center justify-center gap-2">
			<div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
				{avatars.map((avatar, index) => (
					<Avatar key={index}>
						<AvatarImage src={avatar.src} alt={avatar.alt} />
						<AvatarFallback>{avatar.fallback}</AvatarFallback>
					</Avatar>
				))}
			</div>
			<div className="flex flex-col gap-1">
				{showStars && (
					<div className="flex items-center gap-1">
						{stars.map((_, index) => (
							<Star
								key={index}
								size={12}
								fill="#facc15"
								className="text-yellow-400"
							/>
						))}
					</div>
				)}
				<p className="text-muted-foreground text-sm text-start">{text}</p>
			</div>
		</div>
	);
}
