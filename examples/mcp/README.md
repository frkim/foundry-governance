# Worked design: governed MCP inventory lookup

- **Last reviewed:** 2026-09-16
- **Scope:** logical enterprise patterns.
- **Experience:** Foundry resource/project (new), unless stated.
- **Capability status:** feature-specific; Preview/GA only when confirmed in sources; otherwise verification required.
- **Recommendation:** proposed enterprise baseline.
- **Limitations:** diagrams are not network or availability guarantees.
- **Exceptions:** [exception request](../../templates/exception-request.md).

Metadata applies throughout. This is a **worked design**, not deployable IaC or a tested implementation.
Inventory values and thresholds are fictitious design inputs; no personal data, live endpoint, or credentials are included.
Field names are planning labels, not Azure resource or API schema fields.

## Scenario and inventory

Two support products need read-only lookup of synthetic equipment catalog entries through an approved MCP server.
They may reuse the service but must not read each other's restricted catalog segment.

| Planning field | Fictitious value |
| --- | --- |
| Workload / service owner | `design-mcp-01` / Tool Platform Team |
| Environment / classification | Integration design / Internal synthetic catalog |
| Foundry scopes | Separate product projects; shared resource subject to isolation review |
| Server / tool contract labels | `design-catalog-mcp` / `lookup-equipment-v1` |
| Caller identity labels | `design-support-a`, `design-support-b` |
| Entitlement scopes | `segment-a-read`, `segment-b-read` |
| Transport / authentication | Pending verification for selected runtime and MCP implementation |

## Concrete decisions

- Share the MCP service only after tenant-aware authorization, cache separation, quotas, and independent revocation are demonstrated.
- A managed Toolbox is an alternative endpoint implementation, not assumed here; core GA applies to the named new portal experience only. Pin its version and review each tool's schema, network/protocol support, provenance, permissions, and untrusted outputs before substitution.
- Inventory/regress all consumers before a Toolbox default promotion and prepare shared-version rollback; Preview tool search returns candidates, not authorization to invoke them.
- Expose one versioned read-only operation with bounded result size; exclude arbitrary queries, shell commands, and catalog updates.
- Begin with an approved direct MCP route; use gateway mediation only if the runtime, transport, identity flow, and gateway support are verified.
- The reviewed Preview Foundry/APIM integration routes only newly portal-created MCP tools without managed OAuth; existing, code-first, managed-OAuth, OpenAPI, and native tools are outside that integration's routing scope.
- A dedicated project does not prove tool-service isolation; the shared server must enforce each consumer's boundary.

## Identity flow and controls

1. Each application authenticates its user and checks the permitted catalog segment.
2. The selected runtime establishes the supported MCP authentication flow; document whether it uses delegated or workload identity.
3. The server independently resolves entitlements from validated identity or trusted authorization context, never from a model-provided segment value.
4. The downstream catalog API enforces access; the response validator bounds fields, size, and identifiers.
5. Treat tool descriptions and results as untrusted content; a changed tool contract requires review and consumer compatibility checks.

## Acceptance evidence to collect

| Check | Proposed pass condition | Owner / evidence |
| --- | --- | --- |
| Cross-consumer access | Support A cannot obtain segment B records or cached results | Tool owner / negative tests |
| Compatibility | Required transport, authentication, and failure behavior work end to end | Runtime owner / supported-route trace |
| Revocation | A revoked caller cannot start a new tool operation | Operations owner / revocation drill |
| Output safety | Oversized results are rejected and injected instructions cannot grant access | App owner / adversarial cases |

## Rollback and kill switch

Disable the affected caller connection and deny it at the MCP server; preserve unrelated consumers where safe.
Remove or quarantine a compromised tool version from the approved catalog and inspect active sessions.
Restore a reviewed compatible version only after authorization and output-validation checks pass; do not fall back to an ungoverned direct business API.

## Cost / quality tradeoff and next steps

Shared hosting reduces duplicated operations but increases noisy-neighbor and change-management risks.
Limit responses to a proposed 20 records per request; evaluate whether smaller outputs cause incomplete answers before approving that limit.
Follow [agent + MCP architecture](../../architecture/reference-architectures/README.md#6-agent--mcp), [MCP sharing selection](../../architecture/decision-trees/README.md#8-shared-vs-private-mcp), and the [governance chapter index](../../README.md).
Companion chapters: [MCP](../../docs/09-mcp/README.md), [tools](../../docs/08-tools/README.md), [sharing](../../docs/17-sharing/README.md), [identity/access](../../docs/03-identity-access/README.md), and [change management](../../docs/21-change-management/README.md).
Verify feature-specific support through [Foundry sources](../../references/microsoft-foundry.md), [Azure sources](../../references/azure.md), and [Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
For that specific Preview integration, see [Foundry tool governance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance); do not apply its coverage to other MCP routes.
