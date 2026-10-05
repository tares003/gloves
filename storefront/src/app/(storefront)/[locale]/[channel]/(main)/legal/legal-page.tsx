import { type ReactNode } from "react";
import { company } from "@/config/irongrip";
import { Band, PageHeader, Prose } from "@/ui/irongrip/blocks";

/** Shared shell for legal pages. All legal copy is a DRAFT pending solicitor review. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
	return (
		<>
			<PageHeader eyebrow="Legal" title={title} />
			<Band labelledBy="legal-body">
				<Prose>
					<p
						id="legal-body"
						className="rounded-md border border-primary/50 bg-primary/10 px-4 py-3 text-sm font-semibold"
						role="note"
					>
						DRAFT — this page is a placeholder and must be reviewed by a solicitor before launch.
					</p>
					{children}
					<h2>Contact</h2>
					<p>
						{company.legalName}, {company.registeredOffice}. Email{" "}
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
