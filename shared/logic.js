var BDSLogic = (function () {
'use strict';
var DAY = 86400000;
var VN_OFFSET = 7 * 3600000;
var cfg = { LOAN_YEARS: 25, RATE: 10, TODAY: '2026-11' };
function num(v) { var n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v; return typeof n === 'number' && isFinite(n) ? n : NaN; }
function _ov(n) { return (n < 10 ? '0' : '') + n; }
function _ob(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }
function ym(_o1d) { var a = String(_o1d).split('-'); return Number(a[0]) * 12 + Number(a[1]) - 1; }
function ymStr(_om) { return Math.floor(_om / 12) + '-' + _ov((_om % 12) + 1); }
function _ox(_o1d) {
var a = String(_o1d).slice(0, 10).split('-');
return { y: Number(a[0]), m: Number(a[1]), d: a[2] ? Number(a[2]) : 1 };
}
function _oc(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
function _o1r(y, m, d) { return Date.UTC(y, m - 1, d) - VN_OFFSET; }
function isoToMs(_o1d) { var p = _ox(_o1d); return _o1r(p.y, p.m, p.d); }
function _os(_or) { var t = new Date(_or + VN_OFFSET); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; }
function _oy(p) { return p.y + '-' + _ov(p.m) + '-' + _ov(p.d); }
function vnDayStart(_or) { return Math.floor((_or + VN_OFFSET) / DAY) * DAY - VN_OFFSET; }
function addMonths(p, months) {
var _o1s = Math.floor(months), frac = months - _o1s;
var _om = p.y * 12 + (p.m - 1) + _o1s, y = Math.floor(_om / 12), m = (_om % 12) + 1;
var d = Math.min(p.d, _oc(y, m));
var _or = Date.UTC(y, m - 1, d) + Math.round(frac * 30) * DAY;
var t = new Date(_or);
return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}
function _o1o(v) { if (v == null || v === '') return NaN; if (typeof v === 'number') return v; if (v instanceof Date) return v.getTime(); return isoToMs(v); }
function _oi(intStr) { return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function _o1a(v, _om) {
var _o1d = String(v);
if (/e/i.test(_o1d)) return Number(v.toFixed(_om));
return Number(Math.round(Number(_o1d + 'e' + _om)) + 'e-' + _om);
}
function _oe(v, maxFrac) {
var _o1d = _o1a(v, maxFrac).toFixed(maxFrac), parts = _o1d.split('.');
var frac = parts[1] ? parts[1].replace(/0+$/, '') : '';
return _oi(parts[0]) + (frac ? ',' + frac : '');
}
var fmt = {
money: function (n) {
n = num(n); if (isNaN(n)) return '';
var _o1g = n < 0 ? '-' : '', a = Math.abs(n), tr = Math.round(a / 1e7) * 10;
if (tr === 0) return '0 đồng';
if (tr < 1000) return _o1g + tr + ' triệu';
return _o1g + _oe(a / 1e9, 2) + ' tỷ';
},
moneyFull: function (n) {
n = num(n); if (isNaN(n)) return '';
var _o16 = Math.round(Math.abs(n));
return (n < 0 && _o16 ? '-' : '') + _oi(String(_o16)) + ' đ';
},
percent: function (x, maxFrac) {
x = num(x); if (isNaN(x)) return '';
var v = Math.round(x * 100 * 1e6) / 1e6;
return (v < 0 ? '-' : '') + _oe(Math.abs(v), maxFrac == null ? 2 : maxFrac) + '%';
},
date: function (v) {
if (v == null || v === '') return '';
var p;
if (typeof v === 'number' || v instanceof Date) { var _or = _o1o(v); if (isNaN(_or)) return ''; p = _os(_or); }
else { p = _ox(v); if (isNaN(p.y) || isNaN(p.m)) return ''; }
return _ov(p.d) + '/' + _ov(p.m) + '/' + p.y;
},
phone: function (_o1d) {
var d = normPhone(_o1d); if (!d) return _o1d == null ? '' : String(_o1d).trim();
return d.slice(0, 4) + ' ' + d.slice(4, 7) + ' ' + d.slice(7);
},
phoneE164: function (_o1d) { var d = normPhone(_o1d); return d ? '84' + d.slice(1) : ''; }
};
function normPhone(_o1d) {
if (_o1d == null) return '';
var d = String(_o1d).replace(/\D/g, '');
if (d.indexOf('84') === 0 && d.length === 11) d = '0' + d.slice(2);
else if (d.length === 9 && d.charAt(0) !== '0') d = '0' + d;
return /^0\d{9}$/.test(d) ? d : '';
}
var link = {
tel: function (phone) { return 'tel:' + (normPhone(phone) || String(phone == null ? '' : phone).replace(/[^\d+]/g, '')); },
zalo: function (phone) { return 'https://zalo.me/' + (normPhone(phone) || String(phone == null ? '' : phone).replace(/\D/g, '')); }
};
var loan = {
monthly: function (o) {
o = o || {};
var P = num(o.principal) || 0, _o16 = (num(o.ratePct) || 0) / 1200, N = Math.round((num(o.years) || 0) * 12);
var _oh = Math.max(0, Math.min(N, Math.round(num(o.graceMonths) || 0)));
var _o1m = Math.max(0, Math.round(num(o.supportMonths) || 0));
var method = o.method === 'declining' ? 'declining' : 'annuity';
var rows = [], remain = P, totalInterest = 0, _ok;
for (_ok = 1; _ok <= _oh; _ok++) {
var supported = _ok <= _o1m, it = P * _o16;
rows.push({ m: _ok, principal: 0, interest: it, pay: supported ? 0 : it, remain: P, supported: supported });
if (!supported) totalInterest += it;
}
var n = N - _oh, A = n > 0 ? (_o16 ? (P * _o16) / (1 - Math.pow(1 + _o16, -n)) : P / n) : 0;
for (_ok = 1; _ok <= n; _ok++) {
var interest = remain * _o16, prin = method === 'annuity' ? A - interest : P / n;
if (_ok === n) prin = remain;
remain = _ok === n ? 0 : remain - prin;
var _ow = _ok + _oh <= _o1m ? 0 : interest;
rows.push({ m: _oh + _ok, principal: prin, interest: interest, pay: prin + _ow, remain: remain, supported: _ow === 0 && interest > 0 });
totalInterest += _ow;
}
var _o3 = rows.slice(_oh), _o1l = 0;
for (_ok = 0; _ok < _o3.length; _ok++) _o1l += _o3[_ok].pay;
return {
method: method, months: N, graceMonths: _oh, supportMonths: _o1m,
interestOnly: P * _o16,
first: _o3.length ? _o3[0].pay : 0,
last: _o3.length ? _o3[_o3.length - 1].pay : 0,
avg: _o3.length ? _o1l / _o3.length : 0,
totalInterest: totalInterest, rows: rows
};
}
};
function _ot(_o1d, mo) {
if (Array.isArray(_o1d)) return { name: _o1d[0], pct: _o1d[1], when: _o1d[2], mo: mo, bank: !!_o1d[3] };
var o = _ob(_o1d) || {};
if (o.mo === undefined && mo !== undefined) o.mo = mo;
o.bank = !!o.bank;
return o;
}
function normPlan(pl) {
if (!pl || typeof pl !== 'object') return pl;
var o = {}, _om;
for (_om in pl) if (Object.prototype.hasOwnProperty.call(pl, _om) && _om !== 'steps' && _om !== 'mo') o[_om] = _ob(pl[_om]);
var mo = pl.mo || [];
o.steps = (pl.steps || []).map(function (_o1d, _ok) { return _ot(_o1d, mo[_ok]); });
return o;
}
function parsePlans(v) {
if (typeof v === 'string') { try { v = JSON.parse(v); } catch (e) { return []; } }
return Array.isArray(v) ? v : [];
}
function _o1c(_o16) { return String(_o16.effective_from || (_o16.month ? _o16.month + '-01' : '') || ''); }
function _o1(rows, projectId) {
var _o7 = null;
rows.forEach(function (_o16) {
if (!_o16 || _o16.deleted == 1 || String(_o16.project_id) !== String(projectId)) return;
if (_o16.status !== 'active') return;
if (!_o7 || _o1c(_o16) > _o1c(_o7) || (_o1c(_o16) === _o1c(_o7) && (_o16.updated_at || 0) > (_o7.updated_at || 0))) _o7 = _o16;
});
return _o7;
}
function _o11(project, policies, fallback) {
if (!project) return [];
var _o1i = null;
if (project.plans) _o1i = parsePlans(project.plans);
else if (Array.isArray(policies)) {
var _o1b = _o1(policies, project.id);
if (_o1b) _o1i = parsePlans(_o1b.plans);
else if (fallback) return _o11(project, fallback);
} else if (policies) _o1i = policies[project.id] || (project.pol ? policies[project.pol] : null);
return parsePlans(_o1i).map(normPlan);
}
function _o19(project, mo, H, HD) {
return mo === 'H' ? H : mo === 'HD' ? HD : mo === 'HD1' ? HD + 1 : mo === 'HD5' ? HD + 5 : (typeof mo === 'string' && /^HD\d+$/.test(mo)) ? HD + Number(mo.slice(2)) : (num(mo) || 0);
}
function _o14(ppm) { return ppm >= 1e5 ? ppm : ppm * 1e6; }
var pay = {
plans: _o11,
total: function (project, plan, area, pricePerM2) {
var ppm = num(pricePerM2);
if (isNaN(ppm)) ppm = project && project.price ? project.price[0] : NaN;
return num(area) * _o14(ppm) * normPlan(plan).factor;
},
schedule: function (project, plan, total, today) {
today = today || cfg.TODAY;
plan = normPlan(plan);
var _ou = ym(today), H = project.handover ? Math.max(6, ym(project.handover) - _ou) : 30, HD = project.hdmb || 3;
var _o5 = _ox(today);
return plan.steps.map(function (_o1j) {
var m = _o19(project, _o1j.mo, H, HD), due = addMonths(_o5, m);
return {
name: _o1j.name, pct: _o1j.pct, amount: total * _o1j.pct / 100, monthOffset: m,
dueYM: due.y + '-' + _ov(due.m), dueDate: _oy(due), when: _o1j.when, bank: !!_o1j.bank
};
});
},
stages: function (project, plan, total, today) {
var _o13 = pay.schedule(project, plan, total, today), own = _o13.filter(function (x) { return !x.bank; });
var first = own.filter(function (x) { return x.monthOffset === 0; }).reduce(function (a, x) { return a + x.amount; }, 0);
var _oh = {}, due = {};
own.filter(function (x) { return x.monthOffset > 0; }).forEach(function (x) { _oh[x.monthOffset] = (_oh[x.monthOffset] || 0) + x.amount; if (!due[x.monthOffset]) due[x.monthOffset] = x.dueYM; });
var later = Object.keys(_oh).map(Number).sort(function (a, _o4) { return a - _o4; }).map(function (m) {
return { m: m, amt: _oh[m], monthOffset: m, amount: _oh[m], dueYM: due[m] };
});
return { first: first, later: later, bank: _o13.filter(function (x) { return x.bank; }).reduce(function (a, x) { return a + x.amount; }, 0) };
},
fits: function (projects, policies, cap, today) {
var list = Array.isArray(projects) ? projects : [projects], out = [];
list.forEach(function (p) {
if (!p || p.status !== 'sale' || !p.price) return;
var _o12 = _o11(p, policies);
(p.types || []).forEach(function (t) {
if (t.ask) return;
var _o7 = null;
_o12.forEach(function (pl) {
var area = t.a[0], tot = area * p.price[0] * 1e6 * pl.factor, need = tot * (1 - pl.loan), sg = pay.stages(p, pl, tot, today);
if (sg.first <= cap && (!_o7 || pl.loan > _o7.pl.loan || (pl.loan === _o7.pl.loan && sg.first < _o7.first)))
_o7 = { pl: pl, tot: tot, need: need, first: sg.first, later: sg.later };
});
if (_o7) out.push({ p: p, t: t, pl: _o7.pl, tot: _o7.tot, need: _o7.need, first: _o7.first, later: _o7.later, projectId: p.id, typeName: t.n, planId: _o7.pl.id });
});
});
return out.sort(function (a, _o4) { return _o4.first - a.first; });
},
loanInfo: function (project, plan, loanAmount, today, opt) {
plan = normPlan(plan); opt = opt || {};
if (!plan.loan) return null;
var _ou = ym(today || cfg.TODAY), rate = num(opt.ratePct), years = num(opt.years);
if (isNaN(rate)) rate = cfg.RATE; if (isNaN(years)) years = cfg.LOAN_YEARS;
var disb = _ou + (project.pol === 'M' ? 4 : Math.min(10, project.handover ? Math.max(3, ym(project.handover) - _ou - 18) : 10));
var grace = plan.htls === 'HANDOVER' ? (project.handover ? Math.max(6, ym(project.handover) - disb) : 24) : (num(plan.htls) || 0);
var end = disb + grace, n = years * 12 - grace, _o16 = rate / 1200, P = loanAmount;
return {
grace: grace, disb: ymStr(disb), end: ymStr(end), start: ymStr(end + 1), ratePct: rate, years: years,
goc: P / n, lai: P * _o16, first: P / n + P * _o16, ann: _o16 ? (P * _o16) / (1 - Math.pow(1 + _o16, -n)) : P / n
};
}
};
function _o10(pl) { return String(pl && pl.name ? pl.name : (pl && pl.id) || '?').replace(/Thanh toán/g, 'TT'); }
var policy = {
validate: function (plans) {
var errors = [], warnings = [];
plans = parsePlans(plans);
if (!plans.length) { errors.push('Chưa có phương án thanh toán nào.'); return { ok: false, errors: errors, warnings: warnings }; }
var ids = {};
plans.forEach(function (raw, idx) {
var pl = normPlan(raw), who = pl && pl.name ? 'Phương án "' + pl.name + '"' : 'Phương án thứ ' + (idx + 1);
if (!pl || typeof pl !== 'object') { errors.push(who + ': dữ liệu không hợp lệ.'); return; }
if (!pl.id) errors.push(who + ': thiếu mã phương án (id).');
else if (ids[pl.id]) errors.push(who + ': trùng mã "' + pl.id + '" với phương án khác.');
else ids[pl.id] = 1;
if (!pl.name) errors.push(who + ': thiếu tên phương án.');
var _og = num(pl.factor);
if (isNaN(_og)) errors.push(who + ': thiếu hệ số giá (factor).');
else if (_og < 0.5 || _og > 1.2) errors.push(who + ': hệ số giá (factor) ' + String(_og).replace('.', ',') + ' nằm ngoài khoảng 0,5–1,2.');
var _on = pl.loan == null ? 0 : num(pl.loan);
if (isNaN(_on) || _on < 0 || _on > 0.85) errors.push(who + ': tỷ lệ vay ' + fmt.percent(_on) + ' phải trong khoảng 0–85%.');
if (!pl.steps.length) { errors.push(who + ': chưa có đợt thanh toán nào.'); return; }
var _o1l = 0, bankPct = 0, prev = -Infinity, missingMo = 0;
pl.steps.forEach(function (_o1j, _ol) {
var _o1n = who + ', đợt ' + (_ol + 1);
if (!_o1j || !_o1j.name) errors.push(_o1n + ': thiếu tên đợt.');
var p = num(_o1j && _o1j.pct);
if (isNaN(p)) errors.push(_o1n + ': thiếu tỷ lệ %.');
else if (p < 0 || p > 100) errors.push(_o1n + ': tỷ lệ ' + p + '% không hợp lệ.');
else { _o1l += p; if (_o1j.bank) bankPct += p; }
if (_o1j && _o1j.mo !== undefined && _o1j.mo !== null && _o1j.mo !== '') {
var m = _o1j.mo === 'H' ? 1e6 : _o19(null, _o1j.mo, 1e6, 3);
if (typeof _o1j.mo === 'string' && _o1j.mo !== 'H' && !/^HD\d*$/.test(_o1j.mo)) errors.push(_o1n + ': mốc thời gian "' + _o1j.mo + '" không hiểu được.');
else if (m < prev) errors.push(_o1n + ': mốc thời gian sớm hơn đợt trước (mốc phải tăng dần).');
prev = Math.max(prev, m);
} else missingMo++;
});
if (Math.abs(_o1l - 100) > 0.01) errors.push(who + ': tổng các đợt là ' + _oe(Math.round(_o1l * 1000) / 1000, 3) + '%, phải bằng 100%.');
if (missingMo) warnings.push(who + ': ' + missingMo + ' đợt chưa có mốc thời gian (tính như lúc ký).');
if (_on > 0 && !bankPct) warnings.push(who + ': có tỷ lệ vay nhưng chưa có đợt "ngân hàng giải ngân".');
if (!_on && bankPct) warnings.push(who + ': có đợt ngân hàng giải ngân nhưng tỷ lệ vay bằng 0.');
if (_on > 0 && bankPct && Math.abs(bankPct - _on * 100) > 1) warnings.push(who + ': đợt ngân hàng ' + bankPct + '% lệch tỷ lệ vay ' + fmt.percent(_on) + '.');
if (_on > 0 && pl.htls == null) warnings.push(who + ': chưa ghi thời gian hỗ trợ lãi suất.');
});
return { ok: !errors.length, errors: errors, warnings: warnings };
},
diff: function (oldPlans, newPlans) {
var a = parsePlans(oldPlans).map(normPlan), _o4 = parsePlans(newPlans).map(normPlan), out = [];
function push(path, label, o, n, show) { out.push({ path: path, label: label, old: o, new: n, text: label + ': ' + show(o) + ' → ' + show(n) }); }
var _oz = function (v) { return v == null ? '—' : fmt.percent(v); };
var _o1k = function (v) { return v == null ? '—' : _oe(Number(v), 3) + '%'; };
var _oj = function (v) { return v == null ? 'không' : v === 'HANDOVER' ? 'đến bàn giao' : v + ' tháng'; };
var _o1p = function (v) { return v == null || v === '' ? '—' : String(v); };
var _o9 = {};
a.forEach(function (p) { _o9[p.id] = p; });
var _o1f = {};
_o4.forEach(function (n) {
var o = _o9[n.id], L = _o10(n);
_o1f[n.id] = 1;
if (!o) { out.push({ path: n.id, label: 'Thêm phương án', old: null, new: n, text: 'Thêm phương án: ' + n.name }); return; }
if (o.name !== n.name) push(n.id + '.name', 'Tên phương án ' + _o10(o), o.name, n.name, _o1p);
if (o.sub !== n.sub) push(n.id + '.sub', 'Mô tả ' + L, o.sub, n.sub, _o1p);
if (o.factor !== n.factor) push(n.id + '.factor', 'Chiết khấu ' + L, o.factor, n.factor, function (_og) { return _og == null ? '—' : fmt.percent(1 - _og, 1); });
if ((o.loan || 0) !== (n.loan || 0)) push(n.id + '.loan', 'Tỷ lệ vay ' + L, o.loan || 0, n.loan || 0, _oz);
if (o.htls !== n.htls) push(n.id + '.htls', 'Hỗ trợ lãi ' + L, o.htls, n.htls, _oj);
var _oo = Math.max(o.steps.length, n.steps.length);
for (var _ol = 0; _ol < _oo; _ol++) {
var _o1h = o.steps[_ol], sn = n.steps[_ol], _o5 = n.id + '.steps.' + _ol;
if (!_o1h) { out.push({ path: _o5, label: L + ' – thêm đợt', old: null, new: sn, text: L + ' – thêm đợt: ' + sn.name + ' (' + _o1k(sn.pct) + ')' }); continue; }
if (!sn) { out.push({ path: _o5, label: L + ' – bỏ đợt', old: _o1h, new: null, text: L + ' – bỏ đợt: ' + _o1h.name + ' (' + _o1k(_o1h.pct) + ')' }); continue; }
var SL = L + ' – ' + sn.name;
if (_o1h.name !== sn.name) push(_o5 + '.name', L + ' – tên đợt ' + (_ol + 1), _o1h.name, sn.name, _o1p);
if (_o1h.pct !== sn.pct) push(_o5 + '.pct', SL, _o1h.pct, sn.pct, _o1k);
if (_o1h.when !== sn.when) push(_o5 + '.when', SL + ' (thời điểm)', _o1h.when, sn.when, function (v) { return v === 'HANDOVER' ? 'khi bàn giao' : _o1p(v); });
if (String(_o1h.mo) !== String(sn.mo)) push(_o5 + '.mo', SL + ' (mốc tháng)', _o1h.mo, sn.mo, function (v) { return v === 'H' ? 'bàn giao' : _o1p(v); });
if (!!_o1h.bank !== !!sn.bank) push(_o5 + '.bank', SL + ' (ngân hàng trả)', !!_o1h.bank, !!sn.bank, function (v) { return v ? 'có' : 'không'; });
}
});
a.forEach(function (o) { if (!_o1f[o.id]) out.push({ path: o.id, label: 'Bỏ phương án', old: o, new: null, text: 'Bỏ phương án: ' + o.name }); });
return out;
},
isStale: function (pol, todayISO, days) {
if (days == null) days = 30;
if (!pol) return true;
var d = pol.effective_from ? isoToMs(pol.effective_from) : pol.month ? isoToMs(pol.month + '-01') : num(pol.approved_at);
if (isNaN(d)) return true;
return (isoToMs(todayISO) - d) / DAY > days;
}
};
function _o18(objectId, kind, title, dueAt, beforeDays, extra) {
var _o16 = { object_id: objectId, kind: kind, title: title, due_at: dueAt, remind_before_days: beforeDays, amount: 0, installment: 0, done: 0, notified_at: 0, deleted: 0, data: '{}' };
if (extra) for (var _om in extra) if (Object.prototype.hasOwnProperty.call(extra, _om)) _o16[_om] = extra[_om];
return _o16;
}
var _o0 = ['Đã mua', 'Đã thuê', 'Đã bán', 'Đã cho thuê', 'Tạm dừng', 'Không tiềm năng', 'Dừng bán', 'Dừng cho thuê'];
function followupInfo(customer, events, nowMs, rules) {
var R = { 'new': 0, caring: 3, 'default': 7 }, _om;
if (rules) for (_om in rules) if (Object.prototype.hasOwnProperty.call(rules, _om)) R[_om] = rules[_om];
if (!customer || customer.deleted == 1 || _o0.indexOf(customer.status) >= 0) return { due: false, threshold: null, daysSince: null, lastAt: null, nextAt: null };
var _o1j = customer.status || 'Mới';
var threshold = R[_o1j] != null ? R[_o1j] : _o1j === 'Mới' ? R['new'] : _o1j === 'Đang chăm sóc' ? R.caring : R['default'];
var last = num(customer.created_at) || 0;
(events || []).forEach(function (e) {
if (!e || e.deleted == 1 || String(e.object_id) !== String(customer.id)) return;
var at = num(e.at); if (!isNaN(at) && at > last) last = at;
});
var daysSince = (vnDayStart(nowMs) - vnDayStart(last)) / DAY;
return { due: daysSince >= threshold, threshold: threshold, daysSince: daysSince, lastAt: last, nextAt: vnDayStart(last) + threshold * DAY };
}
var remind = {
fromSchedule: function (o) {
var before = o.beforeDays == null ? 7 : o.beforeDays, _om = 0;
return (o.schedule || []).filter(function (x) { return !x.bank; }).map(function (x) {
_om++;
var due = x.dueDate ? isoToMs(x.dueDate) : isoToMs(x.dueYM);
return _o18(o.customerId, 'payment', 'Đợt ' + _om + ' – ' + fmt.money(x.amount), due, before, {
amount: Math.round(x.amount), installment: _om,
data: JSON.stringify({ name: x.name, pct: x.pct, dueYM: x.dueYM, monthOffset: x.monthOffset, when: x.when })
});
});
},
standard: function (o) {
var _oa = o.customer || {}, before = o.beforeDays == null ? 7 : o.beforeDays, out = [], name = _oa.name ? ' ' + _oa.name : '';
if (o.handoverDate) out.push(_o18(_oa.id, 'handover', 'Bàn giao nhà' + name, isoToMs(o.handoverDate), before, { data: JSON.stringify({ handover: o.handoverDate }) }));
var _o6 = o.birthday || _oa.birthday;
if (_o6) {
var _o4 = _ox(_o6), ref = o.today ? _ox(o.today) : (o.purchaseDate ? _ox(o.purchaseDate) : _o4), y = ref.y;
var _od = function (yy) { return Math.min(_o4.d, _oc(yy, _o4.m)); };
if (_o4.m < ref.m || (_o4.m === ref.m && _od(y) < ref.d)) y++;
out.push(_o18(_oa.id, 'birthday', 'Sinh nhật' + name, _o1r(y, _o4.m, _od(y)), before, { data: JSON.stringify({ birthday: _o6, repeat: 'yearly' }) }));
}
if (o.purchaseDate) {
var _o16 = addMonths(_ox(o.purchaseDate), 6);
out.push(_o18(_oa.id, 'referral', 'Hỏi giới thiệu khách mới' + name, _o1r(_o16.y, _o16.m, _o16.d), before, { data: JSON.stringify({ purchaseDate: o.purchaseDate }) }));
}
return out;
},
due: function (reminders, nowMs) {
var _of = vnDayStart(nowMs), res = { overdue: [], today: [], soon: [] };
(reminders || []).forEach(function (_o16) {
if (!_o16 || _o16.done == 1 || _o16.deleted == 1) return;
var t = num(_o16.due_at); if (isNaN(t)) return;
if (t < _of) res.overdue.push(_o16);
else if (t < _of + DAY) res.today.push(_o16);
else if (t < _of + 8 * DAY) res.soon.push(_o16);
});
var _o8 = function (x, y) { return x.due_at - y.due_at; };
res.overdue.sort(_o8); res.today.sort(_o8); res.soon.sort(_o8);
return res;
},
followupDue: function (customer, events, nowMs, rules) { return followupInfo(customer, events, nowMs, rules).due; },
followupInfo: followupInfo
};
var text = {
normalize: function (_o1d) {
if (_o1d == null) return '';
return String(_o1d).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim();
}
};
var status = {
lists: {
mua: ['Mới', 'Đã liên hệ', 'Đang chăm sóc', 'Hẹn xem nhà', 'Đang đàm phán', 'Đã đặt cọc', 'Đã mua', 'Tạm dừng', 'Không tiềm năng'],
thue: ['Mới', 'Đã liên hệ', 'Đang chăm sóc', 'Hẹn xem nhà', 'Đã thuê', 'Tạm dừng', 'Không tiềm năng'],
ban: ['Mới', 'Đã liên hệ', 'Đã xác minh', 'Đang chào bán', 'Có khách hỏi', 'Đã bán', 'Dừng bán'],
chothue: ['Mới', 'Đã liên hệ', 'Đã xác minh', 'Đang chào thuê', 'Có khách xem', 'Đã cho thuê', 'Dừng cho thuê']
},
group: function (need) {
var n = text.normalize(need).replace(/[^a-z]/g, '');
if (n.indexOf('chothue') >= 0) return 'chothue';
if (n.indexOf('thue') >= 0) return 'thue';
if (n.indexOf('ban') >= 0) return 'ban';
return 'mua';
}
};
function _o15(_o1d) { var p = _ox(_o1d); return 'Quý ' + Math.ceil(p.m / 3) + '/' + p.y; }
var quote = {
build: function (o) {
var p = o.project;
if (!p) throw new Error('Thiếu dự án.');
var _o12 = _o11(p, o.policies, o.fallbackPolicies), plan = null;
_o12.forEach(function (x) { if (x.id === o.planId) plan = x; });
if (!plan) throw new Error('Không tìm thấy phương án "' + o.planId + '" của dự án ' + p.name + '.');
var _o1q = null;
(p.types || []).forEach(function (t) { if (t.n === o.unitType) _o1q = t; });
var area = num(o.area);
if (!(area > 0) && _o1q && _o1q.a) area = (_o1q.a[0] + _o1q.a[1]) / 2;
if (!(area > 0)) throw new Error('Thiếu diện tích căn.');
var ppm = num(o.pricePerM2);
if (isNaN(ppm)) ppm = p.price ? p.price[0] : NaN;
if (isNaN(ppm)) throw new Error('Dự án chưa có giá tham khảo.');
var today = o.today || cfg.TODAY;
var listPrice = area * _o14(ppm), total = listPrice * plan.factor;
var _o17 = p.price ? [area * p.price[0] * 1e6 * plan.factor, area * p.price[1] * 1e6 * plan.factor] : [total, total];
var loanAmount = total * (plan.loan || 0), own = total - loanAmount;
var _o1e = pay.schedule(p, plan, total, today), sg = pay.stages(p, plan, total, today);
var _oq = o.loan || {}, monthly = null;
if (plan.loan) {
var _op = pay.loanInfo(p, plan, loanAmount, today, _oq);
var _o2 = loan.monthly({ principal: loanAmount, ratePct: _op.ratePct, years: _op.years, graceMonths: _op.grace, supportMonths: _op.grace, method: 'declining' });
monthly = {
grace: _op.grace, disb: _op.disb, end: _op.end, start: _op.start, ratePct: _op.ratePct, years: _op.years,
first: _op.first, goc: _op.goc, lai: _op.lai, ann: _op.ann, last: _o2.last, totalInterest: _o2.totalInterest
};
}
return {
project: { id: p.id, name: p.name, dev: p.dev, loc: p.loc, img: p.img || '' },
unitType: o.unitType || '', area: area, pricePerM2: ppm,
plan: { id: plan.id, name: plan.name, sub: plan.sub || '', factor: plan.factor, loan: plan.loan || 0, htls: plan.htls == null ? null : plan.htls },
today: today,
handover: p.handover || null,
handoverLabel: p.handover ? _o15(p.handover) : 'Theo thông báo CĐT',
listPrice: listPrice, total: total, totalRange: _o17,
own: own, loanAmount: loanAmount,
schedule: _o1e, stages: sg, monthly: monthly,
text: {
total: fmt.money(total), own: fmt.money(own), loan: fmt.money(loanAmount), listPrice: fmt.money(listPrice),
first: fmt.money(sg.first), monthlyFirst: monthly ? fmt.money(monthly.first) : ''
},
note: 'Giá tham khảo, chưa phải báo giá chính thức của chủ đầu tư. Chính sách, tiến độ thanh toán và lãi suất có thể thay đổi theo từng thời điểm.'
};
}
};
var ids = {
'new': function (nowMs, rand) {
var _o16 = typeof rand === 'function' ? rand : Math.random, _o1d = '';
for (var _ok = 0; _ok < 8; _ok++) _o1d += Math.floor(_o16() * 36).toString(36);
return Number(nowMs).toString(36) + _o1d;
}
};
return {
version: '1.0.0', cfg: cfg,
fmt: fmt, link: link, loan: loan, pay: pay, policy: policy, remind: remind, status: status, quote: quote, ids: ids, text: text,
time: { ym: ym, ymStr: ymStr, isoToMs: isoToMs, vnDayStart: vnDayStart, addMonths: addMonths, VN_OFFSET: VN_OFFSET, DAY: DAY },
normPlan: normPlan
};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BDSLogic;
if (typeof window !== 'undefined') window.BDSLogic = BDSLogic;
