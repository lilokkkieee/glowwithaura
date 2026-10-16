import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OWNER_EMAIL = "sukhadevetilottama1@gmail.com";

interface CustomCandlePayload {
  name: string;
  email: string;
  phone?: string;
  candle_type: string;
  fragrance_type: string;
  fragrance_details?: string;
  color: string;
  size: string;
  quantity: number;
  notes?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: CustomCandlePayload = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: dbError } = await supabase.from("custom_candle_requests").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      candle_type: data.candle_type,
      fragrance_type: data.fragrance_type,
      fragrance_details: data.fragrance_details ?? null,
      color: data.color,
      size: data.size,
      quantity: data.quantity,
      notes: data.notes ?? null,
    });

    if (dbError) {
      throw new Error(`Failed to save custom candle request: ${dbError.message}`);
    }

    const subject = `Custom Candle Request from ${data.name} — Glow With Aura`;
    const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
        <div style="background:#022c1c;padding:24px 32px;">
          <h1 style="color:#d4af37;margin:0;font-size:24px;">New Custom Candle Request — Glow With Aura</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#022c1c;margin:0 0 16px;">Customer Details</h2>
          <table style="width:100%;font-size:14px;line-height:1.8;color:#333;margin-bottom:24px;">
            <tr><td style="font-weight:bold;width:160px;vertical-align:top;">Name:</td><td>${escapeHtml(data.name)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Email:</td><td>${escapeHtml(data.email)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Phone:</td><td>${escapeHtml(data.phone || "Not provided")}</td></tr>
          </table>

          <h2 style="color:#022c1c;margin:0 0 16px;">Candle Customization</h2>
          <table style="width:100%;font-size:14px;line-height:1.8;color:#333;margin-bottom:24px;">
            <tr><td style="font-weight:bold;width:160px;vertical-align:top;">Candle Type:</td><td>${escapeHtml(data.candle_type)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Fragrance Type:</td><td>${escapeHtml(data.fragrance_type)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Fragrance Details:</td><td>${escapeHtml(data.fragrance_details || "Not specified")}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Color:</td><td>${escapeHtml(data.color)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Size:</td><td>${escapeHtml(data.size)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Quantity:</td><td>${data.quantity}</td></tr>
          </table>

          ${data.notes ? `
          <h2 style="color:#022c1c;margin:0 0 16px;">Additional Notes</h2>
          <div style="background:#f8f5f0;border-left:4px solid #d4af37;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
            <p style="margin:0;color:#333;line-height:1.7;white-space:pre-wrap;">${escapeHtml(data.notes)}</p>
          </div>
          ` : ""}

          <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #e5e5e5;padding-top:16px;">
            This custom candle request was submitted via the Custom Candle page on your Glow With Aura website and saved to your database.
          </p>
        </div>
      </div>
    `;
    const text = `New Custom Candle Request\n\nCustomer:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "Not provided"}\n\nCandle Customization:\nCandle Type: ${data.candle_type}\nFragrance Type: ${data.fragrance_type}\nFragrance Details: ${data.fragrance_details || "Not specified"}\nColor: ${data.color}\nSize: ${data.size}\nQuantity: ${data.quantity}\n\nNotes:\n${data.notes || "None"}`;

    let emailStatus = "sent";
    let emailError: string | null = null;
    try {
      await sendEmail(OWNER_EMAIL, subject, html, text);
    } catch (err) {
      emailStatus = "failed";
      emailError = err.message;
    }

    await supabase.from("email_notifications").insert({
      type: "custom_candle",
      recipient: OWNER_EMAIL,
      subject,
      payload: data,
      email_status: emailStatus,
      email_error: emailError,
    });

    if (emailStatus === "failed") {
      return new Response(JSON.stringify({
        success: true,
        warning: `Request saved, but email notification failed: ${emailError}`,
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
