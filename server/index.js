// server/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5174;

// CORS for dev (vite on 5173)
app.use(cors());
app.use(express.json());

// CORS preflight for any /api route
app.options('/api/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');
  res.status(204).end();
});

/* ------------ helpers ------------ */
function looksLikeAudioUrl(u) {
  if (!u) return false;
  try {
    const ext = new URL(u).pathname.split('.').pop().toLowerCase();
    // common browser-decodable formats
    return ['mp3', 'ogg', 'oga', 'wav', 'm4a', 'mpga'].includes(ext);
  } catch {
    return false;
  }
}

async function headIsAudio(url) {
  try {
    const u = new URL(url);
    // cache-bust param so CDNs don’t hand us 304 with no headers
    u.searchParams.set('_mm_head', Date.now().toString());
    const r = await fetch(u.toString(), {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
    });
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    if (r.ok && ct.startsWith('audio/')) return true;

    // Some CDNs still give 304/no headers: do a 1-byte range GET to learn the type
    if (r.status === 304 || !ct) {
      const g = await fetch(u.toString(), {
        method: 'GET',
        redirect: 'follow',
        headers: { Range: 'bytes=0-0', 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
      });
      const gct = (g.headers.get('content-type') || '').toLowerCase();
      return (g.ok || g.status === 206) && gct.startsWith('audio/');
    }

    return false;
  } catch {
    return false;
  }
}

async function jfetch(url, opts = {}) {
  const r = await fetch(url, { redirect: 'follow', ...opts });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return await r.json();
}

/* ------------ sources ------------ */
const FS_BASE = 'https://freesound.org/apiv2';
const OV_BASE = process.env.OPENVERSE_BASE || 'https://api.openverse.org/v1';

// license whitelists
const FS_OK = new Set(['Creative Commons 0', 'Attribution']); // CC0, CC-BY
const OV_OK = new Set(['cc0', 'by', 'pdm']);

/* ------------ search ------------ */
app.get('/api/mood/search', async (req, res) => {
  const q = String(req.query.q || '');
  const min = Number(req.query.min || 5);
  const max = Number(req.query.max || 30);
  const limit = Number(req.query.limit || 12);

  try {
    // 1) Freesound (stable preview MP3s)
    let fsItems = [];
    if (process.env.FREESOUND_TOKEN) {
      const fsUrl =
        `${FS_BASE}/search/text/?query=${encodeURIComponent(q)}` +
        `&filter=duration:[${min} TO ${max}]` +
        `&fields=id,name,previews,username,tags,license,duration,url` +
        `&sort=rating_desc&page_size=${limit}`;

      const fsJson = await jfetch(fsUrl, {
        headers: { Authorization: `Token ${process.env.FREESOUND_TOKEN}` },
      });

      fsItems = (fsJson.results || [])
        .filter(r => FS_OK.has(r.license))
        .map(r => ({
          id: `fs_${r.id}`,
          title: r.name,
          author: r.username,
          duration: r.duration,
          license: r.license,
          source: 'freesound',
          source_url: r.url,
          src: r.previews?.['preview-hq-mp3'] || r.previews?.['preview-lq-mp3'] || null,
          needsAttribution: r.license === 'Attribution',
        }))
        .filter(x => !!x.src);
    }

    // 2) Openverse (only keep direct file URLs with valid extensions)
    const ovUrl =
      `${OV_BASE}/audio/?q=${encodeURIComponent(q)}` +
      `&license=cc0,by,pdm&duration_from=${min}&duration_to=${max}` +
      `&page_size=${limit}`;

    const ovJson = await jfetch(ovUrl);
    const ovItems = (ovJson.results || []).flatMap(r => {
      if (!OV_OK.has((r.license || '').toLowerCase())) return [];

      const candidates = [];
      if (Array.isArray(r.audio_set)) {
        for (const a of r.audio_set) if (a?.url) candidates.push(a.url);
      }
      if (r.url) candidates.push(r.url);

      const fileUrl = candidates.find(looksLikeAudioUrl);
      if (!fileUrl) return []; // skip landing pages or playlists

      return [{
        id: `ov_${r.id}`,
        title: r.title || r.foreign_landing_url,
        author: r.creator || r.source,
        duration: r.duration || null,
        license: (r.license || '').toUpperCase(),
        source: 'openverse',
        source_url: r.foreign_landing_url,
        src: fileUrl,
        needsAttribution: (r.license || '').toLowerCase() === 'by',
      }];
    });

    // Merge: Freesound first then Openverse; de-dup by src
    const seen = new Set();
    const merged = [...fsItems, ...ovItems].filter(x => {
      if (!x.src || seen.has(x.src)) return false;
      seen.add(x.src);
      return true;
    });

    res.json({ results: merged.slice(0, limit * 2) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'search_failed', detail: e.message });
  }
});

/* ------------ stream proxy (HEAD + GET) ------------ */

// HEAD proxy for stream: quick content-type check without body, NO CACHE
app.head('/api/mood/stream', async (req, res) => {
  try {
    const src = String(req.query.src || '');
    if (!src || !/^https?:\/\//i.test(src)) return res.status(400).end();

    // quick validation; bypass caches
    const ok = await headIsAudio(src);
    if (!ok) return res.status(415).end();

    // HEAD responses themselves should NOT be cached to avoid 304 loops
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'audio/*');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    return res.status(200).end();
  } catch (e) {
    console.error('[head_stream_failed]', e.message);
    return res.status(500).end();
  }
});

// GET proxy for stream: pipes audio bytes; cacheable
app.get('/api/mood/stream', async (req, res) => {
  try {
    const src = String(req.query.src || '');
    if (!src || !/^https?:\/\//i.test(src)) {
      return res.status(400).json({ error: 'invalid_src' });
    }

    // If URL doesn't look like a file, still allow via content-type check
    if (!looksLikeAudioUrl(src)) {
      const okHead = await headIsAudio(src);
      if (!okHead) return res.status(415).json({ error: 'not_audio' });
    }

    // Forward Range headers to support scrubbing and partials
    const headers = {};
    const range = req.headers['range'];
    if (range) headers['Range'] = range;

    const upstream = await fetch(src, { redirect: 'follow', headers });
    if (!upstream.ok && upstream.status !== 206) return res.status(upstream.status).end();

    const ct = (upstream.headers.get('content-type') || '').toLowerCase();
    if (!ct.startsWith('audio/')) {
      return res.status(415).json({ error: 'not_audio', contentType: ct || 'unknown' });
    }

    // Mirror relevant headers
    res.status(upstream.status);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', ct || 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // ok to cache GET
    const cr = upstream.headers.get('content-range');
    if (cr) res.setHeader('Content-Range', cr);
    const ar = upstream.headers.get('accept-ranges');
    if (ar) res.setHeader('Accept-Ranges', ar);
    const cl = upstream.headers.get('content-length');
    if (cl) res.setHeader('Content-Length', cl);

    // Pipe body
    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (e) {
    console.error('[stream_failed]', e.message);
    res.status(500).json({ error: 'stream_failed' });
  }
});

/* ------------ guardrail ------------ */
app.get('/api/mood/bbc', (_req, res) => {
  res.status(451).json({ error: 'BBC requires commercial license via Pro Sound Effects.' });
});

app.listen(PORT, () => {
  console.log(`[MoodMixer] server running on http://localhost:${PORT}`);
});
