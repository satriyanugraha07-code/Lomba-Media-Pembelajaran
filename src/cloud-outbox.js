// Persist before network I/O. An acknowledgement can only remove its own revision.
export function createOutbox({ storage, key, send, onChange = () => {}, onClosed = () => {} }) {
  let entries = {}, versions = {}, running = false;
  const saved = storage.getItem(key);
  if (saved) {
    const parsed = JSON.parse(saved); entries = parsed.entries; versions = parsed.versions;
    if (!entries || Array.isArray(entries) || typeof entries !== 'object') throw new Error('Antrean sinkronisasi tidak dapat dibaca.');
    if (!versions || Array.isArray(versions) || typeof versions !== 'object') throw new Error('Versi sinkronisasi tidak dapat dibaca.');
  }
  const write = () => storage.setItem(key, JSON.stringify({ entries, versions }));
  return {
    pending: () => Object.keys(entries).length,
    snapshot: () => structuredClone(entries),
    enqueue(attempt) {
      const previous = entries[attempt.id];
      if (previous?.status === 'submitted' && attempt.status !== 'submitted') return previous;
      const next = structuredClone({ ...attempt, revision: Math.max(attempt.revision || 0, versions[attempt.id] || 0) + 1 });
      versions[attempt.id] = next.revision;
      entries[attempt.id] = next; write(); onChange({ state: 'pending', count: this.pending() }); return next;
    },
    async flush() {
      if (running) return;
      running = true;
      try {
        for (const id of Object.keys(entries)) {
          const sent = structuredClone(entries[id]);
          const ack = await send(sent);
          if (ack.id !== sent.id || ack.revision !== sent.revision) throw new Error('Google Sheets belum mengonfirmasi versi jawaban ini.');
          if (ack.stale) {
            if (!Number.isSafeInteger(ack.currentRevision)) throw new Error('Versi server tidak sesuai.');
            const newer = entries[id];
            versions[id] = Math.max(versions[id],ack.currentRevision)+1;
            entries[id] = {...newer,revision:versions[id]}; write(); continue;
          }
          if (entries[id]?.revision === sent.revision || ack.closed) { delete entries[id]; write(); }
          if (ack.closed) onClosed(ack.attempt);
        }
        onChange({ state: Object.keys(entries).length ? 'pending' : 'synced', count: Object.keys(entries).length });
      } catch (error) { onChange({ state: error.code === 'AUTH_REQUIRED' ? 'auth' : 'error', error: error.message, count: Object.keys(entries).length }); throw error; }
      finally { running = false; }
    }
  };
}
