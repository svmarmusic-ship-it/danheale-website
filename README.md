# danheale.co.uk

Single-page site for Dan Heale — ghost production, sample packs, and music production services.

## Running locally

No build step needed. Just open `index.html` in a browser:

```
open index.html
```

Or use a local server (avoids any CORS issues with the contact form):

```
npx serve .
```

---

## Deploying to Vercel

1. Install the Vercel CLI if you haven't already:
   ```
   npm i -g vercel
   ```

2. From the project root, run:
   ```
   vercel
   ```

3. Follow the prompts. Choose "No framework" when asked.

4. For subsequent deploys:
   ```
   vercel --prod
   ```

---

## Connecting the danheale.co.uk domain

1. Go to your Vercel dashboard → Project → Settings → Domains
2. Add `danheale.co.uk` and `www.danheale.co.uk`
3. Vercel will give you DNS records to add at your domain registrar
4. Add those records (usually takes 5–30 minutes to propagate)

---

## Setting up the contact form (Formspree)

The form in `index.html` currently has `action="#"` — it will show a success state in preview but won't actually send emails until you connect Formspree.

1. Sign up at https://formspree.io (free tier: 50 submissions/month)
2. Create a new form
3. Copy the endpoint URL — it looks like `https://formspree.io/f/XXXXXXXX`
4. In `index.html`, find this comment:

   ```html
   <!-- FORMSPREE SETUP: -->
   ```

5. Replace `action="#"` on the `<form>` element with your endpoint URL:

   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/XXXXXXXX" ...>
   ```

That's it — submissions will email you with no server required.

---

## Adding Lemonsqueezy product links

Product cards in the Shop section currently have `href="#"`. To connect them to real products:

1. Create your products on Lemonsqueezy at https://lemonsqueezy.com
2. For each product, copy the checkout URL from the product dashboard
3. In `index.html`, find this comment:

   ```html
   <!-- LEMONSQUEEZY: Replace each href="#" ... -->
   ```

4. Replace `href="#"` on each `.product-card` anchor with the product checkout URL:

   ```html
   <a href="https://danheale.lemonsqueezy.com/checkout/buy/YOUR_PRODUCT_ID" class="product-card" ...>
   ```

For Lemon.js overlay checkout (opens a modal instead of redirecting):
1. Add the Lemon.js script before `</body>`: `<script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>`
2. Add `data-lemonsqueezy-checkout` to each product link

---

## Swapping in real reviews

In `index.html`, find this comment:

```html
<!-- REVIEWS: Placeholder reviews — replace with real client reviews. -->
```

For each `.review-card`, update:
- `.review-text` — the review quote (keep the `"` marks and italic style)
- `.author-name` — client's first name or handle
- `.author-detail` — the service they used
- `.review-avatar` — the first letter of their name

---

## Adding real social links

In `index.html`, find this comment in the footer:

```html
<!-- SOCIAL LINKS: Replace each href="#" with your real profile URLs -->
```

Replace each `href="#"` with the actual URL for each platform.

---

## Adding an OG image

Replace `https://danheale.co.uk/og-image.jpg` in the `<head>` meta tags with a real image.
Recommended size: 1200 × 630px. Place the file in the project root as `og-image.jpg`.
