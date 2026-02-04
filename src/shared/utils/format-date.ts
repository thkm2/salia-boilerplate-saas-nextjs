/**
 * Calculate calendar days difference (not elapsed time)
 * Feb 1 to Feb 4 = 3 days, regardless of the time
 */
function getCalendarDaysDiff(from: Date, to: Date): number {
	const startOfFrom = new Date(from.getFullYear(), from.getMonth(), from.getDate());
	const startOfTo = new Date(to.getFullYear(), to.getMonth(), to.getDate());
	return Math.round((startOfTo.getTime() - startOfFrom.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format a date as a relative time string
 *
 * @param date - The date to format (or null for "Never")
 * @param format - "short" for compact ("5m ago") or "long" for verbose ("5 minutes ago")
 * @returns Formatted relative time string
 */
export function formatRelativeDate(
	date: Date | null,
	format: "short" | "long" = "short",
): string {
	if (!date) return "Never";

	const now = new Date();
	const d = new Date(date);
	const diffMs = now.getTime() - d.getTime();
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = getCalendarDaysDiff(d, now);
	const diffWeeks = Math.floor(diffDays / 7);
	const diffMonths = Math.floor(diffDays / 30);
	const diffYears = Math.floor(diffDays / 365);

	if (format === "short") {
		if (diffMinutes < 1) return "Just now";
		if (diffMinutes < 60) return `${diffMinutes}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays}d ago`;
		if (diffWeeks < 4) return `${diffWeeks}w ago`;
		if (diffMonths < 12) return `${diffMonths}mo ago`;
		return `${diffYears}y ago`;
	}

	// Long format
	if (diffMinutes < 1) return "Just now";
	if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
	if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
	return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}

/**
 * Format a date with both relative time and absolute timestamp
 * Used for detailed date displays (e.g., user info cards)
 */
export function formatDateWithTimestamp(date: Date | null): {
	relative: string;
	timestamp: string;
} | null {
	if (!date) return null;

	const d = new Date(date);
	const now = new Date();
	const diffDays = getCalendarDaysDiff(d, now);

	let relative: string;
	if (diffDays === 0) {
		relative = "Today";
	} else if (diffDays === 1) {
		relative = "Yesterday";
	} else if (diffDays < 7) {
		relative = `${diffDays} days ago`;
	} else if (diffDays < 30) {
		relative = `${Math.floor(diffDays / 7)} weeks ago`;
	} else {
		relative = d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
		});
	}

	const timestamp = d.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	return { relative, timestamp };
}
