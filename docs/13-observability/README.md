# 13 — Observability

> Last reviewed: 2026-09-16.
> Scope: production-agent metrics, traces, logs, security signals, and telemetry governance.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: automatic instrumentation and content capture differ by framework and service.
> Exceptions: time-bound approval via [exception request](../../templates/exception-request.md).

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Foundry documents OpenTelemetry-based tracing and integration with Azure Monitor Application Insights.
Framework instrumentation can capture agent, model, and tool spans where supported.
Azure Monitor supports querying, alerting, dashboards, and operational analysis.
Microsoft Sentinel can correlate security events through supported connectors or explicit ingestion.
External APM/SIEM platforms can receive approved telemetry through compatible exporters and collectors.
Neither registration in Foundry nor an SDK dependency guarantees end-to-end instrumentation.
The [status register](../../references/microsoft-foundry.md) distinguishes GA prompt/hosted tracing from preview workflow/external and VNet tracing.
The named Foundry monitoring, recurring evaluation, scheduled red-team scans, and alerts experiences are preview; Azure Monitor capabilities have their own scope.
Sensitive trace-content access protection is also preview and **is not redaction**.
Entra-authenticated trace ingestion is **Preview**; verify publisher grants separately for project-identity server traces and hosted agent sandbox traces.
Foundry Control Plane/Operate is a **Preview, currently portal-only** fleet-view option spanning supported agents/models/tools across projects.
It documents subscription-scoped views, supported external agents, metrics, and Defender/Purview/Entra integrations.
Verify scope, access, connector configuration, and redacted signal coverage; a visible asset does not prove monitoring or enforcement.

### Trace Replay

