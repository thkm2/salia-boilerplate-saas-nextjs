"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface CopyButtonProps {
	value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-5 w-5 shrink-0 text-muted-foreground hover:text-foreground"
			onClick={handleCopy}
		>
			<span className="relative flex h-3 w-3 items-center justify-center">
				<Copy
					className={`h-3 w-3 absolute transition-all duration-200 ${
						copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
					}`}
				/>
				<Check
					className={`h-3 w-3 absolute text-emerald-500 transition-all duration-200 ${
						copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
					}`}
				/>
			</span>
			<span className="sr-only">Copy to clipboard</span>
		</Button>
	);
}
