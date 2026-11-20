// Service worker – cache vỏ app theo phiên bản; API luôn qua mạng, không cache phản hồi API.
const VERSION = 'v1.0.6-856d3b8ad5';
const CACHE = 'bds-shell-' + VERSION;
const FONT_CACHE = 'bds-fonts-v1';
// SHELL: bản đóng gói (tools/build_zip.mjs) TỰ SINH lại danh sách này từ mọi core/*.js|css + packs/**/*.js|json|css (tên theo hash)
// → thêm file lõi/module mới KHÔNG cần sửa ở đây. Bản chưa đóng gói: danh sách dưới chỉ để chạy offline cơ bản, còn lại networkFirst.
const SHELL = [
 "./",
 "assets/icon-192.png",
 "assets/icon-512.png",
 "assets/icon-apple-180.png",
 "assets/icon-maskable-512.png",
 "assets/icon.svg",
 "config.js",
 "core/a2hs.dd832a10b4.js",
 "core/ai.8d26d4c959.js",
 "core/ai_cost.2fb10e6822.js",
 "core/api.8a9774059d.js",
 "core/app.c960f5ab60.js",
 "core/archive.31dd24ed44.js",
 "core/ask.00dfbde78f.js",
 "core/ask_kb.ba0a76db5d.js",
 "core/ask_prompt.4b91cda12d.js",
 "core/auth.7b8dd8e978.js",
 "core/backup_logic.f56204516a.js",
 "core/cheers.02358cc8c8.js",
 "core/cheers.fc553c5a11.css",
 "core/connect_confirm.30276237a3.js",
 "core/connections.6d87e72b72.js",
 "core/connections.d220090bcc.css",
 "core/connections_logic.cff3dbca52.js",
 "core/device_slots.7f38a283f1.css",
 "core/device_slots.eec0ddd1cc.js",
 "core/email_verify.c44911bb1b.js",
 "core/engine_dl.18c8a720c5.js",
 "core/engine_pair.1fc01ffec5.js",
 "core/exec_url.4b6ba956ed.js",
 "core/extras.2f7945fadc.css",
 "core/extras.c4ca62c730.js",
 "core/features.acef34c96e.js",
 "core/feedback.69ad74fcf5.js",
 "core/feedback.9e6ba9ac37.css",
 "core/first_steps.4271aaa288.js",
 "core/first_steps.4dc531143b.css",
 "core/firstload.08e5136db5.js",
 "core/friendly_error.7f3d23ce57.js",
 "core/fullcheck.133fdf2db7.js",
 "core/greet.60b99ed569.js",
 "core/health_logic.7f3d23ce57.js",
 "core/help_links.ba329c14dc.js",
 "core/hwscan.29d759fe0b.js",
 "core/hwscan.99ba264f8d.css",
 "core/i18n.c64f4bc3eb.js",
 "core/instance.087c1b328a.js",
 "core/invite_accept.1d7e9d057d.js",
 "core/invites.21910a6901.css",
 "core/invites.d0704e2232.js",
 "core/license.73b3a4123b.js",
 "core/license.f32a7d8d2f.css",
 "core/license_gift.1de00e7454.js",
 "core/license_logic.9718cd0900.js",
 "core/maintenance.e772aa1c0c.js",
 "core/memory.d0581cf3b8.js",
 "core/mock-backend.532ee02d83.js",
 "core/netdiag.d4fd7034b7.js",
 "core/offline_mode.c91823c363.js",
 "core/offline_ui.7f7c8e35dd.js",
 "core/onboarding.5b71c6d6bb.js",
 "core/oneclick.c9ce44d759.js",
 "core/packs.72ecf0bb56.js",
 "core/pending_rescue.39340eedfa.js",
 "core/persona.c872544cf7.js",
 "core/portal.c67f0ba398.js",
 "core/pwa_hint.f949f23506.js",
 "core/qr.aa623cdb09.js",
 "core/registry.6d79af2015.js",
 "core/selfheal.a5e3829634.js",
 "core/server_core.js",
 "core/settings.0e9a066ff3.js",
 "core/setup_gate.d66104e8e0.js",
 "core/slots.f531f1a378.js",
 "core/store.56498e5e0f.js",
 "core/styles.de64a63465.css",
 "core/support.b695c47cb1.js",
 "core/tfa.34d52e1fe4.js",
 "core/tfa.d746921905.css",
 "core/ui.73a28f59df.js",
 "core/updates.7f3d23ce57.js",
 "core/upgrade.4730f76a5c.js",
 "core/users.be5fcb9ddb.js",
 "core/video_machine.791c6421be.js",
 "core/video_machine.8f2350a459.css",
 "core/video_screens.6f9cddd373.js",
 "core/whatsnew.8f6a287e11.js",
 "core/wizard/checks.js",
 "core/wizard/demodata.js",
 "core/wizard/device.js",
 "core/wizard/diachi.js",
 "core/wizard/doingu.js",
 "core/wizard/flag.js",
 "core/wizard/gcai.js",
 "core/wizard/gcai_slots.js",
 "core/wizard/gcai_view.js",
 "core/wizard/hwcheck.css",
 "core/wizard/hwcheck.js",
 "core/wizard/index.js",
 "core/wizard/machine.js",
 "core/wizard/provision.js",
 "core/wizard/report.js",
 "core/wizard/samples.js",
 "core/wizard/scrub.js",
 "core/wizard/steps.js",
 "core/wizard/tenmien_cty.js",
 "core/wizard/view.js",
 "core/wizard/wizard.css",
 "core/xkit.e7637ba4a6.js",
 "data/projects.js",
 "index.html",
 "manifest.webmanifest",
 "packs/bds/_lib/callcard.css",
 "packs/bds/_lib/callcard.js",
 "packs/bds/_lib/callcard_logic.js",
 "packs/bds/_lib/characters.js",
 "packs/bds/_lib/consent.js",
 "packs/bds/_lib/crm.css",
 "packs/bds/_lib/crm.js",
 "packs/bds/_lib/fresh.js",
 "packs/bds/_lib/fresh_domains.js",
 "packs/bds/_lib/freshnews.js",
 "packs/bds/_lib/g4.css",
 "packs/bds/_lib/g4_logic.js",
 "packs/bds/_lib/g4_ui.js",
 "packs/bds/_lib/ideas.js",
 "packs/bds/_lib/import_logic.js",
 "packs/bds/_lib/inbox_desk.js",
 "packs/bds/_lib/kit.js",
 "packs/bds/_lib/landing.js",
 "packs/bds/_lib/landing_app.js",
 "packs/bds/_lib/landing_runtime.js",
 "packs/bds/_lib/lead_connect.js",
 "packs/bds/_lib/lead_connect_ui.js",
 "packs/bds/_lib/lead_pool.css",
 "packs/bds/_lib/lead_pool.js",
 "packs/bds/_lib/magnet.js",
 "packs/bds/_lib/market.js",
 "packs/bds/_lib/my_phone.js",
 "packs/bds/_lib/sales.js",
 "packs/bds/_lib/source_roi.js",
 "packs/bds/_lib/staff.js",
 "packs/bds/_lib/staff_chat.js",
 "packs/bds/_lib/staff_custom.js",
 "packs/bds/_lib/staff_memory.js",
 "packs/bds/_lib/staff_skills.js",
 "packs/bds/_lib/staff_templates.js",
 "packs/bds/_lib/video.js",
 "packs/bds/_lib/vn_places.js",
 "packs/bds/brief/index.js",
 "packs/bds/care/index.js",
 "packs/bds/catalog/add_new.js",
 "packs/bds/catalog/index.js",
 "packs/bds/catalog/research.js",
 "packs/bds/catalog/research_new_logic.js",
 "packs/bds/catalog/upload.js",
 "packs/bds/catalog/upload_logic.js",
 "packs/bds/customers/consent_ui.js",
 "packs/bds/customers/customers.css",
 "packs/bds/customers/import_ui.js",
 "packs/bds/customers/index.js",
 "packs/bds/customers/source_report.js",
 "packs/bds/g1_banks/index.js",
 "packs/bds/g1_banks/pack.manifest.json",
 "packs/bds/g1_guest/index.js",
 "packs/bds/g1_guest/pack.manifest.json",
 "packs/bds/g1_layout/index.js",
 "packs/bds/g1_layout/pack.manifest.json",
 "packs/bds/g1_lib/logic.js",
 "packs/bds/g1_lib/ui.js",
 "packs/bds/g1_policycalc/index.js",
 "packs/bds/g1_policycalc/pack.manifest.json",
 "packs/bds/g1_policywatch/index.js",
 "packs/bds/g1_policywatch/pack.manifest.json",
 "packs/bds/g1_rental/index.js",
 "packs/bds/g1_rental/pack.manifest.json",
 "packs/bds/g1_research/index.js",
 "packs/bds/g1_research/pack.manifest.json",
 "packs/bds/g1_tax/index.js",
 "packs/bds/g1_tax/pack.manifest.json",
 "packs/bds/g2_chamsoc/index.js",
 "packs/bds/g2_chamsoc/pack.manifest.json",
 "packs/bds/g2_crm/index.js",
 "packs/bds/g2_crm/pack.manifest.json",
 "packs/bds/g2_hoso/index.js",
 "packs/bds/g2_hoso/pack.manifest.json",
 "packs/bds/g2_lib/core.js",
 "packs/bds/g2_lib/g2.css",
 "packs/bds/g2_lib/objection_stats.js",
 "packs/bds/g2_lib/ops.js",
 "packs/bds/g2_lib/talk.js",
 "packs/bds/g2_lib/ui.js",
 "packs/bds/g2_lib/viewing.js",
 "packs/bds/g2_lib/warm.js",
 "packs/bds/g2_lib/wingman.js",
 "packs/bds/g2_lib/wingman_ui.js",
 "packs/bds/g2_lich/index.js",
 "packs/bds/g2_lich/pack.manifest.json",
 "packs/bds/g2_nhom/index.js",
 "packs/bds/g2_nhom/pack.manifest.json",
 "packs/bds/g2_taisan/index.js",
 "packs/bds/g2_taisan/pack.manifest.json",
 "packs/bds/g2_thitruong/index.js",
 "packs/bds/g2_thitruong/pack.manifest.json",
 "packs/bds/g2_tuvan/index.js",
 "packs/bds/g2_tuvan/pack.manifest.json",
 "packs/bds/g2_tuvan/warm_ui.js",
 "packs/bds/g2_zoa/index.js",
 "packs/bds/g2_zoa/pack.manifest.json",
 "packs/bds/g3_ads/index.js",
 "packs/bds/g3_ads/pack.manifest.json",
 "packs/bds/g3_docs/index.js",
 "packs/bds/g3_docs/pack.manifest.json",
 "packs/bds/g3_events/index.js",
 "packs/bds/g3_events/pack.manifest.json",
 "packs/bds/g3_groups/index.js",
 "packs/bds/g3_groups/pack.manifest.json",
 "packs/bds/g3_lib/adperf.js",
 "packs/bds/g3_lib/ads.js",
 "packs/bds/g3_lib/attribution.js",
 "packs/bds/g3_lib/bridge.js",
 "packs/bds/g3_lib/csv.js",
 "packs/bds/g3_lib/events.js",
 "packs/bds/g3_lib/groups.js",
 "packs/bds/g3_lib/page.js",
 "packs/bds/g3_lib/profile.js",
 "packs/bds/g3_lib/roi.js",
 "packs/bds/g3_lib/seo.js",
 "packs/bds/g3_lib/ui.js",
 "packs/bds/g3_profile/index.js",
 "packs/bds/g3_profile/pack.manifest.json",
 "packs/bds/g3_roi/index.js",
 "packs/bds/g3_roi/pack.manifest.json",
 "packs/bds/g3_seo/index.js",
 "packs/bds/g3_seo/pack.manifest.json",
 "packs/bds/g4_banggia/index.js",
 "packs/bds/g4_banggia/pack.manifest.json",
 "packs/bds/g4_congtruong/index.js",
 "packs/bds/g4_congtruong/pack.manifest.json",
 "packs/bds/g4_doitac/index.js",
 "packs/bds/g4_doitac/pack.manifest.json",
 "packs/bds/g4_giohang/index.js",
 "packs/bds/g4_giohang/pack.manifest.json",
 "packs/bds/g4_giucho/index.js",
 "packs/bds/g4_giucho/pack.manifest.json",
 "packs/bds/g4_phaply/index.js",
 "packs/bds/g4_phaply/pack.manifest.json",
 "packs/bds/g5_can3d/index.js",
 "packs/bds/g5_can3d/pack.manifest.json",
 "packs/bds/g5_can3d/viewer.js",
 "packs/bds/g5_hoc/index.js",
 "packs/bds/g5_hoc/pack.manifest.json",
 "packs/bds/g5_huongnang/index.js",
 "packs/bds/g5_huongnang/pack.manifest.json",
 "packs/bds/g5_lib/aicost.js",
 "packs/bds/g5_lib/csp.js",
 "packs/bds/g5_lib/fengshui.js",
 "packs/bds/g5_lib/g5.css",
 "packs/bds/g5_lib/geo.js",
 "packs/bds/g5_lib/interior.js",
 "packs/bds/g5_lib/layout3d.js",
 "packs/bds/g5_lib/lessons.js",
 "packs/bds/g5_lib/pdf.js",
 "packs/bds/g5_lib/pdfmap.js",
 "packs/bds/g5_lib/plan3d.js",
 "packs/bds/g5_lib/qhai.js",
 "packs/bds/g5_lib/roleplay.js",
 "packs/bds/g5_lib/scenes.js",
 "packs/bds/g5_lib/sun.js",
 "packs/bds/g5_lib/ui.js",
 "packs/bds/g5_lib/vitri.js",
 "packs/bds/g5_luyentuvan/index.js",
 "packs/bds/g5_luyentuvan/pack.manifest.json",
 "packs/bds/g5_noithat/index.js",
 "packs/bds/g5_noithat/pack.manifest.json",
 "packs/bds/g5_phongthuy/index.js",
 "packs/bds/g5_phongthuy/pack.manifest.json",
 "packs/bds/g5_quyhoach/index.js",
 "packs/bds/g5_quyhoach/pack.manifest.json",
 "packs/bds/ideas/ideas.css",
 "packs/bds/ideas/index.js",
 "packs/bds/inbox/desk_ui.js",
 "packs/bds/inbox/index.js",
 "packs/bds/landing_builder/index.js",
 "packs/bds/landing_builder/pack.manifest.json",
 "packs/bds/lead_pool/index.js",
 "packs/bds/loan/index.js",
 "packs/bds/market/index.js",
 "packs/bds/members/index.js",
 "packs/bds/members/logic.js",
 "packs/bds/members/members.css",
 "packs/bds/members/panel.js",
 "packs/bds/pack.json",
 "packs/bds/policy/index.js",
 "packs/bds/quote/index.js",
 "packs/bds/trang_cua_toi/index.js",
 "packs/bds/words.vi.json",
 "packs/bds/zalo/index.js",
 "shared/bds_verify.js",
 "shared/consent.js",
 "shared/edition.js",
 "shared/logic.js",
 "shared/ooxml.js",
 "shared/site_logic.js",
 "shared/xlsx_write.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // từng file một: thiếu file nào cũng không làm hỏng cả lần cài
    await Promise.all(SHELL.map((u) => cache.add(new Request(u, { cache: 'reload' })).catch(() => null)));
    await self.skipWaiting(); // bản mới thay bản cũ ngay, không chờ đóng hết tab
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('bds-shell-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  const d = event.data || {};
  if (d.type === 'skipWaiting') self.skipWaiting();
  if (d.type === 'version' && event.ports && event.ports[0]) event.ports[0].postMessage({ version: VERSION });
});

