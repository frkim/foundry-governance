# Security references

Last reviewed: **2026-09-16**. Scope: agent, identity, data, tool/MCP, network, and operational security. Experience: all runtimes. Capability status: standards are not Azure release statuses; related product features require [Foundry](microsoft-foundry.md) / [Azure](azure.md) verification. Recommendation: use threat models and allow/deny tests, not product names as evidence. Limitations: mappings are starting points, not a certification. Exceptions: [request](../templates/exception-request.md).

## Microsoft capability references

| Source | Use in this framework | Implementation evidence |
| --- | --- | --- |
| [Azure RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview) | Least privilege and scope inheritance | Exported assignments, privileged-access review, denied cross-project data access |
| [Foundry RBAC](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry) | Management/data actions and current persona roles | Role definition and actual allowed operations in the target experience |
| [Managed identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) | Runtime-to-resource authentication | Correct token audience and minimal downstream rights |
| [Zero Trust](https://learn.microsoft.com/en-us/security/zero-trust/) | Explicit verification, least privilege, containment | User/agent/tool boundary decisions and compromise drill |
| [Foundry agent networking](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/networking-options) | Supported prompt/hosted networking choices | Runtime-specific DNS, ingress, egress and tool/data connectivity tests |
| [Foundry MCP authentication](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication) | Shared runtime versus delegated-user identity | Backend grants and user/tenant authorization; no assumption that a connection preserves the user |
| [Secure MCP in APIM](https://learn.microsoft.com/en-us/azure/api-management/secure-mcp-servers) | Governed remote-server ingress/backend authentication | OAuth metadata/interoperability, validated claims, per-tool denial and gateway bypass tests |
| [Prompt Shields](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection) | Defense signal for direct/indirect prompt attacks | Representative attack evaluation, false-positive handling, escalation and server-side authorization |
| [Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction) | Posture and supported threat signals | Enabled coverage, destination, alert runbook and incident exercise |
| [Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/overview) | Correlate identity/platform/application security events | Tested detection logic, SOC owner, retention and restricted access |

## External standards and threat references

| Source | Enterprise recommendation | Limitation |
| --- | --- | --- |
| [OWASP GenAI Security Project](https://genai.owasp.org/) | Threat-model injection, poisoning, disclosure, excessive agency, supply chain and resource exhaustion | A checklist is not proof of complete mitigation or an Azure capability |
| [MITRE ATLAS](https://atlas.mitre.org/) | Map adversary behavior to prevention/detection/response tests | Adapt tactics to the actual application, not every technique applies |
| [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) | Link AI risk governance to measurement and management | Voluntary framework; regulatory applicability is a separate decision |
| [MCP specification](https://modelcontextprotocol.io/specification/) | Pin and test negotiated protocol/authentication behavior | Read the selected version, not just the latest landing page; client/server/gateway support can differ |
| [MCP security best practices](https://modelcontextprotocol.io/specification/draft/basic/security_best_practices) | Audience-bound tokens, consent, redirect validation, confused-deputy defenses | Draft guidance can change; do not blindly forward a token to a different resource |

## Proposed policy and evidence

Adopt [GOV-03–GOV-06](../governance/controls/README.md) with layered preventive, detective, and corrective controls. An LLM, tool catalog, network allowlist, content filter, or gateway alone is not the authorization boundary.

For each threat record affected assets, entry point, trusted identity, data exposure, permitted actions, preventive control, detection signal, responder, containment/rollback, residual risk, and test evidence. Store synthetic attack cases and sanitized findings in the approved security evidence system.

Use [security review](../checklists/security-review.md), [agent security](../docs/07-agent-security/README.md), [MCP governance](../docs/09-mcp/README.md), and [SOC integration](../docs/14-security-monitoring/README.md). Review these sources after incidents and at least quarterly; review preview dependencies monthly.
