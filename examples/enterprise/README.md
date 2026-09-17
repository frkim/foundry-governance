# Worked design: federated enterprise AI platform

- **Last reviewed:** 2026-09-16
- **Scope:** logical enterprise patterns.
- **Experience:** Foundry resource/project (new), unless stated.
- **Capability status:** feature-specific; Preview/GA only when confirmed in sources; otherwise verification required.
- **Recommendation:** proposed enterprise baseline.
- **Limitations:** diagrams are not network or availability guarantees.
- **Exceptions:** [exception request](../../templates/exception-request.md).

Metadata applies throughout. This is a **worked design**, not deployable IaC or a tested implementation.
All inventory values and numerical acceptance targets are fictitious design inputs; no personal data or credentials are included.
Field names are planning labels, not Azure resource or API schema fields.

## Scenario and inventory

An enterprise has an ordinary internal-assistance domain and a contractually restricted records domain.
Central governance sets minimum controls; each domain operates its own releases and incident response within approved boundaries.

| Planning field | Fictitious value |
| --- | --- |
| Platform / central owner | `design-enterprise-01` / Enterprise AI Governance Team |
| Domains / classification | `design-services` / Internal; `design-restricted` / Restricted synthetic records |
| Resource strategy | Dedicated Foundry resources per domain and environment; projects per workload |
| Environment isolation | Production subscriptions/resources separate from nonproduction |
| Identity strategy | Domain-specific deployment/runtime identities; separate central audit role |
| Shared services | Approved catalog and minimized evidence; gateway sharing conditional on classification review |
| Restricted services | Dedicated tool/data scopes and operators where required by the control mapping |
| Continuity target | Proposed 4-hour recovery target; regional design and capabilities unverified |

## Concrete decisions

- Use federated operations with central policy, evidence requirements, exception expiry, and release gates.
- Use dedicated resources per domain and environment, with production subscriptions/resources separate from nonproduction; projects organize workloads inside those scopes.
- Validate network, operator, key, processing-location, and data separation independently; neither project nor resource creation proves regulatory isolation.
- Share an AI Gateway only for supported explicit routes and approved payload classes; keep restricted MCP/data services dedicated.
- Defer multi-region rollout until residency, capability parity, replication, secondary capacity, and recovery evidence are approved.
- Inventory external ephemeral agents even without agent resources; require evaluation and human release approval for Limited Preview Agent optimizer proposals affecting prompts, skills, tool descriptions, or models.
- Optionally assess portal-only Preview Control Plane/Operate features; reconcile observed fleet coverage, access, integrations, and redacted signals with domain inventory and retained application/control evidence.

## Identity flow and controls

1. The application authenticates users and authorizes each domain operation; no cross-domain access is inferred from enterprise membership.
2. Domain-scoped runtime identities access approved models and tools; gateway backend identity is separate where a gateway route is used.
3. Tool and retrieval services enforce object-level entitlements; consequential actions require exact-action human approval and execution-time reauthorization.
4. Domain deployment identities cannot alter central policy or another domain; central audit access does not automatically include business payloads.
5. Send redacted release, denial, quality, incident, and cost evidence to the central review function with approved retention and access controls.

## Acceptance evidence to collect

| Check | Proposed pass condition | Owner / evidence |
| --- | --- | --- |
| Isolation | Cross-domain access is denied at management, data, and tool boundaries | Domain/security owners / control mapping and negative tests |
| Governance | A failed gate or expired exception prevents the affected release | Platform owner / release denial evidence |
| Operations | Containment stops new prohibited actions; recovery meets the approved target | SOC/domain owners / incident and recovery drill |
| FinOps / quality | Allocated usage reconciles to provider records within documented tolerance and quality gates pass | FinOps/product owners / reconciliation and evaluation |

## Rollback and kill switch

Give each domain an authorized responder who can disable new requests, write tools, and compromised connections.
Central incident coordination may request wider containment, but execution rights and shared-service blast radius must be predetermined.
Quarantine in-flight writes, restore approved compatible releases, and verify current entitlements and data state before re-enabling service.

## Cost / quality tradeoff and next steps

Dedicated scopes cost more to operate but can reduce shared blast radius; central standards reduce duplicated policy design, not necessarily runtime spend.
Require demand measurements before provisioned capacity and evaluate lower-cost models per domain rather than applying a global downgrade.
Follow [full enterprise platform](../../architecture/reference-architectures/README.md#16-full-enterprise-ai-platform), [resource separation](../../architecture/decision-trees/README.md#4-single-vs-multiple-foundry-resources), and the [governance chapter index](../../README.md).
Companion chapters: [governance model](../../docs/01-governance-model/README.md), [resource topology](../../docs/02-resource-topology/README.md), [security monitoring](../../docs/14-security-monitoring/README.md), [compliance](../../docs/24-compliance/README.md), and [AI inventory](../../docs/25-ai-inventory/README.md).
Verify each dependency through [Foundry sources](../../references/microsoft-foundry.md), [Azure sources](../../references/azure.md), and [Foundry overview](https://learn.microsoft.com/en-us/azure/foundry/).
