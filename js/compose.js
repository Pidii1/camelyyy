// camelyyy: turns a clean picture into a finished film photo (look + lenses + date + border)
import { stillEngine } from './engine.js';

export function stampText(style, d) {
  d = d || new Date();
  const p = (n) => String(n).padStart(2, '0'), M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  if (style === 'dmy') return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
  if (style === 'mdy') return `${M[d.getMonth()]} ${p(d.getDate())} ${d.getFullYear()}`;
  if (style === 'ccd') return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  return `'${String(d.getFullYear()).slice(2)} ${p(d.getMonth() + 1)} ${p(d.getDate())}`;
}
export function drawStamp(ctx, W, H, text, scale = 1) {
  const fs = Math.round(Math.min(W, H) * 0.045 * scale);
  ctx.save(); ctx.font = `500 ${fs}px "DM Mono", monospace`; ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
  const x = W - fs * 0.9, y = H - fs * 0.8;
  ctx.shadowColor = 'rgba(255,110,20,.9)'; ctx.shadowBlur = fs * 0.5; ctx.fillStyle = '#ff9a2e'; ctx.fillText(text, x, y);
  ctx.shadowBlur = fs * 0.15; ctx.fillStyle = '#ffc070'; ctx.globalAlpha = 0.85; ctx.fillText(text, x, y); ctx.restore();
}
function starburst(ctx, W, H) {
  const s = 48, t = document.createElement('canvas'); t.width = s; t.height = Math.round(s * H / W);
  const tx = t.getContext('2d', { willReadFrequently: true }); tx.drawImage(ctx.canvas, 0, 0, t.width, t.height);
  const d = tx.getImageData(0, 0, t.width, t.height).data, pts = [];
  for (let y = 0; y < t.height; y++) for (let x = 0; x < t.width; x++) { const i = (y * t.width + x) * 4; const l = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11; if (l > 228) pts.push([x, y, l]); }
  pts.sort((a, b) => b[2] - a[2]);
  const keep = []; for (const p of pts) { if (keep.every((k) => Math.hypot(k[0] - p[0], k[1] - p[1]) > 6)) keep.push(p); if (keep.length >= 6) break; }
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  keep.forEach(([x, y]) => {
    const cx = (x + 0.5) * W / t.width, cy = (y + 0.5) * H / t.height, L = Math.min(W, H) * 0.12;
    for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 4 + 0.2; const g = ctx.createLinearGradient(cx - Math.cos(a) * L, cy - Math.sin(a) * L, cx + Math.cos(a) * L, cy + Math.sin(a) * L); g.addColorStop(0, 'rgba(255,240,220,0)'); g.addColorStop(0.5, 'rgba(255,245,230,.95)'); g.addColorStop(1, 'rgba(255,240,220,0)'); ctx.strokeStyle = g; ctx.lineWidth = Math.max(1.5, W / 500); ctx.beginPath(); ctx.moveTo(cx - Math.cos(a) * L, cy - Math.sin(a) * L); ctx.lineTo(cx + Math.cos(a) * L, cy + Math.sin(a) * L); ctx.stroke(); }
    const r = ctx.createRadialGradient(cx, cy, 0, cx, cy, L * 0.25); r.addColorStop(0, 'rgba(255,250,240,.9)'); r.addColorStop(1, 'rgba(255,250,240,0)'); ctx.fillStyle = r; ctx.beginPath(); ctx.arc(cx, cy, L * 0.25, 0, 7); ctx.fill();
  });
  ctx.restore();
}
function prism(ctx, W, H, seed) {
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  const right = seed % 2 > 1, x0 = right ? W : 0;
  const g = ctx.createLinearGradient(x0, 0, right ? W * 0.6 : W * 0.4, H * 0.25);
  ['rgba(255,60,60,.0)', 'rgba(255,80,80,.35)', 'rgba(255,200,60,.35)', 'rgba(80,255,120,.3)', 'rgba(60,160,255,.35)', 'rgba(180,80,255,.3)', 'rgba(180,80,255,0)'].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
function colorFlash(ctx, W, H, col) {
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = col; ctx.globalAlpha = 0.55; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'screen'; const r = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.6); r.addColorStop(0, col); r.addColorStop(1, 'rgba(0,0,0,0)'); ctx.globalAlpha = 0.35; ctx.fillStyle = r; ctx.fillRect(0, 0, W, H); ctx.restore();
}
const rnd = (seed) => { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };

