import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = "sukhadevetilottama1@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Verify the caller is the admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract the JWT and get the user
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (userData.user.email !== ADMIN_EMAIL) {
      return new Response(JSON.stringify({ error: "Access denied. Admin only." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all data in parallel
    const [inquiriesRes, ordersRes, usersRes, notificationsRes, newsletterRes, productsRes] =
      await Promise.all([
        supabase
          .from("contact_inquiries")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.auth.admin.listUsers(),
        supabase
          .from("email_notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true }),
      ]);

    const users = (usersRes.data?.users ?? []).map((u: Record<string, unknown>) => ({
      id: u.id,
      email: u.email,
      name: (u.user_metadata as Record<string, unknown> | undefined)?.full_name ?? (u.user_metadata as Record<string, unknown> | undefined)?.name ?? "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }));

    return new Response(
      JSON.stringify({
        inquiries: inquiriesRes.data ?? [],
        orders: ordersRes.data ?? [],
        users,
        products: productsRes.count ?? 0,
        notifications: notificationsRes.data ?? [],
        newsletter: newsletterRes.data ?? [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
