import { FileText, HardDrive } from "lucide-react";
import { PageHeader } from "@/shared/components/ui/page-header";
import { getUserFiles } from "@/shared/actions/files";
import { FileList } from "./_components/file-list";

function formatTotalSize(bytes: number): string {
	if (bytes === 0) return "0 B";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default async function FilesPage() {
	const result = await getUserFiles();
	const files = result.success ? result.files : [];

	// Calculate storage stats
	const totalSize = files.reduce((acc, file) => acc + file.size, 0);
	const fileCount = files.length;

	return (
		<div className="space-y-8">
			<PageHeader
				icon={FileText}
				title="Files"
				description="Upload and manage your files"
				action={
					fileCount > 0 ? (
						<div className="flex items-center gap-2 rounded-lg bg-foreground/[0.03] px-3 py-2 text-sm">
							<HardDrive className="size-4 text-muted-foreground" />
							<span className="text-muted-foreground">
								{formatTotalSize(totalSize)} used
							</span>
						</div>
					) : null
				}
			/>
			<FileList files={files} />
		</div>
	);
}
