import { type Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = { title: "Privacy Policy", robots: { index: false } };

export default function PrivacyPage() {
	return (
		<LegalPage title="Privacy Policy">
			<h2>Who we are</h2>
			<p>IronGrip is the data controller for personal data collected through this website.</p>
			<h2>What we collect</h2>
			<ul>
				<li>
					Details you give us in forms: name, business name, email, phone, and what you tell us you use.
				</li>
				<li>Order and account details once online ordering opens.</li>
				<li>
					Basic technical data needed to run and secure the site (for example IP address for spam protection).
				</li>
			</ul>
			<h2>Why we use it</h2>
			<ul>
				<li>
					To reply to enquiries and set up trade accounts (legitimate interests / steps before a contract).
				</li>
				<li>To send launch and marketing emails, only if you tick the consent box (consent).</li>
				<li>To keep the site secure and prevent spam (legitimate interests).</li>
			</ul>
			<h2>Who we share it with</h2>
			<p>
				Service providers that host the site, send email and protect forms (for example Cloudflare). We never
				sell your data.
			</p>
			<h2>How long we keep it</h2>
			<p>Enquiries: up to 24 months. Marketing consent: until you unsubscribe.</p>
			<h2>Your rights</h2>
			<p>
				You can ask to see, correct or delete your data, object to processing or withdraw consent at any time
				by emailing us. You can also complain to the Information Commissioner&apos;s Office (ico.org.uk).
			</p>
		</LegalPage>
	);
}
