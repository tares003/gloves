import { type ReactNode } from "react";
import { company } from "@/config/irongrip";
import { Band, PageHeader, Prose } from "@/ui/irongrip/blocks";

/** Shared shell for legal pages. Legal copy is pending solicitor review (docs/missing-details.md). */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
	return (
		<>
			<PageHeader eyebrow="Legal" title={title} />
			<Band labelledBy="legal-body">
				<Prose>
					<div id="legal-body">{children}</div>
					<h2>Contact</h2>
					<p>
						{[company.legalName ?? "IronGrip", company.registeredOffice].filter(Boolean).join(", ")}. Email{" "}
						<a className="underline" href={`mailto:${company.email}`}>
							{company.email}
						</a>
						.
					</p>
				</Prose>
			</Band>
		</>
	);
}
