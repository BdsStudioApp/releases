import { buildWalls, furniture, KINDS, WALL_T, towerBoxes } from '../g5_lib/plan3d.js';
let _oy = null;
export function loadThree() {
if (!_oy) _oy = import(new URL('../../../vendor/three/0.160.0/three.module.min.js', import.meta.url).href);
return _oy;
}
function _o10() {
try { const _o5 = document.createElement('canvas'); return !!(_o5.getContext('webgl2') || _o5.getContext('webgl')); } catch { return false; }
}
function label(THREE, text, { size = 0.5, color = '#0F1E33', bg = 'rgba(255,255,255,.85)' } = {}) {
const _o5 = document.createElement('canvas'), x = _o5.getContext('2d');
const font = '600 44px "Be Vietnam Pro", system-ui, sans-serif';
x.font = font; const w = Math.ceil(x.measureText(text).width) + 36;
_o5.width = w; _o5.height = 72; x.font = font;
x.fillStyle = bg; x.beginPath(); x.roundRect ? x.roundRect(0, 0, w, 72, 18) : x.rect(0, 0, w, 72); x.fill();
x.fillStyle = color; x.textBaseline = 'middle'; x.fillText(text, 18, 38);
const _ox = new THREE.CanvasTexture(_o5); _ox.colorSpace = THREE.SRGBColorSpace;
const _os = new THREE.Sprite(new THREE.SpriteMaterial({ map: _ox, depthTest: false, transparent: true }));
_os.scale.set(size * w / 72, size, 1); _os.renderOrder = 10;
return _os;
}
export async function createViewer(container) {
if (!_o10()) return null;
const THREE = await loadThree();
let renderer;
const _o9 = window.devicePixelRatio || 1;
const _o7 = (() => { try { return matchMedia('(pointer: coarse)').matches; } catch { return false; } })();
try { renderer = new THREE.WebGLRenderer({ antialias: _o9 < 2, preserveDrawingBuffer: false, powerPreference: 'low-power' }); } catch { return null; }
renderer.setPixelRatio(Math.min(_o7 ? 1.5 : 2, _o9));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);
const _ou = new THREE.Scene(); _ou.background = new THREE.Color('#EFEBE2');
const _o6 = new THREE.PerspectiveCamera(50, 4 / 3, 0.05, 2000);
_ou.add(new THREE.HemisphereLight(0xffffff, 0xb9ad96, 1.6));
const _ow = new THREE.DirectionalLight(0xffffff, 1.4); _ow.position.set(8, 14, 6); _ou.add(_ow);
let _o11 = new THREE.Group(); _ou.add(_o11);
const _on = { target: new THREE.Vector3(), theta: Math.PI / 4, phi: Math.PI / 3.2, r: 14, min: 2, max: 400 };
let _oe = null, anim = null, dirty = true, alive = true;
function size() { const w = container.clientWidth || 400, h = container.clientHeight || 300; renderer.setSize(w, h, false); _o6.aspect = w / h; _o6.updateProjectionMatrix(); dirty = true; }
function _oq() {
if (anim && anim.follow) return;
const { target: t, theta, phi, r } = _on;
_o6.position.set(t.x + r * Math.sin(phi) * Math.cos(theta), t.y + r * Math.cos(phi), t.z + r * Math.sin(phi) * Math.sin(theta));
_o6.lookAt(t); dirty = true;
}
function _oj(ts) {
if (!alive) return;
if (anim) anim.step(ts);
if (dirty) { renderer.render(_ou, _o6); dirty = false; }
requestAnimationFrame(_oj);
}
const ptrs = new Map(); let _op = null;
const _oc = renderer.domElement; _oc.style.touchAction = 'none';
let _o0 = false;
_oc.addEventListener('pointerleave', () => { if (!ptrs.size) _o0 = false; });
_oc.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch' && container.classList.contains('g5-locked')) { if (typeof _o1.onLockedTouch === 'function') _o1.onLockedTouch(); return; } _o0 = true; try { _oc.setPointerCapture(e.pointerId); } catch { } ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 2) { const [a, _o2] = [...ptrs.values()]; _op = { d: Math.hypot(a.x - _o2.x, a.y - _o2.y), r: _on.r }; } });
_oc.addEventListener('pointermove', (e) => {
const _oo = ptrs.get(e.pointerId); if (!_oo) return;
if (ptrs.size === 1 && !(anim && anim.follow)) { _on.theta += (e.clientX - _oo.x) * 0.008; _on.phi = Math.max(0.05, Math.min(Math.PI / 2 - 0.02, _on.phi - (e.clientY - _oo.y) * 0.008)); _oq(); }
_oo.x = e.clientX; _oo.y = e.clientY;
if (ptrs.size === 2 && _op) { const [a, _o2] = [...ptrs.values()]; _on.r = Math.max(_on.min, Math.min(_on.max, _op.r * _op.d / Math.max(1, Math.hypot(a.x - _o2.x, a.y - _o2.y)))); _oq(); }
});
const _oz = (e) => { ptrs.delete(e.pointerId); if (ptrs.size < 2) _op = null; };
_oc.addEventListener('pointerup', _oz); _oc.addEventListener('pointercancel', _oz);
_oc.addEventListener('wheel', (e) => { if (!(e.ctrlKey || _o0)) { if (typeof _o1.onLockedWheel === 'function') _o1.onLockedWheel(); return; } e.preventDefault(); _on.r = Math.max(_on.min, Math.min(_on.max, _on.r * (e.deltaY > 0 ? 1.12 : 0.89))); _oq(); }, { passive: false });
const _or = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => size()) : null; if (_or) _or.observe(container);
const _ol = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...opts });
function _o4(w, hgt, d, color, x, y, z, opts) { const _ok = new THREE.Mesh(new THREE.BoxGeometry(w, hgt, d), _ol(color, opts)); _ok.position.set(x, y, z); return _ok; }
function clear() { stopTour(); _ou.remove(_o11); _o11.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); _o11 = new THREE.Group(); _ou.add(_o11); }
const _o1 = {
THREE, renderer,
showPlan(plan, { withFurniture = false, labels = true, cutaway = false } = {}) {
clear();
const { walls } = buildWalls(plan);
for (const r of plan.rooms) {
_o11.add(_o4(r.w, 0.04, r.d, (KINDS[r.kind] || KINDS.khach).color, r.x + r.w / 2, -0.02, r.y + r.d / 2));
if (labels) { const _os = label(THREE, r.name, { size: 0.42 }); _os.position.set(r.x + r.w / 2, 0.35, r.y + r.d / 2); _o11.add(_os); }
if (withFurniture) for (const _od of furniture(r)) _o11.add(_o4(_od.w, _od.h, _od.d, _od.color, _od.x + _od.w / 2, _od.h / 2, _od.y + _od.d / 2));
}
for (const w of walls) {
const _oi = Math.hypot(w.x2 - w.x1, w.y2 - w.y1); if (_oi < 0.01) continue;
const hgt = cutaway && w.kind === 'wall' ? 1.2 : w.h;
const _og = Math.abs(w.y2 - w.y1) < 1e-6;
const _ok = _o4(_og ? _oi + WALL_T : WALL_T, hgt, _og ? WALL_T : _oi + WALL_T, w.kind === 'rail' ? '#9FB4C4' : '#FAF7F0', (w.x1 + w.x2) / 2, hgt / 2, (w.y1 + w.y2) / 2, w.kind === 'rail' ? { transparent: true, opacity: 0.55 } : {});
_o11.add(_ok);
}
const xs = plan.rooms.flatMap((r) => [r.x, r.x + r.w]), zs = plan.rooms.flatMap((r) => [r.y, r.y + r.d]);
const _o8 = (Math.min(...xs) + Math.max(...xs)) / 2, cz = (Math.min(...zs) + Math.max(...zs)) / 2;
const _ov = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs));
Object.assign(_on, { theta: Math.PI / 4, phi: Math.PI / 3.4, r: _ov * 1.5 + 2, min: 1.5, max: _ov * 6 + 20 });
_on.target.set(_o8, 0.8, cz); _oq();
return _o1;
},
showTowers(towers, { floor = null, tower = 0, floorH = 3.2 } = {}) {
clear();
const boxes = towerBoxes(towers, floorH);
_o11.add(_o4(Math.max(120, boxes.length * 60), 0.2, 120, '#D8D2C3', (boxes.length - 1) * 25, -0.1, 0));
boxes.forEach((_o2, _oh) => {
_o11.add(_o4(_o2.w, _o2.h, _o2.d, _oh === tower ? '#C9D3DE' : '#E4E0D6', _o2.x, _o2.h / 2, _o2.y, { transparent: true, opacity: 0.88 }));
if (_oh === tower && floor != null) { const _od = Math.max(1, Math.min(_o2.floors, floor)); _o11.add(_o4(_o2.w + 0.6, floorH * 0.9, _o2.d + 0.6, '#C9A24A', _o2.x, (_od - 0.5) * floorH, _o2.y)); }
const _os = label(THREE, _o2.name + ' · ' + _o2.floors + ' tầng', { size: 4 }); _os.position.set(_o2.x, _o2.h + 5, _o2.y); _o11.add(_os);
});
const _om = Math.max(...boxes.map((_o2) => _o2.h), 10);
Object.assign(_on, { theta: Math.PI / 3, phi: Math.PI / 3, r: _om * 1.6 + 60, min: 20, max: 1500 });
_on.target.set((boxes.length - 1) * 25, _om / 2, 0); _oq();
return _o1;
},
view(mode) { if (mode === 'top') { _on.phi = 0.06; } else { _on.phi = Math.PI / 3.4; } _oq(); },
tour(points, { onStep, onDone, speed = 1.3, pause = 1600, color = '#0F1E33' } = {}) {
stopTour();
if (!points || points.length < 2) return false;
_oe = new THREE.Group();
const _o3 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 1.25, 16), _ol(color)); _o3.position.y = 0.65; _oe.add(_o3);
const _of = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), _ol('#E9C9A8')); _of.position.y = 1.47; _oe.add(_of);
const _ot = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.42), _ol('#C9A24A')); _ot.position.y = 1.05; _oe.add(_ot);
_o11.add(_oe);
let _oh = 0, t0 = null, wait = 0;
_oe.position.set(points[0].x, 0, points[0].y);
if (points[0].stop && onStep) onStep(points[0], 0);
wait = points[0].stop ? pause : 0;
anim = {
follow: true,
step(ts) {
if (t0 == null) t0 = ts;
const _oa = Math.min(0.1, (ts - t0) / 1000); t0 = ts;
if (wait > 0) { wait -= _oa * 1000; } else if (_oh < points.length - 1) {
const _o2 = points[_oh + 1];
const _ob = _o2.x - _oe.position.x, dz = _o2.y - _oe.position.z, dist = Math.hypot(_ob, dz), stepLen = speed * _oa;
if (dist <= stepLen) { _oe.position.set(_o2.x, 0, _o2.y); _oh++; if (_o2.stop) { wait = pause; if (onStep) onStep(_o2, _oh); } if (_oh >= points.length - 1) { setTimeout(() => { if (onDone) onDone(); }, pause); } }
else { _oe.position.x += _ob / dist * stepLen; _oe.position.z += dz / dist * stepLen; _oe.rotation.y = Math.atan2(_ob, dz); }
}
const _o12 = _oe.rotation.y;
_o6.position.set(_oe.position.x - Math.sin(_o12) * 3.2, 3.6, _oe.position.z - Math.cos(_o12) * 3.2);
_o6.lookAt(_oe.position.x + Math.sin(_o12) * 1.5, 0.9, _oe.position.z + Math.cos(_o12) * 1.5);
dirty = true;
},
};
return true;
},
stopTour,
snapshot() { renderer.render(_ou, _o6); return renderer.domElement; },
dispose() { alive = false; stopTour(); clear(); if (_or) _or.disconnect(); renderer.dispose(); try { renderer.forceContextLoss(); } catch { } renderer.domElement.remove(); },
};
function stopTour() { if (_oe) { _o11.remove(_oe); _oe = null; } if (anim) { anim = null; _oq(); } }
size(); _oq(); requestAnimationFrame(_oj);
return _o1;
}
