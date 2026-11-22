import { camById } from './cameras.js';
// camelyyy storage: your roll (photos and videos) stays on this device
const DB = 'camelyyy', ST = 'roll';
let dbp;
function db() {
  if (!dbp) dbp = new Promise((ok, bad) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { const s = r.result.createObjectStore(ST, { keyPath: 'id' }); s.createIndex('created', 'created'); };
    r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error);
  });
  return dbp;
}
async function tx(mode, fn) {
  const d = await db();
  return new Promise((ok, bad) => { const t = d.transaction(ST, mode); const req = fn(t.objectStore(ST)); t.oncomplete = () => ok(req && 'result' in req ? req.result : undefined); t.onerror = () => bad(t.error); t.onabort = () => bad(t.error); });
}
export const Roll = {
  put: (it) => tx('readwrite', (s) => s.put(it)),
  get: (id) => tx('readonly', (s) => s.get(id)),
  del: (id) => tx('readwrite', (s) => s.delete(id)),
  async list() { const a = await tx('readonly', (s) => s.getAll()); return (a || []).sort((x, y) => y.created - x.created); },
  async latest() { const a = await this.list(); return a[0]; },
};
const DEF = { keepOriginal: true, mirror: true, sound: true, grid: false, stampStyle: 'yy', customDate: '', quality: 'high', saveToPhone: true, favs: ['gold', 'instw', 'disposa', 'vhs'], cam: 'gold', site: '', perCam: {}, flashColor: '#ffffff', timer: 0, vcam: 'vhs', haptics: true, filmRoll: true, fullRes: true };
export const Settings = {
  get() { try { return { ...DEF, ...JSON.parse(localStorage.getItem('mely_set') || '{}') }; } catch (e) { return { ...DEF }; } },
  set(p) { const v = { ...this.get(), ...p }; try { localStorage.setItem('mely_set', JSON.stringify(v)); } catch (e) {} return v; },
  cam(id) { const pc = this.get().perCam[id] || {}; return { stamp: true, border: true, leaks: true, strip: false, ...(camById(id).defaults || {}), ...pc }; },
  setCam(id, p) { const s = this.get(); const pc = { ...s.perCam, [id]: { ...this.cam(id), ...p } }; return this.set({ perCam: pc }); },
};