// opts: {adj, lenses:{fisheye,star,prism,nd,soft}, flashColor, flashOn, mirror, zoom, stamp, stampStyle, date, border, leak, leakAmt, seed, long}
export function developOne(src, cam, opts) {
  const E = stillEngine();
  const long = Math.min(opts.long || 2000, E.maxTex || 4096);
  const [aw, ah] = cam.aspect; const W = aw >= ah ? long : Math.round(long * aw / ah), H = aw >= ah ? Math.round(long * ah / aw) : long;
  const R = rnd(opts.seed || 1); const L = opts.lenses || {};
  const leakOn = opts.leak !== false && R() < (cam.leak || 0) * 1.4;
  const leakAmt = (opts.leakAmt ?? 1) * (0.35 + R() * 0.55);
  const pos = [[1.05, 0.25 + R() * 0.5], [-0.05, 0.3 + R() * 0.5], [0.3 + R() * 0.4, 1.05]][Math.floor(R() * 3)];
  const cols = [[1, 0.42, 0.12], [1, 0.25, 0.2], [1, 0.62, 0.25]];
  E.draw(src, W, H, cam.look, {
    adj: opts.adj, seed: (opts.seed || 1) % 97, nd: L.nd, softLens: L.soft, fish: L.fisheye ? 1 : L.wide ? 0.55 : undefined, zoom: opts.zoom, mirror: opts.mirror,
    leak: leakOn ? leakAmt : 0, leakPos: pos, leakCol: cols[Math.floor(R() * 3)], flashBoost: opts.flashOn ? 0.15 : 0, amount: opts.amount ?? 1, dust: opts.dust,
  });
  const out = document.createElement('canvas'); out.width = W; out.height = H; const x = out.getContext('2d'); x.drawImage(E.cv, 0, 0);
  if (opts.flashOn && opts.flashColor && opts.flashColor !== '#ffffff') colorFlash(x, W, H, opts.flashColor);
  if (L.star) starburst(x, W, H);
  if (L.prism) prism(x, W, H, opts.seed || 1);
  return out;
}

