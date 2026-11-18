export function lpClean(s, _oj) {
return String(s == null ? '' : s).replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, _oj || 100);
}
export function lpPhone(raw) {
var s = String(raw == null ? '' : raw).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3);
else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
return /^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s) ? s : '';
}
export function lpAttr(search, stored, href, _ob) {
var _oe = ['v', 's', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
var _o6 = function (x, _oj) { return String(x == null ? '' : x).replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, _oj || 100); };
var now = {}, any = false, i, _od;
var _om = String(search || '').replace(/^[?#]/, '').split('&');
for (i = 0; i < _om.length; i++) {
var kv = _om[i].split('='), key = kv[0], val = kv.slice(1).join('=');
if (_oe.indexOf(key) < 0) continue;
try { val = decodeURIComponent(val.replace(/\+/g, ' ')); } catch (e) { }
val = _o6(val, 100);
if (val) { now[key] = val; any = true; }
}
if (_ob && typeof _ob === 'object') {
for (i = 0; i < _oe.length; i++) { _od = _oe[i]; var _oc = _o6(_ob[_od], 100); if (_oc) { now[_od] = _oc; any = true; } }
}
if (any) {
now.landing_url = _o6(href, 500);
if (!/^https?:\/\//i.test(now.landing_url)) delete now.landing_url;
return { attr: now, changed: true };
}
var _ok = {};
if (stored && typeof stored === 'object') {
for (i = 0; i < _oe.length; i++) { _od = _oe[i]; var _op = _o6(stored[_od], 100); if (_op) _ok[_od] = _op; }
var _oo = _o6(stored.landing_url, 500);
if (/^https?:\/\//i.test(_oo)) _ok.landing_url = _oo;
}
return { attr: _ok, changed: false };
}
export function lpValidate(f) {
f = f || {};
var name = String(f.name || '').trim();
if (name.length < 2) return 'Anh/chị nhập giúp họ tên.';
var s = String(f.phone == null ? '' : f.phone).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
if (!(/^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s))) return 'Số điện thoại chưa đúng (10 số, ví dụ 0912 345 678).';
if (!f.consent) return 'Anh/chị tick ô đồng ý để chuyên viên được liên hệ.';
return '';
}
export function lpPayload(cfg, f, attr, leadId, href) {
cfg = cfg || {}; f = f || {}; attr = attr || {};
var _o6 = function (x, _oj) { return String(x == null ? '' : x).replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, _oj || 100); };
var s = String(f.phone == null ? '' : f.phone).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
var _ol = {
landing_id: _o6(cfg.landing_id, 64), slug: _o6(cfg.slug, 64), lead_id: _o6(leadId, 64),
name: _o6(f.name, 120), phone: s, consent: f.consent ? 1 : 0,
pref: _o6(f.pref, 40), interest: _o6(f.interest, 80), interest_kind: _o6(f.interest_kind, 10), people: _o6(f.people, 10),
want: _o6(f.want, 160), project: _o6(cfg.project, 120), template: _o6(cfg.template, 20),
page_url: _o6(attr.landing_url || href, 500), hp: _o6(f.website, 50)
};
var _oe = ['v', 's', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
for (var i = 0; i < _oe.length; i++) if (attr[_oe[i]]) _ol[_oe[i]] = _o6(attr[_oe[i]], 100);
if (cfg.preview) _ol.test = 1;
for (var _od in _ol) if (_ol[_od] === '' || _ol[_od] === undefined) delete _ol[_od];
return _ol;
}
export function lpMoney(_oj) {
_oj = Number(_oj) || 0;
var _on = _oj < 0 ? '-' : '', _o2 = Math.abs(_oj);
if (_o2 < 1e9) return _on + Math.round(_o2 / 1e6) + ' triệu';
return _on + (_o2 / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
}
export function lpLoan(price, ltv, rate, years) {
var P = Math.max(0, Number(price) || 0) * Math.min(Math.max(Number(ltv) || 0, 0), 100) / 100;
var _oj = Math.max(1, Math.round((Number(years) || 0) * 12)), r = (Number(rate) || 0) / 1200;
var firstEqual = P / _oj + P * r;
var annuity = r ? P * r / (1 - Math.pow(1 + r, -_oj)) : P / _oj;
var interestEqual = P * r * (_oj + 1) / 2;
return { loan: Math.round(P), months: _oj, firstEqual: Math.round(firstEqual), annuity: Math.round(annuity), interestEqual: Math.round(interestEqual), own: Math.round(Math.max(0, Number(price) || 0) - P) };
}
export function lpCountdown(target, now) {
var _oh = Number(target) - Number(now);
if (!isFinite(_oh)) return null;
if (_oh <= 0) return { d: 0, h: 0, m: 0, past: true };
var m = Math.floor(_oh / 60000);
return { d: Math.floor(m / 1440), h: Math.floor((m % 1440) / 60), m: m % 60, past: false };
}
export function lpBoot(win, doc, cfg, hooks) {
cfg = cfg || {}; hooks = hooks || {};
var _o0 = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
var _og = function (_oj) { var m = doc.querySelector('meta[name="' + _oj + '"]'); return m ? m.getAttribute('content') || '' : ''; };
var _ob = null;
try { _ob = JSON.parse(_og('lp-qs') || 'null'); } catch (e) { _ob = null; }
var href = _og('lp-url') || (win.location ? String(win.location.href) : '');
var _o1 = 'lp_attr_' + (cfg.slug || 'trang');
var stored = null;
try { stored = JSON.parse(win.sessionStorage.getItem(_o1) || 'null'); } catch (e) { stored = null; }
var A = lpAttr(win.location ? win.location.search : '', stored, href, _ob);
if (A.changed) { try { win.sessionStorage.setItem(_o1, JSON.stringify(A.attr)); } catch (e) { } }
var attr = A.attr;
var track = function (fb, tt, ga) {
try { if (fb && typeof win.fbq === 'function') win.fbq('track', fb); } catch (e) { }
try { if (tt && win.ttq && typeof win.ttq.track === 'function') win.ttq.track(tt); } catch (e) { }
try { if (ga && typeof win.gtag === 'function') win.gtag('event', ga); } catch (e) { }
};
var send = function (_ol) {
if (typeof hooks.send === 'function') return Promise.resolve(hooks.send(_ol));
if (!cfg.server) return Promise.reject(new Error('Bản nháp: chưa nối máy chủ'));
return win.fetch(cfg.server, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'landing.lead', payload: _ol }), credentials: 'omit', redirect: 'follow' })
.then(function (r) { return r.json(); })
.then(function (j) { if (!j || !j.ok) throw new Error((j && j.error && j.error.message) || 'Lỗi'); return j.data; });
};
var _of = null;
try { _of = JSON.parse(win.localStorage.getItem('lp_me') || 'null'); } catch (e) { _of = null; }
_o0('form[data-lp-form]').forEach(function (form, idx) {
var _om = function (_oj) { return form.querySelector('[name="' + _oj + '"]'); };
if (_of && _om('name') && !_om('name').value) _om('name').value = _of.name || '';
if (_of && _om('phone') && !_om('phone').value) _om('phone').value = _of.phone || '';
var leadId = 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + idx;
var _oa = form.querySelector('.lp-err');
var _o3 = form.querySelector('button[type="submit"]');
form.addEventListener('submit', function (ev) {
ev.preventDefault();
var pref = form.querySelector('input[name="pref"]:checked');
var interest = _om('interest');
var f = {
name: _om('name') ? _om('name').value : '', phone: _om('phone') ? _om('phone').value : '',
consent: _om('consent') ? _om('consent').checked : false, website: _om('website') ? _om('website').value : '',
pref: pref ? pref.value : '', interest: interest ? interest.value : '', interest_kind: interest ? interest.getAttribute('data-kind') || '' : '',
people: _om('people') ? _om('people').value : '', want: form.getAttribute('data-want') || ''
};
if (f.website) return;
var _oi = lpValidate(f);
if (_oa) _oa.textContent = _oi;
if (_oi) return;
var label = _o3 ? _o3.textContent : '';
if (_o3) { _o3.disabled = true; _o3.textContent = 'Đang gửi…'; }
send(lpPayload(cfg, f, attr, leadId, href)).then(function () {
try { win.localStorage.setItem('lp_me', JSON.stringify({ name: String(f.name).trim().slice(0, 120), phone: String(f.phone).trim().slice(0, 20) })); } catch (e) { }
track('Lead', 'SubmitForm', 'generate_lead');
var _o8 = doc.createElement('div');
_o8.className = 'lp-done';
_o8.setAttribute('role', 'status');
var h = doc.createElement('p'); h.className = 'lp-done-h'; h.textContent = 'Đã nhận thông tin ✅';
var t = doc.createElement('p'); t.textContent = form.getAttribute('data-thanks') || 'Chuyên viên sẽ liên hệ anh/chị trong ít phút.';
_o8.appendChild(h); _o8.appendChild(t);
var _o7 = form.getAttribute('data-doc-url');
if (_o7 && /^https:\/\//i.test(_o7)) {
var _o2 = doc.createElement('a'); _o2.className = 'lp-btn lp-btn-2'; _o2.href = _o7; _o2.target = '_blank'; _o2.rel = 'noopener'; _o2.textContent = 'Mở tài liệu';
_o8.appendChild(_o2);
}
form.parentNode.replaceChild(_o8, form);
}).catch(function (e) {
if (_o3) { _o3.disabled = false; _o3.textContent = label; }
if (_oa) _oa.textContent = /nháp/i.test(String(e && e.message)) ? 'Bản nháp: trang chưa nối máy chủ nên chưa lưu được thông tin.' : 'Chưa gửi được. Anh/chị bấm Gọi/Zalo ở cuối trang hoặc thử lại.';
});
});
});
_o0('[data-lp-loan]').forEach(function (box) {
var _or = function (_oj) { var _o9 = box.querySelector('[name="' + _oj + '"]'); return _o9 ? Number(String(_o9.value).replace(',', '.')) : 0; };
var _ok = function (_oj, text) { var _o9 = box.querySelector('[data-out="' + _oj + '"]'); if (_o9) _o9.textContent = text; };
var _o5 = function () {
var R = lpLoan(_or('price') * 1e9, _or('ltv'), _or('rate'), _or('years'));
_ok('loan', lpMoney(R.loan)); _ok('own', lpMoney(R.own));
_ok('first', lpMoney(R.firstEqual) + '/tháng'); _ok('annuity', lpMoney(R.annuity) + '/tháng');
};
box.addEventListener('input', _o5);
_o5();
});
_o0('[data-lp-countdown]').forEach(function (_o9) {
var at = Number(_o9.getAttribute('data-at'));
var _oq = function () {
var _o4 = lpCountdown(at, Date.now());
if (!_o4) return;
_o9.textContent = _o4.past ? 'Sự kiện đã diễn ra' : 'Còn ' + _o4.d + ' ngày ' + _o4.h + ' giờ ' + _o4.m + ' phút';
};
_oq();
if (!hooks.preview) win.setInterval(_oq, 30000);
});
doc.addEventListener('click', function (e) {
var _o2 = e.target && e.target.closest ? e.target.closest('a[href^="tel:"],a[href*="zalo.me"]') : null;
if (!_o2) return;
track('Contact', 'Contact', _o2.href.indexOf('tel:') === 0 ? 'click_call' : 'click_zalo');
if (hooks.preview) { e.preventDefault(); if (typeof hooks.notify === 'function') hooks.notify(_o2.href.indexOf('tel:') === 0 ? 'Trang thật: khách bấm là gọi ' + _o2.href.slice(4) : 'Trang thật: khách bấm là mở Zalo'); }
}, true);
if (hooks.preview) {
doc.addEventListener('click', function (e) {
var _o2 = e.target && e.target.closest ? e.target.closest('a[href]') : null;
if (_o2 && !/^#/.test(_o2.getAttribute('href') || '')) { e.preventDefault(); }
});
}
return { attr: attr };
}
export const RUNTIME_FNS = [lpClean, lpPhone, lpAttr, lpValidate, lpPayload, lpMoney, lpLoan, lpCountdown, lpBoot];
export function pageScript() {
return '(function(){"use strict";\n' + RUNTIME_FNS.map((f) => f.toString()).join('\n') +
'\nvar c=document.getElementById("lp-cfg"),cfg={};try{cfg=JSON.parse(c.textContent)}catch(e){}\nlpBoot(window,document,cfg,{});\n})();';
}
