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

test('documentation uses only canonical governance control identifiers', () => {
  const catalog = readFileSync(path.join(root, 'governance/controls/README.md'), 'utf8');
  const controls = [...catalog.matchAll(/<a id="(gov-\d+)"><\/a>/g)].map(([, id]) => id.toUpperCase());
  assert.equal(controls.length, 12);
  assert.equal(new Set(controls).size, controls.length);
  for (const source of sources) {
    const markdown = readFileSync(path.join(root, source), 'utf8');
    for (const [control] of markdown.matchAll(/\bGOV-\d+\b/g)) {
      assert.ok(controls.includes(control), `Unknown control ${control} in ${source}`);
    }
  }
});

test('walkthrough evidence and pre-launch checks cover every canonical control', () => {
  const example = readFileSync(path.join(root, 'examples/single-agent/README.md'), 'utf8');
  const evidenceRows = example.split('\n').filter(line => /^\| GOV-\d+/.test(line)).join('\n');
  const checklist = readFileSync(path.join(root, 'checklists/go-live.md'), 'utf8');
  const gate = checklist.indexOf('### Independent authorization gate');
  assert.ok(gate > 0, 'Missing pre-traffic authorization gate');
  const preLaunch = checklist.slice(0, gate);
  for (let control = 1; control <= 12; control++) {
    const id = `GOV-${String(control).padStart(2, '0')}`;
    assert.ok(evidenceRows.includes(id), `Walkthrough lacks evidence mapping for ${id}`);
    assert.ok(preLaunch.includes(`#${id.toLowerCase()}`), `Pre-launch checks omit ${id}`);
  }
  assert.match(preLaunch, /control record\]\([^)]*#how-to-use-the-catalog\)/);
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

test('Markdown task lists render as read-only checkboxes with matching states', () => {
  for (const source of sources) {
    const markdown = readFileSync(path.join(root, source), 'utf8');
    const tasks = [...markdown.matchAll(/^\s*- \[([ xX])\] /gm)];
    if (!tasks.length) continue;
    const html = readFileSync(path.join(site, pagePath(source)), 'utf8');
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
    const checkboxes = [...article.matchAll(/<input\b[^>]*\btype="checkbox"[^>]*>/g)];
    assert.equal(checkboxes.length, tasks.length, `Missing task checkboxes in ${source}`);
    for (const [index, [checkbox]] of checkboxes.entries()) {
      assert.match(checkbox, /\bdisabled(?=[=\s/>])/, `Editable task checkbox in ${source}`);
      assert.equal(/\bchecked(?=[=\s/>])/.test(checkbox), tasks[index][1].toLowerCase() === 'x',
        `Incorrect checkbox state in ${source}`);
    }
  }
});

test('checklist evidence stays nested under its review criterion', () => {
  for (const source of sources.filter(source => source.startsWith('checklists/'))) {
    const markdown = readFileSync(path.join(root, source), 'utf8');
    const criteria = [...markdown.matchAll(/^- \[ \] \*\*([A-Z]+-\d+)/gm)];
    const html = readFileSync(path.join(site, pagePath(source)), 'utf8');
    const items = [...html.matchAll(/<li class="task-list-item">([\s\S]*?)<\/li>/g)];
    assert.ok(criteria.length > 0, `No review criteria in ${source}`);
    assert.equal(items.length, criteria.length, `Missing review criteria in ${source}`);
    for (const [index, [, item]] of items.entries()) {
      assert.ok(item.includes(`<strong>${criteria[index][1]} `), `Wrong criterion in ${source}`);
      assert.match(item, /<ul>\s*<li>Evidence:/,
        `Evidence is not nested under ${criteria[index][1]} in ${source}`);
    }
  }
});

test('documentation loads only self-hosted assets, including Mermaid', () => {
  assert.ok(existsSync(path.join(site, 'assets/javascripts/mermaid.min.js')));
  for (const source of sources) {
    const html = readFileSync(path.join(site, pagePath(source)), 'utf8');
    for (const [, script] of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
      assert.ok(!/^(?:https?:)?\/\//.test(script), `External script: ${script} in ${source}`);
    }
    if (html.includes('class="mermaid"')) {
      assert.match(html, /<script\b[^>]*\bsrc="[^"]*assets\/javascripts\/mermaid\.min\.js"/,
        `Missing self-hosted Mermaid on ${source}`);
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
