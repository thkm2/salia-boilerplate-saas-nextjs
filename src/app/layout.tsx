import "./globals.css";
import { Toaster } from "@/shared/components/ui/sonner";
import { ThemeProvider } from "@/shared/components/ui/theme-provider";
import { PostHogProvider } from "@/shared/components/posthog-provider";
import { createRootMetadata } from "@/lib/seo";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/shared/components/json-ld";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = createRootMetadata();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn("scroll-smooth font-sans", inter.variable)}
		>
			<head>
				<OrganizationJsonLd />
				<WebsiteJsonLd />
			</head>
			<body>
				<PostHogProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="light"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</PostHogProvider>
			</body>
		</html>
	);
}
