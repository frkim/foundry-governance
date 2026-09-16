# Guardrails and enforcement baselines

Last reviewed: **2026-09-16**.
Scope: enterprise model/agent safety, authorization, data, execution, release, and operational guardrails.
Experience: **Foundry resource/project (new)** unless explicitly stated.
Capability status: feature-specific; see the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) source registers.
Recommendation: adopt the Enterprise Guardrail Baseline, adding the High-Risk Agent Guardrail Baseline where consequences require it.
Limitations: product guardrails are only part of enterprise controls; supported intervention points and failure behavior vary.
Exceptions: [exception request](../../templates/exception-request.md); metadata applies to every recommendation unless overridden.

## Microsoft capability

The reviewed Foundry documentation distinguishes **model guardrails (GA)** from **agent guardrails, including tool-call/tool-response controls (Preview)**. These statuses do not establish availability for every model, runtime, API, deployment type, or region.

| Capability / behavior | Documented scope | Required enterprise interpretation |
| --- | --- | --- |
| Model safety policies | Model-level guardrails with supported categories/intervention points | Record effective thresholds, model/API support, and blocking behavior; do not assume every optional detector is included |
| Agent safety policies | **Preview**, including supported tool boundaries | Explicit agent policy **replaces**, rather than merges with, the model policy; reconcile the full required baseline |
| Agent policy modes / detectors | Agent guardrails do **not** support annotate-only, Spotlighting, or groundedness controls in reviewed guidance | Do not claim these agent-level protections; provide separate supported evaluation/application controls where needed |
| Hosted content-safety attachment | **Preview** agent guardrail scope; `rai_config` controls attachment | Omitting `rai_config` means no hosted content-safety guardrail; supplying it without a policy selects the default |
| Invalid hosted policy reference | Documented invalid policy ID can fail open while agent appears active | Verify policy existence/validity and an actual expected-block response; deployment status is not safety evidence |
| Hosted network egress guardrails | **Preview**, hosted-only; distinct from VNet/firewall controls | Verify rules and effective behavior; audit mode can still transform/rewrite traffic |
| Future egress capabilities | Dynamic secret/identity header injection, service-tag/IP rules, MCP policies, PII/DLP inspection described as future | Do not count them as implemented controls or use them to approve sensitive traffic |
| Continuous evaluation / scheduled red teaming / monitoring | Named Foundry experiences are **Preview** | Detective/assessment controls over sampled or completed activity, not guaranteed inline blocking |

Prompt Shields and harmful-content detection can support defense in depth at documented points. They cannot grant user permissions, secure a database row, validate a payment, or guarantee factual correctness. See [security](../07-agent-security/README.md) and [quality evaluation](../12-quality-evaluation/README.md).

## Enterprise recommendation

Adopt the [canonical baselines](../../governance/baselines/README.md). Apply the enterprise baseline to all workloads proportionately; **add** the high-risk baseline for sensitive/regulated data, consequential decisions/actions, broad privileges, or elevated harm. Unresolved classification is a release hold.

Assign an enforcer, owner, policy version, acceptance check, and residual-gap record to every control. A written rule, enabled toggle, successful deployment, or high evaluation score is not proof of runtime enforcement.

### Enterprise Guardrail Baseline

