import Link from "next/link";
import { brandConfig } from "@/config/brand";
import { company, footerColumns, legalLinks } from "@/config/irongrip";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { CurrentYear } from "@/ui/irongrip/current-year";
import { Logo } from "./shared/logo";

/** IronGrip footer — static columns, company details (legally required) and legal links. */
export async function Footer({ locale, channel }: { locale: string; channel: string }) {
	const href = (path: string) => buildStorefrontPath(locale, channel, path);

	return (
		<footer className="bg-foreground text-background">
			{/* Extra bottom padding on mobile to account for sticky add-to-cart bar */}
			<div className="container-content pb-24 pt-12 sm:pb-12 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
					<div className="col-span-2">
						<Link href={href("")} className="mb-4 inline-block" aria-label="IronGrip home">
							<Logo className="h-16 w-auto" inverted />
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-inverse-subtle">
							IronGrip supplies premium disposable gloves to UK trades, workshops and businesses.
						</p>
						<p className="mt-4 text-sm text-inverse-subtle">
							<a className="hover:text-background" href={`mailto:${company.email}`}>
								{company.email}
							</a>
						</p>
					</div>

					{footerColumns.map((column) => (
						<div key={column.heading}>
							<h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background">
								{column.heading}
							</h2>
							<ul className="space-y-3">
								{column.links.map((link) => (
									<li key={link.href}>
										<Link
											href={href(link.href)}
											prefetch={false}
											className="text-sm text-inverse-subtle transition-colors hover:text-background"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-12 flex flex-col gap-4 border-t border-inverse pt-8 sm:flex-row sm:items-start sm:justify-between">
					<p className="max-w-2xl text-xs leading-relaxed text-inverse-muted">
						© <CurrentYear /> {company.legalName ?? brandConfig.siteName}.
						{company.legalName && company.companyNumber
							? ` Registered in England and Wales, company no. ${company.companyNumber}.`
							: ""}
						{company.registeredOffice ? ` Registered office: ${company.registeredOffice}.` : ""}
						{company.vatNumber ? ` VAT no. ${company.vatNumber}.` : ""}
						{company.legalName ? ` ${brandConfig.siteName} is a trading name of ${company.legalName}.` : ""}
					</p>
					<ul className="flex items-center gap-6">
						{legalLinks.map((link) => (
							<li key={link.href}>
								<Link
									href={href(link.href)}
									prefetch={false}
									className="text-xs text-inverse-muted transition-colors hover:text-inverse-subtle"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	);
}
