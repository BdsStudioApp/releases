export const FLAG_KEY = 'bds:flag:wizard';
function _o1() { try { return globalThis.localStorage || null; } catch { return null; } }
export function wizardEnabled({ config = {}, search = (typeof location !== 'undefined' ? location.search : ''), storage = _o1() } = {}) {
let _o0 = null;
try { _o0 = new URLSearchParams(search || '').get('wizard'); } catch { _o0 = null; }
try { if (_o0 === '1' && storage) storage.setItem(FLAG_KEY, '1'); if (_o0 === '0' && storage) storage.removeItem(FLAG_KEY); } catch { }
if (_o0 === '0') return false;
if (_o0 === '1') return true;
if (config && config.FEATURES && config.FEATURES.wizard === true) return true;
try { return !!storage && storage.getItem(FLAG_KEY) === '1'; } catch { return false; }
}
export function firstVisitNoServer({ api, config = {}, search, storage = _o1() } = {}) {
if (!api || api.mode !== 'demo' || api.token) return false;
if (!wizardEnabled({ config, storage, ...(search === undefined ? {} : { search }) })) return false;
try { return !!storage && !storage.getItem('bds_mock') && !storage.getItem('bds_mock_secret'); } catch { return false; }
}
export default wizardEnabled;
