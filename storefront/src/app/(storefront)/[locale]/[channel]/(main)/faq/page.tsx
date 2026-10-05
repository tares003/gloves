import { type Metadata } from "next";
import { Band, CtaLink, PageHeader } from "@/ui/irongrip/blocks";

export const metadata: Metadata = {
	title: "FAQ",
	description: "Answers to common questions about IronGrip gloves, trade accounts, delivery and the subscription.",
};

const FAQS = [
	{
		q: "When can I order?",
		a: "Our first range is launching soon. Register for early access and we'll email you as soon as it's live.",
	},
	{
		q: "Do you supply businesses?",
		a: "Yes. Trade accounts get volume pricing, mixed-size orders and VAT invoices. Request one on our Trade page.",
	},
	{
		q: "Do you deliver across the UK?",
		a: "Yes, we'll deliver to UK mainland addresses. Delivery prices and timescales will be shown at checkout.",
	},
	{
		q: "How do I choose the right size?",
		a: "Measure around your palm just below the knuckles and check the size guide on each product page. Trade customers can request samples.",
	},
	{
		q: "Are your gloves powder-free and latex-free?",
		a: "Our nitrile gloves are powder-free and made without natural rubber latex. Check each product page for details.",
	},
	{
		q: "Can I use your gloves with chemicals?",
		a: "Only gloves with an EN ISO 374 rating for the specific chemical. Each product page lists its ratings. If in doubt, ask us.",
	},
	{ q: "Are your gloves food safe?", a: "Only products marked as food safe, which carry food-contact documentation." },
	{
		q: "Can I return gloves?",
		a: "Unopened boxes can be returned within 14 days. Opened boxes can't be returned for hygiene reasons unless faulty. See our Delivery & Returns page.",
	},
	{
		q: "How will the subscription work?",
		a: "Choose your gloves and how often you want them. You can change, skip or cancel online at any time.",
	},
];

const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: FAQS.map((f) => ({
		"@type": "Question",
		name: f.q,
		acceptedAnswer: { "@type": "Answer", text: f.a },
	})),
};

export default function FaqPage() {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
			/>
			<PageHeader eyebrow="Help" title="Frequently asked questions" />
			<Band labelledBy="faq-list">
				<h2 id="faq-list" className="sr-only">
					Questions and answers
				</h2>
				<div className="mx-auto max-w-[var(--container-prose)] divide-y divide-border rounded-card border border-border bg-card">
					{FAQS.map((f) => (
						<details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring">
								{f.q}
								<span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
									+
								</span>
							</summary>
							<p className="mt-3 text-muted-foreground">{f.a}</p>
						</details>
					))}
				</div>
				<div className="mt-10 text-center">
					<p className="text-muted-foreground">Still got a question?</p>
					<div className="mt-4">
						<CtaLink href="/contact">Contact us</CtaLink>
					</div>
				</div>
			</Band>
		</>
	);
}
