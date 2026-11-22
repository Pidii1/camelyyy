// camelyyy cameras: looks, formats and realistic (unbranded) camera drawings
export const CAMS = [
  { id: 'classic', name: 'CLASSIC 135', kind: 'slr', body: '#d9d4c8', accent: '#2a2622', both: true, cat: '135', aspect: [2, 3], desc: 'Clean everyday film. True colours and soft grain.',
    look: { contrast: 1.06, sat: 1.06, fade: 0.03, grain: 0.06, vig: 0.22, shad: [0, 0.01, 0.025], high: [0.025, 0.012, 0] }, leak: 0.2 },
  { id: 'gold', name: 'GOLD 200', kind: 'compact', body: '#e8c27a', accent: '#7a4a1a', both: true, cat: '135', aspect: [2, 3], desc: 'Warm, sunny tones like a cheap drugstore roll.',
    look: { temp: 0.35, contrast: 1.08, sat: 1.15, fade: 0.05, grain: 0.08, vig: 0.3, high: [0.06, 0.03, -0.02], shad: [0.01, 0, -0.01] }, leak: 0.55 },
  { id: 'grain', name: 'GRAIN 400', kind: 'slr', body: '#3a3632', accent: '#c98a5b', both: true, cat: '135', aspect: [2, 3], desc: 'Gritty high-speed film. Loves night and neon.',
    look: { contrast: 1.18, sat: 0.92, fade: 0.04, grain: 0.22, vig: 0.35, shad: [0, 0.02, 0.04], halation: 0.3 }, leak: 0.25 },
  { id: 'instw', name: 'INSTANT W', kind: 'instant', body: '#f4ede1', accent: '#c96a4a', cat: 'Instant', aspect: [4, 5], border: 'instant', desc: 'Wide instant print with a thick white border.',
    look: { exp: 0.15, contrast: 0.9, sat: 0.86, fade: 0.12, temp: 0.1, tint: -0.05, shad: [-0.01, 0.03, 0.02], high: [0.05, 0.04, 0], grain: 0.06, vig: 0.25, soft: 0.3 }, leak: 0.35 },
  { id: 'instsq', name: 'INSTANT SQ', kind: 'instant', body: '#9bc8e8', accent: '#f4ede1', cat: 'Instant', aspect: [1, 1], border: 'instantsq', desc: 'Square instant print, soft and faded.',
    look: { exp: 0.12, contrast: 0.9, sat: 0.82, fade: 0.14, temp: -0.1, shad: [0, 0.02, 0.04], high: [0.02, 0.03, 0.05], grain: 0.06, vig: 0.25, soft: 0.3 }, leak: 0.3 },
  { id: 'disposa', name: 'DISPOSA', kind: 'disp', body: '#2f7d4f', accent: '#e8c46a', both: true, cat: 'Disposable', aspect: [2, 3], flash: true, desc: 'Throwaway camera: harsh flash, green tint and light leaks.',
    look: { exp: 0.1, temp: -0.05, tint: -0.25, contrast: 1.12, sat: 1.2, fade: 0.06, grain: 0.14, vig: 0.42, ca: 0.004 }, leak: 0.75 },
  { id: 'half', name: 'HALF 72', kind: 'compact', body: '#b9b2a4', accent: '#a83a2e', cat: '135', aspect: [3, 4], border: 'half', shots: 2, desc: 'Half-frame: two photos side by side on one frame.',
    look: { temp: 0.12, contrast: 1.06, sat: 1.05, fade: 0.05, grain: 0.09, vig: 0.28 }, leak: 0.3 },
  { id: 'slide', name: 'SLIDE 100', kind: 'slr', body: '#24324a', accent: '#c96a4a', cat: '135', aspect: [2, 3], border: 'slide', desc: 'Slide film. Deep blue skies and punchy colour, in a plastic slide mount.',
    look: { contrast: 1.25, sat: 1.5, temp: -0.1, grain: 0.05, vig: 0.32, shad: [0, 0, 0.04] }, leak: 0.1 },
  { id: 'ccd', name: 'CCD 03', kind: 'digi', body: '#c9cdd4', accent: '#3b6fd1', both: true, cat: 'Digital', aspect: [3, 4], stampStyle: 'ccd', desc: '2003 pocket digicam. Cool tones and an orange date.',
    look: { contrast: 1.1, sat: 1.22, temp: -0.2, grain: 0.04, vig: 0.1, ca: 0.0025 }, leak: 0 },
  { id: 'toy', name: 'TOY 3D', kind: 'toy', body: '#e8a0b4', accent: '#e8c46a', cat: 'Special', aspect: [3, 4], border: 'toy', desc: 'Four-lens toy camera. Makes a wiggle GIF.',
    look: { contrast: 1.15, sat: 1.25, grain: 0.1, vig: 0.5, fade: 0.04 }, leak: 0.45 },
  { id: 'medium', name: 'MEDIUM 66', kind: 'medium', body: '#4a4440', accent: '#d9d4c8', cat: '120', aspect: [1, 1], border: 'medium', desc: 'Square 6x6 medium format with film edge marks.',
    look: { contrast: 1.05, sat: 0.95, fade: 0.04, grain: 0.05, vig: 0.16, high: [0.02, 0.01, 0] }, leak: 0.15 },
  { id: 'mono', name: 'MONO 400', kind: 'slr', body: '#1b1b1b', accent: '#f4ede1', cat: '135', aspect: [2, 3], desc: 'Black and white with deep shadows.',
    look: { mono: true, contrast: 1.3, grain: 0.18, vig: 0.35 }, leak: 0.1 },
  { id: 'fish', name: 'FISH 180', kind: 'fish', body: '#e8c46a', accent: '#1a1714', cat: 'Special', aspect: [1, 1], desc: 'Round fisheye view, everything bends.',
    look: { contrast: 1.12, sat: 1.2, temp: -0.05, grain: 0.06, vig: 0.15, fish: 1 }, leak: 0.2 },
  { id: 'night', name: 'NIGHT FLASH', kind: 'compact', body: '#1e1e1e', accent: '#c94a3a', cat: 'Digital', aspect: [3, 4], flash: true, desc: 'Bright direct flash, party photo look.',
    look: { exp: 0.2, contrast: 1.25, sat: 1.1, temp: -0.05, vig: 0.55, halation: 0.2, grain: 0.06 }, leak: 0.1 },
  { id: 'expired', name: 'EXPIRED 200', kind: 'compact', body: '#b8a98c', accent: '#6a4a3a', cat: '135', aspect: [2, 3], dust: true, desc: 'Film that sat in a drawer for years. Faded, magenta and unpredictable.',
    look: { exp: 0.05, temp: 0.18, tint: 0.3, contrast: 0.9, sat: 0.78, fade: 0.16, grain: 0.16, vig: 0.38, shad: [0.04, -0.01, 0.06], high: [0.06, 0.02, -0.03] }, leak: 0.7 },
  { id: 'pano', name: 'PANO 65', kind: 'pano', body: '#2c2a28', accent: '#c98a5b', cat: 'Special', aspect: [65, 24], desc: 'Ultra-wide panorama frame. Made for skylines and beaches.',
    look: { temp: 0.08, contrast: 1.1, sat: 1.08, fade: 0.03, grain: 0.07, vig: 0.4, high: [0.03, 0.015, 0] }, leak: 0.25 },
  { id: 'sepia', name: 'SEPIA 1920', kind: 'fold', body: '#2a2420', accent: '#b08a5a', cat: 'Special', aspect: [4, 5], dust: true, desc: 'Antique brown-toned print from a folding camera.',
    look: { mono: true, tone: [1.08, 0.86, 0.62], contrast: 1.12, fade: 0.12, grain: 0.15, vig: 0.55, soft: 0.25 }, leak: 0.15 },
  { id: 'xpro', name: 'XPRO 100', kind: 'slr', body: '#c9472e', accent: '#2a2622', cat: '135', aspect: [2, 3], desc: 'Cross-processed slide film: yellow highlights, cyan shadows, wild contrast.',
    look: { contrast: 1.32, sat: 1.35, tint: -0.12, shad: [-0.03, 0.03, 0.08], high: [0.07, 0.07, -0.08], grain: 0.08, vig: 0.4, mtx: [1.05, 0, -0.05, 0, 1.05, -0.05, -0.08, 0.05, 0.95] }, leak: 0.3 },
  { id: 'infra', name: 'INFRA 750', kind: 'slr', body: '#1c1a19', accent: '#8a1a1a', cat: 'Special', aspect: [2, 3], desc: 'Infrared film: green leaves turn candy pink, skies go deep.',
    look: { contrast: 1.15, sat: 1.25, grain: 0.1, vig: 0.3, halation: 0.25, mtx: [0.25, 0.85, 0, 0.55, 0.35, 0.05, 0.1, 0.1, 0.9] }, leak: 0.1 },
  { id: 'hicon', name: 'HICON 3200', kind: 'slr', body: '#111111', accent: '#e8e2d8', cat: '135', aspect: [2, 3], desc: 'Pushed black and white. Inky blacks and heavy grain.',
    look: { mono: true, tone: [1, 1, 1], exp: 0.1, contrast: 1.65, grain: 0.32, vig: 0.5 }, leak: 0.05 },
  { id: 'soft', name: 'SOFT 160', kind: 'slr', body: '#cfcac0', accent: '#2a2622', cat: '135', aspect: [2, 3], desc: 'Gentle portrait film. Creamy skin tones and soft pastels.',
    look: { contrast: 0.95, sat: 0.9, temp: 0.08, fade: 0.05, grain: 0.05, vig: 0.18, soft: 0.1, shad: [0.01, 0.01, 0.02], high: [0.03, 0.02, 0.01] }, leak: 0.15 },
  { id: 'tungsten', name: 'TUNGSTEN 800', kind: 'slr', body: '#1d2230', accent: '#5a7ab0', cat: '135', aspect: [2, 3], desc: 'Cinema film for night: cool tones and glowing red halos around lights.',
    look: { temp: -0.35, contrast: 1.1, sat: 1.1, grain: 0.12, vig: 0.3, halation: 0.65, shad: [0, 0.02, 0.05] }, leak: 0.1 },
  { id: 'redscale', name: 'REDSCALE 50', kind: 'compact', body: '#6a1f1c', accent: '#e8a05a', cat: '135', aspect: [2, 3], desc: 'Film loaded backwards: everything glows red, orange and amber.',
    look: { contrast: 1.12, sat: 1.1, grain: 0.12, vig: 0.4, fade: 0.04, mtx: [1.05, 0.25, 0, 0.55, 0.35, 0, 0.18, 0.08, 0.06] }, leak: 0.35 },
  { id: 'lomo', name: 'LOMO 100', kind: 'compact', body: '#2a2a2a', accent: '#c9c9c9', cat: 'Special', aspect: [2, 3], desc: 'Plastic-lens snapshot: super saturated colour and a heavy dark tunnel.',
    look: { contrast: 1.3, sat: 1.45, grain: 0.1, vig: 0.78, high: [0.04, 0.03, -0.02], shad: [-0.01, 0.02, 0.05], soft: 0.15 }, leak: 0.4 },
  { id: 'pinhole', name: 'PINHOLE', kind: 'box', body: '#8a5f3a', accent: '#2a1d14', cat: 'Special', aspect: [1, 1], dust: true, desc: 'A wooden box with a tiny hole instead of a lens. Dreamy, soft and dark at the edges.',
    look: { contrast: 1.05, sat: 0.8, temp: 0.15, fade: 0.06, grain: 0.12, vig: 0.85, soft: 0.9 }, leak: 0.2 },
  { id: 'dream', name: 'DREAM 400', kind: 'compact', body: '#e8c4d8', accent: '#b89ad8', cat: 'Special', aspect: [3, 4], desc: 'Washed-out pastel film with a soft glow. Pink shadows, milky highlights.',
    look: { exp: 0.15, contrast: 0.8, sat: 0.85, fade: 0.2, temp: 0.05, tint: 0.08, shad: [0.04, 0.02, 0.06], high: [0.05, 0.03, 0.04], soft: 0.35, halation: 0.2, grain: 0.06, vig: 0.2 }, leak: 0.45 },
  { id: 'print', name: 'PRINT 4x6', kind: 'compact', body: '#4a4a4a', accent: '#c94a3a', cat: 'Disposable', aspect: [2, 3], border: 'print', desc: 'One-hour photo lab print from the 90s, with a thin white edge.',
    look: { temp: 0.12, contrast: 1.08, sat: 1.08, fade: 0.04, grain: 0.06, vig: 0.15, high: [0.03, 0.015, 0] }, leak: 0.3 },
  { id: 'original', name: 'ORIGINAL', kind: 'digi', body: '#2a2a2c', accent: '#8a8a90', cat: 'Digital', aspect: [3, 4], both: true, defaults: { stamp: false, leaks: false }, desc: 'No film look at all: your phone camera with every camelyyy tool. Takes photos and videos.',
    look: {}, leak: 0 },
  { id: 'collage', name: 'COLLAGE 4', kind: 'toy', body: '#3a3a3a', accent: '#e8c46a', cat: 'Special', aspect: [3, 4], shots: 4, border: 'collage', desc: 'Four quick shots, printed together in a 2×2 grid.',
    look: { contrast: 1.12, sat: 1.15, grain: 0.08, vig: 0.3, fade: 0.03 }, leak: 0.35 },
  { id: 'booth', name: 'BOOTH 4', kind: 'box', body: '#c9473a', accent: '#f4ede1', cat: 'Special', aspect: [4, 3], shots: 4, border: 'booth', desc: 'Photobooth strip: four poses in a row, timer between shots.',
    look: { exp: 0.1, contrast: 1.15, sat: 1.05, grain: 0.08, vig: 0.2, fade: 0.04, temp: 0.05 }, leak: 0, flash: true },
  { id: 'mini', name: 'MINI INSTANT', kind: 'instant', body: '#a8d8d0', accent: '#f4ede1', cat: 'Instant', aspect: [46, 62], border: 'mini', desc: 'Pocket-sized instant print: tall, bright and cheerful.',
    look: { exp: 0.18, contrast: 0.95, sat: 1.05, fade: 0.08, temp: 0.04, shad: [0, 0.02, 0.03], high: [0.04, 0.03, 0.01], grain: 0.05, vig: 0.2, soft: 0.2 }, leak: 0.3 },
  { id: 'pola', name: 'POLA 600', kind: 'instant', body: '#2a2624', accent: '#f4ede1', cat: 'Instant', aspect: [1, 1], border: 'pola', desc: 'Classic square instant with the thick white bottom. Soft, warm and a bit unpredictable.',
    look: { exp: 0.08, contrast: 0.88, sat: 0.8, fade: 0.15, temp: 0.12, tint: 0.05, shad: [0.02, 0.03, 0.05], high: [0.06, 0.04, 0], grain: 0.07, vig: 0.35, soft: 0.35 }, leak: 0.5 },
  { id: 'toy120', name: 'TOY 120', kind: 'medium', body: '#2a2a2a', accent: '#c94a3a', cat: '120', aspect: [1, 1], desc: 'Plastic medium-format toy: dreamy blur, dark corners and lots of light leaks.',
    look: { contrast: 1.2, sat: 1.2, grain: 0.12, vig: 0.8, soft: 0.3, fade: 0.04, high: [0.04, 0.02, -0.01] }, leak: 0.85 },
  { id: 'pro67', name: '67 PRO', kind: 'slr', body: '#1e1e1e', accent: '#d9d4c8', cat: '120', aspect: [4, 5], border: 'medium', edge: 'CAMELYYY 120   6×7   ▸ 4', desc: 'Big 6×7 medium format: smooth tones, fine grain and film edge marks.',
    look: { contrast: 1.04, sat: 0.98, fade: 0.03, grain: 0.035, vig: 0.12, high: [0.02, 0.012, 0], shad: [0, 0.008, 0.02] }, leak: 0.1 },
  { id: 'wide22', name: 'WIDE 22', kind: 'disp', body: '#3a6fb0', accent: '#f4ede1', cat: 'Disposable', aspect: [2, 3], both: true, flash: true, desc: 'Ultra-wide disposable: bent edges, flash and big skies.',
    look: { exp: 0.08, contrast: 1.12, sat: 1.15, fade: 0.05, grain: 0.12, vig: 0.45, fish: 0.4, temp: 0.04 }, leak: 0.6 },
  { id: 'pocket', name: 'POCKET 28', kind: 'compact', body: '#151515', accent: '#8a8a8a', cat: '135', aspect: [2, 3], both: true, desc: 'Premium 28mm pocket camera: crisp, contrasty, slightly cool. Photos and videos.',
    look: { contrast: 1.22, sat: 0.95, temp: -0.06, grain: 0.09, vig: 0.22, shad: [0, 0.005, 0.02] }, leak: 0.1 },
  { id: 'super8', name: 'SUPER 8', kind: 'cine', body: '#c9a46a', accent: '#4a3a2a', cat: 'Video', video: true, aspect: [3, 4], desc: '8mm home movie with gate flicker.',
    look: { temp: 0.3, contrast: 1.15, sat: 0.9, fade: 0.1, grain: 0.25, vig: 0.55, soft: 0.4 }, leak: 0.4 },
  { id: 'vhs', name: 'VHS 89', kind: 'vhs', body: '#2a2a2a', accent: '#c94a3a', cat: 'Video', video: true, aspect: [3, 4], overlay: 'vhs', desc: 'Camcorder tape: colour bleed, REC and the date.',
    look: { sat: 1.35, contrast: 1.05, ca: 0.006, scan: 0.35, soft: 0.6, grain: 0.12, vig: 0.2 }, leak: 0 },
  { id: 'dv', name: 'DV 2000', kind: 'digi', body: '#8a8f99', accent: '#7fb0d8', cat: 'Video', video: true, aspect: [3, 4], overlay: 'dv', desc: 'Early digital video, sharp and cool.',
    look: { temp: -0.15, contrast: 1.1, sat: 1.05, grain: 0.05, scan: 0.08 }, leak: 0 },
  { id: 'cine16', name: 'CINE 16', kind: 'cine', body: '#3a3632', accent: '#d9d4c8', cat: 'Video', video: true, aspect: [9, 16], desc: '16mm film: cinematic grain and gate.',
    look: { temp: 0.15, contrast: 1.2, sat: 0.85, fade: 0.06, grain: 0.2, vig: 0.45, halation: 0.25 }, leak: 0.25 },
  { id: 'cctv', name: 'CCTV 24', kind: 'cctv', body: '#e8e6e2', accent: '#2a2a2a', cat: 'Video', video: true, aspect: [3, 4], overlay: 'cctv', desc: 'Security camera: washed-out colour, wide lens, CAM 01 and the clock.',
    look: { sat: 0.35, tint: -0.15, contrast: 1.2, scan: 0.25, grain: 0.18, soft: 0.4, fish: 0.25, vig: 0.25 }, leak: 0 },
];
export const camById = (id) => CAMS.find((c) => c.id === id) || CAMS[1];
export const CATS = ['All', '135', '120', 'Instant', 'Disposable', 'Digital', 'Special', 'Video'];
export const FOCALS = [['16mm', 1], ['24mm', 1.25], ['28mm', 1.4], ['35mm', 1.65], ['50mm', 2.3]];
export const LENSES = [
  { id: 'fisheye', name: 'Fisheye', sub: 'Round 180° view' },
  { id: 'star', name: 'Starburst', sub: 'Lights turn into stars' },
  { id: 'prism', name: 'Prism', sub: 'Rainbow flare at the edge' },
  { id: 'nd', name: 'ND filter', sub: 'Darker, moodier light' },
  { id: 'soft', name: 'Soft focus', sub: 'Dreamy glow' },
  { id: 'wide', name: 'Wide fisheye', sub: 'Curved ultra-wide, no circle' },
];
export const FLASH_COLORS = ['#ffffff', '#ff8fb3', '#8fb3ff', '#ffd27a', '#8fe0a8', '#c9b0ff'];

