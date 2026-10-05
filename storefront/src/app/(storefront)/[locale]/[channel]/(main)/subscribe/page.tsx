import { type Metadata } from "next";
import { Band, Eyebrow, InfoCard, PageHeader, Steps } from "@/ui/irongrip/blocks";
import { WaitlistForm } from "@/ui/irongrip/forms/waitlist-form";

export const metadata: Metadata = {
	title: { absolute: "Glove Subscription UK — Never Run Out | IronGrip" },
	description: "Regular glove deliveries at subscriber prices. Change, skip or cancel any time. Join the waitlist.",
};

const PLANS = [
	{ title: "Solo", text: "For one-person businesses and home users." },
	{ title: "Crew", text: "For small teams, with mixed sizes in one delivery." },
	{ title: "Workshop", text: "For larger teams, with trade pricing and invoicing." },
];

export default function SubscribePage() {
	return (
		<>
			<PageHeader
				eyebrow="Subscription"
				title="Never run out of gloves again."
				intro="A regular delivery of the gloves you use, at subscriber prices. Launching soon — join the waitlist for founding-member pricing."
			/>

			<Band labelledBy="sub-how">
				<Eyebrow>How it will work</Eyebrow>
				<h2 id="sub-how" className="mt-3 text-h2">
					Set it once. Stay stocked.
				</h2>
				<div className="mt-8">
					<Steps
						steps={[
							{ title: "Pick your gloves", text: "Choose your gloves, sizes and quantities." },
							{ title: "Set your schedule", text: "Every 2, 4, 6 or 8 weeks." },
							{ title: "Stay in control", text: "Change, skip or cancel online at any time. No contracts." },
						]}
					/>
				</div>
			</Band>

			<Band labelledBy="sub-plans" tone="muted">
				<h2 id="sub-plans" className="text-h2">
					Plans
				</h2>
				<p className="mt-2 text-muted-foreground">Indicative — final pricing at launch.</p>
				<div className="mt-8 grid gap-6 md:grid-cols-3">
					{PLANS.map((plan) => (
						<InfoCard key={plan.title} title={plan.title}>
							<p>{plan.text}</p>
						</InfoCard>
					))}
				</div>
			</Band>

			<Band id="waitlist" labelledBy="waitlist-heading">
				<div className="mx-auto max-w-3xl">
					<h2 id="waitlist-heading" className="text-h2">
						Join the waitlist
					</h2>
					<div className="mt-8 rounded-card border border-border bg-card p-6 md:p-8">
						<WaitlistForm />
					</div>
				</div>
			</Band>
		</>
	);
}
