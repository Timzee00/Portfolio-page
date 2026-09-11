"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { allowPublicAction, honeypotTriggered } from "@/lib/abuse";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email"),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  if (honeypotTriggered(formData)) return { status: "success", message: "Thanks — I'll get back to you soon." };

  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check your input.",
    };
  }

  const allowed = await allowPublicAction("contact", 3, 900);
  if (!allowed) {
    return { status: "error", message: "Too many messages were sent recently. Please try again later." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    message: parsed.data.message,
  });

  if (error) {
    console.error("submitContactMessage:", error.message);
    return {
      status: "error",
      message: "Something went wrong sending your message. Try again.",
    };
  }

  return { status: "success", message: "Thanks — I'll get back to you soon." };
}
