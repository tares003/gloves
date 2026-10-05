"use client";

import Script from "next/script";
import { type ReactNode, useId } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/forms/schemas";
import { buttonClassName } from "@/ui/components/ui/button";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

const inputClass = cn(
	"block w-full rounded-md border border-input bg-card px-3 py-2.5 text-base text-foreground",
	"placeholder:text-muted-foreground",
	"focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
	"aria-[invalid=true]:border-destructive",
);

type BaseFieldProps = {
	name: string;
	label: string;
	state: FormState;
	required?: boolean;
	hint?: string;
};

function FieldShell({
	id,
	label,
	required,
	hint,
	error,
	children,
}: {
	id: string;
	label: string;
	required?: boolean;
	hint?: string;
	error?: string;
	children: ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<label htmlFor={id} className="block text-sm font-medium text-foreground">
				{label}
				{required ? (
					<span className="text-destructive" aria-hidden="true">
						{" "}
						*
					</span>
				) : (
					<span className="font-normal text-muted-foreground"> (optional)</span>
				)}
			</label>
			{hint ? (
				<p id={`${id}-hint`} className="text-xs text-muted-foreground">
					{hint}
				</p>
			) : null}
			{children}
			{error ? (
				<p id={`${id}-error`} className="text-sm text-destructive" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

function describedBy(id: string, hint?: string, error?: string) {
	return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

export function TextField({
	name,
	label,
	state,
	required,
	hint,
	type = "text",
	autoComplete,
}: BaseFieldProps & { type?: "text" | "email" | "tel"; autoComplete?: string }) {
	const id = useId();
	const error = state.fieldErrors?.[name];
	return (
		<FieldShell id={id} label={label} required={required} hint={hint} error={error}>
			<input
				id={id}
				name={name}
				type={type}
				required={required}
				autoComplete={autoComplete}
				defaultValue={state.values?.[name] ?? ""}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy(id, hint, error)}
				className={inputClass}
			/>
		</FieldShell>
	);
}

export function TextAreaField({ name, label, state, required, hint }: BaseFieldProps) {
	const id = useId();
	const error = state.fieldErrors?.[name];
	return (
		<FieldShell id={id} label={label} required={required} hint={hint} error={error}>
			<textarea
				id={id}
				name={name}
				required={required}
				rows={5}
				defaultValue={state.values?.[name] ?? ""}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy(id, hint, error)}
				className={inputClass}
			/>
		</FieldShell>
	);
}

export function SelectField({
	name,
	label,
	state,
	required,
	hint,
	options,
}: BaseFieldProps & { options: readonly string[] }) {
	const id = useId();
	const error = state.fieldErrors?.[name];
	return (
		<FieldShell id={id} label={label} required={required} hint={hint} error={error}>
			<select
				id={id}
				name={name}
				required={required}
				defaultValue={state.values?.[name] ?? ""}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy(id, hint, error)}
				className={inputClass}
			>
				<option value="" disabled>
					Please choose…
				</option>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</FieldShell>
	);
}

/** Unticked marketing-consent checkbox (UK GDPR / PECR). */
export function ConsentField({ state }: { state: FormState }) {
	const id = useId();
	return (
		<div className="flex items-start gap-3">
			<input
				id={id}
				name="marketingConsent"
				type="checkbox"
				defaultChecked={state.values?.["marketingConsent"] === "on"}
				className="mt-1 h-4 w-4 rounded border-input accent-primary"
			/>
			<label htmlFor={id} className="text-sm text-muted-foreground">
				Email me about the IronGrip launch and offers. You can unsubscribe at any time. See our{" "}
				<LinkWithChannel href="/legal/privacy" className="underline underline-offset-2 hover:text-foreground">
					Privacy Policy
				</LinkWithChannel>
				.
			</label>
		</div>
	);
}

/** Hidden honeypot — real users never see or fill it. */
export function Honeypot() {
	return (
		<div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
			<label>
				Website
				<input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
			</label>
		</div>
	);
}

/** Cloudflare Turnstile widget (renders nothing when no site key is configured). */
export function Turnstile() {
	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
	if (!siteKey) return null;
	return (
		<>
			<Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
			<div className="cf-turnstile" data-sitekey={siteKey} data-theme="light" />
		</>
	);
}

export function SubmitButton({ children }: { children: ReactNode }) {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className={cn(
				buttonClassName({ variant: "default", size: "lg" }),
				"w-full font-semibold uppercase tracking-wide sm:w-auto",
			)}
		>
			{pending ? "Sending…" : children}
		</button>
	);
}

export function FormStatus({ state }: { state: FormState }) {
	if (state.status === "idle" || !state.message) return null;
	const success = state.status === "success";
	return (
		<div
			role={success ? "status" : "alert"}
			className={cn(
				"rounded-md border px-4 py-3 text-sm",
				success
					? "border-success/40 bg-success/10 text-foreground"
					: "border-destructive/40 bg-destructive/10 text-foreground",
			)}
		>
			{state.message}
		</div>
	);
}
