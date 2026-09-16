# 20 — CI/CD and reproducible releases

> Last reviewed: 2026-09-16.
> Scope: source control, infrastructure, identity, evaluation gates, deployment, and rollback.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: resource-provider/API coverage and immutable version support vary by feature.
> Exceptions: time-bound approval via ../../templates/exception-request.md.

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Azure supports GitHub Actions authentication using OpenID Connect (OIDC) and federated identity.
Bicep/ARM and other approved IaC workflows can provision supported Azure resources.
What-if/plan operations help review infrastructure changes, but do not prove every runtime effect.
Foundry agent/model configuration may use different management and data-plane APIs.
Check API/version coverage rather than assuming every portal action has declarative IaC parity.

## Enterprise recommendation

Promote the **same immutable release artifact** through isolated development, test, and production environments.
Use short-lived federation rather than long-lived cloud secrets.
Separate build, approval, and production deployment authority.
Treat prompts, tools, MCP servers, skills, retrieval settings, and guardrails as production code.
Evaluate before publish and after every meaningful configuration change.

### Immutable release manifest

| Manifest field | Pin or record |
|---|---|
| Release identity | Release ID, source commit, artifact digest, build provenance, timestamp |
| Agent | Stable inventory ID, type, hosting mode, definition/workflow digest |
| Runtime | SDK/framework versions, lockfile, runtime version, container image digest |
| Prompt | System/developer instructions and templates by digest/version |
| Model | Provider, model/version, deployment/type, region, update mode |
| Tools | Tool IDs, schema/code versions, endpoint policy, allowed operations |
| MCP | Approved servers, transport/endpoints, schemas, auth scopes, capability snapshot |
| Skills | Skill IDs, exact versions/digests, dependency manifests |
| Guardrails | Safety settings, policy bundle, action approval rules, refusal behavior |
| Data | Source/index snapshot or version, retrieval/chunking/embedding config, ACL policy |
| Network | Approved routes, private/public access, egress allowlist, DNS policy |
| Identity | Runtime identity references, role assignments, federation trust configuration |
| Consumption | Rate/concurrency/tool/turn/retry limits and allocation policy |
| Evaluation | Dataset/grader versions, run IDs, results, acceptance decision |
| Operations | Dashboard/runbook/SLO references, telemetry schema and redaction config |
| Approval | Change/risk record, approvers, exception expiry if any |
| Recovery | Previous compatible manifest, rollback route, state-migration/compensation plan |

Store secret references, never secret values, in the manifest.
Where a service cannot pin an underlying version, record that limitation and detect resolved-version drift.
Block release if the unpinnable dependency makes required controls unverifiable.

## Policy

1. Require protected branches, peer review, controlled environments, and traceable approval.
2. Bind OIDC trust to the intended repository and approved branch/environment subject.
3. Limit deployment identity to required scopes; use separate identities for each environment.
4. Do not grant untrusted pull requests production tokens, secrets, or write-capable deployments.
5. Pin third-party workflow actions and build dependencies to reviewed immutable references.
6. Scan application artifacts, dependencies, containers, and content for secrets and supply-chain risks.
7. Deny deployment when required evaluations or policy checks fail or return incomplete results.
8. Prohibit unrecorded portal hotfixes; reconcile emergency changes into source and manifest.
9. Test rollback and state compatibility before production traffic.
10. Update the [inventory](../25-ai-inventory/README.md) atomically with release promotion evidence.

## Implementation

### Pipeline stages

| Stage | Required checks | Failure behavior |
|---|---|---|
| Validate | Schema, IaC validation, lint/tests already used by the project | Stop build |
| Review | Threat/permission/data/license diff and change-risk classification | Require appropriate owner approval |
| Build | Deterministic package, dependency lock, image/provenance, secret scan | Quarantine artifact |
| Plan | IaC what-if/plan and policy checks | Block unexpected destructive or exposure changes |
| Deploy test | Isolated identity/network and synthetic test data | No production connection fallback |
| Evaluate | Golden set, adversarial/trajectory, authorization, load, cost | Block on hard-gate failure |
| Approve | Independent release owner/risk approver by change class | Keep candidate unpublished |
| Canary | Limited authorized cohort/traffic and live telemetry | Pause/rollback on thresholds |
| Promote | Approved immutable manifest and controlled routing change | Preserve previous compatible release |
| Verify | Smoke tests, resolved configuration, inventory and alerts | Incident/rollback if verification fails |

### Example canary policy

For a low-risk service, start at 5% traffic for at least 30 minutes **and** 200 completed requests.
These are illustrative minima; sparse or consequential workloads need longer observation or supervised trials.
Block promotion for any unauthorized effect, missing required approval, or critical safety failure.
Pause if error rate increases by one percentage point or p95 latency rises 20% against comparable baseline.
Also compare task success, unit cost, tenant isolation, and telemetry completeness.
Do not replay state-changing production traffic into a shadow system with live write tools.
Use sanitized replay or disabled-write tools for shadow evaluation.

### Rollback design

Switch routing to the last approved compatible manifest, not a mutable deployment label.
Confirm the previous model version and capacity still exist and remain approved.
Restore prompt, tools/MCP, skills, guardrails, data/index compatibility, and network policy together.
Cancel or drain active runs according to transaction state; never replay unknown writes blindly.
Use idempotency and compensating operations for side effects; code rollback does not reverse a payment.
If rollback is unsafe, disable affected actions and activate manual service.
Record who triggered rollback, why, what changed, and the verification result.

### Drift control

Compare effective configuration against the release manifest after deployment and on a schedule.
Include tool schemas, MCP capability changes, mutable data indexes, and model update settings.
Open a [change record](../21-change-management/README.md) for drift; quarantine unapproved high-risk changes.
Do not overwrite intentional emergency containment without incident-owner approval.

## Evidence

Retain source review, build provenance, immutable manifest, IaC plan, and deployment logs.
Attach federation trust review, least-privilege tests, and secret-scan results.
Keep evaluation gates, approver identity, canary comparisons, rollback rehearsal, and drift reports.
Link [quality](../12-quality-evaluation/README.md), [model governance](../11-model-governance/README.md), and [operations](../22-production-operations/README.md).
Apply the [control catalog](../../governance/controls/README.md) across management and data planes.
Bind [production readiness](../../checklists/production-readiness.md) and [go-live approval](../../checklists/go-live.md) to the manifest digest.

## Sources and limitations

- [Authenticate GitHub Actions to Azure with OIDC](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure-openid-connect).
- [Deploy Bicep with GitHub Actions](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-github-actions).
- [Deploy with IaC and GitHub Actions](https://learn.microsoft.com/en-us/devops/deliver/iac-github-actions).
- [Evaluate agents](https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluate-agent).

Official Learn search results identify supported building blocks; direct retrieval was unavailable.
The manifest, canary numbers, and promotion gates are proposed enterprise controls, not a shipped pipeline.
