import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserDetailHeaderProps {
	name: string;
	email: string;
	image: string | null;
}

export function UserDetailHeader({ name, email, image }: UserDetailHeaderProps) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="flex items-center gap-4">
			<Button variant="ghost" size="icon-sm" asChild>
				<Link href="/admin/users">
					<ArrowLeft className="h-4 w-4" />
				</Link>
			</Button>
			<Avatar size="lg">
				<AvatarImage src={image ?? undefined} alt={name} />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
				<p className="text-sm text-muted-foreground">{email}</p>
			</div>
		</div>
	);
}
