# Admin order email notifications

When a customer places an order, the site notifies **linuxos777@gmail.com**.

## Method 1 — FormSubmit (works now, no API key)

Checkout already posts to FormSubmit after a successful order.

1. Place a **test order** once.
2. Check the admin inbox for an email from FormSubmit and **confirm** the address (one-time).
3. After confirmation, every new order sends an email with name, phone, location, items, and total.

## Method 2 — Resend + Edge Function (optional, more reliable)

1. Create a free account at https://resend.com and get an API key.
2. Install Supabase CLI and login.
3. Deploy:

```bash
supabase functions deploy notify-order --no-verify-jwt
supabase secrets set RESEND_API_KEY=re_your_key_here
supabase secrets set ADMIN_EMAIL=linuxos777@gmail.com
```

4. Optional custom from-address (verified domain on Resend):

```bash
supabase secrets set FROM_EMAIL="Pitory <orders@yourdomain.com>"
```

## In-app notification

While the admin dashboard is open, it auto-refreshes every 30 seconds and shows a toast for new orders.
