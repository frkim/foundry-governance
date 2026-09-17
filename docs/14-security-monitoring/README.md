# Security monitoring and SOC integration

Last reviewed: **2026-09-16**.
Scope: enterprise agent/model/tool/MCP security telemetry, detection, triage, containment, and evidence.
Experience: **Foundry resource/project (new)** unless explicitly stated.
Capability status: feature-specific; consult the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) source registers.
Recommendation: join identity, control-plane, gateway, application, tool, and data events into an owned SOC process.
Limitations: no single native log stream guarantees full agent trajectory, user attribution, approval, or content visibility.
Exceptions: [exception request](../../templates/exception-request.md); metadata applies to every recommendation unless overridden.

## Microsoft capability

Azure Monitor, Log Analytics, Application Insights, Azure Activity Log, Microsoft Entra logs, and Microsoft Sentinel can form the monitoring and response stack. Available diagnostic categories, table schemas, retention, connectors, identity records, and licensing vary by service and configuration.

Foundry/application tracing and gateway logs can expose portions of model/tool execution. Coverage depends on instrumentation and the actual request route. A gateway association does not ensure that existing/code-first/managed-OAuth tools produce gateway events.

Content safety decisions are valuable security signals, but they do not prove that an attack succeeded or failed. Conversely, a successful HTTP response and no classifier alert do not prove that an action was authorized or that data was not disclosed.

Current readiness guidance lists prompt/hosted tracing as GA, with workflow/external tracing and tracing VNet Preview. Named Foundry monitoring, recurring evaluation, scheduled red-team scans, and alerts are **Preview**; continuous evaluation observes sampled completed responses, not inline prevention. Entra-authenticated trace ingestion is also Preview and requires verified publisher permissions for project/server-side and agent/sandbox paths separately.

Foundry Control Plane/Operate is a **Preview implementation option**, currently portal-only in the reviewed source, for fleet views of agents, models, and tools across projects within a subscription, supported external agents/metrics, and Defender/Purview/Entra integrations. Verify subscription/project coverage, portal access, and each connector. It is not complete automatic discovery, proof of control enforcement, automatic SOC coverage, or an assumed automation API.

## Enterprise recommendation

The SOC owns detection triage and incident coordination; platform, workload, IAM, data, and tool owners retain operational actions in their domains. Build a logical event schema and adapt source-specific records into it rather than assuming a universal Microsoft “agent security log.”

Use metadata-first telemetry, safe test fixtures, and access-segmented evidence. Raw prompts, documents, tool payloads, OAuth tokens, and secrets are not a default SOC data feed.

### Source onboarding map

| Source | Security value | Collection / limitation |
| --- | --- | --- |
| Azure Activity Log | Resource, RBAC, policy, diagnostic, and network configuration changes | Export subscription activity; correlate actor, resource, change and deployment/incident approval |
| Entra user sign-in/audit | User authentication, consent, privileged access, app/identity changes | Enable relevant export/licensing; correlate stable IDs, not display names |
| Workload/managed-identity sign-ins | Nonhuman authentication anomalies | Select available workload identity logs; a token event is not proof of each downstream action |
| APIM gateway logs | Caller/route/auth result, backend, latency, denial/usage metadata | Enable supported diagnostics; redact; only traversing traffic appears |
| Agent/application traces | Parent/child run, tool decisions, policy, safety and approval outcomes | Instrument application-specific gaps; do not assume every runtime emits these fields |
| Tool/MCP/backend audit | Actual operation, principal, object, transaction and result | Tool owner emits authoritative side-effect outcome; gateway success is not sufficient |
| Storage/search/database audit | Sensitive access, denied requests, changes in data/ACLs | Enable relevant service categories; document unavailable document/object granularity |
| Network/security controls | Egress denial, unexpected destinations, firewall/DNS/private-route issues | Correlate approved path inventory and runtime identity |
| Inventory/release/approval systems | Approved versions, owners, risk, grants, action approvals, exceptions | Ingest controlled reference data with history and expiry |

Examples of resource-specific Azure tables include `AzureActivity`, `SigninLogs`, `AADServicePrincipalSignInLogs`, `AADManagedIdentitySignInLogs`, `ApiManagementGatewayLogs`, and Application Insights `AppRequests`/`AppDependencies`/`AppTraces`. Availability, columns, and legacy table alternatives must be verified in the chosen workspace; these names are not a ready-to-run detection deployment.

## Proposed enterprise policy

- **GOV-01 / GOV-08:** every production workload must have a SOC onboarding record, signal owners, detection coverage, response contacts, and telemetry-health alert.
- **GOV-03 / GOV-06:** log security-relevant identity, authorization, approval, schema/version, and kill-switch decisions, including denied and attempted bypass paths.
- **GOV-04 / GOV-08:** redact before export; restrict sensitive tables/content; retain approved evidence without secrets or unbounded conversation capture.
- **GOV-08 / GOV-09:** alert on runaway consumption, tool loops, and unusual data export as security and operational risks, not only finance reports.
- **GOV-10 / GOV-11:** material releases must update detection coverage and exercise containment; SOC can initiate emergency restriction without waiting for a normal release board.
- **GOV-12:** missing logs, unsupported detection fields, and expired exceptions must be visible gaps with owners and compensating controls.

