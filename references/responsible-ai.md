# Responsible AI and compliance references

Last reviewed: **2026-09-16**. Scope: enterprise AI risk, safety, quality, privacy, and oversight. Experience: all workloads. Capability status: regulatory/standards documents are not GA/Preview features; validate individual Foundry controls in the [register](microsoft-foundry.md). Recommendation: convert risk obligations into measurable controls and evidence. Limitations: this framework is not legal advice or a compliance certification. Exceptions: [process](../templates/exception-request.md); legally non-waivable obligations cannot be waived by internal policy.

## Microsoft references

| Source | How to use it | What it does not establish |
| --- | --- | --- |
| [Microsoft Responsible AI](https://www.microsoft.com/en-us/ai/responsible-ai) | Inform human accountability, transparency, fairness, safety and governance | Enterprise compliance merely by choosing a Microsoft service |
| [Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/) | Identify supported evaluation/guardrail implementation options | Production suitability across every model, agent, region and experience |
| [Azure AI Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview) | Evaluate available content-safety signals against the workload's harms | Perfect detection, legal correctness or transaction authorization |
| [Microsoft privacy and trust](https://www.microsoft.com/en-us/trust-center) | Review applicable service terms, attestations and privacy commitments | That a workload's configuration, custom code or downstream MCP service inherits every certification |

## Authoritative external references

| Source | Governance use | Required enterprise interpretation |
| --- | --- | --- |
| [GDPR, Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj) | Lawfulness, purpose limitation, minimization, rights, privacy by design, security and accountability | Data controller/processor roles, lawful basis, international transfers, retention and DPIA applicability |
| [EU AI Act, Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) | Prohibited practices, risk classification, transparency, oversight and relevant provider/deployer obligations | Classify use case and organizational role; verify current phased applicability, amendments and guidance with counsel |
| [European Commission AI Act guidance](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) | Track implementation guidance and policy updates | A substitute for the applicable legal text or a final classification decision |
| [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) | Govern, map, measure, and manage AI risks | A certification or a replacement for industry-specific obligations |
| [OECD AI Principles](https://oecd.ai/en/ai-principles) | Human-centered values, transparency, robustness and accountability | Concrete proof of compliance without workload-specific controls |

## Enterprise recommendation and proposed policy

Document intended and prohibited uses, affected users, potential harms, risk class, data categories, explanation/contestability needs, human oversight, and accountable owner before model selection. Assess indirect impact on people, not only whether the model output looks offensive.

Require representative evaluation, appropriate human review, safety/security testing, incident reporting, and lifecycle reassessment. Sensitive decisions in legal, HR, finance, health, or security contexts require domain/legal assessment and the [human approval model](../docs/23-human-in-the-loop/README.md); a confident answer is not evidence of authority.

Release gates must include false-positive/false-negative analysis and meaningful task quality, not only aggregate safety scores. A filtering “annotation” is a signal; the application must implement and test its chosen block, quarantine, escalation, or review action.

## Implementation and evidence

Use the [compliance mapping](../docs/24-compliance/README.md), [quality strategy](../docs/12-quality-evaluation/README.md), [guardrail baselines](../governance/baselines/README.md), and [control catalog](../governance/controls/README.md).

Retain the use-case risk assessment, legal applicability decision, privacy/data flow assessment, model/provider terms, evaluation methodology/dataset versions, limitations communicated to users, human oversight records, appeal/escalation route, incident records, and approvals. Apply access restrictions and lawful retention to evidence itself.

Compliance owns applicability reviews; AI governance owns risk/oversight standards; workload owners produce evidence. Review quarterly and after material law, purpose, model, data, tool, or affected-user changes. Do not hard-code a single EU AI Act date as the applicability date for all obligations.
