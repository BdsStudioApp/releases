import { buildWalls, furniture, KINDS, WALL_T, towerBoxes } from '../g5_lib/plan3d.js';
let _ox = null;
export function loadThree() {
if (!_ox) _ox = import(new URL('../../../vendor/three/0.160.0/three.module.min.js', import.meta.url).href);
return _ox;
}
function _oz() {
try { const _o4 = document.createElement('canvas'); return !!(_o4.getContext('webgl2') || _o4.getContext('webgl')); } catch { return false; }
}
function label(THREE, text, { size = 0.5, color = '#0F1E33', bg = 'rgba(255,255,255,.85)' } = {}) {
const _o4 = document.createElement('canvas'), x = _o4.getContext('2d');
const font = '600 44px "Be Vietnam Pro", system-ui, sans-serif';
x.font = font; const w = Math.ceil(x.measureText(text).width) + 36;
_o4.width = w; _o4.height = 72; x.font = font;
x.fillStyle = bg; x.beginPath(); x.roundRect ? x.roundRect(0, 0, w, 72, 18) : x.rect(0, 0, w, 72); x.fill();
x.fillStyle = color; x.textBaseline = 'middle'; x.fillText(text, 18, 38);
const _ow = new THREE.CanvasTexture(_o4); _ow.colorSpace = THREE.SRGBColorSpace;
const _or = new THREE.Sprite(new THREE.SpriteMaterial({ map: _ow, depthTest: false, transparent: true }));
_or.scale.set(size * w / 72, size, 1); _or.renderOrder = 10;
return _or;
}
export async function createViewer(container) {
if (!_oz()) return null;
const THREE = await loadThree();
let renderer;
const _o8 = window.devicePixelRatio || 1;
const _o6 = (() => { try { return matchMedia('(pointer: coarse)').matches; } catch { return false; } })();
try { renderer = new THREE.WebGLRenderer({ antialias: _o8 < 2, preserveDrawingBuffer: false, powerPreference: 'low-power' }); } catch { return null; }
renderer.setPixelRatio(Math.min(_o6 ? 1.5 : 2, _o8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);
const _ot = new THREE.Scene(); _ot.background = new THREE.Color('#EFEBE2');
const _o5 = new THREE.PerspectiveCamera(50, 4 / 3, 0.05, 2000);
_ot.add(new THREE.HemisphereLight(0xffffff, 0xb9ad96, 1.6));
const _ov = new THREE.DirectionalLight(0xffffff, 1.4); _ov.position.set(8, 14, 6); _ot.add(_ov);
let _o10 = new THREE.Group(); _ot.add(_o10);
const _om = { target: new THREE.Vector3(), theta: Math.PI / 4, phi: Math.PI / 3.2, r: 14, min: 2, max: 400 };
let _od = null, anim = null, dirty = true, alive = true;
function size() { const w = container.clientWidth || 400, h = container.clientHeight || 300; renderer.setSize(w, h, false); _o5.aspect = w / h; _o5.updateProjectionMatrix(); dirty = true; }
function _op() {
if (anim && anim.follow) return;
const { target: t, theta, phi, r } = _om;
_o5.position.set(t.x + r * Math.sin(phi) * Math.cos(theta), t.y + r * Math.cos(phi), t.z + r * Math.sin(phi) * Math.sin(theta));
_o5.lookAt(t); dirty = true;
}
function _oi(ts) {
if (!alive) return;
if (anim) anim.step(ts);
if (dirty) { renderer.render(_ot, _o5); dirty = false; }
requestAnimationFrame(_oi);
}
const ptrs = new Map(); let _oo = null;
const _ob = renderer.domElement; _ob.style.touchAction = 'none';
let _o0 = false;
_ob.addEventListener('pointerleave', () => { if (!ptrs.size) _o0 = false; });
_ob.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch' && container.classList.contains('g5-locked')) { if (typeof _o1.onLockedTouch === 'function') _o1.onLockedTouch(); return; } _o0 = true; try { _ob.setPointerCapture(e.pointerId); } catch { } ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 2) { const [a, _o2] = [...ptrs.values()]; _oo = { d: Math.hypot(a.x - _o2.x, a.y - _o2.y), r: _om.r }; } });
_ob.addEventListener('pointermove', (e) => {
const _on = ptrs.get(e.pointerId); if (!_on) return;
if (ptrs.size === 1 && !(anim && anim.follow)) { _om.theta += (e.clientX - _on.x) * 0.008; _om.phi = Math.max(0.05, Math.min(Math.PI / 2 - 0.02, _om.phi - (e.clientY - _on.y) * 0.008)); _op(); }
_on.x = e.clientX; _on.y = e.clientY;
if (ptrs.size === 2 && _oo) { const [a, _o2] = [...ptrs.values()]; _om.r = Math.max(_om.min, Math.min(_om.max, _oo.r * _oo.d / Math.max(1, Math.hypot(a.x - _o2.x, a.y - _o2.y)))); _op(); }
});
const _oy = (e) => { ptrs.delete(e.pointerId); if (ptrs.size < 2) _oo = null; };
_ob.addEventListener('pointerup', _oy); _ob.addEventListener('pointercancel', _oy);
_ob.addEventListener('wheel', (e) => { if (!(e.ctrlKey || _o0)) { if (typeof _o1.onLockedWheel === 'function') _o1.onLockedWheel(); return; } e.preventDefault(); _om.r = Math.max(_om.min, Math.min(_om.max, _om.r * (e.deltaY > 0 ? 1.12 : 0.89))); _op(); }, { passive: false });
const _oq = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => size()) : null; if (_oq) _oq.observe(container);
const _ok = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });
function box(w, hgt, d, color, x, y, z, opts) { const _oj = new THREE.Mesh(new THREE.BoxGeometry(w, hgt, d), _ok(color, opts)); _oj.position.set(x, y, z); return _oj; }
function clear() { stopTour(); _ot.remove(_o10); _o10.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); _o10 = new THREE.Group(); _ot.add(_o10); }
const _o1 = {
THREE, renderer,
showPlan(plan, { withFurniture = false, labels = true, cutaway = false } = {}) {
clear();
const { walls } = buildWalls(plan);
for (const r of plan.rooms) {
_o10.add(box(r.w, 0.04, r.d, (KINDS[r.kind] || KINDS.khach).color, r.x + r.w / 2, -0.02, r.y + r.d / 2));
if (labels) { const _or = label(THREE, r.name, { size: 0.42 }); _or.position.set(r.x + r.w / 2, 0.35, r.y + r.d / 2); _o10.add(_or); }
if (withFurniture) for (const _oc of furniture(r)) _o10.add(box(_oc.w, _oc.h, _oc.d, _oc.color, _oc.x + _oc.w / 2, _oc.h / 2, _oc.y + _oc.d / 2));
}
for (const w of walls) {
const _oh = Math.hypot(w.x2 - w.x1, w.y2 - w.y1); if (_oh < 0.01) continue;
const hgt = cutaway && w.kind === 'wall' ? 1.2 : w.h;
const _of = Math.abs(w.y2 - w.y1) < 1e-6;
const _oj = box(_of ? _oh + WALL_T : WALL_T, hgt, _of ? WALL_T : _oh + WALL_T, w.kind === 'rail' ? '#9FB4C4' : '#FAF7F0', (w.x1 + w.x2) / 2, hgt / 2, (w.y1 + w.y2) / 2, w.kind === 'rail' ? { transparent: true, opacity: 0.55 } : {});
_o10.add(_oj);
}
const xs = plan.rooms.flatMap((r) => [r.x, r.x + r.w]), zs = plan.rooms.flatMap((r) => [r.y, r.y + r.d]);
const _o7 = (Math.min(...xs) + Math.max(...xs)) / 2, cz = (Math.min(...zs) + Math.max(...zs)) / 2;
const _ou = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs));
Object.assign(_om, { theta: Math.PI / 4, phi: Math.PI / 3.4, r: _ou * 1.5 + 2, min: 1.5, max: _ou * 6 + 20 });
_om.target.set(_o7, 0.8, cz); _op();
return _o1;
},
showTowers(towers, { floor = null, tower = 0, floorH = 3.2 } = {}) {
clear();
const boxes = towerBoxes(towers, floorH);
_o10.add(box(Math.max(120, boxes.length * 60), 0.2, 120, '#D8D2C3', (boxes.length - 1) * 25, -0.1, 0));
boxes.forEach((_o2, _og) => {
_o10.add(box(_o2.w, _o2.h, _o2.d, _og === tower ? '#C9D3DE' : '#E4E0D6', _o2.x, _o2.h / 2, _o2.y, { transparent: true, opacity: 0.88 }));
if (_og === tower && floor != null) { const _oc = Math.max(1, Math.min(_o2.floors, floor)); _o10.add(box(_o2.w + 0.6, floorH * 0.9, _o2.d + 0.6, '#C9A24A', _o2.x, (_oc - 0.5) * floorH, _o2.y)); }
const _or = label(THREE, _o2.name + ' · ' + _o2.floors + ' tầng', { size: 4 }); _or.position.set(_o2.x, _o2.h + 5, _o2.y); _o10.add(_or);
});
const _ol = Math.max(...boxes.map((_o2) => _o2.h), 10);
Object.assign(_om, { theta: Math.PI / 3, phi: Math.PI / 3, r: _ol * 1.6 + 60, min: 20, max: 1500 });
_om.target.set((boxes.length - 1) * 25, _ol / 2, 0); _op();
return _o1;
},
view(mode) { if (mode === 'top') { _om.phi = 0.06; } else { _om.phi = Math.PI / 3.4; } _op(); },
tour(points, { onStep, onDone, speed = 1.3, pause = 1600, color = '#0F1E33' } = {}) {
stopTour();
if (!points || points.length < 2) return false;
_od = new THREE.Group();
const _o3 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 1.25, 16), _ok(color)); _o3.position.y = 0.65; _od.add(_o3);
const _oe = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), _ok('#E9C9A8')); _oe.position.y = 1.47; _od.add(_oe);
const _os = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.42), _ok('#C9A24A')); _os.position.y = 1.05; _od.add(_os);
_o10.add(_od);
let _og = 0, t0 = null, wait = 0;
_od.position.set(points[0].x, 0, points[0].y);
if (points[0].stop && onStep) onStep(points[0], 0);
wait = points[0].stop ? pause : 0;
anim = {
follow: true,
step(ts) {
if (t0 == null) t0 = ts;
const _o9 = Math.min(0.1, (ts - t0) / 1000); t0 = ts;
if (wait > 0) { wait -= _o9 * 1000; } else if (_og < points.length - 1) {
const _o2 = points[_og + 1];
const _oa = _o2.x - _od.position.x, dz = _o2.y - _od.position.z, dist = Math.hypot(_oa, dz), stepLen = speed * _o9;
if (dist <= stepLen) { _od.position.set(_o2.x, 0, _o2.y); _og++; if (_o2.stop) { wait = pause; if (onStep) onStep(_o2, _og); } if (_og >= points.length - 1) { setTimeout(() => { if (onDone) onDone(); }, pause); } }
else { _od.position.x += _oa / dist * stepLen; _od.position.z += dz / dist * stepLen; _od.rotation.y = Math.atan2(_oa, dz); }
}
const _o11 = _od.rotation.y;
_o5.position.set(_od.position.x - Math.sin(_o11) * 3.2, 3.6, _od.position.z - Math.cos(_o11) * 3.2);
_o5.lookAt(_od.position.x + Math.sin(_o11) * 1.5, 0.9, _od.position.z + Math.cos(_o11) * 1.5);
dirty = true;
},
};
return true;
},
stopTour,
snapshot() { renderer.render(_ot, _o5); return renderer.domElement; },
dispose() { alive = false; stopTour(); clear(); if (_oq) _oq.disconnect(); renderer.dispose(); try { renderer.forceContextLoss(); } catch { } renderer.domElement.remove(); },
};
function stopTour() { if (_od) { _o10.remove(_od); _od = null; } if (anim) { anim = null; _op(); } }
size(); _op(); requestAnimationFrame(_oi);
return _o1;
}
