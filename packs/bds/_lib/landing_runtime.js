export function lpClean(s, _ok) {
return String(s == null ? '' : s).replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, _ok || 100);
}
export function lpPhone(raw) {
var s = String(raw == null ? '' : raw).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3);
else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
return /^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s) ? s : '';
}
export function lpAttr(search, stored, href, _oc) {
var _of = ['v', 's', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
var _o7 = function (x, _ok) { return String(x == null ? '' : x).replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, _ok || 100); };
var now = {}, any = false, i, _oe;
var _on = String(search || '').replace(/^[?#]/, '').split('&');
for (i = 0; i < _on.length; i++) {
var kv = _on[i].split('='), key = kv[0], val = kv.slice(1).join('=');
if (_of.indexOf(key) < 0) continue;
try { val = decodeURIComponent(val.replace(/\+/g, ' ')); } catch (e) { }
val = _o7(val, 100);
if (val) { now[key] = val; any = true; }
}
if (_oc && typeof _oc === 'object') {
for (i = 0; i < _of.length; i++) { _oe = _of[i]; var _od = _o7(_oc[_oe], 100); if (_od) { now[_oe] = _od; any = true; } }
}
if (any) {
now.landing_url = _o7(href, 500);
if (!/^https?:\/\//i.test(now.landing_url)) delete now.landing_url;
return { attr: now, changed: true };
}
var _ol = {};
if (stored && typeof stored === 'object') {
for (i = 0; i < _of.length; i++) { _oe = _of[i]; var _oq = _o7(stored[_oe], 100); if (_oq) _ol[_oe] = _oq; }
var _op = _o7(stored.landing_url, 500);
if (/^https?:\/\//i.test(_op)) _ol.landing_url = _op;
}
return { attr: _ol, changed: false };
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
var _o7 = function (x, _ok) { return String(x == null ? '' : x).replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, _ok || 100); };
var s = String(f.phone == null ? '' : f.phone).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
var _om = {
landing_id: _o7(cfg.landing_id, 64), slug: _o7(cfg.slug, 64), lead_id: _o7(leadId, 64),
name: _o7(f.name, 120), phone: s, consent: f.consent ? 1 : 0,
pref: _o7(f.pref, 40), interest: _o7(f.interest, 80), interest_kind: _o7(f.interest_kind, 10), people: _o7(f.people, 10),
want: _o7(f.want, 160), project: _o7(cfg.project, 120), template: _o7(cfg.template, 20),
page_url: _o7(attr.landing_url || href, 500), hp: _o7(f.website, 50)
};
var _of = ['v', 's', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
for (var i = 0; i < _of.length; i++) if (attr[_of[i]]) _om[_of[i]] = _o7(attr[_of[i]], 100);
if (cfg.preview) _om.test = 1;
for (var _oe in _om) if (_om[_oe] === '' || _om[_oe] === undefined) delete _om[_oe];
return _om;
}
export function lpMoney(_ok) {
_ok = Number(_ok) || 0;
var _oo = _ok < 0 ? '-' : '', _o2 = Math.abs(_ok);
if (_o2 < 1e9) return _oo + Math.round(_o2 / 1e6) + ' triệu';
return _oo + (_o2 / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
}
export function lpLoan(price, ltv, rate, years) {
var P = Math.max(0, Number(price) || 0) * Math.min(Math.max(Number(ltv) || 0, 0), 100) / 100;
var _ok = Math.max(1, Math.round((Number(years) || 0) * 12)), r = (Number(rate) || 0) / 1200;
var firstEqual = P / _ok + P * r;
var annuity = r ? P * r / (1 - Math.pow(1 + r, -_ok)) : P / _ok;
var interestEqual = P * r * (_ok + 1) / 2;
return { loan: Math.round(P), months: _ok, firstEqual: Math.round(firstEqual), annuity: Math.round(annuity), interestEqual: Math.round(interestEqual), own: Math.round(Math.max(0, Number(price) || 0) - P) };
}
export function lpCountdown(target, now) {
var _oi = Number(target) - Number(now);
if (!isFinite(_oi)) return null;
if (_oi <= 0) return { d: 0, h: 0, m: 0, past: true };
var m = Math.floor(_oi / 60000);
return { d: Math.floor(m / 1440), h: Math.floor((m % 1440) / 60), m: m % 60, past: false };
}
export function lpBoot(win, doc, cfg, hooks) {
cfg = cfg || {}; hooks = hooks || {};
var _o0 = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
var _oh = function (_ok) { var m = doc.querySelector('meta[name="' + _ok + '"]'); return m ? m.getAttribute('content') || '' : ''; };
var _oc = null;
try { _oc = JSON.parse(_oh('lp-qs') || 'null'); } catch (e) { _oc = null; }
var href = _oh('lp-url') || (win.location ? String(win.location.href) : '');
var _o1 = 'lp_attr_' + (cfg.slug || 'trang');
var stored = null;
try { stored = JSON.parse(win.sessionStorage.getItem(_o1) || 'null'); } catch (e) { stored = null; }
var A = lpAttr(win.location ? win.location.search : '', stored, href, _oc);
if (A.changed) { try { win.sessionStorage.setItem(_o1, JSON.stringify(A.attr)); } catch (e) { } }
var attr = A.attr;
var track = function (fb, tt, ga) {
try { if (fb && typeof win.fbq === 'function') win.fbq('track', fb); } catch (e) { }
try { if (tt && win.ttq && typeof win.ttq.track === 'function') win.ttq.track(tt); } catch (e) { }
try { if (ga && typeof win.gtag === 'function') win.gtag('event', ga); } catch (e) { }
};
var send = function (_om) {
if (typeof hooks.send === 'function') return Promise.resolve(hooks.send(_om));
if (!cfg.server) return Promise.reject(new Error('Bản nháp: chưa nối máy chủ'));
return win.fetch(cfg.server, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'landing.lead', payload: _om }), credentials: 'omit', redirect: 'follow' })
.then(function (r) { return r.json(); })
.then(function (j) { if (!j || !j.ok) throw new Error((j && j.error && j.error.message) || 'Lỗi'); return j.data; });
};
var _og = null;
try { _og = JSON.parse(win.localStorage.getItem('lp_me') || 'null'); } catch (e) { _og = null; }
_o0('form[data-lp-form]').forEach(function (form, idx) {
var _on = function (_ok) { return form.querySelector('[name="' + _ok + '"]'); };
if (_og && _on('name') && !_on('name').value) _on('name').value = _og.name || '';
if (_og && _on('phone') && !_on('phone').value) _on('phone').value = _og.phone || '';
var leadId = 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + idx;
var _ob = form.querySelector('.lp-err');
var _o4 = form.querySelector('button[type="submit"]');
form.addEventListener('submit', function (ev) {
ev.preventDefault();
var pref = form.querySelector('input[name="pref"]:checked');
var interest = _on('interest');
var f = {
name: _on('name') ? _on('name').value : '', phone: _on('phone') ? _on('phone').value : '',
consent: _on('consent') ? _on('consent').checked : false, website: _on('website') ? _on('website').value : '',
pref: pref ? pref.value : '', interest: interest ? interest.value : '', interest_kind: interest ? interest.getAttribute('data-kind') || '' : '',
people: _on('people') ? _on('people').value : '', want: form.getAttribute('data-want') || ''
};
if (f.website) return;
var _oj = lpValidate(f);
if (_ob) _ob.textContent = _oj;
if (_oj) return;
var label = _o4 ? _o4.textContent : '';
if (_o4) { _o4.disabled = true; _o4.textContent = 'Đang gửi…'; }
send(lpPayload(cfg, f, attr, leadId, href)).then(function () {
try { win.localStorage.setItem('lp_me', JSON.stringify({ name: String(f.name).trim().slice(0, 120), phone: String(f.phone).trim().slice(0, 20) })); } catch (e) { }
track('Lead', 'SubmitForm', 'generate_lead');
var _o9 = doc.createElement('div');
_o9.className = 'lp-done';
_o9.setAttribute('role', 'status');
var h = doc.createElement('p'); h.className = 'lp-done-h'; h.textContent = 'Đã nhận thông tin ✅';
var t = doc.createElement('p'); t.textContent = form.getAttribute('data-thanks') || 'Chuyên viên sẽ liên hệ anh/chị trong ít phút.';
_o9.appendChild(h); _o9.appendChild(t);
var _o8 = form.getAttribute('data-doc-url');
if (_o8 && /^https:\/\//i.test(_o8)) {
var _o2 = doc.createElement('a'); _o2.className = 'lp-btn lp-btn-2'; _o2.href = _o8; _o2.target = '_blank'; _o2.rel = 'noopener'; _o2.textContent = 'Mở tài liệu';
_o9.appendChild(_o2);
}
form.parentNode.replaceChild(_o9, form);
}).catch(function (e) {
if (_o4) { _o4.disabled = false; _o4.textContent = label; }
if (_ob) _ob.textContent = /nháp/i.test(String(e && e.message)) ? 'Bản nháp: trang chưa nối máy chủ nên chưa lưu được thông tin.' : 'Chưa gửi được. Anh/chị bấm Gọi/Zalo ở cuối trang hoặc thử lại.';
});
});
});
_o0('[data-lp-loan]').forEach(function (box) {
var _os = function (_ok) { var _oa = box.querySelector('[name="' + _ok + '"]'); return _oa ? Number(String(_oa.value).replace(',', '.')) : 0; };
var _ol = function (_ok, text) { var _oa = box.querySelector('[data-out="' + _ok + '"]'); if (_oa) _oa.textContent = text; };
var _o6 = function () {
var R = lpLoan(_os('price') * 1e9, _os('ltv'), _os('rate'), _os('years'));
_ol('loan', lpMoney(R.loan)); _ol('own', lpMoney(R.own));
_ol('first', lpMoney(R.firstEqual) + '/tháng'); _ol('annuity', lpMoney(R.annuity) + '/tháng');
};
box.addEventListener('input', _o6);
_o6();
});
_o0('[data-lp-countdown]').forEach(function (_oa) {
var _o3 = Number(_oa.getAttribute('data-at'));
var _or = function () {
var _o5 = lpCountdown(_o3, Date.now());
if (!_o5) return;
_oa.textContent = _o5.past ? 'Sự kiện đã diễn ra' : 'Còn ' + _o5.d + ' ngày ' + _o5.h + ' giờ ' + _o5.m + ' phút';
};
_or();
if (!hooks.preview) win.setInterval(_or, 30000);
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
