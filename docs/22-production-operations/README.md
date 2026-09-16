# 22 — Production operations and Agent SRE

> Last reviewed: 2026-09-16.
> Scope: service reliability, agent safety operations, incident response, recovery, and retirement.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: platform SLAs do not automatically establish end-to-end agent reliability.
> Exceptions: time-bound approval via ../../templates/exception-request.md.

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Azure Well-Architected guidance distinguishes reliability indicators, objectives, agreements, and recovery targets.
Azure Monitor/Application Insights can support service telemetry and alerting.
Foundry tracing and evaluation provide agent-specific diagnostic inputs where supported.
Customers remain responsible for the application journey, external tools, approvals, and business outcomes.
Do not treat a successful HTTP response or completed model invocation as a successful business task.

## Enterprise recommendation

Operate agents as production services with additional controls for autonomy and nondeterministic behavior.
Assign a named service owner, on-call rotation, SOC route, and business fallback owner.
Maintain a tested kill switch that disables risky actions independently of model instructions.
Define SLIs and SLOs with the business before publishing; classify safety invariants separately.

### Illustrative SLOs and measured formulas

Measure over a rolling 30-day window unless an approved contract says otherwise.
An “eligible request” is a valid, authorized request within the published service envelope.
Include service overload, dependency failure, and service timeout as failures; document exclusions.

| Objective | SLI formula | Illustrative target |
|---|---|---|
| Request availability | Correctly served eligible requests / all eligible requests | ≥99.9% |
| Interactive timeliness | Eligible requests completed within 8 s / all eligible interactive requests | ≥95% |
| Task completion | Business-verified successful tasks / all assigned eligible tasks | ≥95%, risk-adjustable |
| Tool reliability | Successful authorized tool operations / authorized attempted tool operations | ≥99.5% |
| Approval integrity | Consequential executions with valid prior approval / all approval-required executions | 100%; safety invariant |
| Authorization integrity | Authorized effects / all observed effects | 100%; safety invariant |
| Bounded execution | Runs ending within approved turn/time/cost bounds / all admitted runs | ≥99.9% |
| Audit completeness | Durably recorded consequential attempts / independently observed consequential attempts | 100%; safety invariant |
| Telemetry freshness | Required telemetry received within 5 min / expected telemetry observations | ≥99% |
| Recovery time | Time from disruption to verified minimum safe service | RTO ≤4 h for example internal service |
| Recovery point | Time between latest recovered durable state and disruption | RPO ≤1 h; action ledger may require zero-loss design |

Safety invariants have no acceptable error budget; a single violation can require immediate containment.
Missing telemetry is not evidence of success; report denominator completeness separately.
For zero eligible traffic, report the ratio as not applicable and use synthetic checks for health evidence.
For sampled quality SLIs, report sampling method, sample size, and confidence interval.
Latency percentiles exclude unfinished requests by definition, so also report timeout and deadline-failure rates.

### Error budget

For availability SLO `s`, allowed bad requests are `(1 − s) × eligible requests`.
Budget consumed is `bad requests / allowed bad requests`.
Burn rate is `observed bad-request fraction / (1 − s)` for the alert window.
At 99.9% and 100,000 eligible requests, the period allows 100 bad requests.
Use multi-window alerts, for example high burn sustained over both 5-minute and 1-hour windows.
Tune alert thresholds to traffic volume and response capacity rather than copying example values blindly.
Freeze discretionary releases when the agreed error budget is exhausted; prioritize reliability work.

## Policy

1. Require SLOs, alert tests, on-call coverage, runbooks, and recovery rehearsal before production.
2. Maintain a safe manual or degraded path for essential business operations.
3. Preserve region, data, licensing, and model approvals during failover.
4. Never retry unknown state-changing outcomes without checking the system of record.
5. Keep kill-switch and policy enforcement outside agent-generated instructions.
6. Use a separate security incident path for data exposure or unauthorized effects.
7. Reevaluate after meaningful operational changes and restore only approved releases.
8. Test backups and restoration; a successful backup job is not proof of recoverability.
9. Review incidents and add regression cases without retaining unnecessary sensitive content.

## Implementation

### Minimum runbook

| Section | Required operational detail |
|---|---|
| Identify | Service/release, owners, dependencies, regions, dashboards, current impact |
| Triage | Error/latency/quality/cost/security signals and affected cohorts |
| Contain | Disable write tools, stop new runs, revoke compromised identity, isolate route |
| Diagnose | Correlate trace, transaction, approval, deployment, and dependency events |
| Recover | Roll back compatible manifest, restore state, reconcile pending actions |
| Verify | Synthetic task, authorization denial, approval integrity, cost/loop limits |
| Communicate | Incident commander, users/partners, SOC/privacy/legal as relevant |
| Close | Timeline, root causes, evidence, corrective owners/dates, regression tests |

### Failure-mode actions

| Failure | Immediate response | Recovery guard |
|---|---|---|
| Model throttling/outage | Bound retries, shed load, queue or approved fallback | No geography/license/data-policy bypass |
| Tool outage/unknown write | Circuit-break, reconcile transaction state | Idempotency before retry |
| Loop or cost runaway | Cancel run tree, stop admission, inspect release | Global budgets restored before resume |
| Unsafe output or unauthorized action | Disable affected capability, engage incident owner/SOC | Reevaluate and obtain risk-owner approval |
| Retrieval/index corruption | Disable affected source, serve safe unavailable answer | Restore validated data/ACL snapshot |
| Approval backlog | Expire stale requests, route to staffed support | No default approval |
| Telemetry loss | Restore collector; stop risky work if audit cannot be durable | Verify missing-event reconciliation |
| State-store failure | Stop writes or use approved durable failover | Check RPO, tenant isolation, replay safety |

### Recovery drills

Practice model/tool failure, expired credentials, full queues, state restoration, and kill-switch activation.
Include multi-agent cancellation and in-flight approval expiry.
Record measured RTO/RPO and compare against targets, not only a “drill passed” label.
Test failback and data consistency after recovery, not just initial failover.
Conduct an illustrative quarterly drill and after major architecture changes.
Keep safety containment available even when the main agent runtime is unhealthy.

## Evidence

Retain SLO definitions, query logic, dashboard links, alert tests, and runbook ownership.
Keep incident timelines, measured recovery results, postmortems, and corrective-action closure.
Track MTTA: sum incident acknowledgement delays / acknowledged incidents.
Track MTTR: sum incident restoration durations / restored incidents; report severe incidents individually.
Link [observability](../13-observability/README.md), [consumption](../18-consumption/README.md), and [HITL](../23-human-in-the-loop/README.md).
Maintain [inventory](../25-ai-inventory/README.md) dependencies and [change](../21-change-management/README.md) history.
Complete [production readiness](../../checklists/production-readiness.md) and the operational handoff in [go-live](../../checklists/go-live.md).

## Sources and limitations

- [Define reliability targets](https://learn.microsoft.com/en-us/azure/well-architected/reliability/metrics).
- [Disaster recovery strategies](https://learn.microsoft.com/en-us/azure/well-architected/reliability/disaster-recovery).
- [Monitor agents with Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/agents-view).

Official Learn search results identify these operational capabilities; direct retrieval was unavailable.
Targets and runbook controls are enterprise proposals; negotiated SLAs and workload risk take precedence.
