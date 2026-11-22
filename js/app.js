// camelyyy: vintage film camera
import { CAMS, camById, CATS, FOCALS, LENSES, FLASH_COLORS, camSVG } from './cameras.js';
import { Film, stillEngine } from './engine.js';
import { developOne, frame, halfFrame, toyGif, blendDouble, stampText, drawStamp, collage, booth } from './compose.js';
import { Roll, Settings } from './store.js';
import * as N from './native.js';

export const VERSION = '1.2.1';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const app = $('#app');

const P = {
  flash: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>', flashoff: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/><path d="M3 3l18 18"/>', timer: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4l2.5 2M9.5 3h5"/>',
  grid: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16"/>', double: '<circle cx="9.5" cy="12" r="5.5"/><circle cx="14.5" cy="12" r="5.5"/>',
  flip: '<path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2"/><path d="M20 4v4h-4M4 20v-4h4"/>', sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  lens: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 4v4M18 9l-3 2"/>', back: '<path d="M15 5l-7 7 7 7"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', share: '<path d="M12 15V4M8 8l4-4 4 4M5 13v7h14v-7"/>',
  trash: '<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>', image: '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M20 16l-5-5-8 8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>', dev: '<path d="M6 3h12v4l-4 4v10h-4V11L6 7z"/>', all: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  crop: '<path d="M7 3v14h14M3 7h14v14"/>', rotate: '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>', mirror: '<path d="M12 3v18"/><path d="M8 7l-5 5 5 5V7zM16 7l5 5-5 5V7z"/>',
  roll: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 9h16M8 5v4M16 5v4"/>', prev: '<path d="M15 5l-7 7 7 7"/>', next: '<path d="M9 5l7 7-7 7"/>', play: '<path d="M8 5v14l11-7z"/>',
};
const ic = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
const lensArt = {
  fisheye: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="#3a2a22"/><circle cx="24" cy="24" r="12" fill="#c98a5b" opacity=".55"/><ellipse cx="19" cy="18" rx="5" ry="3" fill="#fff" opacity=".6"/></svg>',
  star: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6v36M6 24h36M11 11l26 26M37 11L11 37" stroke="#e7c4a8" stroke-width="2.5"/><circle cx="24" cy="24" r="4" fill="#fff"/></svg>',
  prism: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 8l16 30H8z" fill="none" stroke="#e7c4a8" stroke-width="3"/><path d="M28 22l14 4" stroke="#e0533f" stroke-width="2.5"/><path d="M29 26l13 8" stroke="#8fb3ff" stroke-width="2.5"/></svg>',
  nd: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="#1b120d"/><circle cx="24" cy="24" r="18" fill="none" stroke="#e7c4a8" stroke-width="2"/></svg>',
  wide: '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="24" rx="20" ry="14" fill="#3a2a22"/><ellipse cx="24" cy="24" rx="13" ry="9" fill="#5a7ab0" opacity=".6"/><ellipse cx="19" cy="20" rx="5" ry="2.5" fill="#fff" opacity=".6"/></svg>',
  soft: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="16" fill="#f6ece1" opacity=".25"/><circle cx="24" cy="24" r="9" fill="#f6ece1" opacity=".6"/></svg>',
};

// ---------------- state ----------------
const set0 = Settings.get();
const S = { nav: 0, stack: [], cam: camById(set0.cam), mode: 'photo', facing: 'user', stream: null, live: null, raf: 0, zoomIdx: 0, adj: { exposure: 0, temp: 0, tint: 0, iso: 400, shutter: 125, amount: 1 }, lenses: {}, flash: false, flashColor: set0.flashColor, timer: set0.timer || 0, grid: set0.grid, pending: null, busy: false, rec: null, sheet: null, tok: 0, shots: Number(localStorage.getItem('mely_shots') || 0), update: null, viewIdx: 0, roll: [] };

// ---------------- helpers ----------------
let toastT;
function toast(msg, ms = 2400) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), ms); }
let actx;
// shutter sound + vibration, different for every kind of camera
const FEEL = { slr: 'slr', compact: 'compact', digi: 'digi', disp: 'disp', instant: 'instant', medium: 'medium', toy: 'toy', fish: 'compact', pano: 'slr', fold: 'medium', cine: 'cine', vhs: 'digi' };
function buzz(pat) { if (!Settings.get().haptics) return; try { navigator.vibrate && navigator.vibrate(pat); } catch (e) {} }
function sound(kind, cam) {
  const feel = cam ? FEEL[cam.kind] || 'compact' : 'compact';
  if (kind === 'shutter') buzz({ slr: [18, 40, 12], compact: 14, digi: 8, disp: [12, 60, 6, 30, 6, 30, 6], instant: [16, 80, 40], medium: [28, 30, 10], toy: [10, 30, 10], cine: 20 }[feel] || 14);
  if (kind === 'beep') buzz(6);
  if (!Settings.get().sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume();
    const now = actx.currentTime;
    const tone = (start, f, dur, vol, type = 'sine', f2) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = type; o.frequency.setValueAtTime(f, now + start); if (f2) o.frequency.exponentialRampToValueAtTime(f2, now + start + dur); g.gain.setValueAtTime(vol, now + start); g.gain.exponentialRampToValueAtTime(0.001, now + start + dur); o.connect(g).connect(actx.destination); o.start(now + start); o.stop(now + start + dur + 0.02); };
    const noise = (start, dur, vol, hp, lp) => { const len = Math.floor(actx.sampleRate * dur), b = actx.createBuffer(1, len, actx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5); const s = actx.createBufferSource(), g = actx.createGain(), f = actx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; let n = s.connect(f); if (lp) { const l = actx.createBiquadFilter(); l.type = 'lowpass'; l.frequency.value = lp; n = n.connect(l); } g.gain.value = vol; s.buffer = b; n.connect(g).connect(actx.destination); s.start(now + start); };
    if (kind === 'beep') { tone(0, 1000, 0.08, 0.08); return; }
    if (kind === 'rec') { tone(0, 880, 0.07, 0.07); tone(0.12, 1320, 0.09, 0.07); return; }
    if (kind === 'roll') { for (let k = 0; k < 18; k++) noise(k * 0.055, 0.035, 0.16, 2500); tone(0, 90, 1.1, 0.05, 'sawtooth', 140); return; }
    if (feel === 'slr') { noise(0, 0.05, 0.7, 900, 6000); noise(0.06, 0.07, 0.55, 500, 4000); for (let k = 0; k < 4; k++) noise(0.32 + k * 0.05, 0.035, 0.2, 2800); }
    else if (feel === 'medium') { noise(0, 0.08, 0.8, 250, 2500); tone(0, 110, 0.12, 0.12, 'triangle'); noise(0.45, 0.12, 0.25, 800); }
    else if (feel === 'digi') { tone(0, 2200, 0.05, 0.05); noise(0.05, 0.04, 0.45, 2500); tone(0.12, 1800, 0.06, 0.035); }
    else if (feel === 'disp') { noise(0, 0.04, 0.6, 2000); for (let k = 0; k < 7; k++) noise(0.25 + k * 0.045, 0.03, 0.3, 1600, 5000); }
    else if (feel === 'instant') { noise(0, 0.05, 0.6, 1500); tone(0.12, 160, 0.9, 0.06, 'sawtooth', 220); noise(0.12, 0.9, 0.05, 3000); }
    else if (feel === 'toy') { for (let k = 0; k < 4; k++) noise(k * 0.04, 0.03, 0.45, 2600); }
    else if (feel === 'cine') { tone(0, 880, 0.07, 0.07); }
    else { noise(0, 0.05, 0.6, 1800); noise(0.07, 0.06, 0.45, 900); for (let k = 0; k < 5; k++) noise(0.25 + k * 0.06, 0.04, 0.18, 3000); }
  } catch (e) {}
}
function selfieLight(on) { const f = $('#flash'); if (on) { f.style.background = S.flashColor === '#ffffff' ? '#fffaf0' : S.flashColor; f.style.transition = 'opacity .08s'; f.classList.add('on'); } else { f.style.transition = 'opacity .35s'; f.classList.remove('on'); } }
function flashScreen(col = '#fff') { const f = $('#flash'); f.style.background = col; f.classList.add('on'); setTimeout(() => f.classList.remove('on'), 160); }
const top = (title, right = '') => `<div class="top"><button class="ib" data-back aria-label="Back">${ic('back')}</button><h1>${esc(title)}</h1>${right}</div>`;
const tog = (k, label, sub, on) => `<button class="tog" role="switch" aria-checked="${!!on}" data-tog="${k}"><div><b>${esc(label)}</b><small>${esc(sub)}</small></div><span class="sw" aria-hidden="true"></span></button>`;
function slider(k, label, min, max, step, val, fmt) { const v = ((val - min) / (max - min)) * 100; return `<div class="sl"><div class="h"><span>${label}</span><span data-out="${k}">${fmt(val)}</span></div><input type="range" data-sl="${k}" min="${min}" max="${max}" step="${step}" value="${val}" style="--v:${v}%" aria-label="${label}"></div>`; }
function bindSliders(root, fmts, onChange) { $$('[data-sl]', root).forEach((r) => (r.oninput = () => { const k = r.dataset.sl, v = +r.value; r.style.setProperty('--v', ((v - r.min) / (r.max - r.min)) * 100 + '%'); const o = $(`[data-out="${k}"]`, root); if (o) o.textContent = fmts[k](v); onChange(k, v); })); }
function pickFiles(multiple, accept = 'image/*') { return new Promise((ok) => { const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.multiple = multiple; i.style.display = 'none'; i.onchange = () => { ok([...i.files]); i.remove(); }; document.body.appendChild(i); i.click(); }); }
function loadImage(src) { return new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => bad(new Error('Could not open that picture')); i.src = src; }); }
const toBlob = (cv, type = 'image/jpeg', q = 0.92) => new Promise((ok) => cv.toBlob(ok, type, q));
const blobURL = new Map();
const urlOf = (b, key) => { if (!b) return ''; if (key && blobURL.has(key)) return blobURL.get(key); const u = URL.createObjectURL(b); if (key) blobURL.set(key, u); return u; };
function qualityLong() { return { standard: 1600, high: 2400, max: 3600 }[Settings.get().quality] || 2400; }
function stampDate() { const c = Settings.get().customDate; if (c) { const d = new Date(c + 'T12:00:00'); if (!isNaN(d)) { const n = new Date(); d.setHours(n.getHours(), n.getMinutes()); return d; } } return new Date(); }

// ---------------- navigation ----------------
const SCREENS = {};
function go(name, arg, opt = {}) { leave(); if (opt.replace) S.stack[S.stack.length - 1] = [name, arg]; else if (opt.reset) S.stack = [[name, arg]]; else S.stack.push([name, arg]); show(); }
async function show() { closeSheet(); const [name, arg] = S.stack[S.stack.length - 1]; const my = ++S.nav; await SCREENS[name](arg); if (my !== S.nav) return; const b = $('[data-back]', app); if (b) b.onclick = back; N.setBars(true); }
function back() { if (S.sheet) { closeSheet(); return true; } if (S.stack.length <= 1) return false; leave(); S.stack.pop(); show(); return true; }
function leave() { S.tok++; stopLoop(); if (S.rec) stopRec(true); if (S.stack.length && S.stack[S.stack.length - 1][0] === 'camera') stopCamera(); }
function openSheet(html, cls = 'sheet') {
  closeSheet(); const v = document.createElement('div'); v.className = 'veil';
  v.innerHTML = `<div class="${cls}" role="dialog" aria-modal="true">${cls === 'sheet' ? '<div class="grab"></div>' : ''}${html}</div>`;
  v.addEventListener('click', (e) => { if (e.target === v) closeSheet(); }); document.body.appendChild(v); S.sheet = v; return v.firstElementChild;
}
function closeSheet() { if (!S.sheet) return; const v = S.sheet; S.sheet = null; if (v.onclose) v.onclose(); v.remove(); }
function confirmBox(title, text, yes = 'Delete') {
  return new Promise((ok) => { const d = openSheet(`<h2>${esc(title)}</h2><p>${esc(text)}</p><div class="row"><button class="btn ghost" data-n>Keep</button><button class="btn" data-y>${esc(yes)}</button></div>`, 'dlg'); S.sheet.onclose = () => ok(false); $('[data-n]', d).onclick = () => closeSheet(); $('[data-y]', d).onclick = () => { S.sheet.onclose = null; closeSheet(); ok(true); }; });
}

