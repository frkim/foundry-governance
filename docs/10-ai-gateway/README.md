# AI Gateway governance

Last reviewed: **2026-09-16**.
Scope: enterprise model, tool/MCP, and agent-facing gateway architecture and operations.
Experience: **Foundry resource/project (new)** unless explicitly stated; distinguish traditional APIM from the dedicated AI Gateway tier.
Capability status: feature-specific; use the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) source registers.
Recommendation: centralize supported traffic controls while retaining application and backend authorization.
Limitations: tier, API, region, transport, identity, policy, and integration coverage are not interchangeable.
Exceptions: [exception request](../../templates/exception-request.md); metadata applies to all recommendations unless overridden.

## Microsoft capability

“AI Gateway” can refer to different products/integrations. Select explicitly:

| Offering / capability | Documented position at review | Enterprise implication |
| --- | --- | --- |
| Traditional Azure API Management AI gateway capabilities | Existing APIM gateway with feature/tier-specific model and MCP policies | Validate individual policies, tier, API/streaming compatibility, and network support; do not assume every capability is GA |
| Foundry integration with an existing APIM gateway | **Preview** integration; documented existing gateway association uses eligible v2 tiers, same tenant/subscription | One associated gateway per Foundry resource, shared by its projects; separate Foundry resource when a different association is required |
| Foundry automatic MCP tool-governance routing | **Preview**; newly added portal MCP tools only, with documented exclusions | Existing/code-first/managed-OAuth MCP, OpenAPI, and native tools are not automatically covered |
| Dedicated **AI Gateway tier** | **Public Preview**; documented availability East US 2 and Sweden Central; best-effort service with **no SLA** | Distinct adoption decision; do not assume traditional APIM policy, networking, or isolation parity |
| Dedicated tier key-based asset access | API key currently grants access to **all published models/tools** | A key is not per-model/per-tool authorization; unsuitable as the sole isolation control for mixed trust consumers |
| Unified model API | **Preview**; translates supported Chat Completions requests/providers | Not compatibility with every provider API, Responses API, tool behavior, or streaming extension |

Recheck the source register and live offering before provisioning; Preview limits and regional availability can change. Foundry association does not prove that every agent/model/tool request traverses the gateway.

## Enterprise recommendation

Use a gateway as a policy enforcement and attribution point for traffic it actually receives. Keep ownership of model approval, agent orchestration, tenant/data authorization, transaction approval, and business outcome with application/component owners.

Prefer an established, supported APIM architecture for enterprise workloads whose required policies, private routes, operations, and SLA fit that tier. Pilot the dedicated Preview tier only with explicit risk approval, nonsensitive or approved data, bounded credentials/spend, limited consumers, and a documented exit route. Do not accept a no-SLA dependency where the workload requires an unavailable contractual guarantee.

Separate gateways or equivalent proven boundaries when consumers cannot safely share authentication reach, administration, networking, data handling, or operational blast radius. A shared catalog and a shared key are not an enterprise tenancy design.

### Native gateway versus application responsibilities

“Native” means available in a **verified gateway/tier configuration**, not universally enabled.

| Control | Gateway-native role where supported | Application / agent / backend responsibility |
| --- | --- | --- |
| Caller authentication | Validate Entra JWT or configured key; enforce issuer/audience/client claims | Establish end-user session and purpose; preserve verified tenant/user context |
| Per-consumer/model/tool authorization | Explicit API/route/policy checks in supported APIM configurations | Object/document/business-action authorization; compensate for dedicated-tier key granularity gap |
| Backend authentication | Managed identity or approved secret to model/tool backend | Narrow backend grants; distinguish gateway principal from delegated user |
| Routing and provider abstraction | Approved backends, load balancing, supported request transformation | Model/version/deployment approval, API compatibility, grounding/safety equivalence, processing geography |
| TPM/RPM and quotas | Supported request/token policies and counters | Cross-gateway/global budgets, currency attribution, concurrency/run limits, soft/hard-stop logic |
| Caching | Supported response/semantic caching configuration | Tenant/authorization-aware keys, sensitive-data exclusions, invalidation and correctness |
| MCP transport | Supported remote proxy/exposure and policy points | Per-tool schema/authorization, OAuth flow completeness, session and write semantics |
| Content handling | Compatible checks/filters where configured | Coverage for unsupported APIs/streams; output disclosure checks; prompt/tool safety and approval |
| Telemetry | Request/backend/usage metadata emitted for traversing traffic | End-to-end trace, agent/tool/approval identity, redaction, outcome/SLO/quality and cost joins |
| Resilience | Supported timeouts, retry, backends, circuit breakers | Idempotency, uncertain-write reconciliation, fallback quality/residency, agent state/session recovery |
| Agent operations | Rate/route admission and emergency traffic block | Planning, memory, delegation limits, execution cancellation, business compensation and retirement |

