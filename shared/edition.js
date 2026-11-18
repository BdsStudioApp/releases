var BDSEdition = (function () {
'use strict';
var EDITIONS = {
owner: { id: 'owner', ownerData: true, sample: false, showUsers: true, licensing: false, oneTouch: false, label: 'Bản của anh/chị' },
'ca-nhan': { id: 'ca-nhan', ownerData: false, sample: true, showUsers: false, licensing: true, oneTouch: true, label: 'Cá nhân' },
'cong-ty': { id: 'cong-ty', ownerData: false, sample: false, showUsers: true, licensing: true, oneTouch: false, label: 'Công ty' },
sale: { id: 'sale', ownerData: false, sample: true, showUsers: true, licensing: true, oneTouch: true, label: 'Bản mẫu' }
};
var RELEASES_REPO = 'DAN_TO_CHUC_GITHUB/bds-studio-releases';
var RELEASES_ORIGIN = 'https://raw.githubusercontent.com/' + RELEASES_REPO + '/main/';
var NEUTRAL_INSTANCE = {
APP_URL: '',
PUBLIC_URL: '',
LANDING_URL: '',
RELEASE_ORIGIN: RELEASES_ORIGIN,
LANDING_SHEET_ID: '',
CHANNEL: '',
OWNER_NAME: '',
OWNER_CCHN: ''
};
var OWNER_KEYS = Object.keys(NEUTRAL_INSTANCE);
function _ob(obj, keys) {
var _o8 = {}; for (var _o6 = 0; _o6 < keys.length; _o6++) { var _o7 = keys[_o6]; if (obj && obj[_o7] !== undefined) _o8[_o7] = obj[_o7]; } return _o8;
}
function resolveEdition(config) {
config = config || {};
var flags = EDITIONS[config.edition] || EDITIONS.owner;
var instance = {}; for (var _o7 in NEUTRAL_INSTANCE) instance[_o7] = NEUTRAL_INSTANCE[_o7];
var _o4 = _ob(config.INSTANCE || {}, OWNER_KEYS);
for (var _o3 in _o4) instance[_o3] = _o4[_o3];
if (flags.ownerData && (!instance.RELEASE_ORIGIN || instance.RELEASE_ORIGIN === RELEASES_ORIGIN)) {
instance.RELEASE_ORIGIN = instance.PUBLIC_URL || instance.APP_URL || RELEASES_ORIGIN;
}
if (!instance.RELEASE_ORIGIN) instance.RELEASE_ORIGIN = RELEASES_ORIGIN;
var _o9 = { edition: flags.id, flags: {}, instance: instance };
for (var _o1 in flags) _o9.flags[_o1] = flags[_o1];
return _o9;
}
function scrubMap(ownerInstance) {
ownerInstance = ownerInstance || {};
var _oa = [];
var _o5 = function (u) { return String(u || '').replace(/^https?:\/\//, '').replace(/\/+$/, ''); };
var _o0 = function (from, to) { var _o2 = String(from == null ? '' : from).trim(); if (_o2 && _o2 !== to) _oa.push([_o2, to]); };
['APP_URL', 'PUBLIC_URL', 'LANDING_URL'].forEach(function (_o7) {
if (ownerInstance[_o7]) { _o0(String(ownerInstance[_o7]).replace(/\/+$/, ''), ''); _o0(_o5(ownerInstance[_o7]), ''); }
});
_o0(ownerInstance.LANDING_SHEET_ID, '');
_o0(ownerInstance.CHANNEL, 'Kênh của bạn');
_o0(ownerInstance.OWNER_NAME, '');
_o0(ownerInstance.OWNER_CCHN, '');
_oa.sort(function (a, b) { return b[0].length - a[0].length; });
return _oa;
}
return {
version: '1.0.0',
EDITIONS: EDITIONS, NEUTRAL_INSTANCE: NEUTRAL_INSTANCE, OWNER_KEYS: OWNER_KEYS,
RELEASES_REPO: RELEASES_REPO, RELEASES_ORIGIN: RELEASES_ORIGIN,
resolveEdition: resolveEdition, scrubMap: scrubMap
};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BDSEdition;
if (typeof globalThis !== 'undefined' && globalThis) globalThis.BDSEdition = BDSEdition;
if (typeof window !== 'undefined') window.BDSEdition = BDSEdition;
