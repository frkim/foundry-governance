# MCP governance

Last reviewed: **2026-09-16**.
Scope: enterprise Model Context Protocol servers, tool discovery, client sessions, authentication, and gateway routes.
Experience: **Foundry resource/project (new)** unless explicitly stated.
Capability status: feature-specific; use the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) source registers.
Recommendation: treat MCP as a protocol for accessing separately governed capabilities, not a trust or approval mechanism.
Limitations: client/server protocol versions, authentication modes, APIM tiers, and Foundry routing coverage differ.
Exceptions: [exception request](../../templates/exception-request.md); metadata applies to every recommendation unless overridden.

## Microsoft capability

Foundry supports MCP tool integration with feature-specific authentication options. Shared authentication can use keys, supported agent identity, or project managed identity; managed OAuth uses user context. Project users may be able to access stored shared keys, so a project connection is not automatically a secret boundary between all its users.

Traditional API Management can expose supported APIs as MCP tools or proxy supported remote MCP servers. Documented remote transports are **Streamable HTTP and SSE**, not local `stdio`; documented MCP tier support excludes **Consumption and workspaces**. Confirm the exact current tier and feature matrix.

Microsoft documents differ on aspects of external MCP resource support. Until the selected client/server/gateway combination is verified, the enterprise baseline is **approved tools only**: do not depend on resources, prompts, subscriptions, or other protocol capabilities merely because MCP defines them.

