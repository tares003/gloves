import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonClassName } from "@/ui/components/ui/button";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

/** Channel-aware CTA link styled as a button. */
export function CtaLink({
	href,
	children,
	variant = "primary",
	className,
}: {
	href: string;
	children: ReactNode;
	variant?: "primary" | "outline" | "inverse";
	className?: string;
}) {
	const variantClass =
		variant === "primary"
			? buttonClassName({ variant: "default", size: "lg", asLink: true })
			: variant === "outline"
				? buttonClassName({ variant: "outline-solid", size: "lg", asLink: true })
				: cn(
						buttonClassName({ variant: "ghost", size: "lg", asLink: true }),
						"border border-inverse text-background hover:bg-background/10 hover:text-background",
					);
	return (
		<LinkWithChannel href={href} className={cn(variantClass, "font-semibold uppercase tracking-wide", className)}>
			{children}
		</LinkWithChannel>
	);
}

/** Full-width band with consistent vertical rhythm. */
export function Band({
	children,
	tone = "default",
	className,
	id,
	labelledBy,
}: {
	children: ReactNode;
	tone?: "default" | "muted" | "inverse" | "card";
	className?: string;
	id?: string;
	labelledBy?: string;
}) {
	const toneClass = {
		default: "bg-background text-foreground",
		muted: "bg-secondary text-foreground",
		inverse: "bg-foreground text-background",
		card: "bg-card text-foreground",
	}[tone];
	return (
		<section id={id} aria-labelledby={labelledBy} className={cn(toneClass, "py-section-sm", className)}>
			<div className="container-content">{children}</div>
		</section>
	);
}

export function Eyebrow({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
	return (
		<p className={cn("text-eyebrow uppercase", inverse ? "text-primary" : "text-primary")}>
			<span aria-hidden="true" className="mr-2 inline-block h-0.5 w-6 bg-primary align-middle" />
			{children}
		</p>
	);
}

/** Page header used by every inner page (one h1 per page). */
export function PageHeader({
	eyebrow,
	title,
	intro,
	children,
}: {
	eyebrow?: string;
	title: string;
	intro?: string;
	children?: ReactNode;
}) {
	return (
		<header className="relative overflow-hidden bg-foreground text-background">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[url('/brand/textures/angular.png')] bg-contain bg-right bg-no-repeat opacity-20 md:block"
			/>
			<div className="container-content relative py-section-sm">
				{eyebrow ? <Eyebrow inverse>{eyebrow}</Eyebrow> : null}
				<h1 className="mt-3 max-w-3xl text-h1">{title}</h1>
				{intro ? <p className="mt-4 max-w-2xl text-lead text-inverse">{intro}</p> : null}
				{children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
			</div>
		</header>
	);
}

/** Simple card used for benefits / product families. */
export function InfoCard({
	title,
	children,
	icon,
	className,
}: {
	title: string;
	children: ReactNode;
	icon?: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("rounded-card border border-border bg-card p-6 shadow-card", className)}>
			{icon ? <div className="mb-4">{icon}</div> : null}
			<h3 className="text-h3">{title}</h3>
			<div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
		</div>
	);
}

/** Numbered step list. */
export function Steps({ steps }: { steps: { title: string; text: string }[] }) {
	return (
		<ol className="grid gap-6 md:grid-cols-3">
			{steps.map((step, index) => (
				<li key={step.title} className="rounded-card border border-border bg-card p-6">
					<span className="font-[family-name:var(--font-display)] text-h2 text-primary" aria-hidden="true">
						{String(index + 1).padStart(2, "0")}
					</span>
					<h3 className="mt-2 text-h3">{step.title}</h3>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
				</li>
			))}
		</ol>
	);
}

/** Readable long-form container (FAQ, legal, quality). */
export function Prose({ children }: { children: ReactNode }) {
	return (
		<div className="mx-auto max-w-[var(--container-prose)] space-y-4 text-base leading-relaxed [&_h2]:mt-10 [&_h2]:text-h2 [&_h3]:mt-6 [&_h3]:text-h3 [&_li]:ml-5 [&_li]:list-disc [&_p]:text-foreground/90">
			{children}
		</div>
	);
}
