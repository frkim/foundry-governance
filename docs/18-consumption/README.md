# 18 — Consumption and capacity

> Last reviewed: 2026-09-16.
> Scope: usage attribution, quotas, rate limits, capacity, and spend-enforcement controls.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: quota scopes and available gateway policies differ by model and deployment type.
> Exceptions: time-bound approval via [exception request](../../templates/exception-request.md).

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Model services expose quota and rate limits, including tokens per minute (TPM) and requests per minute (RPM).
The allocation scope and TPM:RPM relationship depend on model, deployment type, and current service rules.
Provisioned throughput units (PTUs) and pay-as-you-go (PAYG) represent different capacity/economic choices.
Supported gateway controls can enforce request/token limits for supported routes.
Azure Cost Management budgets generate notifications; **they do not stop consumption or impose hard caps**.
Quota availability does not guarantee deployable capacity, service latency, or authorization to spend.
Distinguish traditional APIM policies from the **preview Foundry APIM integration** and **preview dedicated AI Gateway tier**.
The preview integration's automatic MCP routing excludes existing/code-first, managed-OAuth, OpenAPI, and native-tool paths.
It covers eligible newly portal-created MCP tools; prove every required route rather than assuming automatic coverage.
The dedicated preview tier has no SLA and API-key grants cover all published assets; do not treat keys as per-asset authorization.
See [AI Gateway](../10-ai-gateway/README.md) and the [source register](../../references/azure.md) for current scope and networking limits.

| Mechanism | What it controls | What it does not guarantee |
|---|---|---|
| Service TPM/RPM | Rate/capacity allocation within documented scope | Monthly monetary budget |
| Gateway rate limit | Accepted request/token rate for configured route/key | All bypass routes or non-model costs |
| Application execution limit | Turns, loops, time, retries, concurrency | Provider billing accuracy |
| Budget alert | Delayed actual/forecast cost notification | Immediate blocking or a hard spend cap |
| PTU deployment | Provisioned processing capacity | Unlimited throughput or zero idle cost |
| Enterprise spend guard | Admission based on reserved/estimated allowance | Exact instantaneous Azure invoice ceiling |

## Enterprise recommendation

Apply layered soft and hard controls at consumer, agent, project, and shared-platform levels.
Attribute every run to an authenticated consumer and cost center.
Keep separate limits for interactive, batch, evaluation, and administrative traffic.
Measure capacity against real token mixes, model latency, tool fan-out, and peak concurrency.
Reserve operational headroom; do not allocate all capacity to nominal steady-state traffic.

### Illustrative starting defaults

| Control | Soft warning | Hard enforcement / action |
|---|---|---|
| Monthly allowance | Notify at 50%, 80%, and 100% actual/forecast | Application admission stops new noncritical work at approved ledger limit |
| Concurrency | Alert above 80% sustained use | 5 active runs per consumer, 50 per agent; bounded queue |
| Prompt/output size | Notify near approved token envelope | Reject oversized input; set model output-token limit |
| Tool calls | Warn at 6 calls per run | Stop at 8 total calls, including subagents |
| Model turns | Warn at 9 turns | Stop at 12 turns; no silent new child budget |
| Retries | Alert when retry ratio exceeds baseline | At most 2 retries; exponential backoff and jitter |
| Execution time | Warn near deadline | 60-second interactive deadline; explicit batch deadline |
| Multi-agent fan-out | Alert on unusual branch growth | At most 3 concurrent children; cap total graph depth |
| Queue | Warn at half configured capacity | Reject/defer when full; expire stale work |

All numbers are examples requiring risk and load-test adjustment.
For consequential writes, an unknown transaction result must not trigger a blind retry.
Soft warnings notify; hard guards execute deterministic denial outside model instructions.

## Policy

