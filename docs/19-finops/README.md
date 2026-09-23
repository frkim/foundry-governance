# 19 — FinOps

> Last reviewed: 2026-09-16.
> Scope: allocation, forecasting, unit economics, optimization, and financial accountability.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: invoices lag execution; token estimates and shared-cost allocation are imperfect.
> Exceptions: time-bound approval via [exception request](../../templates/exception-request.md).

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Azure Cost Management supports cost analysis, budgets, alerts, and cost-data workflows.
Model and PTU billing vary by deployment, offer, usage type, and commercial agreement.
Azure resource tags support allocation, but do not automatically allocate every charge to an agent or user.
Execution telemetry supplies operational estimates; billing records remain the financial reconciliation source.
**Budgets alert rather than stop resources; TPM/RPM quota is capacity, not a monetary cap.**
Foundry's documented cost estimates exclude PTU; agent estimates also exclude prompt and non-Foundry agents.
Use the [status register](../../references/microsoft-foundry.md) to validate estimate coverage; missing estimates are not zero cost.

## Enterprise recommendation

Assign a financial owner and cost center to every production agent and shared dependency.
Use showback before chargeback until allocation completeness is proven.
Optimize cost per successful business outcome, not just price per token.
Include quality, safety, reliability, and staff effort when assessing savings.
Publish one agreed currency, time window, pricing basis, and allocation method for each report.

### Cost scope

Include model input/output/cache charges, provisioned capacity, and fine-tuning where applicable.
Include search, storage, databases, hosted/container compute, gateway/network, tools, and external API charges.
Include evaluation/judge runs, telemetry retention, security tooling, support, and approved license costs.
Distinguish marginal run cost, allocated cloud cost, and fully loaded business cost.
Do not compare a marginal PAYG estimate with a fully loaded PTU total.

### KPI dictionary

Let `C` be reconciled allocated cost, `R` all attempted requests, and `S` verified successful business tasks.
Use the same reporting window and cohort for every numerator/denominator.
For a zero denominator report “not applicable,” not zero efficiency or infinite savings.

| KPI | Formula / definition | Use |
|---|---|---|
| Total spend | Sum of billed + agreed amortized allocated charges | Financial accountability |
| Spend by business unit/agent/project/team/model/tool/MCP server/environment | Sum `C` grouped by trusted allocation key, using one allocation view at a time | Showback and ownership without double-counting |
| Request volume | Count attempted requests, split accepted/denied/completed | Explain demand |
| Active users / adoption | Distinct authorized active users; active / eligible users | Value and reach |
| Input/output/cached tokens | Sum provider-reported counts by category | Explain model consumption |
| Tokens per request | Total consumed tokens / model-bearing requests | Prompt/output efficiency |
| Cost per request | `C / R` with denied-request treatment disclosed | Operational unit cost |
| Cost per successful task | `C / S` using business-verified success | Primary value-adjusted cost |
| Cost per committed business transaction | Attributed total cost / distinct committed business transaction IDs; exclude retry duplicates from denominator, retain their cost | End-to-end transaction economics |
| Cost/quality ratio | Report paired `(cost per successful task, calibrated quality score)` on the same task cohort; no cross-rubric scalar division | Compare cost-quality trade-offs only for compatible scores |
| Cost per active user | `C / distinct active users` | Product economics |
| Cost per 1,000 tokens | Model-attributed cost × 1,000 / billed tokens | Compare like-for-like mixes |
| Cost per conversation | Allocated conversation cost / closed conversations | Multi-turn economics |
| Cost per agent run / tool call | Applicable attributed cost / corresponding count | Orchestration overhead |
| Success rate | `S / all assigned business tasks` | Cost-quality trade-off |
| Retry ratio | Retried requests / requests; also retry attempts / all attempts | Amplification and waste |
| Waste ratio | Cost of failed, duplicate, abandoned, or unused work / `C` | Optimization opportunities |
| Cache hit ratio | Eligible requests served from approved cache / cache-eligible requests | Cache effectiveness |
| Budget consumption | Actual cost / approved period budget | Financial progress |
| Budget variance | `(actual − budget) / budget` | Overspend/underspend |
| Forecast variance | `(forecast period cost − budget) / budget` | Early intervention |
| Forecast accuracy | `1 − abs(forecast − actual) / actual` | Forecast quality; may be negative |
| Daily burn rate | Cost over trailing measured days / number of measured days | Trend and runway |
| Budget runway | Remaining approved allowance / expected daily burn | Planning estimate, not enforcement |
| Allocation coverage | Attributed billed cost / total in-scope billed cost | Chargeback readiness |
| Unallocated spend | Total in-scope billed cost − attributed cost | Accountability gap |
| PTU utilization | Time-weighted service-reported utilization; disclose sampling and cap | Capacity efficiency |
| Reservation utilization | Applied reserved unit-hours / purchased reserved unit-hours | Commitment efficiency |
| Reservation coverage | Reservation-covered eligible usage / all eligible usage, same units | Purchase planning |
| PAYG/PTU effective unit cost | Full deployment cost / comparable successful tasks or token mix | Deployment comparison |
| Optimization savings | Normalized baseline cost − actual cost − implementation cost | Realized improvement |
| Avoided cost | Approved counterfactual spend − actual spend | Report separately from realized savings |
| Net business value | Verified benefits − fully loaded delivery/operation cost | Portfolio decisions |
| ROI | `(verified benefits − fully loaded cost) / fully loaded cost` | Investment assessment |
| Latency-cost frontier | p95 latency and task success paired with cost/task per candidate | Prevent false economy |
| Telemetry/billing variance | `(estimated cost − billed comparable cost) / billed comparable cost` | Metering confidence |

