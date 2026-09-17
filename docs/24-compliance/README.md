# 24 — Compliance and responsible AI

> Last reviewed: 2026-09-16.
> Scope: legal applicability, control mapping, evidence, privacy, and responsible AI.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: this is not legal advice, certification, or a verified jurisdiction-specific compliance determination.
> Exceptions: time-bound approval via [exception request](../../templates/exception-request.md).

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Microsoft provides responsible AI guidance, service-assurance information, and GDPR resources.
Purview Compliance Manager offers assessment and evidence-management capabilities for supported regulations.
Coverage depends on service, deployment, geography, license, and applicable assessment scope.
A provider certification or tool score does not certify the customer's agent or business process.
Customer responsibilities include lawful purpose, data use, access, oversight, and downstream actions.

## Enterprise recommendation

Start with an applicability assessment signed by legal/privacy and the accountable business owner.
Record jurisdiction, affected people, deployment geography, purpose, and provider/deployer roles.
Map obligations to the [control catalog](../../governance/controls/README.md), evidence, owners, and review dates.
Use [baselines](../../governance/baselines/README.md) as implementation starting points, not legal conclusions.
Keep prohibited use, high-risk use, and ordinary business risk as distinct classifications.

### Control-to-obligation working map

This is a starting map for qualified review, not an exhaustive statement of legal requirements.

| Framework / obligation area | Enterprise implementation | Evidence |
|---|---|---|
| GDPR lawful basis, purpose limitation, minimization | Define purpose/basis; restrict prompts, retrieval, tools, and telemetry | Processing record, privacy notice, data-flow review |
| GDPR transparency and data-subject rights | Explain AI use; locate/export/correct/delete relevant personal data where required | Notices, rights workflow, deletion tests |
| GDPR security and privacy by design | Least privilege, approved geography, retention, redaction, incident process | Access tests, configuration, incident exercises |
| GDPR DPIA / automated decisions | Assess high-risk processing and Article 22 applicability with counsel | DPIA decision, safeguards, human review process |
| EU AI Act role/risk classification | Assess system purpose, prohibited uses, provider/deployer duties | Signed classification and applicability register |
| EU AI Act oversight/transparency | Appropriate human oversight, user information, traceable operations | Approval records, UI notices, training, logs |
| EU AI Act data/quality/documentation where applicable | Govern datasets, evaluation, technical documentation, monitoring | Golden sets, lineage, release records, incidents |
| ISO/IEC 42001 management-system alignment | AI policy, accountable roles, risk process, improvement | Governance reviews, risk register, corrective actions |
| ISO/IEC 27001 security alignment | Identity, change, supplier, incident, and asset controls | Access reviews, supplier review, audit evidence |
| NIST AI RMF alignment | Govern, map, measure, and manage context-specific risks | Inventory, impact analysis, evaluations, treatment plan |
| Sector/contractual obligations | Assess health, finance, employment, public-sector, and customer conditions | Qualified applicability opinion and specific control plan |

Do not state that GDPR forbids every automated decision; Article 22 has a defined scope and exceptions.
Do not classify all agents as high-risk under the EU AI Act solely because they use generative AI.
Where obligations conflict, legal/privacy resolves the applicable requirement before deployment.
GDPR has applied since **25 May 2018**; AI-specific deadlines do not suspend existing privacy obligations.

### EU AI Act timeline handling

The table below records milestones in the **2024 enacted text**, not a verified consolidated 2026 deadline table.
Legal must check the current consolidated law, amendments, transitional rules, and Commission guidance.
Bootstrap research returned conflicting later-timeline summaries; this chapter does not resolve or adopt them.

| Reference milestone | Meaning in the original enacted schedule |
|---|---|
| 1 August 2024 | Entry into force |
| 2 February 2025 | Chapters I and II, including AI literacy and prohibited practices, begin applying |
| 2 August 2025 | Specified governance/GPAI and other provisions begin applying, subject to exceptions |
| 2 August 2026 | General application date, subject to specific transitions and exceptions |
| 2 August 2027 | Article 6(1) and corresponding obligations under the original Article 113 schedule |