1. Never describe TPM/RPM quota or Azure budgets as an enforceable monetary budget.
2. Prevent direct endpoint bypass of required gateway/application controls.
3. Enforce global run limits across retries, tools, handoffs, and delegated agents.
4. Require explicit approval for limit increases and emergency overrides.
5. Separate service identities and allocation keys from user-supplied cost-center claims.
6. Limit expensive tools, storage growth, code execution, external APIs, and telemetry as well as tokens.
7. Preserve approved region, data-processing, license, model, and data-class constraints during fallback.
8. Reject or queue safely when no approved capacity remains; do not route to arbitrary providers.
9. Design guard-state failures explicitly: deny noncritical expensive work when allowance cannot be verified.
10. Reconcile estimates with billing and explain residual overrun risk.

## Implementation

### Admission and accounting

1. Authenticate caller; resolve trusted tenant, agent, project, and cost-center keys.
2. Authorize the requested capability and approved model/tool route.
3. Check rate, concurrency, queue, and execution-budget limits.
4. Atomically reserve a conservative maximum run allowance in a shared ledger.
5. Start work only after admission; propagate remaining allowance and deadline to children.
6. Enforce token/tool/turn limits at each execution boundary.
7. Finalize actual observed usage and release unused reservation.
8. Reconcile late usage, cancellations, reservations, and invoice data.

A reservation ledger reduces concurrent overshoot; it is not a native Azure billing cap.
Include a safety margin for token estimates, pricing changes, in-flight work, and delayed metering.
If a tool's maximum cost is unknowable, constrain the operation or deny monetary-cap claims.
Do not release a reservation until outstanding child/tool work is accounted for or safely terminated.

### PAYG versus PTU

| Workload | Starting choice | Required validation |
|---|---|---|
| Uncertain or sporadic demand | PAYG with strict execution guards | Peak limits, unit cost, throttling behavior |
| Stable sustained demand | Compare PTU with PAYG | Real token mix, utilization, minimum units, contract economics |
| Critical predictable service | Evaluate PTU and approved recovery capacity | Load tests, regional availability, outage plan |
| Bursty demand above PTU | Approved PAYG overflow only | Route compatibility, separate limits, cost exposure |
| Evaluation/batch | Isolated allocation and scheduling | No starvation of production traffic |

PTU reservation purchase and deployment capacity are related but distinct planning activities.
A reservation is a financial discount, not a capacity guarantee; establish deployable capacity before committing to the reservation.
Use current billing terms; idle provisioned capacity may still incur charges.
Determine break-even through [FinOps](../19-finops/README.md), not assumed universal utilization percentages.

### Overload behavior

Honor retry guidance where available and apply bounded jittered backoff.
Use circuit breakers for failing tools/models; avoid multiplying retries across layers.
Return actionable throttling/unavailable responses without sensitive capacity details.
Prioritize safety and incident-response work through a separately approved allocation.
Test simultaneous requests, distributed counters, queue expiry, guard outages, and fallback denial.
Verify blocked work never reaches a billable tool or model call where enforcement is intended.

## Evidence

Retain quota/deployment snapshots, allocation owners, and approved limits.
Attach load tests, bypass-denial tests, concurrency races, loop caps, and spend-guard failure tests.
Report reservations versus observed usage versus billed charges, with completeness and lag.
Keep limit changes and overrides in the [change register](../21-change-management/README.md).
Link [observability](../13-observability/README.md), [sharing](../17-sharing/README.md), and [production operations](../22-production-operations/README.md).
Document gateway bypass tests under [AI Gateway](../10-ai-gateway/README.md) and [production readiness](../../checklists/production-readiness.md).

## Sources and limitations

- [Foundry Models quotas and limits](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/quotas-limits).
- [Manage Azure OpenAI quota](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/quota).
- [Provisioned throughput](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput).
- [Enforce model token limits](https://learn.microsoft.com/en-us/azure/foundry/control-plane/how-to-enforce-limits-models).
- [Create and manage budgets](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets).
- [Foundry tool governance and routing scope](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance).
- [Dedicated AI Gateway overview](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview).

Official Learn search results support these distinctions; direct retrieval was unavailable.
Validate current quota scope and policy support; illustrative limits are not provider defaults.
