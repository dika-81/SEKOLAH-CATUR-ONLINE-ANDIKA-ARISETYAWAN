export const STORAGE_KEY = 'sekolah-catur:progress:v1';
export function emptyProgress() { return { version: 1, lessons: [], exercises: [], lastLesson: null }; }
export function validateProgress(value) {
  if (!value || value.version !== 1 || !Array.isArray(value.lessons) || !Array.isArray(value.exercises)) throw new Error('Format cadangan tidak dikenali. Gunakan berkas ekspor Sekolah Catur.');
  const clean = (ids) => {
    if (ids.length > 5000 || ids.some(id => typeof id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(id))) throw new Error('Daftar kemajuan tidak valid.');
    return [...new Set(ids)];
  };
  const lastLesson = value.lastLesson;
  if (lastLesson !== null && (typeof lastLesson !== 'string' || !/^[a-z0-9-]{1,80}$/.test(lastLesson))) throw new Error('Pelajaran terakhir tidak valid.');
  return { version: 1, lessons: clean(value.lessons), exercises: clean(value.exercises), lastLesson };
}
export function createProgressStore(storage, onError = () => {}) {
  let memory = emptyProgress();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) memory = validateProgress(JSON.parse(raw));
  } catch { onError('Kemajuan tidak dapat dibaca. Sesi ini tetap bisa digunakan; ekspor cadangan sebelum menutup halaman.'); }
  function persist(next) {
    memory = validateProgress(next);
    try { storage.setItem(STORAGE_KEY, JSON.stringify(memory)); }
    catch { onError('Penyimpanan perangkat tidak tersedia atau penuh. Kemajuan sesi tetap aktif; gunakan Ekspor cadangan.'); }
    return structuredClone(memory);
  }
  return {
    get: () => structuredClone(memory),
    complete: (kind, id) => {
      if (!['lessons', 'exercises'].includes(kind)) throw new Error('Jenis kemajuan tidak dikenal.');
      return persist({ ...memory, [kind]: [...new Set([...memory[kind], id])] });
    },
    visit: id => persist({ ...memory, lastLesson: id }),
    import: value => persist(validateProgress(value)),
    reset: () => persist(emptyProgress()),
  };
}
