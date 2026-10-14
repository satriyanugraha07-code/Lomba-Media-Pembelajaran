import { publicAssetUrl } from './asset-url.js';

export function initVideoTutorial() {
  const section = document.getElementById('videos');
  if (!section) return;
  section.innerHTML = `<div class="video-lesson">
    <header class="video-hero">
      <div><p class="video-kicker">✦ RUANG VIDEO · GAMBAR TEKNIK</p><h2>Lihat caranya,<br><span>lalu coba sendiri.</span></h2><svg class="video-swoosh" viewBox="0 0 260 18" aria-hidden="true"><path d="M4 12Q122-3 256 10" fill="none" stroke="#edc451" stroke-width="5" stroke-linecap="round"/></svg><p>Belajar lewat video tutorial. Amati gerakan alatnya, jeda saat perlu, lalu ikuti langkahnya di kertasmu.</p></div>
      <div class="video-hero-art" aria-hidden="true"><span class="video-art-circle"></span><img src="${publicAssetUrl('ICON/video-tutorial.svg')}" width="180" height="160" alt=""><span class="video-art-note">Tonton, pahami, praktikkan.</span></div>
    </header>
    <div class="video-heading"><div><p class="video-kicker">KOLEKSI TUTORIAL</p><h3>Belajar satu langkah demi satu langkah.</h3></div><span class="video-coming-pill">Segera hadir</span></div>
    <div class="video-layout">
      <section class="video-empty" aria-labelledby="video-empty-title"><div class="video-empty-art" aria-hidden="true"><img src="${publicAssetUrl('ICON/video-tutorial.svg')}" width="180" height="160" alt=""></div><h3 id="video-empty-title">Video tutorial akan hadir di sini.</h3><p>Kumpulan video untuk menemani latihan gambar teknikmu. Sambil menunggu, kamu bisa mencoba materi dan lembar kerja.</p><button type="button" class="video-primary" data-open-module="lkpd">Buka lembar kerja <span aria-hidden="true">→</span></button></section>
      <aside class="video-tips" aria-labelledby="video-tips-title"><p class="video-kicker">CARA BELAJAR</p><h3 id="video-tips-title">Tonton pelan-pelan,<br>coba sampai paham.</h3><ol><li><span>01</span><div><strong>Amati gerakannya.</strong><p>Perhatikan posisi alat, titik awal, dan arah tarikan garis.</p></div></li><li><span>02</span><div><strong>Jeda, lalu praktikkan.</strong><p>Siapkan alat dan kertas. Coba satu langkah sebelum melanjutkan.</p></div></li><li><span>03</span><div><strong>Ulangi bagian yang perlu.</strong><p>Cocokkan hasilmu dengan contoh dan perbaiki perlahan.</p></div></li></ol><p class="video-handwritten">Sedikit demi sedikit, makin bisa.</p></aside>
    </div>
  </div>`;
}
