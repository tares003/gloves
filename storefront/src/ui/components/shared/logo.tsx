/**
 * IronGrip logo.
 *
 * - default: horizontal wordmark (`/brand/logo-horizontal.png`) — works on light and dark surfaces
 * - `inverted`: stacked wordmark for dark bands (footer)
 *
 * TODO(brand): replace PNGs with vector SVGs once the final logo files arrive.
 */

interface LogoProps {
	className?: string;
	/** Accessible label for the logo */
	ariaLabel?: string;
	/** Stacked lockup for dark/inverted backgrounds (footer) */
	inverted?: boolean;
}

export const Logo = ({ className, ariaLabel = "IronGrip", inverted = false }: LogoProps) => {
	const src = inverted ? "/brand/logo-stacked.png" : "/brand/logo-horizontal.png";
	const [width, height] = inverted ? [279, 137] : [467, 101];

	return (
		// eslint-disable-next-line @next/next/no-img-element -- small brand raster, sized by CSS
		<img
			src={src}
			alt={ariaLabel}
			width={width}
			height={height}
			className={className}
			style={{ aspectRatio: `${width} / ${height}` }}
			decoding="async"
		/>
	);
};
