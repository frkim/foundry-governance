# Contributing

This repository contains original enterprise governance guidance, not a copy of Microsoft documentation. Small, evidence-backed corrections are preferable to unsupported claims of comprehensive platform support.

## Contribution workflow

1. Identify the affected domain, control, architecture, and enterprise decision.
2. Read the linked primary documentation for the **specific experience, agent type, deployment type, region, API/SDK version, and gateway tier**. A product announcement is not proof that every dependent feature is GA.
3. Explain separately: Microsoft capability, enterprise recommendation, proposed policy, implementation, and evidence. “Must” is a proposed enterprise requirement, not a Microsoft service guarantee.
4. Update affected examples, decision trees, checklists, and root navigation in the same change. Keep one authoritative explanation and link to it.
5. Obtain a domain-owner review; security/data/AI governance reviewers must approve changes affecting their controls. An author must not be the sole approver of a high-risk policy change.
6. Record source and review metadata below. If a source is inaccessible or contradictory, say so and use **Verification required** rather than guessing a release status.

## Required recommendation metadata

A document-level metadata block may apply to every recommendation in that document. Override it next to any recommendation with a different scope, status, source, limitation, or exception. Linked source registers may supply shared capability metadata; they do not prove workload-specific availability.

| Field | Required content |
| --- | --- |
| Capability status | GA / Preview / Deprecated; **Verification required** if not established. Mixed documents identify status per feature in a table or source register |
| Microsoft documentation reference | Specific Microsoft Learn URL; for non-Microsoft standards add the authoritative source |
| Last reviewed | ISO date of actual review; state whether full source text or only search-index information was available |
| Applicable experience/version | Foundry resource/project or hub-based project; new/classic portal where relevant; tested API/SDK and feature versions in implementation evidence |
| Scope | Environments, workloads, risk levels, deployment/agent types, regions as applicable |
| Known limitations | Service support, networking, region, identity, protocol/tier, evidence uncertainty |
| Enterprise recommendation | Chosen default, rationale, and alternative when the default is unsuitable |
| Exceptions | Link to the exception process; accountable approver, expiration, compensating control |

Never mark a capability GA merely because the parent service is GA. Preserve Deprecated entries with replacement/migration guidance while any supported workload depends on them. Do not invent package versions: examples here are design-only; executable contributions must pin and validate actual supported versions.

## Review cadence and ownership

The adopting organization assigns named custodians to these roles; this repository does not imply that a staffed governance service exists.

| Material | Accountable custodian | Minimum cadence | Event-triggered review |
| --- | --- | --- | --- |
| Capability/status register, preview dependencies | Platform architecture | Monthly | Release notes, retirement, preview graduation, incompatible SDK/API |
| Security, identity, data, MCP, guardrails | Security and data domain owners for their controls | Quarterly | Incident, new tool permission, auth/network change |
| Evaluations, operational thresholds, SLOs | Workload owner | Every release; monthly production review | Model/prompt/tool/data/guardrail change or drift |
| FinOps and consumption | FinOps owner | Monthly | Price, model routing, capacity, budget anomaly |
| Compliance and exceptions | Compliance owner | Quarterly; exception expiry checked weekly | Legal change, risk reclassification, new jurisdiction |
| Architecture library, decisions, maturity | Enterprise architecture | Quarterly | New deployment pattern or control limitation |

In a change request record: previous claim, new claim, source, affected assets, status/version, changed control/evidence, reviewer, and next review date. Expired source reviews or unsupported dependencies block **new approval of the affected capability** until revalidated; they are not automatically permission to stop a running critical workload without an incident/change plan.

## Documentation validation

The MkDocs build checks documentation navigation, links, and heading anchors in strict mode. The Node.js site tests check published coverage, search, internal links, and separation of documentation from the presentation. For prose-only changes, run the documentation build; the complete site checks run in CI.

- Review changed files and run `git diff --check` from the repository root.
- Follow relative links and heading anchors in GitHub; check case-sensitive paths and the README's 25-question coverage.
- Preview Mermaid fences in a Mermaid-capable Markdown viewer/GitHub. Verify both rendering and meaning: a diagram must not imply unsupported network isolation, authorization, failover, or gateway interception.
- Verify external links and read their relevant limitations; record unavailable sources rather than treating a link as validation.
- Check metadata and status consistency across the chapter, reference register, checklist, and example.
- Confirm each mandatory control has an owner, implementation route, evidence, and review/exception path.
- Check numeric thresholds are labeled as enterprise examples, not Microsoft guarantees. Budget alerts are not hard spend caps.
- Review for secrets, personal data, sensitive prompt/trace content, and unsafe examples before committing.

For future executable contributions, use the repository's then-existing test infrastructure and include validation of allow/deny paths, failure modes, and rollback. Do not label design examples as deployable until actually validated.

## Documentation, presentation, and GitHub Pages

GitHub Pages serves the full MkDocs documentation at **https://frkim.github.io/foundry-governance/** and the Marp presentation at **https://frkim.github.io/foundry-governance/presentation/**. The repository README is the documentation homepage. Keep the existing Markdown sources in place: `npm run stage:docs` copies the README, contributing guide, license, chapters, architecture, governance, checklists, templates, examples, and references into ignored `_docs/` while preserving relative links. Add new pages to `mkdocs.yml` navigation; if adding a new top-level content directory, also include it in the staging command and documentation coverage test. Never stage the entire repository.