## Proposed enterprise policy

- **GOV-01 / GOV-05:** gateway APIs, backends, published models/tools, policies, consumers, and owners must be inventoried and versioned.
- **GOV-02 / GOV-03:** no shared broad key as the sole authorization boundary between incompatible consumers; restrict direct backend access.
- **GOV-04 / GOV-06:** enforce approved data destinations and identity-based route/tool access; do not allow model-selected arbitrary backends.
- **GOV-06:** high-impact tool approval remains enforced at execution even when requests pass gateway authentication.
- **GOV-08 / GOV-09:** attribute usage to trusted consumer/workload dimensions and impose layered request/token/concurrency/spend controls.
- **GOV-10 / GOV-11:** deploy policies/backends through review; exercise bypass denial, fallback, rollback, regional failure, and emergency route disablement.
- **GOV-12:** Preview offerings/integrations require capability-specific approval and expiry; an unsupported required control blocks that route.

These are proposed enterprise policies. Gateway association, a successful API call, or an Azure budget alert is not proof of enforcement.

## Implementation

### 1. Register the selected product and topology

Record APIM resource/tier/generation, region, networking mode, API/policy versions, Foundry association, backend/model deployments, MCP endpoints, consumer identities, owners, data classes, and SLO. Separate ingress privacy from outbound VNet backend routing; check Standard v2/Premium v2 and the dedicated Preview tier independently.

For Foundry's existing-APIM association, verify tenant/subscription eligibility and one-gateway-per-resource sharing before choosing project topology. Projects sharing the associated gateway still need separate consumer authorization and attribution.

### 2. Establish identity and prevent bypass

1. Select caller authentication and validate issuer, audience, tenant, client claims, and required roles/scopes where supported.
2. Resolve the allowed API/model/tool from a server-controlled consumer policy; never trust a caller-supplied cost-center or entitlement header without verification.
3. Authenticate gateway-to-backend separately, preferably using a narrowly granted supported managed identity. User OAuth delegation is a separate design.
4. Remove unnecessary direct backend keys/grants and restrict network routes where supported. Test direct calls with both normal and compromised caller credentials.
5. For the dedicated Preview tier, document the all-published-assets API-key boundary. If per-asset authorization is required, use a different supported architecture or independently proven enforcement; do not describe key issuance as granular access control.

### 3. Configure layered traffic and cost controls

| Layer | Implementation intent | Important limit |
| --- | --- | --- |
| Request rate | `rate-limit-by-key` with a trusted consumer key in supported APIM | Distributed request counts are approximate; not a precise global transaction counter |
| Token rate / quota | `llm-token-limit` per-key TPM and fixed token quota where supported | Token counts/estimates and request concurrency can overshoot; streaming accounting needs verification |
| Regional gateway accounting | Document policy counter scope and deployment geography | Counters can be independent per gateway region; do not sum them into an assumed global hard cap |
| Backend/service capacity | Allocate model TPM/RPM/deployment quota and backpressure | Service quota differs from business-user allocation and may be shared across workloads |
| Agent/workflow budget | Application limits on runs, tool hops, concurrency, retries, and estimated spend | Gateway token policy does not include all tool, search, compute, or third-party charges |
| Financial oversight | FinOps attribution, forecast, budget alerts, and separately implemented admission/stop logic | Azure budget alerts and token quotas are not exact currency hard stops |

Set alert and containment thresholds with workload/FinOps owners. Retain headroom for counting lag and in-flight requests. A genuine enterprise spend stop needs cross-route accounting, conservative reservations, reconciliation, and explicit fail-open/fail-closed behavior; even then document unavoidable in-flight exposure.

### 4. Govern routing, caching, and fallback