// ---------------- camera screen ----------------
function zoom() { return S.hwZoom ? 1 : FOCALS[S.zoomIdx][1]; }
// per-camera picture shape
const RATIOS = [[2, 3], [3, 4], [4, 5], [1, 1], [9, 16]], VRATIOS = [[3, 4], [9, 16], [1, 1]];
function ratioFixed(c) { return ['instant', 'instantsq', 'medium', 'toy', 'half', 'mini', 'pola', 'collage', 'booth'].includes(c.border) || !!c.look.fish || c.id === 'pano'; }
function ratioList(c) { const l = (c.video ? VRATIOS : RATIOS).slice(); if (!l.some(([a, b]) => a === c.aspect[0] && b === c.aspect[1])) l.unshift(c.aspect); return l; }
function effCam(c = S.cam) { if (ratioFixed(c)) return c; const r = Settings.cam(c.id).ratio; return r ? { ...c, aspect: r } : c; }
SCREENS.camera = () => {
  const c = S.cam, s = Settings.get(), video = S.mode === 'video';
  const vOK = (x) => x.video || x.both;
  if (video && !vOK(c)) S.cam = camById(s.vcam && vOK(camById(s.vcam)) ? s.vcam : 'vhs'); if (!video && c.video) S.cam = camById(s.cam && !camById(s.cam).video ? s.cam : 'gold');
  const cam = S.cam, favs = s.favs.map(camById);
  app.innerHTML = `<section class="scr cam">
  <aside class="side l"><div class="brand">camelyyy<i>.</i></div><div class="chips" id="dcats"></div><div class="cgrid" id="dgrid"></div></aside>
  <div class="cam-top">
    <button class="ib" id="bFlash" aria-label="Flash" aria-pressed="${S.flash}">${ic(S.flash ? 'flash' : 'flashoff')}</button>
    <button class="ib" id="bTimer" aria-label="Self-timer" aria-pressed="${!!S.timer}">${ic('timer')}${S.timer ? `<span class="badge">${S.timer}s</span>` : ''}</button>
    <button class="ib" id="bDouble" aria-label="Double exposure" aria-pressed="${!!S.double}" ${video ? 'disabled' : ''}>${ic('double')}</button>
    <button class="ib" id="bLens" aria-label="Lenses and flash colour" aria-pressed="${Object.values(S.lenses).some(Boolean)}">${ic('lens')}</button>
    <button class="ib" id="bGrid" aria-label="Grid" aria-pressed="${S.grid}">${ic('grid')}</button>
    <button class="ib" id="bAdj" aria-label="Exposure and colour">${ic('sliders')}</button>
    <button class="ib" id="bSet" aria-label="Settings">${ic('settings')}</button>
  </div>
  <div class="vf-wrap" id="vfw"><div class="vf" id="vf"><canvas id="live" aria-label="Viewfinder"></canvas>
    <div class="tags"><button class="tag" id="tZoom">${FOCALS[S.zoomIdx][0]}</button>${ratioFixed(cam) ? '' : `<button class="tag" id="tRatio">${effCam(cam).aspect.join(':')}</button>`}<button class="tag" id="tLens" hidden></button><span class="tag" id="tExp">${S.adj.exposure >= 0 ? '+' : ''}${S.adj.exposure.toFixed(1)}</span>${s.customDate && !video ? `<button class="tag date" id="tDate">${esc(stampText(s.stampStyle === 'off' ? 'yy' : s.stampStyle, stampDate()))}</button>` : ''}</div>
    ${S.grid ? '<div class="grid"></div>' : ''}<div class="count" id="count" aria-live="assertive"></div></div></div>
  <div class="camname"><b>${esc(cam.name)}</b><span id="counter">${video ? (cam.id === 'cine16' ? '16mm' : cam.id === 'cctv' ? 'CAM 01' : '4:3 · sound') : counterText()}</span></div>
  <div class="modes" role="tablist">${['photo', 'video', 'import'].map((m) => `<button role="tab" data-mode="${m}" aria-pressed="${S.mode === m}">${m.toUpperCase()}</button>`).join('')}</div>
  <div class="shoot"><button class="thumb" id="bRoll" aria-label="Your roll"><img id="rollThumb" alt=""></button><button class="shutter" id="shut" aria-label="${video ? 'Record' : 'Take photo'}"></button><button class="ib" id="bFlip" aria-label="Switch camera" style="width:52px;height:52px;border-radius:26px">${ic('flip')}</button></div>
  <div class="dock">${favs.map((f) => `<button data-cam="${f.id}" aria-label="${esc(f.name)}" aria-pressed="${f.id === cam.id}">${camSVG(f, 50)}</button>`).join('')}<button class="all" id="bAll" aria-label="All cameras">${ic('all')}<span>All</span></button></div>
  <aside class="side r"><div class="row" style="justify-content:space-between"><b class="serif" style="font-size:17px">Your roll</b><button class="chip" id="dRoll">Open</button></div><div class="rgrid" id="drgrid"></div><div class="card" style="animation:none"><div class="lbl">Exposure and colour</div><div id="dadj"></div></div><p class="lbl" style="margin:0">Space bar = shoot</p></aside>
  </section>`;
  const ph = $('#live'); ph.replaceWith(liveCanvas());
  fitVF(); window.onresize = fitVF;
  $('#bFlash').onclick = () => { S.flash = !S.flash; SCREENS.camera(); rebindBack(); startLoop(true); };
  $('#bTimer').onclick = () => { S.timer = { 0: 3, 3: 10, 10: 0 }[S.timer]; Settings.set({ timer: S.timer }); toast(S.timer ? `Self-timer ${S.timer} s` : 'Self-timer off', 1300); refreshTop(); };
  $('#bDouble').onclick = () => { S.double = !S.double; S.pending = null; toast(S.double ? 'Double exposure: take 2 shots' : 'Double exposure off', 1600); refreshTop(); };
  $('#bLens').onclick = lensSheet; $('#bAdj').onclick = adjSheet; $('#bSet').onclick = () => go('settings');
  $('#bGrid').onclick = () => { S.grid = !S.grid; Settings.set({ grid: S.grid }); SCREENS.camera(); rebindBack(); startLoop(true); };
  if ($('#tDate')) $('#tDate').onclick = dateSheet;
  $('#tZoom').onclick = () => { S.zoomIdx = (S.zoomIdx + 1) % FOCALS.length; $('#tZoom').textContent = FOCALS[S.zoomIdx][0]; applyZoom(); };
  if ($('#tRatio')) $('#tRatio').onclick = () => { const l = ratioList(cam), cur = effCam(cam).aspect, i = l.findIndex(([a, b]) => a === cur[0] && b === cur[1]), n = l[(i + 1) % l.length]; Settings.setCam(cam.id, { ratio: n }); $('#tRatio').textContent = n.join(':'); fitVF(); toast(`Picture shape ${n.join(':')}`, 1200); };
  $('#tLens').onclick = () => { const b = S.backs || []; if (b.length < 2) return; S.backIdx = ((S.backIdx || 0) + 1) % b.length; S.backId = b[S.backIdx].deviceId; stopCamera(); startLoop(); toast(`Back camera ${S.backIdx + 1} of ${b.length}`, 1400); };
  $('#vf').addEventListener('pointerup', tapFocus);
  $$('[data-mode]').forEach((b) => (b.onclick = () => { const m = b.dataset.mode; if (m === 'import') { go('import', S.mode === 'video' ? 'video' : 'photo'); return; } if (m === S.mode) return; S.mode = m; S.pending = null; S.double = false; stopCamera(); SCREENS.camera(); rebindBack(); startLoop(); toast(S.cam.both ? `${m === 'video' ? 'Video' : 'Photo'} mode · ${S.cam.name}` : `Switched to ${S.cam.name} (${m === 'video' ? 'video' : 'photo'} camera)`, 1800); }));
  $$('.dock [data-cam]').forEach((b) => (b.onclick = () => selectCam(b.dataset.cam)));
  $('#bAll').onclick = () => go('picker');
  $('#bRoll').onclick = () => go('roll'); if ($('#dRoll')) $('#dRoll').onclick = () => go('roll');
  $('#bFlip').onclick = () => { if (S.busy || S.rec) return; S.facing = S.facing === 'user' ? 'environment' : 'user'; stopCamera(); startLoop(); toast(S.facing === 'user' ? 'Front camera' : 'Back camera', 1000); };
  $('#shut').onclick = shoot;
  refreshThumb(); deskPanels();
  startLoop();
};
function rebindBack() {}
function counterText() { const r = Math.floor(S.shots / 36) + 1; return Settings.get().filmRoll ? `ROLL ${r} · ${(S.shots % 36) + 1}/36` : `${(S.shots % 36) + 1}/36`; }
function camPrefs(cam) { const pc = Settings.cam(cam.id); return { ...pc, dust: pc.dust ?? !!cam.dust }; }
// a roll of 36 is finished: rewind animation, then a fresh roll
async function rollDone() {
  const r = Math.floor(S.shots / 36); sound('roll'); buzz([30, 60, 30, 60, 30]);
  const v = document.createElement('div'); v.className = 'rolldone';
  v.innerHTML = `<div class="can"><div class="spool"></div><div class="tongue"></div></div><b>Roll ${r} finished</b><span>36 shots developed · loading roll ${r + 1}</span>`;
  document.body.appendChild(v); await sleep(2300); v.classList.add('out'); await sleep(400); v.remove();
}
// quick date picker for the stamp (also in Settings)
function dateSheet() {
  const s = Settings.get(), today = new Date(), iso = (y) => `${y}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const d = openSheet(`<h2>Date on your photos</h2><p class="lbl" style="margin:0">Pick a year and the stamp will say that date. Great for a '98 look.</p>
  <div class="chips">${[['', 'Today'], ...[1985, 1992, 1998, 2003, 2008].map((y) => [iso(y), `'${String(y).slice(2)}`])].map(([v, l]) => `<button class="chip" data-dd="${v}" aria-pressed="${s.customDate === v}">${l}</button>`).join('')}</div>
  <label class="lbl" for="dd2">Or any date</label><input id="dd2" class="tin" type="date" value="${esc(s.customDate)}">`);
  const apply = (v) => { Settings.set({ customDate: v }); closeSheet(); SCREENS.camera(); startLoop(true); toast(v ? `Date stamp: ${stampText(Settings.get().stampStyle === 'off' ? 'yy' : Settings.get().stampStyle, stampDate())}` : 'Date stamp: today', 1600); };
  $$('[data-dd]', d).forEach((b) => (b.onclick = () => apply(b.dataset.dd))); $('#dd2', d).onchange = (e) => apply(e.target.value);
}

function refreshTop() { const b = (id, on) => { const e = $(id); if (e) e.setAttribute('aria-pressed', String(on)); }; b('#bTimer', !!S.timer); b('#bDouble', !!S.double); b('#bLens', Object.values(S.lenses).some(Boolean)); const t = $('#bTimer'); if (t) t.innerHTML = ic('timer') + (S.timer ? `<span class="badge">${S.timer}s</span>` : ''); const e = $('#tExp'); if (e) e.textContent = (S.adj.exposure >= 0 ? '+' : '') + S.adj.exposure.toFixed(1); }
function selectCam(id) { const c = camById(id); if (!c.both && c.video !== (S.mode === 'video')) { S.mode = c.video ? 'video' : 'photo'; stopCamera(); } S.cam = c; Settings.set(S.mode === 'video' ? { vcam: id } : { cam: id }); S.pending = null; SCREENS.camera(); startLoop(); }
function fitVF() {
  const w = $('#vfw'), vf = $('#vf'); if (!w || !vf) return; const [a, b] = effCam().aspect; const ar = a / b;
  const W = w.clientWidth - 32, H = w.clientHeight; let vw = W, vh = W / ar; if (vh > H) { vh = H; vw = H * ar; }
  vf.style.width = Math.floor(vw) + 'px'; vf.style.height = Math.floor(vh) + 'px';
  const cv = $('#live'); const dpr = Math.min(2, devicePixelRatio || 1), sc = Math.min(1, 1100 / Math.max(vw * dpr, vh * dpr));
  cv.width = Math.round(vw * dpr * sc); cv.height = Math.round(vh * dpr * sc);
}
async function refreshThumb() {
  try { const r = await Roll.latest(); const im = $('#rollThumb'); if (im) { if (r) im.src = r.thumb; else im.removeAttribute('src'); } } catch (e) {}
}
function deskPanels() {
  if (innerWidth < 1000) return;
  const g = $('#dgrid'), cats = $('#dcats'); if (!g) return;
  let cat = 'All';
  const draw = () => { g.innerHTML = CAMS.filter((c) => cat === 'All' || c.cat === cat).map((c, i) => `<button class="ccard" style="--d:${i * 25}ms" data-dc="${c.id}" aria-pressed="${c.id === S.cam.id}">${c.video ? '<i class="vid">VIDEO</i>' : c.both ? '<i class="vid both">+VIDEO</i>' : ''}${camSVG(c, 64)}<span>${esc(c.name)}</span></button>`).join(''); $$('[data-dc]', g).forEach((b) => (b.onclick = () => selectCam(b.dataset.dc))); };
  cats.innerHTML = CATS.map((c) => `<button class="chip" data-dcat="${c}" aria-pressed="${c === cat}">${c}</button>`).join('');
  $$('[data-dcat]', cats).forEach((b) => (b.onclick = () => { cat = b.dataset.dcat; $$('[data-dcat]', cats).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); draw(); }));
  draw();
  Roll.list().then((all) => { const r = $('#drgrid'); if (!r) return; r.innerHTML = all.slice(0, 8).map((it) => `<button data-rid="${it.id}" aria-label="Open"><img src="${it.thumb}" alt=""></button>`).join('') || '<p class="lbl" style="grid-column:1/-1;margin:0">Your shots appear here.</p>'; $$('[data-rid]', r).forEach((b) => (b.onclick = () => go('view', b.dataset.rid))); });
  const d = $('#dadj'); d.innerHTML = adjSliders(); bindSliders(d, ADJF, (k, v) => { S.adj[k] = v; refreshTop(); });
}

// live preview loop (one canvas and one WebGL context for the whole app)
let film = null, liveSeed = 1, leakPhase = Math.random() * 6, liveCv = null;
function liveCanvas() {
  if (!liveCv) {
    liveCv = document.createElement('canvas'); liveCv.id = 'live'; liveCv.setAttribute('aria-label', 'Viewfinder');
    liveCv.addEventListener('webglcontextlost', (e) => { e.preventDefault(); film = null; });
    liveCv.addEventListener('webglcontextrestored', () => { film = null; });
  }
  return liveCv;
}
async function startCamera() {
  stopCamera(); const tok = S.tok; const vf = $('#vf'); if (!vf) return false;
  $$('.msg', vf).forEach((m) => m.remove());
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { camError('This browser cannot open the camera. You can still import photos.'); return false; }
  try {
    const vc = S.facing === 'environment' && S.backId ? { deviceId: { exact: S.backId } } : { facingMode: S.facing };
    const st = await navigator.mediaDevices.getUserMedia({ video: { ...vc, width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: S.mode === 'video' }).catch((e) => { if (S.backId && e && e.name === 'OverconstrainedError') { S.backId = null; return navigator.mediaDevices.getUserMedia({ video: { facingMode: S.facing, width: { ideal: 1920 }, height: { ideal: 1440 } }, audio: S.mode === 'video' }); } throw e; });
    if (tok !== S.tok || !$('#vf')) { st.getTracks().forEach((t) => t.stop()); return false; }
    S.stream = st; const v = document.createElement('video'); v.playsInline = true; v.muted = true; v.srcObject = st; await v.play().catch(() => {}); S.video = v;
    await setupHW(st);
    return true;
  } catch (e) {
    if (S.mode === 'video' && e && e.name === 'NotAllowedError') { try { const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: S.facing }, audio: false }); S.stream = st; const v = document.createElement('video'); v.playsInline = true; v.muted = true; v.srcObject = st; await v.play().catch(() => {}); S.video = v; toast('No microphone: videos will be silent'); return true; } catch (e2) {} }
    camError(e && (e.name === 'NotAllowedError' || e.name === 'SecurityError') ? 'camelyyy needs your camera. Allow camera access, then try again.' : e && e.name === 'NotFoundError' ? 'No camera found on this device.' : 'The camera could not start. Close other apps using it and try again.');
    return false;
  }
}
function camError(text) { const vf = $('#vf'); if (!vf) return; const m = document.createElement('div'); m.className = 'msg'; m.innerHTML = `<p>${esc(text)}</p><div class="row"><button class="btn" data-r>Try again</button><button class="btn ghost" data-i>Import</button></div>`; vf.appendChild(m); $('[data-r]', m).onclick = () => startLoop(); $('[data-i]', m).onclick = () => go('import'); }
function stopCamera() { if (S.stream) { S.stream.getTracks().forEach((t) => t.stop()); S.stream = null; } S.video = null; S.track = null; S.ic = null; S.pcaps = null; S.hwZoom = false; }
async function startLoop(keepStream) {
  stopLoop(); const tok = S.tok;
  if (!(keepStream && S.stream && S.video)) { const ok = await startCamera(); if (!ok || tok !== S.tok) return; }
  const cv = $('#live'); if (!cv) return;
  if (!film) { try { film = new Film(cv); } catch (e) { camError('Your device does not support the film effects (WebGL).'); return; } }
  let f = 0;
  const loop = () => {
    if (tok !== S.tok) return;
    const v = S.video, cam = S.cam;
    if (v && v.readyState >= 2) {
      f++; const t = performance.now() / 1000;
      const leakAmt = cam.leak ? (0.25 + 0.2 * Math.sin(t * 0.6 + leakPhase)) * Math.min(1, cam.leak * 1.3) : 0;
      film.draw(v, cv.width, cv.height, cam.look, { adj: S.adj, seed: (f % 60) + liveSeed, t: f % 97, zoom: zoom(), mirror: S.facing === 'user' && Settings.get().mirror, nd: S.lenses.nd, softLens: S.lenses.soft, fish: S.lenses.fisheye ? 1 : S.lenses.wide ? 0.55 : undefined, leak: Settings.cam(cam.id).leaks ? leakAmt : 0, leakPos: [1.05, 0.3 + 0.1 * Math.sin(t * 0.3)], flicker: cam.id === 'super8' ? 0.93 + Math.random() * 0.1 : 1, amount: S.adj.amount ?? 1, dust: camPrefs(cam).dust });
      if (S.rec) recFrame();
    }
    S.raf = requestAnimationFrame(loop);
  };
  S.raf = requestAnimationFrame(loop);
}
function stopLoop() { if (S.raf) cancelAnimationFrame(S.raf); S.raf = 0; }

// grab a clean full-size frame from the camera, cropped to the camera's format
function grabFrame() {
  const v = S.video; if (!v || !v.videoWidth) return null;
  const [a, b] = effCam().aspect, ar = a / b, vw = v.videoWidth, vh = v.videoHeight;
  let sw = vw, sh = vw / ar; if (sh > vh) { sh = vh; sw = vh * ar; }
  const z = zoom(); sw /= z; sh /= z;
  const c = document.createElement('canvas'); c.width = Math.round(sw); c.height = Math.round(sh); const x = c.getContext('2d');
  if (S.facing === 'user' && Settings.get().mirror) { x.translate(c.width, 0); x.scale(-1, 1); }
  x.drawImage(v, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, c.width, c.height);
  return c;
}
// ---- phone camera hardware: full-resolution stills, focus, zoom, lenses, LED flash ----
async function setupHW(st) {
  const tr = st.getVideoTracks()[0]; S.track = tr; S.caps = {}; S.ic = null; S.pcaps = null; S.hwZoom = false;
  try { S.caps = (tr.getCapabilities && tr.getCapabilities()) || {}; } catch (e) {}
  if (window.ImageCapture && Settings.get().fullRes) { try { S.ic = new ImageCapture(tr); S.pcaps = await Promise.race([S.ic.getPhotoCapabilities(), sleep(1500).then(() => null)]); } catch (e) { S.ic = null; } }
  await applyZoom();
  if (S.facing === 'environment') listBacks(); else updateLensTag();
}
async function applyZoom() {
  const z = S.caps && S.caps.zoom, t = S.track; S.hwZoom = false; if (!z || !t) return;
  const want = Math.max(z.min, Math.min(z.max, FOCALS[S.zoomIdx][1]));
  try { await t.applyConstraints({ advanced: [{ zoom: want }] }); S.hwZoom = want >= FOCALS[S.zoomIdx][1] - 0.01; if (!S.hwZoom) await t.applyConstraints({ advanced: [{ zoom: z.min <= 1 ? 1 : z.min }] }); } catch (e) { S.hwZoom = false; }
}
async function listBacks() {
  try { if (!S.backs) { const ds = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'videoinput' && /back|rear|environment/i.test(d.label)); S.backs = ds.length > 1 ? ds : []; } } catch (e) { S.backs = []; }
  if (S.backId) S.backIdx = Math.max(0, (S.backs || []).findIndex((d) => d.deviceId === S.backId));
  updateLensTag();
}
function updateLensTag() { const t = $('#tLens'); if (!t) return; const b = S.backs || []; t.hidden = !(S.facing === 'environment' && b.length > 1); t.textContent = `CAM ${(S.backIdx || 0) + 1}/${b.length}`; }
function tapFocus(e) {
  if (e.target.closest('.tag, .msg, button, .ghost')) return;
  const vf = $('#vf'), r = vf.getBoundingClientRect(); let x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  const ring = document.createElement('div'); ring.className = 'focusring'; ring.style.left = (e.clientX - r.left) + 'px'; ring.style.top = (e.clientY - r.top) + 'px'; vf.appendChild(ring); setTimeout(() => ring.remove(), 900);
  const v = S.video, t = S.track; if (!v || !t || !v.videoWidth) return;
  if (S.facing === 'user' && Settings.get().mirror) x = 1 - x;
  const [a, b] = effCam().aspect, ar = a / b, va = v.videoWidth / v.videoHeight, z = zoom(); let sx = 1, sy = 1; if (va > ar) sx = ar / va; else sy = va / ar;
  x = 0.5 + (x - 0.5) * sx / z; y = 0.5 + (y - 0.5) * sy / z;
  const c = S.caps || {}, adv = { pointsOfInterest: [{ x, y }] };
  if ((c.focusMode || []).includes('single-shot')) adv.focusMode = 'single-shot';
  if ((c.exposureMode || []).includes('single-shot')) adv.exposureMode = 'single-shot';
  t.applyConstraints({ advanced: [adv] }).catch(() => {});
  buzz(5);
  clearTimeout(S.focusT); S.focusT = setTimeout(() => { const m = {}; if ((c.focusMode || []).includes('continuous')) m.focusMode = 'continuous'; if ((c.exposureMode || []).includes('continuous')) m.exposureMode = 'continuous'; if (S.track && Object.keys(m).length) S.track.applyConstraints({ advanced: [m] }).catch(() => {}); }, 6000);
}
// crop any still to the camera's shape and zoom, mirror selfies, keep it within the GPU limit
function cropStill(src, w, h) {
  const [a, b] = effCam().aspect, ar = a / b; let sw = w, sh = w / ar; if (sh > h) { sh = h; sw = h * ar; }
  const z = zoom(); sw /= z; sh /= z;
  const lim = Math.min(4096, stillEngine().maxTex || 4096), k = Math.min(1, lim / Math.max(sw, sh));
  const c = document.createElement('canvas'); c.width = Math.round(sw * k); c.height = Math.round(sh * k); const x = c.getContext('2d');
  if (S.facing === 'user' && Settings.get().mirror) { x.translate(c.width, 0); x.scale(-1, 1); }
  x.drawImage(src, (w - sw) / 2, (h - sh) / 2, sw, sh, 0, 0, c.width, c.height);
  return c;
}
// full-resolution photo from the camera sensor; falls back to a video frame
async function grabStill(ledFlash) {
  const v = S.video;
  if (S.ic && v && v.videoWidth) {
    try {
      const pc = S.pcaps || {}, o = {};
      if (pc.imageWidth && pc.imageWidth.max) { o.imageWidth = pc.imageWidth.max; o.imageHeight = pc.imageHeight.max; }
      const fl = pc.fillLightMode || []; if (fl.length) o.fillLightMode = ledFlash && fl.includes('flash') ? 'flash' : fl.includes('off') ? 'off' : fl[0];
      const ref = smallGray(v, v.videoWidth, v.videoHeight);
      const blob = await Promise.race([S.ic.takePhoto(o), sleep(5000).then(() => { throw new Error('timeout'); })]);
      const bmp = await createImageBitmap(blob);
      const up = orient(bmp, ref, v.videoWidth >= v.videoHeight);
      const out = cropStill(up, up.width, up.height); if (bmp.close) bmp.close(); return out;
    } catch (e) { console.warn('full-res capture failed, using the preview frame', e); }
  }
  return grabFrame();
}
function smallGray(src, w, h) { const c = document.createElement('canvas'); c.width = 24; c.height = Math.max(8, Math.round(24 * h / w)); const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(src, 0, 0, c.width, c.height); const d = x.getImageData(0, 0, c.width, c.height).data, g = []; for (let i = 0; i < d.length; i += 4) g.push(d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11); return { g, w: c.width, h: c.height }; }
// the sensor photo can come back sideways or upside down: pick the turn that matches the preview
function orient(bmp, ref, land) {
  const turns = (bmp.width >= bmp.height) === land ? [0, 180] : [90, 270];
  let best = turns[0], bestD = Infinity;
  for (const t of turns) {
    const c = rotated(bmp, t, ref.w * 4); const s = smallGray(c, c.width, c.height); if (s.w !== ref.w || Math.abs(s.h - ref.h) > 1) continue;
    let d = 0; const n = Math.min(s.g.length, ref.g.length); for (let i = 0; i < n; i++) d += Math.abs(s.g[i] - ref.g[i]); if (d < bestD) { bestD = d; best = t; }
  }
  return best ? rotated(bmp, best) : bmp;
}
function rotated(img, deg, maxW) {
  const w = img.width, h = img.height, side = deg % 180 !== 0, W = side ? h : w, H = side ? w : h, k = maxW ? Math.min(1, maxW / W) : 1;
  const c = document.createElement('canvas'); c.width = Math.round(W * k); c.height = Math.round(H * k); const x = c.getContext('2d');
  x.translate(c.width / 2, c.height / 2); x.rotate(deg * Math.PI / 180); x.scale(k, k); x.drawImage(img, -w / 2, -h / 2); return c;
}
async function torch(on) { try { const t = S.stream && S.stream.getVideoTracks()[0]; if (t && t.getCapabilities && t.getCapabilities().torch) await t.applyConstraints({ advanced: [{ torch: on }] }); } catch (e) {} }
function devOpts(cam, extra = {}) {
  const s = Settings.get(), pc = Settings.cam(cam.id);
  return { adj: { ...S.adj }, lenses: { ...S.lenses }, flashOn: S.flash || cam.flash, flashColor: S.flashColor, leak: pc.leaks, seed: Math.floor(Math.random() * 100000) + 1, long: qualityLong(), stamp: pc.stamp && s.stampStyle !== 'off', stampStyle: s.stampStyle === 'off' ? 'yy' : s.stampStyle, date: stampDate(), border: pc.border, amount: S.adj.amount ?? 1, dust: camPrefs(cam).dust, strip: pc.strip && !cam.border, frameNo: (S.shots % 36) + 1, ...extra };
}
async function shoot() {
  if (S.mode === 'video') { if (S.rec) stopRec(); else startRec(); return; }
  if (S.busy) return; if (!S.video) { toast('The camera is not ready yet'); return; }
  S.busy = true; const tok = S.tok; const sh = $('#shut'); sh.classList.add('busy');
  try {
    const tmr = S.cam.border === 'booth' ? Math.max(S.timer, 3) : S.timer;
    for (let n = tmr; n > 0; n--) { const c = $('#count'); if (!c || tok !== S.tok) return; c.textContent = n; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); sound('beep', S.cam); await sleep(1000); }
    const cnt = $('#count'); if (cnt) cnt.textContent = '';
    const cam = effCam(S.cam);
    const useFlash = S.flash || cam.flash, selfie = useFlash && S.facing === 'user';
    if (selfie) { selfieLight(true); await sleep(380); }
    const ledFlash = useFlash && !selfie && S.pcaps && (S.pcaps.fillLightMode || []).includes('flash');
    if (useFlash && !selfie && !ledFlash) await torch(true);
    const raw = await grabStill(ledFlash); if (selfie) selfieLight(false); else if (useFlash && !ledFlash) torch(false);
    if (!raw) { toast('Could not take the photo'); return; }
    sound('shutter', cam);
    const opts = devOpts(cam);
    const need = S.double ? 2 : (cam.shots || 1);
    let out, gif = null, origCanvas = raw;
    if (need > 1) {
      const small = cam.shots > 2 ? { ...opts, long: Math.round(qualityLong() * 0.6) } : opts;
      const img = developOne(raw, cam, small);
      if (!S.pending) S.pending = { imgs: [], opts };
      S.pending.imgs.push(img);
      const n = S.pending.imgs.length;
      if (n < need) {
        showGhost(img, `${S.double ? 'DOUBLE' : cam.border === 'half' ? 'HALF' : cam.border === 'booth' ? 'BOOTH' : 'COLLAGE'} · ${n + 1} / ${need}`);
        if (cam.border === 'booth') S.autoNext = true; else toast(cam.border === 'half' ? 'Half frame: take the second photo' : S.double ? 'Now take the second shot' : `Shot ${n} of ${need}: keep going`, 1500);
        return;
      }
      const imgs = S.pending.imgs, o1 = S.pending.opts;
      if (S.double) { const bl = blendDouble(imgs[0], imgs[1]); out = o1.border ? frame(bl, cam, o1) : frame(bl, { ...cam, border: null }, o1); origCanvas = null; }
      else if (cam.border === 'half') out = halfFrame(imgs[0], imgs[1], cam, o1);
      else if (cam.border === 'booth') { out = booth(imgs, cam, o1); origCanvas = null; }
      else { out = collage(imgs, cam, o1); origCanvas = null; }
    } else if (cam.border === 'toy') { const r = await toyGif(raw, cam, opts); gif = r.gif; out = r.still; }
    else { const img = developOne(raw, cam, opts); out = opts.border ? frame(img, cam, opts) : frame(img, { ...cam, border: null }, opts); }
    S.pending = null; hideGhost();
    await saveShot(out, gif, cam, opts, origCanvas);
    S.shots++; localStorage.setItem('mely_shots', S.shots); const ct = $('#counter'); if (ct) ct.textContent = counterText(); if (Settings.get().filmRoll && S.shots % 36 === 0) await rollDone();
  } catch (e) { console.error(e); toast('Something went wrong taking the photo'); }
  finally { S.busy = false; const s2 = $('#shut'); if (s2) s2.classList.remove('busy'); if (S.autoNext) { S.autoNext = false; const tk = S.tok; setTimeout(() => { if (tk === S.tok && S.pending) shoot(); }, 500); } }
}
function showGhost(cv, label) { const vf = $('#vf'); if (!vf) return; hideGhost(); const im = document.createElement('img'); im.className = 'ghost'; im.alt = ''; im.src = cv.toDataURL('image/jpeg', 0.7); if (S.cam.shots > 2) im.style.opacity = '.18'; vf.appendChild(im); const t = document.createElement('div'); t.className = 'shotno'; t.textContent = label; vf.appendChild(t); }
function hideGhost() { $$('#vf .ghost, #vf .shotno').forEach((e) => e.remove()); }
function makeThumb(cv) { const w = 300, h = Math.round(cv.height * w / cv.width), t = document.createElement('canvas'); t.width = w; t.height = h; t.getContext('2d').drawImage(cv, 0, 0, w, h); return t.toDataURL('image/jpeg', 0.8); }
async function saveShot(out, gif, cam, opts, origCanvas) {
  const s = Settings.get();
  const outBlob = gif || await toBlob(out, 'image/jpeg', 0.93);
  const orig = s.keepOriginal && origCanvas ? await toBlob(origCanvas, 'image/jpeg', 0.92) : null;
  const it = { id: uid(), created: Date.now(), cam: cam.id, type: gif ? 'gif' : 'photo', out: outBlob, orig, opts: { ...opts, date: opts.date && opts.date.getTime ? opts.date.getTime() : opts.date }, w: out.width, h: out.height, thumb: makeThumb(out), fav: false };
  await Roll.put(it);
  const im = $('#rollThumb'); if (im) { im.src = it.thumb; im.parentElement.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 350, easing: 'cubic-bezier(.2,.8,.2,1)' }); }
  if (s.saveToPhone && N.isApp()) N.saveFile(outBlob, fileName(it)).catch(() => {});
  return it;
}
const fileName = (it) => `camelyyy-${camById(it.cam).id}-${new Date(it.created).toISOString().slice(0, 19).replace(/[:T]/g, '')}.${it.type === 'gif' ? 'gif' : it.type === 'video' ? (it.out.type.includes('mp4') ? 'mp4' : 'webm') : 'jpg'}`;

// ---------------- video recording ----------------
let recCv = null, recCtx = null;
function startRec() {
  const live = $('#live'); if (!live || !S.stream) { toast('The camera is not ready yet'); return; }
  if (!window.MediaRecorder) { toast('Video recording is not supported here'); return; }
  recCv = document.createElement('canvas'); recCv.width = live.width; recCv.height = live.height; recCtx = recCv.getContext('2d');
  const vs = recCv.captureStream(30); const at = S.stream.getAudioTracks(); at.forEach((t) => vs.addTrack(t));
  const types = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  const mime = types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
  const mr = new MediaRecorder(vs, mime ? { mimeType: mime, videoBitsPerSecond: 6e6 } : undefined); const chunks = [];
  mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  S.rec = { mr, chunks, t0: performance.now(), cam: S.cam, mime: mr.mimeType || mime || 'video/webm' };
  mr.onstop = () => finishRec(chunks, S.rec ? S.rec : null);
  mr.start(500); sound('rec'); buzz(20);
  const sh = $('#shut'); sh.classList.add('rec'); sh.setAttribute('aria-label', 'Stop recording');
  const vf = $('#vf'); const r = document.createElement('div'); r.className = 'rec'; r.innerHTML = '<i></i><span id="recT">00:00</span>'; vf.appendChild(r);
}
function recFrame() {
  const live = $('#live'); if (!live || !recCtx) return; const W = recCv.width, H = recCv.height, x = recCtx;
  x.drawImage(live, 0, 0);
  const sec = (performance.now() - S.rec.t0) / 1000, p = (n) => String(Math.floor(n)).padStart(2, '0');
  const tm = `${p(sec / 60)}:${p(sec % 60)}`; const t = $('#recT'); if (t) t.textContent = tm;
  drawOverlay(x, W, H, S.rec.cam, sec, stampDate());
}
function drawOverlay(x, W, H, cam, sec, d) {
  const p = (n) => String(Math.floor(n)).padStart(2, '0'), tm = `${p(sec / 60)}:${p(sec % 60)}`, fs = Math.round(H * 0.045);
  if (cam.overlay === 'vhs') {
    x.save(); x.font = `500 ${fs}px "DM Mono", monospace`; x.fillStyle = '#fff'; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 4;
    if (Math.floor(sec * 2) % 2 === 0) { x.fillStyle = '#ff3b30'; x.beginPath(); x.arc(fs * 1.1, fs * 1.4, fs * 0.32, 0, 7); x.fill(); x.fillStyle = '#fff'; }
    x.fillText('REC', fs * 1.6, fs * 1.7); x.textAlign = 'right'; x.fillText('SP', W - fs, fs * 1.7); x.fillText(`00:${tm}`, W - fs, H - fs * 1.1);
    x.textAlign = 'left'; const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    x.fillText(`${d.getHours() < 12 ? 'AM' : 'PM'} ${((d.getHours() + 11) % 12) + 1}:${p(d.getMinutes())}`, fs, H - fs * 2.4); x.fillText(`${M[d.getMonth()]} ${p(d.getDate())} ${d.getFullYear()}`, fs, H - fs * 1.1); x.restore();
  } else if (cam.overlay === 'cctv') {
    x.save(); x.font = `500 ${Math.round(fs * 0.85)}px "DM Mono", monospace`; x.fillStyle = 'rgba(255,255,255,.92)'; x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 3;
    x.fillText('CAM 01', fs, fs * 1.6); x.textAlign = 'right'; x.fillText(Math.floor(sec * 2) % 2 ? '● REC' : '  REC', W - fs, fs * 1.6);
    const tt = new Date(d.getTime()); x.textAlign = 'left'; x.fillText(`${stampText('dmy', tt)}  ${p(tt.getHours())}:${p(tt.getMinutes())}:${p(tt.getSeconds())}`, fs, H - fs); x.restore();
  } else if (cam.overlay === 'dv') {
    x.save(); x.font = `500 ${Math.round(fs * 0.8)}px "DM Mono", monospace`; x.fillStyle = '#fff'; x.fillText('DV  SP  ' + tm, fs, fs * 1.6); x.textAlign = 'right'; x.fillText(stampText('dmy', d), W - fs, H - fs); x.restore();
  }
}
function stopRec(silent) { if (!S.rec) return; const r = S.rec; r.silent = silent; try { r.mr.stop(); } catch (e) {} const sh = $('#shut'); if (sh) { sh.classList.remove('rec'); sh.setAttribute('aria-label', 'Record'); } $$('#vf .rec').forEach((e) => e.remove()); }
async function finishRec(chunks, r) {
  S.rec = null; if (!r || r.silent || !chunks.length) { recCtx = null; return; }
  const blob = new Blob(chunks, { type: r.mime.split(';')[0] });
  const thumb = recCv ? makeThumb(recCv) : '';
  const it = { id: uid(), created: Date.now(), cam: r.cam.id, type: 'video', out: blob, orig: null, opts: {}, w: recCv.width, h: recCv.height, thumb, dur: Math.round((performance.now() - r.t0) / 1000) };
  recCtx = null; await Roll.put(it); refreshThumb(); toast('Video saved to your roll');
  if (Settings.get().saveToPhone && N.isApp()) N.saveFile(blob, fileName(it)).catch(() => {});
}

// ---------------- sheets: exposure, lenses ----------------
const ADJF = { exposure: (v) => (v >= 0 ? '+' : '') + v.toFixed(1), temp: (v) => (5600 + v * 2400).toFixed(0) + 'K', tint: (v) => (v >= 0 ? '+' : '') + Math.round(v * 20), iso: (v) => String(v), shutter: (v) => '1/' + v, amount: (v) => Math.round(v * 100) + '%' };
function adjSliders() { return `${slider('amount', 'Filter strength', 0, 1, 0.05, S.adj.amount ?? 1, ADJF.amount)}${slider('exposure', 'Exposure', -2, 2, 0.1, S.adj.exposure, ADJF.exposure)}${slider('temp', 'Temperature', -1, 1, 0.05, S.adj.temp, ADJF.temp)}${slider('tint', 'Tint', -1, 1, 0.05, S.adj.tint, ADJF.tint)}`; }
const ISOS = [100, 200, 400, 800, 1600, 3200], SHUTS = [30, 60, 125, 250, 500, 1000];
function adjSheet() {
  const d = openSheet(`<h2>Exposure and colour <button data-reset>Reset</button></h2>${adjSliders()}
  <div class="boxes"><div class="box"><div><small>ISO</small><b id="vIso">${S.adj.iso}</b></div><div class="pm"><button data-iso="-1" aria-label="Lower ISO">−</button><button data-iso="1" aria-label="Higher ISO">+</button></div></div><div class="box"><div><small>Shutter</small><b id="vSh">1/${S.adj.shutter}</b></div><div class="pm"><button data-sh="-1" aria-label="Slower shutter">−</button><button data-sh="1" aria-label="Faster shutter">+</button></div></div></div>
  <div class="lbl">Focal length</div><div class="chips">${FOCALS.map(([n], i) => `<button class="chip" data-fo="${i}" aria-pressed="${i === S.zoomIdx}">${n}</button>`).join('')}</div>`);
  bindSliders(d, ADJF, (k, v) => { S.adj[k] = v; refreshTop(); });
  $$('[data-iso]', d).forEach((b) => (b.onclick = () => { const i = Math.max(0, Math.min(ISOS.length - 1, ISOS.indexOf(S.adj.iso) + +b.dataset.iso)); S.adj.iso = ISOS[i]; $('#vIso', d).textContent = S.adj.iso; }));
  $$('[data-sh]', d).forEach((b) => (b.onclick = () => { const i = Math.max(0, Math.min(SHUTS.length - 1, SHUTS.indexOf(S.adj.shutter) + +b.dataset.sh)); S.adj.shutter = SHUTS[i]; $('#vSh', d).textContent = '1/' + S.adj.shutter; }));
  $$('[data-fo]', d).forEach((b) => (b.onclick = () => { S.zoomIdx = +b.dataset.fo; $$('[data-fo]', d).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); const t = $('#tZoom'); if (t) t.textContent = FOCALS[S.zoomIdx][0]; applyZoom(); }));
  $('[data-reset]', d).onclick = () => { S.adj = { exposure: 0, temp: 0, tint: 0, iso: 400, shutter: 125, amount: 1 }; closeSheet(); adjSheet(); refreshTop(); };
}
function lensSheet() {
  const d = openSheet(`<h2>Lenses and flash</h2><div class="lens-grid">${LENSES.map((l) => `<button class="lens" data-lens="${l.id}" aria-pressed="${!!S.lenses[l.id]}">${lensArt[l.id]}<b>${l.name}</b><small>${l.sub}</small></button>`).join('')}</div>
  <div class="lbl">Flash colour</div><div class="dots">${FLASH_COLORS.map((c) => `<button class="dot" data-fc="${c}" aria-label="Flash colour ${c}" aria-pressed="${S.flashColor === c}" style="background:${c}"></button>`).join('')}</div>
  <p class="lbl" style="margin:0">Colour flash works when the flash is on. With the front camera, the screen lights up as a selfie flash.</p>
  <button class="btn ghost block" id="ldate">Date on photos: ${esc(Settings.get().customDate ? stampText('yy', stampDate()) : 'today')}</button>`);
  $('#ldate', d).onclick = dateSheet;
  $$('[data-lens]', d).forEach((b) => (b.onclick = () => { const k = b.dataset.lens; S.lenses[k] = !S.lenses[k]; if (S.lenses[k] && (k === 'wide' || k === 'fisheye')) S.lenses[k === 'wide' ? 'fisheye' : 'wide'] = false; $$('[data-lens]', d).forEach((x) => x.setAttribute('aria-pressed', String(!!S.lenses[x.dataset.lens]))); refreshTop(); }));
  $$('[data-fc]', d).forEach((b) => (b.onclick = () => { S.flashColor = b.dataset.fc; Settings.set({ flashColor: S.flashColor }); $$('[data-fc]', d).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); if (!S.flash && S.flashColor !== '#ffffff') { S.flash = true; const f = $('#bFlash'); if (f) { f.setAttribute('aria-pressed', 'true'); f.innerHTML = ic('flash'); } } }));
}

// ---------------- camera picker + detail ----------------
SCREENS.picker = () => {
  let cat = 'All'; const s = Settings.get();
  app.innerHTML = `<section class="scr">${top('Cameras', `<span class="meta">${CAMS.length}</span>`)}<div style="padding:4px 16px 8px"><div class="chips" id="cats">${CATS.map((c) => `<button class="chip" data-cat="${c}" aria-pressed="${c === cat}">${c}</button>`).join('')}</div></div><div class="scroll"><div class="cgrid" id="cg"></div><p class="lbl" style="text-align:center;padding:0 24px 24px">Tap a camera to see it. Long-press to add it to your 4 favourites.</p></div></section>`;
  const draw = () => {
    const favs = Settings.get().favs;
    $('#cg').innerHTML = CAMS.filter((c) => cat === 'All' || c.cat === cat).map((c, i) => `<button class="ccard" style="--d:${i * 35}ms" data-c="${c.id}" aria-pressed="${c.id === S.cam.id}">${favs.includes(c.id) ? `<span class="fav">${ic('star')}</span>` : ''}${c.video ? '<i class="vid">VIDEO</i>' : c.both ? '<i class="vid both">+VIDEO</i>' : ''}<img class="mini" data-mini="${c.id}" alt="" hidden>${camSVG(c, 74)}<span>${esc(c.name)}</span></button>`).join('');
    fillMinis($('#cg'));
    $$('[data-c]').forEach((b) => {
      let t, long = false;
      b.onpointerdown = () => { long = false; t = setTimeout(() => { long = true; toggleFav(b.dataset.c); draw(); }, 550); };
      b.onpointerup = b.onpointerleave = () => clearTimeout(t);
      b.onclick = () => { if (!long) detailSheet(b.dataset.c, draw); };
    });
  };
  $$('[data-cat]').forEach((b) => (b.onclick = () => { cat = b.dataset.cat; $$('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); draw(); }));
  draw();
};
function toggleFav(id) {
  let f = Settings.get().favs.slice(); const c = camById(id);
  if (f.includes(id)) { if (f.length <= 1) return; f = f.filter((x) => x !== id); toast(`${c.name} removed from favourites`, 1400); }
  else { f.push(id); if (f.length > 4) f.shift(); toast(`${c.name} added to favourites`, 1400); }
  Settings.set({ favs: f });
}
// little filtered prints on the camera cards (made once, then cached)
const MINI = new Map(), SAMPLES = new Map();
const sampleImg = (n) => { if (!SAMPLES.has(n)) SAMPLES.set(n, loadImage(`img/samples/${n}.jpg`)); return SAMPLES.get(n); };
async function fillMinis(root) {
  for (const im of $$('[data-mini]', root)) {
    const id = im.dataset.mini; if (!im.isConnected) return;
    try {
      if (!MINI.has(id)) { const c = camById(id), src = await sampleImg(SAMPLE[id] || 'cafe'); const sq = c.aspect[0] / c.aspect[1] > 2 ? c : { ...c, aspect: [1, 1] }; MINI.set(id, developOne(src, sq, { adj: {}, lenses: {}, leak: true, seed: 11, long: 140, dust: camPrefs(c).dust }).toDataURL('image/jpeg', 0.8)); await sleep(0); }
      im.src = MINI.get(id); im.hidden = false;
    } catch (e) { console.error(e); }
  }
}
const SAMPLE = { classic: 'beach', gold: 'park', grain: 'neon', instw: 'cafe', instsq: 'beach', disposa: 'park', half: 'cafe', slide: 'beach', ccd: 'neon', toy: 'park', medium: 'cafe', mono: 'neon', fish: 'beach', night: 'neon', super8: 'park', vhs: 'neon', dv: 'cafe', cine16: 'beach', expired: 'park', pano: 'beach', sepia: 'cafe', xpro: 'park', infra: 'park', hicon: 'neon', soft: 'cafe', tungsten: 'neon', redscale: 'beach', lomo: 'park', pinhole: 'cafe', dream: 'beach', print: 'park', cctv: 'cafe', original: 'park', collage: 'cafe', booth: 'cafe', mini: 'park', pola: 'beach', toy120: 'park', pro67: 'cafe', wide22: 'beach', pocket: 'neon' };
async function detailSheet(id, redraw) {
  const c = camById(id), pc = Settings.cam(id), favs = Settings.get().favs;
  const d = openSheet(`<div class="detail-hero"><div class="print" id="dprint"><span class="spin light"></span></div><div class="cam">${camSVG(c, 96)}</div></div>
  <h2 style="font-family:var(--mono);font-weight:500;letter-spacing:.05em">${esc(c.name)} <button class="ib" id="dfav" aria-label="Favourite" aria-pressed="${favs.includes(id)}" style="color:inherit">${ic('star')}</button></h2>
  <p class="lbl" style="margin:0;font-size:14.5px;line-height:1.5">${esc(c.desc)}</p>
  <div class="tags2"><span class="chip">${c.cat}</span><span class="chip">${c.video ? 'Video' : c.both ? 'Photo + Video' : 'Photo'}</span>${c.shots > 2 ? `<span class="chip">${c.shots} shots</span>` : ''}<span class="chip">${c.aspect.join(':')}</span>${c.flash ? '<span class="chip">Flash</span>' : ''}${c.shots > 2 ? '' : '<span class="chip">Import OK</span>'}</div>
  ${c.video ? '' : `${tog('stamp', 'Date stamp', 'Orange date in the corner', pc.stamp)}${c.border && !['toy', 'half', 'collage', 'booth'].includes(c.border) ? tog('border', 'Print border', 'The frame around the photo', pc.border) : ''}${c.leak ? tog('leaks', 'Random light leaks', 'Every shot is a little different', pc.leaks) : ''}${tog('dust', 'Dust and scratches', 'Specks and hairline scratches like old film', camPrefs(c).dust)}${!c.border ? tog('strip', 'Film strip edge', '35mm sprocket holes and frame numbers', pc.strip) : ''}`}
  <button class="btn block" id="duse">Use this camera</button>`);
  $('#dfav', d).onclick = () => { toggleFav(id); $('#dfav', d).setAttribute('aria-pressed', String(Settings.get().favs.includes(id))); redraw && redraw(); };
  $$('[data-tog]', d).forEach((b) => (b.onclick = () => { const k = b.dataset.tog, v = !camPrefs(c)[k]; Settings.setCam(id, { [k]: v }); b.setAttribute('aria-checked', String(v)); renderSample(); }));
  $('#duse', d).onclick = () => { closeSheet(); S.cam = c; S.mode = c.video ? 'video' : c.both ? S.mode : 'photo'; Settings.set(S.mode === 'video' ? { vcam: id } : { cam: id }); S.stack = [['camera']]; show(); };
  const renderSample = async () => {
    try {
      const img = await loadImage(`img/samples/${SAMPLE[id]}.jpg`); const pc2 = Settings.cam(id);
      const pp = camPrefs(c); const o = { adj: {}, lenses: {}, leak: pc2.leaks, seed: 7, long: 560, stamp: pc2.stamp && !c.video, stampStyle: c.stampStyle || 'yy', date: stampDate(), border: pc2.border, dust: pp.dust, strip: pp.strip && !c.border && !c.video };
      let out;
      if (c.shots > 2) { const ims = [0, 1, 2, 3].map((k) => developOne(img, c, { ...o, long: 300, seed: 7 + k * 13, zoom: 1 + k * 0.08 })); out = c.border === 'booth' ? booth(ims, c, o) : collage(ims, c, o); }
      else { out = developOne(img, c, o); out = pc2.border && c.border && c.border !== 'toy' && c.border !== 'half' ? frame(out, c, o) : frame(out, { ...c, border: null }, o); }
      const p = $('#dprint', d); if (!p) return; p.innerHTML = ''; out.style.maxHeight = '230px'; out.style.maxWidth = c.aspect[0] / c.aspect[1] > 2 ? '300px' : '210px'; p.appendChild(out); p.style.padding = '0'; p.style.background = 'transparent';
    } catch (e) { console.error(e); }
  };
  renderSample();
}

// ---------------- viewer, re-develop ----------------
SCREENS.view = async (id) => {
  S.roll = await Roll.list(); let i = Math.max(0, S.roll.findIndex((r) => r.id === id)); const it = S.roll[i]; if (!it) { back(); return; }
  const c = camById(it.cam), isVid = it.type === 'video';
  app.innerHTML = `<section class="scr">${top(isVid ? 'Video' : 'Photo', `<span class="meta">${esc(c.name)}</span>`)}
  <div class="viewer" id="vw">${isVid ? `<video src="${urlOf(it.out, it.id)}" controls playsinline loop autoplay></video>` : `<img class="dev" src="${urlOf(it.out, it.id)}" alt="Your photo">`}</div>
  <div class="row" style="justify-content:center;gap:24px;padding:0 0 10px"><button class="ib" id="vprev" aria-label="Newer" ${i === 0 ? 'disabled' : ''}>${ic('prev')}</button><span class="meta mono" style="font-size:12px;color:var(--muted)">${i + 1} / ${S.roll.length}</span><button class="ib" id="vnext" aria-label="Older" ${i === S.roll.length - 1 ? 'disabled' : ''}>${ic('next')}</button></div>
  <div class="acts"><button class="act" id="aSave">${ic('download')}<span>Save</span></button><button class="act hot" id="aShare">${ic('share')}<span>Share</span></button><button class="act" id="aEdit" ${isVid || it.type === 'gif' ? 'disabled style="opacity:.4"' : ''}>${ic('crop')}<span>Edit</span></button><button class="act" id="aDev" ${it.orig ? '' : 'disabled style="opacity:.4"'}>${ic('dev')}<span>Develop</span></button><button class="act" id="aDel">${ic('trash')}<span>Delete</span></button></div></section>`;
  S.justShot = null;
  const step = (d) => { const n = S.roll[i + d]; if (n) { S.stack[S.stack.length - 1] = ['view', n.id]; show(); } };
  $('#vprev').onclick = () => step(-1); $('#vnext').onclick = () => step(1);
  let sx = 0; $('#vw').addEventListener('pointerdown', (e) => (sx = e.clientX)); $('#vw').addEventListener('pointerup', (e) => { const dx = e.clientX - sx; if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1); });
  $('#aSave').onclick = async () => { try { const r = await N.saveFile(it.out, fileName(it)); toast(r === 'gallery' ? 'Saved to your gallery (camelyyy album)' : 'Saved to your downloads'); } catch (e) { toast('Could not save'); } };
  $('#aShare').onclick = async () => { try { const r = await N.shareFile(it.out, fileName(it), 'Shot on camelyyy'); if (r === 'copied') toast('Picture copied. Paste it anywhere.'); else if (r === 'downloaded') toast('Saved. Share it from your downloads.'); } catch (e) { toast('Could not share'); } };
  $('#aDev').onclick = () => it.orig && go('redevelop', it.id);
  $('#aEdit').onclick = () => !isVid && it.type !== 'gif' && go('edit', it.id);
  $('#aDel').onclick = async () => { if (await confirmBox(isVid ? 'Delete this video?' : 'Delete this photo?', 'It will be removed from your roll. Copies saved to your gallery stay.')) { await Roll.del(it.id); toast('Deleted', 1200); if (S.roll.length <= 1) back(); else { const n = S.roll[i + 1] || S.roll[i - 1]; S.stack[S.stack.length - 1] = ['view', n.id]; show(); } } };
};
SCREENS.redevelop = async (id) => {
  const it = await Roll.get(id); if (!it || !it.orig) { back(); return; }
  const orig = await loadImage(URL.createObjectURL(it.orig));
  let cam = camById(it.cam); if (cam.video) cam = camById('gold');
  const o = { ...it.opts, adj: { exposure: 0, temp: 0, tint: 0, iso: 400, shutter: 125, ...(it.opts.adj || {}) }, amount: it.opts.amount ?? 1, date: new Date(it.opts.date || it.created), long: 900, leakAmt: 1, grainAdd: 0 };
  app.innerHTML = `<section class="scr">${top('Re-develop', `<button class="chip" id="rdone" style="background:var(--nude);color:var(--ink)">Done</button>`)}
  <div class="scroll"><div class="ba"><div><img src="${urlOf(it.orig, it.id + 'o')}" alt="Before"><span>Before</span></div><div><img id="after" alt="After"><span style="color:var(--nude)">After</span></div></div>
  <p class="lbl" style="padding:6px 20px 0;margin:0">camelyyy keeps the clean original, so you can change the camera or develop it again any time.</p>
  <div class="lbl" style="padding:12px 16px 6px">Try another camera</div><div class="camrow" id="rcams">${CAMS.filter((c) => !c.video && !(c.shots > 2)).map((c) => `<button data-rc="${c.id}" aria-pressed="${c.id === cam.id}" aria-label="${esc(c.name)}">${camSVG(c, 46)}<span>${esc(c.name)}</span></button>`).join('')}</div></div>
  <div class="panel" id="rpanel">${slider('amount', 'Filter strength', 0, 1, 0.05, o.amount, ADJF.amount)}${slider('exposure', 'Exposure', -2, 2, 0.1, o.adj.exposure, ADJF.exposure)}${slider('temp', 'Temperature', -1, 1, 0.05, o.adj.temp, ADJF.temp)}${slider('leakAmt', 'Light leak', 0, 2, 0.1, 1, (v) => (v === 0 ? 'Off' : v < 0.7 ? 'Soft' : v < 1.4 ? 'Normal' : 'Strong'))}${slider('grain', 'Extra grain', 0, 0.3, 0.01, 0, (v) => (v === 0 ? 'None' : v < 0.1 ? 'Light' : v < 0.2 ? 'Medium' : 'Heavy'))}</div></section>`;
  let t = 0;
  const render = (long) => { const pp = camPrefs(cam); const oo = { ...o, long: long || 900, leak: o.leakAmt > 0, dust: pp.dust, strip: pp.strip && !cam.border }; let img = developOne(orig, cam, oo); const pc = Settings.cam(cam.id); return cam.border === 'half' || cam.border === 'toy' ? frame(img, { ...cam, border: null }, { ...oo, stamp: oo.stamp }) : frame(img, pc.border ? cam : { ...cam, border: null }, oo); };
  const prev = () => { clearTimeout(t); t = setTimeout(() => { const c2 = render(900); $('#after').src = c2.toDataURL('image/jpeg', 0.85); }, 40); };
  bindSliders($('#rpanel'), { ...ADJF, leakAmt: (v) => (v === 0 ? 'Off' : v < 0.7 ? 'Soft' : v < 1.4 ? 'Normal' : 'Strong'), grain: (v) => (v === 0 ? 'None' : v < 0.1 ? 'Light' : v < 0.2 ? 'Medium' : 'Heavy') }, (k, v) => { if (k === 'leakAmt') o.leakAmt = v; else if (k === 'amount') o.amount = v; else o.adj[k] = v; prev(); });
  $$('[data-rc]').forEach((b) => (b.onclick = () => { cam = camById(b.dataset.rc); $$('[data-rc]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); prev(); }));
  $('#rdone').onclick = async () => {
    $('#rdone').innerHTML = '<span class="spin"></span>';
    const out = render(qualityLong()); const blob = await toBlob(out, 'image/jpeg', 0.93);
    await Roll.put({ ...it, cam: cam.id, out: blob, type: 'photo', thumb: makeThumb(out), opts: { ...it.opts, adj: o.adj, amount: o.amount }, w: out.width, h: out.height });
    blobURL.delete(it.id); toast('Developed again'); back();
  };
  prev();
};

// ---------------- edit: crop, rotate, flip, shape ----------------
SCREENS.edit = async (id) => {
  const it = await Roll.get(id); if (!it || it.type === 'video' || it.type === 'gif') { back(); return; }
  let cam = camById(it.cam); if (cam.video) cam = camById('gold');
  const fromOrig = !!it.orig && cam.border !== 'half' && cam.border !== 'toy';
  const img = await loadImage(URL.createObjectURL(fromOrig ? it.orig : it.out));
  const E = { rot: 0, flip: false, ratio: null, scale: 1, px: 0, py: 0 };
  const SH = [[null, 'Original'], [[1, 1], '1:1'], [[4, 5], '4:5'], [[3, 4], '3:4'], [[2, 3], '2:3'], [[9, 16], '9:16'], [[16, 9], '16:9']];
  app.innerHTML = `<section class="scr">${top('Edit', `<button class="chip" id="edone" style="background:var(--nude);color:var(--ink)">Done</button>`)}
  <div class="estage" id="est"><canvas id="ecv"></canvas><div class="ecrop" id="ecr"><i></i><i></i><i></i><i></i></div></div>
  <div class="etools"><button class="act" id="erot">${ic('rotate')}<span>Rotate</span></button><button class="act" id="eflip">${ic('mirror')}<span>Flip</span></button><button class="act" id="ereset">${ic('x')}<span>Reset</span></button></div>
  <div style="padding:0 16px 6px"><div class="chips" id="esh">${SH.map(([r, l], i) => `<button class="chip" data-sh="${i}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div></div>
  <div class="panel" id="epanel">${slider('scale', 'Zoom', 1, 3, 0.01, 1, (v) => v.toFixed(2) + '×')}<p class="lbl" style="margin:4px 0 0">Drag the picture to move it inside the frame.${fromOrig ? ' The film look is developed again from your original, so the border and date stay sharp.' : ''}</p></div></section>`;
  const cv = $('#ecv'), st = $('#est'), cr = $('#ecr');
  const dims = () => (E.rot % 180 ? [img.naturalHeight, img.naturalWidth] : [img.naturalWidth, img.naturalHeight]);
  const rect = () => { const [W, H] = dims(), r = E.ratio ? E.ratio[0] / E.ratio[1] : W / H; let cw = W, ch = W / r; if (ch > H) { ch = H; cw = H * r; } cw /= E.scale; ch /= E.scale; return { W, H, cw, ch, x: (W - cw) / 2 * (1 + E.px), y: (H - ch) / 2 * (1 + E.py) }; };
  const draw = () => {
    const [W, H] = dims(), bw = st.clientWidth - 32, bh = st.clientHeight - 24, k = Math.min(bw / W, bh / H);
    cv.width = Math.round(W * k * (devicePixelRatio || 1)); cv.height = Math.round(H * k * (devicePixelRatio || 1)); cv.style.width = Math.round(W * k) + 'px'; cv.style.height = Math.round(H * k) + 'px';
    const x = cv.getContext('2d'), s2 = cv.width / W; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); x.translate(cv.width / 2, cv.height / 2); x.rotate(E.rot * Math.PI / 180); if (E.flip) x.scale(-1, 1); x.scale(s2, s2); x.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    const r = rect(), ox = (st.clientWidth - W * k) / 2, oy = (st.clientHeight - H * k) / 2;
    Object.assign(cr.style, { left: ox + r.x * k + 'px', top: oy + r.y * k + 'px', width: r.cw * k + 'px', height: r.ch * k + 'px' });
  };
  bindSliders($('#epanel'), { scale: (v) => v.toFixed(2) + '×' }, (k, v) => { E.scale = v; draw(); });
  $('#erot').onclick = () => { E.rot = (E.rot + 90) % 360; E.px = E.py = 0; draw(); };
  $('#eflip').onclick = () => { E.flip = !E.flip; draw(); };
  $('#ereset').onclick = () => { Object.assign(E, { rot: 0, flip: false, ratio: null, scale: 1, px: 0, py: 0 }); $$('[data-sh]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sh === '0'))); const r = $('[data-sl="scale"]'); r.value = 1; r.style.setProperty('--v', '0%'); $('[data-out="scale"]').textContent = '1.00×'; draw(); };
  $$('[data-sh]').forEach((b) => (b.onclick = () => { E.ratio = SH[+b.dataset.sh][0]; E.px = E.py = 0; $$('[data-sh]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); draw(); }));
  let drag = null;
  st.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, px: E.px, py: E.py }; st.setPointerCapture(e.pointerId); });
  st.addEventListener('pointermove', (e) => { if (!drag) return; const r = rect(), k = parseFloat(cv.style.width) / r.W, fx = (r.W - r.cw) / 2 * k, fy = (r.H - r.ch) / 2 * k; E.px = fx > 1 ? Math.max(-1, Math.min(1, drag.px - (e.clientX - drag.x) / fx)) : 0; E.py = fy > 1 ? Math.max(-1, Math.min(1, drag.py - (e.clientY - drag.y) / fy)) : 0; draw(); });
  st.addEventListener('pointerup', () => (drag = null)); st.addEventListener('pointercancel', () => (drag = null));
  window.onresize = draw; draw();
  $('#edone').onclick = async () => {
    $('#edone').innerHTML = '<span class="spin"></span>';
    try {
      const r = rect(), full = document.createElement('canvas'); full.width = r.W; full.height = r.H; const fx = full.getContext('2d');
      fx.translate(r.W / 2, r.H / 2); fx.rotate(E.rot * Math.PI / 180); if (E.flip) fx.scale(-1, 1); fx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      const crop = document.createElement('canvas'); crop.width = Math.round(r.cw); crop.height = Math.round(r.ch); crop.getContext('2d').drawImage(full, r.x, r.y, r.cw, r.ch, 0, 0, crop.width, crop.height);
      let out = crop, orig = null;
      if (fromOrig) {
        const c2 = { ...cam, aspect: [crop.width, crop.height] }, pp = camPrefs(cam);
        const o = { ...it.opts, adj: { exposure: 0, temp: 0, tint: 0, iso: 400, shutter: 125, ...(it.opts.adj || {}) }, lenses: it.opts.lenses || {}, date: new Date(it.opts.date || it.created), long: qualityLong(), dust: pp.dust, strip: pp.strip && !cam.border, seed: it.opts.seed || 7 };
        const im = developOne(crop, c2, o); out = frame(im, o.border && cam.border ? c2 : { ...c2, border: null }, o);
        orig = await toBlob(crop, 'image/jpeg', 0.92);
      }
      const blob = await toBlob(out, 'image/jpeg', 0.93);
      await Roll.put({ ...it, out: blob, orig: orig || it.orig, thumb: makeThumb(out), w: out.width, h: out.height });
      blobURL.delete(it.id); blobURL.delete(it.id + 'o'); toast('Saved'); back();
    } catch (e) { console.error(e); toast('Could not save the edit'); $('#edone').textContent = 'Done'; }
  };
};

// ---------------- import ----------------
SCREENS.import = (arg) => {
  let tab = arg || (S.mode === 'video' ? 'video' : 'photo');
  const draw = () => {
    app.innerHTML = `<section class="scr">${top('Import', '<span class="meta" id="isel"></span>')}<div class="itabs">${[['photo', 'Photos'], ['video', 'Videos']].map(([k, l]) => `<button class="chip" data-it="${k}" aria-pressed="${tab === k}">${l}</button>`).join('')}</div><div id="ibody" style="display:contents"></div></section>`;
    $$('[data-it]').forEach((b) => (b.onclick = () => { if (b.dataset.it === tab) return; tab = b.dataset.it; S.stack[S.stack.length - 1] = ['import', tab]; draw(); }));
    $('[data-back]', app).onclick = back;
    if (tab === 'video') importVideo(); else importPhotos();
  };
  draw();
};
function importPhotos() {
  const sel = [], files = []; let cam = S.cam.video ? camById(Settings.get().cam) : S.cam; if (cam.video || cam.shots > 2) cam = camById('gold'); let amount = 1;
  $('#ibody').innerHTML = `<p class="lbl" style="padding:0 16px 8px;margin:0">Pick as many photos as you like and develop them all with one camera.</p>
  <div class="scroll"><div class="row" style="padding:0 16px 8px;gap:8px"><button class="chip" id="iall" hidden>Select all</button><button class="chip" id="inone" hidden>Clear</button></div>
  <div class="rgrid" id="ig"><button id="iadd" aria-label="Pick photos" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:var(--panel);color:var(--nude);font-weight:600;font-size:12px">${ic('image')}<span>Pick photos</span></button></div>
  <div class="lbl" style="padding:6px 16px">Develop with</div><div class="camrow" id="icams">${CAMS.filter((c) => !c.video && !(c.shots > 2)).map((c) => `<button data-ic="${c.id}" aria-pressed="${c.id === cam.id}" aria-label="${esc(c.name)}">${camSVG(c, 46)}<span>${esc(c.name)}</span></button>`).join('')}</div>
  <div class="panel" id="ipanel" style="margin:8px 16px 0;border-radius:18px">${slider('amount', 'Filter strength', 0, 1, 0.05, 1, ADJF.amount)}</div></div>
  <div style="padding:12px 16px 18px"><button class="btn block" id="idev" disabled>Develop</button></div>`;
  const draw = () => {
    const g = $('#ig'); $$('[data-fi]', g).forEach((e) => e.remove());
    files.forEach((f, k) => { const b = document.createElement('button'); b.dataset.fi = k; b.setAttribute('aria-label', 'Photo'); const n = sel.indexOf(k); b.innerHTML = `<img src="${f.url}" alt=""><span class="sel ${n >= 0 ? 'on' : ''}">${n >= 0 ? n + 1 : ''}</span>`; b.onclick = () => { const j = sel.indexOf(k); if (j >= 0) sel.splice(j, 1); else sel.push(k); draw(); }; g.appendChild(b); });
    $('#isel').textContent = `${sel.length} SELECTED`; const dv = $('#idev'); dv.disabled = !sel.length; dv.textContent = sel.length ? `Develop ${sel.length} photo${sel.length > 1 ? 's' : ''} with ${cam.name}` : 'Develop';
    $('#iall').hidden = $('#inone').hidden = files.length < 2;
  };
  $('#iadd').onclick = async () => { const fs = await pickFiles(true); fs.forEach((f) => { files.push({ f, url: URL.createObjectURL(f) }); sel.push(files.length - 1); }); draw(); };
  $('#iall').onclick = () => { sel.length = 0; files.forEach((_, k) => sel.push(k)); draw(); };
  $('#inone').onclick = () => { sel.length = 0; draw(); };
  bindSliders($('#ipanel'), ADJF, (k, v) => (amount = v));
  $$('[data-ic]').forEach((b) => (b.onclick = () => { cam = camById(b.dataset.ic); $$('[data-ic]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); draw(); }));
  draw();
  $('#idev').onclick = async () => {
    const btn = $('#idev'); btn.disabled = true; let done = 0;
    for (const k of sel) {
      btn.innerHTML = `<span class="spin"></span> ${done + 1} / ${sel.length}`;
      try {
        const img = await loadImage(files[k].url); const s0 = Math.min(1, 3600 / Math.max(img.naturalWidth, img.naturalHeight)); const src = document.createElement('canvas'); src.width = Math.round(img.naturalWidth * s0); src.height = Math.round(img.naturalHeight * s0); src.getContext('2d').drawImage(img, 0, 0, src.width, src.height);
        const keep = cam.border === 'instant' || cam.border === 'instantsq' || cam.border === 'medium' || cam.look.fish || cam.aspect[0] === cam.aspect[1];
        const ic2 = { ...cam, aspect: keep ? cam.aspect : (src.width >= src.height ? [Math.max(...cam.aspect), Math.min(...cam.aspect)] : [Math.min(...cam.aspect), Math.max(...cam.aspect)]) };
        const opts = devOpts(ic2, { adj: { exposure: 0, temp: 0, tint: 0, iso: 400, shutter: 125 }, lenses: {}, flashOn: false, amount, date: Settings.get().customDate ? stampDate() : new Date(files[k].f.lastModified || Date.now()), frameNo: done + 1 });
        let out, gif = null;
        if (cam.border === 'toy') { const r = await toyGif(src, ic2, opts); gif = r.gif; out = r.still; } else { const im = developOne(src, ic2, opts); out = ic2.border === 'half' ? frame(im, { ...ic2, border: null }, opts) : frame(im, opts.border ? ic2 : { ...ic2, border: null }, opts); }
        await saveShot(out, gif, ic2, opts, src); done++;
      } catch (e) { console.error(e); }
      await sleep(0);
    }
    toast(`${done} photo${done === 1 ? '' : 's'} developed`); S.stack = [['camera'], ['roll']]; show();
  };
}
// imported video: play it through the film engine and record the result (with its sound)
function importVideo() {
  let cam = S.cam.video || S.cam.both ? S.cam : camById(Settings.get().vcam || 'vhs'); if (!(cam.video || cam.both)) cam = camById('vhs'); let file = null, amount = 1, job = null;
  $('#ibody').innerHTML = `<p class="lbl" style="padding:0 16px 8px;margin:0">Pick a video from your gallery and give it a VHS, Super 8, DV or 16mm look. The sound is kept.</p>
  <div class="scroll"><div class="vimp" id="vbox"><button class="pick" id="vpick">${ic('video')}<span>Pick a video</span></button></div><div class="prog" id="vprog" hidden><i></i></div>
  <div class="lbl" style="padding:12px 16px 6px">Develop with</div><div class="camrow" id="vcams">${CAMS.filter((c) => c.video || c.both).map((c) => `<button data-vc="${c.id}" aria-pressed="${c.id === cam.id}" aria-label="${esc(c.name)}">${camSVG(c, 46)}<span>${esc(c.name)}</span></button>`).join('')}</div>
  <div class="panel" id="vpanel" style="margin:8px 16px 0;border-radius:18px">${slider('amount', 'Filter strength', 0, 1, 0.05, 1, ADJF.amount)}</div>
  <p class="lbl" style="padding:8px 16px 0;margin:0">Developing takes as long as the video itself (up to 3 minutes).</p></div>
  <div style="padding:12px 16px 18px"><button class="btn block" id="vdev" disabled>Develop video</button></div>`;
  $('#isel').textContent = '';
  const pick = async () => { const fs = await pickFiles(false, 'video/*'); if (!fs[0]) return; file = fs[0]; $('#vbox').innerHTML = `<video src="${URL.createObjectURL(file)}" muted playsinline loop autoplay></video>`; $('#vdev').disabled = false; $('#vdev').textContent = `Develop with ${cam.name}`; $('#isel').textContent = file.name.length > 18 ? file.name.slice(0, 16) + '…' : file.name; };
  $('#vpick').onclick = pick; $('#vbox').onclick = (e) => { if (!job && e.target.tagName === 'VIDEO') pick(); };
  bindSliders($('#vpanel'), ADJF, (k, v) => (amount = v));
  $$('[data-vc]').forEach((b) => (b.onclick = () => { if (job) return; cam = camById(b.dataset.vc); $$('[data-vc]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); if (file) $('#vdev').textContent = `Develop with ${cam.name}`; }));
  $('#vdev').onclick = async () => {
    if (job) { job.cancel(); return; }
    const btn = $('#vdev'), bar = $('#vprog'); bar.hidden = false; btn.textContent = 'Cancel';
    try {
      job = developVideo(file, cam, { amount, dust: camPrefs(cam).dust, date: Settings.get().customDate ? stampDate() : new Date(file.lastModified || Date.now()) }, (f, cv) => { $('i', bar).style.width = Math.round(f * 100) + '%'; const box = $('#vbox'); if (box && cv && !box.contains(cv)) { box.innerHTML = ''; box.appendChild(cv); } });
      const r = await job.done; job = null;
      if (!r) { toast('Cancelled', 1200); importVideo(); return; }
      const it = { id: uid(), created: Date.now(), cam: cam.id, type: 'video', out: r.blob, orig: null, opts: {}, w: r.w, h: r.h, thumb: r.thumb, dur: r.dur };
      await Roll.put(it); if (Settings.get().saveToPhone && N.isApp()) N.saveFile(r.blob, fileName(it)).catch(() => {});
      toast('Video developed'); S.stack = [['camera'], ['roll']]; show();
    } catch (e) { console.error(e); job = null; toast(e.message || 'Could not develop that video'); importVideo(); }
  };
}
function developVideo(file, cam, o, onProg) {
  let cancelled = false, stop = null;
  const done = (async () => {
    const v = document.createElement('video'); v.src = URL.createObjectURL(file); v.playsInline = true; v.preload = 'auto';
    await new Promise((ok, bad) => { v.onloadedmetadata = ok; v.onerror = () => bad(new Error('Could not open that video')); });
    if (!v.videoWidth) throw new Error('Could not open that video');
    const land = v.videoWidth >= v.videoHeight, [a0, b0] = cam.aspect, A = land ? [Math.max(a0, b0), Math.min(a0, b0)] : [Math.min(a0, b0), Math.max(a0, b0)];
    const long = 960, W = A[0] >= A[1] ? long : Math.round(long * A[0] / A[1]), H = A[0] >= A[1] ? Math.round(long * A[1] / A[0]) : long;
    const E = stillEngine(), out = document.createElement('canvas'); out.width = W; out.height = H; const x = out.getContext('2d');
    out.style.cssText = 'width:100%;height:100%;object-fit:contain;background:#000';
    const vs = out.captureStream(30);
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') await actx.resume(); const sn = actx.createMediaElementSource(v), dest = actx.createMediaStreamDestination(); sn.connect(dest); dest.stream.getAudioTracks().forEach((t) => vs.addTrack(t)); } catch (e) { v.muted = true; }
    const types = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    const mime = types.find((t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
    if (!window.MediaRecorder) throw new Error('Video recording is not supported here');
    const mr = new MediaRecorder(vs, mime ? { mimeType: mime, videoBitsPerSecond: 6e6 } : undefined), chunks = [];
    mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const stopped = new Promise((ok) => (mr.onstop = ok));
    const maxT = Math.min(v.duration || 180, 180); let f = 0, thumb = '', seed = Math.random() * 50;
    const draw = () => {
      f++; const t = v.currentTime, leakAmt = cam.leak ? (0.25 + 0.2 * Math.sin(t * 0.6)) * Math.min(1, cam.leak * 1.3) : 0;
      E.draw(v, W, H, cam.look, { adj: {}, seed: (f % 60) + seed, t: f % 97, leak: Settings.cam(cam.id).leaks ? leakAmt : 0, leakPos: [1.05, 0.3 + 0.1 * Math.sin(t * 0.3)], flicker: cam.id === 'super8' ? 0.93 + Math.random() * 0.1 : 1, amount: o.amount, dust: o.dust });
      x.drawImage(E.cv, 0, 0); drawOverlay(x, W, H, cam, t, new Date(o.date.getTime() + t * 1000));
      if (f === 8) thumb = makeThumb(out);
      onProg && onProg(Math.min(1, t / maxT), out);
    };
    mr.start(500);
    try { await v.play(); } catch (e) { v.muted = true; await v.play(); }
    await new Promise((ok) => {
      stop = ok; v.onended = ok;
      const tick = () => { if (cancelled || v.ended || v.currentTime >= maxT) { ok(); return; } if (v.readyState >= 2) draw(); requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    v.pause(); try { mr.stop(); } catch (e) {} await stopped; URL.revokeObjectURL(v.src);
    if (cancelled || !chunks.length) return null;
    return { blob: new Blob(chunks, { type: (mr.mimeType || mime || 'video/webm').split(';')[0] }), thumb: thumb || makeThumb(out), w: W, h: H, dur: Math.round(Math.min(v.currentTime, maxT)) };
  })();
  return { done, cancel: () => { cancelled = true; stop && stop(); } };
}

// ---------------- roll ----------------
SCREENS.roll = async () => {
  let filt = 'all';
  app.innerHTML = `<section class="scr">${top('Your roll', '<span class="meta" id="rc"></span>')}<div style="padding:0 16px 10px"><div class="chips" id="rch"></div></div><div class="scroll" id="rl"><div class="empty"><span class="spin light"></span></div></div></section>`;
  const all = await Roll.list(); $('#rc').textContent = all.length || '';
  const used = [...new Set(all.map((r) => r.cam))];
  const chips = [['all', 'All'], ['photo', 'Photos'], ['video', 'Videos'], ...used.map((id) => [id, camById(id).name])];
  $('#rch').innerHTML = chips.map(([k, l]) => `<button class="chip" data-f="${k}" aria-pressed="${k === filt}">${esc(l)}</button>`).join('');
  const draw = () => {
    const rows = all.filter((r) => filt === 'all' || (filt === 'photo' ? r.type !== 'video' : filt === 'video' ? r.type === 'video' : r.cam === filt));
    $('#rl').innerHTML = rows.length ? `<div class="rgrid">${rows.map((r, i) => `<button data-id="${r.id}" style="animation-delay:${Math.min(i, 15) * 25}ms" aria-label="Open">${r.thumb ? `<img src="${r.thumb}" alt="">` : ''}${r.type === 'video' ? `<span class="v">${ic('play')}${r.dur ? Math.floor(r.dur / 60) + ':' + String(r.dur % 60).padStart(2, '0') : ''}</span>` : r.type === 'gif' ? '<span class="v">GIF</span>' : ''}</button>`).join('')}</div><p class="lbl" style="text-align:center;padding:0 20px 24px">Kept in the app${N.isApp() ? ' and saved to your gallery (camelyyy album)' : ''}.</p>`
      : `<div class="empty">${camSVG(camById('gold'), 110)}<b>No shots yet</b><span>Take a photo or import some to start your roll.</span><button class="btn" id="rgo">${ic('back')} Back to camera</button></div>`;
    $$('[data-id]').forEach((b) => (b.onclick = () => go('view', b.dataset.id)));
    if ($('#rgo')) $('#rgo').onclick = back;
  };
  $$('[data-f]').forEach((b) => (b.onclick = () => { filt = b.dataset.f; $$('[data-f]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); draw(); }));
  draw();
};

// ---------------- settings ----------------
SCREENS.settings = () => {
  const s = Settings.get(), app0 = N.isApp();
  app.innerHTML = `<section class="scr">${top('Settings')}<div class="scroll"><div class="sets">
  <div class="card"><h3>Shooting</h3>${tog('keepOriginal', 'Keep the original', 'Needed to re-develop later', s.keepOriginal)}${'ImageCapture' in window ? tog('fullRes', 'Full-resolution photos', 'Use the full camera sensor (slower shutter)', s.fullRes) : ''}${tog('mirror', 'Mirror selfies', 'Front camera photos like a mirror', s.mirror)}${tog('sound', 'Shutter sound', 'Each camera has its own click', s.sound)}${tog('haptics', 'Vibration', 'Feel the shutter on your phone', s.haptics)}${tog('filmRoll', 'Film roll', '36 shots per roll, then a fresh roll', s.filmRoll)}${tog('grid', 'Show grid', 'Rule of thirds', s.grid)}</div>
  <div class="card"><h3>Date stamp</h3><div class="chips">${[['yy', stampText('yy')], ['dmy', stampText('dmy')], ['mdy', stampText('mdy')], ['off', 'Off']].map(([k, l]) => `<button class="chip" data-ds="${k}" aria-pressed="${s.stampStyle === k}">${esc(l)}</button>`).join('')}</div>
  <label class="lbl" for="cdate">Custom date (leave empty for today)</label><div class="chips" style="margin-bottom:8px">${[['', 'Today'], ...[1985, 1992, 1998, 2003, 2008].map((y) => { const t = new Date(); return [`${y}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`, `'${String(y).slice(2)}`]; })].map(([v, l]) => `<button class="chip" data-cd="${v}" aria-pressed="${s.customDate === v}">${l}</button>`).join('')}</div><input id="cdate" class="tin" type="date" value="${esc(s.customDate)}"></div>
  <div class="card"><h3>Saving</h3><div class="chips">${[['standard', 'Standard'], ['high', 'High'], ['max', 'Max']].map(([k, l]) => `<button class="chip" data-q="${k}" aria-pressed="${s.quality === k}">${l}</button>`).join('')}</div>${app0 ? tog('saveToPhone', 'Save to phone gallery', 'Every shot also goes to the camelyyy album', s.saveToPhone) : '<p>On the website, tap Save on a photo to download it.</p>'}</div>
  <div class="card"><h3>Favourite cameras</h3><p>The 4 cameras under the shutter. Long-press a camera in All cameras to change them.</p><div class="camrow" style="padding:0">${s.favs.map((id) => { const c = camById(id); return `<button aria-label="${esc(c.name)}">${camSVG(c, 46)}<span>${esc(c.name)}</span></button>`; }).join('')}</div></div>
  ${app0 ? `<div class="card"><h3>Updates</h3><p>camelyyy checks its website for a newer version.</p><input class="tin" id="site" placeholder="${esc(N.DEFAULT_SITE)}" value="${esc(s.site)}" aria-label="camelyyy website"><div class="row"><button class="btn ghost" id="siteSave">Save website</button><button class="btn" id="upd">Check now</button></div></div>` : ''}
  <div class="card"><h3>Privacy</h3><p>Your photos and videos stay on this device. camelyyy has no account and no ads, and never uploads your pictures.</p></div>
  <p class="lbl" style="text-align:center">camelyyy ${VERSION} · ${N.platformName()}</p></div></div></section>`;
  $$('[data-tog]').forEach((b) => (b.onclick = () => { const k = b.dataset.tog, v = !Settings.get()[k]; Settings.set({ [k]: v }); b.setAttribute('aria-checked', String(v)); if (k === 'grid') S.grid = v; }));
  $$('[data-ds]').forEach((b) => (b.onclick = () => { Settings.set({ stampStyle: b.dataset.ds }); $$('[data-ds]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }));
  $$('[data-q]').forEach((b) => (b.onclick = () => { Settings.set({ quality: b.dataset.q }); $$('[data-q]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }));
  $('#cdate').onchange = (e) => { Settings.set({ customDate: e.target.value }); $$('[data-cd]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.cd === e.target.value))); };
  $$('[data-cd]').forEach((b) => (b.onclick = () => { Settings.set({ customDate: b.dataset.cd }); $('#cdate').value = b.dataset.cd; $$('[data-cd]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }));
  if ($('#siteSave')) $('#siteSave').onclick = () => { Settings.set({ site: $('#site').value.trim() }); toast('Saved'); };
  if ($('#upd')) $('#upd').onclick = () => checkUpdate(true);
};

// ---------------- updates ----------------
const newer = (a, b) => { const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) > (y[i] || 0)) return true; if ((x[i] || 0) < (y[i] || 0)) return false; } return false; };
async function checkUpdate(manual) {
  if (!N.isApp()) return;
  try { const r = await fetch(N.api('version.json') + '?t=' + Date.now(), { cache: 'no-store' }); if (!r.ok) throw 0; const j = await r.json();
    if (newer(j.version, VERSION)) updateDialog(j); else if (manual) toast(`You have the newest version (${VERSION})`);
  } catch (e) { if (manual) toast("Couldn't check for updates"); }
}
function updateDialog(j) {
  const u = j[N.isAndroidApp() ? 'android' : 'windows'];
  const d = openSheet(`<h2>camelyyy ${esc(j.version)}</h2>${(j.notes || []).length ? `<p>${j.notes.map(esc).join('<br>')}</p>` : ''}<div class="row"><button class="btn ghost" data-n>Later</button><button class="btn" data-y ${u ? '' : 'disabled'}>Download</button></div>`, 'dlg');
  $('[data-n]', d).onclick = () => closeSheet(); $('[data-y]', d).onclick = () => { closeSheet(); N.openUrl(/^https?:/.test(u) ? u : N.site() + u); };
}

// ---------------- start ----------------
function start() {
  document.addEventListener('keydown', (e) => { if (e.key === ' ' && S.stack.length && S.stack[S.stack.length - 1][0] === 'camera' && !e.target.matches('input')) { e.preventDefault(); shoot(); } if (e.key === 'Escape' && S.sheet) closeSheet(); });
  document.addEventListener('visibilitychange', () => { if (!S.stack.length || S.stack[S.stack.length - 1][0] !== 'camera') return; if (document.hidden) { if (S.rec) stopRec(); S.tok++; stopLoop(); stopCamera(); } else show(); });
  N.onBack(() => back());
  if (!N.isApp()) { history.pushState({ m: 1 }, ''); addEventListener('popstate', () => { if (back()) history.pushState({ m: 1 }, ''); }); }
  // settings button lives on the camera screen top-left on long press of the brand: simpler, add to roll screen
  go('camera', null, { reset: true });
  if (N.isApp()) setTimeout(() => checkUpdate(false), 3000);
  if (!N.isApp() && 'serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
}
start();
window.__m = { S, go };