// ---- realistic camera drawings ----
let uid = 0;
const knurl = (cx, cy, r) => Array.from({ length: 24 }, (_, a) => { const t = (a / 24) * Math.PI * 2; return `<line x1="${(cx + r * Math.cos(t)).toFixed(1)}" y1="${(cy + r * Math.sin(t)).toFixed(1)}" x2="${(cx + r * 1.12 * Math.cos(t)).toFixed(1)}" y2="${(cy + r * 1.12 * Math.sin(t)).toFixed(1)}" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>`; }).join('');
function lens(u, cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r * 1.14}" fill="url(#${u}ch)"/>${knurl(cx, cy, r)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}rg)"/><circle cx="${cx}" cy="${cy}" r="${r * 0.74}" fill="#0b0b0e"/><circle cx="${cx}" cy="${cy}" r="${r * 0.64}" fill="url(#${u}gl)"/><circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="none" stroke="#c9a08a" stroke-opacity=".35" stroke-width="1"/><ellipse cx="${cx - r * 0.22}" cy="${cy - r * 0.24}" rx="${r * 0.2}" ry="${r * 0.12}" fill="#fff" opacity=".75" transform="rotate(-30 ${cx - r * 0.22} ${cy - r * 0.24})"/><circle cx="${cx + r * 0.26}" cy="${cy + r * 0.22}" r="${r * 0.06}" fill="#fff" opacity=".45"/>`;
}
const btn = (u, x, y, r, col) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col || `url(#${u}ch)`}"/><circle cx="${x}" cy="${y - r * 0.25}" r="${r * 0.55}" fill="#fff" opacity=".35"/>`;
// Real camera photos (web/img/cams/<id>.webp). camDrawing() is the old drawn fallback.
const PHOTOS = new Set(['classic','gold','grain','instw','instsq','disposa','half','slide','ccd','toy','medium','mono','fish','night','super8','vhs','dv','cine16','expired','pano','sepia','xpro','infra','hicon','soft','tungsten','redscale','lomo','pinhole','dream','print','cctv','original','collage','booth','mini','pola','toy120','pro67','wide22','pocket']);
export function camSVG(c, w = 64) {
  if (!PHOTOS.has(c.id)) return camDrawing(c, w);
  const h = Math.round(w * 0.75);
  return `<img class="camsvg camimg" src="img/cams/${c.id}.webp" width="${w}" height="${h}" alt="" draggable="false" decoding="async">`;
}
export function camDrawing(c, w = 64) {
  const u = 'cm' + uid++, { kind, body, accent } = c, h = Math.round(w * 0.75);
  const D = `<defs><linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${body}"/><stop offset=".55" stop-color="${body}"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient><linearGradient id="${u}bh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".25" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient><linearGradient id="${u}ch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfbfb"/><stop offset=".4" stop-color="#b9b9bd"/><stop offset=".55" stop-color="#7d7d84"/><stop offset="1" stop-color="#e2e2e6"/></linearGradient><linearGradient id="${u}ac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient><pattern id="${u}lt" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="${accent}"/><circle cx="1" cy="1" r=".7" fill="#000" opacity=".35"/></pattern><radialGradient id="${u}gl" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#e2b8a0"/><stop offset=".25" stop-color="#5a3a3a"/><stop offset=".6" stop-color="#140f12"/><stop offset="1" stop-color="#05060c"/></radialGradient><radialGradient id="${u}rg" cx="50%" cy="50%" r="50%"><stop offset=".7" stop-color="#2a2a2e"/><stop offset=".86" stop-color="#5a5a62"/><stop offset="1" stop-color="#151518"/></radialGradient></defs>`;
  const S = {
    slr: `<path d="M30 18 L36 6 H60 L66 18 Z" fill="url(#${u}ch)"/><rect x="40" y="9" width="16" height="7" rx="1.5" fill="#1a1a1e"/><rect x="6" y="18" width="84" height="44" rx="7" fill="url(#${u}ch)"/><rect x="6" y="27" width="84" height="27" fill="url(#${u}lt)"/><rect x="6" y="18" width="84" height="44" rx="7" fill="url(#${u}bh)"/><rect x="12" y="11" width="12" height="7" rx="2" fill="url(#${u}ch)"/><rect x="70" y="10" width="14" height="8" rx="2" fill="url(#${u}ch)"/>${btn(u, 76, 9, 3.2, '#c93a2e')}${lens(u, 48, 40, 15)}`,
    compact: `<rect x="6" y="14" width="84" height="48" rx="12" fill="url(#${u}b)"/><rect x="6" y="14" width="84" height="48" rx="12" fill="url(#${u}bh)"/><rect x="10" y="44" width="24" height="14" rx="5" fill="url(#${u}lt)"/><rect x="14" y="20" width="22" height="12" rx="3" fill="#1a1a1e"/><rect x="16" y="22" width="18" height="8" rx="2" fill="#3a2f2a"/>${btn(u, 74, 12, 4)}<rect x="42" y="18" width="10" height="7" rx="1.5" fill="#fffdf2" opacity=".9"/>${lens(u, 62, 40, 15)}`,
    instant: `<rect x="10" y="6" width="76" height="58" rx="10" fill="url(#${u}b)"/><rect x="10" y="6" width="76" height="58" rx="10" fill="url(#${u}bh)"/><rect x="10" y="48" width="76" height="16" fill="url(#${u}ac)"/><rect x="24" y="56" width="48" height="4" rx="2" fill="#141414"/><rect x="64" y="12" width="16" height="10" rx="2" fill="#f4f1e8"/><rect x="16" y="12" width="12" height="9" rx="2" fill="#1a1a1e"/>${lens(u, 48, 30, 14)}${btn(u, 78, 44, 3.4, '#c93a2e')}`,
    disp: `<rect x="6" y="16" width="84" height="44" rx="5" fill="url(#${u}b)"/><rect x="6" y="16" width="34" height="44" rx="5" fill="url(#${u}ac)"/><rect x="6" y="16" width="84" height="44" rx="5" fill="url(#${u}bh)"/><rect x="11" y="22" width="24" height="15" rx="2" fill="#f7f4ea"/><rect x="66" y="10" width="14" height="7" rx="1.5" fill="#1d1d20"/><circle cx="77" cy="24" r="4" fill="#222"/>${lens(u, 56, 40, 11)}<path d="M12 44 h22 M12 48 h18 M12 52 h20" stroke="#fff" stroke-opacity=".55" stroke-width="1.6"/>`,
    digi: `<rect x="6" y="12" width="84" height="50" rx="9" fill="url(#${u}b)"/><rect x="6" y="12" width="84" height="50" rx="9" fill="url(#${u}bh)"/><rect x="56" y="18" width="28" height="20" rx="3" fill="#0f1420"/><rect x="58" y="20" width="24" height="16" rx="2" fill="#4a5f7a"/><rect x="58" y="44" width="24" height="5" rx="2.5" fill="url(#${u}ac)"/><rect x="64" y="7" width="16" height="5" rx="1.5" fill="url(#${u}ch)"/>${lens(u, 30, 37, 16)}`,
    toy: `<rect x="4" y="18" width="88" height="42" rx="9" fill="url(#${u}b)"/><rect x="4" y="18" width="88" height="42" rx="9" fill="url(#${u}bh)"/><rect x="34" y="10" width="28" height="9" rx="2" fill="url(#${u}ac)"/>${[19, 38, 58, 77].map((x) => lens(u, x, 38, 8.2)).join('')}${btn(u, 82, 15, 3.2, '#e8c46a')}`,
    medium: `<rect x="22" y="4" width="52" height="66" rx="5" fill="url(#${u}ch)"/><rect x="22" y="12" width="52" height="54" fill="url(#${u}lt)"/><rect x="22" y="4" width="52" height="66" rx="5" fill="url(#${u}bh)"/><rect x="24" y="0" width="48" height="8" rx="2" fill="#1a1a1e"/>${lens(u, 48, 22, 9)}${lens(u, 48, 48, 12)}`,
    cine: `<circle cx="30" cy="16" r="13" fill="url(#${u}ch)"/><circle cx="58" cy="16" r="13" fill="url(#${u}ch)"/><circle cx="30" cy="16" r="4" fill="#1a1a1e"/><circle cx="58" cy="16" r="4" fill="#1a1a1e"/><rect x="12" y="28" width="62" height="34" rx="6" fill="url(#${u}b)"/><rect x="12" y="28" width="62" height="34" rx="6" fill="url(#${u}bh)"/><rect x="20" y="34" width="22" height="10" rx="2" fill="url(#${u}lt)"/><path d="M74 36 L90 30 V60 L74 54 Z" fill="url(#${u}ch)"/>${lens(u, 82, 45, 7)}`,
    vhs: `<rect x="4" y="20" width="66" height="40" rx="9" fill="url(#${u}b)"/><rect x="4" y="20" width="66" height="40" rx="9" fill="url(#${u}bh)"/><rect x="10" y="12" width="40" height="10" rx="4" fill="url(#${u}b)"/><path d="M70 26 L92 20 V62 L70 56 Z" fill="#1d1d20"/>${lens(u, 84, 41, 10)}<rect x="12" y="28" width="22" height="13" rx="2" fill="#0f1420"/><circle cx="56" cy="48" r="3.4" fill="#ff4b3a"/>`,
    pano: `<rect x="2" y="22" width="92" height="36" rx="7" fill="url(#${u}b)"/><rect x="2" y="30" width="92" height="20" fill="url(#${u}lt)"/><rect x="2" y="22" width="92" height="36" rx="7" fill="url(#${u}bh)"/><rect x="66" y="15" width="16" height="7" rx="2" fill="url(#${u}ch)"/><rect x="10" y="26" width="14" height="8" rx="2" fill="#1a1a1e"/>${lens(u, 48, 40, 9)}${btn(u, 74, 14, 3)}`,
    fold: `<rect x="8" y="14" width="80" height="50" rx="5" fill="url(#${u}b)"/><rect x="8" y="14" width="80" height="50" rx="5" fill="url(#${u}bh)"/><path d="M30 22 L66 22 L60 58 L36 58 Z" fill="#141210"/>${[0, 1, 2, 3].map((k) => `<path d="M${31 + k * 1.5} ${28 + k * 8} H${65 - k * 1.5}" stroke="#3a3430" stroke-width="2"/>`).join('')}<rect x="38" y="6" width="20" height="9" rx="2" fill="url(#${u}ch)"/>${lens(u, 48, 40, 10)}`,
    box: `<rect x="14" y="10" width="68" height="56" rx="3" fill="url(#${u}b)"/>${[20, 30, 40, 50, 60].map((y) => `<path d="M14 ${y} H82" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/>`).join('')}<rect x="14" y="10" width="68" height="56" rx="3" fill="url(#${u}bh)"/><circle cx="48" cy="38" r="9" fill="url(#${u}ac)"/><circle cx="48" cy="38" r="2" fill="#050505"/><rect x="40" y="4" width="16" height="7" rx="2" fill="#3a2a1f"/>`,
    cctv: `<path d="M8 30 L70 18 L76 40 L14 52 Z" fill="url(#${u}b)"/><path d="M8 30 L70 18 L76 40 L14 52 Z" fill="url(#${u}bh)"/><path d="M4 26 L72 13 L74 19 L6 32 Z" fill="url(#${u}b)"/><ellipse cx="73" cy="29" rx="5" ry="10" fill="#141414" transform="rotate(-12 73 29)"/><circle cx="73" cy="29" r="4" fill="url(#${u}gl)"/><rect x="34" y="44" width="8" height="16" fill="url(#${u}ch)"/><rect x="24" y="58" width="28" height="6" rx="2" fill="url(#${u}ch)"/>`,
    fish: `<rect x="6" y="18" width="84" height="44" rx="10" fill="url(#${u}b)"/><rect x="6" y="18" width="84" height="44" rx="10" fill="url(#${u}bh)"/><rect x="12" y="10" width="16" height="9" rx="2" fill="url(#${u}ch)"/><circle cx="50" cy="40" r="22" fill="url(#${u}ch)"/><circle cx="50" cy="40" r="19" fill="#0b0b0e"/><circle cx="50" cy="40" r="17" fill="url(#${u}gl)"/><ellipse cx="42" cy="31" rx="7" ry="4" fill="#fff" opacity=".7" transform="rotate(-30 42 31)"/>${btn(u, 80, 14, 3.2, '#c93a2e')}`,
  };
  return `<svg width="${w}" height="${h}" viewBox="0 0 96 72" aria-hidden="true" class="camsvg">${D}<g style="filter: drop-shadow(0 3px 3px rgba(0,0,0,.45))">${S[kind]}</g></svg>`;
}