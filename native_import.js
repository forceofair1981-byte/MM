// Native Files picker bridge. Falls back to the standard <input type="file"> in Safari/PWA.
// The selected Atlas data or legacy JSON is NEVER restored until the existing import confirmation accepts it.
const MAX_BACKUP_BYTES = 15 * 1024 * 1024;
const MAX_CHUNKS = 100;

export function installNativeBackupImport({ webLabel, nativeButton, onFile, onError }) {
  const handler = globalThis.window?.webkit?.messageHandlers?.muscleAtlasImport;
  if (!handler || !webLabel || !nativeButton) return false;

  webLabel.style.display = 'none';
  nativeButton.style.display = '';
  let requestId = null;
  let received = null;
  function idle() {
    requestId = null;
    received = null;
    nativeButton.disabled = false;
  }
  function reject(message) {
    idle();
    onError('保存データを読み込めません：' + message);
  }

  nativeButton.addEventListener('click', () => {
    if (requestId) return;
    requestId = 'ma-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
    nativeButton.disabled = true;
    try {
      handler.postMessage({ action: 'chooseBackup', requestId });
    } catch (error) {
      reject(error.message || 'iOSのファイル選択を開始できませんでした');
    }
  });

  // Native hands off bounded base64 chunks via WKWebView.evaluateJavaScript.
  // Sequential offsets and a strict total size guard prevent partial or mixed imports.
  globalThis.window.__muscleAtlasNativeImportChunk = payload => {
    if (!payload || payload.requestId !== requestId || !requestId) return false;
    const { index, total, base64, fileName } = payload;
    if (!Number.isInteger(index) || !Number.isInteger(total) || total < 1 || total > MAX_CHUNKS ||
        typeof base64 !== 'string' || base64.length > 400_000) {
      reject('不正なファイルデータです');
      return false;
    }
    if (index === 0) received = { total, name: String(fileName || 'AtlasVault.mapro'), chunks: [], bytes: 0 };
    if (!received || received.total !== total || index !== received.chunks.length) {
      reject('ファイルの受信順序を確認できませんでした');
      return false;
    }
    try {
      const decoded = atob(base64);
      if (received.bytes + decoded.length > MAX_BACKUP_BYTES) throw Error('15MBを超えています');
      const bytes = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
      received.chunks.push(bytes);
      received.bytes += bytes.length;
      return true;
    } catch (error) {
      reject(error.message || '転送データを読み取れませんでした');
      return false;
    }
  };

  globalThis.window.__muscleAtlasNativeImportComplete = payload => {
    if (!payload || payload.requestId !== requestId || !requestId) return false;
    if (!received || received.chunks.length !== received.total || received.bytes === 0) {
      reject('ファイルが最後まで届きませんでした');
      return false;
    }
    const { chunks, bytes, name } = received;
    const combined = new Uint8Array(bytes);
    let position = 0;
    for (const chunk of chunks) { combined.set(chunk, position); position += chunk.length; }
    // All validation, merge/replace confirmation, and persistence remain in importJSON().
    Promise.resolve().then(() => onFile(new File([combined], name, { type: 'application/json' })))
      .catch(error => onError('復元に失敗：' + (error?.message || String(error))))
      .finally(idle);
    return true;
  };

  globalThis.window.__muscleAtlasNativeImportFailure = payload => {
    if (!payload || payload.requestId !== requestId || !requestId) return false;
    if (payload.cancelled) idle();
    else reject(String(payload.message || 'ファイルを開けませんでした'));
    return true;
  };
  return true;
}
