// Render the original PDF bytes locally; do not reconstruct or edit its contents.
export function initLkpdPdfReader(container) {
  const canvas = container.querySelector('canvas');
  const status = container.querySelector('[data-pdf-status]');
  const viewport = container.querySelector('.lkpd-pdf-viewport');
  const minus = container.querySelector('[data-pdf-zoom="out"]');
  const plus = container.querySelector('[data-pdf-zoom="in"]');
  const fit = container.querySelector('[data-pdf-zoom="fit"]');
  const label = container.querySelector('output');
  let disposed = false, started = false, drawing = false, queued = false;
  let loadingTask, pdf, page, renderTask, resizeTimer;
  let zoom = 1;
  let lastWidth = 0;

  const render = async () => {
    if (disposed || !page || viewport.clientWidth === 0) return;
    if (drawing) { queued = true; return; }
    drawing = true;
    try {
      const width = Math.min(860, viewport.clientWidth - 24);
      lastWidth = width;
      const base = page.getViewport({ scale: 1 });
      const view = page.getViewport({ scale: width / base.width * zoom });
      const pixelScale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(view.width * pixelScale);
      canvas.height = Math.ceil(view.height * pixelScale);
      canvas.style.width = `${view.width}px`;
      canvas.style.height = `${view.height}px`;
      renderTask = page.render({ canvasContext: canvas.getContext('2d'), viewport: view,
        transform: [pixelScale, 0, 0, pixelScale, 0, 0] });
      await renderTask.promise;
      if (disposed) return;
      canvas.hidden = false;
      status.textContent = 'PDF asli · Halaman 1 dari 1';
      minus.disabled = zoom <= 1;
      plus.disabled = zoom >= 2.5;
      fit.disabled = false;
      label.textContent = `${Math.round(zoom * 100)}%`;
    } catch (error) {
      if (!disposed && error.name !== 'RenderingCancelledException') status.textContent = 'PDF belum bisa ditampilkan. Gunakan tombol Buka PDF atau Unduh PDF.';
    } finally {
      drawing = false;
      if (queued && !disposed) { queued = false; render(); }
    }
  };
  const start = async () => {
    if (started || disposed) return;
    started = true;
    try {
      const [pdfjs, worker] = await Promise.all([
        import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')
      ]);
      if (disposed) return;
      pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
      loadingTask = pdfjs.getDocument({ url: container.dataset.sourcePdf });
      pdf = await loadingTask.promise;
      if (disposed) return;
      page = await pdf.getPage(1);
      await render();
    } catch {
      if (!disposed) status.textContent = 'PDF belum bisa ditampilkan. Gunakan tombol Buka PDF atau Unduh PDF.';
    }
  };
  container.querySelectorAll('[data-pdf-zoom]').forEach(button => button.addEventListener('click', () => {
    zoom = button.dataset.pdfZoom === 'fit' ? 1 : Math.max(1, Math.min(2.5, zoom + (button === plus ? .25 : -.25)));
    render();
  }));
  const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) start(); });
  observer.observe(container);
  const resize = new ResizeObserver(() => {
    const width = Math.min(860, viewport.clientWidth - 24);
    if (viewport.clientWidth === 0 || width === lastWidth) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 100);
  });
  resize.observe(viewport);
  return () => {
    disposed = true;
    observer.disconnect(); resize.disconnect(); clearTimeout(resizeTimer);
    renderTask?.cancel();
    loadingTask?.destroy().catch(() => {});
  };
}
