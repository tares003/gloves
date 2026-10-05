import Image from "next/image";
import { Car, Home, Scissors, SprayCan, UtensilsCrossed } from "lucide-react";
import { type Metadata } from "next";
import { Band, CtaLink, Eyebrow, InfoCard } from "@/ui/irongrip/blocks";

export const metadata: Metadata = {
	title: { absolute: "IronGrip — Premium Nitrile Gloves for UK Trades & Businesses" },
	description:
		"Heavy-duty and everyday nitrile gloves for workshops, detailers, cleaners and salons. Trade pricing and a glove subscription. Launching soon.",
};

const AUDIENCES = [
	{ title: "Automotive", text: "Mechanics, detailers and body shops", Icon: Car },
	{ title: "Cleaning", text: "Contract and commercial cleaners", Icon: SprayCan },
	{ title: "Beauty & tattoo", text: "Salons, barbers and studios", Icon: Scissors },
	{ title: "Hospitality", text: "Kitchens, cafés and food prep", Icon: UtensilsCrossed },
	{ title: "Home & DIY", text: "Projects, car care and the garden", Icon: Home },
];

const FAMILIES = [
	{
		title: "Heavy-duty textured nitrile",
		text: "Thicker, textured gloves for oily, greasy and demanding jobs. Built to last through the job, not just the first five minutes.",
		href: "/categories/heavy-duty",
	},
	{
		title: "Everyday nitrile",
		text: "Comfortable, powder-free gloves in black, blue and colours for daily tasks.",
		href: "/categories/everyday",
	},
	{
		title: "Chemical-resistant nitrile",
		text: "For cleaning products and chemical handling. Protection ratings published per product.",
		href: "/categories/chemical-resistant",
	},
	{
		title: "Food-safe gloves",
		text: "For kitchens and food prep, with food-contact documentation per product.",
		href: "/categories/food-safe",
	},
];

const REASONS = [
	{
		title: "Trade pricing without the minimums",
		text: "Fair prices for a one-person business, not just for buyers of whole pallets.",
		icon: "/brand/icons/heavy-duty.png",
	},
	{
		title: "Never run out",
		text: "Set up a regular delivery and change, pause or cancel whenever you like. (Launching soon.)",
		icon: "/brand/icons/superior-grip.png",
	},
	{
		title: "Straight answers on standards",
		text: "Every product page will show its standards, thickness and pack size in plain English — and documents on request.",
		icon: "/brand/icons/built-for-trades.png",
	},
	{
		title: "A UK team you can actually talk to",
		text: "Real people answering the phone and WhatsApp, not a ticket queue.",
		icon: "/brand/icons/uk-brand.png",
	},
];

