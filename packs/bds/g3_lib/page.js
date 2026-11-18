import { escHtml as e, headTags, jsonLdScripts, projectLd, breadcrumbLd, faqLd, eventLd, agentLd, joinUrl } from './seo.js';
export const DISCLAIMER = 'Thông tin, hình ảnh mang tính tham khảo; giá và chính sách theo công bố chính thức của chủ đầu tư tại thời điểm giao dịch.';
export const CONSENT_TEXT = 'Tôi đồng ý để môi giới/công ty quản lý trang này lưu và dùng họ tên, số điện thoại này chỉ để liên hệ tư vấn bất động sản. Tôi có thể rút lại đồng ý hoặc yêu cầu xoá bất cứ lúc nào – theo Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15).';
const _o0 = `*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1d2433;background:#f7f3ea;line-height:1.55}
main{max-width:760px;margin:0 auto;padding:20px 16px 48px}h1{font-size:1.7rem;line-height:1.25;margin:.2em 0 .4em;color:#0f1e33}h2{font-size:1.2rem;color:#0f1e33;margin-top:1.6em}
.hero img{width:100%;height:auto;border-radius:12px;display:block}.muted{color:#5b6475;font-size:.92rem}.card{background:#fff;border-radius:14px;padding:16px;margin:16px 0;box-shadow:0 1px 3px rgba(0,0,0,.08)}
form label{display:block;margin:10px 0 4px;font-weight:600}input[type=text],input[type=tel]{width:100%;padding:12px;font-size:1rem;border:1px solid #c9ccd3;border-radius:10px}
.consent{display:flex;gap:8px;align-items:flex-start;font-size:.9rem;margin:12px 0}.consent input{margin-top:4px;min-width:20px;min-height:20px}
button{width:100%;min-height:48px;border:0;border-radius:12px;background:#c9a24a;color:#0f1e33;font-weight:700;font-size:1.05rem;cursor:pointer}button[disabled]{opacity:.6}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.ok{background:#e7f6ec;border-radius:10px;padding:12px}.err{color:#b42318}
.contact{display:flex;gap:10px;flex-wrap:wrap}.contact a{flex:1;min-width:140px;text-align:center;padding:12px;border-radius:12px;background:#0f1e33;color:#fff;text-decoration:none;font-weight:600}
ul.facts{padding-left:18px}footer{margin-top:28px;font-size:.82rem;color:#5b6475}.story{border-left:4px solid #c9a24a;padding-left:12px;margin:14px 0}`;
const _o1 = `(function(){var f=document.getElementById('g3f');if(!f)return;var ep=f.getAttribute('data-endpoint')||'';
var q=new URLSearchParams(location.search),keys=['ref','v','utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
f.addEventListener('submit',function(ev){ev.preventDefault();var m=document.getElementById('g3m');m.className='';m.textContent='';
if(!ep){m.className='err';m.textContent='Trang chưa nối máy chủ nhận khách – vui lòng gọi số điện thoại bên dưới.';return;}
if(!f.consent.checked){m.className='err';m.textContent='Vui lòng tích ô đồng ý để tiếp tục.';return;}
var act=f.getAttribute('data-action')||'g3.lead',p={kind:f.getAttribute('data-kind'),ref_id:f.getAttribute('data-ref'),name:f.name.value,phone:f.phone.value,consent:true,website:f.website.value,page_url:location.href.slice(0,500)};
if(act==='landing.lead'){p={name:p.name,phone:p.phone,consent:true,website:p.website,page_url:p.page_url,landing_id:f.getAttribute('data-landing')||'',project:f.getAttribute('data-project')||'',want:f.getAttribute('data-want')||''};}
keys.forEach(function(k){var v=q.get(k);if(v)p[k]=v.slice(0,100);});var b=f.querySelector('button');b.disabled=true;
fetch(ep,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:act,payload:p})}).then(function(r){return r.json();}).then(function(r){b.disabled=false;
if(!r||!r.ok){m.className='err';m.textContent=(r&&r.error&&r.error.message)||'Chưa gửi được, vui lòng thử lại.';return;}
var d=r.data||{};m.className='ok';m.textContent=d.message||'Đã nhận thông tin. Môi giới sẽ liên hệ sớm.';
if(d.file_url&&/^https:\\/\\//.test(d.file_url)){var a=document.createElement('a');a.href=d.file_url;a.target='_blank';a.rel='noopener';a.textContent=' Mở tài liệu';m.appendChild(a);location.href=d.file_url;}
f.reset();}).catch(function(){b.disabled=false;m.className='err';m.textContent='Mạng chập chờn, vui lòng thử lại.';});});})();`;
function _oc(phone) { const d = String(phone || '').replace(/\D/g, ''); return d ? 'https://zalo.me/' + d : ''; }
function _o2(agent) {
if (!agent || !agent.phone) return '';
return `<div class="contact"><a href="tel:${e(agent.phone)}">Gọi ${e(agent.phone)}</a><a href="${e(_oc(agent.phone))}" target="_blank" rel="noopener">Nhắn Zalo</a></div>`;
}
function _o6({ kind, refId, endpoint, button, note, action = 'g3.lead', landing = '', project = '', want = '' }) {
const _o3 = action === 'g3.lead' ? '' : ` data-action="${e(action)}" data-landing="${e(landing)}" data-project="${e(project)}" data-want="${e(want)}"`;
return `<form id="g3f" class="card" data-endpoint="${e(endpoint || '')}" data-kind="${e(kind)}" data-ref="${e(refId || '')}"${_o3} novalidate>
${note ? `<p class="muted">${e(note)}</p>` : ''}<label for="g3n">Họ tên</label><input id="g3n" name="name" type="text" autocomplete="name" maxlength="80" required>
<label for="g3p">Số điện thoại / Zalo</label><input id="g3p" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="15" required>
<div class="hp" aria-hidden="true"><label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
<label class="consent"><input type="checkbox" name="consent" required><span>${e(CONSENT_TEXT)}</span></label>
<button type="submit">${e(button)}</button><p id="g3m" role="status" aria-live="polite"></p></form>`;
}
function _o9({ head, body }) {
return `<!doctype html>\n<html lang="vi">\n<head>\n${head}\n<style>${_o0}</style>\n</head>\n<body>\n<main>\n${body}\n</main>\n<script>${_o1}</script>\n</body>\n</html>\n`;
}
const _o4 = (agent) => `<footer><p>${e(DISCLAIMER)}</p>${agent && agent.name ? `<p>${e(agent.name)}${agent.license ? ' · CCHN ' + e(agent.license) : ''}${agent.phone ? ' · ' + e(agent.phone) : ''}</p>` : ''}</footer>`;
export function projectPage(_o7, { agent = {}, base = '', endpoint = '', facts = [], body = '' } = {}) {
const crumbs = breadcrumbLd([{ name: 'Trang chủ', url: joinUrl(base, '') }, { name: 'Dự án', url: joinUrl(base, 'du-an') }, { name: _o7.name, url: _o7.canonical }]);
const head = headTags(_o7) + '\n' + jsonLdScripts([projectLd(_o7, agent), crumbs, faqLd(_o7.faq), agent.name ? agentLd({ ...agent, url: joinUrl(base, '') }) : null]);
const _o8 = String(body || '').split(/\n{2,}|\r?\n/).map(s => s.trim()).filter(Boolean).map(p => `<p>${e(p)}</p>`).join('\n');
const _o5 = `<article><h1>${e(_o7.h1 || _o7.name)}</h1>${_o7.image ? `<div class="hero"><img src="${e(_o7.image)}" alt="${e(_o7.image_alt || _o7.name)}" width="1200" height="675" loading="eager"></div>` : ''}
<p class="muted">${e(_o7.description)}</p>${facts.length ? `<ul class="facts">${facts.map(f => `<li>${e(f)}</li>`).join('')}</ul>` : ''}
${_o8}
${(_o7.faq || []).length ? `<h2>Câu hỏi thường gặp</h2>${_o7.faq.map(f => `<h3>${e(f.q)}</h3><p>${e(f.a)}</p>`).join('\n')}` : ''}
<h2>Nhận bảng giá, chính sách mới</h2>${_o6({ kind: 'page', refId: _o7.project_id || _o7.slug, endpoint, button: 'Nhận bảng giá', action: 'landing.lead', landing: ('g3seo_' + String(_o7.project_id || _o7.slug || '')).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 64), project: _o7.name || '', want: ('Nhận bảng giá: ' + (_o7.name || '')).slice(0, 160) })}
${_o2(agent)}
<p class="muted"><a href="${e(joinUrl(base, 'ho-so'))}">Hồ sơ năng lực môi giới</a> · <a href="${e(joinUrl(base, ''))}">Các dự án khác</a></p></article>${_o4(agent)}`;
return _o9({ head, body: _o5 });
}
export function docPage(doc, { agent = {}, base = '', endpoint = '', canonical = '' } = {}) {
const _o7 = { title: doc.title + (agent.name ? ' | ' + agent.name : ''), description: doc.description || ('Nhận ' + doc.title + ' qua Zalo.'), canonical, image: doc.cover, noindex: !!doc.noindex };
const _o5 = `<h1>${e(doc.title)}</h1>${doc.cover ? `<div class="hero"><img src="${e(doc.cover)}" alt="${e(doc.title)}" width="1200" height="675"></div>` : ''}
${doc.description ? `<p>${e(doc.description)}</p>` : ''}${(doc.bullets || []).length ? `<ul class="facts">${doc.bullets.map(b => `<li>${e(b)}</li>`).join('')}</ul>` : ''}
${_o6({ kind: 'doc', refId: doc.id, endpoint, button: 'Nhận tài liệu', note: 'Để lại số Zalo để nhận tài liệu ngay và bản cập nhật khi có chính sách mới.' })}
${_o2(agent)}${_o4(agent)}`;
return _o9({ head: headTags(_o7), body: _o5 });
}
export function eventPage(ev, { agent = {}, endpoint = '', canonical = '' } = {}) {
const _oa = ev.start_at ? new Date(Number(ev.start_at)).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
const _o7 = { title: ev.title + (agent.name ? ' | ' + agent.name : ''), description: ev.description || ev.title, canonical, image: ev.image };
const _ob = ev.mode === 'online' ? 'Trực tuyến – link xem gửi qua Zalo trước giờ phát' : (ev.place || '') + (ev.address ? ' – ' + ev.address : '');
const _o5 = `<h1>${e(ev.title)}</h1>${ev.image ? `<div class="hero"><img src="${e(ev.image)}" alt="${e(ev.title)}" width="1200" height="675"></div>` : ''}
<div class="card"><p><strong>Thời gian:</strong> ${e(_oa)}</p><p><strong>Địa điểm:</strong> ${e(_ob)}</p>${ev.seats ? `<p><strong>Số chỗ:</strong> ${e(ev.seats)}</p>` : ''}</div>
${ev.description ? `<p>${e(ev.description)}</p>` : ''}
${_o6({ kind: 'event', refId: ev.id, endpoint, button: 'Đăng ký tham dự' })}
${_o2(agent)}${_o4(agent)}`;
return _o9({ head: headTags(_o7) + '\n' + jsonLdScripts([eventLd({ ...ev, url: canonical }, agent)]), body: _o5 });
}
export function profilePage(p, stories, { agent = {}, base = '', canonical = '' } = {}) {
const _o7 = { title: (p.name || agent.name || 'Hồ sơ năng lực') + ' – hồ sơ năng lực môi giới', description: p.intro || '', canonical: canonical || joinUrl(base, 'ho-so'), image: p.photo };
const stats = (p.stats || []).filter(s => s && s.value !== '' && s.value !== undefined);
const _o5 = `<h1>${e(p.name || agent.name || '')}</h1>${p.title ? `<p class="muted">${e(p.title)}</p>` : ''}${p.photo ? `<div class="hero"><img src="${e(p.photo)}" alt="${e(p.name || '')}" width="600" height="600"></div>` : ''}
${p.intro ? `<p>${e(p.intro)}</p>` : ''}${stats.length ? `<ul class="facts">${stats.map(s => `<li><strong>${e(s.value)}</strong> ${e(s.label)}</li>`).join('')}</ul>` : ''}
${(p.areas || []).length ? `<h2>Khu vực, dự án am hiểu</h2><p>${e(p.areas.join(', '))}</p>` : ''}
${stories.length ? `<h2>Câu chuyện khách hàng</h2>${stories.map(s => `<div class="story"><p>“${e(s.quote || s.story)}”</p><p class="muted">– ${e(s.display_name)}${s.project ? ', ' + e(s.project) : ''}</p></div>`).join('\n')}<p class="muted">Câu chuyện được đăng khi đã có đồng ý của khách hàng.</p>` : ''}
${_o2(agent)}${_o4(agent)}`;
return _o9({ head: headTags(_o7) + '\n' + jsonLdScripts([agentLd({ name: p.name || agent.name, phone: agent.phone, url: _o7.canonical, image: p.photo, area: (p.areas || []).join(', '), license: agent.license })]), body: _o5 });
}
