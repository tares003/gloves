import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Photo } from "@/config/photos";

/**
 * A row of small lifestyle photos. Three photos stay in one row, capped so they never stretch past
 * their real size; longer strips go 2 → 3 → 6 per row as the screen widens.
 */
export function PhotoStrip({ photos, className }: { photos: readonly Photo[]; className?: string }) {
	const threeUp = photos.length <= 3;
	return (
		<ul
			className={cn(
				"grid list-none gap-3",
				threeUp ? "max-w-3xl grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
				className,
			)}
		>
			{photos.map((p) => (
				<li key={p.src} className="overflow-hidden rounded-card bg-muted">
					<Image
						src={p.src}
						alt={p.alt}
						width={p.width}
						height={p.height}
						sizes={
							threeUp
								? "(min-width: 800px) 255px, 33vw"
								: "(min-width: 1024px) 255px, (min-width: 640px) 33vw, 50vw"
						}
						className="aspect-[5/3] h-full w-full object-cover"
					/>
				</li>
			))}
		</ul>
	);
}
