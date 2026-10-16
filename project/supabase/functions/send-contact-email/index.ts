import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OWNER_EMAIL = "sukhadevetilottama1@gmail.com";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: ContactPayload = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Save the inquiry to the contact_inquiries table
    const { error: dbError } = await supabase.from("contact_inquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.subject,
      message: data.message,
    });

    if (dbError) {
      throw new Error(`Failed to save inquiry: ${dbError.message}`);
    }

    // Build the email
    const subject = `Customer Inquiry: ${data.subject} — Glow With Aura`;
    const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
        <div style="background:#022c1c;padding:24px 32px;">
          <h1 style="color:#d4af37;margin:0;font-size:24px;">New Customer Inquiry — Glow With Aura</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#022c1c;margin:0 0 16px;">${escapeHtml(data.subject)}</h2>
          <table style="width:100%;font-size:14px;line-height:1.8;color:#333;margin-bottom:24px;">
            <tr><td style="font-weight:bold;width:100px;vertical-align:top;">Name:</td><td>${escapeHtml(data.name)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Email:</td><td>${escapeHtml(data.email)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Phone:</td><td>${escapeHtml(data.phone || "Not provided")}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Subject:</td><td>${escapeHtml(data.subject)}</td></tr>
          </table>
          <div style="background:#f8f5f0;border-left:4px solid #d4af37;padding:16px 20px;border-radius:8px;">
            <p style="margin:0;color:#333;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
          </div>
          <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #e5e5e5;padding-top:16px;">
            This inquiry was submitted via the Contact form on your Glow With Aura website and saved to your database.
          </p>
        </div>
      </div>
    `;
    const text = `New Customer Inquiry\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "Not provided"}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`;

    // Attempt to send the email and log the result
    let emailStatus = "sent";
    let emailError: string | null = null;
    try {
      await sendEmail(OWNER_EMAIL, subject, html, text);
    } catch (err) {
      emailStatus = "failed";
      emailError = err.message;
    }

    // Log the notification attempt to the database
    await supabase.from("email_notifications").insert({
      type: "contact",
      recipient: OWNER_EMAIL,
      subject,
      payload: data,
      email_status: emailStatus,
      email_error: emailError,
    });

    if (emailStatus === "failed") {
      return new Response(JSON.stringify({
        success: true,
        warning: `Inquiry saved, but email notification failed: ${emailError}`,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendEmail(to: string, subject: string, html: string, text: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY secret is not configured.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Glow With Aura <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error (${res.status}): ${body}`);
  }

  return res.json();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