**Feature review: 2026-09-23.** The [Trace Replay guide](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-replay) describes recorded conversation/span inspection through User and Trajectories views, filtering, timing/token analysis, and sequential playback.
This is **not deterministic re-execution** of an agent or its tools, nor crash recovery.
The guide retains a Preview label; the [readiness table](https://learn.microsoft.com/en-us/azure/foundry/concepts/general-availability#feature-readiness-at-ga) lists tracing including Replay as GA for prompt/hosted agents and Preview for workflow/external agents. Resolve this scope/label difference for the chosen experience before approval.
Apply the same content access, redaction, and retention controls to replayed traces and exported datasets as to the original telemetry.
Turn approved incident examples into [versioned regression cases](../12-quality-evaluation/README.md#continuous-quality-loop); any separate test that executes tools needs isolated endpoints, bounded budgets, and side-effect controls.

## Enterprise recommendation

Every production agent needs the minimum signals below, including externally hosted agents.
Cover the complete application journey, not just the model endpoint.
Use a central telemetry contract and per-service dashboards owned by the on-call team.
Keep **raw prompt, response, tool payload, and PII tracing off by default**.
Redact at the producer or approved collector **before export**, not only in a dashboard.

### Minimum production signal set

| Signal | Required measurements | Initial operational trigger |
|---|---|---|
| Demand | Requests, accepted/rejected runs, active users/tenants, concurrency | Unexpected volume or cardinality growth |
| Availability | Successes, errors, timeouts, cancellations, 429/5xx by dependency | SLO burn-rate alert |
| Latency | End-to-end p50/p95/p99, first-token time, model/tool durations | p95 beyond approved target |
| Model consumption | Input/output/cached tokens, model/version, deployment | Runaway tokens or unapproved version |
| Tool behavior | Calls, denial, failure, retries, timeout, side-effect outcome | Critical unauthorized effect immediately |
| Agent behavior | Steps, loop depth, handoffs, termination reason | Budget exhaustion or repeated cycle |
| Quality | Sampled task success, grounding, safety, refusal, drift | Hard-gate failure or baseline regression |
| Human oversight | Requests, approval/rejection, expiry, queue age, overrides | Expired approval execution immediately |
| Security | Authentication/authorization denial, egress denial, injection signals | Correlated suspicious behavior |
| Cost | Estimated run cost, tenant/project allocation, daily forecast | Forecast or unit-cost anomaly |
| Dependencies | Tool/model/data availability, freshness, fallback use | Unapproved route or stale critical data |
| Telemetry health | Export lag, dropped spans, collector errors, coverage | Missing critical audit events |

Thresholds come from workload baselines and [SLOs](../22-production-operations/README.md), not universal defaults.
Do not put personal identifiers, full URLs with query strings, or secrets in metric dimensions.

## Policy

1. Block production release without dashboards, alert routes, ownership, and an alert test.
2. Propagate trace/correlation IDs across application, gateway, agent, model, tool, and approval service.
3. Separate operational telemetry from security audit records and business transaction evidence.
4. Protect telemetry with least privilege, approved region, encryption, retention, and deletion rules.
5. Allow content capture only through scoped, time-bound approval with minimization and access review.
6. Do not log access tokens, credentials, private keys, full authorization headers, or hidden reasoning.
7. Keep consequential-action audit events independently durable; trace sampling must not remove them.
8. Monitor telemetry failure itself; define which risky operations must fail closed without audit durability.
9. Review external exporters for data transfer, contractual terms, and licensing before enabling.

## Implementation

### Routing design

```text
Application + agent + tools
  → redaction and schema controls
  → approved OpenTelemetry collector/exporter
  → Application Insights / Azure Monitor
  → approved security event route → Sentinel or enterprise SIEM
  → approved external APM destination, only where needed
```

This is a reference design, not a claim that every connector is native or enabled automatically.
Inventory each exporter and its endpoint, credentials, region, retry queue, and support owner.
For disconnected external agents, require equivalent signed/exported operational evidence.

### Span and audit contract

| Field | Example / rule |
|---|---|
| Identity | Agent inventory ID, release digest, environment, opaque tenant reference |
| Correlation | Trace ID, run ID, parent span, business transaction reference |
| Model | Provider, model/version, deployment, approved route identifier |
| Timing | Start/end, duration, deadline, queue time |
| Outcome | Success/failure class, termination reason, policy decision |
| Usage | Token counts, retry count, tool count, estimated cost currency |
| Approval | Approval record ID and decision, not sensitive transaction content |
| Content | Omitted by default; approved redacted capture references only |

Use SDK-supported semantic conventions where available and version custom attributes.
Do not infer unavailable cost or token fields as zero; publish completeness.
Cross-check SDK usage against gateway records and invoice exports.
Record decision summaries and observable actions, not private chain-of-thought.

### Sampling and retention

As an illustrative baseline, sample 10% of routine distributed traces.
Retain all security/approval audit records under the approved records schedule.
Use policy-safe error sampling without unexpectedly enabling payload capture.
An illustrative operational retention target is 30 days searchable metadata and 90 days aggregate metrics.
Privacy, security, legal hold, and business requirements must approve actual retention.
Enforce deletion across primary storage, exports, and diagnostic snapshots.
Test redaction with seeded synthetic identifiers and credentials before production.
Review the documented **2026-09-30** sensitive-content routing change before adopting current defaults.
Protect `AppGenAIContent`; review copies in ordinary tables, historical records, privileged roles, and export destinations.
Until the documented cutover, the default duplicates sensitive attributes into ordinary tables and the protected table unless early migration is enabled.
Historical ordinary-table copies remain; enforce their access and retention independently of the new routing.
Verify actual tenant behavior and update queries/alerts; table access controls do not justify logging raw PII.

### Alert delivery

Send availability incidents to on-call, security incidents to SOC, and spend anomalies to owner/FinOps.
Include service, release, impact, severity, dashboard, and runbook link in every actionable alert.
Deduplicate incidents by service and failure mode; do not alert on every span.
Exercise a model outage, failed tool, blocked egress, and dropped-telemetry scenario.

## Evidence

Retain telemetry schema, routing diagram, retention decision, and access-review records.
Attach synthetic end-to-end trace evidence and proof that PII capture is disabled/redacted.
Attach alert delivery acknowledgements and dashboard coverage for every production agent.
Report telemetry completeness: instrumented production agents / all production agents.
Report audit completeness: recorded consequential attempts / system-of-record consequential attempts.
Link [quality](../12-quality-evaluation/README.md), [FinOps](../19-finops/README.md), and [compliance](../24-compliance/README.md).
Complete the telemetry/alert portions of [production readiness](../../checklists/production-readiness.md).

## Sources and limitations

- [Agent tracing overview](https://learn.microsoft.com/en-us/azure/foundry/observability/concepts/trace-agent-concept).
- [Set up agent tracing](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup).
- [Framework tracing](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-framework).
- [Application Insights agents view](https://learn.microsoft.com/en-us/azure/azure-monitor/app/agents-view).
- [Sensitive trace-content access and migration](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/traces-sensitive-content).
- [Foundry Control Plane — Preview](https://learn.microsoft.com/en-us/azure/foundry/control-plane/overview).
- [Entra-authenticated trace ingestion — Preview](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-ingestion-entra-authentication).

Official Learn search results substantiate tracing/Monitor integration; direct retrieval was unavailable.
Sentinel/external ingestion is an enterprise integration design requiring connector and region validation.
Retention, sampling, and alert thresholds are proposed settings, not default Microsoft configuration.
