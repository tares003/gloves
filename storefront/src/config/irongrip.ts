import type { NavMenuItem } from "@/lib/menus/serialize-menu-for-nav";

/**
 * IronGrip site-wide facts. Placeholders in [square brackets] must be replaced before launch
 * (UK law requires company name, number and registered office on the website).
 */
export const company = {
	legalName: "[Company legal name] Ltd",
	companyNumber: "[number]",
	registeredOffice: "[Registered office address]",
	vatNumber: null as string | null,
	email: "hello@irongrip.uk",
	tradeEmail: "trade@irongrip.uk",
	whatsapp: null as string | null,
	social: {
		tiktok: null as string | null,
		instagram: null as string | null,
	},
} as const;

/**
 * Main navigation (header desktop + mobile). Hrefs are channel-relative (LinkWithChannel adds /en/uk).
 * "Products" is rendered first by the mega menu itself (label: content chrome.nav.allProductsLabel).
 */
export const mainNav: NavMenuItem[] = [
	{ id: "nav-trade", label: "Trade", href: "/trade" },
	{ id: "nav-subscribe", label: "Subscribe", href: "/subscribe" },
	{ id: "nav-quality", label: "Quality", href: "/quality" },
	{ id: "nav-about", label: "About", href: "/about" },
	{ id: "nav-contact", label: "Contact", href: "/contact" },
];

export const footerColumns: { heading: string; links: { label: string; href: string }[] }[] = [
	{
		heading: "Gloves",
		links: [
			{ label: "Heavy duty", href: "/categories/heavy-duty" },
			{ label: "Everyday", href: "/categories/everyday" },
			{ label: "Chemical resistant", href: "/categories/chemical-resistant" },
			{ label: "Food safe", href: "/categories/food-safe" },
		],
	},
	{
		heading: "Business",
		links: [
			{ label: "Trade accounts", href: "/trade" },
			{ label: "Subscription", href: "/subscribe" },
			{ label: "Quality & standards", href: "/quality" },
		],
	},
	{
		heading: "Help",
		links: [
			{ label: "FAQ", href: "/faq" },
			{ label: "Delivery & returns", href: "/legal/returns" },
			{ label: "Contact", href: "/contact" },
		],
	},
];

export const legalLinks = [
	{ label: "Privacy", href: "/legal/privacy" },
	{ label: "Terms", href: "/legal/terms" },
	{ label: "Cookies", href: "/legal/cookies" },
];

/** Top-level marketing paths served without the /{locale}/{channel} prefix (see middleware). */
export const CLEAN_URL_ROOTS = new Set([
	"products",
	"categories",
	"trade",
	"subscribe",
	"quality",
	"about",
	"contact",
	"faq",
	"legal",
]);
