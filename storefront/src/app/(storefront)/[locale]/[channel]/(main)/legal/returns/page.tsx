import { type Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = { title: "Delivery & Returns" };

export default function ReturnsPage() {
	return (
		<LegalPage title="Delivery & returns">
			<h2>Delivery</h2>
			<p>
				We deliver to UK mainland addresses. Delivery prices and timescales will be shown at checkout. [Confirm
				Highlands, Islands and Northern Ireland before launch.]
			</p>
			<h2>Returns</h2>
			<p>
				If you buy as a consumer you can cancel within 14 days of delivery. Unopened boxes can be returned within
				14 days. For hygiene reasons, opened boxes can&apos;t be returned unless they are faulty.
			</p>
			<h2>Faulty or wrong items</h2>
			<p>Tell us within 30 days and we&apos;ll replace or refund. Your statutory rights are not affected.</p>
		</LegalPage>
	);
}