// wrap an image in its print / film border
export function frame(img, cam, opts = {}) {
  const b = cam.border, W = img.width, H = img.height;
  const stamp = (ctx, w, h) => { if (opts.stamp) drawStamp(ctx, w, h, stampText(cam.stampStyle === 'ccd' && opts.stampStyle === 'yy' ? 'ccd' : opts.stampStyle, opts.date), 1); };
  if (!b && opts.strip) return filmStrip(img, cam, opts, stamp);
  if (!b || b === 'toy' || b === 'half') { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(img, 0, 0); stamp(x, W, H); return c; }
  if (b === 'instant' || b === 'instantsq' || b === 'mini' || b === 'pola') {
    const m = Math.round(W * ({ mini: 0.087, pola: 0.076 }[b] || 0.06)), topM = b === 'mini' ? Math.round(W * 0.15) : m, bottom = Math.round(W * ({ instant: 0.24, instantsq: 0.22, mini: 0.37, pola: 0.29 }[b]));
    const c = document.createElement('canvas'); c.width = W + m * 2; c.height = H + topM + bottom; const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, c.height); g.addColorStop(0, '#fbf8f1'); g.addColorStop(1, '#f1ebdf'); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = 'rgba(0,0,0,.06)'; x.fillRect(m - 1, topM - 1, W + 2, H + 2);
    const ph = document.createElement('canvas'); ph.width = W; ph.height = H; const px = ph.getContext('2d'); px.drawImage(img, 0, 0); stamp(px, W, H);
    x.drawImage(ph, m, topM);
    if (opts.caption) { x.font = `400 ${Math.round(bottom * 0.28)}px Caveat, "Inter", cursive`; x.fillStyle = '#6b5a4c'; x.textBaseline = 'middle'; x.fillText(opts.caption, m * 1.2, H + topM + bottom * 0.5); }
    return c;
  }
  if (b === 'slide') {
    const S = Math.round(Math.max(W, H) * 1.42), c = document.createElement('canvas'); c.width = S; c.height = S; const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, S, S); g.addColorStop(0, '#f6f2ea'); g.addColorStop(1, '#e4ddd0'); x.fillStyle = g; x.beginPath(); if (x.roundRect) x.roundRect(0, 0, S, S, S * 0.05); else x.rect(0, 0, S, S); x.fill();
    const ox = (S - W) / 2, oy = (S - H) / 2, r = Math.min(W, H) * 0.04;
    x.fillStyle = 'rgba(0,0,0,.18)'; x.beginPath(); if (x.roundRect) x.roundRect(ox - 3, oy - 3, W + 6, H + 6, r); else x.rect(ox - 3, oy - 3, W + 6, H + 6); x.fill();
    const ph = document.createElement('canvas'); ph.width = W; ph.height = H; const px = ph.getContext('2d'); px.drawImage(img, 0, 0); stamp(px, W, H);
    x.save(); x.beginPath(); if (x.roundRect) x.roundRect(ox, oy, W, H, r); else x.rect(ox, oy, W, H); x.clip(); x.drawImage(ph, ox, oy); x.restore();
    const fs = Math.round(S * 0.032); x.font = `600 ${fs}px "DM Mono", monospace`; x.fillStyle = '#7a6a5a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('camelyyy · SLIDE 100', S / 2, oy / 2); x.font = `500 ${Math.round(fs * 0.85)}px "DM Mono", monospace`; x.fillText(`${opts.frameNo || 12}   ·   ${stampText('dmy', opts.date)}`, S / 2, S - oy / 2);
    return c;
  }
  if (b === 'print') {
    const m = Math.round(Math.min(W, H) * 0.035), c = document.createElement('canvas'); c.width = W + m * 2; c.height = H + m * 2; const x = c.getContext('2d');
    x.fillStyle = '#fbf9f4'; x.fillRect(0, 0, c.width, c.height);
    const ph = document.createElement('canvas'); ph.width = W; ph.height = H; const px = ph.getContext('2d'); px.drawImage(img, 0, 0); stamp(px, W, H);
    x.drawImage(ph, m, m); const g = x.createLinearGradient(0, 0, c.width, c.height); g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.05)'); x.fillStyle = g; x.fillRect(m, m, W, H);
    return c;
  }
  if (b === 'medium') {
    const m = Math.round(W * 0.07), c = document.createElement('canvas'); c.width = W + m * 2; c.height = H + m * 2; const x = c.getContext('2d');
    x.fillStyle = '#16110e'; x.fillRect(0, 0, c.width, c.height);
    const ph = document.createElement('canvas'); ph.width = W; ph.height = H; const px = ph.getContext('2d'); px.drawImage(img, 0, 0); stamp(px, W, H);
    x.drawImage(ph, m, m);
    x.font = `500 ${Math.round(m * 0.34)}px "DM Mono", monospace`; x.fillStyle = '#ffae5a'; x.textBaseline = 'middle';
    x.fillText(cam.edge || 'CAMELYYY 120   PORTRA-ISH   ▸ 6', m, m * 0.5); x.textAlign = 'right'; x.fillText(String((opts.frameNo || 6)), c.width - m, c.height - m * 0.5);
    x.textAlign = 'left'; x.fillText('◂ 6A', m, c.height - m * 0.5);
    return c;
  }
  return img;
}
// 35mm film strip: dark film base, sprocket holes and edge printing
function filmStrip(img, cam, opts, stamp) {
  const W = img.width, H = img.height, land = W >= H, s = Math.min(W, H);
  const band = Math.round(s * 0.13), side = Math.round(s * 0.035);
  const c = document.createElement('canvas'); c.width = land ? W + side * 2 : W + band * 2; c.height = land ? H + band * 2 : H + side * 2; const x = c.getContext('2d');
  x.fillStyle = '#1a120c'; x.fillRect(0, 0, c.width, c.height);
  const g = x.createLinearGradient(0, 0, land ? 0 : c.width, land ? c.height : 0); g.addColorStop(0, 'rgba(255,150,60,.10)'); g.addColorStop(0.5, 'rgba(255,150,60,0)'); g.addColorStop(1, 'rgba(255,150,60,.10)'); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
  const ph = document.createElement('canvas'); ph.width = W; ph.height = H; const px = ph.getContext('2d'); px.drawImage(img, 0, 0); stamp(px, W, H);
  const ox = land ? side : band, oy = land ? band : side; x.drawImage(ph, ox, oy);
  const hw = band * 0.36, hh = band * 0.26, step = band * 0.62, r = band * 0.06;
  const hole = (hx, hy, w, h) => { x.fillStyle = '#efe6d8'; x.beginPath(); if (x.roundRect) x.roundRect(hx, hy, w, h, r); else x.rect(hx, hy, w, h); x.fill(); };
  const n = String(opts.frameNo || 12), edge = 'CAMELYYY 400', fsz = Math.round(band * 0.16);
  x.font = `600 ${fsz}px "DM Mono", monospace`; x.fillStyle = '#ffab5c'; x.textBaseline = 'middle';
  if (land) {
    for (let p = step * 0.3; p < c.width - hw; p += step) { hole(p, band * 0.12, hw, hh); hole(p, c.height - band * 0.12 - hh, hw, hh); }
    x.fillText(`${edge}   ▸ ${n}A`, band * 0.4, band * 0.78); x.textAlign = 'right'; x.fillText(`${n}   ◂`, c.width - band * 0.4, c.height - band * 0.78);
  } else {
    for (let p = step * 0.3; p < c.height - hw; p += step) { hole(band * 0.12, p, hh, hw); hole(c.width - band * 0.12 - hh, p, hh, hw); }
    x.save(); x.translate(band * 0.78, c.height - band * 0.4); x.rotate(-Math.PI / 2); x.fillText(`${edge}   ▸ ${n}A`, 0, 0); x.restore();
    x.save(); x.translate(c.width - band * 0.78, band * 0.4); x.rotate(Math.PI / 2); x.fillText(`${n}   ◂`, 0, 0); x.restore();
  }
  return c;
}
// four shots in a 2x2 grid
export function collage(imgs, cam, opts = {}) {
  const W = imgs[0].width, H = imgs[0].height, g = Math.round(W * 0.03), m = Math.round(W * 0.05);
  const c = document.createElement('canvas'); c.width = W * 2 + g + m * 2; c.height = H * 2 + g + m * 2; const x = c.getContext('2d');
  x.fillStyle = '#f7f3ec'; x.fillRect(0, 0, c.width, c.height);
  imgs.slice(0, 4).forEach((im, i) => x.drawImage(im, m + (i % 2) * (W + g), m + Math.floor(i / 2) * (H + g), W, H));
  if (opts.stamp) drawStamp(x, c.width - m, c.height - m, stampText(opts.stampStyle, opts.date), 0.8);
  return c;
}
// photobooth strip: four frames stacked, with a printed footer
export function booth(imgs, cam, opts = {}) {
  const W = imgs[0].width, H = imgs[0].height, m = Math.round(W * 0.07), g = Math.round(W * 0.045), foot = Math.round(W * 0.32);
  const c = document.createElement('canvas'); c.width = W + m * 2; c.height = m + (H + g) * 4 - g + foot; const x = c.getContext('2d');
  x.fillStyle = '#fbf8f2'; x.fillRect(0, 0, c.width, c.height);
  imgs.slice(0, 4).forEach((im, i) => { x.fillStyle = 'rgba(0,0,0,.08)'; x.fillRect(m - 1, m + i * (H + g) - 1, W + 2, H + 2); x.drawImage(im, m, m + i * (H + g), W, H); });
  const y0 = m + (H + g) * 4 - g; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#3a2a20';
  x.font = `600 ${Math.round(foot * 0.24)}px Fraunces, Georgia, serif`; x.fillText('camelyyy', c.width / 2, y0 + foot * 0.42);
  x.font = `500 ${Math.round(foot * 0.13)}px "DM Mono", monospace`; x.fillStyle = '#9a7a62'; x.fillText(stampText('dmy', opts.date), c.width / 2, y0 + foot * 0.7);
  return c;
}
export function halfFrame(a, b, cam, opts = {}) {
  const W = a.width, H = a.height, gap = Math.round(W * 0.04), m = Math.round(W * 0.06);
  const c = document.createElement('canvas'); c.width = W * 2 + gap + m * 2; c.height = H + m * 2; const x = c.getContext('2d');
  x.fillStyle = '#16110e'; x.fillRect(0, 0, c.width, c.height); x.drawImage(a, m, m); x.drawImage(b, m + W + gap, m);
  x.fillStyle = 'rgba(255,236,210,.85)'; const hw = m * 0.35, hh = m * 0.25; for (let px = m * 0.6; px < c.width - m * 0.4; px += m * 0.9) { x.fillRect(px, m * 0.35, hw, hh); x.fillRect(px, c.height - m * 0.6, hw, hh); }
  if (opts.stamp) drawStamp(x, c.width - m, c.height - m, stampText(opts.stampStyle, opts.date), 0.7);
  return c;
}
// toy 3D: four slightly shifted frames for a wiggle GIF
export async function toyGif(src, cam, opts) {
  const { GIFEncoder, quantize, applyPalette } = await import('../vendor/gifenc.esm.js');
  const frames = [];
  for (let k = 0; k < 4; k++) {
    const shift = (k - 1.5) * 0.018;
    const c = developOne(src, cam, { ...opts, long: 720, seed: opts.seed, zoom: 1.08, pan: shift });
    const s = document.createElement('canvas'); s.width = c.width; s.height = c.height; const x = s.getContext('2d');
    x.drawImage(c, -c.width * 0.05 + shift * c.width * 2, -c.height * 0.05, c.width * 1.1, c.height * 1.1); if (opts.stamp) drawStamp(x, s.width, s.height, stampText(opts.stampStyle, opts.date), 1); frames.push(s);
  }
  const order = [0, 1, 2, 3, 2, 1];
  const gif = GIFEncoder(); const W = frames[0].width, H = frames[0].height;
  order.forEach((i) => { const d = frames[i].getContext('2d').getImageData(0, 0, W, H).data; const pal = quantize(d, 256); gif.writeFrame(applyPalette(d, pal), W, H, { palette: pal, delay: 110, repeat: 0 }); });
  gif.finish();
  return { gif: new Blob([gif.bytes()], { type: 'image/gif' }), still: frames[0], frames, order };
}
// double exposure: lighten blend of two finished pictures
export function blendDouble(a, b) {
  const c = document.createElement('canvas'); c.width = a.width; c.height = a.height; const x = c.getContext('2d');
  x.drawImage(a, 0, 0); x.globalCompositeOperation = 'screen'; x.globalAlpha = 0.85; x.drawImage(b, 0, 0, a.width, a.height); return c;
}
