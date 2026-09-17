const assert = require('node:assert/strict');
const { existsSync, readFileSync, readdirSync, statSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const site = path.join(root, '_site');
const siteUrl = new URL('https://frkim.github.io/foundry-governance/');
const home = readFileSync(path.join(site, 'index.html'), 'utf8');
const contentDirectories = ['docs', 'architecture', 'governance', 'checklists', 'templates', 'examples', 'references'];
const sources = ['README.md', 'CONTRIBUTING.md', ...contentDirectories.flatMap(directory =>
  readdirSync(path.join(root, directory), { recursive: true })
    .filter(file => file.endsWith('.md'))
    .map(file => `${directory}/${file}`)
)];

function pagePath(source) {
  return source.replace(/(^|\/)README\.md$/, '$1index.html').replace(/\.md$/, '/index.html');
}

test('documentation is the homepage and links to the separate Marp presentation', () => {
  assert.match(home, /<title>Microsoft Foundry Enterprise Governance<\/title>/);
  assert.match(home, /Governance domains/);
  assert.match(home, /href="https:\/\/frkim\.github\.io\/foundry-governance\/presentation\/"/);
  assert.doesNotMatch(home, /data-marpit-svg/);
  assert.ok(existsSync(path.join(site, 'presentation/index.html')));
});

test('every documentation source is published, navigable, and searchable', () => {
  const search = JSON.parse(readFileSync(path.join(site, 'search/search_index.json'), 'utf8'));
  for (const source of sources) {
    const output = pagePath(source);
    assert.ok(existsSync(path.join(site, output)), `Missing page for ${source}`);
    const location = output.replace(/index\.html$/, '');
    if (location) {
      assert.ok(home.includes(`href="${location}"`), `Missing navigation for ${source}`);
    }
    assert.ok(search.docs.some(doc => doc.location === location), `Missing search entry for ${source}`);
  }
});

test('generated documentation links, anchors, and assets resolve under the Pages project path', () => {
  for (const source of sources) {
    const output = pagePath(source);
    const html = readFileSync(path.join(site, output), 'utf8');
    const pageUrl = new URL(output.replace(/index\.html$/, ''), siteUrl);
    for (const [, attribute] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const url = new URL(attribute.replaceAll('&amp;', '&'), pageUrl);
      if (url.origin !== siteUrl.origin) continue;
      assert.ok(url.pathname.startsWith(siteUrl.pathname), `Link escapes project: ${attribute} in ${source}`);
      let target = path.join(site, decodeURIComponent(url.pathname.slice(siteUrl.pathname.length)));
      assert.ok(existsSync(target), `Missing target: ${attribute} in ${source}`);
      if (statSync(target).isDirectory()) target = path.join(target, 'index.html');
      assert.ok(existsSync(target), `Missing index: ${attribute} in ${source}`);
      if (url.hash && target.endsWith('.html')) {
        const targetHtml = readFileSync(target, 'utf8');
        assert.ok(targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
          `Missing anchor: ${attribute} in ${source}`);
      }
    }
  }
});

test('Mermaid diagrams are enabled and repository build inputs are not published', () => {
  const architecture = readFileSync(path.join(site, 'architecture/reference-architectures/index.html'), 'utf8');
  const source = readFileSync(path.join(root, 'architecture/reference-architectures/README.md'), 'utf8');
  assert.match(architecture, /class="mermaid"/);
  assert.equal([...architecture.matchAll(/class="mermaid"/g)].length, [...source.matchAll(/^```mermaid$/gm)].length);
  for (const input of ['.git', '.github', 'node_modules', 'test', '_docs', 'package.json',
    'mkdocs.yml', 'requirements-docs.txt', 'presentation/slides.md', 'docs/00-overview/README.md']) {
    assert.ok(!existsSync(path.join(site, input)), `Build input published: ${input}`);
  }
});
