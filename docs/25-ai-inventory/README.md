# 25 — AI inventory and lifecycle

> Last reviewed: 2026-09-16.
> Scope: authoritative records for AI systems, agents, models, dependencies, and lifecycle evidence.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: native discovery and registry integrations do not guarantee complete enterprise coverage.
> Exceptions: time-bound approval via ../../templates/exception-request.md.

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Foundry exposes resources, projects, agent artifacts, and application lifecycle surfaces.
Microsoft documents Foundry integration with Agent 365 for agent governance/registry scenarios.
Coverage, synchronization, licensing, tenant configuration, and feature status require validation.
Azure resource discovery alone does not reveal every prompt, tool permission, external agent, or data flow.
Maintain a customer-owned authoritative inventory even when native registries supply discovery inputs.

## Enterprise recommendation

Register every AI system before production, including embedded, external, custom, container, and multi-agent systems.
Use stable inventory IDs independent of mutable deployment names and portal URLs.
Separate business system, logical agent, released artifact, and running deployment records.
Track agent type, hosting, and SDK/framework separately.
Represent dependencies as versioned directed relationships with owners and evidence.

### Complete minimum inventory schema

| Group | Required fields |
|---|---|
| Record identity | Inventory ID, schema version, record type, parent system ID, creation/update timestamps |
| Business purpose | Name, description, intended/prohibited use, business process, success metrics |
| Accountability | Business owner, technical owner, data owner, risk owner, operations contact, cost owner |
| Lifecycle | Proposed/sandbox/approved/production/suspended/retiring/retired, effective dates, reason |
| Environment | Development/test/production, tenant, subscription, resource group, resource/project IDs |
| Experience | Portal experience separately from Foundry resource/project or hub/project type |
| Agent design | Persisted prompt/hosted type or not applicable; workflow/composition pattern, hosting boundary, container/external flag, autonomy |
| Framework/runtime | Agent Framework/LangGraph/LangChain/Semantic Kernel/custom, exact versions, language/runtime |
| Release | Source repository/commit, artifact/image digest, immutable manifest, deployment ID/version |
| Model | Provider, model/version, modality, deployment/type, endpoint, region, upgrade mode |
| Data | Sources, indexes, embeddings, classifications, purpose, lineage, ACLs, refresh, retention/deletion |
| State | Conversation/memory/checkpoint stores, tenant isolation, retention, backup/RPO, deletion owner |
| Identity | Runtime/caller identities, auth method, roles/scopes, downstream authorization, review date |
| Tools | Tool IDs, operations, schemas/versions, endpoints, read/write, owner, data/permission scope |
| MCP | Server IDs, transport, endpoints, capability/schema snapshots, auth scopes, approvals |
| Skills | Skill IDs, versions/digests, provenance, dependencies, permissions, consumer attachments |
| Agent graph | Parent/child/peer agents, handoff schemas, trust boundaries, fan-out/depth/run budgets |
| Network | Ingress/egress routes, private endpoints, approved destinations, processing/fallback regions |
| Guardrails | Safety policy version, content controls, action restrictions, HITL/approval policy |
| Risk/compliance | Risk tier, AI impact/DPIA references, legal roles/obligations, deadline, license/provider terms |
| Quality | Golden-set/evaluator versions, evaluation runs/results, thresholds, known limitations |
| Observability | Telemetry destinations, schema, redaction, retention, dashboards, alerts, audit store |
| Operations | Service hours, SLO/SLA, on-call, runbooks, RTO/RPO, kill switch, recovery test |
| Sharing | Sharing level, consumers/tenants/channels, authoring versus invocation access, approvals |
| Economics | Cost center, budget owner/period/amount/currency, unit-cost target, limits, PAYG/PTU, allocation |
| Governance | Approvals, exceptions/expiry, control evidence, review cadence, next attestation |
| Lifecycle dependencies | Retirement dates/source, replacement, migration owner, consumer notice |
| Retirement evidence | Traffic stop, revocation, deletion/hold, billing closure, evidence archive, completion |

