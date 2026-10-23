import { publicAssetUrl } from './asset-url.js';

function draftingArt() {
  return `<svg class="welcome-drafting" viewBox="0 0 600 570" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="welcome-cube-top" x2="0" y2="1"><stop stop-color="#e2f6ec"/><stop offset="1" stop-color="#b5dfcd"/></linearGradient>
      <linearGradient id="welcome-ruler-fill" x2="1" y2="1"><stop stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#c0e8f3" stop-opacity=".72"/></linearGradient>
    </defs>
    <g class="welcome-ruler welcome-float-a" transform="translate(64 109) rotate(-15)">
      <path class="welcome-draw welcome-draw-first" pathLength="1" d="M0 0V119H119Z" fill="url(#welcome-ruler-fill)" stroke="#44a8c4" stroke-width="2.1" stroke-linejoin="round"/>
      <path class="welcome-draw welcome-draw-second" pathLength="1" d="M23 47V94H70ZM7 14h9m-9 11h6m-6 11h9m-9 11h6m-6 11h9m-9 11h6m-6 11h9m-9 11h6m-6 11h9m5 7v-9m11 9v-6m11 6v-9m11 9v-6m11 6v-9m11 9v-6m11 6v-9" fill="none" stroke="#078bad" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <g class="welcome-pencil welcome-float-b" transform="translate(481 83) rotate(26)">
      <path class="welcome-tool-fill" d="M-12 10V97L0 120 12 97V10Z" fill="#f4cd63"/>
      <path class="welcome-tool-fill" d="M-12 10V0Q0-8 12 0V10Z" fill="#71c6c1"/>
      <path class="welcome-tool-fill" d="M-12 97 0 120 12 97Z" fill="#f9e2b8"/>
      <path class="welcome-tool-fill" d="m-5 110 5 10 5-10Z" fill="#143253"/>
      <path class="welcome-draw welcome-draw-second" pathLength="1" d="M-12 10V0Q0-8 12 0V97L0 120-12 97V10ZM-12 10H12M-12 97H12M0 13V93" fill="none" stroke="#b78e29" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <g class="welcome-cube welcome-float-c" transform="translate(52 406)">
      <path class="welcome-cube-fill" d="m0 0 61-35 62 35-62 36Z" fill="url(#welcome-cube-top)"/>
      <path class="welcome-cube-fill" d="m0 0 61 36v71L0 72Z" fill="#b1dccb"/>
      <path class="welcome-cube-fill" d="m61 36 62-36v72l-62 35Z" fill="#73b7a3"/>
      <path class="welcome-draw welcome-draw-third" pathLength="1" d="m0 0 61-35 62 35v72l-62 35L0 72V0Zm0 0 61 36 62-36M61 36v71" fill="none" stroke="#368d80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="welcome-draw welcome-draw-fourth" pathLength="1" d="M-19 79v29m-7-24 14 8m-14 18 14 8m-7-26v21M-19 109l61 35m6-19 16 9m59-34 16 9m-83 20 65-38" fill="none" stroke="#72b8be" stroke-width="1.25"/>
    </g>
    <path class="welcome-draw welcome-orbit" pathLength="1" d="M62 331C-12 230 57 99 213 71M493 363c95-51 81-190 5-222M212 515c101 48 225 24 283-66" fill="none" stroke="#a5dbe5" stroke-width="1.5" stroke-dasharray="4 8" stroke-linecap="round"/>
    <g class="welcome-spark welcome-spark-a" fill="#e7b849"><path d="m171 59 4 14 14 4-14 4-4 14-4-14-14-4 14-4Z"/><circle cx="192" cy="111" r="3"/></g>
    <g class="welcome-spark welcome-spark-b" fill="#11a2b6"><path d="m514 325 3 11 11 3-11 3-3 11-3-11-11-3 11-3Z"/><circle cx="535" cy="303" r="3"/></g>
    <g class="welcome-spark welcome-spark-c" fill="#e7b849"><path d="m459 460 4 15 15 4-15 4-4 15-4-15-15-4 15-4Z"/><circle cx="488" cy="447" r="3"/></g>
    <g class="welcome-dots" fill="#71beba"><circle cx="109" cy="316" r="4"/><circle cx="130" cy="324" r="2"/><circle cx="396" cy="63" r="3"/><circle cx="420" cy="78" r="2"/></g>
  </svg>`;
}

export function renderWelcomeBumper() {
  return `<div id="welcome-bumper" class="welcome-bumper" role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby="welcome-description" tabindex="-1">
    <div class="welcome-background" aria-hidden="true"><span class="welcome-background-orb"></span><span class="welcome-background-grid"></span></div>
    <div class="welcome-topline" aria-hidden="true"><span class="welcome-brand-dot"></span><span>Ruang belajar gambar teknik</span><span class="welcome-topline-rule"></span></div>
    <div class="welcome-stage">
      <div class="welcome-copy">
        <span class="welcome-eyebrow welcome-reveal welcome-reveal-one"><span></span>Ide bagus dimulai dari satu garis.</span>
        <h1 id="welcome-title" class="welcome-title"><span class="welcome-greeting welcome-reveal welcome-reveal-two">Selamat datang di</span><span class="welcome-logo-wrap welcome-reveal welcome-reveal-three"><img class="welcome-logo" src="${publicAssetUrl('brand/arcus-logo.png')}" alt="ARCUS — Precision Starts Here." width="1359" height="445" fetchpriority="high" decoding="async"></span></h1>
        <p id="welcome-description" class="welcome-description welcome-reveal welcome-reveal-four">Dari garis sederhana,<br>jadi <strong>karya nyata.</strong></p>
        <div class="welcome-bottom-copy welcome-reveal welcome-reveal-five"><span class="welcome-handwritten">Yuk, mulai gambar ceritamu!</span><svg viewBox="0 0 90 55" aria-hidden="true"><path d="M5 8c18 36 42 34 55 26m-13-7 16 6-5 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      </div>
      <div class="welcome-art" aria-hidden="true">
        <div class="welcome-art-halo"></div>
        <div class="welcome-mascot-shadow"></div>
        ${draftingArt()}
        <div class="welcome-mascot"><img src="${publicAssetUrl('images/welcome-mascot.png')}" alt="" width="1312" height="1199" fetchpriority="high" decoding="async"></div>
        <span class="welcome-hello">Halo, calon drafter!<svg viewBox="0 0 21 16" aria-hidden="true"><path d="m1 1 6 12 12-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </div>
    </div>
    <div class="welcome-footer"><div class="welcome-progress" aria-hidden="true"><span></span></div><button id="welcome-enter" class="welcome-enter" type="button"><span>Masuk sekarang</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
  </div>`;
}
