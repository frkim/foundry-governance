# MCP server and per-tool registration

| Document metadata | Value |
|---|---|
| Template owner | Enterprise Integration Security Owner |
| Scope / status | Enterprise **proposed draft baseline** pending organizational ratification |
| Experience | Microsoft Foundry resource/project, new experience unless stated; remote/local MCP hosting identified separately |
| Last reviewed | 2026-09-16 |
| Capability status | Verify protocol, transport, authentication, approvals and feature availability for the exact Foundry integration; unknown support is **verification-required** |
| Evidence / exceptions | MCP Service Owner maintains restricted evidence; [policy exceptions](../governance/policies/README.md#exceptions) apply. Every recommendation inherits this metadata's scope, status and exceptions unless overridden |

An MCP connection, successful discovery or authenticated server does **not** approve every exposed tool. Complete server review **and** per-tool permission review. Unknown/missing answers are holds; `n/a` requires a reason and independent reviewer. Do not copy tokens or sensitive discovery payloads into this form.

## 1. Server identity, owners and trust — GOV-01 / GOV-02 / GOV-05

| Field | Value to complete |
|---|---|
| `component_id`, `component_type`, name | `<stable MCP registration ID; mcp; server name>` |
| `agent_id` / `consumer_agent_ids`, `deployment_id`, `version` | `<approved consumers; deployed server/integration version and rollout ID>` |
| `artifact_digest`, `source_commit`, `dependency_ids` | `<server package/build provenance, when accessible; downstream tools/services and provider versions>` |
| Purpose / approved capabilities / prohibited use | `<task boundaries and caller population>` |
| `owner_business`, `owner_technical`, `owner_operations` / backup | `<named enterprise accountability; supplier operator/support and enterprise escalation>` |
| `cost_center`, `budget_owner` | `<finance allocation and spend authority>` |
| `environment`, `risk_classification`, `lifecycle_state` | `<environment; impact assessment/baseline; state>` |
| `tenant_id`, `subscription_id`, `resource_id`, `project_id`, `region` | `<consumer/hosting boundaries; external hosting explicitly documented>` |
| `processing_geography`, `storage_geography` / network | `<server/downstream/log locations; approved ingress/egress/destinations and failover>` |
| Endpoint / transport / protocol version | `<exact trusted endpoint, transport and negotiated protocol; TLS and redirect rules>` |
| Trust/provenance assessment | `<publisher identity, domain ownership, source/build verification, supplier security/privacy terms, license, incident/support commitments>` |
| Feature verification | `<official URL, verification date, Foundry experience, SDK/integration version, region and GA/preview/unknown status>` |
| Gateway offering / tier / actual routing | `<traditional APIM policy, Foundry/APIM integration Preview, dedicated AI Gateway tier Preview, or no gateway; exact SKU, network/SLA/auth limits, request-path proof and direct-access restrictions>` |

If relying on Foundry/APIM integration, prove eligibility and actual routing: the reviewed integration covers newly portal-created MCP tools without managed OAuth, not existing/code-first/managed-OAuth tools or OpenAPI/native tool paths. Record alternative enforcement for exclusions. The separate dedicated AI Gateway tier's API key currently grants access to all published models/tools; it does not establish per-tool entitlements. See [implementation distinctions](../governance/standards/README.md#current-implementation-distinctions) and reverify current official limitations.

## 2. Discovery and change integrity — GOV-05 / GOV-10

| Field | Value to complete |
|---|---|
| Discovery source and timestamp | `<reviewed endpoint/metadata source, collector and UTC time>` |
| Discovered capabilities | `<tools and any resources/prompts exposed; names, descriptions and schemas are untrusted content>` |
| Schema/version/hash | `<server version; per-tool schema version; canonicalization and hash algorithm; approved discovery snapshot URI/digest>` |
| Approved subset | `<explicit allowlist; reject unknown/new tools by default>` |
| Drift detection / approval boundary | `<when discovery is refreshed; who compares names/descriptions/schemas/permissions; deny or hold changed capabilities until review>` |
| Pinning limitations | `<what can be pinned; alternative monitoring/isolation if provider changes behavior without a version; residual risk approval>` |
| Toolbox/default and skill discovery if applicable | `<every affected consumer and approved default/immutable skill version; shared-default promotion can update all consumers without redeploy, requiring regressions/approval/rollback; tool search selects candidates and never grants execution permission>` |

| Tool ID / name | Schema version / digest | Owner | Read/write impact | Allowed caller / tenant / resource scope | Approval rule / numeric limits | Registration / test evidence |
|---|---|---|---|---|---|---|
| `<approved tool>` | `<exact reviewed schema>` | `<name>` | `<impact>` | `<server-enforced permissions>` | `<transaction-bound approval or justified n/a>` | `<tool-registration URI>` |

Use [tool registration](tool-registration.md) for complex tools. Discovery authorization does not substitute for execution authorization; test attempts to call undisclosed/unapproved tools directly.

## 3. Authentication, authorization and token boundaries — GOV-03 / GOV-06

| Field | Value to complete |
|---|---|
| Client → MCP server authentication | `<principal type and ID; expected issuer/audience/resource; tenant validation; supported managed identity/OAuth/other method>` |
| MCP server → downstream authentication | `<separate downstream principal or properly scoped token acquisition/exchange; intended backend audience>` |
| Per-tool server-side authorization | `<checks at execution for caller, tenant, resource, operation and object ownership; least-privilege permission_scopes>` |
| OAuth profile where applicable | `<authorization-server discovery/trust, protected resource/audience, consent/scopes, redirect validation, PKCE where applicable, token storage/expiry/rotation/revocation>` |
| Token handling / no passthrough | `<server rejects tokens not intended for itself; never passes the received client access token through to downstream services; acquire or exchange for a separately authorized backend-audience token; no secrets in prompts, tool arguments or logs>` |
| Non-OAuth credential controls | `<reason, supported mechanism, secret-store reference, minimal scope, rotation/revocation and compensating controls; never credential values>` |
| Required human approval | `<independent authorized approver, bound actor/tool/target/arguments/transaction/expiry; server recheck; reject modified/expired/replayed approval>` |
| Untrusted inputs and outputs | `<schema/size/URL validation, output isolation, indirect prompt-injection defenses and data minimization; model instructions cannot authorize actions>` |
| Failure behavior | `<deny consequential action on missing authorization/approval; timeouts, retries, idempotency, cancellation and downstream failure handling>` |

**Required negative evidence:** `<wrong-audience token, unauthorized scope, cross-tenant/resource access, unapproved tool, malicious description/output, schema drift, injection, invalid/replayed approval and direct/backend bypass tests>`. Record reviewer and results per case.

## 4. Data, logs and provider use — GOV-04 / GOV-08

| Data path / store | Data Owner | Allowed data / purpose / provider reuse terms | Redaction and access | Numeric retention / deletion / legal hold | Evidence |
|---|---|---|---|---|---|
| `<discovery metadata/tool args/results/server/downstream logs/cache>` | `<name>` | `<classes; prohibited data>` | `<before export; authorized readers>` | `<days/method; verified provider limitations>` | `<URI>` |

Record `data_classification`, `allowed_data_classes`, `retention_policy_id`, `telemetry_profile_id` and privacy/residency approval: `<values and decision>`.

## 5. Evaluation, operations, cost and lifecycle — GOV-07..GOV-12

| Field | Value to complete |
|---|---|
| Evaluation | `<dataset version and permitted use; run ID; contract/authorization/adversarial/consumer-task tests; numeric thresholds; independent decision>` |
| `slo_profile_id`, on-call / SOC | `<numeric availability/latency/error objectives and windows; server plus downstream SLIs; alert routes and delivery exercise>` |
| Correlation / telemetry coverage | `<trusted agent_id/deployment_id/version/cost_center and trace/request/action IDs; per-tool denial/approval/execution events; known collection gaps>` |
| `budget_profile_id`, approved budget | `<currency/period; server hosting/tool/provider/egress costs; shared allocation; budget owner and alerts>` |
| Enforced limits | `<discovery/payload sizes, tool calls/run, requests, concurrency, timeouts, retries; application/server/gateway layers; load/runaway evidence>` |
| Release / rollback | `<immutable integration/server/schema snapshot; independent promotion approval; tested rollback and consumer compatibility; supplier rollback limitations>` |
| Kill switch / incident / restart | `<connection and per-tool disabling; credential revocation; queues/in-flight effects; measured containment; independent restart approval>` |
| Retirement | `<remove registrations/routes/grants, notify consumers, stop schedules/charges, delete data subject to holds and retain required evidence>` |
| Review schedule / change triggers | `<last_reviewed_at; next_review_due_at; server/schema/tool/identity/provider/data/region changes and incident-triggered reassessment>` |
| `approval_id`, `exception_ids` | `<independent business/security/IAM/data/operations/FinOps authorities, scope/version/date; valid exception expiry or none>` |

| Control / test | Owner | Evidence URI / version / timestamp | Independent reviewer / date | Status / N/A rationale / exception |
|---|---|---|---|---|
| `<GOV-01..GOV-12 and per-tool tests>` | `<name>` | `<URI>` | `<name/date>` | `<pass/fail/hold/n/a>` |

- [ ] Server trust, discovery integrity and **each allowed tool's** authorization/approval are independently accepted.
- [ ] [Security review](../checklists/security-review.md) and [production readiness](../checklists/production-readiness.md) reference this exact server/schema/consumer version.

**Sources:** [Microsoft Foundry](../references/microsoft-foundry.md), [Azure](../references/azure.md), [MCP official security guidance](https://modelcontextprotocol.io/specification/latest/basic/security_best_practices) (verify against the selected protocol version), [controls](../governance/controls/README.md).
