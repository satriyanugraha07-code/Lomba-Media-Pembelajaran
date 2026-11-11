import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('the app loads its base layout before lesson styles', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const entry = new URL('../src/app.css', import.meta.url);
  assert.match(html, /<link\s+rel=["']stylesheet["']\s+href=["']\/src\/app\.css["']/);

  const firstImport = readFileSync(entry, 'utf8').match(/@import\s+["']([^"']+)["']/);
  assert.equal(firstImport?.[1], '../styles.css');

  const base = readFileSync(new URL(firstImport[1], entry), 'utf8');
  assert.match(base, /\.app-container\s*\{[^}]*\bdisplay:\s*flex\s*;/);
  assert.match(base, /\.app-section\s*\{[^}]*\bdisplay:\s*none\s*;/);
  assert.match(base, /\.app-section\.active\s*\{[^}]*\bdisplay:\s*flex\s*;/);
});
