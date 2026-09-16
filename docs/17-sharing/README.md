# 17 — Sharing and publishing

> Last reviewed: 2026-09-16.
> Scope: sharing agent assets and consuming published agent services across four trust levels.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: publishing targets, identities, tenant boundaries, and entitlements differ.
> Exceptions: time-bound approval via ../../templates/exception-request.md.

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Foundry documents agent applications and publishing integrations including Microsoft 365 Copilot and Teams.
Authoring access, application invocation, and downstream tool access are different permissions.
Publishing support and agent identity behavior depend on the selected experience, target, and feature status.
An endpoint does not by itself provide a tenant-safe consumer contract.
Registering or discovering an agent does not imply permission to invoke it.
Sharing within a classic portal project must be evaluated against its actual project/resource type.

## Enterprise recommendation

Use four explicit sharing levels; choose the narrowest that serves the business need.
Share invocation access rather than project-authoring permissions with ordinary consumers.
Distinguish **asset reuse** (copy/package) from **service consumption** (invoke a managed endpoint).
An asset recipient inherits operational duties; a service consumer relies on a defined service contract.

### Four-level control matrix

| Control | 1 — Project/team | 2 — Internal cross-team | 3 — Enterprise-wide | 4 — External/partner |
|---|---|---|---|---|
| Owner | Named team and technical owner | Provider service owner and consumer owner | Accountable product owner and platform operator | Contract owner, service owner, partner sponsor |
| Authentication | Entra user/workload identity | Separate consumer workload identities | Enterprise identity and approved channel integration | Approved federation or customer identity; explicit tenant boundary |
| Authorization | Least-privilege project and invocation roles | Per-consumer app scope; downstream data checks | Role/attribute policy with entitlement reviews | Contract-scoped tenant/resource checks on every request |
| Version | Pinned asset/release | Versioned API and compatibility policy | Published lifecycle and supported versions | Contracted version, migration window, revocation terms |
| Approval | Team owner and data owner | Provider/consumer owners plus security | Governance, security, privacy, operations | All prior approvals plus legal/procurement and transfer review |
| Monitoring | Team dashboard and audit | Consumer-tagged SLO, security, usage | Central SOC/on-call with cohort quality | Tenant-isolated audit, abuse detection, partner incident routing |
| Cost | Team cost center and limits | Chargeback/showback, per-consumer limits | Service pricing/allocation and capacity plan | Contracted rate/allowance, metering, fraud and spend controls |
| SLA | Explicit support hours and best-effort/target | Agreed service SLO and escalation | Published service commitment and continuity plan | Contractual SLA, exclusions, support and notification terms |
| Classification | Approved team data classes | Minimum permitted shared class | Approved broad audience; no implicit restricted-data exposure | Explicit outbound classes, residency, license, and retention |

The matrix is mandatory at every level; lower levels do not waive ownership or cost controls.
An external endpoint is not automatically anonymous; anonymous access requires separate exceptional approval.
Content classification follows the data, not the visibility setting of the agent.

## Policy

1. Complete the sharing matrix before publish or audience expansion.
2. Evaluate the deployed version before publication and after meaningful changes.
3. Never share credentials, administrator roles, connection secrets, or unrestricted project membership.
4. Authorize the original user/tenant against each retrieved record and consequential action.
5. Do not use a shared agent identity to bypass consumer entitlements.
6. Require legal/privacy review before exposing data, assets, or actions outside the organization.
7. Pin consumer-compatible versions and publish deprecation and emergency-revocation procedures.
8. Keep per-consumer monitoring and allocation without leaking one consumer's data to another.
9. Require a tested withdrawal path for every publishing channel.
10. Maintain a consumer register linked to the [AI inventory](../25-ai-inventory/README.md).

## Implementation

### Publishing checklist

| Step | Acceptance evidence |
|---|---|
| Define product | Purpose, permitted users, excluded uses, data classification |
| Choose sharing level | Completed matrix and service/asset distinction |
| Establish identity | Caller authentication and separate application/tool identity review |
| Prove authorization | Allowed and denied tests across user, role, tenant, and data scope |
| Package release | Immutable manifest, agent/model/tool/skill versions |
| Validate behavior | Golden-set, safety, trajectory, and channel-specific tests |
| Set consumption | Consumer attribution, rate/concurrency limits, quotas, cost guard |
| Prepare operations | SLO, dashboard, on-call, runbook, support hours |
| Approve and publish | Approval evidence, endpoint/channel configuration, inventory update |
| Verify withdrawal | Disable invocation, revoke entitlements, remove channel/catalog entry |

Publishing to Teams or Copilot is a distribution choice, not a compliance exemption.
Validate authentication, consent, app permissions, channel policies, and licensing in the target tenant.
Test how conversation state and attachments are retained in each channel.
Verify whether end-user identity reaches the tool layer; do not assume delegated access.

### Example consumer contract

```text
Service: case-summary / supported release family 2
Audience: internal service-desk staff with case entitlement
Data: Confidential case records; no unrestricted attachment export
Authorization: case-level check on every retrieval and write proposal
Limits: 5 concurrent runs per consumer; bounded tool calls
Support: business-hours team, named escalation, 30-day change notice target
Charging: monthly showback by consumer ID; approved unit-cost ceiling
Withdrawal: deny new runs immediately; resolve active transactions safely
```

The example is illustrative; the support target is not a Microsoft SLA.
For level 4, add data-processing terms, subprocessors, breach notice, transfer safeguards, and deletion verification.
For asset reuse, add provenance, license, patch responsibility, and approved dependency requirements.
An internal package may still contain licensed or confidential material that cannot be redistributed externally.

### Expansion and revocation

Treat team-to-enterprise and internal-to-external expansion as risk-increasing changes.
Reevaluate privacy, capacity, prompt abuse, cost exposure, and support readiness.
Invalidate active credentials/entitlements where appropriate and stop new runs during withdrawal.
Do not delete transaction evidence or personal data subject to valid retention/legal-hold obligations.
Notify consumers of the reason, safe alternative, and approved recovery plan.
Reconcile channel visibility and actual endpoint reachability after removal.

## Evidence

Retain the completed matrix, owner approvals, consumer register, and classification decision.
Attach cross-user/tenant denial tests and tool-level authorization results.
Keep publication manifests, release notes, service commitments, and revocation drill records.
Link [quality](../12-quality-evaluation/README.md), [consumption](../18-consumption/README.md), and [compliance](../24-compliance/README.md).
Review entitlements quarterly and when a consumer owner or business purpose changes.
Use the [go-live checklist](../../checklists/go-live.md) for first publication and material audience expansion.

## Sources and limitations

- [Agent applications](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/agent-applications).
- [Publish to Microsoft 365 Copilot and Teams](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot).
- [Agent identity concepts](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-identity).

Official Learn search results identify publishing and identity capabilities; direct retrieval was unavailable.
The four sharing levels and all service-contract requirements are proposed enterprise controls.
Validate target-specific preview/GA status, supported tenants, and licenses before approving exposure.
