import { type Metadata } from "next";
import { LegalPage } from "../legal-page";

export const metadata: Metadata = { title: "Cookies", robots: { index: false } };

export default function CookiesPage() {
	return (
		<LegalPage title="Cookie Policy">
			<h2>Cookies we use</h2>
			<p>
				We only use cookies that are strictly necessary to run the site — for example to remember your basket,
				keep you signed in, and remember that you dismissed the announcement bar. These do not need consent.
			</p>
			<h2>Analytics</h2>
			<p>
				We use cookieless analytics (Cloudflare Web Analytics), which does not set cookies or track you across
				sites. If we ever add analytics or marketing cookies, we will ask for your consent first.
			</p>
			<h2>Security</h2>
			<p>Our forms are protected by Cloudflare Turnstile, which may process technical data to stop spam.</p>
		</LegalPage>
	);
}
