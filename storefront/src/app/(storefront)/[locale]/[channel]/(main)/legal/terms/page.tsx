import { type Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

export default function TermsPage() {
	return (
		<LegalPage title="Terms of use">
			<h2>About these terms</h2>
			<p>
				These terms apply to your use of irongrip.uk. Terms of sale will be published before online ordering
				opens.
			</p>
			<h2>Information on this site</h2>
			<p>
				We work hard to keep product information accurate. Always check the standards and ratings on the
				product and its packaging before use, and choose gloves suitable for your task.
			</p>
			<h2>Liability</h2>
			<p>
				Nothing in these Terms excludes or limits our liability for death or personal injury caused by our
				negligence, fraud or fraudulent misrepresentation, or any other liability that cannot legally be
				excluded or limited under applicable law.
			</p>
			<p>
				Subject to the above, we will not be liable for any loss or damage that was not reasonably foreseeable
				at the time the contract was entered into, or for any loss arising from misuse of our products,
				failure to follow product instructions, warnings or safety guidance, use of a product for a purpose
				for which it was not designed, or normal wear and tear.
			</p>
			<p>
				Our products are intended to provide protection appropriate to their stated specifications and
				intended use. Customers are responsible for selecting gloves suitable for the particular task, working
				environment and hazards involved and for following all applicable instructions, warnings and safety
				information. Where applicable, customers should check the relevant product standards, certifications
				and ratings before use.
			</p>
			<p>
				Nothing in these Terms affects your statutory rights as a consumer, including any rights you may have
				under the Consumer Rights Act 2015 or other applicable UK legislation.
			</p>
			<p>
				To the fullest extent permitted by law, we shall not be responsible for indirect or consequential
				loss, loss of profits, loss of business, loss of revenue or loss of anticipated savings arising from
				the use of our products or website.
			</p>
			<p>
				Where you purchase our products in the course of business rather than as a consumer, our liability
				shall be subject to any additional limitations set out in the applicable business terms or contract.
			</p>
			<h2>Law</h2>
			<p>These terms are governed by the law of England and Wales.</p>
		</LegalPage>
	);
}