These are proposed enterprise policies. A connected workspace or dashboard is not evidence that detection and response work.

## Implementation

### 1. Establish a normalized security event contract

The following are **enterprise logical fields**, to be emitted or mapped; they are not guaranteed Foundry-native field names.

| Field group | Minimum safe fields |
| --- | --- |
| Correlation | Event ID/time, source, trace/run/parent-run ID, request ID, action/transaction ID |
| Asset | Agent/project/resource/environment ID, release version, tool/MCP/model ID and version |
| Principal | Verified caller/user/tenant ID, executing workload identity, gateway backend principal where different |
| Decision | Operation, policy/control/version, allow/deny/error, reason code, risk/data class |
| Approval | Approval ID, approver identity, action digest, expiry, single-use outcome; no reusable approval secret |
| Outcome | Backend status, side-effect state, target identifier or approved pseudonym, latency and uncertainty flag |
| Capacity | Token/request/tool counts, concurrency/loop-budget result, attributed consumer/cost center |
| Integrity | Schema/version digest, source provenance, detection/enforcement location, instrumentation version |

Use trusted middleware to set identities and attribution; model text or arbitrary headers cannot be the authority. Preserve correlation across asynchronous queues and multi-agent delegation. Avoid hashing low-entropy personal identifiers without a privacy-reviewed pseudonymization design.

For external-code Responses API/ephemeral agents, use stable application/workload and release IDs even though no persisted agent resource exists. Inventory endpoint/protocol families separately; Responses, Invocations, WebSocket, and A2A traffic need their own coverage proof. Do not let a missing agent-resource ID exclude application-hosted activity from SOC scope.

If adopting Control Plane, assign an integration owner to reconcile its fleet view against the authoritative inventory and actual application/backend traffic. Record missing assets/signals, verify connector access and redaction before export, and retain application authorization/telemetry tests and owned evidence; dashboard presence does not close a coverage gap.

### 2. Implement prioritized detections

Patterns below describe logic over normalized events and inventory. Thresholds are **initial enterprise tuning suggestions**, not Microsoft defaults; calibrate by workload and investigate context.

| Detection pattern | Suggested trigger / join | Triage and containment | Primary owner |
| --- | --- | --- | --- |
| Unapproved component or schema | Tool/model/server/version/hash not in active approved manifest | Confirm rollout vs drift; quarantine affected operation/version | Tool/MCP owner + SOC |
| Unauthorized successful action | Backend action succeeds but no matching allowed decision/valid approval for required risk class | Check telemetry lag first; preserve transaction evidence; disable write path if unexplained | SOC + tool/business owner |
| Privilege or credential change | Production role assignment, key access, consent, or app credential change without approved release/incident | Verify actor/PIM/change; revoke unauthorized grant and constrain sessions | IAM + SOC |
| Cross-tenant/object attempt | Verified requester tenant differs from allowed target scope, or repeated denied sensitive object access | Distinguish application defect from hostile use; isolate session/path | Workload/data owner |
| Injection followed by capability escalation | Safety/injection signal followed within the same run by privileged tool or new destination request | Review redacted trajectory and source provenance; quarantine source/tool if needed | SOC + workload owner |
| Sensitive-data export anomaly | Retrieval/export volume exceeds approved envelope or novel external recipient appears | Validate purpose and disclosure authorization; stop export; involve privacy/data owner | Data owner + SOC |
| Gateway bypass | Backend audit has no expected gateway identity/route/correlation for a gateway-required path | Exclude approved health/admin traffic; remove bypass grants/routes | Gateway + backend owners |
| Approval replay/substitution | Duplicate single-use approval/nonce, changed digest/target, expired approval used | Deny/freeze action; reconcile existing transactions; inspect executor control | Tool owner |
| Tool loop / resource abuse | Run exceeds allowed hop/time/token/concurrency envelope, or burn rate >2× workload baseline for 15 minutes | Check legitimate demand/release; stop abusive runs; apply consumer limits | SRE + FinOps + SOC |
| Unusual workload sign-in | Unexpected tenant/resource/credential/client context for registered identity | Validate platform behavior and recent change; restrict grants/credentials if compromised | IAM + platform owner |
| Control disablement | Diagnostic, network, content-safety, policy, or kill-switch configuration changed outside approval | Preserve before/after config; restore validated control; investigate actor | Platform/security owner |
| Telemetry silence | Expected heartbeat absent >10 minutes, or backend requests continue with missing application security events | Check ingestion delay/outage; restrict high-impact execution if authorization evidence cannot be produced | SRE + SOC |

