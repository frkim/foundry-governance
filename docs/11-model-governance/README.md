# 11 — Model governance

> Last reviewed: 2026-09-16.
> Scope: model selection, approval, deployment, updates, and retirement.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: provider terms, processing geography, versions, and deployment options differ.
> Exceptions: time-bound approval via [exception request](../../templates/exception-request.md).

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Foundry offers models from multiple providers and different deployment arrangements.
Catalog visibility is not approval for a particular organization, data class, or jurisdiction.
Azure OpenAI deployment names, model names, model versions, and deployment types are distinct.
Model lifecycle documentation and retirement schedules change independently of application releases.

| Capability | Verify for the selected model |
|---|---|
| Catalog access | Provider, offer, license, availability, and procurement route |
| Deployment | Regional/global/data-zone processing, SKU, capacity, and endpoint |
| Safety | Available filters, supported modalities, configuration, and exclusions |
| Version lifecycle | Supported version, update behavior, retirement notice, and replacement |
| Customization | Fine-tuning availability, training-data rules, and resulting artifact ownership |
| Operations | Quota, rate limits, telemetry, failover behavior, and support terms |

Do not apply Azure OpenAI-specific guarantees to every partner or externally hosted model.
An application using an approved SDK can still call an unapproved model.
Consult the [status register](../../references/microsoft-foundry.md) for model geography and provider-specific data-handling limits.
An Azure resource region alone does not establish inference-processing locality for every deployment type.
Current deployment guidance allows Standard/Regional Provisioned processing across multiple regions within an Azure **geography**.
Data-zone choices are model-dependent; US/EU/APAC availability and an EU boundary that can include EFTA require explicit review.
Where older PTU guidance suggests a narrower boundary, use the broader documented bound until the provider confirms the required restriction.
Privacy assurances for **Models sold by Azure** do not automatically cover every catalog offer, including provider-hosted Anthropic arrangements.

### Multi-model routing and provider boundaries

