# Tool registration and permission review

| Document metadata | Value |
|---|---|
| Template owner | Enterprise Tool Platform Owner |
| Scope / status | Enterprise **proposed draft baseline**, pending organizational ratification |
| Experience | Microsoft Foundry resource/project, new experience unless stated; include external tool hosting explicitly |
| Last reviewed | 2026-09-16 |
| Capability status | See feature-specific official references; availability/authentication/hosting support is **verification-required** until evidenced |
| Evidence / exceptions | Tool Owner maintains restricted records; [policy exceptions](../governance/policies/README.md#exceptions) apply. Every recommendation inherits this metadata's scope, status and exceptions unless overridden |

Complete every field; `n/a` requires rationale and named reviewer. Unknown capability or missing evidence is a **hold**. Use [standard field names](../governance/standards/README.md); store credential references, never values.

## 1. Ownership, inventory and deployment — GOV-01 / GOV-02

| Field | Value to complete |
|---|---|
| `component_id`, `component_type`, name | `<stable tool ID; tool; descriptive name>` |
| `agent_id` / `consumer_agent_ids`, `dependency_ids` | `<approved consumers and downstream services; n/a with reason before consumers are assigned>` |
| `deployment_id`, `version`, `artifact_digest`, `source_commit` | `<immutable deployed implementation and schema/version mapping>` |
| Purpose / prohibited operations | `<business task, limitations and allowed caller population>` |
| `owner_business`, `owner_technical`, `owner_operations` / backup | `<named accountable people and support/on-call>` |
| `cost_center`, `budget_owner`, supplier / service contract | `<allocation, spend owner and external support/SLA if applicable>` |
| `environment`, `risk_classification`, `lifecycle_state` | `<environment; impact assessment and baseline; lifecycle>` |
| `tenant_id`, `subscription_id`, `resource_id`, `project_id`, `region` | `<actual hosting and consumer boundaries; external hosting reason where appropriate>` |
| `processing_geography`, `storage_geography` | `<all endpoints/dependencies/log stores, including redirects/failover>` |
| Endpoint / network / gateway path | `<approved scheme/host/path and egress destinations; ingress restrictions; direct-access/bypass tests>` |
| Capability / provenance evidence | `<provider, trusted source/build, license, official URLs, verification date and feature status>` |

## 2. Contract, identity and authorization — GOV-03 / GOV-05 / GOV-06

| Field | Value to complete |
|---|---|
| Contract format / schema version / digest | `<OpenAPI/function schema/other; exact reviewed version and hash; discovery source>` |
| Registration and schema drift process | `<approval authority, change notification, pinning or fail/hold on material drift>` |
| Shared Toolbox/default promotion if applicable | `<current and proposed default/version; inventory every affected consumer because promotion can update all without redeployment; per-consumer regressions/approvals, staged exposure where supported and tested default rollback>` |
| `identity_principal_ids` / caller type | `<application, managed/workload identity and/or delegated user; per-environment principals>` |
| Authentication | `<issuer, accepted audience, tenant validation, mTLS/API credential if applicable, credential-store reference and rotation/revocation>` |
| Server-side authorization / `permission_scopes` | `<per-operation/tenant/resource checks; caller identity source; deny by default; test evidence>` |
| Downstream identity / token handling | `<token acquisition/exchange and exact backend audience; no forwarding unrelated caller tokens>` |
| Untrusted input/output handling | `<schema, type, size, URL/destination and business-rule validation; malicious output cannot expand authority>` |
| Timeout / retries / idempotency | `<numeric bounds; idempotency keys and duplicate-write prevention; circuit breaking and cancellation>` |
| Transaction approval / irreversible effects | `<approval thresholds, independent authorized approver, binding to arguments/target/actor and expiry; execution recheck and replay prevention>` |

| Operation / schema ID | Read/write/destructive | Allowed principal / tenant / resource | Data input → output | Numeric transaction/volume limit | Approval rule | Negative-test evidence |
|---|---|---|---|---|---|---|
| `<operation>` | `<impact>` | `<server-enforced scope>` | `<classes>` | `<bound>` | `<required or justified n/a>` | `<URI>` |

Neither tool descriptions nor model instructions grant permissions. Treat both caller arguments and returned content as untrusted; authorization must remain effective when the model is compromised or the gateway is bypassed.

## 3. Data handling and telemetry — GOV-04 / GOV-08

| Data type / destination | Data Owner | Allowed/prohibited data / purpose | Redaction before log/export | Access / encryption | Numeric retention / deletion / hold | Evidence URI |
|---|---|---|---|---|---|---|
| `<arguments/results/service logs/traces/cache/backups>` | `<name>` | `<classes/use>` | `<rules and tests>` | `<principals/config>` | `<days/method/legal holds>` | `<URI>` |

Record `retention_policy_id`, `telemetry_profile_id`, provider data-use terms and privacy assessment: `<values and approvals>`.

## 4. Evaluation, SLOs and budget — GOV-07 / GOV-08 / GOV-09

| Field | Value to complete |
|---|---|
| Evaluation dataset/run and approval | `<authorized dataset version; functional, schema, negative authorization, injection, duplicate/replay, outage and timeout tests; numeric pass thresholds; independent reviewer>` |
| Agent integration evaluation | `<consumer agent versions; task/tool-selection correctness and regression results; consequential approval tests>` |
| Evaluation execution safety / optimizer limits | `<test endpoints or mocks, separate scoped test credentials and numeric cost/action bounds; verify no production mutations; optimizer prompt tool-description results require separate actual client-side tool execution tests>` |
| `slo_profile_id` | `<numeric availability/latency/error objectives, measurement windows, downstream dependency allowance and owner>` |
| Alert / SOC / correlation | `<redacted trace/request/action IDs mapped to trusted agent_id/deployment_id/version/cost_center; unauthorized calls and anomalous writes; tested alert receipt>` |
| `budget_profile_id`, approved budget | `<currency/period; fixed/per-call/egress costs and shared allocation; budget authority>` |
| Runtime limits / overage action | `<request rate/concurrency/timeout/retry/payload bounds; enforceable layer; circuit breaker and safe refusal; test evidence>` |

## 5. Change, rollback, incident and approval — GOV-10 / GOV-11 / GOV-12

| Field | Value to complete |
|---|---|
| Release manifest / promotion / rollback | `<immutable implementation + contract; independent pipeline approval; compatibility plan and tested prior version>` |
| Schema/permission changes | `<consumer notification, reapproval and reevaluation triggers; no silent widening of operations>` |
| Kill switch / containment / restart | `<operator, endpoint/credential/action disabling, queued/in-flight effects and measured exercise; independent restart authority>` |
| Retirement | `<consumer migration, access revocation, schedules/queues stopped, data deletion/holds and cost closure>` |
| Review schedule | `<last_reviewed_at; next_review_due_at; review on schema, permission, provider, data, region or ownership change>` |
| `approval_id`, `exception_ids` | `<named independent business/security/data/operations/FinOps approvals and dates; scope/expiry; none or valid exception links>` |

| Control / finding | Owner | Evidence URI / artifact/version / timestamp | Independent reviewer / date | Status / N/A reason / exception expiry |
|---|---|---|---|---|
| `<GOV-01..GOV-12 as applicable>` | `<name>` | `<URI>` | `<name/date>` | `<pass/fail/hold/n/a>` |

- [ ] Denied unauthorized operations and malicious inputs/outputs have been tested.
- [ ] Consumer registration, [security review](../checklists/security-review.md) and [production readiness](../checklists/production-readiness.md) link this exact approved tool version.

**Sources:** [Microsoft Foundry](../references/microsoft-foundry.md), [Azure](../references/azure.md), [controls](../governance/controls/README.md), [guardrail baselines](../governance/baselines/README.md).
