# Diagram legend and reuse

- **Last reviewed:** 2026-09-16
- **Scope:** logical enterprise patterns.
- **Experience:** Foundry resource/project (new), unless stated.
- **Capability status:** feature-specific; Preview/GA only when confirmed in sources; otherwise verification required.
- **Recommendation:** proposed enterprise baseline.
- **Limitations:** diagrams are not network or availability guarantees.
- **Exceptions:** [exception request](../../templates/exception-request.md).

Metadata applies to every recommendation below unless explicitly overridden.

## Legend

| Notation | Meaning | Not a guarantee of |
| --- | --- | --- |
| Rectangle | Logical component, control, or accountable function | A particular Azure resource type or deployable unit |
| Subgraph | Declared trust or ownership boundary | Private networking, tenant isolation, residency, or authorization |
| Solid arrow | Intended request, response, or data path; read its label | Actual routing, supported protocols, or complete interception |
| Dotted arrow | Governance, evidence, alerting, or administrative relationship | An automatic blocking control |
| Diamond | Decision or approval that must resolve before proceeding | A platform-provided workflow |
| Two regional subgraphs | Desired regional separation | Replication, failover, spare capacity, or availability |

Labels such as **application authorization**, **tool policy**, and **budget gate** name required responsibilities.
The implementation may be application code, a configured policy, or a manual approval; verify which one enforces the requirement.
“AI Gateway” denotes traditional APIM policy enforcement here, not the separate Preview dedicated tier or universal Foundry runtime interception.
An evidence store receives minimized records, not unrestricted prompts, credentials, or sensitive tool outputs.
Connections are directional and illustrative; reverse responses, DNS, authentication endpoints, and supporting control-plane dependencies are usually omitted.

## Canonical Mermaid diagrams

The [16 reference architectures](../reference-architectures/README.md) are the canonical diagram source.
The [14 decision trees](../decision-trees/README.md) describe selection outcomes.
Link to their headings rather than maintaining duplicate Mermaid files here.

Useful entry points:

- [Agent + MCP](../reference-architectures/README.md#6-agent--mcp): tool authorization across an untrusted-content boundary.
- [Agent + AI Gateway](../reference-architectures/README.md#7-agent--ai-gateway): explicit governed routing, not transparent interception.
- [Highly regulated](../reference-architectures/README.md#12-highly-regulated): separation requirements beyond project boundaries.
- [Production SOC](../reference-architectures/README.md#14-production-soc): evidence, response ownership, and an enforceable disable path.
- [Full enterprise AI platform](../reference-architectures/README.md#16-full-enterprise-ai-platform): central standards with bounded workload ownership.

## Reuse checklist

1. Link the source pattern and date; name any changed assumptions.
2. Add accountable owners, identity actors, classification, permitted data locations, and prohibited transfers.
3. Distinguish user authorization from workload authentication and management-plane roles.
4. Identify the actual route that applies gateway policy. Verify managed runtime and tool paths separately.
5. Turn every implied boundary into a control with a negative test and retained evidence.
6. Add failure handling, cost limits, human approval, and rollback for the real workload.
7. Confirm accessibility: keep a text explanation beside every diagram.

See [Foundry references](../../references/microsoft-foundry.md), [Azure references](../../references/azure.md), and the [Microsoft Learn Foundry overview](https://learn.microsoft.com/en-us/azure/foundry/).
For the distinct gateway experiences, consult [Foundry tool governance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance) and [dedicated AI Gateway overview](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview).
Current feature availability must be verified; diagram syntax and logical intent do not prove service compatibility.
