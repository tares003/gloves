/**
 * Brand Configuration
 *
 * Centralized branding settings for the storefront.
 * Update these values when customizing for a new store.
 *
 * @example
 * ```tsx
 * import { brandConfig } from "@/config/brand";
 *
 * <title>{brandConfig.siteName}</title>
 * <p>© {new Date().getFullYear()} {brandConfig.copyrightHolder}</p>
 * ```
 */

export const brandConfig = {
	/** Site name used in titles, metadata, and headers */
	siteName: "IronGrip",

	/** Legal entity name for copyright notices */
	copyrightHolder: "[Company legal name] Ltd",

	/** Organization name for structured data (JSON-LD) */
	organizationName: "IronGrip",

	/** Default brand name for products without a brand */
	defaultBrand: "IronGrip",

	/** Tagline/description for the store */
	tagline: "Premium gloves for UK trades and businesses. Won't slip. Won't quit.",

	/** Homepage meta description */
	description:
		"IronGrip is a UK supplier of premium nitrile gloves for trades and businesses. Heavy-duty grip, trade pricing, and a subscription so you never run out.",

	/** Logo aria-label for accessibility */
	logoAriaLabel: "IronGrip",

	/** Title template - %s will be replaced with page title */
	titleTemplate: "%s | IronGrip",

	/** Social media handles */
	social: {
		/** Twitter/X handle (without @) - set to null to disable */
		twitter: null as string | null,
		/** Instagram handle (without @) - set to null to disable */
		instagram: null as string | null,
		/** Facebook page URL - set to null to disable */
		facebook: null as string | null,
	},
} as const;

/**
 * Helper to format page title using brand template.
 */
export function formatPageTitle(title: string): string {
	return brandConfig.titleTemplate.replace("%s", title);
}

/**
 * Get copyright text with specified year.
 * Use CopyrightText component for dynamic year in Server Components.
 */
export function getCopyrightText(year: number = new Date().getFullYear()): string {
	return `© ${year} ${brandConfig.copyrightHolder}. All rights reserved.`;
}
