# Network security

Last reviewed: **2026-09-16**.
Scope: enterprise client, runtime, model, tool/MCP, data, operations, and telemetry connectivity.
Experience: **Foundry resource/project (new)** unless explicitly stated.
Capability status: feature-specific; consult the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) source registers.
Recommendation: choose a risk-based connectivity model and prove every ingress/egress path.
Limitations: runtime, region, API version, dependency, and gateway tier determine available networking combinations.
Exceptions: [exception request](../../templates/exception-request.md); metadata applies to all recommendations unless overridden.

## Microsoft capability

Foundry agent networking documentation covers network isolation for **both prompt agents and hosted agents**, including bring-your-own and managed virtual-network options. The supported topology and prerequisites remain runtime/feature-specific. Do not assert that hosted agents categorically lack networking, or assume that every tool inherits the agent's private route.

Azure Private Link/private endpoints provide private connectivity for supported ingress endpoints. Outbound VNet connectivity, DNS resolution, firewall policy, and dependent-service routing are separate controls. A private Foundry endpoint does not make a public MCP server private.

API Management network capabilities depend on tier and generation. Traditional APIM, its v2 tiers, and the dedicated **AI Gateway tier (public Preview)** require separate support checks. Private ingress does not imply VNet egress to private backends; a public gateway hostname does not prove that its backend route is public.

Hosted network egress guardrails are a separate **Preview**, hosted-only control surface, not a replacement for VNet/firewall design. Their audit mode can still transform/rewrite traffic. Dynamic secret/identity header injection, service-tag/IP rules, MCP policies, and PII/DLP inspection described as future capabilities must not be counted as current protections.

## Enterprise recommendation

Select a connectivity model during [topology review](../02-resource-topology/README.md), based on data and business impact, not ease of portal setup. “Regulated” below is an enterprise design category, not an Azure SKU or certification.

| Model | Intended use | Ingress | Egress / dependencies | Acceptance condition |
| --- | --- | --- | --- | --- |
| Public, authenticated | Approved low-sensitivity experiments or intentionally internet-facing apps | Authenticated TLS endpoint; edge protections and restrictions where supported | Approved destinations, minimal credentials, no sensitive data by default | Security approves exposure and verifies identity/rate/abuse controls |
| Private | Internal production applications | Private client route and private endpoints for supported services; public access disabled where required | Explicit VNet/private routes to supported data and tools; approved exceptions listed | DNS and public-denial tests cover each endpoint |
| Restricted | Sensitive enterprise data or consequential actions | Private ingress, segmented operators/build agents, controlled administrative paths | Default-deny egress with owned allowlist; private dependencies; controlled proxy/firewall for approved external access | Exfiltration, direct-route bypass, and cross-boundary denial demonstrated |
| Regulated | Workloads with independently assessed legal/contractual restrictions | Dedicated required trust/administrative boundaries | Approved processing geography, network paths, telemetry/backup locations, keys, and recovery targets | Compliance maps obligations to actual controls; unsupported services excluded |

Private access is a baseline choice, not proof of trustworthy requests. Continue authentication, per-tool/data authorization, transaction approval, and content minimization inside the network.

## Proposed enterprise policy

- **GOV-02:** record all trust boundaries and the selected connectivity model; separate production from nonproduction network administration and credentials.
- **GOV-03 / GOV-04:** private connectivity never replaces caller identity or data-level authorization.
- **GOV-05 / GOV-06:** register model, tool, MCP, package, and artifact destinations before allowing runtime access. Unknown destinations are denied in restricted/regulated models.
- **GOV-06:** prevent direct model/tool routes from bypassing required gateway policy, approval, or monitoring.
- **GOV-08:** export network and gateway security telemetry to an approved, access-controlled location without indiscriminate prompt/body capture.
- **GOV-10 / GOV-11:** network changes and disaster-recovery paths need the same controls as primary paths; retain emergency isolation and verified recovery procedures.
- **GOV-12:** public exceptions, Preview combinations, and unsupported private paths need named risk approval, expiry, and compensating controls.