- Allow only approved model/provider/deployment versions and geographies; make fallback lists explicit and deny unapproved destinations.
- Verify request/response schemas, tool calling, safety behavior, token accounting, latency, and stream handling for each route.
- Treat the Preview unified model API as a supported Chat Completions translation surface, not full provider/API equivalence.
- Cache only approved data; isolate by verified tenant/user authorization and model/policy version. Do not cache sensitive responses or action-bearing outputs without an explicit design.
- Evaluate regional/load-balanced backends for capacity, authorization, safety, quality, residency, and telemetry consistency before enabling them.
- Circuit breakers and retry policies do not guarantee same-request recovery. Never blindly retry tool writes or assume MCP sessions/agent state survive backend failover.

### 5. Prove MCP and agent coverage

Foundry's Preview automatic routing applies only to the documented new portal MCP path and excludes managed OAuth. Existing tools, code-first additions, OpenAPI, and native tools require separate verification/design.

For **each** agent/tool integration, inspect the configured endpoint, confirm the APIM URL, find a correlated gateway/backend event, and attempt a denied direct route. Mark uncovered paths explicitly rather than counting a resource-level gateway association as coverage.

Traditional MCP support is remote Streamable HTTP/SSE, not `stdio`, and excludes Consumption/workspaces. Use tools-only until conflicting external-resource support is resolved for the selected combination. Validate idle/session/concurrency/payload limits and behavior across intermediary timeouts.

Response-body inspection and payload logging can buffer or break streams and expose sensitive content. Default to redacted metadata. If full inspection is required, prove safe streaming support or use an approved nonstreaming/application-mediated route.

### 6. Operate the gateway as a shared production service

Assign platform on-call for gateway availability/configuration and component owners for backend/model/tool behavior. Define consumer onboarding, certificate/key rotation, capacity requests, policy change review, SLO/error budgets, and deprecation notifications.

Measure admission denials, authentication failures, latency, backend errors, quota denials, token usage, routing/fallback changes, streaming disconnects, and telemetry completeness. Correlate to agent/tool/action IDs without logging credentials or unrestricted prompts.

Exercise per-consumer/model/tool disablement, direct-backend denial, policy rollback, capacity exhaustion, private DNS failure, and region loss. For writes, reconcile business state before resuming. Dedicated Preview tier operations must account for its no-SLA/best-effort support position.

## Evidence

Keep offering/tier/status review, architecture and identity diagrams, approved consumer/backend catalog, actual policy exports and versions, network configuration, Foundry association constraints, and exception/Preview sign-off.

Collect positive and negative authorization, bypass denial, token/request overshoot observations, trusted attribution, stream behavior, fallback compatibility/geography, approval enforcement, and incident/rollback exercises. Attach [architecture review](../../checklists/architecture-review.md), [production readiness](../../checklists/production-readiness.md), and evidence for **GOV-01 through GOV-12** as applicable.

## Sources

- [APIM AI gateway capabilities](https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities).
- [AI Gateway tier overview](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview) and [asset governance](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-govern-secure-assets).
- [Unified model API](https://learn.microsoft.com/en-us/azure/api-management/unified-model-api).
- [Enable Foundry APIM gateway integration](https://learn.microsoft.com/en-us/azure/foundry/configuration/enable-ai-api-management-gateway-portal) and [tool governance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance).
- [Token limit policy](https://learn.microsoft.com/en-us/azure/api-management/llm-token-limit-policy), [request rate policy](https://learn.microsoft.com/en-us/azure/api-management/rate-limit-by-key-policy), and [retry policy](https://learn.microsoft.com/en-us/azure/api-management/retry-policy).
- [Virtual network concepts](https://learn.microsoft.com/en-us/azure/api-management/virtual-network-concepts); feature status: [Foundry](../../references/microsoft-foundry.md), [Azure](../../references/azure.md).

## Limitations and unresolved decisions

Traditional APIM policy support is not assumed for the dedicated Preview tier. Its current all-published-assets key access and no-SLA position are material adoption constraints, not minor configuration omissions.

Gateway counters are not guaranteed global currency caps; inference geography is not determined only by gateway region. Gateway logs cover traversing traffic, not all agent actions. Registration/routing cannot replace object authorization, human approval, safe write semantics, or complete agent lifecycle governance.
