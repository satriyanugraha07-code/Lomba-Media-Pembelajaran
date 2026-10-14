import { renderWelcomeBumper } from './welcome-bumper-markup.js';

export const WELCOME_SEEN_KEY = 'sdraft_welcome_seen';

export function hasSeenWelcome(browser = window, page = document) {
  for (const storage of ['localStorage', 'sessionStorage']) {
    try { if (browser[storage].getItem(WELCOME_SEEN_KEY) === '1') return true; } catch {}
  }
  try { return page.cookie.split(';').some(value => value.trim() === `${WELCOME_SEEN_KEY}=1`); } catch { return false; }
}

export function rememberWelcome(browser = window, page = document) {
  try { browser.localStorage.setItem(WELCOME_SEEN_KEY, '1'); return; } catch {}
  // Some private browsers reject persistent storage but allow a session or cookie.
  try { browser.sessionStorage.setItem(WELCOME_SEEN_KEY, '1'); } catch {}
  try { page.cookie = `${WELCOME_SEEN_KEY}=1; Max-Age=31536000; Path=/; SameSite=Lax`; } catch {}
}

export function initWelcomeBumper() {
  const root = document.documentElement;
  if (root.dataset.welcome !== 'pending' || document.getElementById('welcome-bumper')) return;
  if (hasSeenWelcome()) {
    delete root.dataset.welcome;
    return;
  }

  const template = document.createElement('template');
  template.innerHTML = renderWelcomeBumper();
  const bumper = template.content.firstElementChild;
  document.body.append(bumper);
  // Mark at entry, so even refreshing in the middle will not replay the bumper.
  rememberWelcome();
  const app = document.querySelector('.app-container');
  const previousInert = app?.inert || false;
  const previousOverflow = document.body.style.overflow;
  const previousRootOverflow = root.style.overflow;
  const previousFocus = document.activeElement;
  if (app) app.inert = true;
  document.body.style.overflow = 'hidden';
  root.style.overflow = 'hidden';
  root.dataset.welcome = 'showing';

  let leaving = false;
  let finished = false;
  let autoTimer;
  let exitTimer;
  let safetyTimer;
  let imageTimer;
  let imageReady = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const enterButton = bumper.querySelector('#welcome-enter');

  const finish = () => {
    if (finished) return;
    finished = true;
    [autoTimer, exitTimer, safetyTimer, imageTimer].forEach(clearTimeout);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    reduceMotion.removeEventListener('change', onMotionChange);
    bumper.remove();
    if (app) app.inert = previousInert;
    document.body.style.overflow = previousOverflow;
    root.style.overflow = previousRootOverflow;
    delete root.dataset.welcome;
    const focusTarget = previousFocus !== document.body && previousFocus?.isConnected
      ? previousFocus : document.querySelector('#dashboard h1');
    if (focusTarget) {
      const oldTabindex = focusTarget.getAttribute('tabindex');
      if (oldTabindex === null) focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
      if (oldTabindex === null) focusTarget.removeAttribute('tabindex');
    }
  };
  const leave = () => {
    if (leaving || finished) return;
    leaving = true;
    clearTimeout(autoTimer);
    bumper.classList.add('is-leaving');
    exitTimer = setTimeout(finish, reduceMotion.matches ? 0 : 420);
  };
  const onKeyDown = event => {
    if (event.key === 'Escape') { event.preventDefault(); leave(); }
    // The only control stays reachable without tabbing into the learning page.
    if (event.key === 'Tab') { event.preventDefault(); enterButton?.focus(); }
  };
  const onVisibilityChange = () => { if (document.hidden) finish(); };
  const onMotionChange = () => { if (reduceMotion.matches) leave(); };
  const start = () => {
    if (imageReady || leaving || finished) return;
    imageReady = true;
    clearTimeout(imageTimer);
    bumper.dataset.welcomeReady = 'true';
    // A short welcome, then the page opens itself. The button can skip at any time.
    autoTimer = setTimeout(leave, reduceMotion.matches ? 1600 : 5200);
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('visibilitychange', onVisibilityChange);
  reduceMotion.addEventListener('change', onMotionChange);
  enterButton?.addEventListener('click', leave);
  bumper.focus({ preventScroll: true });
  safetyTimer = setTimeout(finish, 8500);
  // Begin as soon as the mascot is decoded, with a bounded wait on slow networks.
  imageTimer = setTimeout(start, 1300);
  const mascot = bumper.querySelector('.welcome-mascot img');
  if (mascot?.decode) mascot.decode().then(start, start);
  else start();
}
