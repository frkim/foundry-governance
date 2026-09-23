const assert = require('node:assert/strict');
const { existsSync, readFileSync, readdirSync, statSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const site = path.join(root, '_site');
const siteUrl = new URL('https://frkim.github.io/foundry-governance/');
const home = readFileSync(path.join(site, 'index.html'), 'utf8');
const canonicalControls = Array.from({ length: 12 }, (_, index) => `GOV-${String(index + 1).padStart(2, '0')}`);
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
  assert.deepEqual(controls, canonicalControls);
  for (const source of sources) {
    const markdown = readFileSync(path.join(root, source), 'utf8');
    for (const [control] of markdown.matchAll(/\bGOV-\d+\b/g)) {
      assert.ok(controls.includes(control), `Unknown control ${control} in ${source}`);
    }
  }
});

test('walkthrough evidence and pre-launch checks cover every canonical control', () => {
  const example = readFileSync(path.join(root, 'examples/single-agent/README.md'), 'utf8');
  const evidenceRows = example.split('\n').filter(line => /^\| GOV-\d+/.test(line));
  const evidenceControls = evidenceRows.flatMap(row => {
    const [, controls, evidence, owner] = row.split('|');
    assert.ok(evidence?.trim(), `Missing walkthrough evidence: ${row}`);
    assert.ok(owner?.trim(), `Missing walkthrough producer: ${row}`);
    return controls.match(/\bGOV-\d+\b/g);
  });
  assert.deepEqual(evidenceControls, canonicalControls);
  const checklist = readFileSync(path.join(root, 'checklists/go-live.md'), 'utf8');
  const start = checklist.indexOf('## Before any production traffic');
  const gate = checklist.indexOf('### Independent authorization gate');
  assert.ok(start >= 0 && gate > start, 'Missing pre-traffic checks or authorization gate');
  const preLaunch = checklist.slice(start, gate);
  const linkedControls = [...preLaunch.matchAll(/\]\(\.\.\/governance\/controls\/README\.md#(gov-\d+)\)/g)]
    .map(([, id]) => id.toUpperCase());
  for (const id of canonicalControls) {
    assert.ok(linkedControls.includes(id), `Pre-launch checks omit ${id}`);
  }
  const closure = preLaunch.match(/^- \[ \] \*\*LIVE-02\b.*$/m)?.[0];
  assert.ok(closure, 'Missing independent control-closure criterion');
  assert.match(closure, /control record\]\([^)]*#how-to-use-the-catalog\)/);
});

test('rendered reading paths provide role-specific links and adoption outputs', () => {
  const readingPath = home.match(/<h3 id="choose-a-reading-path">[\s\S]*?(?=<h[1-3]\b)/)?.[0];
  assert.ok(readingPath, 'Missing role-based reading paths');
  const body = readingPath.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1];
  assert.ok(body, 'Reading paths must render as a table');
  const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
  assert.equal(rows.length, 6, 'Missing reader role');
  for (const [, row] of rows) {
    const cells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(([, cell]) => cell);
    assert.equal(cells.length, 3, 'Each role needs a question, reading links, and an output');
    assert.ok(cells.every(cell => cell.replace(/<[^>]*>/g, '').trim()), 'Empty reading-path cell');
    assert.match(cells[1], /<a href="[^"]+">/, `Missing reading link for ${cells[0]}`);
  }
  for (const target of ['examples/single-agent/#from-design-to-a-release-decision',
    'templates/agent-registration/', 'governance/baselines/#selecting-and-proving-a-baseline']) {
    assert.ok(readingPath.includes(`href="${target}"`), `Missing adoption link: ${target}`);
  }
});

test('rendered walkthrough retains release bindings, review gates, and failure guidance', () => {
  const html = readFileSync(path.join(site, 'examples/single-agent/index.html'), 'utf8');
  const walkthrough = html.match(/<h2 id="from-design-to-a-release-decision">([\s\S]*?)<\/article>/)?.[1];
  assert.ok(walkthrough, 'Missing release-decision walkthrough');
  for (const field of ['agent_id', 'deployment_id', 'version', 'environment']) {
    assert.match(walkthrough, new RegExp(`<code>${field}=[^<]+</code>`), `Missing candidate binding: ${field}`);
  }
  for (const target of ['templates/agent-registration/', 'governance/baselines/#selecting-and-proving-a-baseline',
    'governance/standards/#canonical-metadata-contract', 'governance/controls/#how-to-use-the-catalog',
    'checklists/architecture-review/', 'checklists/security-review/', 'checklists/production-readiness/',
    'checklists/go-live/#independent-authorization-gate']) {
    assert.ok(walkthrough.includes(`href="../../${target}"`), `Missing walkthrough step: ${target}`);
  }
  assert.match(walkthrough, /<strong>Illustrative hold:<\/strong>[^<]*Block launch/);
  assert.match(walkthrough, /Missing test results are <code>hold<\/code>, not <code>n\/a<\/code>/);
  assert.match(walkthrough, /<strong>Recovery exercise:<\/strong>/);
});

test('new adoption and review sections are indexed for search', () => {
  const search = JSON.parse(readFileSync(path.join(site, 'search/search_index.json'), 'utf8'));
  for (const location of ['#choose-a-reading-path', 'examples/single-agent/#from-design-to-a-release-decision',
    'governance/controls/#review-cadence-precedence', 'CONTRIBUTING/#documentation-quality-assessment']) {
    assert.ok(search.docs.some(doc => doc.location === location && doc.text.trim()),
      `Missing searchable section: ${location}`);
  }
});

test('Foundry feature review publishes sourced status boundaries and governance links', () => {
  const html = readFileSync(path.join(site, 'references/microsoft-foundry/index.html'), 'utf8');
  const review = html.match(/<h2 id="september-2026-feature-review">([\s\S]*?)(?=<h2\b)/)?.[1];
  assert.ok(review, 'Missing dated feature review');
  assert.match(review, /2026-09-23/);
  const body = review.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1];
  assert.ok(body, 'Feature review must render as a table');
  const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
  const features = new Set();
  for (const [, row] of rows) {
    const cells = [...row.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(([, cell]) => cell);
    assert.equal(cells.length, 4, 'Each feature needs status, sources, and governance guidance');
    features.add(cells[0].replace(/<[^>]*>/g, '').trim());
    assert.match(cells[1], /GA|Preview|Deprecated|Verification required/, `Missing status boundary: ${cells[0]}`);
    assert.match(cells[2], /href="https:\/\/learn\.microsoft\.com\//, `Missing primary source: ${cells[0]}`);
    assert.match(cells[3], /href="\.\.\/\.\.\/docs\//, `Missing governance guidance: ${cells[0]}`);
  }
  for (const feature of ['Hosted Agents', 'Long-running agents', 'Human-in-the-loop and steering',
    'Agent memory', 'Toolboxes', 'Tool search', 'Private Skill Catalog', 'Routines', 'Foundry IQ',
    'Cloud evaluation', 'Trace Replay', 'Agent Optimizer', 'ROI for Agents', 'Model Router',
    'GPT-6 Astra, Sol and Luna', 'Claude and multi-model', 'Data Zones', 'Network isolation',
    'Teams and Microsoft 365 Copilot', 'Voice Live', 'Framework choice', 'Foundry Toolkit for VS Code',
    'Foundry Workflows', 'Project and API evolution']) {
    assert.ok(features.has(feature), `Missing researched feature: ${feature}`);
  }
  assert.ok(home.includes('href="references/microsoft-foundry/#september-2026-feature-review"'));
  const search = JSON.parse(readFileSync(path.join(site, 'search/search_index.json'), 'utf8'));
  assert.ok(search.docs.some(doc =>
    doc.location === 'references/microsoft-foundry/#september-2026-feature-review' && doc.text.trim()));
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
