import { type Metadata } from "next";
import { Band, PageHeader, Prose } from "@/ui/irongrip/blocks";

export const metadata: Metadata = {
	title: { absolute: "Glove Standards Explained — EN ISO 374, EN 455 | IronGrip" },
	description: "What the codes on a glove box mean, in plain English.",
};

const STANDARDS = [
	{ code: "EN ISO 21420", text: "General requirements for protective gloves: fit, comfort, sizing and labelling." },
	{
		code: "EN ISO 374-1",
		text: "Protection against chemicals. Gloves are rated Type A, B or C depending on how many test chemicals they resist and for how long. The letters on the box show which chemicals were tested.",
	},
	{
		code: "EN ISO 374-5",
		text: "Protection against micro-organisms (bacteria and fungi, and viruses where marked “VIRUS”).",
	},
	{ code: "EN 455", text: "Standards for medical gloves. IronGrip does not currently sell gloves for medical use." },
	{
		code: "Food contact",
		text: "Gloves for food handling must meet UK food-contact rules and carry the glass-and-fork symbol.",
	},
	{
		code: "AQL",
		text: "Acceptable Quality Level: a measure of how many gloves in a batch may have pinholes. Lower is better.",
	},
	{
		code: "Thickness",
		text: "Measured in millimetres at the fingertip and palm. Thicker usually means tougher; thinner means more feel.",
	},
];

export default function QualityPage() {
	return (
		<>
			<PageHeader
				eyebrow="Quality & standards"
				title="Standards, explained in plain English."
				intro="Disposable gloves come with a lot of codes on the box. Here's what they mean, so you can pick the right glove for the job."
			/>
			<Band labelledBy="standards-list">
				<h2 id="standards-list" className="sr-only">
					Glove standards
				</h2>
				<dl className="mx-auto grid max-w-4xl gap-4">
					{STANDARDS.map((s) => (
						<div key={s.code} className="grid gap-2 rounded-card border border-border bg-card p-6 md:grid-cols-[12rem_1fr]">
							<dt className="font-[family-name:var(--font-display)] text-h3 uppercase text-foreground">{s.code}</dt>
							<dd className="text-muted-foreground">{s.text}</dd>
						</div>
					))}
				</dl>
			</Band>
			<Band labelledBy="commitment" tone="muted">
				<Prose>
					<h2 id="commitment">Our commitment</h2>
					<p>
						Every IronGrip product page will list its standards, thickness and pack details, and we&apos;ll share
						certificates and declarations on request.
					</p>
				</Prose>
			</Band>
		</>
	);
}
