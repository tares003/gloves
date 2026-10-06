import { type Metadata } from "next";
import { PHOTOS } from "@/config/photos";
import { Band, Eyebrow, InfoCard, PageHeader, Steps } from "@/ui/irongrip/blocks";
import { PhotoStrip } from "@/ui/irongrip/photo-strip";
import { TradeForm } from "@/ui/irongrip/forms/trade-form";

export const metadata: Metadata = {
	title: { absolute: "Trade Glove Supplier UK — Trade Accounts | IronGrip" },
	description: "Volume pricing and mixed-size orders for UK businesses. Request a trade account.",
};

const BENEFITS = [
	{ title: "Volume pricing", text: "Better prices as your order grows, with no huge minimum." },
	{ title: "Mixed-size orders", text: "Order the sizes your team actually wears." },
	{ title: "Regular deliveries", text: "Set a schedule and we'll keep you stocked." },
	{
		title: "Samples",
		text: "Try before you commit. Available to approved trade accounts while stocks last.",
	},
];

export default function TradePage() {
	return (
		<>
			<PageHeader
				eyebrow="Trade"
				title="Trade accounts for UK businesses."
				intro="Volume pricing, mixed sizes and a supplier who actually replies."
			/>

			<Band labelledBy="trade-benefits">
				<h2 id="trade-benefits" className="text-h2">
					What you get
				</h2>
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{BENEFITS.map((b) => (
						<InfoCard key={b.title} title={b.title}>
							<p>{b.text}</p>
						</InfoCard>
					))}
				</div>
				<PhotoStrip className="mt-10" photos={[PHOTOS.warehouse, PHOTOS.plumbing, PHOTOS.construction]} />
			</Band>

			<Band labelledBy="trade-how" tone="muted">
				<Eyebrow>How it works</Eyebrow>
				<h2 id="trade-how" className="mt-3 text-h2">
					Three steps to a trade account
				</h2>
				<div className="mt-8">
					<Steps
						steps={[
							{ title: "Tell us about you", text: "Tell us about your business and what you use." },
							{ title: "Get a quote", text: "We send a quote and, where suitable, samples." },
							{ title: "Order and relax", text: "Order online or by message, and we deliver." },
						]}
					/>
				</div>
			</Band>

			<Band id="enquiry" labelledBy="trade-form-heading">
				<div className="mx-auto max-w-3xl">
					<h2 id="trade-form-heading" className="text-h2">
						Request a trade account
					</h2>
					<p className="mt-2 text-muted-foreground">We reply within one working day.</p>
					<div className="mt-8 rounded-card border border-border bg-card p-6 md:p-8">
						<TradeForm />
					</div>
				</div>
			</Band>
		</>
	);
}
