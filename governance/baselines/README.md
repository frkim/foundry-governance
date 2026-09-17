# Agent guardrail baselines

| Document metadata | Value |
|---|---|
| Owner | Enterprise Application Security Owner with AI Platform and Business Risk Owners |
| Scope / status | Enterprise **proposed draft baseline** pending organizational ratification; not Microsoft-mandated controls |
| Experience | Microsoft Foundry resource/project, new experience unless stated otherwise |
| Last reviewed | 2026-09-16 |
| Capability status | Verify each selected feature in official references for model, deployment type, region, experience and release status; unknown support is **verification-required** |
| Evidence | Version-bound baseline assessment, test results, configuration and approvals; workload Security Owner is evidence custodian |
| Exceptions | [Policy exception process](../policies/README.md#exceptions); every recommendation inherits this metadata's scope, status and exception rules unless overridden |

## Selecting and proving a baseline

The Service Owner records a risk assessment with Business Risk and Security approval. Apply the **Enterprise Guardrail Baseline** to all workloads, including experiments with proportionate implementation. Apply the **High-Risk Agent Guardrail Baseline in addition** when an agent can cause consequential financial/legal/physical effects, access sensitive or regulated information, exercise broad privileged access, autonomously change important systems, or otherwise presents elevated harm. These are proposed enterprise classification triggers, not a legal classification system. Unresolved classification is a release hold.

Each row needs a named implementer, independent reviewer, evidence URI and date, tested deployment/version, status and any exception ID. “Enabled” is not evidence that a control works. A missing feature requires an effective alternative, reduced scope or hold; it must not silently remove the control.

## Enterprise Guardrail Baseline

### Preventive controls

| Measure | Accountable owner / implementation | Evidence | Control |
|---|---|---|---|
| Registered trust boundary | Service/Platform Owners register components and approved environments; validate resource/project/network limits and approved processing/storage destinations | Registration, dependency/data-flow map, boundary tests and residency decision | [GOV-01](../controls/README.md#gov-01), [GOV-02](../controls/README.md#gov-02) |
| Server-enforced least privilege | IAM/Application Owners authenticate each caller, enforce operation/resource/tenant scopes on tool servers and constrain delegated permissions; use managed identities where supported | Principal/scope map; cross-tenant and unauthorized-operation denial tests | [GOV-03](../controls/README.md#gov-03) |
| Approved data and dependencies | Data/Component Owners allow only approved data classes, model versions, tools, MCP servers and skills; validate provenance, schema and permissions; redact before logging | Data-use decision, dependency manifest/digests, schema and redaction tests | [GOV-04](../controls/README.md#gov-04), [GOV-05](../controls/README.md#gov-05) |
| Bounded autonomy and untrusted content | Application Security/Business Owners treat user/retrieved/MCP/tool inputs **and outputs** as untrusted; validate schemas, URLs, sizes and business rules; use evaluated safety controls and transaction approval for consequential actions | Injection tests, unsafe-action denials, approval/replay tests and safety configuration | [GOV-06](../controls/README.md#gov-06) |
| Functionally verified hosted guardrails | Security/Release Owners explicitly configure hosted `rai_config`, identify and validate the resolved default or custom policy, use the full ARM ID for a custom policy, and run an approved non-destructive expected-block test. Omission disables content safety; invalid policy can fail open despite active status. Reconcile replacement of model policy by agent policy; agent annotate-only, Spotlighting and groundedness controls are unsupported | Exact effective policy/version/scope, policy existence/validity evidence and observed blocking result for the released deployment; active status/configuration presence alone do not pass | [GOV-06](../controls/README.md#gov-06), [GOV-07](../controls/README.md#gov-07) |
| Release and resource gates | Release/Evaluation/FinOps Owners approve immutable changes only after evaluation; constrain tokens, tool calls, retries, loop depth, concurrency and spend escalation | Evaluation gate, manifest approval, load/runaway limit tests and budget | [GOV-07](../controls/README.md#gov-07), [GOV-09](../controls/README.md#gov-09), [GOV-10](../controls/README.md#gov-10) |

### Detective controls

| Measure | Accountable owner / implementation | Evidence | Control |
|---|---|---|---|
| Protected end-to-end telemetry | Operations Owner correlates deployed versions and requests with model/tool authorization and approval events; suppresses sensitive payloads and restricts access | Redacted representative trace, coverage gaps and access tests | [GOV-04](../controls/README.md#gov-04), [GOV-08](../controls/README.md#gov-08) |
| Sensitive-trace copy and migration checks | Operations/Data Owners verify ordinary and access-protected `AppGenAIContent` tables and all exports, including historical copies. The protected-table feature is Preview, not redaction; default dual writing lasts until 2026-09-30 unless migrated early, and switching routes does not erase history | Actual routing/migration setting, safe capture test, reader permissions and numeric retention/deletion/hold coverage for every current and historical store | [GOV-04](../controls/README.md#gov-04), [GOV-08](../controls/README.md#gov-08) |
| Abuse, quality and cost monitoring | SOC/Evaluation/FinOps Owners monitor policy denials, anomalous tool access, quality drift, SLO errors and consumption; assign numeric thresholds and responders | Synthetic alert receipts, versioned sample reviews, SLO and cost reports | [GOV-06](../controls/README.md#gov-06), [GOV-07](../controls/README.md#gov-07), [GOV-08](../controls/README.md#gov-08), [GOV-09](../controls/README.md#gov-09) |
| Inventory, dependency and approval drift | Platform/Governance Owners compare actual versions/scopes with approvals and review exceptions at least monthly | Reconciliation report, schema/hash changes, expiry register and assigned findings | [GOV-01](../controls/README.md#gov-01), [GOV-05](../controls/README.md#gov-05), [GOV-12](../controls/README.md#gov-12) |

### Corrective controls

| Measure | Accountable owner / implementation | Evidence | Control |
|---|---|---|---|
| Contain unsafe execution | Incident Commander/Tool Owners can stop new and queued actions, revoke access and disable routes; constrain in-flight effects at enforcement points | Timed kill-switch exercise, queue/replica coverage and known containment limits | [GOV-11](../controls/README.md#gov-11) |
| Recover and reapprove | Release/Service Owners roll back to a known approved configuration, assess data/external side effects, rerun relevant evaluations and independently approve restart | Rollback rehearsal, restoration timing, side-effect reconciliation and restart decision | [GOV-07](../controls/README.md#gov-07), [GOV-10](../controls/README.md#gov-10), [GOV-11](../controls/README.md#gov-11) |
| Remediate or retire | Control/Data Owners remediate drift and expired exceptions; remove retired credentials/routes/data subject to legal holds; update baseline after incidents | Retest, exception closure, deletion/access verification and incident lessons | [GOV-04](../controls/README.md#gov-04), [GOV-11](../controls/README.md#gov-11), [GOV-12](../controls/README.md#gov-12) |

## High-Risk Agent Guardrail Baseline

This profile **adds to**, rather than replaces, the enterprise baseline. The risk authority ratifies numeric autonomy, approval, retention, SLO and review thresholds per use case; blank thresholds are holds.

### Preventive controls

| Additional measure | Accountable owner / implementation | Evidence | Control |
|---|---|---|---|
| Explicitly constrained mission and isolation | Business/Platform/Data Owners restrict approved tasks, users, data and transaction types; use stronger resource/network/identity separation where assessment requires; reject unapproved geographic fallback | Signed impact assessment, task/route allowlist and boundary tests | [GOV-01](../controls/README.md#gov-01), [GOV-02](../controls/README.md#gov-02) |
| Independent transaction approval | Business Process/Application Owners require authorized human approval before consequential execution; bind approval to actor, tool, target, arguments/amount, transaction ID and expiry; server rechecks permissions, changes and replay | Denied self-approval/expired/modified/replayed request tests; reviewer authority and approval record | [GOV-03](../controls/README.md#gov-03), [GOV-06](../controls/README.md#gov-06) |
| Minimal write capabilities and fail-closed operation | IAM/Tool Owners prefer read-only capabilities until writes are justified; isolate privileged tools, constrain egress and data exposure; refuse consequential actions when authorization or required approval cannot be verified | Permission diff, denied exfiltration tests, approval/identity outage tests | [GOV-03](../controls/README.md#gov-03), [GOV-04](../controls/README.md#gov-04), [GOV-06](../controls/README.md#gov-06) |
| Independent adversarial and release assessment | Security/Evaluation Owners test indirect injection, malicious tool/MCP responses, cross-user memory leakage, privilege escalation, inappropriate actions and provider fallback; independent risk sign-off for each material release | Threat-model-linked per-case evidence, failure remediation and restricted rollout decision | [GOV-05](../controls/README.md#gov-05), [GOV-06](../controls/README.md#gov-06), [GOV-07](../controls/README.md#gov-07), [GOV-10](../controls/README.md#gov-10) |
| Tighter execution exposure | Operations/FinOps Owners define smaller approved transaction, token, concurrency, retry, loop-depth and execution-time ceilings; choose staged/canary rollout and authorized fallback or safe refusal | Numeric exposure limits, overload tests, canary plan and separately approved fallback | [GOV-09](../controls/README.md#gov-09), [GOV-10](../controls/README.md#gov-10) |

### Detective controls

| Additional measure | Accountable owner / implementation | Evidence | Control |
|---|---|---|---|
| Consequential-action audit and urgent response | SOC/Operations Owners record every consequential authorization/approval/execution outcome with correlation, protected evidence and an on-call escalation target | Representative audit chain and urgent alert-delivery exercise, including telemetry outage behavior | [GOV-06](../controls/README.md#gov-06), [GOV-08](../controls/README.md#gov-08) |
| Increased quality and control surveillance | Evaluation/Security Owners review production samples and abuse signals at a risk-approved frequency, proposed weekly; monitor subgroup harms where relevant and control changes continuously where supported | Review schedule, privacy-approved sample results, drift alerts and tracked remediation | [GOV-04](../controls/README.md#gov-04), [GOV-07](../controls/README.md#gov-07), [GOV-12](../controls/README.md#gov-12) |
| Shorter exception and privilege review | Governance/IAM Owners propose monthly access and exception recertification; review immediately after scope, identity, supplier or incident changes | Named independent decisions, expiry/privilege report and compensation test results | [GOV-03](../controls/README.md#gov-03), [GOV-05](../controls/README.md#gov-05), [GOV-12](../controls/README.md#gov-12) |

### Corrective controls

| Additional measure | Accountable owner / implementation | Evidence | Control |
|---|---|---|---|
| Rapid, multi-layer containment | Incident Commander/Tool Owners demonstrate time-bounded disablement of application execution, gateway routes and privileged backend actions across replicas and queues; predefine safe manual fallback | Risk-approved containment objective and measured exercise; residual irreversible actions explicitly documented | [GOV-08](../controls/README.md#gov-08), [GOV-11](../controls/README.md#gov-11) |
| Independently authorized recovery | Business Risk/Security/Release Owners require containment verification, relevant reevaluation and explicit independent restart approval; reconcile downstream transactions before retries | Incident timeline, transaction reconciliation, evaluation bundle and signed restart record | [GOV-06](../controls/README.md#gov-06), [GOV-07](../controls/README.md#gov-07), [GOV-10](../controls/README.md#gov-10), [GOV-11](../controls/README.md#gov-11) |
| Escalated remediation or withdrawal | Business Risk/Governance Owners suspend scope when controls or compensations fail, notify affected stakeholders as required and withdraw approval if residual risk is unacceptable | Remediation deadlines, stakeholder decision, exception closure and retirement evidence if applicable | [GOV-11](../controls/README.md#gov-11), [GOV-12](../controls/README.md#gov-12) |

## What these baselines do not assume

- A prompt, content filter or prompt-injection detector is **not** an authentication, authorization, DLP or transaction-approval boundary.
- An authenticated MCP server is not necessarily a trusted supplier; its tools still need individual authorization. Tool discovery and schemas do not prove safe behavior.
- A gateway is not necessarily on every execution path. Test direct endpoint and backend-tool bypass, delegation, retries and fallback.
- Azure budgets are notifications and planning controls, not guaranteed hard spending caps. Application/gateway limits cover only their configured scope.
- No universal built-in kill switch, immutable deployment control, complete audit log or Azure Policy rule is asserted here. See the explicitly [planned automation roadmap](../standards/README.md#automation-roadmap--planned-not-implemented).
- Model guardrails are GA and agent guardrails/tool-call/tool-response controls Preview in the reviewed [guardrails overview](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview); those labels do not establish support for every model/runtime. Verify [hosted guardrail failure behavior](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-hosted-agent-guardrails) and the [current implementation distinctions](../standards/README.md#current-implementation-distinctions), including policy replacement and trace migration, against the actual release.

## Sources and review forms

[Microsoft Foundry references](../../references/microsoft-foundry.md), [Azure references](../../references/azure.md), [security review](../../checklists/security-review.md), [production readiness](../../checklists/production-readiness.md) and [exception request](../../templates/exception-request.md).
