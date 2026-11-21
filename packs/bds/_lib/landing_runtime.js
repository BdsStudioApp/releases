export function lpClean(s, _oo) {
return String(s == null ? '' : s).replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, _oo || 100);
}
export function lpPhone(raw) {
var s = String(raw == null ? '' : raw).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3);
else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
return /^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s) ? s : '';
}
export function lpAttr(search, stored, href, _oe) {
var _oi = ['v', 's', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
var _o8 = function (_o13, _oo) { return String(_o13 == null ? '' : _o13).replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, _oo || 100); };
var now = {}, any = false, i, k;
var _os = String(search || '').replace(/^[?#]/, '').split('&');
for (i = 0; i < _os.length; i++) {
var kv = _os[i].split('='), key = kv[0], val = kv.slice(1).join('=');
if (_oi.indexOf(key) < 0) continue;
try { val = decodeURIComponent(val.replace(/\+/g, ' ')); } catch (e) { }
val = _o8(val, 100);
if (val) { now[key] = val; any = true; }
}
if (_oe && typeof _oe === 'object') {
for (i = 0; i < _oi.length; i++) { k = _oi[i]; var _of = _o8(_oe[k], 100); if (_of) { now[k] = _of; any = true; } }
}
if (any) {
now.landing_url = _o8(href, 500);
if (!/^https?:\/\//i.test(now.landing_url)) delete now.landing_url;
return { attr: now, changed: true };
}
var _oq = {};
if (stored && typeof stored === 'object') {
for (i = 0; i < _oi.length; i++) { k = _oi[i]; var _ox = _o8(stored[k], 100); if (_ox) _oq[k] = _ox; }
var _ow = _o8(stored.landing_url, 500);
if (/^https?:\/\//i.test(_ow)) _oq.landing_url = _ow;
}
return { attr: _oq, changed: false };
}
export function lpValidate(f) {
f = f || {};
var name = String(f.name || '').trim();
if (name.length < 2 && !(f.nameOpt && !name)) return 'Anh/chị nhập giúp họ tên.';
var s = String(f.phone == null ? '' : f.phone).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
if (!(/^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s))) return 'Số điện thoại chưa đúng (10 số, ví dụ 0912 345 678).';
if (!f.consent) return 'Anh/chị tick ô đồng ý để chuyên viên được liên hệ.';
return '';
}
export function lpPayload(cfg, f, attr, leadId, href) {
cfg = cfg || {}; f = f || {}; attr = attr || {};
var _o8 = function (_o13, _oo) { return String(_o13 == null ? '' : _o13).replace(/[\u0000-\u001f<>"'`\\]/g, '').trim().slice(0, _oo || 100); };
var s = String(f.phone == null ? '' : f.phone).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
var p = {
landing_id: _o8(cfg.landing_id, 64), slug: _o8(cfg.slug, 64), lead_id: _o8(leadId, 64),
name: _o8(f.name, 120) || (f.nameOpt ? 'Khách để lại số' : ''), phone: s, consent: f.consent ? 1 : 0,
pref: _o8(f.pref, 40), interest: _o8(f.interest, 80), interest_kind: _o8(f.interest_kind, 10), people: _o8(f.people, 10),
want: _o8(f.want, 160), project: _o8(cfg.project, 120), template: _o8(cfg.template, 20),
page_url: _o8(attr.landing_url || href, 500), hp: _o8(f.website, 50)
};
var _oi = ['v', 's', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
for (var i = 0; i < _oi.length; i++) if (attr[_oi[i]]) p[_oi[i]] = _o8(attr[_oi[i]], 100);
if (cfg.preview) p.test = 1;
for (var k in p) if (p[k] === '' || p[k] === undefined) delete p[k];
return p;
}
export function lpUnitMatch(u, f) {
u = u || {}; f = f || {};
if (f.tab && u.k !== f.tab) return false;
if (f.p && u.p !== f.p) return false;
if (f.t && u.t !== f.t) return false;
if (f.g) {
var _ot = String(f.g).split('-'), lo = Number(_ot[0]) || 0, hi = Number(_ot[1]) || 0, g = Number(u.g) || 0;
if (!g || g < lo || (hi && g >= hi)) return false;
}
return true;
}
export function lpWant(base, ask, _or) {
var _oq = [], i;
if (base) _oq.push(String(base));
if (ask) _oq.push(String(ask));
for (i = 0; i < (_or || []).length; i++) { var _o13 = _or[i]; if (_o13 && _o13[1]) _oq.push(_o13[0] + ': ' + _o13[1]); }
return _oq.join(' · ').replace(/[\u0000-\u001f<>"'`\\]/g, '').slice(0, 160);
}
export function lpMoney(_oo) {
_oo = Number(_oo) || 0;
var _ou = _oo < 0 ? '-' : '', _o2 = Math.abs(_oo);
if (_o2 < 1e9) return _ou + Math.round(_o2 / 1e6) + ' triệu';
return _ou + (_o2 / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
}
export function lpLoan(price, ltv, rate, years) {
var P = Math.max(0, Number(price) || 0) * Math.min(Math.max(Number(ltv) || 0, 0), 100) / 100;
var _oo = Math.max(1, Math.round((Number(years) || 0) * 12)), _ot = (Number(rate) || 0) / 1200;
var firstEqual = P / _oo + P * _ot;
var annuity = _ot ? P * _ot / (1 - Math.pow(1 + _ot, -_oo)) : P / _oo;
var interestEqual = P * _ot * (_oo + 1) / 2;
return { loan: Math.round(P), months: _oo, firstEqual: Math.round(firstEqual), annuity: Math.round(annuity), interestEqual: Math.round(interestEqual), own: Math.round(Math.max(0, Number(price) || 0) - P) };
}
export function lpCountdown(target, now) {
var _om = Number(target) - Number(now);
if (!isFinite(_om)) return null;
if (_om <= 0) return { d: 0, h: 0, m: 0, past: true };
var m = Math.floor(_om / 60000);
return { d: Math.floor(m / 1440), h: Math.floor((m % 1440) / 60), m: m % 60, past: false };
}
export function lpBoot(win, doc, cfg, hooks) {
cfg = cfg || {}; hooks = hooks || {};
var _o0 = function (sel, root) { var _ot = root || doc; return _ot && typeof _ot.querySelectorAll === 'function' ? Array.prototype.slice.call(_ot.querySelectorAll(sel)) : []; };
var _ol = function (_oo) { var m = doc.querySelector('meta[name="' + _oo + '"]'); return m ? m.getAttribute('content') || '' : ''; };
var _oe = null;
try { _oe = JSON.parse(_ol('lp-qs') || 'null'); } catch (e) { _oe = null; }
var href = _ol('lp-url') || (win.location ? String(win.location.href) : '');
var _o1 = 'lp_attr_' + (cfg.slug || 'trang');
var stored = null;
try { stored = JSON.parse(win.sessionStorage.getItem(_o1) || 'null'); } catch (e) { stored = null; }
var A = lpAttr(win.location ? win.location.search : '', stored, href, _oe);
if (A.changed) { try { win.sessionStorage.setItem(_o1, JSON.stringify(A.attr)); } catch (e) { } }
var attr = A.attr;
var track = function (fb, tt, ga) {
try { if (fb && typeof win.fbq === 'function') win.fbq('track', fb); } catch (e) { }
try { if (tt && win.ttq && typeof win.ttq.track === 'function') win.ttq.track(tt); } catch (e) { }
try { if (ga && typeof win.gtag === 'function') win.gtag('event', ga); } catch (e) { }
};
var send = function (p) {
if (typeof hooks.send === 'function') return Promise.resolve(hooks.send(p));
if (!cfg.server) return Promise.reject(new Error('Bản nháp: chưa nối máy chủ'));
return win.fetch(cfg.server, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'landing.lead', payload: p }), credentials: 'omit', redirect: 'follow' })
.then(function (_ot) { return _ot.json(); })
.then(function (j) { if (!j || !j.ok) throw new Error((j && j.error && j.error.message) || 'Lỗi'); return j.data; });
};
var _ok = null;
try { _ok = JSON.parse(win.localStorage.getItem('lp_me') || 'null'); } catch (e) { _ok = null; }
_o0('form[data-lp-form]').forEach(function (form, idx) {
var _os = function (_oo) { return form.querySelector('[name="' + _oo + '"]'); };
if (_ok && _os('name') && !_os('name').value) _os('name').value = _ok.name || '';
if (_ok && _os('phone') && !_os('phone').value) _os('phone').value = _ok.phone || '';
var leadId = 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + idx;
var _oc = form.querySelector('.lp-err');
var _o5 = form.querySelector('button[type="submit"]');
form.addEventListener('submit', function (ev) {
ev.preventDefault();
var pref = form.querySelector('input[name="pref"]:checked');
var interest = _os('interest');
var _or = _o0('[data-w]', form).map(function (_ob) { var _o11 = String(_ob.value || '').trim(); if (_o11 && _ob.tagName === 'SELECT' && _ob.selectedIndex >= 0 && _ob.options[_ob.selectedIndex]) _o11 = String(_ob.options[_ob.selectedIndex].text || _o11).trim(); return [_ob.getAttribute('data-w'), _o11]; });
var f = {
nameOpt: form.getAttribute('data-name-opt') === '1',
name: _os('name') ? _os('name').value : '', phone: _os('phone') ? _os('phone').value : '',
consent: _os('consent') ? _os('consent').checked : false, website: _os('website') ? _os('website').value : '',
pref: pref ? pref.value : '', interest: interest ? interest.value : '', interest_kind: interest ? interest.getAttribute('data-kind') || '' : '',
people: _os('people') ? _os('people').value : '', want: lpWant(form.getAttribute('data-want') || '', form.getAttribute('data-ask') || '', _or)
};
if (f.website) return;
var _on = lpValidate(f);
if (_oc) _oc.textContent = _on;
if (_on) return;
var label = _o5 ? _o5.textContent : '';
if (_o5) { _o5.disabled = true; _o5.textContent = 'Đang gửi…'; }
send(lpPayload(cfg, f, attr, leadId, href)).then(function () {
try { win.localStorage.setItem('lp_me', JSON.stringify({ name: String(f.name).trim().slice(0, 120), phone: String(f.phone).trim().slice(0, 20) })); } catch (e) { }
track('Lead', 'SubmitForm', 'generate_lead');
var _oa = doc.createElement('div');
_oa.className = 'lp-done';
_oa.setAttribute('role', 'status');
var h = doc.createElement('p'); h.className = 'lp-done-h'; h.textContent = 'Đã nhận thông tin ✅';
var t = doc.createElement('p'); t.textContent = form.getAttribute('data-thanks') || 'Chuyên viên sẽ liên hệ anh/chị trong ít phút.';
_oa.appendChild(h); _oa.appendChild(t);
var _o9 = form.getAttribute('data-doc-url');
if (_o9 && /^https:\/\//i.test(_o9)) {
var _o2 = doc.createElement('a'); _o2.className = 'lp-btn lp-btn-2'; _o2.href = _o9; _o2.target = '_blank'; _o2.rel = 'noopener'; _o2.textContent = 'Mở tài liệu';
_oa.appendChild(_o2);
}
form.parentNode.replaceChild(_oa, form);
}).catch(function (e) {
if (_o5) { _o5.disabled = false; _o5.textContent = label; }
if (_oc) _oc.textContent = /nháp/i.test(String(e && e.message)) ? 'Bản nháp: trang chưa nối máy chủ nên chưa lưu được thông tin.' : 'Chưa gửi được. Anh/chị bấm Gọi/Zalo ở cuối trang hoặc thử lại.';
});
});
});
var _oj = doc.querySelector('form[data-lp-form="main"]') || doc.querySelector('form[data-lp-form]');
_o0('[data-lp-want]').forEach(function (_o2) {
_o2.addEventListener('click', function () {
if (!_oj) return;
var _o12 = lpClean(_o2.getAttribute('data-lp-want'), 120);
_oj.setAttribute('data-ask', _o12);
var box = _oj.querySelector('[data-lp-ask]');
if (box) { box.textContent = 'Đang hỏi: ' + _o12; box.hidden = false; }
});
});
_o0('[data-lp-list]').forEach(function (box) {
var _ov = { tab: 'ban', p: '', t: '', g: '' };
var _o10 = _o0('.lp-unit', box), tabs = _o0('[data-lp-tab]', box), count = box.querySelector('[data-lp-count]'), none = box.querySelector('[data-lp-none]');
var apply = function () {
var _oo = 0;
_o10.forEach(function (_ob) {
var ok = lpUnitMatch({ k: _ob.getAttribute('data-k'), p: _ob.getAttribute('data-p'), t: _ob.getAttribute('data-t'), g: Number(_ob.getAttribute('data-g')) }, _ov);
_ob.hidden = !ok; if (ok) _oo++;
});
tabs.forEach(function (_o4) { var _op = _o4.getAttribute('data-lp-tab') === _ov.tab; _o4.className = _op ? 'on' : ''; _o4.setAttribute('aria-selected', _op ? 'true' : 'false'); });
_o0('select[data-f="g"]', box).forEach(function (s) { s.hidden = s.getAttribute('data-k') !== _ov.tab; });
if (count) count.textContent = _oo + ' căn phù hợp';
if (none) none.hidden = _oo > 0;
};
box.setTab = function (t) { _ov.tab = t === 'thue' ? 'thue' : 'ban'; _ov.g = ''; _o0('select[data-f="g"]', box).forEach(function (s) { s.value = ''; }); apply(); };
tabs.forEach(function (_o4) { _o4.addEventListener('click', function () { box.setTab(_o4.getAttribute('data-lp-tab')); }); });
_o0('select[data-f]', box).forEach(function (s) { s.addEventListener('change', function () { _ov[s.getAttribute('data-f')] = s.value; apply(); }); });
apply();
});
doc.addEventListener('click', function (e) {
var _o2 = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
if (!_o2) return;
var _od = String(_o2.getAttribute('href') || '').slice(1), t = _od ? doc.getElementById(_od) : null;
if (!t) return;
e.preventDefault();
if (t.tagName === 'DETAILS') t.open = true;
try { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_o13) { t.scrollIntoView(); }
});
_o0('a[data-lp-tab]').forEach(function (_o2) {
_o2.addEventListener('click', function () { var _o4 = doc.querySelector('[data-lp-list]'); if (_o4 && _o4.setTab) _o4.setTab(_o2.getAttribute('data-lp-tab')); });
});
var body = doc.body;
var _oz = function (_ob) { return !!_ob && /^(INPUT|SELECT|TEXTAREA)$/.test(_ob.tagName || '') && !/^(checkbox|radio|submit|button|hidden)$/.test(String(_ob.type || '')); };
var _og = function (_op) { if (body && body.classList) { if (_op) body.classList.add('lp-kb'); else body.classList.remove('lp-kb'); } };
var _oh = 0;
doc.addEventListener('focusin', function (e) { if (_oz(e.target)) { win.clearTimeout(_oh); _og(true); } });
doc.addEventListener('focusout', function () {
win.clearTimeout(_oh);
_oh = win.setTimeout(function () { _og(_oz(doc.activeElement)); }, 120);
});
if (win.visualViewport && typeof win.visualViewport.addEventListener === 'function') {
win.visualViewport.addEventListener('resize', function () { if (_oz(doc.activeElement)) _og(true); });
}
_o0('[data-lp-loan]').forEach(function (box) {
var _o11 = function (_oo) { var _ob = box.querySelector('[name="' + _oo + '"]'); return _ob ? Number(String(_ob.value).replace(',', '.')) : 0; };
var _oq = function (_oo, text) { var _ob = box.querySelector('[data-out="' + _oo + '"]'); if (_ob) _ob.textContent = text; };
var _o7 = function () {
var R = lpLoan(_o11('price') * 1e9, _o11('ltv'), _o11('rate'), _o11('years'));
_oq('loan', lpMoney(R.loan)); _oq('own', lpMoney(R.own));
_oq('first', lpMoney(R.firstEqual) + '/tháng'); _oq('annuity', lpMoney(R.annuity) + '/tháng');
};
box.addEventListener('input', _o7);
_o7();
});
_o0('[data-lp-countdown]').forEach(function (_ob) {
var _o3 = Number(_ob.getAttribute('data-at'));
var _oy = function () {
var _o6 = lpCountdown(_o3, Date.now());
if (!_o6) return;
_ob.textContent = _o6.past ? 'Sự kiện đã diễn ra' : 'Còn ' + _o6.d + ' ngày ' + _o6.h + ' giờ ' + _o6.m + ' phút';
};
_oy();
if (!hooks.preview) win.setInterval(_oy, 30000);
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
export const RUNTIME_FNS = [lpClean, lpPhone, lpAttr, lpValidate, lpPayload, lpUnitMatch, lpWant, lpMoney, lpLoan, lpCountdown, lpBoot];
export function pageScript() {
return '(function(){"use strict";\n' + RUNTIME_FNS.map((f) => f.toString()).join('\n') +
'\nvar c=document.getElementById("lp-cfg"),cfg={};try{cfg=JSON.parse(c.textContent)}catch(e){}\nlpBoot(window,document,cfg,{});\n})();';
}
