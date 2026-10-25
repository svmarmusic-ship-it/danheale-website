// Returns the visitor's country from Vercel's edge header.
// Used by /js/currency.js to pick GBP or USD. Locally the header is missing,
// so country comes back null and the site falls back to GBP.
export default function handler(req, res) {
  const country = req.headers['x-vercel-ip-country'] || null;
  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).json({ country });
}
