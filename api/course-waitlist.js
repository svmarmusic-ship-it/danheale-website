export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, email, hp } = req.body;

  // Honeypot — bot filled the hidden field, silently succeed
  if (hp) {
    return res.status(200).json({ success: true });
  }

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const apiKey = process.env.BREVO_COURSE_API_KEY;
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'api-key': apiKey,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName },
        listIds: [8],
        updateEnabled: true,
      }),
    });

    if (response.status !== 201 && response.status !== 204) {
      const data = await response.json();
      console.error('Brevo error:', data);
      return res.status(500).json({ error: 'Failed to subscribe' });
    }

    // Add tag — fire-and-forget, don't fail the request if this errors
    fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        attributes: { FIRSTNAME: firstName },
        listIds: [8],
        tags: ['course-waitlist'],
      }),
    }).catch(() => {});

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Course waitlist handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
