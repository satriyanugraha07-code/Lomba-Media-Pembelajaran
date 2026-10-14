import { publicAssetUrl } from './asset-url.js';

const tutorials = [
  { id: '8zoXMge8FxQ', title: 'Segilima teratur di dalam lingkaran', topic: 'Segilima' },
  { id: 'vwqIhep8GD4', title: 'Segilima dengan sudut yang diketahui', topic: 'Segilima' },
  { id: '5aYEJI9uKIA', title: 'Segienam di dalam lingkaran', topic: 'Segienam' },
  { id: 'mndR0mjdX_g', title: 'Segienam di luar lingkaran', topic: 'Segienam' }
];

const playIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13L19 12z"/></svg>';
const thumbnailUrl = (video) => `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

export function initVideoTutorial() {
  const section = document.getElementById('videos');
  if (!section || section.dataset.videoReady) return;
  section.dataset.videoReady = 'true';
  section.innerHTML = `<div class="video-lesson">
    <header class="video-hero">
      <div><p class="video-kicker">✦ RUANG VIDEO · GAMBAR TEKNIK</p><h2>Lihat caranya,<br><span>lalu coba sendiri.</span></h2><svg class="video-swoosh" viewBox="0 0 260 18" aria-hidden="true"><path d="M4 12Q122-3 256 10" fill="none" stroke="#edc451" stroke-width="5" stroke-linecap="round"/></svg><p>Belajar lewat video tutorial. Amati gerakan alatnya, jeda saat perlu, lalu ikuti langkahnya di kertasmu.</p></div>
      <div class="video-hero-art" aria-hidden="true"><span class="video-art-circle"></span><img src="${publicAssetUrl('ICON/video-tutorial.svg')}" width="180" height="160" alt=""><span class="video-art-note">Tonton, pahami, praktikkan.</span></div>
    </header>
    <div class="video-heading"><div><p class="video-kicker">KOLEKSI TUTORIAL</p><h3>Belajar satu langkah demi satu langkah.</h3></div><span class="video-count-pill">4 video · Satriya Nugraha</span></div>
    <div class="video-layout">
      <section class="video-watch" aria-labelledby="video-player-title">
        <div class="video-player" data-video-player></div>
        <div class="video-watch-info">
          <div aria-live="polite"><p class="video-kicker" data-video-position></p><h3 id="video-player-title"></h3></div>
          <p>Pakai tombol jeda untuk mengikuti langkahnya. Kamu juga bisa memperbesar video lewat tombol layar penuh.</p>
          <a class="video-youtube-link" data-video-youtube target="_blank" rel="noopener noreferrer">Buka di YouTube <span aria-hidden="true">↗</span></a>
          <p class="video-fallback">Jika video tidak bisa diputar di sini, buka langsung di YouTube.</p>
        </div>
      </section>
      <aside class="video-library" aria-labelledby="video-library-title">
        <p class="video-kicker">PILIH TUTORIAL</p><h3 id="video-library-title">Mau belajar yang mana?</h3>
        <ol class="video-list">${tutorials.map((video, index) => `<li><button type="button" class="video-item" data-video-id="${video.id}" aria-pressed="${index === 0}" aria-controls="video-player-title" aria-label="Putar video ${index + 1}: ${video.title}"><span class="video-item-image"><img src="${thumbnailUrl(video)}" alt="" width="480" height="360" loading="lazy"><span class="video-item-play">${playIcon}</span></span><span class="video-item-copy"><span class="video-item-topic">0${index + 1} · ${video.topic}</span><span class="video-item-title">${video.title}</span><span class="video-item-state">${index === 0 ? 'Dipilih' : 'Tonton video'}</span></span></button></li>`).join('')}</ol>
        <p class="video-library-note">Pilih video, lalu ikuti gerakannya di kertasmu.</p>
      </aside>
    </div>
    <aside class="video-tips" aria-labelledby="video-tips-title"><div class="video-tips-heading"><div><p class="video-kicker">CARA BELAJAR</p><h3 id="video-tips-title">Tonton pelan-pelan,<br>coba sampai paham.</h3></div><button type="button" class="video-primary" data-open-module="lkpd">Buka lembar kerja <span aria-hidden="true">→</span></button></div><ol><li><span>01</span><div><strong>Amati gerakannya.</strong><p>Perhatikan posisi alat, titik awal, dan arah tarikan garis.</p></div></li><li><span>02</span><div><strong>Jeda, lalu praktikkan.</strong><p>Siapkan alat dan kertas. Coba satu langkah sebelum melanjutkan.</p></div></li><li><span>03</span><div><strong>Ulangi bagian yang perlu.</strong><p>Cocokkan hasilmu dengan contoh dan perbaiki perlahan.</p></div></li></ol><p class="video-handwritten">Sedikit demi sedikit, makin bisa.</p></aside>
  </div>`;

  const player = section.querySelector('[data-video-player]');
  const title = section.querySelector('#video-player-title');
  const position = section.querySelector('[data-video-position]');
  const youtubeLink = section.querySelector('[data-video-youtube]');
  const buttons = [...section.querySelectorAll('[data-video-id]')];
  let selected = tutorials[0];

  const showPreview = () => {
    player.innerHTML = `<button type="button" class="video-preview" aria-label="Putar ${selected.title}"><img src="${thumbnailUrl(selected)}" alt="" width="480" height="360"><span class="video-preview-shade"></span><span class="video-preview-action"><span class="video-preview-play">${playIcon}</span><span>Putar tutorial</span></span><span class="video-preview-label">GAMBAR TEKNIK · ${selected.topic.toUpperCase()}</span></button>`;
    player.querySelector('button').addEventListener('click', playSelected);
  };

  const playSelected = () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${selected.id}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = selected.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(iframe);
    iframe.focus({ preventScroll: true });
  };

  const selectVideo = (video) => {
    selected = video;
    title.textContent = video.title;
    position.textContent = `TUTORIAL ${tutorials.indexOf(video) + 1} DARI ${tutorials.length} · ${video.topic.toUpperCase()}`;
    youtubeLink.href = `https://youtu.be/${video.id}`;
    buttons.forEach((button) => {
      const isSelected = button.dataset.videoId === video.id;
      button.setAttribute('aria-pressed', String(isSelected));
      button.querySelector('.video-item-state').textContent = isSelected ? 'Dipilih' : 'Tonton video';
    });
    showPreview();
  };

  buttons.forEach((button) => button.addEventListener('click', () => {
    const video = tutorials.find((entry) => entry.id === button.dataset.videoId);
    if (video === selected && player.querySelector('iframe')) return;
    selectVideo(video);
    playSelected();
    player.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }));
  selectVideo(selected);

  // Removing the player stops its audio when the learner opens another module.
  new MutationObserver(() => {
    if (!section.classList.contains('active') && player.querySelector('iframe')) showPreview();
  }).observe(section, { attributes: true, attributeFilter: ['class'] });
}
