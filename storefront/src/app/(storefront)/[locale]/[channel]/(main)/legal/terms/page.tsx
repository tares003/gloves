import { type Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

export default function TermsPage() {
	return (
		<LegalPage title="Terms of use">
			<h2>About these terms</h2>
			<p>These terms apply to your use of irongrip.uk. Terms of sale will be published before online ordering opens.</p>
			<h2>Information on this site</h2>
			<p>
				We work hard to keep product information accurate. Always check the standards and ratings on the product
				and its packaging before use, and choose gloves suitable for your task.
			</p>
			<h2>Liability</h2>
			<p>[To be drafted by a solicitor.]</p>
			<h2>Law</h2>
			<p>These terms are governed by the law of England and Wales.</p>
		</LegalPage>
	);
}
