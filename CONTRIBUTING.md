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

Governance documentation has no dedicated lint or test suite. Prose-only changes outside the presentation do not require installing the presentation toolchain.

- Review changed files and run `git diff --check` from the repository root.
- Follow relative links and heading anchors in GitHub; check case-sensitive paths and the README's 25-question coverage.
- Preview Mermaid fences in a Mermaid-capable Markdown viewer/GitHub. Verify both rendering and meaning: a diagram must not imply unsupported network isolation, authorization, failover, or gateway interception.
- Verify external links and read their relevant limitations; record unavailable sources rather than treating a link as validation.
- Check metadata and status consistency across the chapter, reference register, checklist, and example.
- Confirm each mandatory control has an owner, implementation route, evidence, and review/exception path.
- Check numeric thresholds are labeled as enterprise examples, not Microsoft guarantees. Budget alerts are not hard spend caps.
- Review for secrets, personal data, sensitive prompt/trace content, and unsafe examples before committing.

For future executable contributions, use the repository's then-existing test infrastructure and include validation of allow/deny paths, failure modes, and rollback. Do not label design examples as deployable until actually validated.

## Presentation and GitHub Pages

The [Marp deck](presentation/slides.md) summarizes the framework; keep detailed policy and capability claims in their authoritative chapters and source registers. Update the deck when its summary is affected. Keep slides short, retain the proposed-policy disclaimer and dated source reference, and use absolute GitHub links for repository documents: repository-relative Markdown links would break on the published site. The generated site contains only the presentation, not the full documentation.

### Local build and checks

Use Node.js **22.12 or newer** (CI uses Node.js 22). From the repository root:

```sh
npm ci --ignore-scripts
npm run build
npm test
npm audit --audit-level=moderate
```

Open `_site/index.html` in a browser. Check slide layout, arrow-key navigation, document links, presenter mode, and print preview. The build embeds styles and navigation JavaScript, needs no browser installation, and disables raw Markdown HTML. Keep assets embedded rather than depending on third-party fonts, scripts, or images. Marp does not render Mermaid fences as diagrams automatically.

`npm test` uses Node's built-in test runner to check the **previously built HTML**: slide count and headings, canonical controls, embedded assets, and repository link targets. Run the build first. Generated `_site/` output and `node_modules/` are ignored; commit the source, package manifest, and lockfile, not generated HTML.

Marp CLI is pinned, and `npm ci --ignore-scripts` installs the lockfile without dependency lifecycle scripts. The scoped npm overrides select patched `@puppeteer/browsers` and `@xmldom/xmldom` releases instead of vulnerable transitive versions. Review these overrides when upgrading Marp and remove them once its dependency chain supplies safe versions; repeat the build, tests, browser checks, and audit after updates. Do not use `npm audit fix --force` blindly.

### Publishing and first-time setup

1. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. A repository administrator must do this; the workflow deliberately does not grant itself administration permissions or use a personal access token.
2. Allow the default branch (`main` here) in the **github-pages** environment's deployment rules. Keep any required reviewer protections and approve deployments when requested.
3. Merge the presentation and workflow into the default branch through normal review. Relevant pushes there publish automatically. The **Presentation Pages** workflow can also be run from **Actions → Run workflow** after it is available on the default branch.
4. Open the deployment URL shown by the workflow. For this repository the expected URL, absent a custom domain, is **https://frkim.github.io/foundry-governance/**.

The workflow builds on relevant branch pushes and pull requests, uploads a Pages artifact, and **never deploys pull requests or non-default branches**, including manual runs from those branches. Only the deployment job receives `pages: write` and `id-token: write`; builds have read-only repository access. Actions are pinned to commit SHAs. Deployments are serialized without canceling an active deployment.

After publishing, the workflow fetches the live URL over HTTPS and compares its SHA-256 digest with the built HTML, retrying while the site propagates. A green build with a skipped deployment is **not** proof that Pages is published. First-run PR workflows may need maintainer approval under repository Actions policy. If manual dispatch is unavailable before merge, inspect the branch/PR build and complete first publication after the default-branch merge; do not weaken environment protections or publish unreviewed branch content as a workaround.

References: [Marp CLI](https://github.com/marp-team/marp-cli), [custom GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), and [manual workflow runs](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow).

## Content conventions

- Use `README.md` as the entry point for each numbered governance domain.
- Keep the canonical `GOV-01`–`GOV-12` identifiers in the [control catalog](governance/controls/README.md); link instead of creating competing policy numbering.
- Relative links connect repository content. External citations identify capabilities, not endorse vendor material as enterprise policy.
- Use synthetic asset IDs and aggregate evidence. Keep actual inventory, approval records, secrets, and regulated evidence in approved access-controlled enterprise systems.
- Do not broaden permissions, allow data-bearing traces, or remove approval gates to make a sample easier to run.
