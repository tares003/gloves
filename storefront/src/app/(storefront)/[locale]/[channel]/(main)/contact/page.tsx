import { type Metadata } from "next";
import { company } from "@/config/irongrip";
import { Band, PageHeader } from "@/ui/irongrip/blocks";
import { ContactForm } from "@/ui/irongrip/forms/contact-form";

export const metadata: Metadata = {
	title: "Contact",
	description: "Questions about gloves, trade accounts or the subscription? Get in touch with IronGrip.",
};

export default function ContactPage() {
	return (
		<>
			<PageHeader
				eyebrow="Contact"
				title="Talk to us."
				intro="Questions about gloves, trade accounts or the subscription? Send us a message and we'll reply within one working day."
			/>
			<Band labelledBy="contact-heading">
				<div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
					<div>
						<h2 id="contact-heading" className="text-h2">
							Get in touch
						</h2>
						<dl className="mt-6 space-y-4 text-sm">
							<div>
								<dt className="font-semibold">Email</dt>
								<dd>
									<a className="underline underline-offset-2" href={`mailto:${company.email}`}>
										{company.email}
									</a>
								</dd>
							</div>
							<div>
								<dt className="font-semibold">Trade</dt>
								<dd>
									<a className="underline underline-offset-2" href={`mailto:${company.tradeEmail}`}>
										{company.tradeEmail}
									</a>
								</dd>
							</div>
							{company.whatsapp ? (
								<div>
									<dt className="font-semibold">WhatsApp</dt>
									<dd>{company.whatsapp}</dd>
								</div>
							) : null}
							{company.registeredOffice ? (
								<div>
									<dt className="font-semibold">Registered office</dt>
									<dd className="text-muted-foreground">{company.registeredOffice}</dd>
								</div>
							) : null}
						</dl>
					</div>
					<div className="rounded-card border border-border bg-card p-6 md:p-8">
						<ContactForm />
					</div>
				</div>
			</Band>
		</>
	);
}
