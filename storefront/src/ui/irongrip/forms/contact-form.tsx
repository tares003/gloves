"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/forms-actions";
import { initialFormState } from "@/lib/forms/schemas";
import { FormStatus, Honeypot, SubmitButton, TextAreaField, TextField, Turnstile } from "./fields";

export function ContactForm() {
	const [state, action] = useActionState(submitContact, initialFormState);

	if (state.status === "success") {
		return <FormStatus state={state} />;
	}

	return (
		<form action={action} noValidate className="relative space-y-5" aria-label="Contact IronGrip">
			<FormStatus state={state} />
			<div className="grid gap-5 sm:grid-cols-2">
				<TextField name="name" label="Name" state={state} required autoComplete="name" />
				<TextField name="email" label="Email" type="email" state={state} required autoComplete="email" />
			</div>
			<TextAreaField name="message" label="Message" state={state} required />
			<Honeypot />
			<Turnstile />
			<SubmitButton>Send message</SubmitButton>
		</form>
	);
}
