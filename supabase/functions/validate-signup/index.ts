import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const ALLOWED_DOMAINS = ["nst.edu.in", "rishihood.edu.in"];

serve(async (req) => {
  try {
    const body = await req.json(); // contains email, user_metadata, etc.
    const email: string | undefined = body?.email;
    if (!email) {
      return new Response(JSON.stringify({ error: { message: "Missing email" } }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const domain = email.split("@").pop()?.toLowerCase();
    if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
      return new Response(JSON.stringify({
        error: {
          message: "Signups from this email domain are not allowed. Please use your official NST or Rishihood email.",
          http_code: 400
        }
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // allow
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: "Invalid request" } }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
});
