// Muscle Atlas Pro: local user identity and proprietary backup filename.
// A UUIDv4 uses 122 random bits; it is not a server-enforced unique account or license key.
export const SERIAL_PATTERN = /^MAP-[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/;
export const BACKUP_EXTENSION = '.mapro';

export function createUserSerial(cryptoSource=globalThis.crypto) {
  if (!cryptoSource) throw new Error('安全な乱数を利用できないためシリアルを発行できません');
  let uuid;
  if (typeof cryptoSource.randomUUID === 'function') uuid = cryptoSource.randomUUID();
  else if (typeof cryptoSource.getRandomValues === 'function') {
    const bytes = cryptoSource.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(x=>x.toString(16).padStart(2,'0')).join('');
    uuid = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  } else throw new Error('安全な乱数を利用できないためシリアルを発行できません');
  const serial='MAP-'+String(uuid).toUpperCase();
  if (!SERIAL_PATTERN.test(serial)) throw new Error('シリアル生成に失敗しました');
  return serial;
}
export const validUserSerial = x => typeof x === 'string' && SERIAL_PATTERN.test(x);
export const normalizeUserSerial = (x, generate=createUserSerial) => validUserSerial(x) ? x : generate();
// Include the local clock to avoid overwriting multiple daily exports in Files.
export function backupFileName(date, at=new Date()) {
  const hhmmss=[at.getHours(),at.getMinutes(),at.getSeconds()].map(n=>String(n).padStart(2,'0')).join('');
  return `AtlasVault_${String(date).replace(/[^0-9-]/g,'')}_${hhmmss}${BACKUP_EXTENSION}`;
}
export const supportedBackupName = name => /\.(?:mapro|json)$/i.test(String(name||''));
