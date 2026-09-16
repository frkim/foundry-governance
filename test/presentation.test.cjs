const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const source = readFileSync(path.join(root, 'presentation/slides.md'), 'utf8');
const html = readFileSync(path.join(root, '_site/index.html'), 'utf8');
const slides = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)];

test('build produces a titled English HTML deck with every source slide', () => {
  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>Microsoft Foundry Enterprise Governance<\/title>/);
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const expectedSlides = body.split(/\r?\n---\r?\n/).length;
  assert.ok(expectedSlides > 1);
  assert.equal(slides.length, expectedSlides);
  slides.forEach(([slide], index) => {
    assert.ok(slide.startsWith(`<section id="${index + 1}" `));
    assert.match(slide, /<h1[^>]*>.+?<\/h1>/);
  });
});

test('deck includes controls, limitations, and source references', () => {
  for (let control = 1; control <= 12; control++) {
    assert.ok(html.includes(`GOV-${String(control).padStart(2, '0')}`));
  }
  assert.ok(html.includes('not a certified implementation'));
  assert.ok(html.includes('references/microsoft-foundry.md'));
});

test('presentation assets are embedded, with no external scripts or stylesheets', () => {
  assert.match(html, /<script>/);
  assert.match(html, /<style>/);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=/i);
  assert.doesNotMatch(html, /<link\b[^>]*\brel=["']stylesheet["']/i);
  assert.doesNotMatch(html, /<img\b[^>]*\bsrc=["'](?!data:)/i);
  assert.doesNotMatch(html, /url\(\s*["']?(?:https?:|\/)/i);
});

test('slide links work from a Pages project site and repository targets exist', () => {
  const links = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)];
  assert.ok(links.length > 0);
  for (const [, href] of links) {
    if (href.startsWith('#')) {
      assert.ok(html.includes(`id="${href.slice(1)}"`), href);
      continue;
    }
    const url = new URL(href);
    assert.equal(url.protocol, 'https:', href);
    const prefix = '/frkim/foundry-governance/blob/main/';
    if (url.hostname === 'github.com' && url.pathname.startsWith(prefix)) {
      const target = path.resolve(root, decodeURIComponent(url.pathname.slice(prefix.length)));
      assert.ok(target.startsWith(`${root}${path.sep}`), href);
      assert.ok(existsSync(target), `Missing repository target: ${href}`);
    }
  }
});
