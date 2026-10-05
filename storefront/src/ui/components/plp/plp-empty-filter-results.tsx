"use client";

import { useTranslations } from "next-intl";
import { CtaLink } from "@/ui/irongrip/blocks";

interface PlpEmptyFilterResultsProps {
	onClear: () => void;
}

/**
 * Empty listing. IronGrip launches with no products, so the primary message is the
 * "range is on its way" state with a waitlist CTA; clearing filters stays available.
 */
export function PlpEmptyFilterResults({ onClear }: PlpEmptyFilterResultsProps) {
	const t = useTranslations("plp");

	return (
		<div className="mx-auto max-w-xl py-12 text-center">
			<h2 className="text-h2">The range is on its way.</h2>
			<p className="mt-4 text-muted-foreground">
				We&apos;re finalising our first gloves now. Leave your email and we&apos;ll tell you the moment they&apos;re
				available, with launch pricing for early sign-ups.
			</p>
			<div className="mt-8">
				<CtaLink href="/subscribe">Notify me</CtaLink>
			</div>
			<button
				type="button"
				onClick={onClear}
				className="mt-6 text-sm font-medium text-muted-foreground underline underline-offset-4"
			>
				{t("clearAll")} filters
			</button>
		</div>
	);
}
