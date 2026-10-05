"use client";

import { useActionState } from "react";
import { submitWaitlist } from "@/app/forms-actions";
import { GLOVE_INTERESTS, MONTHLY_BOXES, USE_TYPES, initialFormState } from "@/lib/forms/schemas";
import { ConsentField, FormStatus, Honeypot, SelectField, SubmitButton, TextField, Turnstile } from "./fields";

export function WaitlistForm() {
	const [state, action] = useActionState(submitWaitlist, initialFormState);

	if (state.status === "success") {
		return <FormStatus state={state} />;
	}

	return (
		<form action={action} noValidate className="relative space-y-5" aria-label="Join the waitlist">
			<FormStatus state={state} />
			<div className="grid gap-5 sm:grid-cols-2">
				<TextField name="firstName" label="First name" state={state} required autoComplete="given-name" />
				<TextField name="email" label="Email" type="email" state={state} required autoComplete="email" />
				<SelectField name="useType" label="Business or home use?" state={state} required options={USE_TYPES} />
				<SelectField
					name="gloveInterest"
					label="Which gloves are you interested in?"
					state={state}
					required
					options={GLOVE_INTERESTS}
				/>
				<SelectField
					name="monthlyBoxes"
					label="Roughly how many boxes a month?"
					state={state}
					required
					options={MONTHLY_BOXES}
				/>
			</div>
			<ConsentField state={state} />
			<Honeypot />
			<Turnstile />
			<SubmitButton>Join the waitlist</SubmitButton>
		</form>
	);
}
