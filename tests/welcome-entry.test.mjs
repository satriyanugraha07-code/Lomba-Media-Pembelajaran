import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { WELCOME_SEEN_KEY, hasSeenWelcome, rememberWelcome } from '../src/welcome-bumper.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bootstrap = html.match(/<script\b[^>]*\bid=["']welcome-bootstrap["'][^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(bootstrap, 'execute the actual early welcome bootstrap from index.html');

function memoryStorage(entries = []) {
  const values = new Map(entries);
  return {
    values,
    getItem(key) { return values.get(String(key)) ?? null; },
    setItem(key, value) { values.set(String(key), String(value)); }
  };
}

function browserEnvironment({ local = memoryStorage(), session = memoryStorage(), cookies = new Map(), cookieDenied = false } = {}) {
  const document = { documentElement: { dataset: {} } };
  Object.defineProperty(document, 'cookie', {
    get() {
      if (cookieDenied) throw new Error('Cookies are blocked');
      return [...cookies].map(([key, value]) => `${key}=${value}`).join('; ');
    },
    set(value) {
      if (cookieDenied) throw new Error('Cookies are blocked');
      const pair = String(value).split(';')[0];
      const separator = pair.indexOf('=');
      cookies.set(pair.slice(0, separator).trim(), pair.slice(separator + 1));
    }
  });
  const browser = {};
  for (const [name, storage] of [['localStorage', local], ['sessionStorage', session]]) {
    Object.defineProperty(browser, name, {
      get() {
        if (storage === null) throw new Error(`${name} is blocked`);
        return storage;
      }
    });
  }
  return { browser, document, cookies };
}

function runBootstrap(environment) {
  const timers = [];
  const context = {
    document: environment.document,
    setTimeout(callback, delay) { timers.push({ callback, delay }); return timers.length; }
  };
  for (const name of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(context, name, { get: () => environment.browser[name] });
  }
  runInNewContext(bootstrap, context, { filename: 'index.html#welcome-bootstrap' });
  return timers;
}

test('first entry welcomes once and a fresh reload skips as soon as entry is remembered', () => {
  const local = memoryStorage();
  const first = browserEnvironment({ local });
  assert.equal(hasSeenWelcome(first.browser, first.document), false);
  runBootstrap(first);
  assert.equal(first.document.documentElement.dataset.welcome, 'pending');
  assert.equal(local.getItem(WELCOME_SEEN_KEY), null, 'bootstrap alone does not prematurely mark an unseen welcome');

  // Entry is recorded before the animation completes, so refresh cannot replay it.
  rememberWelcome(first.browser, first.document);
  assert.equal(local.getItem(WELCOME_SEEN_KEY), '1');
  assert.equal(hasSeenWelcome(first.browser, first.document), true);
  const reload = browserEnvironment({ local });
  assert.equal(runBootstrap(reload).length, 0, 'seen entries do not schedule a blocking overlay');
  assert.equal(reload.document.documentElement.dataset.welcome, undefined);
  assert.equal(hasSeenWelcome(reload.browser, reload.document), true);
});

test('remembering welcome preserves worksheet, results, and progress data', () => {
  const entries = [
    ['draftlab_posttest_submissions', '[{"id":"example-result"}]'],
    ['draftlab_lkpd_job1_data', '{"nama":"Siswa","checked":[true,false]}'],
    ['draftlab_post_completed', 'true'],
    ['sdraft-progress', '{"tools":true,"lines":true}']
  ];
  const local = memoryStorage(entries);
  const environment = browserEnvironment({ local });
  runBootstrap(environment);
  rememberWelcome(environment.browser, environment.document);
  assert.deepEqual([...local.values], [...entries, [WELCOME_SEEN_KEY, '1']]);
  assert.equal(environment.cookies.size, 0, 'successful persistent storage needs no cookie writes');
});

test('session fallback is understood by both runtime and bootstrap when persistent storage is denied', () => {
  const session = memoryStorage();
  const first = browserEnvironment({ local: null, session, cookieDenied: true });
  runBootstrap(first);
  assert.equal(first.document.documentElement.dataset.welcome, 'pending');
  assert.doesNotThrow(() => rememberWelcome(first.browser, first.document));
  assert.equal(session.getItem(WELCOME_SEEN_KEY), '1');
  assert.equal(hasSeenWelcome(first.browser, first.document), true);
  const reload = browserEnvironment({ local: null, session, cookieDenied: true });
  assert.doesNotThrow(() => runBootstrap(reload));
  assert.equal(reload.document.documentElement.dataset.welcome, undefined);
  assert.equal(hasSeenWelcome(reload.browser, reload.document), true);
});

test('cookie fallback is understood by both runtime and a fresh bootstrap with both storages denied', () => {
  const cookies = new Map([['existing-preference', 'keep']]);
  const first = browserEnvironment({ local: null, session: null, cookies });
  runBootstrap(first);
  rememberWelcome(first.browser, first.document);
  assert.equal(cookies.get(WELCOME_SEEN_KEY), '1');
  assert.equal(cookies.get('existing-preference'), 'keep');
  assert.equal(hasSeenWelcome(first.browser, first.document), true);
  const reload = browserEnvironment({ local: null, session: null, cookies });
  assert.equal(runBootstrap(reload).length, 0);
  assert.equal(reload.document.documentElement.dataset.welcome, undefined);
  assert.equal(hasSeenWelcome(reload.browser, reload.document), true);
});

test('fallback also covers storages that can be read but reject writes', () => {
  const readOnlyStorage = {
    getItem() { return null; },
    setItem() { throw new Error('Quota exceeded'); }
  };
  const environment = browserEnvironment({ local: readOnlyStorage, session: readOnlyStorage });
  rememberWelcome(environment.browser, environment.document);
  assert.equal(hasSeenWelcome(environment.browser, environment.document), true);
  assert.equal(runBootstrap(environment).length, 0);
  assert.equal(environment.document.documentElement.dataset.welcome, undefined);
});

test('only the exact welcome marker skips entry; unrelated cookies and values remain unseen', () => {
  for (const value of ['', '0', 'false', 'true', '10']) {
    const environment = browserEnvironment({
      local: memoryStorage([[WELCOME_SEEN_KEY, value]]),
      session: memoryStorage([[WELCOME_SEEN_KEY, value]]),
      cookies: new Map([[WELCOME_SEEN_KEY, value], [`prefix_${WELCOME_SEEN_KEY}`, '1']])
    });
    assert.equal(hasSeenWelcome(environment.browser, environment.document), false);
    runBootstrap(environment);
    assert.equal(environment.document.documentElement.dataset.welcome, 'pending');
  }
});

test('all storage and cookie access blocked does not throw and startup cannot leave a pending overlay', () => {
  const environment = browserEnvironment({ local: null, session: null, cookieDenied: true });
  assert.doesNotThrow(() => rememberWelcome(environment.browser, environment.document));
  assert.equal(hasSeenWelcome(environment.browser, environment.document), false);
  let timers;
  assert.doesNotThrow(() => { timers = runBootstrap(environment); });
  assert.equal(environment.document.documentElement.dataset.welcome, 'pending');
  assert.equal(timers.length, 1);
  assert.ok(timers[0].delay > 0 && timers[0].delay <= 10000, 'startup has a bounded safety fallback');
  timers[0].callback();
  assert.equal(environment.document.documentElement.dataset.welcome, undefined, 'failed module startup releases the learning page');
});

test('bootstrap safety timeout leaves an already started bumper to its own lifecycle', () => {
  const environment = browserEnvironment();
  const timers = runBootstrap(environment);
  environment.document.documentElement.dataset.welcome = 'showing';
  timers[0].callback();
  assert.equal(environment.document.documentElement.dataset.welcome, 'showing');
});
