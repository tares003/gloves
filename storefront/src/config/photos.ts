/**
 * Lifestyle photos in public/brand/photos/, cropped from the 2026-10-05 marketing composites.
 * Crops contain no text, certification marks or performance claims (brief §5): keep it that way
 * when adding photos. Widths/heights are the real pixel sizes; avoid showing them much larger.
 */
export type Photo = { src: string; alt: string; width: number; height: number };

const photo = (name: string, alt: string, width: number, height: number): Photo => ({
	src: `/brand/photos/${name}.webp`,
	alt,
	width,
	height,
});

export const PHOTOS = {
	gripPipe: photo(
		"work-glove-gripping-rusty-pipe",
		"Gloved hand gripping a rusty steel pipe on a building site",
		350,
		525,
	),
	automotive: photo("work-glove-automotive-engine", "Gloved hand working on a car engine", 255, 153),
	construction: photo("work-glove-construction-block", "Gloved hand lifting a concrete block", 251, 153),
	engineering: photo(
		"work-glove-engineering-pipework",
		"Gloved hand on oily pipework in a plant room",
		251,
		153,
	),
	plumbing: photo("work-glove-plumbing-wet-pipe", "Gloved hand holding a wet water pipe", 251, 153),
	warehouse: photo(
		"work-glove-warehouse-box",
		"Gloved hand carrying a cardboard box in a warehouse",
		251,
		153,
	),
	diy: photo("work-glove-diy-timber", "Gloved hand holding a length of timber", 250, 153),
	cleaning: photo("disposable-glove-cleaning", "Disposable glove wiping a surface with a cloth", 251, 158),
	puttingOn: photo("disposable-glove-putting-on", "Person pulling on a disposable glove", 530, 400),
} as const;