These are proposed enterprise policies, not a Microsoft requirement that every workload use private endpoints.

## Implementation

### 1. Build an end-to-end flow inventory

For every row record source subnet/runtime, identity, destination FQDN/resource, protocol/port, DNS authority, public/private route, permitted data, owner, and failure behavior.

| Flow | Questions to resolve | Verification |
| --- | --- | --- |
| User → application | Internet or corporate client? WAF/reverse proxy? Where does user authentication terminate? | Allowed client succeeds; untrusted client denied as designed |
| Application → Foundry agent/model | Does the selected endpoint support the private route and identity? | Runtime resolves expected endpoint and calls successfully; public attempt denied |
| Agent → gateway | Is this exact tool/model path actually routed through the gateway? | Correlated runtime trace and gateway receipt; direct bypass fails |
| Gateway → model/MCP/tool | Does this tier support private backend egress and required DNS? | Backend routing and auth tested from the actual gateway |
| Runtime → storage/search/state | Are all required service/subresource endpoints covered? | Allowed read/write succeeds; unapproved container/database access denied |
| Runtime → registry/package/hosting dependency | Are build-time and runtime downloads separate? | Approved artifact retrieval works without unrestricted internet access |
| Runtime/tool → external service | What data leaves the enterprise? Can a supplied URL change destination? | Destination controls, redirect handling, and denied exfiltration exercised |
| Service → telemetry/secrets/identity | Which service dependencies require exceptions? | Logs, token acquisition, secret access, and certificates work under restrictions |
| Operator/CI → management/data planes | Do self-hosted runners or operator networks need private connectivity? | Deployment, troubleshooting, and rollback work without reopening public ingress |
| Primary → recovery environment | Where do replicas, backups, state, and failover traffic travel? | Recovery keeps approved geography, isolation, and authorization |

Include asynchronous callbacks, tool webhooks, OAuth redirects, browser-based developer access, and background scheduled jobs. A network diagram omitting these paths cannot substantiate isolation.

For hosted deployments, map both container-image delivery and source ZIP-to-image build paths, including registry and build dependency access. For external-code Responses API/ephemeral patterns, the application's hosting environment owns network controls; it does not inherit hosted-agent isolation by calling Foundry. Validate Responses, Invocations, WebSocket, and A2A paths individually where used; protocol support is not gateway or private-network compatibility.

### 2. Select supported networking deliberately

1. Record actual Foundry resource/project types, agent runtime, region, deployment type, dependencies, and API versions.
2. Compare BYO VNet versus managed networking for the runtime. Assign ownership of subnets, delegated resources, private endpoints, DNS, firewall rules, and lifecycle cleanup.
3. Check required service endpoints/subresources independently, including storage, search, state databases, vaults, artifact registries, and telemetry.
4. Verify capacity, DNS links/forwarders, address-space overlap, peering/transit, route tables, and firewall integration before enabling public-access restrictions.
5. Provision through reviewed IaC and retain effective configuration exports. Use Azure Policy where an applicable alias/effect exists; application destination policy still needs runtime enforcement.
6. Select a different supported runtime/tool or reject the design if the required path cannot meet the boundary; do not silently fall back to public access.

Apply the documented feature-specific exceptions:

- Hosted use of a **private Azure Container Registry requires a project created after 2026-06-25**. Verify project creation date and the actual registry/identity path; do not assume an older project acquires support through a role change alone.
- The Foundry visual workflow experience supports private **inbound** connectivity, but **outbound VNet injection is unsupported**. It is also Preview with retirement scheduled for 2026-12-01; do not onboard new production dependencies.
- Documented public web/Bing/SharePoint tool paths remain **public**. A private Foundry endpoint does not privatize them; review data disclosure and egress, or disable the tool when the selected boundary prohibits that public path.

### 3. Restrict egress and prevent SSRF

