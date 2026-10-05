"use server";

import { headers } from "next/headers";
import { processForm } from "@/lib/forms/process";
import { contactSchema, type FormState, tradeSchema, waitlistSchema } from "@/lib/forms/schemas";

async function clientIp(): Promise<string | null> {
	const h = await headers();
	return h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip");
}

export async function submitTradeEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
	return processForm("trade", tradeSchema, formData, await clientIp());
}

export async function submitWaitlist(_prev: FormState, formData: FormData): Promise<FormState> {
	return processForm("waitlist", waitlistSchema, formData, await clientIp());
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
	return processForm("contact", contactSchema, formData, await clientIp());
}
