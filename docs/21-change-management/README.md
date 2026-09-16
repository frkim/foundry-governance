# 21 — Change management

> Last reviewed: 2026-09-16.
> Scope: risk-based approval, impact analysis, emergency change, and configuration drift.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: provider-side changes can occur independently of customer deployments.
> Exceptions: time-bound approval via ../../templates/exception-request.md.

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Azure deployment tooling, model lifecycle notices, and agent configuration APIs support lifecycle management.
Source control and IaC can record changes to supported resources and application artifacts.
Not every behavioral dependency is immutable or managed through the same API.
Provider model updates, tool schemas, remote MCP capabilities, and retrieved data can change independently.
Microsoft product documentation does not supply this organization's change-risk approval policy.

## Enterprise recommendation

Classify by potential impact, not by whether a change is “only a prompt” or “only configuration.”
Use four normal risk classes plus an emergency process.
Assign the highest applicable class when a change spans multiple categories.
Approve the immutable [release manifest](../20-cicd/README.md), not a verbal description of the change.

### Risk-based change matrix

| Class | Example changes | Required reviewers | Validation and release |
|---|---|---|---|
| A — Administrative | Owner/contact correction, nonbehavioral documentation | Asset owner or delegate | Record validation; no runtime release if behavior unchanged |
| B — Bounded behavior | Prompt wording, read-only skill fix, compatible tool schema update | Technical owner + independent peer | Targeted tests and relevant golden-set/trajectory evaluation; controlled rollout |
| C — Material behavior | Model/version, framework, retrieval/index, guardrail, orchestration change | Service owner + security/data owners as affected | Full applicable evaluation, load/cost review, canary, rollback rehearsal |
| D — Authority/exposure | New write tool, autonomous action, sensitive data, external sharing, region/provider change | Business risk owner + security + privacy/legal where applicable + operations | Threat/privacy assessment, end-to-end evaluation, approval/denial tests, staged release |
| Emergency | Contain exploitation, harmful behavior, severe outage, imminent mandatory retirement | Incident commander + independent authorized approver where feasible | Minimum safe validation, constrained access, immediate evidence, retrospective |

Examples are indicative: a small prompt edit enabling data export is Class D.
A model alias with a changed resolved version is at least Class C.
Any change weakening a safety or authorization boundary is Class D regardless of expected user impact.
Changes to published support commitments or material pricing also need product/contract-owner approval.

## Policy

1. Register all production-affecting changes before execution, except documented emergency containment.
2. Evaluate before publish and after meaningful prompt, model, tool/MCP, skill, guardrail, or data changes.
3. Require independent approval for consequential authority, production access, or externally shared data.
4. Keep the requester, approver, and deployer identities traceable; separate duties for high-risk changes.
5. Review dependency consumers and active transactions before rollout or rollback.
6. Prohibit silent updates through mutable skill defaults, image tags, tool schemas, or model aliases.
7. Use time-bound exceptions with compensating controls; exceptions do not erase failed evidence.
8. Notify affected consumers before breaking changes except when immediate containment is necessary.
9. Reconcile emergency changes into source, manifest, inventory, and operations records.
10. Reassess open approvals if the underlying artifact or transaction scope changes.

## Implementation

### Change record

| Field | Required content |
|---|---|
| Identity | Change ID, requester, accountable owner, timestamps |
| Purpose | Business reason, alternatives, consequences of not changing |
| Scope | Affected agents, consumers, dependencies, environments |
| Diff | Exact prior/candidate manifests and effective configuration |
| Risk | Class, authority/data/exposure changes, threat/privacy implications |
| Tests | Required evaluations, results, failures, accepted residual risk |
| Economics | Unit-cost/capacity effect and revised forecast |
| Operations | SLO impact, observability, runbook and support changes |
| Release | Window, rollout cohorts, checkpoints, abort criteria |
| Recovery | Compatible prior version, state migration, compensation/manual path |
| Decision | Named approvers, conditions, expiry, exception reference |
| Closure | Actual deployed digest, verification, incidents, inventory reconciliation |

### Standard sequence

1. Compare immutable manifests and runtime-discovered dependencies.
2. Assess data, permissions, network, user audience, autonomy, quality, and cost impacts.
3. Query the [dependency inventory](../25-ai-inventory/README.md) for downstream consumers.
4. Select the risk class and required reviewers.
5. Run tests proportional to risk, including regression and negative cases.
6. Obtain approval bound to the candidate digest and deployment scope.
7. Deploy through controlled [CI/CD](../20-cicd/README.md).
8. Observe canary metrics and business outcomes before promotion.
9. Verify effective state and communicate completion or rollback.
10. Close only when evidence, inventory, documentation, and owners agree.

### Emergency defaults

Containment may disable an agent/tool or revoke access without waiting for a routine meeting.
Do not use emergency status to add unrelated capabilities or bypass data-transfer approval.
When immediate harm makes prior dual approval impracticable, record the reason and accountable incident commander.
An illustrative target is retrospective review within two business days.
Temporary elevated access expires within an approved short window, for example four hours.
Replace emergency artifacts with reviewed reproducible releases as soon as safe.
Record any transaction compensation, user notification, privacy incident, or legal escalation separately.

### Provider and drift changes

Monitor retirement notices and resolved model versions on a regular schedule.
Detect tool/MCP schema/capability drift and changes to data/index permissions.
If an unapproved change widens authority, stop the affected path before assessment.
For data refreshes within an approved contract, apply data-quality and access checks on every refresh.
Treat changed sources, classification, retrieval behavior, or embedding model as material changes.
Do not freeze incident containment by blindly restoring a previous IaC state.

## Evidence

Retain risk classification, manifest diffs, approvals, test reports, and rollout records.
Attach before/after [quality](../12-quality-evaluation/README.md), [cost](../19-finops/README.md), and [SLO](../22-production-operations/README.md) comparisons.
Track change failure rate: changes causing rollback, incident, or urgent correction / production changes.
Track emergency fraction: emergency changes / production changes, with causes and corrective actions.
Track unauthorized drift age and time from detection to containment.
Keep communications, rollback outcomes, exception expiries, and retrospective actions.
Review recurring emergencies as an engineering problem rather than normalizing bypasses.
Use [go-live](../../checklists/go-live.md) for release authorization and [security review](../../checklists/security-review.md) when trust boundaries change.

## Sources and limitations

- [Deploy with IaC and GitHub Actions](https://learn.microsoft.com/en-us/devops/deliver/iac-github-actions).
- [Model lifecycle and support](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements).
- [Model retirement schedule](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirement-schedule).
- [Responsible AI policies](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/responsible-ai-policies).

Official Learn search results identify relevant lifecycle capabilities; direct retrieval was unavailable.
Risk classes, review roles, and emergency timelines are enterprise proposals, not native product policy.
