import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Photo } from "@/config/photos";

/** A row of small lifestyle photos (2 per row on phones, all in one row on large screens). */
export function PhotoStrip({ photos, className }: { photos: readonly Photo[]; className?: string }) {
	return (
		<ul
			className={cn(
				"grid list-none grid-cols-2 gap-3 sm:grid-cols-3",
				photos.length > 3 && "lg:grid-cols-6",
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
						sizes="(min-width: 1024px) 255px, (min-width: 640px) 33vw, 50vw"
						className="aspect-[5/3] h-full w-full object-cover"
					/>
				</li>
			))}
		</ul>
	);
}
