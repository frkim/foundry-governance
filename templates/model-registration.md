# Model and deployment registration

| Document metadata | Value |
|---|---|
| Template owner | Enterprise Model Governance Owner |
| Scope / status | Enterprise **proposed draft baseline** pending organizational ratification |
| Experience | Microsoft Foundry resource/project, new experience unless stated; provider/deployment-specific distinctions required |
| Last reviewed | 2026-09-16 |
| Capability status | Verify model version, deployment type, geography, quota, safety controls and preview/GA state using feature-specific official references; unknown is **verification-required** |
| Evidence / exceptions | Model Owner maintains restricted evidence; [policy exceptions](../governance/policies/README.md#exceptions) apply. Every recommendation inherits this metadata's scope, status and exceptions unless overridden |

Register the **specific deployed model configuration**, not only a model family. Complete fields or document independently reviewed `n/a`; missing data is a hold. Use [canonical metadata](../governance/standards/README.md).

## 1. Identity, ownership and approved use — GOV-01 / GOV-05

| Field | Value to complete |
|---|---|
| `component_id`, `component_type`, name | `<stable model registration ID; model; name>` |
| `agent_id` / `consumer_agent_ids`, `dependency_ids` | `<approved agents and routing/gateway/fine-tuning/embedding dependencies>` |
| `deployment_id`, `version`, model provider/family/version | `<concrete rollout; exact provider model version, deployment name and any mutable aliases>` |
| `artifact_digest`, `source_commit` | `<deployment/configuration artifact and source; provider model weights digest only if available; otherwise documented provider-version evidence>` |
| `owner_business`, `owner_technical`, `owner_operations` / backup | `<accountable people, model/platform owner and support>` |
| `cost_center`, `budget_owner` | `<allocation and approved spend authority>` |
| Approved tasks / prohibited uses / user population | `<use cases, modalities, limits and acceptable output use>` |
| `environment`, `risk_classification`, `lifecycle_state` | `<assessment, baseline selection and state>` |
| Provider provenance / license / terms / limitations | `<model card, supplier review, license/commercial terms and documented limitations>` |

## 2. Deployment type, geography and fallback — GOV-02 / GOV-05

| Field | Value to complete |
|---|---|
| `tenant_id`, `subscription_id`, `resource_id`, `project_id`, `region` | `<actual hosting/resource location and isolation boundary>` |
| `deployment_type`, endpoint / API version | `<exact provider SKU/type and endpoint; managed/serverless/other hosting where relevant; API version>` |
| `processing_geography`, `storage_geography` | `<documented inference/training/abuse-monitoring/storage/log destinations separately; do not infer from region>` |
| Capability verification | `<official URL, date, selected model/type/region, experience, GA/preview state, required quota and proven availability>` |
| Network / identity path | `<approved ingress/egress/private connectivity where supported; gateway route and direct endpoint access restrictions>` |
| Provider upgrade/deprecation policy | `<version pinning/automatic upgrade settings and limits, retirement date, notifications, reevaluation owner>` |

| Routing choice to assess | Required decision / evidence |
|---|---|
| **Global deployment** | `<record actual global deployment type and provider-defined processing scope; Data Owner explicitly approves geographic processing implications; resource location alone is not sufficient>` |
| **Data-zone deployment** | `<record exact supported zone and processing guarantee from provider documentation; do not equate a zone with a single region; record separate storage/monitoring behavior>` |
| **Regional deployment** | `<record exact regional deployment type and documented processing constraints; verify each selected model supports it and associated storage/monitoring conditions>` |
| **Fallback / failover / load balancing** | `<list every model/version/provider/deployment type/region/endpoint; each needs data, identity, safety, quality, capacity and cost approval; unknown route is blocked>` |

The three categories above describe a review distinction, not a promise that every Foundry model/provider supports all three. Verify the selected service documentation, including [Azure OpenAI deployment types](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/deployment-types). Region, deployment type, provider, version or fallback changes require relevant reapproval and evaluation **before activation**; an availability incident does not silently authorize broader processing geography.

## 3. Identity, data and safety — GOV-03 / GOV-04 / GOV-06

| Field | Value to complete |
|---|---|
| `identity_principal_ids`, authentication | `<caller/gateway/pipeline principals, token issuer/audience or approved credential-store reference, rotation/revocation>` |
| `permission_scopes` / server-side authorization | `<who can deploy, configure and invoke; resource/project/model scopes; deny tests and direct-route bypass prevention>` |
| `data_classification`, `allowed_data_classes` / prohibited data | `<prompts, retrieved context, outputs, files, fine-tuning/evaluation data and logs separately>` |
| Provider data use / privacy terms | `<retention, reuse/training, abuse monitoring and applicable contractual commitments; approval and provider documentation>` |
| Safety configuration / refusal behavior | `<supported content/injection controls, selected thresholds, policy/version and actual blocking test evidence; model guardrails GA versus agent/tool-call/tool-response guardrails Preview; agent policy replaces model policy, so verify the effective policy for each consumer; agent annotate-only/Spotlighting/groundedness controls are unsupported, distinct from model controls or quality evaluation; no claim these provide authorization or complete DLP>` |
| Tool use / autonomy / output handling | `<allowed capabilities, schema validation, downstream server-side authorization and transaction approval retained regardless of model behavior>` |
| Fine-tuning / customization if applicable | `<dataset origin/rights/consent, transformation and training job/version, deletion and evaluation; otherwise reviewed n/a>` |

| Data/store | Data Owner | Allowed purpose/classes | Redaction / access / encryption | Numeric retention / deletion / legal hold | Evidence URI |
|---|---|---|---|---|---|
| `<provider state/files/prompts/outputs/logs/cache/datasets/backups>` | `<name>` | `<approved use>` | `<actual rules>` | `<days/method/provider limits>` | `<URI>` |

Record `retention_policy_id` and `telemetry_profile_id`: `<values>`.

## 4. Evaluation, reliability and economics — GOV-07 / GOV-08 / GOV-09

| Field | Value to complete |
|---|---|
| Evaluation dataset/version and permitted use | `<representative tasks/languages/users, adverse cases, sensitive-data approval and limitations>` |
| `evaluation_run_id`, thresholds, comparison | `<numeric task success/groundedness where relevant/safety/tool correctness requirements; current versus proposed model and each fallback; independent reviewer>` |
| Test configuration / reproducibility limits | `<model/version, prompt/system configuration, sampling parameters, tools, seed if supported, repetitions and nondeterminism>` |
| Capacity / performance evidence | `<load, context/output token limits, concurrency, quota, rate/latency/error tests and fallback capacity>` |
| `slo_profile_id` / alerts / on-call | `<numeric availability/latency/error objectives and measurement windows; quality/abuse signals, alert destinations and tested response>` |
| Telemetry / traceability | `<trusted agent_id/deployment_id/version/cost_center with trace/request IDs, selected actual model/route, token usage; redacted access-controlled records and coverage gaps>` |
| `budget_profile_id`, approved budget | `<currency/period; consumption/provisioned commitments, input/output/cache/embedding/fine-tuning/hosting charges as relevant, downstream/shared allocation>` |
| Enforced request/token/concurrency/retry limits | `<numeric ceilings, enforcement layer and safe refusal; alert and runaway test; budget notifications are not spend caps>` |

## 5. Release, rollback and approval — GOV-10 / GOV-11 / GOV-12

| Field | Value to complete |
|---|---|
| Release / promotion / canary | `<immutable config/route manifest, pipeline approval, independent sign-off, rollout window and numeric abort thresholds>` |
| Rollback / unavailable old version | `<known approved previous deployment, tested switch and availability; if rollback unavailable, approved alternative or safe suspension; state/side-effect implications>` |
| Incident kill switch / restart | `<disable invoking routes and relevant agent actions; revoke grants where appropriate; measured containment; authorized independent restart>` |
| Retirement / migration | `<deprecation timeline, consumers migrated/retested, endpoints/grants/files removed subject to holds, commitments/costs closed>` |
| Review schedule | `<last_reviewed_at, next_review_due_at; version/type/region/provider/terms/safety/fallback changes trigger re-review>` |
| `approval_id`, `exception_ids` | `<independent business/model/security/data/evaluation/operations/FinOps approvers and dates; precise scope and expiry; exceptions or none>` |

| Control / finding | Owner | Evidence URI / exact version / timestamp | Independent reviewer / date | Status / N/A rationale / exception expiry |
|---|---|---|---|---|
| `<GOV-01..GOV-12 as applicable>` | `<name>` | `<URI>` | `<name/date>` | `<pass/fail/hold/n/a>` |

- [ ] All active and fallback routes match separately approved model/version/type/geography records.
- [ ] [Architecture](../checklists/architecture-review.md), [security](../checklists/security-review.md) and [production-readiness](../checklists/production-readiness.md) evidence references this exact deployment.

**Sources:** [Microsoft Foundry](../references/microsoft-foundry.md), [Azure](../references/azure.md), [controls](../governance/controls/README.md), [guardrail baselines](../governance/baselines/README.md).
