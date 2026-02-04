import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

export default function CreatePage() {
	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-2xl font-bold">Create</h1>
				<p className="text-muted-foreground">Share something new</p>
			</header>

			<div className="space-y-4">
				<Textarea
					placeholder="What's on your mind?"
					className="min-h-[150px] resize-none"
				/>
				<div className="flex justify-end">
					<Button>Post</Button>
				</div>
			</div>
		</div>
	);
}
