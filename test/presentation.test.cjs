const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const source = readFileSync(path.join(root, 'presentation/slides.md'), 'utf8');
const html = readFileSync(path.join(root, '_site/presentation/index.html'), 'utf8');
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

test('deck summarizes the current feature review and its researched capabilities', () => {
  const readme = readFileSync(path.join(root, 'README.md'), 'utf8');
  const reviewed = readme.match(/\*\*Latest feature review:\*\* (\d{4}-\d{2}-\d{2})/)?.[1];
  assert.ok(reviewed, 'README must record the latest feature review date');
  assert.ok(html.includes(reviewed), `Deck must cite the ${reviewed} feature review`);
  assert.ok(html.includes('references/microsoft-foundry.md#september-2026-feature-review'));
  for (const capability of ['memory', 'Foundry IQ', 'Preview', 'Trace Replay', 'Model Router',
    'toolbox', 'skill catalog', 'steering', 'ROI']) {
    assert.ok(new RegExp(capability, 'i').test(html), `Deck omits reviewed capability: ${capability}`);
  }
});

test('slide diagrams use defined presentation classes instead of raw HTML', () => {
  const stylesheet = source.match(/\nstyle: \|\n([\s\S]*?)\n---\n/)?.[1];
  assert.ok(stylesheet, 'Deck must define an embedded stylesheet');
  const classes = [...source.matchAll(/<!--\s*_class:\s*([^->]+?)\s*-->/g)]
    .flatMap(([, value]) => value.split(/\s+/));
  assert.ok(classes.length > 0, 'Deck must apply presentation classes');
  for (const name of new Set(classes)) {
    assert.ok(stylesheet.includes(`section.${name}`), `Undefined slide class: ${name}`);
    assert.match(html, new RegExp(`<section id="\\d+"[^>]*class="[^"]*\\b${name}\\b`),
      `Unrendered slide class: ${name}`);
  }
  for (const diagram of ['flow', 'cards', 'steps', 'stack', 'matrix']) {
    assert.ok(classes.includes(diagram), `Deck omits the ${diagram} diagram layout`);
  }
  assert.doesNotMatch(source.replace(/<!--[\s\S]*?-->/g, ''), /<[a-z][^>]*>/i,
    'Slides must stay HTML-free because the Marp build disables raw HTML');
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
