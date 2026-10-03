/**
 * Notify admin when a customer places an order.
 * 1) Email via FormSubmit (no API key) → linuxos777@gmail.com
 * 2) Optional Supabase Edge Function `notify-order` (Resend) if deployed
 * Failures are logged only — never block checkout.
 */

const ADMIN_EMAIL = "linuxos777@gmail.com";

export interface OrderNotifyPayload {
  orderId: string;
  customerName: string;
  location: string;
  phone: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}

function buildEmailBody(p: OrderNotifyPayload): string {
  const lines = p.items
    .map(
      (i) =>
        `• ${i.name} × ${i.quantity} = $${(i.price * i.quantity).toLocaleString()}`
    )
    .join("\n");

  return [
    `New order on Pitory AI Shop`,
    ``,
    `Order ID: ${p.orderId}`,
    `Customer: ${p.customerName}`,
    `Location: ${p.location}`,
    `Phone: ${p.phone}`,
    `Total: $${p.total.toLocaleString()}`,
    ``,
    `Items:`,
    lines,
    ``,
    `Open Admin Dashboard to confirm the order.`,
  ].join("\n");
}

function buildEmailHtml(p: OrderNotifyPayload): string {
  const rows = p.items
    .map(
      (i) =>
        `<tr><td style="padding:6px;border:1px solid #eee">${escapeHtml(i.name)}</td><td style="padding:6px;border:1px solid #eee">${i.quantity}</td><td style="padding:6px;border:1px solid #eee">$${(i.price * i.quantity).toLocaleString()}</td></tr>`
    )
    .join("");

  return `
  <div style="font-family:system-ui,sans-serif;max-width:560px">
    <h2 style="margin:0 0 12px">New Pitory Order</h2>
    <p><b>Order:</b> ${escapeHtml(p.orderId.slice(0, 8))}…</p>
    <p><b>Customer:</b> ${escapeHtml(p.customerName)}<br/>
    <b>Location:</b> ${escapeHtml(p.location)}<br/>
    <b>Phone:</b> <a href="tel:${escapeHtml(p.phone)}">${escapeHtml(p.phone)}</a></p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead><tr><th align="left">Item</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-size:18px"><b>Total: $${p.total.toLocaleString()}</b></p>
    <p style="color:#666;font-size:13px">Open your Admin Dashboard to confirm or contact the customer.</p>
  </div>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** FormSubmit.co — free email, no API key. First use: confirm email once. */
async function sendViaFormSubmit(p: OrderNotifyPayload) {
  const res = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `New Pitory order — $${p.total.toLocaleString()} from ${p.customerName}`,
      _template: "table",
      name: p.customerName,
      phone: p.phone,
      location: p.location,
      order_id: p.orderId,
      total: `$${p.total.toLocaleString()}`,
      items: p.items
        .map((i) => `${i.name} x${i.quantity}`)
        .join("; "),
      message: buildEmailBody(p),
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`FormSubmit failed: ${res.status} ${t}`);
  }
  return res.json().catch(() => ({}));
}

/** Optional: Supabase Edge Function using Resend */
async function sendViaEdgeFunction(p: OrderNotifyPayload) {
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.functions.invoke("notify-order", {
    body: {
      to: ADMIN_EMAIL,
      subject: `New Pitory order — $${p.total.toLocaleString()} from ${p.customerName}`,
      text: buildEmailBody(p),
      html: buildEmailHtml(p),
      order: p,
    },
  });
  if (error) throw error;
  return data;
}

export async function notifyAdminOfOrder(p: OrderNotifyPayload): Promise<void> {
  const results: string[] = [];

  try {
    await sendViaFormSubmit(p);
    results.push("email");
  } catch (e) {
    console.warn("[notifyAdmin] FormSubmit email failed:", e);
  }

  try {
    await sendViaEdgeFunction(p);
    results.push("edge");
  } catch (e) {
    // Expected if function not deployed / no RESEND key
    console.warn("[notifyAdmin] Edge function skipped or failed:", e);
  }

  if (results.length === 0) {
    console.warn("[notifyAdmin] No notification channel succeeded");
  } else {
    console.info("[notifyAdmin] Sent via:", results.join(", "));
  }
}