export default function HomePage() {
	return (
		<>
			{/* Hero */}
			<section aria-labelledby="home-hero-heading" className="relative overflow-hidden bg-foreground text-background">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-[url('/brand/textures/industrial.png')] bg-cover bg-center opacity-10"
				/>
				<div className="container-content relative grid items-center gap-10 py-section-md lg:grid-cols-2">
					<div>
						<Eyebrow inverse>Won&apos;t slip. Won&apos;t quit.</Eyebrow>
						<h1 id="home-hero-heading" className="mt-4 text-display">
							Gloves that hold up to real work.
						</h1>
						<p className="mt-6 max-w-xl text-lead text-inverse">
							Premium nitrile gloves for workshops, detailers, cleaners and trades across the UK. Tough enough
							for the job, priced for the trade.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<CtaLink href="/subscribe">Register for early access</CtaLink>
							<CtaLink href="/trade" variant="inverse">
								Open a trade account
							</CtaLink>
						</div>
					</div>
					<div className="flex justify-center lg:justify-end">
						<Image
							src="/brand/logo-main.png"
							alt="IronGrip logo"
							width={797}
							height={455}
							priority
							sizes="(min-width: 1024px) 560px, 90vw"
							className="h-auto w-full max-w-[560px]"
						/>
					</div>
				</div>
			</section>

			{/* Who we supply */}
			<Band labelledBy="audiences-heading" tone="card" className="py-12">
				<h2 id="audiences-heading" className="sr-only">
					Who we supply
				</h2>
				<ul className="grid grid-cols-2 gap-6 md:grid-cols-5">
					{AUDIENCES.map(({ title, text, Icon }) => (
						<li key={title} className="flex flex-col items-center text-center">
							<span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-primary">
								<Icon aria-hidden="true" className="h-6 w-6" />
							</span>
							<span className="mt-3 font-semibold">{title}</span>
							<span className="mt-1 text-sm text-muted-foreground">{text}</span>
						</li>
					))}
				</ul>
			</Band>

			{/* Product families */}
			<Band labelledBy="families-heading">
				<Eyebrow>The range</Eyebrow>
				<h2 id="families-heading" className="mt-3 max-w-2xl text-h2">
					One supplier for every glove you go through.
				</h2>
				<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{FAMILIES.map((family) => (
						<InfoCard key={family.title} title={family.title} className="flex flex-col">
							<p>{family.text}</p>
						</InfoCard>
					))}
				</div>
				<div className="mt-10">
					<CtaLink href="/products" variant="outline">
						View the range
					</CtaLink>
				</div>
			</Band>

			{/* Why IronGrip */}
			<Band labelledBy="why-heading" tone="muted">
				<Eyebrow>Why IronGrip</Eyebrow>
				<h2 id="why-heading" className="mt-3 max-w-2xl text-h2">
					Why businesses switch to IronGrip.
				</h2>
				<ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{REASONS.map((reason) => (
						<li key={reason.title} className="rounded-card border border-border bg-card p-6 shadow-card">
							<Image src={reason.icon} alt="" width={108} height={155} className="h-20 w-auto" />
							<h3 className="mt-4 text-h3">{reason.title}</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.text}</p>
						</li>
					))}
				</ul>
			</Band>

			{/* Subscription + trade teasers */}
			<Band labelledBy="teasers-heading">
				<h2 id="teasers-heading" className="sr-only">
					Subscription and trade accounts
				</h2>
				<div className="grid gap-6 lg:grid-cols-2">
					<div className="relative overflow-hidden rounded-card bg-foreground p-8 text-background md:p-10">
						<div
							aria-hidden="true"
							className="pointer-events-none absolute -right-10 -top-6 h-48 w-72 bg-[url('/brand/textures/splatter.png')] bg-contain bg-no-repeat opacity-30"
						/>
						<h3 className="relative text-h2 uppercase">Gloves on autopilot.</h3>
						<p className="relative mt-4 max-w-md text-inverse">
							Tell us what you use each month. We&apos;ll deliver before you run out, with subscriber pricing and
							free delivery. Change sizes, skip a month or cancel in two clicks.
						</p>
						<div className="relative mt-8">
							<CtaLink href="/subscribe">Join the waitlist</CtaLink>
						</div>
					</div>
					<div className="rounded-card border border-border bg-card p-8 md:p-10">
						<h3 className="text-h2 uppercase">Buying for a workshop, salon or cleaning team?</h3>
						<p className="mt-4 max-w-md text-muted-foreground">
							Trade accounts get volume pricing, mixed-size orders and invoices for your accounts. Tell us what
							you use and we&apos;ll come back with a quote.
						</p>
						<div className="mt-8">
							<CtaLink href="/trade" variant="outline">
								Open a trade account
							</CtaLink>
						</div>
					</div>
				</div>
			</Band>

			{/* Closing CTA */}
			<Band labelledBy="closing-heading" tone="inverse" className="text-center">
				<h2 id="closing-heading" className="text-h1">
					Be first when the range lands.
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-lead text-inverse">
					Register now for early-access pricing and free samples for trade accounts (while stock lasts).
				</p>
				<div className="mt-8">
					<CtaLink href="/subscribe">Register for early access</CtaLink>
				</div>
			</Band>
		</>
	);
}
