import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { LKPD_JOB2 } from '../src/lkpd-job2.js';
import { lkpdMarkup } from '../src/lkpd-markup.js';

test('Job 2 embeds the original PDF directly and keeps access to Job 1', () => {
  const html = lkpdMarkup(LKPD_JOB2);
  assert.match(html, /data-lkpd-job="1"/);
  assert.match(html, /data-lkpd-job="2" aria-pressed="true"/);
  assert.match(html, /data-source-pdf="\/worksheets\/job-2-bagian-1.pdf"/);
  assert.match(html, /<canvas[^>]*aria-label="Halaman asli PDF Job 2 Bagian 1"/);
  assert.match(html, /download="JOB 2 Bagian 1.pdf"/);
  assert.doesNotMatch(html, /data-pattern=|lkpd-pattern-modal|lkpd-identity|lkpd-reset-dialog/);
});

test('served Job 2 is the unchanged user PDF', () => {
  const pdf = readFileSync(new URL('../public/worksheets/job-2-bagian-1.pdf', import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.equal(createHash('sha256').update(pdf).digest('hex'), '85d1155b7db59c7cb82b5bd68608ba4dc7783759ed099cb3e7618bd6df4dab88');
});
