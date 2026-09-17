# Architecture

- **Last reviewed:** 2026-09-16
- **Scope:** logical enterprise patterns.
- **Experience:** Foundry resource/project (new), unless stated.
- **Capability status:** feature-specific; Preview/GA only when confirmed in sources; otherwise verification required.
- **Recommendation:** proposed enterprise baseline.
- **Limitations:** diagrams are not network or availability guarantees.
- **Exceptions:** [exception request](../templates/exception-request.md).

Metadata applies to every recommendation below unless explicitly overridden.

## Start with a decision, not a diagram

1. Record the business action, data classification, accountable owner, and maximum permitted autonomy.
2. Use the [decision trees](decision-trees/README.md) to choose hosting, isolation, routing, and governance.
3. Select a [reference architecture](reference-architectures/README.md), then document its boundaries and rejected alternatives.
4. Walk through an [example](../examples/single-agent/README.md) and replace its fictitious inventory with approved design records.
5. Verify current capability support and collect acceptance evidence before approving implementation.

These are **logical governance patterns**, not validated reference deployments.
They deliberately contain no Azure resource schemas, deployment scripts, SKU promises, or service-level guarantees.
Foundry projects organize work and access; a project boundary alone does not establish complete network, security, or regulatory isolation.
Creating another resource is also insufficient without verified identity, network, data, and operational controls.

## Current agent concepts

- The reviewed [Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview) identifies two persisted agent types: **prompt** and **hosted**.
- External code using the Responses API can be an **ephemeral agent** without an agent resource; inventory its application, code, identity, model/tool dependencies, and state nevertheless.
- A workflow is an orchestration pattern or experience-specific feature, not a third current top-level persisted agent type. [Foundry visual workflows (Preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow) are scheduled to retire on **2026-12-01**; do not select them for new designs. Evaluate Microsoft Agent Framework for new workflows.
- [Skills (Preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/skills) apply to both prompt and hosted agents; pin a specific immutable version and govern provenance, permissions, and evaluation with the consuming release.
- [Toolboxes](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview) provide managed, versioned shared MCP endpoints for built-in/custom tools; core Toolboxes are **GA in the named new portal experience** per the [readiness matrix](https://learn.microsoft.com/en-us/azure/foundry/concepts/general-availability#feature-readiness-at-ga). Verify each tool, network, protocol, and authorization path separately.
- [Agent optimizer (Limited Preview)](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-optimizer-overview) proposes supported instruction, tool-description, model-selection, and hosted-agent skill changes; verify eligibility. Re-evaluate and approve each candidate; do not grant it autonomous production publication.
- [Control Plane/Operate](https://learn.microsoft.com/en-us/azure/foundry/control-plane/overview) offers supported Preview fleet/integration features through the currently portal-only experience. Reconcile observed coverage with owned inventory; visibility is not complete discovery or proof of control enforcement.

## Architecture library

| Need | Starting point |
| --- | --- |
| One assistant or explicit orchestration | [Single agent](reference-architectures/README.md#1-single-agent-application), [multi-agent](reference-architectures/README.md#4-multi-agent) |
| Prompt-led or custom runtime agent | [Enterprise prompt agent](reference-architectures/README.md#2-enterprise-prompt-agent), [hosted agent](reference-architectures/README.md#3-hosted-agent) |
| Retrieval or approved tool calls | [RAG](reference-architectures/README.md#5-rag), [agent + MCP](reference-architectures/README.md#6-agent--mcp) |
| Explicit policy-controlled model access | [Agent + AI Gateway](reference-architectures/README.md#7-agent--ai-gateway), [enterprise AI Gateway](reference-architectures/README.md#8-enterprise-ai-gateway) |
| Reusable tool services | [Shared MCP platform](reference-architectures/README.md#9-shared-mcp-platform) |
| Organization model | [Centralized](reference-architectures/README.md#10-centralized-foundry), [federated](reference-architectures/README.md#11-federated-foundry) |
| Isolation and continuity | [Highly regulated](reference-architectures/README.md#12-highly-regulated), [multi-region](reference-architectures/README.md#13-multi-region) |
| Production operating model | [SOC](reference-architectures/README.md#14-production-soc), [FinOps](reference-architectures/README.md#15-production-finops) |
| Combined enterprise platform | [Full enterprise AI platform](reference-architectures/README.md#16-full-enterprise-ai-platform) |

## How to read and adapt

- Use the [diagram legend](diagrams/README.md); boxes indicate declared logical boundaries, not proven controls.
- Runtime arrows mean intended, explicitly configured paths. A gateway is not assumed to intercept every managed model or tool call.
- “AI Gateway” in these patterns means the traditional APIM policy layer unless stated otherwise; Foundry/APIM integration and the dedicated AI Gateway tier are distinct Preview capabilities with different constraints.
- Treat resource count, project count, central governance, and workload ownership as separate decisions.
- Default production to separate subscriptions and Foundry resources from nonproduction; use projects to organize workloads within approved environment scopes.
- For regulatory isolation, document why shared infrastructure is acceptable or why separate resources, identities, networks, keys, and operators are required.
- Keep Foundry experience and resource type explicit. Do not infer that every portal classic workflow is hub-only.
- Open the [repository chapter index](../README.md) for the companion governance domains and record the selected design in the [agent registration](../templates/agent-registration.md).

## Companion governance chapters

- Organization: [overview](../docs/00-overview/README.md), [governance model](../docs/01-governance-model/README.md), [resource topology](../docs/02-resource-topology/README.md).
- Trust boundaries: [identity](../docs/03-identity-access/README.md), [network security](../docs/04-network-security/README.md), [data governance](../docs/05-data-governance/README.md).
- Execution: [agent architecture](../docs/06-agent-architecture/README.md), [agent security](../docs/07-agent-security/README.md), [tools](../docs/08-tools/README.md), [MCP](../docs/09-mcp/README.md).
- Model access: [AI Gateway](../docs/10-ai-gateway/README.md), [model governance](../docs/11-model-governance/README.md), [guardrails](../docs/15-guardrails/README.md).
- Evidence: [quality/evaluation](../docs/12-quality-evaluation/README.md), [observability](../docs/13-observability/README.md), [security monitoring](../docs/14-security-monitoring/README.md).
- Reuse and spend: [skills](../docs/16-skills/README.md), [sharing](../docs/17-sharing/README.md), [consumption](../docs/18-consumption/README.md), [FinOps](../docs/19-finops/README.md).
- Delivery and response: [CI/CD](../docs/20-cicd/README.md), [change management](../docs/21-change-management/README.md), [production operations](../docs/22-production-operations/README.md), [human approval](../docs/23-human-in-the-loop/README.md).
- Accountability: [compliance](../docs/24-compliance/README.md), [AI inventory](../docs/25-ai-inventory/README.md), [maturity model](../docs/26-maturity-model/README.md).

## Source and verification gate

Consult [Foundry sources](../references/microsoft-foundry.md) and [Azure sources](../references/azure.md).
Primary starting points are the [Foundry overview](https://learn.microsoft.com/en-us/azure/foundry/) and [Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
Live Learn retrieval was unavailable; the source registers record primary-source review and remaining uncertainty.
Use the current [agent networking guide](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/networking-options) for both prompt and hosted agents rather than assuming hosted agents cannot use private networking.
Before deployment, record the checked date, experience, resource type, region, feature status, model, runtime, authentication flow, protocol, and policy support.