The [Marp deck](https://github.com/frkim/foundry-governance/blob/main/presentation/slides.md) summarizes the framework; keep detailed policy and capability claims in their authoritative chapters and source registers. Update the deck when its summary is affected. Keep slides short, retain the proposed-policy disclaimer and dated source reference, and use absolute GitHub links for repository documents: repository-relative Markdown links would break on the published slide page.

### Local build and checks

Use Node.js **22.12 or newer** (CI uses Node.js 22), Python **3.12**, and a POSIX shell (Linux, macOS, or WSL). From the repository root:

```sh
python -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements-docs.txt
npm ci --ignore-scripts
npm run build
npm test
npm audit --audit-level=moderate
```

Preview the combined site with `python -m http.server 8000 --directory _site` and open **http://localhost:8000/** for documentation or **http://localhost:8000/presentation/** for slides. The navigation's absolute presentation link targets the published site; use the local URL while previewing. Check documentation navigation, search, Mermaid diagrams, and links from nested chapters. Material provides Mermaid rendering; diagrams require access to its Mermaid CDN.

For documentation-only work, run `npm run build:docs`; for live documentation preview, run `npm run stage:docs` followed by `python -m mkdocs serve`. Re-stage after editing repository sources. For presentation-only work, run `npm run build:presentation` and `npm run test:presentation` without installing Python dependencies. `npm run build` builds documentation **before** slides because MkDocs cleans `_site/`.

Check slide layout, arrow-key navigation, document links, presenter mode, and print preview. The Marp build embeds styles and navigation JavaScript, needs no browser installation, and disables raw Markdown HTML. Keep presentation assets embedded rather than depending on third-party fonts, scripts, or images. Marp does not render Mermaid fences as diagrams automatically.

`npm test` uses Node's built-in test runner to check the **previously built combined site**: documentation coverage/navigation/search, project-path links and anchors, slide count and headings, canonical controls, embedded presentation assets, and repository link targets. Run the full build first; `npm run test:docs` also needs both outputs to verify the presentation link. Generated `_docs/`, `_site/`, `.venv/`, and `node_modules/` are ignored; commit source and dependency manifests, not generated HTML.

Marp CLI is pinned, and `npm ci --ignore-scripts` installs the lockfile without dependency lifecycle scripts. The scoped npm overrides select patched `@puppeteer/browsers` and `@xmldom/xmldom` releases instead of vulnerable transitive versions. Review these overrides when upgrading Marp and remove them once its dependency chain supplies safe versions; repeat the build, tests, browser checks, and audit after updates. Do not use `npm audit fix --force` blindly.

### Publishing and first-time setup

1. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. A repository administrator must do this; the workflow deliberately does not grant itself administration permissions or use a personal access token.
2. Allow the default branch (`main` here) in the **github-pages** environment's deployment rules. Keep any required reviewer protections and approve deployments when requested.
3. Merge the documentation, presentation, and workflows into the default branch through normal review. Pushes there publish automatically. The **Documentation Pages** workflow can also be run from **Actions → Run workflow** after it is available on the default branch.
4. Open the deployment URL shown by the workflow. For this repository the expected documentation URL, absent a custom domain, is **https://frkim.github.io/foundry-governance/**; follow **Presentation** to open the deck.

**Documentation Pages** runs on branch pushes and pull requests. It calls the separate **Build Presentation** workflow, builds MkDocs in strict mode, downloads the presentation artifact from that same run into `_site/presentation/`, tests the combined site, and uploads one Pages artifact. **Build Presentation** can also be run manually for a deck-only build, but never deploys; use **Documentation Pages** to publish. A single deployer prevents the documentation and slides from replacing each other.

The documentation workflow **never deploys pull requests or non-default branches**, including manual runs from those branches. Only the deployment job receives `pages: write` and `id-token: write`; builds have read-only repository access. Actions are pinned to commit SHAs. Deployments are serialized without canceling an active deployment.

After publishing, the workflow fetches both the documentation homepage and presentation over HTTPS and compares their SHA-256 digests with the built HTML, retrying while the site propagates. A green build with a skipped deployment is **not** proof that Pages is published. First-run PR workflows may need maintainer approval under repository Actions policy. If manual dispatch is unavailable before merge, inspect the branch/PR build and complete first publication after the default-branch merge; do not weaken environment protections or publish unreviewed branch content as a workaround.

References: [MkDocs](https://www.mkdocs.org/), [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/), [Marp CLI](https://github.com/marp-team/marp-cli), [custom GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), and [manual workflow runs](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow).

## Content conventions

- Use `README.md` as the entry point for each numbered governance domain.
- Keep the canonical `GOV-01`–`GOV-12` identifiers in the [control catalog](governance/controls/README.md); link instead of creating competing policy numbering.
- Relative links connect repository content. External citations identify capabilities, not endorse vendor material as enterprise policy.
- Use synthetic asset IDs and aggregate evidence. Keep actual inventory, approval records, secrets, and regulated evidence in approved access-controlled enterprise systems.
- Do not broaden permissions, allow data-bearing traces, or remove approval gates to make a sample easier to run.
