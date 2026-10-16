import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OWNER_EMAIL = "sukhadevetilottama1@gmail.com";

interface LoginPayload {
  name: string;
  email: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: LoginPayload = await req.json();

    if (!data.email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const displayName = data.name || data.email.split("@")[0];
    const subject = `Customer Login: ${displayName} signed in — Glow With Aura`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
        <div style="background:#022c1c;padding:24px 32px;">
          <h1 style="color:#d4af37;margin:0;font-size:24px;">Customer Signed In — Glow With Aura</h1>
        </div>
        <div style="padding:32px;">
          <p style="font-size:16px;color:#022c1c;margin:0 0 24px;">A customer just logged into your store.</p>
          <table style="width:100%;font-size:14px;line-height:1.8;color:#333;margin-bottom:24px;">
            <tr><td style="font-weight:bold;width:100px;vertical-align:top;">Name:</td><td>${escapeHtml(displayName)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Email:</td><td>${escapeHtml(data.email)}</td></tr>
            <tr><td style="font-weight:bold;vertical-align:top;">Login Time:</td><td>${new Date().toLocaleString()}</td></tr>
          </table>
          <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #e5e5e5;padding-top:16px;">
            You can view all customer details in your admin dashboard.
          </p>
        </div>
      </div>
    `;
    const text = `Customer Signed In\n\nName: ${displayName}\nEmail: ${data.email}\nLogin Time: ${new Date().toLocaleString()}\n\nYou can view all customer details in your admin dashboard.`;

    let emailStatus = "sent";
    let emailError: string | null = null;
    try {
      await sendEmail(OWNER_EMAIL, subject, html, text);
    } catch (err) {
      emailStatus = "failed";
      emailError = err.message;
    }

    await supabase.from("email_notifications").insert({
      type: "login",
      recipient: OWNER_EMAIL,
      subject,
      payload: data,
      email_status: emailStatus,
      email_error: emailError,
    });

    return new Response(JSON.stringify({ success: true, warning: emailError }), {
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
