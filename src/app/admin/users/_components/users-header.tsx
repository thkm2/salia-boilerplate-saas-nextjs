export function UsersHeader({ total }: { total: number }) {
	return (
		<div>
			<h1 className="text-3xl font-semibold tracking-tight">Users</h1>
			<p className="text-muted-foreground mt-1">
				{total.toLocaleString()} registered user{total !== 1 ? "s" : ""}
			</p>
		</div>
	);
}