Use explicit “not applicable” with justification; unknown required fields block production approval.
Store protected evidence references, not credentials, raw personal data, or full sensitive prompts.
An external supplier's unknown model version is a recorded limitation requiring a risk decision.

## Policy

1. Block publication if the inventory record or required dependency approvals are missing.
2. Update records through the release/change workflow rather than relying only on annual surveys.
3. Reconcile discovery sources and runtime telemetry against inventory at least weekly.
4. Require owner attestation quarterly and on ownership, risk, audience, or data changes.
5. Suspend or contain ownerless production assets until accountability and controls are restored.
6. Include agents built outside Foundry and SaaS agents that access enterprise data.
7. Maintain historical versions and audit trails; do not overwrite prior approval evidence.
8. Query dependencies before revocation, model retirement, skill withdrawal, or permission changes.
9. Retire credentials, routes, data, and billing obligations, not merely the catalog entry.
10. Protect the inventory itself because endpoints, privileges, and dependencies are sensitive.

## Implementation

### Dependency edge schema

| Field | Required meaning |
|---|---|
| Source / target | Stable inventory IDs and resolved versions |
| Relationship | Calls, retrieves-from, uses-model, loads-skill, delegates-to, hosted-on |
| Authority | Caller identity, scopes, allowed operations, tenant boundary |
| Data flow | Classification, direction, processing geography, retention |
| Operational | Criticality, timeout, retry policy, fallback, SLO owner |
| Lifecycle | First/last observed, approval/expiry, change source, retirement dependency |

Example: `case-assistant release 2 → calls → case-update tool version 3`.
That edge carries write scope, exact approval policy, tenant check, and transaction idempotency requirement.
A second edge to a hosted peer agent must record its separate owner, region, and remaining execution budget.
Do not flatten all dependencies into an unversioned free-text field.

### Reconciliation

Collect supported Azure/Foundry discovery, release manifests, gateway routes, and runtime dependency observations.
Include procurement/SaaS records and business-owner declarations for assets not discoverable through Azure.
Match by stable resource/artifact IDs; investigate duplicate names and orphaned endpoints.
Flag unregistered traffic, unknown model versions, new MCP capabilities, and missing owners.
Assign reconciliation exceptions with owner, risk, deadline, and containment.
Record source freshness so stale discovery is not mistaken for absence.

### Retirement sequence

1. Approve retirement and identify all dependent agents, consumers, and business processes.
2. Notify consumers and provide an approved replacement or manual path.
3. Stop new runs; drain/cancel safely and reconcile pending transactions/approvals.
4. Remove routes, channel publication, schedules, registry visibility, and cached attachments.
5. Revoke identities, role assignments, credentials, tool/MCP grants, and network access.
6. Delete or archive models, indexes, memory, files, logs, and backups under retention/legal-hold rules.
7. Remove billable resources and review PTU/reservation/license commitments separately.
8. Verify no traffic, no unintended access, no orphaned data, and no unexpected recurring charges.
9. Preserve the inventory tombstone and required audit evidence with retirement date and accountable owner.

Deletion of a deployment does not necessarily cancel a reservation or contractual commitment.
Restoration from backup must not silently reactivate retired identities or prohibited data.

## Evidence

Retain schema, records, dependency snapshots, discovery/reconciliation reports, and owner attestations.
Measure coverage: registered discovered production assets / all discovered production assets.
Measure completeness: production records with all required fields / production records.
Measure freshness: records attested within policy window / records requiring attestation.
Disclose discovery blind spots; observed coverage is not proof of discovering all shadow AI.
Link [architecture](../06-agent-architecture/README.md), [CI/CD](../20-cicd/README.md), and [maturity](../26-maturity-model/README.md).
Start with [agent registration](../../templates/agent-registration.md); verify completeness at [go-live](../../checklists/go-live.md).

## Sources and limitations

- [Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
- [Agent applications](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/agent-applications).
- [Agent 365 integration](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-365-integration).
- [Govern agents across the organization](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai-agents/governance-security-across-organization).

Official Learn search results identify discovery/governance integration; direct retrieval was unavailable.
The schema and reconciliation process are enterprise requirements, not a claim of native automatic coverage.
