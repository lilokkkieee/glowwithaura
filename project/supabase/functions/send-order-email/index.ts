import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OWNER_EMAIL = "sukhadevetilottama1@gmail.com";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  fragrance?: string;
}

interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  codCharge?: number;
  coupon?: string | null;
  userId?: string | null;
  paymentMethod?: string;
  paymentReference?: string | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const order: OrderPayload = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const paymentMethod = order.paymentMethod === "UPI" ? "UPI" : "COD";
    const subtotal = Number(order.subtotal);
    const discount = Number(order.discount);
    const shipping = Number(order.shipping);
    if (![subtotal, discount, shipping].every(Number.isFinite) || subtotal < 0 || discount < 0 || shipping < 0 || discount > subtotal) {
      throw new Error("Invalid order amounts");
    }

    for (const item of order.items) {
      if (!Number.isFinite(item.quantity) || item.quantity < 1 || !Number.isFinite(item.price) || item.price < 0) {
        throw new Error("Invalid order item");
      }
    }

    const codCharge = paymentMethod === "COD" ? 99 : 0;
    const calculatedTotal = subtotal - discount + shipping + codCharge;
    order.subtotal = subtotal;
    order.discount = discount;
    order.shipping = shipping;
    order.codCharge = codCharge;
    order.total = calculatedTotal;
    order.paymentMethod = paymentMethod;

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    if (token && token !== anonKey) {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      order.userId = userData.user.id;
    } else {
      order.userId = null;
    }

    // Generate a human-readable order number
    const { data: seqData } = await supabase.rpc("get_next_order_number");
    const orderNumber = seqData ?? `GWA-${Date.now().toString().slice(-6)}`;

    // Save the order to the database
    const { error: dbError } = await supabase.from("orders").insert({
      order_number: orderNumber,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone ?? null,
      shipping_address: order.shippingAddress ?? null,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      cod_charge: order.codCharge,
      total: order.total,
      coupon: order.coupon ?? null,
      user_id: order.userId ?? null,
      payment_method: order.paymentMethod,
      payment_reference: order.paymentReference ?? null,
      payment_status: order.paymentMethod === "UPI" ? "Pending Verification" : "Pending",
      status: "Placed",
    });

    if (dbError) {
      throw new Error(`Failed to save order: ${dbError.message}`);
    }

    const itemRows = order.items
      .map(
        (i) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #e5e5e5;">${escapeHtml(i.name)}${i.fragrance ? ` <em style="color:#888;">(${escapeHtml(i.fragrance)})</em>` : ""}</td>
            <td style="padding:8px;border-bottom:1px solid #e5e5e5;text-align:center;">${i.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #e5e5e5;text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    const subject = `New Order ${orderNumber} from ${order.customerName} — Glow With Aura`;
    const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
        <div style="background:#022c1c;padding:24px 32px;">
          <h1 style="color:#d4af37;margin:0;font-size:24px;">New Order ${escapeHtml(orderNumber)} — Glow With Aura</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#022c1c;margin:0 0 16px;">Order Details</h2>
          <p style="color:#333;line-height:1.6;">
            <strong>Order Number:</strong> ${escapeHtml(orderNumber)}<br>
            <strong>Customer:</strong> ${escapeHtml(order.customerName)}<br>
            <strong>Email:</strong> ${escapeHtml(order.customerEmail)}<br>
            ${order.customerPhone ? `<strong>Phone:</strong> ${escapeHtml(order.customerPhone)}<br>` : ""}
            ${order.shippingAddress ? `<strong>Shipping Address:</strong> ${escapeHtml(order.shippingAddress)}<br>` : ""}
            ${order.coupon ? `<strong>Coupon:</strong> ${escapeHtml(order.coupon)}<br>` : ""}
            <strong>Payment Method:</strong> ${escapeHtml(order.paymentMethod === "UPI" ? "Scan & Pay" : "Cash on Delivery")}<br>
            ${order.paymentReference ? `<strong>UPI Reference ID:</strong> ${escapeHtml(order.paymentReference)}<br>` : ""}
            <strong>Payment Status:</strong> ${escapeHtml(order.paymentMethod === "UPI" ? "Pending Verification" : "Pending")}<br>
          </p>

          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
            <thead>
              <tr style="background:#f8f5f0;">
                <th style="padding:8px;text-align:left;border-bottom:2px solid #d4af37;">Product</th>
                <th style="padding:8px;text-align:center;border-bottom:2px solid #d4af37;">Qty</th>
                <th style="padding:8px;text-align:right;border-bottom:2px solid #d4af37;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>

          <div style="text-align:right;font-size:14px;line-height:1.8;color:#333;">
            <div>Subtotal: ₹${order.subtotal.toFixed(2)}</div>
            ${order.discount > 0 ? `<div>Discount: −₹${order.discount.toFixed(2)}</div>` : ""}
            <div>Shipping: ${order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}</div>
            ${order.codCharge ? `<div>COD Charge: ₹${order.codCharge.toFixed(2)}</div>` : ""}
            <div style="font-size:18px;font-weight:bold;color:#022c1c;border-top:2px solid #d4af37;margin-top:8px;padding-top:8px;">
              Total: ₹${order.total.toFixed(2)}
            </div>
          </div>

          <p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #e5e5e5;padding-top:16px;">
            This order has been saved to your database. View it in your admin dashboard.
          </p>
        </div>
      </div>
    `;
    const payLabel = order.paymentMethod === "UPI" ? "Scan & Pay" : "Cash on Delivery";
    const payStatus = order.paymentMethod === "UPI" ? "Pending Verification" : "Pending";
    const text = `New Order ${orderNumber}\n\nCustomer: ${order.customerName}\nEmail: ${order.customerEmail}\n${order.customerPhone ? `Phone: ${order.customerPhone}\n` : ""}Payment Method: ${payLabel}\n${order.paymentReference ? `UPI Ref: ${order.paymentReference}\n` : ""}Payment Status: ${payStatus}\n\nItems:\n${order.items.map((i) => `  - ${i.name} x${i.quantity} = ${(i.price * i.quantity).toFixed(2)}`).join("\n")}\n\nSubtotal: ${order.subtotal.toFixed(2)}\nDiscount: ${order.discount.toFixed(2)}\nShipping: ${order.shipping.toFixed(2)}\nCOD Charge: ${order.codCharge.toFixed(2)}\nTotal: ${order.total.toFixed(2)}`;

    let emailStatus = "sent";
    let emailError: string | null = null;
    try {
      await sendEmail(OWNER_EMAIL, subject, html, text);
    } catch (err) {
      emailStatus = "failed";
      emailError = err.message;
    }

    await supabase.from("email_notifications").insert({
      type: "order",
      recipient: OWNER_EMAIL,
      subject,
      payload: { ...order, orderNumber },
      email_status: emailStatus,
      email_error: emailError,
    });

    return new Response(JSON.stringify({ success: true, orderNumber, warning: emailError }), {
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
