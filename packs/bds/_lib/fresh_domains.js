export const FRESH_NEWS = [
'vnexpress.net', 'tuoitre.vn', 'thanhnien.vn', 'vietnamnet.vn', 'dantri.com.vn', 'cafef.vn', 'cafeland.vn', 'vneconomy.vn', 'baochinhphu.vn',
'chinhphu.vn', 'nhandan.vn', 'plo.vn', 'laodong.vn', 'znews.vn', 'zingnews.vn', 'tienphong.vn', 'thesaigontimes.vn', 'sggp.org.vn', 'hanoimoi.vn',
'hanoimoi.com.vn', 'vtv.vn', 'vov.vn', 'reatimes.vn', 'tinnhanhchungkhoan.vn', 'nld.com.vn', 'kinhtedothi.vn', 'baodautu.vn', 'vir.com.vn',
'vietstock.vn', 'diendandoanhnghiep.vn', 'thoibaonganhang.vn', 'thoibaotaichinhvietnam.vn', 'batdongsan.com.vn', 'vnmedia.vn', 'baoxaydung.vn',
'baoxaydung.com.vn', 'congthuong.vn', 'nguoiduatin.vn', 'vietnamplus.vn', 'qdnd.vn', 'cand.com.vn', 'bnews.vn'
];
export const FRESH_BANKS = [
'vietcombank.com.vn', 'bidv.com.vn', 'vietinbank.vn', 'agribank.com.vn', 'techcombank.com', 'techcombank.com.vn', 'vpbank.com.vn', 'mbbank.com.vn',
'acb.com.vn', 'sacombank.com.vn', 'hdbank.com.vn', 'tpb.vn', 'vib.com.vn', 'shb.com.vn', 'msb.com.vn', 'ocb.com.vn', 'seabank.com.vn',
'eximbank.com.vn', 'lpbank.com.vn', 'namabank.com.vn', 'abbank.vn', 'bacabank.com.vn', 'baovietbank.vn', 'kienlongbank.com', 'pvcombank.com.vn',
'vietbank.com.vn', 'ncb-bank.vn', 'saigonbank.com.vn', 'pgbank.com.vn', 'vikki.vn', 'uob.com.vn', 'shinhan.com.vn', 'hsbc.com.vn',
'standardchartered.com', 'wooribank.com.vn', 'publicbank.com.vn', 'sbv.gov.vn'
];
export const FRESH_LAW = [
'thuvienphapluat.vn', 'luatvietnam.vn', 'quochoi.vn', 'mof.gov.vn', 'gdt.gov.vn', 'moj.gov.vn', 'vbpl.vn', 'congbao.chinhphu.vn',
'vanban.chinhphu.vn', 'monre.gov.vn', 'mae.gov.vn', 'moc.gov.vn'
];
export const FRESH_MIN_SOURCES = 10;
const _o1 = (u) => { const _o4 = /^https?:\/\/([^/?#]+)/i.exec(String(u || '')); return _o4 ? _o4[1].toLowerCase().replace(/^www\./, '') : ''; };
export function freshHost(src) {
const t = String((src && src.title) || '').toLowerCase().trim();
if (/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(t)) return t.replace(/^www\./, '');
const _o2 = _o1(src && src.url);
return /vertexaisearch|googleusercontent|google\.com$/.test(_o2) ? '' : _o2;
}
const _o3 = (list, host) => list.some((_o0) => host === _o0 || host.endsWith('.' + _o0));
export function freshReputable(topic, host) {
if (!host) return false;
if (/\.gov\.vn$/.test(host) || host === 'gov.vn') return true;
if (_o3(FRESH_NEWS, host)) return true;
if (topic === 'bank_rates') return _o3(FRESH_BANKS, host);
if (topic === 'tax') return _o3(FRESH_LAW, host);
return false;
}
export function countFresh(topic, sources) {
const map = new Map();
for (const _o5 of sources || []) {
const _o0 = (_o5 && typeof _o5.domain === 'string' && _o5.domain) || freshHost(_o5);
if (!_o0) continue;
if (!map.has(_o0)) map.set(_o0, { domain: _o0, reputable: freshReputable(topic, _o0), count: 0 });
map.get(_o0).count++;
}
const domains = [...map.values()];
const reputable = domains.filter((x) => x.reputable).length;
return { domains, distinct: domains.length, reputable, min: FRESH_MIN_SOURCES, enough: reputable >= FRESH_MIN_SOURCES };
}
