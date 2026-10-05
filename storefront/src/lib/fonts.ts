import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

/**
 * IronGrip display face — Barlow Condensed (SIL OFL), self-hosted so builds never depend on
 * Google Fonts and no visitor data goes to a third party.
 */
const barlowCondensed = localFont({
	src: [
		{ path: "../fonts/barlow-condensed-latin-600-normal.woff2", weight: "600", style: "normal" },
		{ path: "../fonts/barlow-condensed-latin-700-normal.woff2", weight: "700", style: "normal" },
		{ path: "../fonts/barlow-condensed-latin-800-normal.woff2", weight: "800", style: "normal" },
	],
	variable: "--font-barlow-condensed",
	display: "swap",
	adjustFontFallback: "Arial",
});

export type RootHtmlFontProps = {
	lang: string;
	className: string;
	/** Dismiss island may set attrs/styles on `<html>` after click. */
	suppressHydrationWarning: true;
};

/** Shared `<html>` font classes for browse layouts. */
export function getRootHtmlFontProps(htmlLang: string): RootHtmlFontProps {
	return {
		lang: htmlLang,
		className: cn(GeistSans.variable, barlowCondensed.variable, "min-h-dvh"),
		suppressHydrationWarning: true,
	};
}
