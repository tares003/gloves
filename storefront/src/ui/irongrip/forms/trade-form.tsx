"use client";

import { useActionState, useState } from "react";
import { submitTradeEnquiry } from "@/app/forms-actions";
import { BUSINESS_TYPES, MONTHLY_BOXES, OTHER_BUSINESS_TYPE, initialFormState } from "@/lib/forms/schemas";
import {
	ConsentField,
	FormStatus,
	Honeypot,
	SelectField,
	SubmitButton,
	TextAreaField,
	TextField,
	Turnstile,
} from "./fields";

export function TradeForm() {
	const [state, action] = useActionState(submitTradeEnquiry, initialFormState);
	const [businessType, setBusinessType] = useState(state.values?.["businessType"] ?? "");

	if (state.status === "success") {
		return <FormStatus state={state} />;
	}

	return (
		<form action={action} noValidate className="relative space-y-5" aria-label="Request a trade account">
			<FormStatus state={state} />
			<div className="grid gap-5 sm:grid-cols-2">
				<TextField name="name" label="Your name" state={state} required autoComplete="name" />
				<TextField
					name="businessName"
					label="Business name"
					state={state}
					required
					autoComplete="organization"
				/>
				<SelectField
					name="businessType"
					label="Business type"
					state={state}
					required
					options={BUSINESS_TYPES}
					onChange={setBusinessType}
				/>
				{businessType === OTHER_BUSINESS_TYPE ? (
					<TextField
						name="businessTypeOther"
						label="Please specify your business type"
						state={state}
						required
					/>
				) : null}
				<SelectField
					name="monthlyBoxes"
					label="Roughly how many boxes a month?"
					state={state}
					required
					options={MONTHLY_BOXES}
				/>
				<TextField name="email" label="Email" type="email" state={state} required autoComplete="email" />
				<TextField name="phone" label="Phone" type="tel" state={state} autoComplete="tel" />
			</div>
			<TextAreaField name="message" label="Anything else we should know?" state={state} />
			<ConsentField state={state} />
			<Honeypot />
			<Turnstile />
			<SubmitButton>Send enquiry</SubmitButton>
		</form>
	);
}
