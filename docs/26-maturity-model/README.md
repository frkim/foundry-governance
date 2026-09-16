# 26 — Governance maturity model

> Last reviewed: 2026-09-16.
> Scope: evidence-based assessment and staged improvement of enterprise AI governance.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: this six-level model is an enterprise proposal, not Microsoft certification or legal assurance.
> Exceptions: time-bound approval via ../../templates/exception-request.md.

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Microsoft publishes AI adoption, responsible AI, and agent governance maturity guidance.
Foundry, Azure, and connected governance products provide building blocks for implementing controls.
Purchasing a product, enabling a portal feature, or using a specific SDK does not establish maturity.
Feature status and actual enforcement must be validated independently of the assessment score.
This chapter's levels 0–5 are a local operating model, not a reproduction of a vendor scoring system.

## Enterprise recommendation

Assess business units and the shared platform separately, using the same evidence rules.
Use the lowest unmet critical domain to constrain production authority.
Do not average a missing authorization boundary away with strong documentation or cost reporting.
Progress requires demonstrated outcomes and sustained operation, not merely policy publication.
Apply legal, security, and safety minimums at every level; low maturity is not permission for unsafe production.

### Levels, evidence, and measurable exit criteria

Exit criteria describe what must be demonstrated **before advancing** from the named level.
Percentages are proposed targets; denominators must be documented and unknown scope disclosed.

| Level | Operating state | Required evidence | Exit criteria |
|---|---|---|---|
| 0 — Uncontrolled | Experiments or unknown assets; no repeatable governance | Discovery report, accountable sponsor, containment record | 100% of discovered production agents assigned owners or suspended; initial inventory and risk triage completed |
| 1 — Visible | Owned inventory and approved isolated experimentation | Inventory, data classification, approved uses, basic access review | 100% of proposed production agents have owner, risk/data classification, approved identity and dependency list; baseline approved |
| 2 — Controlled | Mandatory controls and repeatable production intake | Control evidence, golden sets, release approvals, spend guards, runbooks | 100% of production agents pass mandatory gates and have tested alerts/rollback; no expired high-risk exception; two releases evidenced |
| 3 — Managed | Automated release gates and reliable operating measurements | Immutable manifests, policy/evaluation gates, SLO and cost dashboards, reconciliation | ≥95% inventory freshness, ≥98% cost allocation, 100% critical audit coverage; two consecutive monthly reviews and one recovery drill |
| 4 — Measured | Risk-based portfolio management and continuous assurance | Slice-level drift review, error budgets, supplier monitoring, unit economics, incident learning | ≥95% material changes use automated gates; 100% consequential paths pass approval/replay tests; two quarters of measurable improvement |
| 5 — Optimizing | Closed-loop improvement within approved authority | Controlled experiments, predictive capacity/risk signals, external assurance where warranted | Sustain Level 4 controls; quarterly reassessment; independently validate one material improvement each quarter without safety/SLO regression |

For Level 2, manual governance can satisfy the gate only with complete, timely evidence.
For Level 4's 95% automation target, the remaining changes still require all mandatory controls through an approved manual path.
Level 5 does not mean unlimited autonomy or freedom from human accountability.
An organization may deliberately remain at a lower level if its approved scope does not require greater scale.

### Domain scorecard

| Domain | Evidence of control | Example measurable indicator |
|---|---|---|
| Ownership/inventory | Complete registered systems and dependencies | Required-field completeness and attestation freshness |
| Architecture | Bounded autonomy and approved trust boundaries | Production agents with current architecture decision / total |
| Identity/security | Least privilege, tenant isolation, egress enforcement | Passed required denial tests / required tests |
| Models/data | Approved versions, terms, lineage, retention | Approved dependency combinations / observed combinations |
| Quality/safety | Golden sets, trajectories, slice gates, production review | Releases with passing applicable evaluation / releases |
| Observability/operations | Minimum signals, SLOs, on-call, tested recovery | Instrumented production agents / total production agents |
| Human oversight | Transaction-bound, expiring, replay-safe approvals | Validly approved consequential executions / required executions |
| Financial control | Allocation, forecasts, unit targets, hard execution guards | Attributed billed cost / total in-scope billed cost |
| Change/supply chain | Immutable manifests, approvals, rollback, dependency provenance | Material changes with complete evidence / material changes |
| Compliance/sharing | Legal applicability, audience contracts, privacy evidence | In-scope obligations with current evidence / applicable obligations |
| Skills/workforce | Reviewed reusable assets and trained accountable roles | Staff with current role training / staff requiring training |

