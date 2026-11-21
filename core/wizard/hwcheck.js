import { ensureCss } from '../xkit.71d637c634.js';
export const TIERS = ['co_ban', 'kha', 'manh'];
export const TIER_LABEL = { co_ban: 'Cơ bản', kha: 'Khá', manh: 'Mạnh' };
export const SLACK = 0.5;
export const THRESHOLDS = {
kha_ram_gb: 16, kha_vram_gb: 8,
manh_apple_ram_gb: 32, manh_vram_gb: 12, manh_vram_ram_gb: 16,
min_cores: 4, bench_min_speed_x: 0.5,
video_ai_disk_gb: 40, image_ai_disk_gb: 15, local_ai_disk_gb: 5
};
export const WEAK_WARNING = 'Máy yếu: video dựng trên máy sẽ không đẹp và giật – chỉ nên dùng để làm video mẫu.';
export const ONLINE_PAID = 'Video AI chạy qua dịch vụ AI trực tuyến – thu phí riêng, tuỳ mô hình/nhà cung cấp';
export const DISCLAIMER = 'Ước tính nhanh từ trình duyệt – bộ cài sẽ quét chính xác lại (bước B8)';
export const EXTRA_LABEL = { unknown: 'Chưa rõ', phone: 'Điện thoại / máy tính bảng' };
const _o1 = 1e6;
const _o2 = 'thu phí riêng, tuỳ mô hình/nhà cung cấp';
export const ONLINE_LABEL = 'Chỉ dùng AI trên mạng – không cài gì';
export const MACHINE_LABEL = 'Dựng trên máy';
export function appleChip(model) {
const _ok = /^apple\s+(m\d+)(?:\s+(pro|max|ultra))?/.exec(String(model || '').trim().toLowerCase());
return _ok ? { family: _ok[1].toUpperCase(), variant: _ok[2] || 'base' } : null;
}
const _od = (_o12, limit) => _o12 != null && Number(_o12) + SLACK >= limit;
export function classify(info) {
const T = THRESHOLDS;
const cpu = info.cpu || {};
const ram = Number(info.ram_gb || 0);
const nv = Math.max(0, ...(info.gpus || []).filter((_oc) => _oc.vendor === 'nvidia').map((_oc) => Number(_oc.vram_gb || 0)));
const _o5 = appleChip(cpu.model);
let tier = 'co_ban';
if (_o5 && ['pro', 'max', 'ultra'].includes(_o5.variant) && _od(ram, T.manh_apple_ram_gb)) tier = 'manh';
else if (_od(nv, T.manh_vram_gb) && _od(ram, T.manh_vram_ram_gb)) tier = 'manh';
else if (_od(ram, T.kha_ram_gb)) tier = 'kha';
else if (_od(nv, T.kha_vram_gb)) tier = 'kha';
if (tier === 'manh' && (info.os || {}).family === 'mac' && cpu.vendor === 'intel') tier = 'kha';
const cores = Math.trunc(Number(cpu.cores || 0));
if (cores && cores < T.min_cores && tier !== 'co_ban') tier = 'co_ban';
const _o3 = info.bench || {};
if (_o3.speed_x != null && Number(_o3.speed_x) < T.bench_min_speed_x && tier !== 'co_ban') tier = 'co_ban';
return { tier, label: TIER_LABEL[tier] };
}
export const NV_DESKTOP = {
'gtx 1050': [2, 3], 'gtx 1050 ti': [4, 4], 'gtx 1060': [3, 6], 'gtx 1070': [8, 8], 'gtx 1070 ti': [8, 8], 'gtx 1080': [8, 8], 'gtx 1080 ti': [11, 11],
'gtx 1630': [4, 4], 'gtx 1650': [4, 4], 'gtx 1650 super': [4, 4], 'gtx 1660': [6, 6], 'gtx 1660 super': [6, 6], 'gtx 1660 ti': [6, 6],
'rtx 2060': [6, 12], 'rtx 2060 super': [8, 8], 'rtx 2070': [8, 8], 'rtx 2070 super': [8, 8], 'rtx 2080': [8, 8], 'rtx 2080 super': [8, 8], 'rtx 2080 ti': [11, 11],
'rtx 3050': [6, 8], 'rtx 3060': [8, 12], 'rtx 3060 ti': [8, 8], 'rtx 3070': [8, 8], 'rtx 3070 ti': [8, 8], 'rtx 3080': [10, 12], 'rtx 3080 ti': [12, 12],
'rtx 3090': [24, 24], 'rtx 3090 ti': [24, 24],
'rtx 4060': [8, 8], 'rtx 4060 ti': [8, 16], 'rtx 4070': [12, 12], 'rtx 4070 super': [12, 12], 'rtx 4070 ti': [12, 12], 'rtx 4070 ti super': [16, 16],
'rtx 4080': [16, 16], 'rtx 4080 super': [16, 16], 'rtx 4090': [24, 24],
'rtx 5050': [8, 8], 'rtx 5060': [8, 8], 'rtx 5060 ti': [8, 16], 'rtx 5070': [12, 12], 'rtx 5070 ti': [16, 16], 'rtx 5080': [16, 16], 'rtx 5090': [32, 32]
};
export const NV_LAPTOP = {
'gtx 1050': [2, 4], 'gtx 1050 ti': [4, 4], 'gtx 1060': [6, 6], 'gtx 1650': [4, 4], 'gtx 1650 ti': [4, 4], 'gtx 1660 ti': [6, 6],
'rtx 2050': [4, 4], 'rtx 2060': [6, 6], 'rtx 2070': [8, 8], 'rtx 2070 super': [8, 8], 'rtx 2080': [8, 8], 'rtx 2080 super': [8, 8],
'rtx 3050': [4, 6], 'rtx 3050 ti': [4, 4], 'rtx 3060': [6, 6], 'rtx 3070': [8, 8], 'rtx 3070 ti': [8, 8], 'rtx 3080': [8, 16], 'rtx 3080 ti': [16, 16],
'rtx 4050': [6, 6], 'rtx 4060': [8, 8], 'rtx 4070': [8, 8], 'rtx 4080': [12, 12], 'rtx 4090': [16, 16],
'rtx 5050': [8, 8], 'rtx 5060': [8, 8], 'rtx 5070': [8, 8], 'rtx 5070 ti': [12, 12], 'rtx 5080': [16, 16], 'rtx 5090': [24, 24]
};
export const APPLE_MEM = {
M1: { base: [8, 16], pro: [16, 32], max: [32, 64], ultra: [64, 128] },
M2: { base: [8, 24], pro: [16, 32], max: [32, 96], ultra: [64, 192] },
M3: { base: [8, 24], pro: [18, 36], max: [36, 128], ultra: [96, 512] },
M4: { base: [16, 32], pro: [24, 64], max: [36, 128] }
};
const _o0 = { base: [8, _o1], pro: [16, _o1], max: [32, _o1], ultra: [64, _o1] };
export function cleanRenderer(_os) {
let _ow = String(_os || '').trim().replace(/,?\s*or similar$/i, '');
const _ok = /^ANGLE \((.*)\)$/.exec(_ow);
if (_ok) { const _or = _ok[1].split(', '); _ow = _or.length > 1 ? _or[1] : _or[0]; }
return _ow.replace(/^ANGLE Metal Renderer:\s*/i, '').replace(/\s*\(0x[0-9a-f]+\)/ig, '').replace(/\s+(?:Direct3D|OpenGL|Vulkan|Metal).*$/i, '')
.replace(/\((R|TM)\)/ig, '').replace(/\s+/g, ' ').trim();
}
export function gpuFromRenderer(renderer) {
const raw = String(renderer || '').trim();
const name = cleanRenderer(raw);
const _op = (kind, extra = {}) => ({ name, kind, vendor: extra.vendor || kind, vram: null, known: false, ...extra });
if (!raw || /^(webkit webgl|mozilla|generic renderer|webgl)$/i.test(raw)) return _op('masked', { vendor: '' });
if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(raw)) return _op('software', { vendor: '' });
const _oj = name.toLowerCase();
if (/adreno|mali|powervr|apple a\d+/i.test(_oj)) return _op('mobile', { vendor: 'other' });
if (/^apple gpu$/.test(_oj)) return _op('apple_masked', { vendor: 'apple' });
const _o5 = appleChip(name);
if (_o5) {
const _oz = APPLE_MEM[_o5.family] || _o0;
const mem = _oz[_o5.variant] || _o0[_o5.variant];
return _op('apple', { vendor: 'apple', apple: _o5, mem, known: !!(APPLE_MEM[_o5.family] && APPLE_MEM[_o5.family][_o5.variant]) });
}
if (/nvidia|geforce|quadro|\brtx\b|\bgtx\b/.test(_oj)) {
const laptop = /laptop|mobile|max-q|notebook/.test(_oj);
if (/\bmx\s?\d{3}\b/.test(_oj)) return _op('nvidia', { vendor: 'nvidia', laptop, vram: [2, 4], known: true, weak: true });
const _og = /\b(rtx|gtx)\s?(\d{3,4})(?:\s?(ti\s?super|ti|super))?\b/.exec(_oj);
const _oh = _og ? `${_og[1]} ${_og[2]}${_og[3] ? ' ' + _og[3].replace(/\s+/g, ' ') : ''}` : '';
const _o12 = _oh ? ((laptop ? NV_LAPTOP : NV_DESKTOP)[_oh] || (laptop ? NV_DESKTOP : NV_LAPTOP)[_oh] || null) : null;
return _o12 ? _op('nvidia', { vendor: 'nvidia', laptop, vram: _o12, known: true, model: _oh })
: _op('nvidia', { vendor: 'nvidia', laptop, vram: null, known: false });
}
if (/intel/.test(_oj)) return _op(/\barc\b\s*a\d/.test(_oj) ? 'other' : 'integrated', { vendor: 'intel', known: true });
if (/amd|radeon|\bati\b/.test(_oj)) {
const _o7 = /\brx\s?\d{3,4}|radeon pro|radeon vii|firepro/.test(_oj) && !/\d{3}m\b/.test(_oj);
return _op(_o7 ? 'amd' : 'integrated', { vendor: 'amd', known: true });
}
return _op('other', { vendor: 'other' });
}
function webgl(_o8) {
try {
const _o4 = _o8.createElement('canvas');
const _oe = _o4.getContext('webgl') || _o4.getContext('experimental-webgl');
if (!_oe) return { renderer: '', vendor: '', webgl: false, masked: true };
const _oa = _oe.getExtension('WEBGL_debug_renderer_info');
const renderer = _oa ? _oe.getParameter(_oa.UNMASKED_RENDERER_WEBGL) : _oe.getParameter(_oe.RENDERER);
const vendor = _oa ? _oe.getParameter(_oa.UNMASKED_VENDOR_WEBGL) : _oe.getParameter(_oe.VENDOR);
try { const _oi = _oe.getExtension('WEBGL_lose_context'); if (_oi) _oi.loseContext(); } catch { }
return { renderer: String(renderer || ''), vendor: String(vendor || ''), webgl: true, masked: !_oa };
} catch { return { renderer: '', vendor: '', webgl: false, masked: true }; }
}
export function detectOsFamily(_on = {}) {
const _o11 = _on.userAgentData || {};
const _ow = String(_o11.platform || '') + ' ' + String(_on.platform || '') + ' ' + String(_on.userAgent || '');
if (/android/i.test(_ow)) return 'android';
if (/iphone|ipad|ipod|\bios\b/i.test(_ow)) return 'ios';
if (/cros|chrome os/i.test(_ow)) return 'chromeos';
if (/win/i.test(_ow)) return 'windows';
if (/mac/i.test(_ow)) return /macintosh/i.test(String(_on.userAgent || '')) && (_on.maxTouchPoints || 0) > 1 ? 'ios' : 'mac';
if (/linux|x11/i.test(_ow)) return 'linux';
return '';
}
export const OS_LABEL = { windows: 'Windows', mac: 'macOS', android: 'Android', ios: 'iPhone / iPad (iOS)', chromeos: 'ChromeOS', linux: 'Linux', '': 'Chưa rõ' };
export function isMobile(_on = {}) {
const _o11 = _on.userAgentData;
if (_o11 && _o11.mobile === true) return true;
const _o10 = String(_on.userAgent || '');
if (/Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle/i.test(_o10)) return true;
return /Macintosh/i.test(_o10) && (_on.maxTouchPoints || 0) > 1;
}
export function collect(env = {}) {
const _on = env.navigator || (typeof navigator !== 'undefined' ? navigator : {});
const _o8 = env.document || (typeof document !== 'undefined' ? document : null);
const dm = Number(_on.deviceMemory);
const th = Number(_on.hardwareConcurrency);
const _oc = _o8 ? webgl(_o8) : { renderer: '', vendor: '', webgl: false, masked: true };
return {
threads: Number.isFinite(th) && th > 0 ? th : null,
deviceMemory: Number.isFinite(dm) && dm > 0 ? dm : null,
renderer: _oc.renderer, gpuVendor: _oc.vendor, webgl: _oc.webgl,
os: detectOsFamily(_on), mobile: isMobile(_on)
};
}
const vn = (x) => String(Math.round(Number(x) * 10) / 10).replace('.', ',');
const _ov = (a, _o3) => (a === _o3 ? vn(a) : vn(a) + '–' + vn(_o3));
export function estimate(raw = {}) {
const T = THRESHOLDS;
const os = raw.os || '';
const gpu = gpuFromRenderer(raw.renderer);
const notes = [];
if (raw.mobile || os === 'android' || os === 'ios') {
return _ob({ tier: 'phone', sure: true, floor: null, ceil: null }, raw, gpu, notes);
}
const dm = raw.deviceMemory;
let _ot = 0, ramHi = _o1;
if (dm != null && dm < 8) { _ot = dm; ramHi = dm; }
else if (dm != null) { _ot = dm; notes.push('Trình duyệt chỉ báo RAM tối đa 8 GB – máy có thể nhiều hơn.'); }
else notes.push('Trình duyệt không cho biết RAM (chỉ Chrome/Edge báo, và tối đa 8 GB).');
if (gpu.kind === 'apple') { _ot = Math.max(_ot, gpu.mem[0]); ramHi = Math.min(ramHi, gpu.mem[1]); if (ramHi < _ot) ramHi = _ot; }
const th = raw.threads;
const _oy = gpu.kind !== 'apple' && gpu.kind !== 'apple_masked';
const coresLo = th ? (_oy ? Math.ceil(th / 2) : th) : 1;
const _o6 = th || _o1;
if (!th) notes.push('Trình duyệt không cho biết số luồng CPU.');
let _oo = 0, nvHi = 0;
if (gpu.kind === 'nvidia' && gpu.vram) { _oo = gpu.vram[0]; nvHi = gpu.vram[1]; }
else if (gpu.kind === 'nvidia') { nvHi = _o1; notes.push('Chưa có số VRAM của card "' + gpu.name + '" trong bảng – bộ cài sẽ đo.'); }
else if (gpu.kind === 'masked' || gpu.kind === 'other') { nvHi = _o1; notes.push(gpu.kind === 'masked' ? 'Trình duyệt ẩn tên card đồ hoạ.' : 'Chưa nhận ra card "' + gpu.name + '".'); }
else if (gpu.kind === 'software') { nvHi = _o1; notes.push('Trình duyệt đang vẽ bằng phần mềm (tắt tăng tốc phần cứng) – không đọc được card đồ hoạ.'); }
else if (gpu.kind === 'apple_masked') notes.push('Safari ẩn tên chip (chỉ báo "Apple GPU") – không biết là M1/M2/M3/M4 hay bản Pro/Max/Ultra.');
else if (gpu.kind === 'apple' && !gpu.known) notes.push('Chip ' + gpu.name + ' chưa có trong bảng bộ nhớ – bộ cài sẽ đo.');
if (gpu.kind === 'integrated') notes.push('Card tích hợp (yếu). Máy có thêm card NVIDIA rời mà trình duyệt đang dùng card tích hợp thì bộ cài sẽ quét ra.');
const mac = os === 'mac';
const _o14 = mac && gpu.kind !== 'apple' ? 'intel' : gpu.kind === 'apple' ? 'apple' : 'other';
const _o13 = mac && (gpu.kind === 'integrated' || gpu.kind === 'amd') ? 'intel' : mac ? 'apple' : 'other';
const _om = gpu.kind === 'apple' ? gpu.name : '';
const _ol = gpu.kind === 'apple' ? gpu.name : (mac && _o13 === 'apple') ? 'Apple M1 Ultra' : '';
const _oj = { cpu: { model: _om, cores: coresLo, vendor: _o14 }, ram_gb: _ot, gpus: [{ vendor: 'nvidia', vram_gb: _oo }], os: { family: os } };
const _of = { cpu: { model: _ol, cores: _o6, vendor: _o13 }, ram_gb: ramHi, gpus: [{ vendor: 'nvidia', vram_gb: nvHi }], os: { family: os } };
const floor = classify(_oj).tier, ceil = classify(_of).tier;
const _o9 = { floor, ceil, ram: [_ot, ramHi], nv: [_oo, nvHi], coresLo };
_o9.sure = floor === ceil;
_o9.tier = _o9.sure ? floor : floor === 'co_ban' ? 'unknown' : floor;
if (th && coresLo < T.min_cores && ceil !== 'co_ban' && floor === 'co_ban') notes.push('CPU ' + th + ' luồng: nếu chỉ ' + coresLo + ' nhân (< ' + T.min_cores + ') thì bộ cài xếp Cơ bản.');
return _ob(_o9, raw, gpu, notes);
}
function _ou(raw, gpu, _o9) {
if (!_o9.ram) return raw.deviceMemory ? (raw.deviceMemory >= 8 ? '≥ ' : '≈ ') + vn(raw.deviceMemory) + ' GB' : 'Chưa rõ';
const [_oj, _of] = _o9.ram;
if (gpu.kind === 'apple' && (raw.deviceMemory == null || raw.deviceMemory >= 8)) {
return (_of >= _o1 ? '≥ ' + vn(_oj) : _ov(_oj, _of)) + ' GB bộ nhớ chung (theo cấu hình chip ' + gpu.name + ')';
}
if (raw.deviceMemory == null) return 'Chưa rõ (trình duyệt không cho biết)';
if (raw.deviceMemory >= 8) return '≥ ' + vn(raw.deviceMemory) + ' GB (trình duyệt báo tối đa 8 GB)';
return '≈ ' + vn(raw.deviceMemory) + ' GB';
}
function gpuText(gpu) {
switch (gpu.kind) {
case 'nvidia': return gpu.name + ' · ' + (gpu.vram ? (gpu.vram[0] === gpu.vram[1] ? vn(gpu.vram[0]) : _ov(gpu.vram[0], gpu.vram[1]) + ' (tuỳ bản)') + ' GB VRAM' : 'VRAM chưa rõ') + (gpu.weak ? ' – card yếu' : '');
case 'apple': return gpu.name + ' · bộ nhớ chung với RAM';
case 'apple_masked': return 'Apple GPU (Safari ẩn tên chip – chưa rõ)';
case 'integrated': return gpu.name + ' · card tích hợp – yếu';
case 'amd': return gpu.name + ' · card AMD (bộ cài chỉ tính VRAM card NVIDIA)';
case 'software': return 'Chưa rõ (trình duyệt vẽ bằng phần mềm)';
case 'masked': return 'Chưa rõ (trình duyệt ẩn tên card)';
default: return gpu.name ? gpu.name + ' · chưa rõ' : 'Chưa rõ';
}
}
export function recommendFor(tier, { ceil = null } = {}) {
const T = THRESHOLDS;
if (tier === 'phone') {
return { tone: 'neutral', title: 'Máy dựng video chỉ cài trên máy tính Windows/Mac', preselect: 'online',
lines: ['Trên điện thoại/máy tính bảng, app dùng bình thường (khách, bảng hàng, nội dung) – không cần cài gì.', 'Cần video: chọn "' + ONLINE_LABEL + '" – Video AI trên mạng (' + _o2 + '), hoặc "Không làm video".'],
install: 'Máy dựng video chỉ cài trên máy tính Windows/Mac – mở trợ lý này trên máy tính đó để cài.' };
}
if (tier === 'co_ban') {
return { tone: 'warn', title: 'Không nên cài Bộ công cụ dựng video', preselect: 'online', warn: WEAK_WARNING,
lines: ['Nên chọn "' + ONLINE_LABEL + '" – Video AI trên mạng (' + _o2 + '), hoặc "Không làm video".'],
install: 'Vẫn cài được: câu đầu gõ 1; ở bước B8 bộ cài mặc định [1] Thôi – chỉ AI trên mạng (không cài thêm gì). ' + WEAK_WARNING };
}
if (tier === 'kha') {
return { tone: 'info', title: 'Cài được Bộ công cụ dựng video (video bản đồ, quy hoạch)', preselect: null,
lines: ['Ở bước B8 của bộ cài chọn [4] Dựng video trên máy (Enter = [4]).',
'Video AI: chỉ dùng trên mạng (' + _o2 + '). Chạy AI ngay trên máy cần máy hạng Mạnh.']
.concat(ceil === 'manh' ? ['Có thể đạt hạng Mạnh (Video AI ngay trên máy) nếu RAM/bộ nhớ chung đủ lớn – bộ cài đo chính xác ở bước B8.'] : []),
install: 'Hợp với máy này: bước B8 chọn [4] Dựng video trên máy; Video AI dùng trên mạng (thu phí riêng).' };
}
if (tier === 'manh') {
return { tone: 'ok', title: 'Máy mạnh: chạy được Video AI ngay trên máy', preselect: null,
lines: ['Ở bước B8 chọn [2] Dựng + AI ngay trên máy: AI chạy miễn phí trên máy nhưng tải nặng – thư viện AI vài GB + mô hình vài chục GB; cần ổ trống ≥ ' + T.video_ai_disk_gb + ' GB.',
'Hoặc [4] Dựng video trên máy + Video AI trên mạng (' + _o2 + ').'],
install: 'Hợp với máy này: bước B8 chọn [2] Dựng + AI ngay trên máy (tải vài chục GB) hoặc [4] Dựng video trên máy.' };
}
return { tone: 'neutral', title: 'Chưa đủ dữ liệu để ước tính hạng máy', preselect: null,
lines: ['Tự xem RAM: Windows › Cài đặt › Hệ thống › Giới thiệu (About); Mac › menu Apple › Giới thiệu máy Mac này.',
'RAM dưới ' + T.kha_ram_gb + ' GB và không có card NVIDIA từ ' + T.kha_vram_gb + ' GB VRAM → máy Cơ bản: nên chọn "' + ONLINE_LABEL + '", không dựng trên máy.',
'RAM từ ' + T.kha_ram_gb + ' GB (hoặc card NVIDIA từ ' + T.kha_vram_gb + ' GB) → máy Khá: dựng được video bản đồ/quy hoạch trên máy.'],
install: 'Chưa rõ hạng máy – cứ chạy bộ cài: bước B8 quét chính xác; máy yếu mặc định [1] Thôi – chỉ AI trên mạng (không cài thêm gì).' };
}
function _ob(_o9, raw, gpu, notes) {
const tier = _o9.tier;
const label = TIER_LABEL[tier] || EXTRA_LABEL[tier];
const rows = [
['Hạng ước tính', label + (tier === 'kha' && !_o9.sure ? ' (ít nhất)' : '')],
['CPU', raw.threads ? raw.threads + ' luồng' : 'Chưa rõ'],
['RAM', _ou(raw, gpu, _o9)],
['Card đồ hoạ', gpuText(gpu)],
['Hệ điều hành', OS_LABEL[raw.os || ''] || 'Chưa rõ'],
['Ổ đĩa trống', 'Trình duyệt không đọc được – bộ cài đo ở bước B8']
];
if (raw.os === 'linux' || raw.os === 'chromeos') notes.push('Bộ cài máy dựng chỉ có cho Windows và Mac.');
return { tier, label, sure: !!_o9.sure, floor: _o9.floor, ceil: _o9.ceil, gpu, rows, notes: tier === 'phone' ? [] : notes, rec: recommendFor(tier, { ceil: _o9.ceil }) };
}
let _ox = null;
export const lastEstimate = () => _ox;
export function clearEstimate() { _ox = null; }
export function runCheck(env) { _ox = estimate(collect(env)); return _ox; }
export function hwCheckPanel(ui, { choice = null, onPreselect = null, auto = false, env } = {}) {
try { ensureCss(new URL('./hwcheck.css', import.meta.url).href, 'bds-hwcheck-css'); } catch { }
const { h, button } = ui;
const card = h('div', { class: 'hwc-card', 'data-testid': 'hwc-card', 'aria-live': 'polite' });
const run = () => {
const _os = runCheck(env);
_oq(_os);
if (onPreselect && _os.rec.preselect && choice === 'install' && _os.rec.preselect !== choice) onPreselect(_os.rec.preselect);
};
const btn = button(_ox ? 'Kiểm tra lại cấu hình máy' : 'Kiểm tra cấu hình máy', run, { kind: 'secondary', small: true, icon: 'pulse', testid: 'hwc-run' });
const _o15 = h('div', { class: 'hwc', 'data-testid': 'hwc' },
h('div', { class: 'hwc-top' }, btn, h('span', { class: 'muted small' }, 'Biết trước máy hợp với cách làm video nào – chưa cần cài gì.')), card);
if (_ox) _oq(_ox); else if (auto) run();
return _o15;
function _oq(_os) {
const rec = _os.rec;
ui.clear(card);
card.dataset.tier = _os.tier;
card.append(
h('p', { class: 'hwc-head' }, h('span', { class: 'muted small' }, 'Hạng ước tính: '),
h('strong', { class: 'hwc-tier', 'data-testid': 'hwc-tier', dataset: { tier: _os.tier } }, _os.label)),
ui.kv(_os.rows.slice(1)),
h('div', { class: 'hwc-rec hwc-t-' + rec.tone, 'data-testid': 'hwc-rec' },
h('p', null, h('strong', null, rec.title)),
rec.lines.length ? h('ul', null, rec.lines.map((x) => h('li', null, x))) : null,
rec.warn ? h('p', { class: 'hwc-warn', 'data-testid': 'hwc-warn' }, '⚠️ ', rec.warn) : null),
_os.notes.length ? h('ul', { class: 'hwc-notes muted small', 'data-testid': 'hwc-notes' }, _os.notes.map((x) => h('li', null, x))) : null,
choice ? h('p', { class: 'hwc-install', 'data-testid': 'hwc-install-rec' }, h('strong', null, 'Nếu chọn "' + MACHINE_LABEL + '": '), rec.install) : null,
h('p', { class: 'muted small', 'data-testid': 'hwc-disclaimer' }, 'ℹ️ ', DISCLAIMER, '. Không gửi đi đâu – chỉ đọc trong trình duyệt này.'));
if (btn.lastChild) btn.lastChild.textContent = 'Kiểm tra lại cấu hình máy';
}
}
export default { THRESHOLDS, TIER_LABEL, SLACK, classify, appleChip, gpuFromRenderer, cleanRenderer, collect, estimate, recommendFor, hwCheckPanel, lastEstimate, clearEstimate, runCheck };