**Feature review: 2026-09-23.** The [source register](../../references/microsoft-foundry.md#september-2026-feature-review) confirms catalog entries for GPT-6 Astra/Sol/Luna but does not establish their explicit GA status. Claude Opus 5.5 has explicit model-specific GA entries for Azure-hosted and Anthropic-hosted offers; approve the offer, not just the name.
Azure-hosted Claude still has Anthropic provider/processing terms and uses the Anthropic Messages API; common Foundry access does not imply identical APIs, network support, retention or operating terms across providers.

**Model Router** supplies a GA multi-model routing abstraction; September routing metadata and direct Chat Completions session affinity are **Preview**. Session affinity is best effort, is not Agent Service session affinity, and does not store conversation context or guarantee cache hits.
Approve an explicit model subset for both normal routing and fallback, including provider, data class, processing geography, tool behavior and cost. Catalog presence does not establish router support: the reviewed router pool does not list GPT-6 or Opus 5.5.
Capture the serving model and available ordered attempts/fallback information, correlated with the release and trusted cost allocation. Preview metadata can be absent; its absence does not prove no fallback occurred.
Evaluate the entire allowed pool and failure paths before promotion; use [quality gates](../12-quality-evaluation/README.md), not a cheaper-model preference alone.

## Enterprise recommendation

Maintain an allowlist indexed by **model + version + provider + deployment type + region + use case + data class**.
Separate experimental eligibility from production approval.
Choose the smallest model that passes quality, safety, latency, and cost requirements.
Require a documented migration path before relying on a retiring or preview model.

| Decision factor | Required assessment | Example rejection reason |
|---|---|---|
| Task fit | Golden-set and trajectory results | Required language fails material cases |
| Safety | Abuse, jailbreak, and prohibited-content tests | Critical safety failure remains unresolved |
| Data | Processing, retention, abuse monitoring, transfers | Geography or retention conflicts with policy |
| Legal | Provider terms, license, IP, permitted use | Commercial redistribution not permitted |
| Security | Identity, endpoint exposure, tool behavior | Required private access unavailable |
| Economics | Total cost per successful outcome | Savings disappear after retries and tools |
| Resilience | Capacity, retirement, replacement, support | No approved recovery model or manual path |

Treat price and benchmark scores as inputs, not the final decision.
Model approval does not approve every prompt, tool, skill, or autonomous action.

## Policy

1. Register each production deployment and its resolved model version in the [inventory](../25-ai-inventory/README.md).
2. Use only approved combinations; block unknown endpoint routes at the application/gateway boundary.
3. Pin versions where supported and document automatic-upgrade settings where pinning is unavailable.
4. Evaluate before publish and after any meaningful model, prompt, tool, data, or guardrail change.
5. Require procurement/legal review for new provider terms, licenses, and marketplace purchases.
6. Require privacy review before fine-tuning or submitting sensitive evaluation data.
7. Reapprove fallback models for region, processing, data class, license, and task behavior.
8. Never use a model as the sole authority for legal eligibility, access control, or business approval.
9. Retire unsupported versions before service removal; a deployment alias is not a lifecycle strategy.
10. Keep judge-model and embedding-model versions under the same change discipline.

## Implementation

### Approval record

| Field | Required content |
|---|---|
| Identity | Provider, model identifier, exact version, modality, intended purpose |
| Deployment | Resource ID, deployment name, type/SKU, endpoint, geography |
| Terms | License/offer reference, acceptance date, permitted use, legal owner |
| Data handling | Classes allowed, retention, logging, training/abuse-monitoring assessment |
| Performance | Evaluation run IDs, dataset versions, latency distribution, cost estimate |
| Restrictions | Disallowed tasks, maximum authority, required human review |
| Lifecycle | Approval expiry, update mode, retirement date/source, replacement owner |
| Decision | Risk owner, approvers, date, exception if applicable |

### Lifecycle workflow

1. Intake: define the business task and permitted data.
2. Shortlist: compare compliant deployments rather than model families alone.
3. Validate: run offline evaluation, attack tests, and load tests.
4. Approve: record risk, legal, privacy, and service-owner decisions.
5. Deploy: release immutable configuration through [CI/CD](../20-cicd/README.md).
6. Observe: compare production quality, cost, and distribution against approved baselines.
7. Review: monthly retirement scan and quarterly approval attestation, adjusted for risk.
8. Migrate: evaluate replacement, canary, communicate changes, and verify rollback feasibility.
9. Retire: remove routing, revoke access, delete deployment where appropriate, retain required evidence.

### Update and fallback defaults

An illustrative internal target is a tested replacement 60 days before an announced retirement.
If less notice is available, escalate immediately rather than treating 60 days as vendor entitlement.
Alert when the resolved version differs from the release manifest.
Automatic provider changes trigger impact review even when the deployment name is unchanged.
Fallback selection uses an approved compatibility matrix, not “first available model.”
If no compatible destination exists, queue within the SLA or return a safe unavailable response.
Keep old embedding indexes compatible during migration; changing dimensions requires an explicit data plan.
Fine-tuned models inherit lineage and data obligations, but require their own evaluation and approval.

### Example decision

A support assistant may use a lower-cost model for classification after passing its test slice.
The same model is not automatically approved for payment recommendations.
An outage does not authorize routing customer records to a different processing geography.
Record a manual support path when approved capacity is exhausted.

## Evidence

Retain the signed allowlist entry, terms reference, and privacy/security assessment.
Keep model/deployment discovery snapshots and tests proving unapproved routes are rejected.
Attach before/after results from [quality evaluation](../12-quality-evaluation/README.md).
Attach migration rehearsals, upgrade configuration, and retirement communications.
Show budget attribution from [FinOps](../19-finops/README.md) and cost guardrails from [consumption](../18-consumption/README.md).
Use the [change matrix](../21-change-management/README.md) for reapproval decisions.
Apply the [control catalog](../../governance/controls/README.md) without treating catalog availability as compliance.
Use the [model registration](../../templates/model-registration.md) and [go-live gate](../../checklists/go-live.md).

## Sources and limitations

- [Foundry Models overview](https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview).
- [Model lifecycle and support policy](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements).
- [Model retirement schedule](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirement-schedule).
- [Foundry Models quotas and limits](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/quotas-limits).
- [Current model deployment types and processing boundaries](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types).
- [Model data, privacy, and security](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy).

Source URLs were identified through official Learn search results; direct retrieval was unavailable.
Review current provider terms and region-specific deployment documentation before approval.
The review cadence and migration target are enterprise proposals, not Microsoft guarantees.