Do not equate one blocked prompt with a confirmed compromise. Prioritize actual unauthorized side effects, credible disclosure, privileged changes, and control bypass; retain lower-severity attempts for correlation and tuning.

### 3. Publish triage and response runbooks

1. **Validate:** identify workload/risk/owner, affected release and time window, source reliability, clock/ingestion delay, and whether the event represents attempted, denied, or completed action.
2. **Correlate:** join caller identity, parent/child runs, gateway route, tool/backend transaction, data access, approval, and configuration change. State missing evidence explicitly.
3. **Contain:** block consumer ingress, stop schedules/queues/delegation, disable selected tools/models/routes, and revoke relevant backend grants/credentials using independent control paths.
4. **Reconcile:** establish whether writes committed; prevent replay and use approved compensation/manual handling. Disabling the agent cannot undo an already sent message or payment.
5. **Preserve:** retain redacted logs, configuration/version snapshots, approval records, and evidence access history in restricted custody; apply legal hold where required.
6. **Escalate:** involve business, security, data/privacy, compliance, platform, and vendor support according to impact; notification obligations are determined by compliance, not the model.
7. **Recover:** fix the root cause, re-evaluate affected trajectories and permissions, restore through approved release, monitor closely, and close with control/detection improvements.

Proposed response targets: confirmed high-impact unauthorized action or active disclosure → immediate containment, with on-call acknowledgement within **15 minutes**; suspicious attempts without demonstrated impact → risk-based triage within the owned SOC queue. These are enterprise objectives to staff and exercise, not Azure guarantees.

### 4. Protect and retain telemetry

Apply the [data lifecycle schedule](../05-data-governance/README.md): no raw content by default; opt-in diagnostic content up to 7 days, operational metadata 90 days, security/release evidence 365 days as starting values subject to approved legal requirements.

Use separate access to metadata, sensitive diagnostic content, and preserved incident evidence. Audit analyst exports and access. Redact identifiers/content before third-party export and review geography, service retention, archive copies, and legal hold.

The protected `AppGenAIContent` feature is **Preview**, not redaction. Until **2026-09-30**, the documented default also writes sensitive content to ordinary tables unless early migration is enabled. Verify actual routing, reader roles, and current/historical copies; switching routes does not delete history. Update detection queries and retention/access rules across both stores and exports before relying on the protected-table boundary.

Do not silently sample away authorization denials, privileged changes, approval decisions, or high-impact action receipts. Control volume through safe metadata and aggregation while preserving required per-action audit evidence.

### 5. Validate coverage and operational readiness

Run safe implementation exercises for denied tool access, schema drift, approval replay, suspicious export, direct-gateway bypass, privileged configuration change, and telemetry outage. Record expected signal, observed ingestion delay, rule result, routing to on-call, containment authority, and measured recovery.

Track detection coverage by threat and actual execution path; alert precision, triage/containment time, log completeness, redaction failures, and stale owner/runbook records. A rule that never receives required fields is not deployed coverage.

## Evidence

Retain source/diagnostic configuration, normalized schema mappings, retention/access decisions, rules and tuning history, inventory joins, incident severity/runbooks, on-call ownership, and exercise results. Link detection outcomes to release and control IDs without storing secrets or unnecessary prompts.

Use [security review](../../checklists/security-review.md) and [production readiness](../../checklists/production-readiness.md); map to **GOV-01, GOV-03, GOV-04, GOV-05, GOV-06, GOV-08, GOV-09, GOV-10, GOV-11, GOV-12**. Report uncovered runtimes/tools explicitly in fleet metrics.

## Sources

- [Azure Monitor overview](https://learn.microsoft.com/en-us/azure/azure-monitor/overview) and [Activity Log](https://learn.microsoft.com/en-us/azure/azure-monitor/platform/activity-log).
- [Microsoft Sentinel overview](https://learn.microsoft.com/en-us/azure/sentinel/overview).
- [Entra monitoring and health](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/overview-monitoring-health).
- [APIM Azure Monitor integration](https://learn.microsoft.com/en-us/azure/api-management/api-management-howto-use-azure-monitor).
- [Sensitive trace-content migration](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/traces-sensitive-content), [trace ingestion authentication](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-ingestion-entra-authentication), and [Control Plane overview](https://learn.microsoft.com/en-us/azure/foundry/control-plane/overview).
- Feature/source notes: [Foundry](../../references/microsoft-foundry.md), [Azure](../../references/azure.md), [security](../../references/security.md).

## Limitations and unresolved decisions

Native logs may omit semantic tool name, approval, business target, user delegation, or final side-effect state. Application/backend instrumentation is required to close those gaps; do not fabricate fields or claim ready-made Sentinel detections.

Encrypted traffic, streaming, sampling, retention, permission propagation, and ingestion delay limit visibility and containment speed. This chapter defines an implementation contract and exercises, not installed connectors, analytics rules, or a verified SOC deployment.
