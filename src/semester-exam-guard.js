// Browser supervision is best-effort; it cannot lock the OS or prevent closing a browser.
export function createSemesterGuard({ section, onViolation, onSave, onBlocked, environment = {} }) {
  const page = environment.document || document;
  const browser = environment.window || window;
  const schedule = environment.setTimeout || setTimeout;
  const cancel = environment.clearTimeout || clearTimeout;
  let active = false, paused = false, usedFullscreen = false, focusTimer;
  let originalState, originalUrl, wakeLock;
  const listeners = [];
  const listen = (target, name, handler, options) => {
    target.addEventListener(name, handler, options);
    listeners.push(() => target.removeEventListener(name, handler, options));
  };
  const violation = reason => {
    if (!active || paused) return;
    paused = true;
    onViolation(reason);
  };
  const requestFullscreen = async () => {
    const request = section.requestFullscreen || section.webkitRequestFullscreen;
    const capable = request && page.fullscreenEnabled !== false;
    if (!capable) { usedFullscreen = false; return 'monitored'; }
    await request.call(section);
    if (!(page.fullscreenElement || page.webkitFullscreenElement)) throw new Error('Layar penuh belum aktif. Izinkan layar penuh, lalu coba lagi.');
    usedFullscreen = true;
    return 'fullscreen';
  };
  const requestWakeLock = async () => {
    try {
      if (!wakeLock && browser.navigator?.wakeLock && page.visibilityState !== 'hidden') {
        const lock = await browser.navigator.wakeLock.request('screen');
        if (!active) { await lock.release(); return; }
        wakeLock = lock;
        lock.addEventListener?.('release', () => { if (wakeLock === lock) wakeLock = null; });
      }
    } catch { /* Supervision does not depend on wake lock support. */ }
  };
  const leaveFullscreen = () => {
    try {
      if (page.fullscreenElement === section && page.exitFullscreen) page.exitFullscreen().catch(() => {});
      else if (page.webkitFullscreenElement === section) page.webkitExitFullscreen?.();
    } catch {}
  };
  const begin = ({ startPaused = false } = {}) => {
    if (active) return;
    active = true; paused = startPaused;
    originalState = browser.history.state; originalUrl = browser.location.href;
    browser.history.pushState({ ...originalState, semesterExam: section.id }, '', originalUrl);
    page.body.classList.add('semester-exam-active');
    section.dataset.examRunning = 'true';
    const focus = () => {
      cancel(focusTimer);
      focusTimer = schedule(() => { if (!page.hasFocus()) violation('Jendela ujian kehilangan fokus.'); }, 300);
    };
    listen(page, 'visibilitychange', () => {
      if (page.hidden || page.visibilityState === 'hidden') violation('Beralih tab atau aplikasi dari ruang ujian.');
      else requestWakeLock();
    });
    listen(browser, 'blur', focus);
    const fullscreen = () => {
      if (usedFullscreen && !(page.fullscreenElement || page.webkitFullscreenElement)) violation('Keluar dari layar penuh saat ujian berlangsung.');
    };
    listen(page, 'fullscreenchange', fullscreen);
    listen(page, 'webkitfullscreenchange', fullscreen);
    listen(browser, 'beforeunload', event => { onSave(); event.preventDefault(); event.returnValue = ''; });
    listen(browser, 'pagehide', () => { violation('Halaman ujian ditutup, dimuat ulang, atau ditinggalkan.'); onSave(); });
    listen(browser, 'pageshow', event => { if (event.persisted) violation('Kembali ke sesi ujian setelah meninggalkan halaman.'); });
    listen(browser, 'popstate', () => {
      browser.history.pushState({ semesterExam: section.id }, '', originalUrl);
      violation('Mencoba meninggalkan ujian dengan tombol kembali.');
      onBlocked();
    });
    listen(page, 'click', event => {
      const target = event.target.closest?.('[data-target], [data-module], [data-open-module], a[href]');
      if (!target || section.contains(target) && !target.matches('a[href]')) return;
      const module = target.dataset.target || target.dataset.module || target.dataset.openModule;
      if (module === section.id) return;
      event.preventDefault(); event.stopImmediatePropagation();
      violation('Mencoba membuka halaman atau modul lain saat ujian.');
      onBlocked();
    }, true);
    listen(page, 'keydown', event => {
      if (event.key === 'F5' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r') || (event.altKey && ['ArrowLeft', 'ArrowRight'].includes(event.key))) {
        event.preventDefault();
        violation('Mencoba memuat ulang atau meninggalkan ruang ujian.');
        onBlocked();
      }
    }, true);
    requestWakeLock();
  };
  return {
    requestFullscreen,
    begin,
    async resume() {
      if (!active) throw new Error('Sesi ujian sudah berakhir.');
      const mode = await requestFullscreen();
      if (!active) {
        leaveFullscreen();
        throw new Error('Sesi ujian sudah berakhir.');
      }
      paused = false;
      requestWakeLock();
      return mode;
    },
    stop() {
      if (!active) return;
      active = false; paused = false;
      cancel(focusTimer);
      listeners.splice(0).forEach(remove => remove());
      page.body.classList.remove('semester-exam-active');
      delete section.dataset.examRunning;
      if (browser.history.state?.semesterExam === section.id) browser.history.replaceState(originalState, '', originalUrl);
      try { wakeLock?.release(); } catch {}
      wakeLock = null;
      leaveFullscreen();
      usedFullscreen = false;
    }
  };
}