Do not interpret the last row as a universal deadline for every high-risk system.
Existing systems and GPAI models can have separate transitional provisions.
As of this chapter's review date, do not treat already elapsed milestones as future planning windows.
The compliance register must contain a counsel-validated **current applicable deadline** and legal source.
No current-date compliance claim is permitted solely from this historical table.

## Policy

1. Complete legal/privacy applicability and AI impact assessment before production.
2. Prohibit unlawful uses regardless of technical feasibility or business approval.
3. Review new data classes, regions, providers, autonomy, and external audiences as material changes.
4. Default raw PII/content tracing off and redact before export.
5. Document retention/deletion for conversations, files, indexes, memory, evaluations, logs, and backups.
6. Require supplier terms, license, subprocessors, and cross-border transfer review where applicable.
7. Provide qualified human oversight and contest/escalation routes when required.
8. Train builders, approvers, operators, and users according to their risks and responsibilities.
9. Retain auditable evidence; do not present missing evidence as compliant by assumption.
10. Use exceptions only for enterprise policy deviations that are legally permissible.

## Implementation

### Applicability register

| Field | Required entry |
|---|---|
| System | Inventory ID, purpose, owner, affected users, decision impact |
| Roles | Customer/provider/deployer/controller/processor roles as assessed |
| Geography | User, hosting, processing, support, export, and subprocessor locations |
| Data | Categories, special/sensitive data, lawful basis, retention, rights handling |
| Obligations | Applicable laws/contracts, exact provision/source, current deadline |
| Risk assessment | AI impact assessment, DPIA decision, prohibited/high-risk analysis |
| Controls | Mapped catalog controls, owner, implementation, evidence |
| Residual risk | Treatment, qualified approvers, expiry, review trigger |
| Assurance | Review date, legal opinion reference, audit/test results |

Test deletion across agent memory, retrieval indexes, exports, and backup restoration procedures.
Define how legal holds and deletion obligations are reconciled without indefinite default retention.
Check whether suppliers retain submitted data for abuse monitoring, support, or other purposes.
Use [model governance](../11-model-governance/README.md) for provider-specific terms.
Use [HITL](../23-human-in-the-loop/README.md) for consequential decisions and exact approval binding.
Use [sharing](../17-sharing/README.md) before broadening audience or external distribution.
Escalate suspected personal-data incidents to privacy/legal using the organization's statutory notification process.
Do not invent one universal breach deadline for all jurisdictions and event types.

## Evidence

Retain legal applicability, AI impact/DPIA decisions, notices, supplier terms, and risk treatments.
Attach training completion, evaluation, approval, access, retention, and deletion evidence.
Record legal source URL, version/date, interpretation owner, and next review date.
Maintain an evidence index with protected references rather than duplicating personal data.
Review [inventory](../25-ai-inventory/README.md) and [change](../21-change-management/README.md) records for scope drift.
Report open findings and expired approvals separately from compliant controls.
Retain [security review](../../checklists/security-review.md) and [go-live](../../checklists/go-live.md) decisions with the applicable legal scope.

## Sources and limitations

- [Microsoft GDPR guidance](https://learn.microsoft.com/en-us/compliance/regulatory/gdpr).
- [Responsible AI policies](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ai/responsible-ai-policies).
- [AI governance for regulatory compliance](https://learn.microsoft.com/en-us/security/security-for-ai/govern).
- [Purview Compliance Manager regulations](https://learn.microsoft.com/en-us/purview/compliance-manager-regulations-list).
- [GDPR enacted regulation, including Article 99](https://eur-lex.europa.eu/eli/reg/2016/679/oj).
- [EU AI Act enacted regulation](https://eur-lex.europa.eu/eli/reg/2024/1689/oj).
- [European Commission AI Act questions](https://digital-strategy.ec.europa.eu/en/faqs/navigating-ai-act).

Microsoft URLs were identified through official Learn search results; direct retrieval was unavailable.
The EU legal text and current consolidated amendments take precedence over summaries and this baseline.
Mappings are original implementation guidance and do not reproduce or certify proprietary standards.
