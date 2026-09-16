# Microsoft Foundry Enterprise Governance

**Govern AI applications and agents as production software, not as isolated experiments.**

An opinionated enterprise framework for architects, security and data teams, platform engineers, developers, AI governance, operations, and FinOps. Governance spans **Discover → Design → Build → Secure → Evaluate → Approve → Deploy → Observe → Optimize → Govern → Retire**.

## Start here

1. Read the [principles, terminology, and anti-patterns](docs/00-overview/README.md).
2. Assign accountability using the [operating model and RACI](docs/01-governance-model/README.md).
3. Select [resource/project topology](docs/02-resource-topology/README.md), a [reference architecture](architecture/reference-architectures/README.md), and the relevant [decision trees](architecture/decision-trees/README.md).
4. Register the [agent](templates/agent-registration.md), its [model](templates/model-registration.md), [tools](templates/tool-registration.md), and [MCP servers](templates/mcp-registration.md).
5. Apply the [control catalog](governance/controls/README.md) and [guardrail baselines](governance/baselines/README.md); collect evidence through the review checklists.
6. Operate against [quality gates](docs/12-quality-evaluation/README.md), [SLOs](docs/22-production-operations/README.md), and [consumption limits](docs/18-consumption/README.md); reassess after changes.

**Adoption status:** initial documentation baseline, not a certified implementation or a claim of regulatory compliance. “Must” describes a **proposed enterprise policy**, effective only when adopted by your organization. Diagrams and examples are design references, not deployable or service-validated infrastructure.

**Research snapshot:** 2026-09-16. Foundry evolves rapidly. Read the [capability/status register](references/microsoft-foundry.md) before implementation. GA, Preview, Deprecated, and **Verification required** describe individual capabilities, not this framework. Preview or unverified features require explicit approval; they are not automatically production-ready. Direct source verification was limited during bootstrap; the register records this rather than asserting unverified GA status.

### Updates to the initial scope

- Current Agent Service guidance distinguishes **prompt and hosted agents**; externally hosted code can also use the Responses API without a persisted agent resource. Such applications still require enterprise inventory and controls.
- The visual **Foundry workflows feature is Preview with retirement announced for December 1, 2026**. Retain it for migration governance, not new deployment recommendations; use an approved code-based orchestration approach for new workflows.
- **Toolbox** adds shared, versioned tool endpoints; **tool search, skills, and agent optimizer** include preview capabilities requiring separate approval and testing. Promoting a shared default or optimizer-generated candidate is a governed release.
- Established APIM AI capabilities, **Preview Foundry integration**, and the **Preview dedicated AI Gateway tier** have different boundaries and limitations. They are not interchangeable.

These findings refine the original issue rather than freezing outdated terminology into the framework. See the source register for exact scope, references, and uncertainty.

## Governance domains

| Domain | Decisions and outputs |
| --- | --- |
| [00 · Overview](docs/00-overview/README.md) | Principles, terminology, lifecycle, anti-patterns |
| [01 · Governance model](docs/01-governance-model/README.md) | Organization, ownership, RACI, exceptions |
| [02 · Resource topology](docs/02-resource-topology/README.md) | Subscriptions, resources, projects, isolation, regions |
| [03 · Identity and access](docs/03-identity-access/README.md) | Persona RBAC, runtime identities, production access |
| [04 · Network security](docs/04-network-security/README.md) | Ingress, egress, private networking, trust boundaries |
| [05 · Data governance](docs/05-data-governance/README.md) | Data access, storage, residency, retention, redaction |
| [06 · Agent architecture](docs/06-agent-architecture/README.md) | Prompt, hosted, workflow, external agents and lifecycle |
| [07 · Agent security](docs/07-agent-security/README.md) | Threats, preventive/detective/corrective controls |
| [08 · Tools](docs/08-tools/README.md) | Catalog, risk classes, approval, tool identity |
| [09 · MCP](docs/09-mcp/README.md) | Server trust, discovery, permissions, gateway routing |
| [10 · AI Gateway](docs/10-ai-gateway/README.md) | APIM, routing, model and MCP consumer controls |
| [11 · Model governance](docs/11-model-governance/README.md) | Enterprise model approval, versions, deployment types |
| [12 · Quality and evaluation](docs/12-quality-evaluation/README.md) | Datasets, groundedness, trajectories, release gates |
| [13 · Observability](docs/13-observability/README.md) | Traces, metrics, logs, telemetry privacy |
| [14 · Security monitoring](docs/14-security-monitoring/README.md) | SOC integration, detections, response |
| [15 · Guardrails](docs/15-guardrails/README.md) | Enterprise and high-risk safeguards |
| [16 · Skills](docs/16-skills/README.md) | Reusable instructions, prompts, components |
| [17 · Sharing](docs/17-sharing/README.md) | Private, project, business-unit, enterprise levels |
| [18 · Consumption](docs/18-consumption/README.md) | TPM/RPM, concurrency, soft/hard limits, escalation |
| [19 · FinOps](docs/19-finops/README.md) | Allocation, optimization, budgets, unit economics |
| [20 · CI/CD](docs/20-cicd/README.md) | IaC, evaluations, release approvals, rollback |
| [21 · Change management](docs/21-change-management/README.md) | Risk tiers, dependency changes, reapproval |
| [22 · Production operations](docs/22-production-operations/README.md) | Agent SRE, SLOs, incident management |
| [23 · Human-in-the-loop](docs/23-human-in-the-loop/README.md) | Transaction-bound approval and separation of duties |
| [24 · Compliance](docs/24-compliance/README.md) | Requirement-to-control-to-evidence mapping |
| [25 · AI inventory](docs/25-ai-inventory/README.md) | Assets, owners, dependencies, retirement |
| [26 · Maturity model](docs/26-maturity-model/README.md) | Evidence-based levels 0–5 |

