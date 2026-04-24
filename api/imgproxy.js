// api/imgproxy.js
// Fetches a TMDB image server-side and returns it as base64
// This completely bypasses the browser CORS restriction on canvas taint

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url param' });
  }

  // Only allow TMDB image domain
  if (!url.startsWith('https://image.tmdb.org/')) {
    return res.status(403).json({ error: 'Only TMDB images allowed' });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream fetch failed' });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Cache for 7 days
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ base64, contentType });
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', detail: String(err) });
  }
}