const API_HOSTS = ['script.google.com', 'script.googleusercontent.com'];

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // POST API → mạng trực tiếp
  const url = new URL(req.url);
  if (API_HOSTS.includes(url.hostname)) return; // network-first tuyệt đối, không cache
  if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') { if (url.origin !== self.location.origin) return; }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // Cách 3: trang landing ở /trang/<trang>/ do Worker của bên bán phục vụ – không phải app: không lấy app thay, không ghi đè bộ đệm index.html
  if (url.pathname.startsWith('/trang/')) return;
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req, 'index.html'));
    return;
  }
  // Bản trên máy (máy dựng 127.0.0.1) và bản chưa đổi tên theo hash: luôn lấy bản mới từ mạng, mất mạng mới dùng cache
  // → cập nhật bộ cài là thấy ngay, không bị kẹt bản cũ.
  const hashed = /\.[0-9a-f]{10}\.(js|css)$/.test(url.pathname);
  event.respondWith(hashed ? cacheFirst(req) : networkFirst(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req, { ignoreSearch: false });
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok && res.type === 'basic') cache.put(req, res.clone()).catch(() => {});
  return res;
}

async function networkFirst(req, fallback) {
  fallback = fallback || req;
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok && res.type === 'basic') cache.put(fallback, res.clone()).catch(() => {});
    return res;
  } catch {
    return (await cache.match(fallback)) || (req.mode === 'navigate' ? await cache.match('./') : null) || Response.error();
  }
}

async function staleWhileRevalidate(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()).catch(() => {}); return res; }).catch(() => null);
  return hit || (await net) || Response.error();
}
