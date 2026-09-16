# 17 — Sharing and publishing

> Last reviewed: 2026-09-16.
> Scope: four tool/skill/MCP reuse levels and the separate audience/channel dimension for published agents.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: publishing targets, identities, tenant boundaries, and entitlements differ.
> Exceptions: time-bound approval via [exception request](../../templates/exception-request.md).

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Foundry documents agent applications and publishing integrations including Microsoft 365 Copilot and Teams.
Authoring access, application invocation, and downstream tool access are different permissions.
Publishing support and agent identity behavior depend on the selected experience, target, and feature status.
An endpoint does not by itself provide a tenant-safe consumer contract.
The dedicated AI Gateway preview tier's key grants span published assets; they do not satisfy per-agent/tool authorization.
Add validated application/backend authorization or reject that sharing design; distinguish other APIM gateway offerings.
Registering or discovering an agent does not imply permission to invoke it.
Sharing within a classic portal project must be evaluated against its actual project/resource type.
Shared Toolboxes expose versioned MCP endpoints; asset sharing does not replace per-tool authorization and consumer contracts.
The core Toolbox portal experience is GA; this does not establish GA or compatibility for every tool, skill, network, or publishing integration.
Default-version promotions require consumer impact analysis, staged evaluation, and notification under the same sharing level.

## Enterprise recommendation

Use exactly four reuse levels: **1 Private (one agent), 2 Project, 3 Business Unit (multiple projects), 4 Enterprise**.
Apply them to tools, skills, MCP services, and their shared packages/endpoints; choose the narrowest justified scope.
External/partner publishing is a separate audience dimension, not a fifth level or the meaning of Level 4.
Share invocation access rather than project-authoring permissions with ordinary consumers.
Distinguish **asset reuse** (copy/package) from **service consumption** (invoke a managed endpoint).
An asset recipient inherits operational duties; a service consumer relies on a defined service contract.

### Four-level tool/skill/MCP reuse matrix

| Control | 1 — Private (one agent) | 2 — Project | 3 — Business Unit (multiple projects) | 4 — Enterprise |
|---|---|---|---|---|
| Owner | Agent owner and named asset maintainer | Project owner and shared-component maintainer | Business-unit product owner and consuming project owners | Enterprise capability owner and platform operator |
| Authentication | Dedicated authorized agent workload identity | Distinct approved agent/consumer identities within the project | Approved identities across registered BU projects | Enterprise-federated workload identities and governed onboarding |
| Authorization | Only the designated agent; operation and original-user checks | Approved project consumers; per-tool/action/data checks | Explicit project/consumer entitlements; no BU-wide implicit data access | Per-consumer/asset/operation authorization; enterprise discovery grants no access |
| Version | Exact tool/schema, MCP capability, or skill digest pinned to agent | Versioned shared asset and registered consuming releases | Compatibility policy and staged default promotion across projects | Supported versions, enterprise consumer impact analysis, migration and revocation policy |
| Approval | Agent owner, asset owner, and data/security reviewer as applicable | Project/data owners and security review for new authority | BU/service and consuming project owners plus affected risk authorities | Enterprise governance/platform owner plus security/data/privacy review as applicable |
| Monitoring | Agent-correlated calls, effects, failures, and audit | Project dashboard with per-agent usage, quality, and denial signals | Cross-project SLO, consumer isolation, security, and dependency telemetry | Central SOC/on-call plus consumer-specific quality, usage, and audit views |
| Cost | Agent cost center, bounded calls, and allocation | Project budget with per-agent allocation and limits | BU budget/showback with project quotas and shared-cost rules | Enterprise service allocation/chargeback, per-consumer limits, and capacity planning |
| SLA | Named support hours and explicit best-effort/SLO target | Agreed project support, SLO, and escalation | Cross-project service commitment, support owner, and continuity plan | Published enterprise SLA/SLO, support coverage, capacity, and recovery commitments |
| Classification | Agent-approved data classes, purpose, and retention | Explicit project-approved classes with record-level access | Approved inter-project flows; preserve source restrictions and geography | Enterprise reuse eligibility; restricted data still requires consumer-specific authorization |

The matrix is mandatory at every level; Private does not waive identity, approval, monitoring, or cost controls.
An external endpoint is not automatically anonymous; anonymous access requires separate exceptional approval.
Content classification follows the data, not the visibility setting of the agent.

## Policy

1. Complete the reuse matrix before sharing/promotion; separately approve publishing audience and channel.
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
| Choose reuse and publication scope | Private/Project/Business Unit/Enterprise matrix, asset/service distinction, and separate audience/channel approval |
| Establish identity | Caller authentication and separate application/tool identity review |
| Prove authorization | Allowed and denied tests across user, role, tenant, and data scope |
| Package release | Immutable manifest, agent/model/tool/skill versions |
| Validate behavior | Golden-set, safety, trajectory, and channel-specific tests |
| Set consumption | Consumer attribution, rate/concurrency limits, quotas, cost guard |
| Prepare operations | SLO, dashboard, on-call, runbook, support hours |
| Approve and publish | Approval evidence, endpoint/channel configuration, inventory update |
| Verify withdrawal | Disable invocation, revoke entitlements, remove channel/catalog entry |

### Publication dimension — separate from reuse level

Publishing to Teams or Copilot is a distribution choice, not a compliance exemption.
An agent can consume a Level 4 Enterprise skill while remaining available only to a narrow internal audience.
External/partner access requires a separate contract owner, partner sponsor, approved federation, tenant-scoped authorization, and support terms.
Add tenant-isolated monitoring, cost/rate allowances, approved outbound classification, and legal/privacy/transfer approval.
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
For external/partner publication at any applicable reuse level, add data-processing terms, subprocessors, breach notice, transfer safeguards, and deletion verification.
For asset reuse, add provenance, license, patch responsibility, and approved dependency requirements.
An internal package may still contain licensed or confidential material that cannot be redistributed externally.

### Expansion and revocation

Treat Private → Project → Business Unit → Enterprise reuse expansion as a risk-increasing change.
Assess internal-to-external publication separately; enterprise reuse approval never authorizes external disclosure.
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
- [Shared Toolboxes and versioning](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview).
- [Feature readiness by named experience](https://learn.microsoft.com/en-us/azure/foundry/concepts/general-availability#feature-readiness-at-ga).

Official Learn search results identify publishing and identity capabilities; direct retrieval was unavailable.
The four sharing levels and all service-contract requirements are proposed enterprise controls.
Validate target-specific preview/GA status, supported tenants, and licenses before approving exposure.
