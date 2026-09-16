# 23 — Human-in-the-loop

> Last reviewed: 2026-09-16.
> Scope: human review, transaction approval, escalation, and consequential action control.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: framework approval primitives do not by themselves provide business authorization or durable transactions.
> Exceptions: time-bound approval via ../../templates/exception-request.md.

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Agent Framework documents tool approvals and workflow human-in-the-loop patterns.
These can pause execution and request a human response in supported integrations.
The application must still authenticate the reviewer, authorize the decision, and protect execution state.
A chat message saying “approved” is not sufficient evidence of authorization.
Validate language/package/version support and hosting behavior before choosing approval APIs.
Foundry workflow preview behavior must not be assumed identical to code-defined Agent Framework workflows.

## Enterprise recommendation

Use deterministic risk rules to select review requirements; model confidence is not an authorization rule.
Separate drafting, recommending, approving, and executing.
Bind approval to an exact transaction and expire it quickly enough to prevent stale decisions.
Provide meaningful human review: facts, uncertainty, alternatives, consequences, and a real reject option.
Keep the approving human accountable but do not assume review eliminates automation bias.

### Review modes

| Action | Baseline oversight | Example |
|---|---|---|
| Read-only low-risk answer | Sampled retrospective quality review | Public documentation summary |
| Sensitive interpretation | Human review before release | Draft employee eligibility explanation |
| Reversible scoped write | Explicit authorized approval or preapproved bounded policy | Update one approved case field |
| Financial/legal/external commitment | Prior transaction approval; dual approval if risk requires | Payment or binding customer communication |
| Irreversible destructive action | Two independent authorized approvers and recovery analysis | Delete regulated records |
| Prohibited/unapproved action | Reject; human request cannot override law or missing authority | Export records to an unapproved destination |

Preapproved automation requires a separately approved narrow policy with limits, not blanket consent.
The agent must not create or modify its own approval policy.

## Policy

1. Verify approver identity, current role, tenant, scope, and separation of duties server-side.
2. Bind approval to the exact canonical transaction, agent/release, user, and target resource.
3. Reject expired, revoked, altered, cross-tenant, replayed, or mismatched approval records.
4. Changes to material arguments require a new approval; do not reuse approval for a “similar” action.
5. Recheck permissions and transaction preconditions immediately before execution.
6. Treat rejection, timeout, unavailable approver, and invalid response as **no authorization**.
7. Do not execute while waiting for approval or quietly approve on retry.
8. Use idempotency and durable state transitions to prevent duplicate effects.
9. Separate requester, approver, and privileged executor for high-risk actions.
10. Keep approval evidence durable without logging unnecessary personal data or secrets.

## Implementation

### Transaction-bound approval record

| Field | Required binding |
|---|---|
| Identity | Approval ID, run ID, transaction ID, agent inventory ID and release digest |
| Requester | Original user/workload identity, tenant, business purpose |
| Action | Exact tool/operation and schema version |
| Target | Canonical resource/account identifiers and destination |
| Arguments | Canonical argument digest covering amounts, currency, recipients, scope |
| Preconditions | Record version/ETag, balance/state assumptions, policy version |
| Reviewer | Authenticated approver IDs, role evidence, separation-of-duties checks |
| Decision | Pending/approved/rejected/expired/revoked plus timestamp and reason |
| Validity | Issued time, expiry, one-time nonce, permitted execution count |
| Integrity | Server-controlled signed/tamper-evident record and verification key reference |
| Execution | Idempotency key, claimed/executed status, system-of-record receipt |

Canonicalization must be stable and cover every argument that affects the result.
Store sensitive transaction details in an access-controlled record; logs may carry only its reference.
Example expiry: 15 minutes for a sensitive write, shorter for volatile prices or balances.
This is a risk-adjustable proposal, not a platform default.

### State machine

```text
proposed → pending → approved → claimed → executed
                ↘ rejected
                ↘ expired
approved → revoked / expired (if not validly claimed for execution)
claimed → failed-known / outcome-unknown → reconciled
```

No rejection or expiry transition permits execution.
Atomically validate and claim an approved record immediately before the effect.
Define how a claim authorizes one transaction attempt and how late completion is reconciled.
For long queues or changed preconditions, obtain fresh approval rather than extending validity silently.
Use the same idempotency key for retries of the same authorized transaction.
Persist a durable intent/claim and use a system-of-record idempotency mechanism or equivalent transaction control.
Do not claim exactly-once execution across distributed systems without proving the underlying guarantees.
If a timeout leaves the outcome unknown, query the system of record before retry or compensation.

### Reviewer experience

Show who requested what, affected records, exact destination/amount, evidence, and consequences.
Distinguish model-generated recommendations from verified facts.
Make rejection as accessible as approval; require reason for exceptional overrides.
Do not preselect approval or obscure changed arguments.
Route requests to qualified reviewers with accessible interfaces and staffed coverage.
Escalation changes the reviewer, not the approved transaction scope.
Repeated rejections should end or redesign the workflow, not pressure another reviewer into approval.

### Required negative tests

Attempt changed amount, recipient, record ID, tool version, tenant, and release after approval.
Attempt self-approval, revoked approver role, expired nonce, and replayed response.
Race two workers claiming one approval and verify at most one authorized effect.
Simulate crash after tool execution but before receipt persistence and reconcile safely.
Test rejection, approval-service outage, unstaffed queue, and stale resource version.
Verify a malicious tool response cannot fabricate a trusted approval event.

## Evidence

Retain policy/risk mapping, approval records, reviewer authorization, and execution receipts.
Track approval compliance, expiry, rejection, override, queue delay, and replay-denial rates.
Record separation-of-duties exceptions and independent retrospective review.
Link [quality](../12-quality-evaluation/README.md), [operations](../22-production-operations/README.md), and [compliance](../24-compliance/README.md).
Keep approval rules in the [release manifest](../20-cicd/README.md) and [inventory](../25-ai-inventory/README.md).
Attach negative approval tests to [security review](../../checklists/security-review.md) and [production readiness](../../checklists/production-readiness.md).

## Sources and limitations

- [Agent Framework tool approvals](https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval).
- [Agent Framework workflow HITL](https://learn.microsoft.com/en-us/agent-framework/workflows/human-in-the-loop).
- [AG-UI human-in-the-loop](https://learn.microsoft.com/en-us/agent-framework/integrations/by-component/ui/ag-ui/human-in-the-loop).

Official Learn search results identify approval primitives; direct retrieval was unavailable.
Transaction binding, expiry, idempotency, durable execution, and separation of duties require application design.
