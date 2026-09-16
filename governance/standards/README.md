# Implementation and evidence standards

| Document metadata | Value |
|---|---|
| Owner | Enterprise AI Platform Standards Owner; assign named implementation owners in each workload record |
| Scope / status | Enterprise **proposed draft baseline** pending organizational ratification |
| Experience | Microsoft Foundry resource/project, new experience unless stated otherwise |
| Last reviewed | 2026-09-16 |
| Capability status | Feature-specific official references govern; native field/support assumptions are **verification-required** |
| Evidence | Versioned metadata schema, deployment manifests, configuration exports, tests and signed review records; Platform Standards Owner is custodian |
| Exceptions | [Policy exceptions](../policies/README.md#exceptions); every recommendation inherits this metadata's scope, status and exception rules unless overridden |

## Canonical metadata contract

These are **enterprise logical field names**, not a claim that each is a native Foundry property, Azure tag, token claim or billing dimension. Store the full record in the enterprise inventory and release manifest; project a supported, non-sensitive subset into Azure tags, application telemetry and gateway configuration. Define the mapping explicitly and test it. Never place personal data, prompts, credentials or authorization decisions in mutable resource tags.

| Field | Required meaning / validation | Primary producer; evidence |
|---|---|---|
| `agent_id` | Stable inventory identifier, unchanged across versions/environments; for dependency-only registration use `n/a` with reason and list `consumer_agent_ids` | Service Owner; approved agent registration |
| `deployment_id` | Unique concrete deployment/rollout identifier; new deployment record for each promoted release; related instances reference their Azure/resource identifiers | Release Owner; deployment manifest and actual resource mapping |
| `version` | Immutable version of the registered artifact, not an alias such as `latest`; include digest separately | Component Owner; signed/restricted release record |
| `artifact_digest`, `source_commit` | Integrity hash and source revision for deployed code/configuration; record provider version and evidence where provider artifacts are not downloadable | Release Owner; artifact repository/build record |
| `component_id`, `component_type` | Stable inventory ID; type `agent`, `tool`, `mcp`, `model`, `skill`, `gateway` or documented extension | Component Owner; dependency registration |
| `display_name`, `business_purpose` | Human-readable name and approved task; prohibited uses stated separately | Business Owner; purpose approval |
| `owner_business`, `owner_technical`, `owner_operations` | Named accountable person or resolvable owner group with a named accountable lead and backup; no blank/abandoned mailbox | Service Owner; owner acceptance and on-call record |
| `cost_center`, `budget_owner` | Finance-approved allocation code and spend authority; match shared cost allocation rules | FinOps Owner; allocation/budget approval |
| `environment` | Organization-approved enum, proposed: `dev`, `test`, `staging`, `prod`; do not reuse production identities or data by default | Platform Owner; resource/environment inventory |
| `tenant_id`, `subscription_id`, `resource_id`, `project_id` | Actual tenancy/subscription/resource/project mapping; document external/non-Azure dependency exceptions | Platform Owner; exported deployment inventory |
| `region` | Actual hosting/resource region; does **not** alone describe model processing or external tool geography | Platform Owner; resource configuration |
| `deployment_type`, `processing_geography`, `storage_geography` | Exact provider deployment type plus approved processing/storage destinations; distinguish global, data-zone and regional routes and failovers | Model Owner / Data Owner; provider documentation and approved flow map |
| `risk_classification` | Organization-approved enum, proposed: `standard`, `high`; reference assessment and baseline decision; unresolved assessment is a hold | Business Risk Owner; impact assessment |
| `data_classification`, `allowed_data_classes` | Organization's controlled vocabulary; allowed/prohibited data per dependency and telemetry destination | Data Owner; handling assessment |
| `lifecycle_state` | Proposed: `draft`, `registered`, `assessed`, `approved`, `active`, `suspended`, `retired`; transitions require owner/evidence | Service Owner; state-change approval |
| `dependency_ids` | Versioned model, tool, MCP, skill, gateway, retrieval and storage dependencies; include fallback and transitive external services | Technical Owner; approved manifest/graph |
| `identity_principal_ids`, `permission_scopes` | Workload/delegated principals and exact allowed operations/resource scopes; never credential values | IAM Owner; role/grant export and denied-operation tests |
| `retention_policy_id`, `telemetry_profile_id` | Approved per-data-type retention/deletion/legal-hold schedule and redaction/access profile | Data / Operations Owners; policy and verification tests |
| `evaluation_run_id`, `evaluation_dataset_version` | Version-bound evaluation result and authorized dataset version, with thresholds and independent decision | Evaluation Lead; result bundle and approval |
| `slo_profile_id`, `budget_profile_id` | Numeric objectives, measurement windows, limits, alert destinations and response owners | Operations / FinOps Owners; dashboard/limit configuration and tests |
| `approval_id`, `exception_ids` | Scope-bound decision references; exceptions include control IDs, expiry and independent approvers | Governance / Release Owners; decision register |
| `last_reviewed_at`, `next_review_due_at`, `expires_at` | ISO 8601 UTC timestamps; expiry required for exceptions/time-limited approvals; `n/a` needs reason elsewhere | Record Owner; review schedule |
| `control_ids`, `evidence_uris` | Applicable GOV-01..GOV-12 and restricted evidence references; no sensitive payloads in URLs | Control Owner; evidence index and independent review |

## Traceability across a request and release

1. **Inventory:** `agent_id` identifies the service; `component_id` identifies reusable dependencies. Record each dependency owner and exact version.
2. **Promotion:** a release manifest binds `deployment_id`, `version`, source/artifact digests, dependency versions, configuration, region/deployment type, evaluation run, approvals and active exceptions.
3. **Execution:** record `trace_id` and `request_id` plus a trusted mapping to `agent_id`, `deployment_id`, `version`, `environment` and `cost_center`. Where caller-supplied headers carry these values, the gateway/server must derive or validate them from authenticated context. Do not trust arbitrary headers for authorization, cost allocation or tenant isolation.
4. **Tool/MCP action:** correlate action/transaction ID, tool and schema version, authenticated principal reference, authorization outcome, approval reference where required, latency and result classification. Exclude secrets and unnecessary input/output bodies.
5. **Review:** join evaluation, incidents, changes, invoices/usage and exception records to the deployment. Label estimates and allocation rules; telemetry tokens/cost estimates may not equal billed amounts.

**Acceptance test:** the Release Owner chooses one redacted request and demonstrates its path from approved inventory through deployed artifact, model/tool dependency, authorization decision and cost allocation. The Operations Owner demonstrates the same join during a simulated incident. Evidence: linked trace, manifest, approval and usage record.

## Proposed engineering standards

| Area | Standard / accountable owner | Evidence / related controls |
|---|---|---|
| Boundaries and access | Platform/IAM Owners define tenant → subscription → resource → project → external-service boundaries, environment separation, ingress/egress and least-privilege server-side authorization | Diagram, supported network/configuration export and negative access tests; [GOV-02](../controls/README.md#gov-02), [GOV-03](../controls/README.md#gov-03) |
| Dependency integrity | Component Owner versions model deployments, prompt packages, tool schemas, MCP discovery, skills and routing; selects immutable specific skill versions, pins reviewed versions/hashes where supported and detects unpinnable drift; shared-default promotion requires affected-consumer inventory, regression approval and rollback | Manifest, schema/digest comparison, all-consumer impact evidence and controlled change process; [GOV-05](../controls/README.md#gov-05), [GOV-10](../controls/README.md#gov-10) |
| Input/output and authority | Application Owner validates untrusted content with schemas, size bounds and business rules; privileged tools check resource ownership and permissions independently of the model; transaction approval expires and cannot authorize modified/replayed requests | Denied/escalated action tests, approval binding and replay tests; [GOV-03](../controls/README.md#gov-03), [GOV-06](../controls/README.md#gov-06) |
| Data and telemetry | Data/Operations Owners explicitly configure allowed collection, redaction before export, access controls and numeric retention periods across threads, memory, logs, search, caches and backups; document unsupported deletion limits | Flow-by-flow schedule and redaction/deletion/hold tests; [GOV-04](../controls/README.md#gov-04), [GOV-08](../controls/README.md#gov-08) |
| Evaluation | Evaluation Lead versions datasets, defines measurable release thresholds, records adverse cases and reviews material behavioral changes independently; tool-invoking evaluations/optimization use test endpoints or mocks and separate scoped test credentials, with bounded charges and no production mutations | Baseline comparison, endpoint/identity/side-effect checks and gate decision; [GOV-07](../controls/README.md#gov-07) |
| Operations and cost | Operations/FinOps Owners define numeric SLOs, safe timeouts, retry/loop/token/concurrency bounds, alert routes and containment; limits include downstream tools and fallback behavior | Load/runaway tests, alert receipt, cost reconciliation and recovery exercise; [GOV-08](../controls/README.md#gov-08), [GOV-09](../controls/README.md#gov-09), [GOV-11](../controls/README.md#gov-11) |
| Change evidence | Release Owner promotes immutable artifacts, checks independent approvals and exception expiry, verifies drift and rehearses rollback including external effects that cannot be undone | Manifest, pipeline and rollback evidence; [GOV-10](../controls/README.md#gov-10), [GOV-12](../controls/README.md#gov-12) |

## Current implementation distinctions

The following source-backed distinctions refine the standards; they do not authorize a workload or establish deployment-tested support. The Platform/IAM Owner records the exact feature, tier, experience and source/version in the evidence bundle and verifies the target configuration.

| Distinction | Implementation consequence / required evidence |
|---|---|
| Resource/project boundaries are capability-specific | Use the current [planning guidance](https://learn.microsoft.com/en-us/azure/foundry/concepts/planning) isolation matrix; prove boundaries for the actual APIs, connections and model/tool operations. Project membership alone is not an isolation guarantee |
| Current RBAC naming | [Foundry RBAC](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry) uses **Foundry User**, formerly Azure AI User; its documented developer mapping includes project-level Foundry User and Reader on the parent resource. This is not a blanket grant recommendation: IAM approves task-specific roles/scopes and verifies current definitions |
| Invocation and publishing require different RBAC evidence | The reviewed RBAC source identifies **Foundry Agent Consumer** for endpoint consumption; project/agent assignment uses CLI while the portal currently offers account scope. Agent scope is evaluated for endpoint invocation, not management operations. Agent publishing requires at least **Foundry Project Manager at resource scope** in the documented flow. IAM must distinguish invocation, management and publishing tasks and test the exact role/scope; do not infer one from another |
| Prompt and hosted networking | Current [networking options](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/networking-options), source dated 2026-06-29, cover both prompt and hosted agents. Verify BYO versus managed network support for the exact runtime; do not assume hosted agents universally lack private networking |
| “AI Gateway” identifies different offerings | Distinguish traditional API Management AI-gateway policies, the **Preview** Foundry/APIM integration, and the separate **Preview** dedicated AI Gateway tier. Record exact SKU/tier, networking, SLA, identity and policy support; do not transfer guarantees between offerings |
| Foundry/APIM integration routing is limited | [MCP governance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance) documents routing for newly portal-created MCP tools that do not use managed OAuth. Existing tools, code-first additions, managed-OAuth MCP, OpenAPI and native tools are not automatically covered. Record and test explicit alternative routing/enforcement for excluded paths |
| Dedicated AI Gateway tier has separate limitations | The reviewed [AI Gateway overview](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview) describes the tier as Preview, without an SLA and with API-key access to all published models/tools rather than per-asset authorization. Review its separate networking restrictions; an API key cannot establish the per-tool entitlements required by GOV-03/GOV-06 |
| Foundry visual workflows have a retirement deadline | [Build a workflow](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow), source dated 2026-07-31, labels the feature **Preview**, retiring **2026-12-01**. Do not approve new Foundry visual workflow dependencies; use the Microsoft Agent Framework direction identified by Microsoft, verifying the selected framework/version independently. Existing owners need dated migration, evaluation and rollback/safe-suspension evidence before retirement |
| Shared Toolbox defaults can change every consumer | [Toolbox overview](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview), source dated 2026-07-28, describes promoted defaults propagating to all consumers without consumer redeployment. The [readiness table](https://learn.microsoft.com/en-us/azure/foundry/concepts/general-availability#feature-readiness-at-ga), dated 2026-08-14, labels the core Toolboxes experience **GA**; individual tools, networking and preview extensions still require verification. Treat promotion as a shared production change: identify every affected consumer/version, run regressions, obtain scoped approvals, stage where supported and prove rollback |
| Tool search and skills have distinct status and trust limits | [Tool search](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/tool-search) and [skills](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/skills) are **Preview** in the reviewed sources. Search returns candidate tools, not permission to execute them; enforce authorization on every invocation. Approve immutable specific skill versions and their transitive dependencies, not an unreviewed moving default |
| Optimizer runs can have real effects | [Agent optimizer](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-optimizer-overview), source dated 2026-08-07, is **Limited Preview** in the current readiness table. Evaluations can invoke tools, incur charges and mutate state: use approved test endpoints/mocks and separate scoped test credentials, limits and side-effect checks. Prompt-agent tool-description optimization cannot evaluate actual client-side tool execution; require separate tool/action tests before release |
| Hosted guardrails require functional verification | [Add hosted-agent guardrails](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-hosted-agent-guardrails), source dated 2026-09-16, says omitted `rai_config` leaves no content-safety enforcement; including it without a policy selects the default, while an invalid policy can fail open despite active status. Security/Release Owners must identify and validate the resolved default or custom policy, use its full ARM policy ID when custom, and execute an approved non-destructive expected-block test; configuration presence or active status alone is insufficient |
| Agent and model guardrail policies are not automatically additive | [Guardrails overview](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview) distinguishes model guardrails **GA** from agent guardrails, tool-call and tool-response controls **Preview**. Agent policy replaces model policy; reconcile the complete effective policy before release. Agent-level annotate-only, Spotlighting and groundedness controls are unsupported. Model annotation is possible but is not an agent enforcement mode; quality evaluation of groundedness is a separate activity |
| Protected sensitive traces are not redacted traces | Access-protected `AppGenAIContent` is **Preview**; protection limits access but does not remove sensitive content. The reviewed migration behavior duplicates content to ordinary and protected tables by default until **2026-09-30**, unless migrated early; historical copies remain. Operations/Data Owners prove actual capture, export and table routing, restrict and redact/minimize collection, and account for both old and new stores in access, retention, deletion and legal-hold evidence; see the [Foundry source register](../../references/microsoft-foundry.md) |

See the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) registers for source provenance and further limitations. A capability whose release status has not been established remains verification-required; never infer GA from architectural availability.

## Automation roadmap — planned, not implemented

This repository defines guidance and forms. The following are **planned integration opportunities**, not shipped scripts, CI checks, Azure Policy definitions or native Foundry enforcement.

| Phase / owner | Planned mechanism | Prerequisite and acceptance evidence |
|---|---|---|
| 1 — Governance / Inventory Owners | Schema validation of registration metadata, owner resolution, evidence index and exception expiry; reconciliation against deployed inventory | Ratified vocabulary, system of record and access model; prove missing owners and expired exceptions are detected |
| 2 — Platform / IAM Owners | Supported Azure Policy assignments for relevant Azure resource settings; inventory/RBAC configuration drift checks | Verify current built-in definitions, aliases, resource type, scope and enforcement effect individually; test deny/audit behavior in nonproduction; do not invent policies for prompts, MCP schemas or agent transaction approval |
| 3 — Release / Evaluation Owners | Pipeline artifact-integrity, approved dependency/schema, evaluation threshold, metadata and exception gates | Existing CI integration and authorized evidence store; fail deliberately altered artifacts, schema drift, failed evaluations and expired exceptions |
| 4 — Application / Gateway Owners | Supported gateway/application authentication, quotas, model routing and per-tool server authorization plus approval checks | Confirm selected gateway/SKU/model compatibility and bypass paths; negative access, quota, replay and failover tests; gateway authentication alone cannot authorize every backend operation |
| 5 — Operations / SOC / FinOps | Redacted trace correlation, alert delivery, spend attribution, anomaly/limit actions and scheduled control reporting | Verified telemetry coverage and permissions; synthetic incidents, runaway workload containment and invoice reconciliation |

Approval remains with named authorities. Automation may enforce configured rules or collect evidence, but cannot independently establish lawful data use, supplier trust or acceptable business risk.

## Sources

[Microsoft Foundry references](../../references/microsoft-foundry.md), [Azure references](../../references/azure.md), [control catalog](../controls/README.md), [policy lifecycle and exceptions](../policies/README.md), [baseline profiles](../baselines/README.md).
