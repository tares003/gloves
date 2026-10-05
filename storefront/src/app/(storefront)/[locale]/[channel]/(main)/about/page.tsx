import { type Metadata } from "next";
import { Band, CtaLink, InfoCard, PageHeader, Prose } from "@/ui/irongrip/blocks";

export const metadata: Metadata = {
	title: "About IronGrip",
	description: "UK supplier of premium gloves for people who work with their hands.",
};

const VALUES = [
	{ title: "Straight talk", text: "Clear specs, clear prices, no hype." },
	{ title: "Built for the job", text: "We choose gloves for how they perform, not how they look on a shelf." },
	{ title: "Small businesses first", text: "If you're a one-person business, you matter as much as a big account." },
];

export default function AboutPage() {
	return (
		<>
			<PageHeader eyebrow="About us" title="Built in the UK, for people who work with their hands." />
			<Band labelledBy="about-story">
				<Prose>
					<h2 id="about-story" className="sr-only">
						Our story
					</h2>
					<p>
						IronGrip was started by two UK founders who got tired of gloves that split halfway through a job and
						suppliers that only cared about pallet-sized orders.
					</p>
					<p>
						We&apos;re building something simpler: premium gloves, fair trade pricing for businesses of every size,
						and a subscription that keeps you stocked without thinking about it.
					</p>
					<p>We work directly with established manufacturers and check the paperwork, so you don&apos;t have to.</p>
				</Prose>
			</Band>
			<Band labelledBy="about-values" tone="muted">
				<h2 id="about-values" className="text-h2">
					What we stand for
				</h2>
				<div className="mt-8 grid gap-6 md:grid-cols-3">
					{VALUES.map((v) => (
						<InfoCard key={v.title} title={v.title}>
							<p>{v.text}</p>
						</InfoCard>
					))}
				</div>
				<div className="mt-10 flex flex-wrap gap-3">
					<CtaLink href="/trade">Open a trade account</CtaLink>
					<CtaLink href="/contact" variant="outline">
						Talk to us
					</CtaLink>
				</div>
			</Band>
		</>
	);
}