Avoid double-counting cached tokens within total input tokens; follow the provider's billing categories.
PTU utilization is not simply used TPM / nominal quota and does not directly equal reservation utilization.

### Connecting agent telemetry to business value

**Feature review: 2026-09-23.** The proposed **ROI for Agents — Private Preview** product claim was not established by the accessible Microsoft cost, monitoring, and capability-reference sources. Its availability remains **Verification required** in the [feature review](../../references/microsoft-foundry.md#september-2026-feature-review); do not make financial reporting depend on access to it.

The enterprise measurement approach does not require that feature: correlate trusted agent/release/run identifiers with reconciled operating cost and independently verified business outcomes.
The business owner approves the baseline, benefit valuation, reporting window, and treatment of failed, duplicated, or human-reworked tasks; FinOps reconciles the fully loaded cost.
Report benefits, total cost, net value, and ROI together using the KPI definitions above. Separate estimated time savings and avoided costs from realized financial benefits, and prevent multiple agents from claiming the same outcome.
Evaluate Model Router and Agent Optimizer candidates against this cost/quality baseline; cheaper tokens do not establish improved ROI.

## Policy

1. Require budget owner, unit-cost target, allocation keys, and forecast before production approval.
2. Alert on actual and forecast thresholds; implement separate [consumption guards](../18-consumption/README.md).
3. Prohibit chargeback from unvalidated caller-supplied tenant or project labels.
4. Track evaluation, development, and production costs separately.
5. Require quality/safety regression tests before routing, caching, prompt compression, or model changes.
6. Approve reservations only after measured demand and contract/break-even analysis.
7. Retain data/region/license approvals when moving traffic to cheaper alternatives.
8. Review idle assets, orphaned deployments, and expired exceptions monthly.

## Implementation

### Operating cadence

| Cadence | Owner | Decision and evidence |
|---|---|---|
| Daily | Service owner | Investigate anomalies, runaway loops, forecast breaches |
| Weekly | Product + engineering | Unit cost, task success, token mix, retries, latency |
| Monthly | FinOps + finance | Reconcile invoice, shared allocation, forecast, showback |
| Quarterly | Procurement + platform | PTU/reservation portfolio, contract terms, capacity plans |
| Release | Engineering + risk owner | Candidate cost-quality evaluation and approved target |

### Allocation model

Join resource billing with a versioned agent/project/consumer inventory map.
Use authenticated gateway/application metadata for shared model deployments.
Allocate shared fixed cost by an approved driver such as reserved capacity or measured usage.
Disclose idle shared capacity explicitly; do not hide it in an unrelated team's bill.
Record credits, discounts, taxes, and reservation amortization consistently.
Reconcile late adjustments and retain a dated “estimated” versus “final” report status.

### Example decision

A service costs 1,200 currency units for 10,000 attempted tasks and 8,000 successful tasks.
Cost/request is `1,200 / 10,000 = 0.12`; cost/success is `1,200 / 8,000 = 0.15`.
A cheaper model costing 1,000 with only 5,000 successes costs `0.20` per success.
Do not promote that candidate on token price alone.
For PTU, compare full monthly capacity/commitment cost against equivalent PAYG demand plus overflow.
Verify deployable capacity before a reservation purchase; a discount commitment does not guarantee capacity.
Model uncertainty, peak load, underutilization, and approved fallback in the scenario analysis.

## Evidence

Retain budget approvals, cost exports, pricing assumptions, allocation rules, and reconciliation results.
Publish KPI definitions with numerator, denominator, completeness, and reporting lag.
Attach optimization experiments with [quality](../12-quality-evaluation/README.md) and [SLO](../22-production-operations/README.md) outcomes.
Maintain the financial fields of the [inventory](../25-ai-inventory/README.md).
Keep purchase decisions and changes linked to [change management](../21-change-management/README.md).
Attach financial ownership and guard-test evidence to [production readiness](../../checklists/production-readiness.md).

## Sources and limitations

- [Create and manage budgets](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets).
- [Provisioned throughput billing and cost management](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput-billing).
- [Provisioned throughput](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/provisioned-throughput).
- [Foundry cost management and estimate limitations](https://learn.microsoft.com/en-us/azure/foundry/concepts/manage-costs).

Official Learn search results support billing distinctions; direct retrieval was unavailable.
All formulas and operating cadences are enterprise definitions; reconcile them with actual commercial terms.
