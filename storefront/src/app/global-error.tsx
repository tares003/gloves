"use client";

import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ErrorContent, type ErrorContentProps } from "@/ui/components/error-content";

/**
 * Catches errors thrown in the root layouts themselves. Because it replaces the crashed
 * root, it must render its own `<html>`/`<body>`.
 *
 * No GeistMono here: fonts imported in this file are preloaded on every page, and the error page
 * doesn't need a monospace face (checkout loads its own).
 */
export default function GlobalError({ error, reset }: ErrorContentProps) {
	return (
		<html lang="en" className={`${GeistSans.variable} min-h-dvh`}>
			<body className="min-h-dvh font-sans">
				<ErrorContent error={error} reset={reset} />
			</body>
		</html>
	);
}