## Architecture and implementation aids

- [Architecture library](architecture/README.md): 16 [reference architectures](architecture/reference-architectures/README.md), [diagram conventions](architecture/diagrams/README.md), and 14 [decision frameworks](architecture/decision-trees/README.md).
- Governance: [policies](governance/policies/README.md), [standards](governance/standards/README.md), [baselines](governance/baselines/README.md), and [controls](governance/controls/README.md).
- Reviews: [architecture](checklists/architecture-review.md), [security](checklists/security-review.md), [production readiness](checklists/production-readiness.md), and [go-live](checklists/go-live.md).
- Templates: [agent](templates/agent-registration.md), [tool](templates/tool-registration.md), [MCP](templates/mcp-registration.md), [model](templates/model-registration.md), and [exception request](templates/exception-request.md).
- Worked examples: [single agent](examples/single-agent/README.md), [multi-agent](examples/multi-agent/README.md), [MCP](examples/mcp/README.md), [AI Gateway](examples/ai-gateway/README.md), [RAG](examples/rag/README.md), and [enterprise](examples/enterprise/README.md).
- Sources: [Microsoft Foundry](references/microsoft-foundry.md), [Azure](references/azure.md), [security](references/security.md), and [Responsible AI](references/responsible-ai.md).

## Answering the 25 enterprise governance questions

| # | Question | Where to decide and record evidence |
| --- | --- | --- |
| 1 | Where should it be deployed? | [Agent architecture](docs/06-agent-architecture/README.md), [architecture review](checklists/architecture-review.md) |
| 2 | Which resource/project should host it? | [Topology](docs/02-resource-topology/README.md) |
| 3 | Who owns it? | [RACI](docs/01-governance-model/README.md), [agent registration](templates/agent-registration.md) |
| 4 | Which identity does it use? | [Identity and access](docs/03-identity-access/README.md) |
| 5 | Which data can it access? | [Data governance](docs/05-data-governance/README.md) |
| 6 | Which model can it use? | [Model approval](docs/11-model-governance/README.md) |
| 7 | Which tools can it call? | [Tool governance](docs/08-tools/README.md) |
| 8 | Which MCP servers can it access? | [MCP governance](docs/09-mcp/README.md) |
| 9 | How are tools governed? | [Tool registration](templates/tool-registration.md), [sharing](docs/17-sharing/README.md) |
| 10 | How are TPM/RPM and quotas controlled? | [Consumption](docs/18-consumption/README.md), [AI Gateway](docs/10-ai-gateway/README.md) |
| 11 | How is cost attributed? | [FinOps](docs/19-finops/README.md) |
| 12 | How is quality measured? | [Quality gates](docs/12-quality-evaluation/README.md) |
| 13 | How are hallucination and groundedness measured? | [Evaluation](docs/12-quality-evaluation/README.md) |
| 14 | How is prompt injection addressed? | [Agent security](docs/07-agent-security/README.md) |
| 15 | Which guardrails are mandatory? | [Baselines](governance/baselines/README.md) |
| 16 | How is the agent observed? | [Observability](docs/13-observability/README.md) |
| 17 | How are security events detected? | [SOC integration](docs/14-security-monitoring/README.md) |
| 18 | How is it deployed? | [Enterprise pipeline](docs/20-cicd/README.md) |
| 19 | How is it versioned? | [Change management](docs/21-change-management/README.md), [skills](docs/16-skills/README.md) |
| 20 | How is it rolled back? | [CI/CD](docs/20-cicd/README.md), [production readiness](checklists/production-readiness.md) |
| 21 | What happens when it fails? | [Agent SRE](docs/22-production-operations/README.md) |
| 22 | When must a human approve? | [Human-in-the-loop](docs/23-human-in-the-loop/README.md) |
| 23 | How is compliance demonstrated? | [Compliance mapping](docs/24-compliance/README.md), [control evidence](governance/controls/README.md) |
| 24 | Who can disable it? | [Operating model](docs/01-governance-model/README.md), [incident operations](docs/22-production-operations/README.md) |
| 25 | How is it retired? | [Inventory lifecycle](docs/25-ai-inventory/README.md) |

## Adoption roadmap

These are **enterprise implementation milestones**, not claims that this repository deploys controls.

| Phase | Adopt | Exit evidence |
| --- | --- | --- |
| 1 · Foundation | Principles, terminology, personas, RACI, master architecture, topology | Named accountable owners; approved topology and inventory |
| 2 · Security | Identity, network, data, agent/tool/MCP security, guardrails, SOC | Threat model, denied-access tests, approved baseline |
| 3 · Operations | Evaluation, observability, CI/CD, SRE, incident response | Passed production-readiness and rollback/response exercises |
| 4 · Scale | Governed gateway/MCP, sharing, skills, quotas, FinOps | Measured tenant isolation, attribution, capacity controls |
| 5 · Enterprise governance | Compliance, fleet controls, continuous evaluation, remediation | Auditable coverage, maturity assessment, tested automation |

The bootstrap supplies guidance for all phases. Deployment automation, continuous policy enforcement, fleet dashboards, and verified workload-specific configurations remain adoption work—not shipped capabilities.

## Maintenance and contribution

Use [CONTRIBUTING.md](CONTRIBUTING.md) for review cadence, source/status checks, evidence requirements, and documentation validation. Do not submit real prompts, customer datasets, credentials, or production logs. This repository is licensed under [MIT](LICENSE); linked third-party documentation retains its own terms.