Foundry Toolboxes provide a managed, versioned shared MCP-compatible endpoint for built-in/custom tools. The named **core Toolboxes portal experience is GA** in the [feature-readiness table](https://learn.microsoft.com/en-us/azure/foundry/concepts/general-availability#feature-readiness-at-ga), not a blanket status for every tool/network/auth/protocol/client combination. Tool search and skills are explicitly **Preview** and need adoption review. Skills support prompt and hosted agents, but MCP-resource-based discovery is not proven by tools-only gateway support. Default promotion updates consumers without redeployment; inventory and regress **all affected consumers**, treating all consumers as affected until version-binding evidence proves otherwise, and retain rollback.

Foundry's APIM tool-governance integration is **Preview** with restricted automatic routing coverage. The dedicated AI Gateway tier is a separate **public Preview** offering with different limitations; see [AI Gateway](../10-ai-gateway/README.md).

## Enterprise recommendation

Register each server and each exposed operation. Trust follows verified owner, deployment provenance, endpoint, reviewed schema, identity/permission model, and observed behavior—not a server's name, discovery listing, or tool annotations.

Use private or enterprise-operated MCP servers for sensitive/high-impact workflows where feasible. External servers require provider/data-processing review and narrow disclosure/permissions; an approved external server must still authorize each user/tool action.

### Trust and discovery model

| Lifecycle stage | Required enterprise decision | Enforcement / evidence |
| --- | --- | --- |
| Candidate discovery | Who operates it, why needed, which data/actions? | Catalog entry marked unapproved; no production credentials or sensitive test data |
| Provenance verification | Trusted vendor/repository, domain ownership, build/version, security contact | Verified source/deployment evidence and service owner acceptance |
| Contract review | Tool names, descriptions, schemas, side effects, annotations, dependencies | Reviewed manifest; per-tool risk/approval; prohibited tools excluded |
| Permission approval | Application-only versus delegated identity; user/tenant/object limits | Recorded scopes/roles/consent and negative-access evidence |
| Publication | Approved endpoint, transport, version, tools, consumers, schema digest | Controlled registry and deployment; discovery constrained to approved subset |
| Runtime discovery | Does server-advertised contract match approval? | Compare normalized reviewed manifest/digest; deny/quarantine unexpected additions or changes |
| Reapproval / retirement | Changed owner, contract, scope, endpoint, dependency, or terms? | Consumer impact review, new approval, grant removal, deprecation evidence |

Hash the **reviewed manifest** with a documented canonical serialization: include tool names, descriptions, input/output schemas when supplied, and relevant annotations. Pin transport/protocol/server version and endpoint separately. A hash without reproducible canonicalization is not a useful drift check.

## Proposed enterprise policy

- **GOV-01 / GOV-05:** unregistered servers and dynamically discovered unapproved tools must not enter production execution.
- **GOV-03:** authorize the inbound caller and each tool operation independently of gateway-to-backend identity. Enforce delegated-user rights where the business action requires them.
- **GOV-04:** approve data categories, retention, destinations, and provider terms before sending context to an MCP server.
- **GOV-05 / GOV-06:** pin the approved contract/version where possible; deny or quarantine unreviewed schema, description, scope, or endpoint changes.
- **GOV-06:** apply the [tool risk/approval matrix](../08-tools/README.md) to each operation; annotations and user consent do not replace transaction approval.
- **GOV-08 / GOV-10:** prove actual routing and correlation for each client/runtime; changes to auth, transport, policy, or tools require regression evidence.
- **GOV-11 / GOV-12:** provide per-server/per-tool disable paths and expiring exceptions for unsupported controls or Preview dependencies.

These are proposed enterprise policies, not additional guarantees provided by the MCP protocol.

## Implementation

### 1. Register server and per-tool contracts

Use [MCP registration](../../templates/mcp-registration.md), linking [tool records](../../templates/tool-registration.md). Record owner/vendor, source/deployment provenance, endpoint/TLS domain, environment, transport/protocol version, server build/version, approved tool subset, manifest hash algorithm/canonicalization, and consumer list.

Include network destinations, data classification/retention/geography, inbound authentication, outbound backend identity, OAuth discovery/consent details if used, risk approvals, rate/concurrency/session limits, streaming behavior, SLO, operational contacts, and kill switches.

Register consumers that use external code/Responses API without a persisted agent resource. Identify their application version, workload identity, hosting/network owner, approved tool subset, and trace correlation; absence of an agent resource does not remove MCP trust or authorization requirements.

Do not publish secrets in registry metadata. Restrict who can change endpoints, OAuth client configuration, tool descriptions, or discovery responses; these are security-sensitive supply-chain changes.

### 2. Separate authentication hops

| Hop / mode | What it proves | What still needs enforcement |
| --- | --- | --- |
| User OAuth to MCP-enabled experience | User authentication/consent under configured issuer/client/scopes | Actual downstream user rights, tenant/object checks, consent expiry/revocation, and action approval |
| Caller JWT to APIM | Token accepted for configured issuer/audience and claims | Per-client/per-tool authorization; verified business context; deny unknown audiences/clients |
| APIM managed identity to backend | Gateway principal can authenticate to the downstream service | Backend scope restriction and inbound-user/action authorization; no automatic user delegation |
| Agent/project managed identity to MCP | Supported workload identity authenticated | Shared-principal blast radius, allowed tool subset, data/object rights, attribution |
| Stored API key/shared credential | Possession of a shared credential | Secret readership/rotation, separate consumer authorization, limited backend rights, user attribution |

Inbound Entra JWT validation and outbound managed-identity authentication are **separate configurations**. A JWT-validation policy alone does not implement a complete MCP OAuth authorization/discovery flow. Verify issuer/audience, authorized client claims, scopes/app roles, metadata discovery, redirect handling, consent, and token lifecycle for the actual client.

Never forward a caller token to an unrelated backend or reuse a gateway's broad identity as proof of user entitlement. Keep bearer tokens out of prompts, tool descriptions, logs, error bodies, and cross-server sessions.

### 3. Enforce per-tool authorization and approval

Restrict the tools visible to each client where supported, and independently deny unauthorized `tools/call` requests at execution. Hidden discovery entries are not authorization: an attacker can request a known name directly.

Preview tool search provides candidate selection, not permission to invoke. Pin immutable specific skill versions and reviewed schemas/digests; neither resource discovery nor a tool-search match grants the skill's transitive tool permissions.

Resolve permissions from authenticated principal, tenant, tool/version, target object, and validated arguments. Use separate backend identities or an authorization-enforcing service when a shared identity would expose too much.

For transactional/high-impact/admin tools, bind approval to the exact action and enforce it outside model-controlled input. Test a client bypassing the agent UI, a changed tool name/target, stale approval, and a direct backend call.

### 4. Verify route coverage

1. Identify whether the integration is newly added through the Foundry portal, existing, code-first, managed OAuth, or another tool type.
2. For the Preview Foundry governance integration, do not assume coverage of existing/code-first/managed-OAuth MCP, OpenAPI, or native tools.
3. Confirm the runtime's actual configured tool endpoint is the intended APIM URL and find the correlated request in gateway logs.
4. Deny direct backend bypass using supported network and authorization controls; prove denial with the same caller/runtime identity.
5. Record uncovered paths and their alternative enforcement point. If a required control has no verified enforcer, disable the affected tool.

The new dedicated AI Gateway tier currently has key-auth granularity limitations; a key can access all published models/tools. Do not use it as evidence of per-asset authorization without a separately proven control.

### 5. Design protocol and network limits

| Concern | Required design and acceptance check |
| --- | --- |
| Transport | Verify Streamable HTTP/SSE support end to end; local `stdio` needs a separately governed local runtime/adapter, not an assumed APIM route |
| Private connectivity | Check gateway ingress and backend egress independently, with DNS, TLS/certificate ownership, and approved external OAuth endpoints |
| Sessions | Bind session handling to authorized client/tenant; expire and revoke; prevent session IDs becoming transferable authorization |
| Streaming | Validate idle/read timeout, disconnect/reconnect, payload limits, client cancellation, and intermediary behavior |
| Inspection/logging | Prefer metadata; body inspection or payload logging can buffer/break streams and expose sensitive content |
| Quotas | Bound requests, tool calls, concurrency, sessions, output size, runtime duration, and downstream spend |
| Retries/failover | Do not replay uncertain writes or assume session continuity across servers/regions; require idempotency and outcome reconciliation |
| Protocol changes | Pin supported negotiation/version behavior; reject unsupported features and reapprove material changes |

If full streamed-body inspection is required but not safely supported, use a nonstreaming or application-mediated design with explicit limits, or reject that path. Do not claim complete inspection based only on an HTTP success log.

## Evidence

Retain server/tool registration, trusted deployment provenance, approved manifest and reproducible hash, auth/consent design, permission exports, network diagram, route URL proof, correlated gateway/backend events, and owner approvals.

Demonstrate hidden-tool direct-call denial, unauthorized tenant/object denial, schema-drift quarantine, token/consent revocation, approval replay prevention, stream interruption, uncertain-write reconciliation, direct-bypass denial, and per-tool/server kill switches. Attach to [security review](../../checklists/security-review.md) and **GOV-01, GOV-03, GOV-04, GOV-05, GOV-06, GOV-08, GOV-10, GOV-11, GOV-12**.

## Sources

- [Foundry MCP authentication](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication).
- [Foundry tool governance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance).
- [Toolbox overview](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview) and [feature readiness](https://learn.microsoft.com/en-us/azure/foundry/concepts/general-availability#feature-readiness-at-ga).
- [MCP servers in API Management](https://learn.microsoft.com/en-us/azure/api-management/mcp-server-overview).
- [Secure MCP servers in API Management](https://learn.microsoft.com/en-us/azure/api-management/secure-mcp-servers).
- [AI Gateway asset governance](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-govern-secure-assets).
- Status and conflicting-support notes: [Foundry](../../references/microsoft-foundry.md), [Azure](../../references/azure.md).

## Limitations and unresolved decisions

Tools-only is the conservative baseline pending verification of inconsistent resource-support descriptions. APIM transport support does not establish support for every MCP feature, client auth flow, tier, workspace, or streaming inspection policy.

Schema pinning detects reviewed-contract drift, not malicious server behavior or hidden data handling. OAuth consent is not business approval. Registration, gateway association, and HTTP telemetry do not prove all tool calls are intercepted, authorized per tool, or safely replayable.
