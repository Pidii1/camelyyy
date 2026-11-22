// camelyyy film engine: one WebGL pass that turns a clean picture into a film photo
const VS = `attribute vec2 p; varying vec2 v; void main(){ v = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;
const FS = `precision highp float;
varying vec2 v;
uniform sampler2D tex; uniform vec2 res; uniform float seed, t;
uniform float expo, temp, tint, contrast, sat, fade, grain, vig, leak, fish, ca, scan, soft, halation, mono, zoom, mirror, flicker, amt, dust;
uniform vec3 shad, high, leakCol, tone; uniform vec2 leakPos, srcScale; uniform mat3 mtx;
float hash(vec2 q){ return fract(sin(dot(q, vec2(12.9898,78.233)) + seed) * 43758.5453); }
vec3 samp(vec2 uv){
  uv = (uv - 0.5) * srcScale + 0.5;
  if (mirror > 0.5) uv.x = 1.0 - uv.x;
  return texture2D(tex, vec2(uv.x, 1.0 - uv.y)).rgb;
}
vec3 sampleCA(vec2 uv){
  vec2 d = (uv - 0.5) * ca;
  vec3 c = vec3(samp(uv + d).r, samp(uv).g, samp(uv - d).b);
  if (soft > 0.0) {
    vec2 o = soft * 2.5 / res;
    vec3 b = (samp(uv + vec2(o.x,0.)) + samp(uv - vec2(o.x,0.)) + samp(uv + vec2(0.,o.y)) + samp(uv - vec2(0.,o.y)) + samp(uv + o) + samp(uv - o)) / 6.0;
    c = mix(c, b, clamp(soft, 0.0, 1.0) * 0.8);
  }
  return c;
}
void main(){
  vec2 uv = (v - 0.5) / zoom + 0.5;
  float inside = 1.0;
  if (fish > 0.0) {
    vec2 q = (v - 0.5) * 2.0; q.x *= res.x / res.y;
    float r = length(q), lim = min(1.0, res.x / res.y);
    if (fish > 0.99) inside = smoothstep(lim + 0.01, lim - 0.01, r * mix(1.0, 1.02, fish));
    float k = 1.0 + fish * 0.9 * r * r;
    q = q / k * (1.0 + fish * 0.35); q.x /= res.x / res.y;
    uv = q * 0.5 / zoom + 0.5;
  }
  vec3 c = sampleCA(uv); vec3 c0 = samp(uv);
  // halation: red glow around bright parts
  if (halation > 0.0) {
    vec2 o = 6.0 / res; vec3 g = (samp(uv + o) + samp(uv - o) + samp(uv + vec2(o.x,-o.y)) + samp(uv + vec2(-o.x,o.y))) * 0.25;
    float l = max(dot(g, vec3(.299,.587,.114)) - 0.65, 0.0) * 2.8;
    c += vec3(1.0, 0.35, 0.18) * l * halation * 0.5;
  }
  c *= pow(2.0, expo) * flicker;
  c.r += temp * 0.07; c.b -= temp * 0.07; c.g -= tint * 0.05;
  c = mtx * c;
  c = (c - 0.5) * contrast + 0.5;
  float L = dot(c, vec3(.299,.587,.114));
  c = mix(vec3(L), c, sat);
  c += shad * (1.0 - smoothstep(0.0, 0.55, L)) + high * smoothstep(0.45, 1.0, L);
  c = c * (1.0 - fade) + fade * vec3(0.16, 0.13, 0.11);
  if (mono > 0.5) { float m = dot(c, vec3(.3,.59,.11)); c = vec3(m) * tone; }
  // light leak
  if (leak > 0.0) {
    vec2 a = v - leakPos; a.x *= res.x / res.y;
    float d = length(a);
    c = 1.0 - (1.0 - c) * (1.0 - leakCol * leak * smoothstep(0.9, 0.0, d));
  }
  // vignette
  vec2 w = v - 0.5; c *= 1.0 - vig * smoothstep(0.25, 0.85, length(w) * 1.25);
  // scanlines
  if (scan > 0.0) { float s = 0.5 + 0.5 * sin(v.y * res.y * 1.6); c *= 1.0 - scan * 0.35 * s; c.r *= 1.0 + scan * 0.06; }
  // grain
  float n = hash(floor(v * res) + t) - 0.5;
  c += n * grain * (0.6 + 0.6 * (1.0 - L));
  // dust specks and scratches
  if (dust > 0.0) {
    vec2 px = v * res, cs = vec2(max(6.0, res.x / 160.0)); vec2 cell = floor(px / cs), f = fract(px / cs);
    float h = hash(cell * 1.37 + 5.1);
    if (h > 1.0 - 0.006 * dust) { vec2 ct = vec2(hash(cell + 3.1), hash(cell + 7.7)); float r = 0.12 + 0.3 * hash(cell + 1.3); float d = length((f - ct) * vec2(1.0, 0.8 + hash(cell + 9.0)));
      c = mix(c, hash(cell + 2.2) > 0.75 ? vec3(0.95, 0.93, 0.88) : vec3(0.04, 0.03, 0.03), dust * 0.85 * smoothstep(r, r * 0.4, d)); }
    for (int i = 0; i < 2; i++) { float fi = float(i); float x0 = hash(vec2(fi * 7.3, 1.9)); float w = abs(v.x - x0 - 0.01 * sin(v.y * 9.0 + fi)) * res.x;
      float seg = step(0.45, hash(vec2(fi, floor(v.y * 6.0)))); c = mix(c, vec3(0.92, 0.9, 0.85), dust * 0.35 * seg * smoothstep(1.2, 0.0, w)); }
  }
  c *= inside;
  c = mix(c0 * inside, c, amt);
  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}`;

export class Film {
  constructor(canvas) {
    this.cv = canvas || document.createElement('canvas');
    const gl = this.cv.getContext('webgl', { preserveDrawingBuffer: true, premultipliedAlpha: false }) || this.cv.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    if (!gl) throw new Error('no-webgl');
    this.gl = gl;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    gl.useProgram(pr); this.pr = pr;
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    this.u = {};
    ['tex', 'res', 'seed', 't', 'expo', 'temp', 'tint', 'contrast', 'sat', 'fade', 'grain', 'vig', 'leak', 'fish', 'ca', 'scan', 'soft', 'halation', 'mono', 'zoom', 'mirror', 'flicker', 'amt', 'dust', 'tone', 'shad', 'high', 'leakCol', 'leakPos', 'srcScale', 'mtx'].forEach((k) => (this.u[k] = gl.getUniformLocation(pr, k)));
    this.maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  }
  // source: video, image or canvas. W x H = output size. Source is cropped to fill (cover).
  draw(src, W, H, look, o = {}) {
    const gl = this.gl, u = this.u;
    if (this.cv.width !== W || this.cv.height !== H) { this.cv.width = W; this.cv.height = H; }
    gl.viewport(0, 0, W, H);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, src); } catch (e) { return false; }
    const sw = src.videoWidth || src.naturalWidth || src.width, sh = src.videoHeight || src.naturalHeight || src.height;
    if (!sw || !sh) return false;
    const sa = sw / sh, da = W / H; // cover
    const sx = sa > da ? da / sa : 1, sy = sa > da ? 1 : sa / da;
    const L = { ...look }, x = o.adj || {};
    const iso = x.iso || 400, shutter = x.shutter || 125;
    const expo = (L.exp || 0) + (x.exposure || 0) + Math.log2(iso / 400) * 0.5 - Math.log2(shutter / 125) * 0.5 + (o.nd ? -1.1 : 0) + (o.flashBoost || 0);
    gl.uniform1i(u.tex, 0);
    gl.uniform2f(u.res, W, H);
    gl.uniform1f(u.seed, o.seed ?? Math.random() * 100);
    gl.uniform1f(u.t, o.t || 0);
    gl.uniform1f(u.expo, expo);
    gl.uniform1f(u.temp, (L.temp || 0) + (x.temp || 0));
    gl.uniform1f(u.tint, (L.tint || 0) + (x.tint || 0));
    gl.uniform1f(u.contrast, L.contrast ?? 1);
    gl.uniform1f(u.sat, L.sat ?? 1);
    gl.uniform1f(u.fade, L.fade || 0);
    gl.uniform1f(u.grain, ((L.grain || 0) + (x.grain ?? 0)) * (0.7 + 0.3 * Math.log2(iso / 100) / 5));
    gl.uniform1f(u.vig, L.vig || 0);
    gl.uniform1f(u.leak, o.leak ?? 0);
    gl.uniform3fv(u.leakCol, o.leakCol || [1, 0.45, 0.15]);
    gl.uniform2fv(u.leakPos, o.leakPos || [1.05, 0.3]);
    gl.uniform1f(u.fish, o.fish ?? (L.fish || 0));
    gl.uniform1f(u.ca, L.ca || 0);
    gl.uniform1f(u.scan, L.scan || 0);
    gl.uniform1f(u.soft, (L.soft || 0) + (o.softLens ? 0.6 : 0));
    gl.uniform1f(u.halation, (L.halation || 0) + (o.softLens ? 0.35 : 0));
    gl.uniform1f(u.mono, L.mono ? 1 : 0);
    gl.uniform1f(u.zoom, o.zoom || 1);
    gl.uniform1f(u.mirror, o.mirror ? 1 : 0);
    gl.uniform1f(u.flicker, o.flicker || 1);
    gl.uniform3fv(u.shad, L.shad || [0, 0, 0]);
    gl.uniform3fv(u.high, L.high || [0, 0, 0]);
    gl.uniform2f(u.srcScale, sx, sy);
    const m = L.mtx || [1, 0, 0, 0, 1, 0, 0, 0, 1]; // rows in, columns out
    gl.uniformMatrix3fv(u.mtx, false, [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]);
    gl.uniform1f(u.amt, Math.max(0, Math.min(1, o.amount ?? 1)));
    gl.uniform1f(u.dust, o.dust ? (L.dustAmt || 1) : 0);
    gl.uniform3fv(u.tone, L.tone || [1, 0.985, 0.96]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return true;
  }
}

// one shared engine for stills (separate from the live preview canvas)
let still = null;
export function stillEngine() { if (!still) still = new Film(); return still; }
