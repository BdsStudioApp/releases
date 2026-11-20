const DAY = 864e5;
export function fmtMoney(n) {
n = Number(n) || 0;
const _o21 = n < 0 ? "-" : "", a = Math.abs(n);
if (a < 1e9) return _o21 + Math.round(a / 1e6) + " triệu";
return _o21 + (a / 1e9).toFixed(2).replace(".", ",") + " tỷ";
}
export function fmtVnd(n) {
const v = Math.round(Number(n) || 0), s = String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
return (v < 0 ? "-" : "") + s + " đ";
}
export function fmtNum(n, _oh = 2) {
const v = Number(n);
if (!isFinite(v)) return "";
return String(Math.round(v * 10 ** _oh) / 10 ** _oh).replace(".", ",");
}
export const ymLabel = (ym) => { const [y, m] = String(ym || "").split("-"); return y && m ? `${m.padStart(2, "0")}/${y}` : ""; };
export const ymNum = (s) => { const [y, m] = String(s).split("-").map(Number); return y * 12 + m - 1; };
export const ymStr = (k) => Math.floor(k / 12) + "-" + String((k % 12) + 1).padStart(2, "0");
export const todayYM = (_oh = new Date()) => _oh.getFullYear() + "-" + String(_oh.getMonth() + 1).padStart(2, "0");
export const todayISO = (_oh = new Date()) => todayYM(_oh) + "-" + String(_oh.getDate()).padStart(2, "0");
export const fold = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const _o1s = (x) => Math.round(x / 1000) * 1000;
const _o11 = (x) => typeof x === "number" && isFinite(x);
export function parseNum(v) {
if (_o11(v)) return v;
if (v == null || typeof v === "boolean") return NaN;
const _o1p = String(v).trim().replace(/[\u2212\u2013\u2012\u2014\uFE63\uFF0D]/g, "-"), _oo = fold(_o1p);
let mul = 1;
if (/\b(ty|ti)\b/.test(_oo)) mul = 1e9;
else if (/\b(trieu|tr)\b/.test(_oo)) mul = 1e6;
const e = _o1p.match(/^([-+]?\d+(?:[.,]\d+)?)e([-+]?\d+)$/i);
if (e) { const x = Number(e[1].replace(",", ".") + "e" + e[2]); return isFinite(x) ? x : NaN; }
const m = _o1p.match(/-?\d[\d.,\s]*/);
if (!m) return NaN;
let s = m[0].replace(/\s+/g, "").replace(/[.,]$/, "");
const _on = (s.match(/\./g) || []).length, commas = (s.match(/,/g) || []).length;
if (_on && commas) {
const _oj = s.lastIndexOf(".") > s.lastIndexOf(",") ? "." : ",";
const _o25 = _oj === "." ? "," : ".";
s = s.split(_o25).join("").replace(_oj, ".");
} else if (_on || commas) {
const _o1x = _on ? "." : ",", cnt = _on || commas, after = s.split(_o1x).pop();
if (cnt > 1 || (after.length === 3 && mul === 1 && !/%/.test(_o1p))) s = s.split(_o1x).join("");
else s = s.replace(_o1x, ".");
}
const n = Number(s);
return isFinite(n) && isFinite(n * mul) ? n * mul : NaN;
}
export function parseAt(v) {
if (_o11(v)) return v;
if (v == null || v === "") return null;
const _oo = fold(v).replace(/\s+/g, " ");
if (/^h$|handover|ban giao|nhan nha/.test(_oo)) return "H";
let m = _oo.match(/^hd\s*\+?\s*(\d+(?:[.,]\d+)?)$/);
if (m) return "HD+" + parseNum(m[1]);
if (/^hd$|hdmb|hop dong mua ban|ky hd/.test(_oo)) {
m = _oo.match(/(\d+)\s*ngay/);
if (m) return "HD+" + Math.max(1, Math.round(Number(m[1]) / 30));
m = _oo.match(/(\d+(?:[.,]\d+)?)\s*thang/);
if (m) return "HD+" + parseNum(m[1]);
return "HD";
}
m = _oo.match(/^t\s*\+\s*(\d+(?:[.,]\d+)?)$/);
if (m) return parseNum(m[1]);
m = _oo.match(/(\d+(?:[.,]\d+)?)\s*(?:-|–)?\s*(?:\d+(?:[.,]\d+)?)?\s*thang/);
if (m) return parseNum(m[1]);
m = _oo.match(/(\d+)\s*ngay/);
if (m) return Math.round(Number(m[1]) / 30 * 10) / 10;
if (/^\d+(?:[.,]\d+)?$/.test(_oo)) return parseNum(_oo);
if (/ky|coc|giu (cho|can)|ngay|dat cho|ky quy|thoa thuan|booking/.test(_oo)) return 0;
return null;
}
export function atToMo(at) {
if (typeof at === "string" && at.startsWith("HD+")) return "HD" + at.slice(3);
return at;
}
export function toStorePlans(plans) {
return (plans || []).map((p) => ({ ...p, htls: p.htls === "H" ? "HANDOVER" : p.htls, steps: (p.steps || []).map((s) => ({ ...s, mo: atToMo(s.at) })) }));
}
export function atLabel(at) {
if (at === 0) return "Khi ký thoả thuận";
if (_o11(at)) return "~" + fmtNum(at, 1) + " tháng sau";
if (at === "HD") return "Khi ký HĐMB";
if (typeof at === "string" && at.startsWith("HD+")) return "~" + at.slice(3) + " tháng sau ký HĐMB";
if (at === "H") return "Khi bàn giao";
return "Chưa rõ mốc";
}
export function extractJson(text) {
if (text && typeof text === "object") return text;
const s = String(text ?? "");
const _op = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
const _ob = [];
if (_op) _ob.push(_op[1]);
const _o10 = s.indexOf("{"), i2 = s.indexOf("[");
const start = [_o10, i2].filter((i) => i >= 0).sort((a, b) => a - b)[0];
if (start != null) {
const _oc = s[start] === "{" ? "}" : "]";
_ob.push(s.slice(start, s.lastIndexOf(_oc) + 1));
}
_ob.push(s);
for (const _oa of _ob) {
try { return JSON.parse(_oa.trim()); } catch { }
try { return JSON.parse(_oa.trim().replace(/,\s*([}\]])/g, "$1")); } catch { }
}
return null;
}
const _o1m = (_o1g, keys) => { for (const k of keys) if (_o1g && _o1g[k] != null && _o1g[k] !== "") return _o1g[k]; return undefined; };
const _o1 = {
plans: ["plans", "phuong_an", "phuongAn", "cac_phuong_an", "options", "payment_plans"],
name: ["name", "ten", "ten_phuong_an", "title", "phuong_an"],
sub: ["sub", "mo_ta", "ghi_chu", "note", "description"],
factor: ["factor", "he_so", "heso", "ty_le_thanh_toan"],
discount: ["discount", "chiet_khau", "uu_dai", "ck"],
loan: ["loan", "vay", "ty_le_vay", "loan_ratio", "loan_pct"],
htls: ["htls", "ho_tro_lai_suat", "ho_tro_lai", "interest_support", "support_months"],
steps: ["steps", "stages", "dot", "cac_dot", "dot_thanh_toan", "installments", "lich"],
sname: ["name", "ten", "ten_dot", "label", "title", "dot"],
pct: ["pct", "percent", "ty_le", "phan_tram", "tyle", "%"],
amount: ["amount", "so_tien", "tien", "value"],
at: ["mo", "at", "moc", "moc_thang", "thang", "month", "khi", "thoi_diem", "when"],
when: ["when", "khi", "thoi_diem", "ghi_chu", "note"],
bank: ["bank", "ngan_hang", "nh", "bank_pays", "ngan_hang_tra", "giai_ngan"],
total: ["total", "tong_gia", "tong", "gia", "price_total"],
};
const _o28 = (v) => v === true || v === 1 || /^(1|true|co|yes|x|nh|ngan hang)$/.test(fold(v));
const _o22 = (s) => fold(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "pa";
export function normalizePlan(_o1p, idx = 0, opts = {}) {
const errors = [], r = _o1p || {};
const name = String(_o1m(r, _o1.name) ?? "").trim();
if (!name) errors.push(`Phương án ${idx + 1}: thiếu tên.`);
const total = parseNum(_o1m(r, _o1.total) ?? opts.total);
let factor = parseNum(_o1m(r, _o1.factor));
if (isFinite(factor) && factor > 1.5) factor = factor / 100;
if (!isFinite(factor)) {
const _oi = _o1m(r, _o1.discount);
let _oh = parseNum(_oi);
if (isFinite(_oh)) {
if (!/%/.test(String(_oi)) && _oh <= 1) _oh = _oh * 100;
factor = Math.round((1 - _oh / 100) * 1e9) / 1e9;
} else factor = 1;
}
let loan = parseNum(_o1m(r, _o1.loan));
if (!isFinite(loan)) loan = 0;
if (loan > 1) loan = loan / 100;
let _oz = _o1m(r, _o1.htls), htls = 0;
if (_oz != null) {
const a = parseAt(_oz);
htls = a === "H" ? "HANDOVER" : _o11(a) ? a : (isFinite(parseNum(_oz)) ? parseNum(_oz) : 0);
}
let _o1q = _o1m(r, _o1.steps);
if (!Array.isArray(_o1q)) _o1q = [];
const mo = Array.isArray(r.mo) ? r.mo : null;
const steps = _o1q.map((s, _o13) => {
let _o1g;
if (Array.isArray(s)) _o1g = { name: s[0], pct: s[1], when: s[2], bank: s[3], at: mo ? mo[_o13] : s[2] };
else _o1g = { name: _o1m(s, _o1.sname), pct: _o1m(s, _o1.pct), amount: _o1m(s, _o1.amount), at: _o1m(s, _o1.at), when: _o1m(s, _o1.when), bank: _o1m(s, _o1.bank) };
if (mo && !Array.isArray(s) && _o1g.at == null) _o1g.at = mo[_o13];
let pct = parseNum(_o1g.pct);
if (!isFinite(pct) && _o1g.amount != null && isFinite(total) && total > 0) pct = Math.round(parseNum(_o1g.amount) / total * 1e6) / 1e4;
let at = _o1g.at;
if (typeof at === "string" && /^HD\d+$/.test(at)) at = "HD+" + at.slice(2);
if (at === "HANDOVER") at = "H";
at = parseAt(at);
const when = _o1g.when && String(_o1g.when) !== "HANDOVER" ? String(_o1g.when) : "";
const step = { name: String(_o1g.name ?? "").trim() || `Đợt ${_o13 + 1}`, pct: isFinite(pct) ? pct : NaN, at, mo: atToMo(at), bank: _o1g.bank == null ? false : _o28(_o1g.bank), when };
if (!isFinite(pct)) errors.push(`Phương án ${idx + 1}, ${step.name}: thiếu tỷ lệ %.`);
if (at == null) errors.push(`Phương án ${idx + 1}, ${step.name}: chưa rõ mốc đóng.`);
return step;
});
if (!steps.length) errors.push(`Phương án ${idx + 1}: chưa có đợt thanh toán.`);
const sum = steps.reduce((a, s) => a + (isFinite(s.pct) ? s.pct : 0), 0);
if (steps.length && steps.every((s) => isFinite(s.pct) && s.pct <= 1) && sum > 0.98 && sum < 1.02) steps.forEach((s) => { s.pct = Math.round(s.pct * 1e6) / 1e4; });
const plan = { id: String(r.id || _o22(name) || "pa" + (idx + 1)), name, sub: String(_o1m(r, _o1.sub) ?? "").trim(), factor, loan, htls, steps };
return { plan, errors };
}
export function normalizePlans(input, opts = {}) {
const data = extractJson(input);
if (data == null) return { plans: [], errors: ["Kết quả dán vào chưa đúng mẫu – chép lại toàn bộ câu trả lời của AI (phần nằm trong { … }) rồi dán lại."], warnings: [] };
let list = Array.isArray(data) ? data : _o1m(data, _o1.plans);
if (!Array.isArray(list) && data && _o1m(data, _o1.steps)) list = [data];
if (!Array.isArray(list)) return { plans: [], errors: ["Kết quả chưa có phương án thanh toán nào – nhờ AI làm lại hoặc nhập tay."], warnings: [] };
const total = _o1m(Array.isArray(data) ? {} : data, _o1.total) ?? opts.total;
const errors = [], plans = [], ids = new Set();
list.forEach((_o1p, i) => {
const r = normalizePlan(_o1p, i, { total });
let id = r.plan.id, k = 2;
while (ids.has(id)) id = r.plan.id + "-" + k++;
ids.add(id); r.plan.id = id;
plans.push(r.plan); errors.push(...r.errors);
});
return { plans, errors, warnings: [] };
}
export const pctSum = (plan) => Math.round((plan?.steps || []).reduce((a, s) => a + (isFinite(s.pct) ? Number(s.pct) : 0), 0) * 1e6) / 1e6;
const _o5 = (at, M = { H: 1000, HD: 3 }) => resolveMonth(at, M);
export function checkPlans(plans, opts = {}) {
const _o1i = [], add = (level, plan, field, msg, step) => _o1i.push({ level, plan, step, field, msg });
if (!Array.isArray(plans) || !plans.length) { add("error", -1, "plans", "Chưa có phương án nào."); return _o1i; }
const _o1d = new Map();
plans.forEach((p, i) => {
if (!String(p.name || "").trim()) add("error", i, "name", "Thiếu tên phương án.");
else { const k = fold(p.name); if (_o1d.has(k)) add("warn", i, "name", "Trùng tên với phương án " + (_o1d.get(k) + 1) + "."); _o1d.set(k, i); }
const steps = p.steps || [];
if (!steps.length) { add("error", i, "steps", "Chưa có đợt thanh toán."); }
steps.forEach((s, _o13) => {
if (!isFinite(s.pct) || s.pct <= 0) add("error", i, "pct", `${s.name || "Đợt " + (_o13 + 1)}: tỷ lệ % chưa hợp lệ.`, _o13);
else if (s.pct > 100) add("error", i, "pct", `${s.name}: tỷ lệ vượt 100%.`, _o13);
if (s.at == null || (_o11(s.at) && s.at < 0)) add("error", i, "at", `${s.name || "Đợt " + (_o13 + 1)}: chưa rõ mốc đóng.`, _o13);
});
if (steps.length) {
const sum = pctSum(p);
if (Math.abs(sum - 100) > 0.01) add("error", i, "pct", `Tổng các đợt là ${fmtNum(sum)}% – phải đủ 100%.`);
let _o1n = -Infinity;
steps.forEach((s, _o13) => {
if (s.at == null) return;
const r = _o5(s.at, opts.months);
if (r < _o1n) add("warn", i, "at", `${s.name}: mốc đóng sớm hơn đợt trước (mốc lùi).`, _o13);
_o1n = Math.max(_o1n, r);
});
}
const _oo = Number(p.factor);
if (!isFinite(_oo) || _oo <= 0.5 || _oo > 1.2) add("error", i, "factor", "Hệ số giá/chiết khấu không hợp lệ.");
else if (_oo < 0.75) add("warn", i, "factor", `Chiết khấu ${fmtNum((1 - _oo) * 100, 1)}% – cao bất thường, kiểm tra lại.`);
else if (_oo > 1.02) add("warn", i, "factor", "Tổng phải trả cao hơn giá niêm yết – kiểm tra lại.");
const loan = Number(p.loan) || 0, bankPct = steps.filter((s) => s.bank).reduce((a, s) => a + (Number(s.pct) || 0), 0);
if (loan < 0 || loan > 0.85) add("error", i, "loan", "Tỷ lệ vay phải trong khoảng 0–85%.");
else if (loan > 0 && !bankPct) add("warn", i, "loan", "Có vay nhưng chưa đánh dấu đợt nào ngân hàng giải ngân.");
else if (bankPct && Math.abs(bankPct - loan * 100) > 3) add("warn", i, "loan", `Đợt ngân hàng ${fmtNum(bankPct)}% lệch tỷ lệ vay ${fmtNum(loan * 100)}%.`);
});
return _o1i;
}
export const hasBlocking = (issues) => (issues || []).some((i) => i.level === "error");
const _o26 = (a) => {
if (Array.isArray(a)) { const lo = parseNum(a[0]), hi = parseNum(a[1] ?? a[0]); return isFinite(lo) ? [lo, isFinite(hi) ? hi : lo] : null; }
if (a && typeof a === "object") return _o26([a.from ?? a.min ?? a.lo, a.to ?? a.max ?? a.hi]);
if (a != null && isFinite(parseNum(a))) return [parseNum(a), parseNum(a)];
return null;
};
function _o1e(t) {
if (typeof t === "string") return { n: t, ask: true };
const n = String(t.n ?? t.name ?? t.type ?? "").trim();
const a = _o26(t.a ?? t.area ?? t.areas ?? t.dt);
return t.ask || !a ? { n, ask: true } : { n, a };
}
export const isSampleProject = (p) => !!p && (p.sample === true || String(p.id || "").startsWith("mau_"));
export const stripSampleName = (name) => String(name == null ? "" : name).replace(/^\s*Mẫu\s*[·•\-–:]\s*/i, "").trim() || String(name || "");
export function normProject(_o1p, override) {
let p = { ...(_o1p || {}) };
if (override && !override.deleted) {
let _oh = override.data;
if (typeof _oh === "string") { try { _oh = JSON.parse(_oh); } catch { _oh = {}; } }
p = { ...p, ...(_oh || {}) };
if (override.name) p.name = override.name;
if (override.dev) p.dev = override.dev;
p.overridden = true;
}
p.id = String(p.id ?? override?.id ?? "");
p.price = _o26(p.price ?? (p.price_from != null ? [p.price_from, p.price_to] : null));
p.types = (p.types || []).map(_o1e).filter((t) => t.n);
p.handover = p.handover || null;
if (isSampleProject(p)) { p.sample = true; p.name = stripSampleName(p.name); }
return p;
}
export function mergeProjects(_ok, rows) {
const _o1j = new Map((rows || []).filter((r) => !r.deleted).map((r) => [String(r.id), r]));
const list = (_ok || []).map((p) => normProject(p, _o1j.get(String(p.id))));
for (const [id, r] of _o1j) if (!list.some((p) => p.id === id)) list.push(normProject({ id }, r));
return list;
}
export const sellable = (p) => !!(p && p.price && p.types.some((t) => !t.ask));
export function filterProjects(list, _oo = {}) {
const q = fold(_oo.q || "");
return (list || []).filter((p) => {
if (_oo.dev && _oo.dev !== "all" && p.dev !== _oo.dev) return false;
if (_oo.area && _oo.area !== "all" && p.area !== _oo.area) return false;
if (_oo.priceMin != null || _oo.priceMax != null) {
if (!p.price) return false;
if (_oo.priceMin != null && p.price[1] < _oo.priceMin) return false;
if (_oo.priceMax != null && p.price[0] > _oo.priceMax) return false;
}
if (q && !fold([p.name, p.dev, p.loc, p.area].join(" ")).includes(q)) return false;
return true;
});
}
export function parseTypesText(text) {
return String(text || "").split(/\n+/).map((l) => l.trim()).filter(Boolean).map((l) => {
const m = l.match(/^(.+?)(?:\s*:\s*|\s+)(.*)$/);
const n = (m ? m[1] : l).trim(), _o1r = m ? m[2] : "";
const _o1f = (_o1r.match(/\d+(?:[.,]\d+)?/g) || []).map(parseNum);
if (!_o1f.length) return { n, ask: true };
return { n, a: [_o1f[0], _o1f[1] ?? _o1f[0]] };
});
}
export const typesToText = (types) => (types || []).map((t) => t.ask ? `${t.n}: liên hệ` : `${t.n}: ${fmtNum(t.a[0])}-${fmtNum(t.a[1])}`).join("\n");
export function defaultPlansFor(project, _ok) {
if (!project || !_ok) return [];
let _o23 = _ok[project.id] ?? (project.pol != null ? _ok[project.pol] : undefined);
if (_o23 && !Array.isArray(_o23)) _o23 = _o23.plans ?? _o23.steps ? (_o23.plans || [_o23]) : null;
if (!Array.isArray(_o23)) return [];
return normalizePlans(_o23).plans;
}
export function parsePlans(v) {
if (Array.isArray(v)) return normalizePlans(v).plans;
if (typeof v === "string") { try { return normalizePlans(JSON.parse(v)).plans; } catch { return []; } }
return [];
}
export function activePolicy(policies, projectId, today = todayISO()) {
const list = (policies || []).filter((p) => p && !p.deleted && p.status === "active" && String(p.project_id) === String(projectId) && (!p.effective_from || p.effective_from <= today));
list.sort((a, b) => String(b.effective_from || b.month || "").localeCompare(String(a.effective_from || a.month || "")) || (Number(b.approved_at) || 0) - (Number(a.approved_at) || 0));
return list[0] || null;
}
export const policyLabel = (pol) => pol && pol.month ? "Chính sách tháng " + ymLabel(pol.month) : "Giá tham khảo";
export function staleDays(pol, now = Date.now()) {
if (!pol) return Infinity;
let t = Number(pol.approved_at) || 0;
if (!t && pol.effective_from) t = Date.parse(pol.effective_from + "T00:00:00Z");
if (!t) t = Number(pol.updated_at) || 0;
if (!t) return Infinity;
return Math.floor((now - t) / DAY);
}
const _o1l = (x) => fmtNum(x) + "%";
const _om = (_oo) => fmtNum((1 - _oo) * 100, 2) + "%";
export function diffPlans(oldPlans, newPlans) {
const _o1i = [], key = (p) => fold(p.name) || p.id;
const _o1h = new Map((oldPlans || []).map((p) => [key(p), p])), nm = new Map((newPlans || []).map((p) => [key(p), p]));
for (const [k, n] of nm) {
const _o1g = _o1h.get(k);
if (!_o1g) { _o1i.push({ plan: n.name, field: "plan", label: "Phương án mới", old: "", new: `${n.steps.length} đợt`, change: "add" }); continue; }
const _od = (field, label, a, b) => { if (a !== b) _o1i.push({ plan: n.name, field, label, old: a, new: b, change: "change" }); };
_od("factor", "Chiết khấu", _om(_o1g.factor), _om(n.factor));
_od("loan", "Tỷ lệ vay", _o1l((_o1g.loan || 0) * 100), _o1l((n.loan || 0) * 100));
_od("htls", "Hỗ trợ lãi", htlsTxt(_o1g.htls), htlsTxt(n.htls));
const _o15 = Math.max(_o1g.steps.length, n.steps.length);
for (let _o13 = 0; _o13 < _o15; _o13++) {
const a = _o1g.steps[_o13], b = n.steps[_o13];
const label = (b || a).name;
if (!a) _o1i.push({ plan: n.name, field: "step", label, old: "", new: _o1l(b.pct), change: "add" });
else if (!b) _o1i.push({ plan: n.name, field: "step", label, old: _o1l(a.pct), new: "", change: "remove" });
else {
if (a.pct !== b.pct) _o1i.push({ plan: n.name, field: "step", label, old: _o1l(a.pct), new: _o1l(b.pct), change: "change" });
if (String(a.at) !== String(b.at)) _o1i.push({ plan: n.name, field: "at", label: label + " – mốc", old: atLabel(a.at), new: atLabel(b.at), change: "change" });
}
}
}
for (const [k, _o1g] of _o1h) if (!nm.has(k)) _o1i.push({ plan: _o1g.name, field: "plan", label: "Bỏ phương án", old: `${_o1g.steps.length} đợt`, new: "", change: "remove" });
return _o1i;
}
export const htlsTxt = (h) => h === "H" || h === "HANDOVER" ? "đến bàn giao" : h ? fmtNum(h, 1) + " tháng" : "không";
export function projectMonths(project, today = todayYM()) {
const H = project && project.handover ? Math.max(6, ymNum(project.handover) - ymNum(today)) : 30;
const HD = Number(project && project.hdmb) || 3;
return { H, HD };
}
export function resolveMonth(at, M) {
if (_o11(at)) return at;
if (at === "H") return M.H;
if (at === "HD") return M.HD;
if (typeof at === "string" && at.startsWith("HD+")) return M.HD + (parseNum(at.slice(3)) || 0);
return 0;
}
export function loanSchedule({ principal, rate, years, grace = 0, support = 0, method = "equal" }) {
const P = Math.max(0, Number(principal) || 0), r = (Number(rate) || 0) / 1200, n = Math.min(1200, Math.max(1, Math.round((Number(years) || 0) * 12)));
grace = Math.min(Math.max(0, Math.round(Number(grace) || 0)), n - 1);
support = Math.max(0, Math.round(Number(support) || 0));
const k = n - grace, rows = [];
let _o7 = P;
const _o4 = r ? P * r / (1 - Math.pow(1 + r, -k)) : P / k;
let totalInterest = 0, supportedInterest = 0, totalPrincipal = 0;
for (let m = 1; m <= n; m++) {
const interest = _o7 * r;
let _o1o = 0;
if (m > grace) {
_o1o = method === "annuity" ? _o4 - interest : P / k;
if (m === n || _o1o > _o7) _o1o = _o7;
}
const supported = m <= support;
const _o8 = supported ? 0 : interest;
if (supported) supportedInterest += interest; else totalInterest += interest;
_o7 = _o7 - _o1o;
if (Math.abs(_o7) < 1e-6) _o7 = 0;
totalPrincipal += _o1o;
rows.push({ m, principal: _o1o, interest: _o8, supported: supported ? interest : 0, pay: _o1o + _o8, balance: _o7 });
}
const _oq = rows.findIndex((x) => x.principal > 0 && x.pay > 0);
const _ot = _oq >= 0 ? rows[_oq] : rows.find((x) => x.pay > 0) || rows[0];
return {
principal: P, rate: Number(rate) || 0, years: n / 12, months: n, grace, support, method, rows,
firstPay: Math.round(_ot.pay), firstPayMonth: _ot.m, lastPay: Math.round(rows[n - 1].pay),
monthlyPrincipal: Math.round(P / k),
totalInterest: Math.round(totalInterest), supportedInterest: Math.round(supportedInterest),
totalPay: Math.round(totalPrincipal + totalInterest),
};
}
export function yearlyBars(rows) {
const _o1i = [];
(rows || []).forEach((r) => {
const y = Math.floor((r.m - 1) / 12);
_o1i[y] = _o1i[y] || { year: y + 1, principal: 0, interest: 0, pay: 0 };
_o1i[y].principal += r.principal; _o1i[y].interest += r.interest; _o1i[y].pay += r.pay;
});
return _o1i;
}
export function buildQuote(input) {
const project = input.project || {}, plan = JSON.parse(JSON.stringify(input.plan || { steps: [] }));
const area = Number(input.area) || 0;
const unitPrice = input.unitPrice != null ? Number(input.unitPrice) : (project.price ? project.price[0] : 0);
const listPrice = input.listPrice != null ? Math.round(Number(input.listPrice)) : Math.round(area * unitPrice * 1e6);
const factor = isFinite(plan.factor) ? Number(plan.factor) : 1;
const total = _o1s(listPrice * factor);
const today = input.today || todayYM();
const M = projectMonths(project, today);
const steps = (plan.steps || []).map((s) => ({ name: s.name, pct: Number(s.pct) || 0, at: s.at, bank: !!s.bank, when: s.when || atLabel(s.at), month: resolveMonth(s.at, M), amount: 0 }));
let _o3 = 0;
steps.forEach((s, i) => {
if (i < steps.length - 1) { s.amount = _o1s(total * s.pct / 100); _o3 += s.amount; } else s.amount = total - _o3;
});
const sum = steps.reduce((a, s) => a + s.amount, 0), ps = pctSum(plan);
const check = { pctSum: ps, sum, diff: Math.abs(sum - total), ok: Math.abs(ps - 100) <= 0.01 && Math.abs(sum - total) <= 1000 && steps.every((s) => s.amount >= 0) };
const own = steps.filter((s) => !s.bank), bankSteps = steps.filter((s) => s.bank);
const first = own.filter((s) => s.month === 0).reduce((a, s) => a + s.amount, 0);
const _ov = {};
own.filter((s) => s.month > 0).forEach((s) => { _ov[s.month] = (_ov[s.month] || 0) + s.amount; });
const later = Object.keys(_ov).map(Number).sort((a, b) => a - b).map((m) => ({ month: m, amount: _ov[m] }));
const bank = bankSteps.reduce((a, s) => a + s.amount, 0);
const stages = { first, later, bank, own: total - bank };
const capital = input.capital != null && input.capital !== "" ? Number(input.capital) : null;
const enough = capital == null ? null : capital >= first;
let loan = null;
const _o17 = bank || (plan.loan > 0 ? _o1s(total * plan.loan) : 0);
if (_o17 > 0) {
const disbMonth = bankSteps.length ? Math.min(...bankSteps.map((s) => s.month)) : M.HD + 1;
let support = plan.htls === "H" || plan.htls === "HANDOVER" ? Math.max(6, M.H - disbMonth) : Number(plan.htls) || 0;
if (input.support != null) support = Number(input.support);
const grace = input.grace != null ? Number(input.grace) : support;
const rate = input.rate != null ? Number(input.rate) : 10, years = input.years != null ? Number(input.years) : 25;
const L = loanSchedule({ principal: _o17, rate, years, grace, support, method: input.method || "equal" });
loan = { amount: _o17, rate, years, grace: L.grace, support: L.support, method: L.method, disbMonth,
firstPay: L.firstPay, firstPayMonth: L.firstPayMonth, lastPay: L.lastPay, monthlyPrincipal: L.monthlyPrincipal,
totalInterest: L.totalInterest, supportedInterest: L.supportedInterest };
}
const pol = input.policy ? { id: input.policy.id || null, month: input.policy.month || null, status: input.policy.status || "active" } : { id: null, month: null, status: "default" };
pol.label = policyLabel(pol.month ? pol : null);
return {
v: 1, created_at: input.now || Date.now(), today,
customer: input.customer ? { id: input.customer.id, name: input.customer.name || "", phone: input.customer.phone || "", zalo: input.customer.zalo || "" } : null,
project: { id: project.id, name: project.name || "", dev: project.dev || "", loc: project.loc || "", handover: project.handover || null },
unit: { type: input.type || "", area, unitPrice, listPrice, code: input.code || "" },
plan, policy: pol, total, steps, check, stages, capital, enough,
short: enough === false ? first - capital : 0, loan,
};
}
export function comparePlans(models) {
if (!Array.isArray(models) || !models.length) return { cols: [], rows: [] };
if (models.length > 3) throw new Error("So sánh tối đa 3 phương án.");
const cost = (m) => m.total + (m.loan ? m.loan.totalInterest : 0);
const _ol = [
["total", "Tổng giá", (m) => m.total, "min"],
["first", "Đợt đầu (tiền tự có)", (m) => m.stages.first, "min"],
["own", "Tổng tiền tự có", (m) => m.stages.own, "min"],
["loan", "Ngân hàng cho vay", (m) => m.loan ? m.loan.amount : 0, null],
["support", "Hỗ trợ lãi 0%", (m) => m.loan ? m.loan.support : 0, null],
["monthly", "Trả tháng đầu (sau hỗ trợ)", (m) => m.loan ? m.loan.firstPay : 0, null],
["interest", "Tổng lãi khách trả", (m) => m.loan ? m.loan.totalInterest : 0, null],
["cost", "Tổng chi phí (giá + lãi)", cost, "min"],
];
const rows = _ol.map(([key, label, fn, mode]) => {
const values = models.map(fn);
let best = null;
if (mode === "min" && models.length > 1 && new Set(values).size > 1) best = values.indexOf(Math.min(...values));
return { key, label, values, best };
});
return { cols: models.map((m) => ({ id: m.plan.id, name: m.plan.name, sub: m.plan.sub || "" })), rows };
}
export function earlyVsLoan({ project, plans, type, area, unitPrice, rate = 10, years = 25, today, method }) {
const early = (plans || []).filter((p) => !(p.loan > 0) && !p.steps.some((s) => s.bank)).sort((a, b) => a.factor - b.factor)[0];
const lp = (plans || []).filter((p) => p.loan > 0 || p.steps.some((s) => s.bank)).sort((a, b) => (b.loan || 0) - (a.loan || 0))[0];
if (!early || !lp) return null;
const base = { project, type, area, unitPrice, rate, years, today, method };
const e = buildQuote({ ...base, plan: early }), l = buildQuote({ ...base, plan: lp });
const gap = l.total - e.total, supported = l.loan ? l.loan.supportedInterest : 0;
const verdict = gap > supported ? "early" : "loan";
return { early: e, loan: l, gap, supported, verdict,
text: verdict === "early" ? "Khoản hỗ trợ lãi thấp hơn phần giá chênh: khách có sẵn tiền nên cân nhắc trả sớm." : "Khoản hỗ trợ lãi bù được phần giá chênh: vay vẫn là phương án hợp lý." };
}
export function quoteRow(model, { objectId = "", id = uid(), now = Date.now() } = {}) {
return { id, object_id: objectId || (model.customer && model.customer.id) || "", project_id: model.project.id, unit_type: model.unit.type,
area: model.unit.area, price_total: model.total, plan_id: model.plan.id, policy_id: model.policy.id || "",
payload: JSON.stringify(model), created_at: now, updated_at: now, deleted: 0 };
}
export function quoteFromRow(_o1t) {
if (!_o1t) return null;
let m = _o1t.payload;
if (typeof m === "string") { try { m = JSON.parse(m); } catch { return null; } }
if (!m || !m.steps) return null;
m.policy = m.policy || { id: _o1t.policy_id || null, month: null };
m.policy.label = policyLabel(m.policy.month ? m.policy : null);
m.saved_id = _o1t.id;
return m;
}
export const quoteKey = (m) => [m.project.id, m.unit.type, m.unit.area, m.unit.unitPrice, m.plan.id, m.policy.id, m.total, m.capital, m.loan && m.loan.rate, m.loan && m.loan.years, m.loan && m.loan.method, m.customer && m.customer.id].join("|");
export const footLine = (m) => m.policy && m.policy.month
? `Giá tham khảo – theo chính sách tháng ${ymLabel(m.policy.month)}, có thể thay đổi`
: "Giá tham khảo – theo chính sách tham khảo của chủ đầu tư, có thể thay đổi";
export function monthText(month, today) {
if (month === 0) return "Khi ký";
if (!today) return "Tháng thứ " + fmtNum(month, 1);
return "T" + ymLabel(ymStr(ymNum(today) + Math.round(month))).replace(/^0/, "");
}
export function normProfile(p) {
p = p || {};
const _ov = (...k) => String(_o1m(p, k) ?? "").trim();
return { name: _ov("name", "ten", "full_name"), title: _ov("title", "chuc_danh", "position"), cchn: _ov("cchn", "chung_chi", "license"),
phone: _ov("phone", "sdt", "tel"), zalo: _ov("zalo"), company: _ov("company", "noi_lam_viec", "cong_ty"), brand: _ov("brand", "logo_text", "thuong_hieu"),
email: _ov("email") };
}
export function zaloCopiedText(opened, downloaded) {
if (!opened) return 'Đã chép nội dung báo giá.';
return 'Đã chép nội dung báo giá – dán vào Zalo của khách' + (downloaded ? ' (kèm ảnh vừa tải).' : '. Muốn gửi kèm ảnh: bấm "Tải ảnh" rồi gửi ảnh trong Zalo.');
}
export function quoteText(m, profile, money = fmtMoney) {
const P = normProfile(profile), L = [];
L.push(`Báo giá căn hộ – ${m.project.name}`);
L.push(`Căn ${m.unit.type} · ${fmtNum(m.unit.area)} m² · ${fmtNum(m.unit.unitPrice, 1)} triệu/m²`);
L.push(`Phương án: ${m.plan.name}${m.plan.sub ? " (" + m.plan.sub + ")" : ""}`);
L.push(`Tổng giá: ${money(m.total)} (${fmtVnd(m.total)})`);
m.steps.forEach((s) => L.push(`• ${s.name} – ${fmtNum(s.pct)}%: ${fmtVnd(s.amount)} (${s.when}${s.bank ? ", ngân hàng giải ngân" : ""})`));
L.push(`Đợt đầu cần chuẩn bị: ${money(m.stages.first)}`);
if (m.loan) L.push(`Vay ${money(m.loan.amount)}, hỗ trợ lãi 0% ${m.loan.support} tháng; sau đó trả tháng đầu ~${money(m.loan.firstPay)} (lãi ${fmtNum(m.loan.rate)}%/năm, ${fmtNum(m.loan.years)} năm).`);
L.push(footLine(m) + ".");
const _o20 = [P.name, P.title, P.cchn && "CCHN " + P.cchn, P.phone, P.email].filter(Boolean).join(" · ");
if (_o20) L.push(_o20);
return L.join("\n");
}
export const PLAN_SCHEMA = `{"plans":[{"name":"Tên phương án","sub":"Mô tả ngắn","discount":"Chiết khấu % trên giá niêm yết (số)","factor":"Tổng phải trả / giá niêm yết, ví dụ 0.917 (nếu có)","loan":"Tỷ lệ vay % (0 nếu không vay)","htls":"Số tháng hỗ trợ lãi 0% hoặc \\"H\\" nếu đến bàn giao","steps":[{"name":"Tên đợt","pct":10,"at":"0 | số tháng sau ký | \\"HD\\" | \\"HD+1\\" | \\"H\\"","bank":false,"when":"Ghi chú thời điểm như trên phiếu"}]}]}`;
export function readPolicyPrompt(project) {
const p = project || {};
return [
`Đọc phiếu tính giá / chính sách bán hàng của dự án "${p.name || ""}"${p.dev ? " (chủ đầu tư " + p.dev + ")" : ""}.`,
"Trích TẤT CẢ phương án thanh toán. Trả về DUY NHẤT một JSON đúng mẫu sau, không thêm lời giải thích:",
PLAN_SCHEMA,
"Quy ước: pct là số phần trăm của tổng giá (tổng các đợt của mỗi phương án = 100). at: 0 = khi ký thoả thuận/đặt cọc; số = số tháng sau khi ký; \"HD\" = khi ký HĐMB; \"HD+1\" = 1 tháng sau ký HĐMB; \"H\" = khi bàn giao. bank=true nếu đợt do ngân hàng giải ngân.",
"Nếu phiếu ghi số tiền thay vì %, thêm trường \"total\" (tổng giá, đồng) và \"amount\" cho từng đợt.",
"KHÔNG ghi tên khách, số điện thoại, CCCD hay mã căn của khách – che/bỏ nếu có trên phiếu.",
].join("\n");
}
export const COLORS = { navy: "#0F1E33", navy2: "#18304F", gold: "#C9A24A", gold2: "#E7CF97", cream: "#F7F3EA", ink: "#0F1E33", muted: "#6B7385", line: "#E3DCCB", ok: "#1E7A4F", bad: "#B3261E", white: "#FFFFFF" };
const W = 1080, H = 1350;
function _ox(items, P, w) {
const C = COLORS;
items.push({ t: "rect", x: 0, y: 0, w, h: H, fill: C.navy });
items.push({ t: "rect", x: 0, y: 0, w, h: 8, fill: C.gold });
const brand = P.brand || P.company || "BDS Studio";
const initials = brand.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase() || "B";
items.push({ t: "circle", x: 104, y: 104, r: 52, fill: C.gold });
items.push({ t: "text", x: 104, y: 122, text: initials, size: 46, weight: 800, color: C.navy, align: "center" });
items.push({ t: "text", x: 176, y: 96, text: brand, size: 34, weight: 800, color: C.gold2, maxW: 400 });
items.push({ t: "text", x: 176, y: 136, text: "BÁO GIÁ CĂN HỘ", size: 24, weight: 600, color: C.cream, maxW: 400, spacing: 3 });
const _o16 = [[P.name, 32, 800, C.white], [P.title, 24, 500, C.gold2], [P.cchn && "CCHN: " + P.cchn, 22, 500, C.cream], [P.phone && "SĐT/Zalo: " + P.phone, 24, 700, C.cream]].filter((l) => l[0]);
if (P.email && _o16.length < 4) _o16.push([P.email, 20, 500, C.cream]);
let y = 72;
_o16.forEach(([text, size, weight, color]) => { items.push({ t: "text", x: w - 56, y, text, size, weight, color, align: "right", maxW: 440 }); y += size + 12; });
}
function _os(items, m, w) {
const C = COLORS;
items.push({ t: "line", x1: 56, y1: H - 92, x2: w - 56, y2: H - 92, color: C.gold, w: 2 });
items.push({ t: "text", x: w / 2, y: H - 54, text: footLine(m), size: 24, weight: 600, color: C.gold2, align: "center", maxW: w - 112 });
const _oh = new Date(m.created_at || Date.now());
items.push({ t: "text", x: w / 2, y: H - 22, text: "Ngày báo giá " + [_oh.getDate(), _oh.getMonth() + 1, _oh.getFullYear()].map((x) => String(x).padStart(2, "0")).join("/"), size: 20, weight: 400, color: C.cream, align: "center", maxW: w - 112 });
}
export function quoteLayout(m, profile, opts = {}) {
const money = opts.money || fmtMoney, P = normProfile(profile), C = COLORS, w = W, items = [];
_ox(items, P, w);
const _o27 = 196, bottom = H - 112;
items.push({ t: "rect", x: 40, y: _o27, w: w - 80, h: bottom - _o27, fill: C.cream, r: 28 });
const _o2 = 80, R = w - 80;
let y = _o27 + 64;
items.push({ t: "text", x: _o2, y, text: m.project.name, size: 48, weight: 800, color: C.ink, maxW: R - _o2 });
y += 42;
const _o1b = [m.project.dev, m.project.handover ? "Bàn giao dự kiến " + ymLabel(m.project.handover) : ""].filter(Boolean).join(" · ");
if (_o1b) { items.push({ t: "text", x: _o2, y, text: _o1b, size: 24, weight: 500, color: C.muted, maxW: R - _o2 }); y += 40; }
items.push({ t: "text", x: _o2, y, text: `Căn ${m.unit.type}${m.unit.code ? " " + m.unit.code : ""} · ${fmtNum(m.unit.area)} m² · ${fmtNum(m.unit.unitPrice, 1)} triệu/m²`, size: 28, weight: 600, color: C.ink, maxW: R - _o2 });
y += 26;
items.push({ t: "rect", x: _o2, y, w: R - _o2, h: 150, fill: C.navy, r: 20 });
items.push({ t: "text", x: _o2 + 32, y: y + 46, text: (m.plan.name + (m.plan.sub ? " · " + m.plan.sub : "")), size: 26, weight: 600, color: C.gold2, maxW: R - _o2 - 64 });
items.push({ t: "text", x: _o2 + 32, y: y + 108, text: "Tổng giá " + money(m.total), size: 54, weight: 800, color: C.white, maxW: (R - _o2) * 0.62 });
items.push({ t: "text", x: R - 32, y: y + 106, text: fmtVnd(m.total), size: 26, weight: 600, color: C.gold2, align: "right", maxW: (R - _o2) * 0.36 });
y += 150 + 24;
const kv = [["Đợt đầu", money(m.stages.first)], ["Tiền tự có", money(m.stages.own)]];
if (m.loan) kv.push(["Ngân hàng cho vay", money(m.loan.amount)]);
const _of = (R - _o2 - (kv.length - 1) * 16) / kv.length;
kv.forEach(([k, v], i) => {
const x = _o2 + i * (_of + 16);
items.push({ t: "rect", x, y, w: _of, h: 96, fill: C.white, r: 16 });
items.push({ t: "text", x: x + 20, y: y + 36, text: k, size: 22, weight: 500, color: C.muted, maxW: _of - 40 });
items.push({ t: "text", x: x + 20, y: y + 76, text: v, size: 32, weight: 800, color: C.ink, maxW: _of - 40 });
});
y += 96 + 30;
const _o18 = m.loan ? 92 : 0;
const _o24 = y, tableBottom = bottom - 36 - _o18 - (m.loan ? 16 : 0);
const cols = { name: _o2 + 8, when: _o2 + 400, pct: _o2 + 700, amt: R - 8 };
items.push({ t: "text", x: cols.name, y: _o24, text: "Đợt thanh toán", size: 22, weight: 700, color: C.muted });
items.push({ t: "text", x: cols.when, y: _o24, text: "Thời điểm", size: 22, weight: 700, color: C.muted });
items.push({ t: "text", x: cols.pct, y: _o24, text: "%", size: 22, weight: 700, color: C.muted, align: "right" });
items.push({ t: "text", x: cols.amt, y: _o24, text: "Số tiền", size: 22, weight: 700, color: C.muted, align: "right" });
items.push({ t: "line", x1: _o2, y1: _o24 + 14, x2: R, y2: _o24 + 14, color: C.gold, w: 2 });
const _o6 = tableBottom - (_o24 + 14);
let n = m.steps.length, _o1u = Math.min(58, Math.max(30, _o6 / Math.max(1, n)));
let _o1z = m.steps, more = 0;
if (n * _o1u > _o6) { const _or = Math.floor(_o6 / _o1u) - 1; _o1z = m.steps.slice(0, _or); more = n - _or; }
const _ou = Math.max(17, Math.min(26, Math.round(_o1u * 0.46)));
let _o1v = _o24 + 14;
_o1z.forEach((s, i) => {
const _o9 = _o1v + _o1u * 0.66;
if (i % 2 === 1) items.push({ t: "rect", x: _o2, y: _o1v + 2, w: R - _o2, h: _o1u - 2, fill: "#EFE8D8", r: 8 });
items.push({ t: "text", x: cols.name, y: _o9, text: s.name, size: _ou, weight: 600, color: s.bank ? C.ok : C.ink, maxW: cols.when - cols.name - 16 });
items.push({ t: "text", x: cols.when, y: _o9, text: s.when + (s.bank && !/ngân hàng/i.test(s.name) ? " · NH" : ""), size: _ou - 2, weight: 400, color: C.muted, maxW: cols.pct - cols.when - 70 });
items.push({ t: "text", x: cols.pct, y: _o9, text: fmtNum(s.pct) + "%", size: _ou, weight: 600, color: C.ink, align: "right" });
items.push({ t: "text", x: cols.amt, y: _o9, text: fmtVnd(s.amount), size: _ou, weight: 700, color: C.ink, align: "right", maxW: cols.amt - cols.pct - 24 });
_o1v += _o1u;
});
if (more) {
const _o1r = m.steps.slice(_o1z.length);
items.push({ t: "text", x: cols.name, y: _o1v + _o1u * 0.66, text: `… và ${more} đợt khác`, size: _ou, weight: 600, color: C.muted, maxW: cols.pct - cols.name });
items.push({ t: "text", x: cols.pct, y: _o1v + _o1u * 0.66, text: fmtNum(_o1r.reduce((a, s) => a + s.pct, 0)) + "%", size: _ou, weight: 600, color: C.ink, align: "right" });
items.push({ t: "text", x: cols.amt, y: _o1v + _o1u * 0.66, text: fmtVnd(_o1r.reduce((a, s) => a + s.amount, 0)), size: _ou, weight: 700, color: C.ink, align: "right", maxW: cols.amt - cols.pct - 24 });
_o1v += _o1u;
}
items.push({ t: "line", x1: _o2, y1: _o1v + 4, x2: R, y2: _o1v + 4, color: C.line, w: 2 });
items.push({ t: "text", x: cols.name, y: _o1v + 34, text: m.check && m.check.ok ? "Tổng cộng – đã đối chiếu" : "Tổng cộng", size: 22, weight: 700, color: C.ink, maxW: cols.pct - cols.name - 80 });
items.push({ t: "text", x: cols.pct, y: _o1v + 34, text: fmtNum(m.check ? m.check.pctSum : 100) + "%", size: 22, weight: 700, color: C.ink, align: "right" });
items.push({ t: "text", x: cols.amt, y: _o1v + 34, text: fmtVnd(m.check ? m.check.sum : m.total), size: 22, weight: 800, color: C.ink, align: "right" });
if (m.loan) {
const _o19 = bottom - 36 - _o18;
items.push({ t: "rect", x: _o2, y: _o19, w: R - _o2, h: _o18, fill: C.navy2, r: 16 });
items.push({ t: "text", x: _o2 + 24, y: _o19 + 38, text: `Hỗ trợ lãi 0% ${m.loan.support} tháng · lãi ${fmtNum(m.loan.rate)}%/năm · ${fmtNum(m.loan.years)} năm`, size: 22, weight: 500, color: C.cream, maxW: R - _o2 - 48 });
items.push({ t: "text", x: _o2 + 24, y: _o19 + 74, text: `Sau hỗ trợ, tháng đầu trả ~${money(m.loan.firstPay)} (${m.loan.method === "annuity" ? "trả đều" : "gốc đều, lãi giảm dần"})`, size: 24, weight: 700, color: C.gold2, maxW: R - _o2 - 48 });
}
_os(items, m, w);
return { w, h: H, items };
}
export function compareLayout(models, profile, opts = {}) {
const money = opts.money || fmtMoney, P = normProfile(profile), C = COLORS, w = W, items = [];
const _od = comparePlans(models), m0 = models[0];
_ox(items, P, w);
const _o27 = 196, bottom = H - 112;
items.push({ t: "rect", x: 40, y: _o27, w: w - 80, h: bottom - _o27, fill: C.cream, r: 28 });
const _o2 = 80, R = w - 80;
let y = _o27 + 64;
items.push({ t: "text", x: _o2, y, text: "So sánh phương án · " + m0.project.name, size: 40, weight: 800, color: C.ink, maxW: R - _o2 });
y += 44;
items.push({ t: "text", x: _o2, y, text: `Căn ${m0.unit.type} · ${fmtNum(m0.unit.area)} m² · ${fmtNum(m0.unit.unitPrice, 1)} triệu/m²`, size: 26, weight: 600, color: C.muted, maxW: R - _o2 });
y += 36;
const _o14 = 300, n = _od.cols.length, _of = (R - _o2 - _o14) / n;
items.push({ t: "rect", x: _o2, y, w: R - _o2, h: 96, fill: C.navy, r: 16 });
_od.cols.forEach((_oa, i) => {
const _og = _o2 + _o14 + _of * i + _of / 2;
items.push({ t: "text", x: _og, y: y + 42, text: _oa.name, size: 28, weight: 800, color: C.gold2, align: "center", maxW: _of - 16 });
if (_oa.sub) items.push({ t: "text", x: _og, y: y + 76, text: _oa.sub, size: 19, weight: 400, color: C.cream, align: "center", maxW: _of - 16 });
});
y += 96;
const _o1u = Math.min(96, (bottom - 40 - y) / _od.rows.length);
_od.rows.forEach((r, _o13) => {
if (_o13 % 2 === 0) items.push({ t: "rect", x: _o2, y, w: R - _o2, h: _o1u, fill: "#EFE8D8", r: 8 });
items.push({ t: "text", x: _o2 + 16, y: y + _o1u * 0.6, text: r.label, size: 23, weight: 600, color: C.ink, maxW: _o14 - 24 });
r.values.forEach((v, i) => {
const _og = _o2 + _o14 + _of * i + _of / 2;
const _o29 = r.key === "support" ? (models[i].loan ? htlsTxt(models[i].loan.support) : "–") : (v ? money(v) : "–");
items.push({ t: "text", x: _og, y: y + _o1u * 0.6, text: _o29 + (r.best === i ? " ✓" : ""), size: 27, weight: r.best === i ? 800 : 600, color: r.best === i ? C.ok : C.ink, align: "center", maxW: _of - 16 });
});
y += _o1u;
});
_os(items, m0, w);
return { w, h: H, items };
}
export function barLayout(bars, w = 320, h = 120, pad = 4) {
const max = Math.max(1, ...bars.map((b) => b.pay)), bw = (w - pad * 2) / Math.max(1, bars.length);
return bars.map((b, i) => {
const _oy = b.principal / max * (h - 16), hi = b.interest / max * (h - 16);
return { x: pad + i * bw + bw * 0.12, w: bw * 0.76, yP: h - _oy, hP: _oy, yI: h - _oy - hi, hI: hi, year: b.year, pay: b.pay };
});
}
export function drawLayout(_ov, layout, family = "sans-serif") {
for (const _o12 of layout.items) {
if (_o12.t === "rect") {
_ov.fillStyle = _o12.fill;
const r = _o12.r || 0;
_ov.beginPath();
if (r && _ov.roundRect) _ov.roundRect(_o12.x, _o12.y, _o12.w, _o12.h, r); else _ov.rect(_o12.x, _o12.y, _o12.w, _o12.h);
_ov.fill();
} else if (_o12.t === "circle") {
_ov.fillStyle = _o12.fill; _ov.beginPath(); _ov.arc(_o12.x, _o12.y, _o12.r, 0, Math.PI * 2); _ov.fill();
} else if (_o12.t === "line") {
_ov.strokeStyle = _o12.color; _ov.lineWidth = _o12.w || 1; _ov.beginPath(); _ov.moveTo(_o12.x1, _o12.y1); _ov.lineTo(_o12.x2, _o12.y2); _ov.stroke();
} else if (_o12.t === "text") {
let size = _o12.size || 24, text = String(_o12.text ?? "");
const font = (s) => `${_o12.weight || 400} ${s}px ${family}`;
_ov.font = font(size);
if (_o12.maxW) {
while (size > (_o12.size || 24) * 0.6 && _ov.measureText(text).width > _o12.maxW) { size -= 1; _ov.font = font(size); }
if (_ov.measureText(text).width > _o12.maxW) {
while (text.length > 1 && _ov.measureText(text + "…").width > _o12.maxW) text = text.slice(0, -1);
text += "…";
}
}
_ov.fillStyle = _o12.color || "#000"; _ov.textAlign = _o12.align || "left"; _ov.textBaseline = "alphabetic";
_ov.fillText(text, _o12.x, _o12.y);
}
}
}
export function hashParams(hash) {
const h = hash != null ? hash : (typeof location !== "undefined" ? location.hash : "");
return new URLSearchParams(String(h).split("?")[1] || "");
}
const _ow = () => (typeof globalThis !== "undefined" ? globalThis : {});
async function _o1w(store, table) {
try { const r = await store.list(table); return Array.isArray(r) ? r : []; } catch { return []; }
}
export function moneyOf(L) {
return (n) => { try { const s = L && L.fmt && L.fmt.money(n); if (s) return s; } catch { } return fmtMoney(n); };
}
export async function loadEnv(ctx) {
const G = _ow(), data = (ctx && ctx.data) || {};
const L = (ctx && ctx.logic) || G.BDSLogic || null;
const _o0 = G.BDSData || {};
const _ok = Array.isArray(data.projects) ? data.projects : (_o0.projects || []);
const defaultPolicies = data.defaultPolicies || data.policies || _o0.policies || {};
const cfg = { LOAN_YEARS: 25, RATE: 10, ...(_o0.cfg || {}), ...(data.cfg || {}) };
const store = ctx && ctx.store;
const projectRows = store ? await _o1w(store, "projects") : [];
const policies = (store ? await _o1w(store, "policies") : []).filter((p) => !Number(p.deleted));
const projects = mergeProjects(_ok, projectRows);
const today = todayISO();
const env = {
L, cfg, projects, projectRows, policies, defaultPolicies, today, money: moneyOf(L),
defaultIds: new Set(_ok.map((p) => String(p && p.id))),
project: (id) => projects.find((p) => p.id === String(id)) || null,
active: (pid) => activePolicy(policies, pid, today),
plansFor(p) {
if (!p) return { plans: [], policy: null };
const pol = activePolicy(policies, p.id, today);
if (pol) { const plans = parsePlans(pol.plans); if (plans.length) return { plans, policy: pol }; }
return { plans: defaultPlansFor(p, defaultPolicies), policy: null };
},
history: (pid) => policies.filter((p) => String(p.project_id) === String(pid))
.sort((a, b) => String(b.effective_from || b.month || "").localeCompare(String(a.effective_from || a.month || "")) || (Number(b.updated_at) || 0) - (Number(a.updated_at) || 0)),
};
return env;
}
export async function getSetting(ctx, key, fb) {
try {
const s = ctx.settings;
if (s && typeof s.get === "function") { const v = await s.get(key); if (v !== undefined && v !== null) return v; }
else if (s && s[key] !== undefined && s[key] !== null) return s[key];
} catch { }
try {
const _o1t = ctx.store && await ctx.store.get("settings", key);
if (_o1t) return typeof _o1t.value === "string" ? JSON.parse(_o1t.value) : _o1t.value;
} catch { }
return fb;
}
export async function getProfile(ctx) {
const _o1a = String((ctx && ctx.user && ctx.user.email) || "").trim();
for (const k of ["profile", "owner", "me"]) {
const v = await getSetting(ctx, k, null);
if (v && typeof v === "object") { const P = normProfile(v); if (!P.email) P.email = _o1a; return P; }
}
return normProfile({ email: _o1a });
}
export async function selftestSales(ctx, needLogic = []) {
const details = [];
try {
const env = await loadEnv(ctx || {});
for (const _o1k of ["fmt.money", ...needLogic]) {
const fn = _o1k.split(".").reduce((_o1g, k) => (_o1g ? _o1g[k] : undefined), env.L);
if (typeof fn !== "function") details.push("Thiếu logic." + _o1k);
}
const p = env.projects.find(sellable);
if (!p) details.push("Không có dự án mẫu đang bán");
else {
const { plans } = env.plansFor(p);
if (!plans.length) details.push("Dự án mẫu chưa có phương án");
const t = p.types.find((x) => !x.ask);
const _o1c = plans.slice(0, 3).map((plan) => buildQuote({ project: p, type: t.n, area: t.a[0], unitPrice: p.price[0], plan, capital: 1e9, rate: env.cfg.RATE, years: env.cfg.LOAN_YEARS }));
_o1c.forEach((m) => { if (!m.check.ok) details.push(`Báo giá mẫu ${p.id}/${m.plan.id} lệch tổng`); });
if (_o1c.length) { quoteLayout(_o1c[0], {}); comparePlans(_o1c); }
if (env.L && env.L.pay && typeof env.L.pay.total === "function" && _o1c[0]) {
const lp = env.L.pay.plans(p, env.defaultPolicies).find((x) => x.id === _o1c[0].plan.id);
if (lp && !env.plansFor(p).policy && Math.abs(env.L.pay.total(p, lp, t.a[0], p.price[0]) - _o1c[0].total) > 1000) details.push("Tổng giá lệch BDSLogic.pay.total");
}
}
} catch (e) { details.push("Lỗi: " + (e && e.message)); }
return { ok: !details.length, details: details.length ? details.join("; ") : "Đạt" };
}
export const SALES_CSS = `
.sl{--sl-navy:var(--navy,#0F1E33);--sl-gold:var(--gold,#C9A24A);--sl-cream:var(--cream,#F7F3EA);--sl-line:rgba(127,127,127,.25);--sl-muted:rgba(127,127,127,.95);display:flex;flex-direction:column;gap:14px}
.sl h2{margin:0;font-size:1.25rem}.sl h3{margin:0 0 6px;font-size:1.05rem}
.sl-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.sl-col{display:flex;flex-direction:column;gap:6px}.sl-end{justify-content:flex-end}.sl-sp{justify-content:space-between}
.sl-muted{color:var(--sl-muted);font-size:.9em}.sl-small{font-size:.85em}
.sl-chips{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}
.sl-chip{min-height:40px;padding:0 14px;border-radius:999px;border:1px solid var(--sl-line);background:transparent;color:inherit;white-space:nowrap;cursor:pointer;font:inherit}
.sl-chip.on{background:var(--sl-navy);color:#fff;border-color:var(--sl-navy)}
.sl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.sl-pcard{display:flex;flex-direction:column;text-align:left;border:1px solid var(--sl-line);border-radius:16px;overflow:hidden;background:var(--card,var(--surface,transparent));color:inherit;cursor:pointer;padding:0;font:inherit}
.sl-pcard .sl-cover{position:relative;aspect-ratio:16/9;background:linear-gradient(135deg,#29466e,#0F1E33)}
.sl-pcard img{width:100%;height:100%;object-fit:cover;display:block}
.sl-pcard .sl-pb{padding:10px 12px 12px;display:flex;flex-direction:column;gap:4px}
.sl-pcard b{font-size:1.02rem}
.sl-tag{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;padding:3px 9px;border-radius:999px;background:rgba(201,162,74,.16);color:inherit;width:max-content}
.sl-tag.ref{background:rgba(127,127,127,.15)}
.sl-dot{width:10px;height:10px;border-radius:50%;background:var(--sl-gold);display:inline-block;box-shadow:0 0 0 2px rgba(201,162,74,.3)}
.sl-cover .sl-dev{position:absolute;left:8px;top:8px;max-width:calc(100% - 16px);box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:rgba(15,30,51,.8);color:#fff;font-size:.75rem;padding:3px 8px;border-radius:8px}
.sl-form{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.sl-f{display:flex;flex-direction:column;gap:4px;font-size:.9rem}
.sl-f input,.sl-f select,.sl-f textarea,.sl input.sl-in,.sl select.sl-in{min-height:44px;padding:8px 10px;border-radius:10px;border:1px solid var(--sl-line);background:transparent;color:inherit;font:inherit;width:100%;box-sizing:border-box}
.sl-f textarea{min-height:90px}
.sl-box{border:1px solid var(--sl-line);border-radius:16px;padding:14px;background:var(--card,var(--surface,transparent))}
.sl-kpis{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
.sl-kpi{border-radius:12px;padding:10px;background:rgba(201,162,74,.10)}.sl-kpi small{display:block;color:var(--sl-muted)}.sl-kpi b{font-size:1.1rem}
.sl-tbl{width:100%;border-collapse:collapse;font-size:.92rem}.sl-tbl th,.sl-tbl td{padding:8px 6px;border-bottom:1px solid var(--sl-line);text-align:left;vertical-align:top}
.sl-tbl td.n,.sl-tbl th.n{text-align:right;white-space:nowrap}.sl-tbl tr.bank td{color:#1E7A4F}
.sl-scroll{overflow-x:auto;max-width:100%;min-width:0;-webkit-overflow-scrolling:touch}
.sl,.sl-row>*,.sl-col>*,.sl-kpi{min-width:0}.sl-row>.sl-btn,.sl-row>button{max-width:100%}
.sl a,.sl-issues li,.sl-muted,.sl-kpi b,.sl h3,.sl-pcard b,.crs-src{overflow-wrap:anywhere}
.sl-tbl td.rng{white-space:normal}.sl-nw{white-space:nowrap}
.sl-ok{color:#1E7A4F;font-weight:600}.sl-bad{color:#B3261E;font-weight:600}
.sl-err{outline:2px solid #B3261E !important;background:rgba(179,38,30,.06) !important}
.sl-warn{outline:2px solid #C9A24A !important;background:rgba(201,162,74,.08) !important}
.sl-issues{margin:0;padding-left:18px}.sl-issues li.e{color:#B3261E}.sl-issues li.w{color:#9a7a2e}
.sl-cmp td.best{font-weight:700;color:#1E7A4F}
.sl-btn{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--sl-line);background:transparent;color:inherit;font:inherit;cursor:pointer}
.sl-btn.primary{background:var(--sl-navy);color:#fff;border-color:var(--sl-navy)}.sl-btn.gold{background:var(--sl-gold);color:#0F1E33;border-color:var(--sl-gold);font-weight:700}
.sl-btn:disabled{opacity:.45;cursor:not-allowed}
.sl-tabs{display:flex;gap:6px;flex-wrap:wrap}
.sl-steps input{min-height:40px;padding:6px 8px;border-radius:8px;border:1px solid var(--sl-line);background:transparent;color:inherit;font:inherit;width:100%;box-sizing:border-box}
.sl-steps td{padding:4px}.sl-steps .w-pct{width:80px}.sl-steps .w-at{width:120px}.sl-steps .w-x{width:44px}
.sl-chart{width:100%;height:auto;max-height:180px}
.sl-preview img{max-width:100%;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,.2)}
.sl-planpick label{display:flex;gap:8px;align-items:center;min-height:44px;border:1px solid var(--sl-line);border-radius:12px;padding:6px 10px;cursor:pointer}
.sl-planpick{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
@media (max-width:600px){.sl-tbl.sl-stack thead{display:none}.sl-tbl.sl-stack tr{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 12px;padding:8px 0;border-bottom:1px solid var(--sl-line)}.sl-tbl.sl-stack td,.sl-tbl.sl-stack td.n{border:0;padding:2px 0;text-align:left;white-space:normal}.sl-tbl.sl-stack td:first-child{grid-column:1/-1}.sl-tbl.sl-stack td:empty{display:none}.sl-tbl.sl-stack td[data-label]::before{content:attr(data-label) ": ";color:var(--sl-muted);font-size:.85em}}
@media (max-width:600px){.sl-steps thead{display:none}.sl-steps tr{display:grid;grid-template-columns:1fr 1fr 44px 44px;gap:4px;padding:6px 0;border-bottom:1px solid var(--sl-line)}.sl-steps td{border:0;padding:0}.sl-steps td:first-child{grid-column:1/-1}.sl-steps .w-pct,.sl-steps .w-at{width:auto}}
@media (min-width:900px){.sl-two{display:grid;grid-template-columns:minmax(320px,420px) 1fr;gap:16px;align-items:start}}
`;
let _oe = false;
export function ensureSalesCss() {
if (typeof document === "undefined" || _oe || document.getElementById("bds-sales-css")) return;
_oe = true;
try {
const _o1y = new CSSStyleSheet();
_o1y.replaceSync(SALES_CSS);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o1y];
return;
} catch { }
const s = document.createElement("style");
s.id = "bds-sales-css"; s.textContent = SALES_CSS;
document.head.appendChild(s);
}