| Control / category | Actual enforcement point and owner | Acceptance evidence / important gap |
| --- | --- | --- |
| **GOV-01 / GOV-02 · Preventive:** registered purpose and isolation | Inventory/release gate; platform and workload owners | Approved owner, risk, topology, processing geography; cross-boundary denial results |
| **GOV-03 · Preventive:** authenticated, least-privileged execution | Application identity middleware, tool/backend authorization; IAM/tool owners | User/tenant/object denial, no inherited broad grants, direct-call bypass denied |
| **GOV-04 / GOV-05 · Preventive:** approved data/components | Retrieval ACLs, data pipelines, dependency manifests and runtime allowlists; data/component owners | Provenance, permitted models/tools/MCP/skills, schema/hash checks; caches and memory included |
| **GOV-06 · Preventive:** input/output and injection safeguards | Supported model/agent guardrail points plus application validation; security/workload owners | Expected harmful/injection cases blocked where required; unsupported modalities/streams/paths explicitly covered or restricted |
| **GOV-06 · Preventive:** safe tool execution and approval | Deterministic tool executor/backend; tool/business owner | Strict schema/business limits; risk-class approvals; changed/replayed/expired action denied |
| **GOV-06 / GOV-07 · Preventive:** effective hosted policy | Hosted configuration and deployed policy; security/release owner | Valid `rai_config`/policy ID and safe expected-block check; invalid-policy fail-open risk addressed |
| **GOV-07 / GOV-10 · Preventive:** versioned quality/release gate | CI/CD approval and evaluation process; release/evaluation owner | Held-out task/safety/action evaluation, regression thresholds, immutable manifest, rollback target |
| **GOV-09 · Preventive:** bounded execution and cost | Orchestrator, supported gateway policies, backend limits; SRE/FinOps | Token/tool-hop/time/concurrency/retry limits; overshoot and global accounting gaps documented |
| **GOV-04 / GOV-08 · Detective:** protected telemetry | Pre-export redaction, access-controlled sinks, SOC rules; data/SOC owners | Complete action/approval chain, redaction/access/retention checks, heartbeat and alert receipt |
| **GOV-05 / GOV-08 / GOV-12 · Detective:** drift and exception review | Inventory/configuration reconciliation; platform/governance owners | Unknown tools/scopes/policies and expired exceptions identified and assigned |
| **GOV-11 · Corrective:** independent containment | Ingress, scheduler, tool authorization, gateway/backend switches; incident/component owners | Timed disable exercise covering queues/replicas/in-flight effects; agent cooperation not required |
| **GOV-10 / GOV-11 / GOV-12 · Corrective:** recover or retire | Release, transaction reconciliation, grant/data lifecycle; accountable owners | Approved restart or retirement; side effects reconciled; failed controls remediated and retested |

### High-Risk Agent Guardrail Baseline — additive

| Additional control | Enforcer / owner | Acceptance evidence / release condition |
| --- | --- | --- |
| Narrow mission and stronger separation | Resource/network/runtime/data boundaries; platform/security/data owners | Only approved users, tasks, datasets, destinations, and action types; restricted external access verified |
| Independent per-transaction approval | Backend executor + human approval service; business/tool owners | Verified approver, target/arguments/amount, nonce, expiry, policy and current state; self-approval/replay denied |
| Administrative-action separation | Privileged executor/PIM/change process; platform/security owners | No unattended autonomy; two distinct authorized human approvals and just-in-time rights |
| Fail-closed consequential execution | Application/tool policy service; workload/tool owners | No write if authorization, approval, policy validity, or required action audit cannot be established |
| Independent adversarial assessment | Security/evaluation reviewers independent of implementer | Indirect injection, malicious tool results, cross-user memory, delegation escalation, provider fallback and business misuse covered |
| Tighter exposure and staged rollout | Orchestrator/route/consumer admission; SRE/FinOps/release owners | Numeric per-action/run/concurrency/spend ceilings and canary rollback criteria; blank limits block release |
| Complete consequential-action audit | Tool/backend and protected evidence sink; SOC/tool owners | Unsampled approval-to-execution chain; missing evidence triggers owned restriction/escalation |
| More frequent review and fast containment | Security/governance/on-call process | Proposed weekly outcome/control review, monthly privilege/exception review, measured risk-approved containment time |
| Independent restart authorization | Incident commander + business/security/release owners | Root-cause fix, state reconciliation, reevaluation, signed restart and enhanced monitoring |

These are **proposed enterprise policies**, not Microsoft-mandated baselines. High-risk classification does not mean that an internal exception can waive a legal prohibition.

## Proposed enterprise policy

- Select and record the baseline, risk approvers, numeric thresholds, permitted autonomy, and control owners before production.
- Require **blocking** at required preventive control points; detection, annotations, alerts, and retrospective evaluation do not substitute for blocking.
- Reconcile effective agent/model policies explicitly. Never assume a stricter model policy remains active after an agent policy replaces it.
- For hosted agents, policy attachment, existence/validity, and an observed expected-block result are release gates; active status alone is insufficient.
- Approve Preview features individually with limited rollout, source/status evidence, support/SLA assessment, compensating controls, expiry, and an exit path.
- If a required safeguard is unavailable, reduce scope, use a supported alternative, or hold release. “Planned” and “future” features are not compensating controls.
- Reassess on model, prompt, tool, schema, identity, data, policy, runtime, gateway, or material business-purpose change, and after incidents.

## Implementation

### 1. Build an intervention-point map

Map user input, retrieved documents, model request/response, proposed tool call, tool result, delegation, final output, and external side effects. For each, record whether enforcement is model-native, agent-native, gateway-supported, application-owned, or absent.