- Allowlist approved hostnames/services and outbound ports; validate DNS behavior and permitted redirects. Avoid broad wildcard exceptions unless their blast radius is accepted.
- In application/tool URL handling, reject unauthorized schemes, loopback/link-local/private destinations, and metadata endpoints as appropriate to the approved purpose.
- Revalidate the resolved destination and each redirect to resist DNS rebinding and redirect-based bypass. A string-prefix URL check is insufficient.
- Keep authorization at the destination: a permitted host may serve multiple tenants, paths, storage objects, or APIs.
- Disable unnecessary arbitrary browsing, package installation, shell/network execution, and user-controlled callback URLs in sensitive workflows.
- Separate runtime from build networks; source/package retrieval should not justify permanent unrestricted agent egress.

SSRF prevention must respect explicitly approved private tools; “deny all private addresses” is not suitable for an internal-tool architecture. Use a server-side approved destination catalog rather than trusting model-selected URLs.

### 4. Validate MCP and streaming routes

Traditional APIM remote MCP support uses **Streamable HTTP and SSE**, not local `stdio`. Confirm the chosen APIM tier; documented MCP support excludes Consumption and workspaces. Check protocol negotiation, session IDs, reconnection, concurrency, idle/read timeouts, response size, and intermediary limits.

Private endpoints, gateways, firewalls, and reverse proxies can each interrupt long-lived streaming. Body inspection or payload logging can buffer or break streaming; test the real client/server/proxy chain and use metadata-only telemetry by default.

For managed OAuth tools, verify browser authorization/discovery endpoints and callback routes separately from tool data traffic. An inbound JWT-validation policy does not automatically implement OAuth discovery or delegated downstream token handling.

### 5. Test isolation and failure modes

| Scenario | Expected outcome | Responsible owner |
| --- | --- | --- |
| Public request to a private-only endpoint | Denied despite valid application credentials | Platform network owner |
| Agent calls unapproved internet host or redirect target | Denied and recorded without leaking payload | Workload/tool owner |
| Client directly invokes backend, skipping required gateway | Network and/or backend authorization denies bypass | Gateway and backend owners |
| Private DNS entry/route becomes unavailable | Alert and safe failure; no public fallback | Platform on-call |
| Stream is interrupted after a write request | Reconcile outcome; no blind replay | Tool/workload owner |
| Secondary region is enabled | Same destination, residency, identity, and gateway controls apply | Recovery owner |

These are implementation acceptance exercises, not tests shipped by this documentation repository.

## Evidence

Attach the approved flow inventory, topology, tier/runtime support references, endpoint/DNS/route/firewall exports, ownership, and exceptions to the [architecture](../../checklists/architecture-review.md) and [security](../../checklists/security-review.md) reviews.

Keep timestamped positive/negative connectivity results from the **actual runtime and gateway**, public-access-denial proof, streaming/failover behavior, direct-bypass checks, and measured emergency isolation time. Redact credentials and content. Map evidence to **GOV-02, GOV-03, GOV-04, GOV-05, GOV-06, GOV-08, GOV-10, GOV-11, GOV-12**.

## Sources

- [Agent networking options](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/networking-options).
- [Configure Foundry network isolation](https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link), including project-age, workflow, and public-tool limitations.
- [Hosted network egress controls](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-hosted-agent-guardrails#network-egress-controls-preview).
- [Azure Private Link overview](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview).
- [API Management virtual network concepts](https://learn.microsoft.com/en-us/azure/api-management/virtual-network-concepts).
- [MCP servers in API Management](https://learn.microsoft.com/en-us/azure/api-management/mcp-server-overview).
- [AI Gateway tier overview](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview).
- Current support and caveats: [Foundry](../../references/microsoft-foundry.md), [Azure](../../references/azure.md).

## Limitations and unresolved decisions

Support is a **combination**, not a checklist of independently available features. Private Foundry ingress, private APIM ingress, and private backend egress are not interchangeable. Hosted-agent network isolation is documented, but each selected dependency and region still needs verification.

A private route does not guarantee data residency, packet-level inspection, safe tool execution, or zero external service dependencies. Preview gateway networking is not assumed to have traditional APIM policy/tier parity. Unsupported isolation or unverifiable bypass prevention blocks the affected restricted/regulated path.
