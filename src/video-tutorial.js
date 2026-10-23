const availableTutorials = [
  { id: '8zoXMge8FxQ', title: 'Segilima teratur di dalam lingkaran', topic: 'Segilima' },
  { id: 'vwqIhep8GD4', title: 'Segilima dengan sudut yang diketahui', topic: 'Segilima' },
  { id: '5aYEJI9uKIA', title: 'Segienam di dalam lingkaran', topic: 'Segienam' },
  { id: 'mndR0mjdX_g', title: 'Segienam di luar lingkaran', topic: 'Segienam' }
];
const totalTutorials = 25;
const tutorials = [
  ...availableTutorials,
  ...Array.from({ length: totalTutorials - availableTutorials.length }, (_, index) => ({
    title: `Tutorial ${String(availableTutorials.length + index + 1).padStart(2, '0')}`
  }))
];

const playIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13L19 12z"/></svg>';
const lockIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>';
const thumbnailUrl = (video) => `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

export function initVideoTutorial() {
  const section = document.getElementById('videos');
  if (!section || section.dataset.videoReady) return;
  section.dataset.videoReady = 'true';
  section.innerHTML = `<div class="video-lesson">
    <header class="video-intro">
      <div><h2>Lihat caranya, lalu praktikkan.</h2><p>Amati langkahnya, jeda videonya, lalu coba di kertasmu.</p></div><span class="video-total">${totalTutorials} tutorial</span>
    </header>
    <div class="video-layout">
      <section class="video-watch" aria-labelledby="video-player-title">
        <div class="video-player" data-video-player></div>
        <div class="video-watch-info">
          <div aria-live="polite"><p class="video-position" data-video-position></p><h3 id="video-player-title"></h3></div>
          <a class="video-youtube-link" data-video-youtube target="_blank" rel="noopener noreferrer">Buka di YouTube <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <section class="video-library" aria-labelledby="video-library-title">
        <div class="video-library-heading"><div><h3 id="video-library-title">Pilih video tutorial</h3><p>Tutorial gambar teknik oleh Satriya Nugraha.</p></div><div class="video-availability"><span>${availableTutorials.length} tersedia</span><span>${totalTutorials - availableTutorials.length} dalam pengembangan</span></div></div>
        <ol class="video-list">${tutorials.map((video, index) => {
          const number = String(index + 1).padStart(2, '0');
          if (!video.id) return `<li><button type="button" class="video-item video-item-upcoming" disabled aria-label="${video.title}: Video dalam pengembangan"><span class="video-item-image video-item-placeholder">${lockIcon}<span>${number}</span></span><span class="video-item-copy"><span class="video-item-title">${video.title}</span><span class="video-development">Video dalam pengembangan</span></span></button></li>`;
          return `<li><button type="button" class="video-item" data-video-id="${video.id}" aria-pressed="${index === 0}" aria-controls="video-player-title" aria-label="Putar video ${index + 1}: ${video.title}"><span class="video-item-image"><img src="${thumbnailUrl(video)}" alt="" width="480" height="360" loading="lazy"><span class="video-item-play">${playIcon}</span></span><span class="video-item-copy"><span class="video-item-topic">${number} · ${video.topic}</span><span class="video-item-title">${video.title}</span><span class="video-item-state">${index === 0 ? 'Dipilih' : 'Tonton video'}</span></span></button></li>`;
        }).join('')}</ol>
      </section>
    </div>
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