Include bypass paths: direct backend/model calls, managed-OAuth tools outside gateway routing, application-hosted functions, code-first MCP, streaming, scheduled runs, and fallback providers. Restrict uncovered high-risk paths.

### 2. Configure and prove the effective policy

1. Export the exact policy ID/version, thresholds, supported categories, target model/runtime/API, and intervention points.
2. Determine whether model policy or an explicit replacing agent policy applies; compare every required baseline setting.
3. For hosted content safety, explicitly configure `rai_config`, verify the referenced policy exists and is valid, and check default-selection behavior when no policy is specified.
4. Run an approved non-destructive expected-block fixture against the released deployment; retain decision/error metadata without unnecessary harmful content.
5. Check allowed benign cases and supported languages/modalities/streams so false positives and unsupported paths are visible.
6. Treat unverified or invalid policy references as a release failure even if the service allows deployment. Enforce the release hold externally; do not assume the platform fails closed.
7. Recheck effective policy after changes, fallback, restart, or shared default promotion; monitor configuration drift.

### 3. Separate safety, quality, and business authorization

Content checks address supported content risks. Groundedness, relevance, correctness, and task completion require evaluation and application design; agent-level groundedness control is not available in the reviewed guardrail matrix.

Tool authorization and transaction approval require deterministic server-side checks. Apply the [tool risk matrix](../08-tools/README.md), not a generic “human approved this conversation” flag. A safe-sounding answer may still contain a wrong calculation or cause an unauthorized action.

PII/DLP obligations need separately verified controls in ingestion, application, tool, gateway, and telemetry paths. Do not rely on future hosted-egress PII/DLP inspection or assume content-category filters discover all confidential business data.

### 4. Maintain a gap-oriented acceptance suite

| Exercise | Required observation | Gap to record |
| --- | --- | --- |
| Unsafe input/output and indirect injection | Supported blocking decisions at each intended point; backend authority remains constrained | Unsupported language/modality, tool result, stream, or provider; residual false negatives |
| Missing/invalid hosted policy | External release gate rejects configuration; valid configuration demonstrably blocks expected fixture | Runtime may fail open despite active status; no assumption of native fail-closed |
| Unauthorized user/object/tool | Denied at real backend/executor even without the UI/gateway | Shared identity, inherited grants, direct route, or absent document ACL enforcement |
| Changed/replayed approval | No side effect; stale/altered request gets a new decision | Approval cache, normalized-argument mismatch, race with business-state change |
| Telemetry/redaction and trace migration | Protected and ordinary stores inspected; safe identifiers only; alert reaches owner | Raw/history/dual-write copies, sampling, missing action outcomes |
| Loop, timeout, retry and fallback | Bounded work; uncertain writes reconciled; only approved compatible fallback | Gateway counter overshoot, session loss, unapproved geography, duplicate external effect |
| Kill switch and recovery | New/queued work stopped as designed; committed actions reconciled; independent restart approval | Active tokens, in-flight writes, queues/replicas, irreversible consequences |

These are exercises for the adopting implementation. This documentation repository does not ship or claim execution of these tests.

## Evidence

Keep a baseline assessment with control ID, applicable asset/release, implementer, independent reviewer, policy/configuration export, test result, evidence URI/date, status, residual gap, and exception ID/expiry. Record both allowed and denied cases and the actual enforcement location.

Use the [security](../../checklists/security-review.md), [production-readiness](../../checklists/production-readiness.md), and [go-live](../../checklists/go-live.md) reviews. Evidence spans **GOV-01 through GOV-12**; a product safety dashboard alone does not satisfy the catalog.

## Sources

- [Foundry guardrails overview](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview).
- [Hosted agent guardrails](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-hosted-agent-guardrails), including [Preview network egress controls](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-hosted-agent-guardrails#network-egress-controls-preview).
- [Prompt Shields concepts](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection).
- [Sensitive trace-content migration](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/traces-sensitive-content).
- Status and evidence caveats: [Foundry](../../references/microsoft-foundry.md), [Azure](../../references/azure.md); [canonical baselines](../../governance/baselines/README.md).

## Limitations and unresolved decisions

Model and agent guardrails have different support matrices and replacement semantics; hosted attachment has a documented fail-open configuration risk. Preview hosted-egress audit mode is not necessarily side-effect-free. Future inspection/injection features must not be represented as current controls.

No guardrail baseline guarantees legal compliance, perfect prompt-injection resistance, complete DLP, factual accuracy, or reversible business actions. Uncovered paths and failed controls remain explicit release decisions owned by accountable risk authorities, not hidden by an aggregate safety score.