Score each domain with evidence references and a named reviewer.
Report “unknown” rather than assuming a missing system or denominator is compliant.

## Policy

1. Reassess at least quarterly and after a major incident, acquisition, or material scope expansion.
2. Require evidence from actual releases and operations, not solely slides or self-attestation.
3. Treat missing critical controls as a blocker regardless of aggregate score.
4. Separate current level, target level, and approved production scope.
5. Record exceptions, expiry, compensating controls, and affected scorecard domains.
6. Regress the assessed level when required controls no longer operate.
7. Keep maturity claims distinct from legal compliance, certification, and contractual SLA fulfillment.
8. Prioritize remediation by harm and exposure, not by the easiest percentage improvement.

## Implementation

### Assessment method

1. Define scope: business unit, platform, environments, agents, and review period.
2. Reconcile the [inventory](../25-ai-inventory/README.md); disclose discovery gaps.
3. Select representative releases plus every high-risk/consequential agent.
4. Inspect evidence against the [control catalog](../../governance/controls/README.md) and [baselines](../../governance/baselines/README.md).
5. Verify enforcement through existing denial, evaluation, approval, and recovery tests.
6. Calculate scorecard indicators with explicit counts and exclusions.
7. Assign domain levels and identify critical blockers.
8. Agree an improvement plan with owner, due date, measurable outcome, and budget.
9. Have an independent reviewer confirm material advancement.
10. Publish the decision and reassessment date; do not hide downgraded domains.

### Example 90-day progression

| Period | Focus | Acceptance |
|---|---|---|
| Days 1–30 | Discover, assign owners, classify data/risk, contain unknown production | Every discovered agent owned or suspended |
| Days 31–60 | Implement baseline, golden sets, limits, telemetry, approval controls | Pilot release passes every mandatory applicable gate |
| Days 61–90 | Reproducible release, canary/rollback, SLO/cost review, recovery drill | Two evidenced releases and measured recovery results |

This plan is illustrative and does not promise Level 3 within 90 days.
High-risk systems may need more legal review, evaluation, and operating history.
Measure improvement against a fixed baseline; explain scope changes that alter denominators.
Keep quality and safety constant when claiming cost or velocity improvements.

### Example decision

A team has complete inventory and cost dashboards but permits unapproved write-tool execution.
It cannot claim controlled production maturity or increase autonomy until the critical approval gap is closed.
Another team uses a manual release checklist with complete evidence and may satisfy Level 2.
Automation improves repeatability, but automation of an incomplete control is not maturity.

## Evidence

Retain assessment scope, sampled systems/releases, raw counts, evidence references, and reviewer decisions.
Keep improvement actions, accountable owners, budgets, due dates, and closure tests.
Attach [quality](../12-quality-evaluation/README.md), [operations](../22-production-operations/README.md), and [FinOps](../19-finops/README.md) trends.
Review [change](../21-change-management/README.md) failures, incidents, and overdue exceptions as leading indicators.
Publish the lowest critical-domain level and any explicit production restrictions alongside aggregate summaries.
Use completed [architecture](../../checklists/architecture-review.md), [security](../../checklists/security-review.md), and [production-readiness](../../checklists/production-readiness.md) reviews as evidence.

## Sources and limitations

- [Agentic AI maturity: security and governance](https://learn.microsoft.com/en-us/agents/adoption-maturity-model/maturity-model-security-governance).
- [Govern agents across the organization](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai-agents/governance-security-across-organization).
- [Responsible AI policies](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/responsible-ai-policies).

Official Learn search results identify related guidance; direct retrieval was unavailable.
All levels, thresholds, evidence rules, and progression targets here are original enterprise recommendations.
