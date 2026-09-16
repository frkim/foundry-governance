# Agent registration and change assessment

| Document metadata | Value |
|---|---|
| Template owner | Enterprise AI Platform Owner |
| Scope / status | Enterprise **proposed draft baseline** pending organizational ratification; completed forms require independent approval |
| Experience | Microsoft Foundry resource/project, new experience unless explicitly identified otherwise |
| Last reviewed | 2026-09-16 |
| Capability status | Verify feature-specific official references for the actual model, region, deployment and experience; unknown support is **verification-required** |
| Evidence / exceptions | Service Owner maintains restricted evidence; [exception process](../governance/policies/README.md#exceptions) applies. Every recommendation inherits this metadata's scope, status and exceptions unless overridden |

Complete every field or enter `n/a — rationale — reviewer`. An unresolved field is a **hold**, not an implied approval. Record evidence URIs rather than secrets, raw production prompts or personal data. Field names follow the [metadata standard](../governance/standards/README.md); GOV identifiers reference the [control catalog](../governance/controls/README.md).

## 1. Identity, accountability and purpose — GOV-01 / GOV-12

| Field | Value to complete |
|---|---|
| `agent_id`, `component_id`, `display_name` | `<stable inventory IDs and name>` |
| `deployment_id`, `version`, `artifact_digest`, `source_commit` | `<concrete rollout and immutable artifact/source identifiers>` |
| `business_purpose` / prohibited uses | `<approved users/tasks; explicitly out-of-scope behavior>` |
| `owner_business`, `owner_technical`, `owner_operations` / backups | `<named accountable people, contacts and accepted on-call ownership>` |
| Security / data / privacy / evaluation / FinOps reviewers | `<names and authority; independent of change author where approving>` |
| `cost_center`, `budget_owner` | `<finance-approved allocation and spend authority>` |
| `environment`, `lifecycle_state` | `<dev/test/staging/prod; current and requested lifecycle state>` |
| `risk_classification`, assessment URI, baseline | `<standard/high; impact rationale; Enterprise plus High-Risk baseline if applicable>` |
| `last_reviewed_at`, `next_review_due_at`, planned retirement | `<UTC dates, review triggers and retirement owner>` |

## 2. Deployment boundaries and dependencies — GOV-02 / GOV-05

| Field | Value to complete |
|---|---|
| `tenant_id`, `subscription_id`, `resource_id`, `project_id` | `<actual boundaries and inventory mapping>` |
| `region`, `processing_geography`, `storage_geography` | `<hosting versus each model/tool/data/log processing and storage destination>` |
| Experience / supported capability evidence | `<new/classic/other per component; official URL, verification date, region/SKU and GA/preview/unknown status>` |
| Orchestration / lifecycle constraints | `<prompt/hosted/external/framework choice; no new Foundry visual workflows, which are Preview and retiring 2026-12-01; existing visual workflow migration owner, deadline, evaluation and rollback/safe-suspension plan>` |
| Isolation / ingress / egress / external exposure | `<network and access boundaries; supported private connectivity; approved outbound destinations; bypass tests>` |
| Gateway offering / coverage | `<exact APIM/gateway tier and feature status; configured model/tool/MCP routes, unsupported or excluded paths, per-tool authorization and actual routing tests; see implementation distinctions below>` |
| `dependency_ids` / graph URI | `<all models, tools, MCP servers, skills, gateways, agents, retrieval/vector stores, queues and hosting services>` |

Apply the [current implementation distinctions](../governance/standards/README.md#current-implementation-distinctions): project isolation is feature-specific, both prompt and hosted networking require current runtime-specific assessment, and the different AI Gateway offerings do not share identical routing, authorization, networking or SLA behavior.

| Dependency ID / type | Owner | Exact version / schema or package digest | Registration / approval URI | Data and permission scope | Region / fallback / change trigger |
|---|---|---|---|---|---|
| `<model/tool/MCP/skill/agent/store>` | `<name>` | `<immutable version or documented drift detection>` | `<URI>` | `<allowed classes/actions>` | `<approved routes only>` |

## 3. Identity, data and behavior — GOV-03 / GOV-04 / GOV-06

| Field | Value to complete |
|---|---|
| `identity_principal_ids`, identity types | `<caller, agent runtime, pipeline, gateway and per-tool principals; managed/delegated/service identity>` |
| Authentication / credential lifecycle | `<issuer, expected audience, tenant validation, secret-store reference where needed, rotation and revocation owner; no secret values>` |
| `permission_scopes` / authorization enforcement | `<exact operations/resources/tenants; where server-side checks run; negative-test evidence>` |
| Endpoint invocation versus management/publishing | `<separate principal/role/scope for each task; Foundry Agent Consumer agent scope applies to endpoint invocation, not management; documented publishing minimum is resource-scoped Foundry Project Manager; verify current definitions, assignment-interface limits and denied-operation tests>` |
| Delegation / cross-agent trust | `<whether caller identity is propagated or exchanged; audience constraints; delegated permissions cannot exceed grants>` |
| Effective guardrail policy / hosted failure verification | `<model guardrails GA versus agent guardrails Preview; exact effective policy/version/scope; agent policy replaces model policy and agent annotate-only is unsupported; hosted rai_config explicitly set, referenced policy existence/validity confirmed and observed expected-block test URI; omitted/invalid configuration can leave active agents unprotected>` |
| `data_classification`, `allowed_data_classes` / prohibited data | `<prompts, attachments, retrieval, output, memory and telemetry separately>` |
| Data purpose / provider reuse / sensitive-data assessment | `<approved purpose, relevant terms, privacy/legal approval and minimization>` |
| Memory and retrieval isolation | `<per-user/tenant keys, access filtering, persistence rules; poisoning and cross-user leakage tests>` |
| `retention_policy_id`, `telemetry_profile_id` | `<approved policies and actual configuration/evidence>` |

| Data location / type | Data Owner | Allowed data / redaction before export | Access and encryption | Numeric retention / deletion / legal hold | Evidence URI |
|---|---|---|---|---|---|
| `<threads/memory/files/search/tool payloads/logs/caches/backups>` | `<name>` | `<classes and rules>` | `<principals/configuration>` | `<days; deletion method; hold handling>` | `<test/configuration>` |

| Action / tool / skill | Read/write and impact | Server-side authorization and business limits | Human approval rule / independent approver | Approval binding, expiry and replay handling | Denial / abuse-test evidence |
|---|---|---|---|---|---|
| `<approved operation>` | `<impact and reversibility>` | `<actor/tenant/resource/action scope>` | `<threshold and approver authority, or justified n/a>` | `<transaction ID, target/arguments, expiry; recheck at execution>` | `<URI>` |

Treat retrieved instructions, skill content, MCP/tool inputs and outputs as untrusted. Record prompt-injection defenses, schema/URL/size validation, output handling and permitted autonomy. A system prompt, authenticated gateway or content filter does not replace server-side authorization. Record fail-closed behavior when required authorization or approval is unavailable.

## 4. Evaluation, operations and consumption — GOV-07 / GOV-08 / GOV-09

| Field | Value to complete |
|---|---|
| `evaluation_dataset_version`, permitted dataset use | `<representative tasks, adverse cases, privacy approval and dataset owner>` |
| `evaluation_run_id`, thresholds and decision | `<task success, groundedness where relevant, harmful behavior, tool correctness; numeric minimums/maximums; baseline comparison; independent reviewer>` |
| Adversarial / delegation / approval cases | `<indirect injection, data exfiltration, unauthorized calls, malicious MCP output, cross-user memory, modified/replayed approvals and fallback tests>` |
| Optimizer / tool-invoking evaluation safety | `<optimizer feature/version/Preview eligibility if used; approved test endpoints/mocks, separate scoped test credentials, cost/action bounds and side-effect checks; separate actual client-side tool tests where prompt tool-description optimization cannot execute them>` |
| `slo_profile_id` / on-call and SOC | `<numeric availability/latency/error objectives and windows, alert route, responder and tested acknowledgement>` |
| Telemetry correlation / access / gaps | `<trusted agent_id/deployment_id/version/cost_center + trace/request/action IDs; redaction; retention; known coverage gaps>` |
| Sensitive-trace migration / historical copies | `<actual AppGenAIContent Preview routing and early-migration setting; ordinary/protected-table default duplication until 2026-09-30, historical copies and exports; access protection is not redaction; reader, numeric retention/deletion/hold evidence for all copies>` |
| `budget_profile_id`, approved budget / currency / period | `<base and forecast peak cost, shared/downstream allocation, escalation thresholds and owner>` |
| Enforced limits / safe degraded behavior | `<tokens/request, calls/run, loop depth, retries/backoff, timeout, concurrency, request rate; enforcement layer and test; budgets are not hard caps>` |
| Continuous review | `<quality/sample/drift/cost/access/exception review schedule; evidence owner>` |

## 5. Release, incident and retirement — GOV-10 / GOV-11

| Field | Value to complete |
|---|---|
| Immutable release / promotion / independent approval | `<pipeline/run, protected artifact/configuration, environment gates and approver>` |
| Canary and abort criteria | `<scope, measurement window, numeric stop thresholds, owner>` |
| Rollback / state and external effects | `<approved previous artifact/route; steps, recovery objective, test result; irreversible transaction reconciliation>` |
| Kill switch and incident response | `<authorized operator, application/tool enforcement points, queues/replicas/in-flight coverage, measured containment time and incident runbook>` |
| Restart / fallback approval | `<independent restart authority; only separately approved models/tools/routes/geographies>` |
| Retirement / deletion / cost closure | `<credential/routes/queues/dependency cleanup; data/hold schedule; required evidence retention; closure approver>` |

## 6. Approval and evidence record

| Applicable control / checklist | Owner | Evidence URI / version / timestamp | Independent reviewer / date | Status / finding / exception ID |
|---|---|---|---|---|
| `<GOV-01..GOV-12; one row per control>` | `<name>` | `<URI>` | `<name/date>` | `<pass/fail/hold/n/a with rationale; exception scope/expiry>` |

- [ ] Business, architecture, security/data, evaluation, operations and FinOps owners accepted their scope.
- [ ] [Architecture](../checklists/architecture-review.md), [security](../checklists/security-review.md), [production-readiness](../checklists/production-readiness.md) and [go-live](../checklists/go-live.md) decisions are attached for the requested lifecycle stage.
- [ ] `approval_id`, approver identity/authority, exact artifact/deployment scope, decision date, expiry if time-limited and next review date are recorded: `<values>`.
- [ ] `exception_ids` reference independently approved, unexpired, limited-scope [exceptions](exception-request.md), or `none`: `<values>`.

**Sources:** [Microsoft Foundry](../references/microsoft-foundry.md), [Azure](../references/azure.md), [guardrail baselines](../governance/baselines/README.md).
