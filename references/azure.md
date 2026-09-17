# Azure capability and implementation references

Last reviewed: **2026-09-16**. Scope: Azure services used by the framework. Experience: Azure Resource Manager plus the selected Foundry/API Management experience. Recommendation: verify the actual service tier, region, API version, identity, and protocol before approving a design. Exceptions: [time-bound approval](../templates/exception-request.md). Limitations: these are capability references, not deployed or tested configurations.

**Verification method:** selected public MicrosoftDocs source files were reviewed during bootstrap; direct Microsoft Learn page retrieval was unavailable in this environment. Documentation metadata dates are not GA dates. Where an explicit release status was not established, **Verification required** is intentional. Review linked live documentation and deployment behavior at adoption.

## AI Gateway: three different scopes

| Capability | Status at review | Source and scope | Limitations and enterprise recommendation |
| --- | --- | --- | --- |
| AI capabilities in established API Management tiers | Verification required per policy/tier | [AI gateway capabilities](https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities), source dated 2026-05-29 | Verify model API schema/provider and policy support. Do not equate the AI gateway pattern with a single new product tier |
| Foundry integration with API Management | **Preview** | [Integration overview](https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities#ai-gateway-in-microsoft-foundry-preview); [Foundry setup](https://learn.microsoft.com/en-us/azure/foundry/configuration/enable-ai-api-management-gateway-portal), setup source dated 2026-08-03 | Existing APIM integration requires documented same-tenant/subscription and v2-tier configuration. Associated gateway is shared by projects in the resource; do not assume a centrally owned APIM in another subscription can be attached through this workflow |
| Dedicated **AI Gateway tier** | **Public Preview** | [Overview](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview); [asset security](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-govern-secure-assets), sources dated 2026-07-23 | Source lists East US 2 and Sweden Central, best-effort availability, no SLA. Runtime API keys currently access all published models/tools within that gateway, without per-asset key scoping. Not a default for mutually untrusted enterprise consumers |
| Dedicated AI Gateway tier private networking | **Preview** | [Private networking](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-configure-private-networking), source dated 2026-07-23 | Separate inbound Private Link and outbound VNet integration requirements. Verify subnet delegation, region, DNS, dependencies, and tier-specific support; do not copy another APIM tier's topology blindly |
| Unified model API | **Preview** | [Unified model API](https://learn.microsoft.com/en-us/azure/api-management/unified-model-api), source dated 2026-05-29 | Documented translation uses OpenAI Chat Completions client format with supported backends. It is not universal API equivalence for Responses, Realtime, tools, or model behavior |
| Foundry MCP governance integration | **Preview** | [Tool governance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance), source dated 2026-08-19 | Automatic routing applies only to newly created eligible portal MCP tools, excluding managed OAuth. Existing tools, code-first MCP, OpenAPI, and native tool paths are not automatically covered |

### Gateway enforcement and operation

| Source | Capability / status | What the enterprise must verify |
| --- | --- | --- |
| [MCP server overview](https://learn.microsoft.com/en-us/azure/api-management/mcp-server-overview), source dated 2026-09-11 | Remote MCP tools and REST-to-MCP; release status **Verification required** for selected tier | Listed tiers exclude Consumption and workspaces. Remote Streamable HTTP/SSE is not local stdio |
| [Expose existing MCP server](https://learn.microsoft.com/en-us/azure/api-management/expose-existing-mcp-server), source dated 2026-04-28 | External MCP proxy | Source specifies MCP 2025-06-18 or later. Confirm negotiated protocol/client/server compatibility, sessions, streaming and authorization |
| [Export REST API as MCP](https://learn.microsoft.com/en-us/azure/api-management/export-rest-mcp-server) | Expose selected REST operations as tools | Treat exported operations as a new security surface; read-only discovery does not authorize invocation |
| [Secure MCP servers](https://learn.microsoft.com/en-us/azure/api-management/secure-mcp-servers), source dated 2026-09-11 | Inbound keys or OAuth/JWT; separately configured backend auth | A JWT validation policy is not by itself a complete MCP OAuth discovery/authorization implementation. Test metadata, audience, claims, consent, and token acquisition |
| [Validate Entra token](https://learn.microsoft.com/en-us/azure/api-management/validate-azure-ad-token-policy) | Tenant/client/audience/claim validation | Bind consumer entitlements to a validated principal. A valid tenant token alone does not authorize every API/tool |
| [Managed identity authentication](https://learn.microsoft.com/en-us/azure/api-management/authentication-managed-identity-policy) | Gateway-to-backend token acquisition | This is not inbound user authentication or delegated-user authorization. Restrict policy editors and token destinations |
| [Credential manager](https://learn.microsoft.com/en-us/azure/api-management/credentials-overview) | Managed backend OAuth credentials | Requirements include system-assigned identity and outbound HTTPS; self-hosted/sovereign/region exclusions differ from MCP proxy availability |
| [LLM token limits](https://learn.microsoft.com/en-us/azure/api-management/llm-token-limit-policy), source dated 2026-04-01 | Per-counter TPM and token quotas | Streaming estimates, in-flight concurrency overshoot, and independent gateway counters mean this is **not a global hard spend cap**. Verify estimator and supported response schema |
| [Request rate limit by key](https://learn.microsoft.com/en-us/azure/api-management/rate-limit-by-key-policy) | Windowed request throttling | Distributed counts are approximate; configure a trusted identity-derived key, not a caller-controlled header or IP-only tenant identity |
| [Backend pools](https://learn.microsoft.com/en-us/azure/api-management/backends) | Weighted/priority routing and circuit breaking | Validate tier support, replica-local decisions, session state, model/region approvals, and capacity. Routing is not guaranteed same-request recovery |
| [Retry](https://learn.microsoft.com/en-us/azure/api-management/retry-policy), [forward request](https://learn.microsoft.com/en-us/azure/api-management/forward-request-policy) | Explicit retry and buffering controls | Bound retries; handle partial streams and non-idempotent writes. Do not retry an uncertain transaction without deduplication/reconciliation |
| [Virtual network concepts](https://learn.microsoft.com/en-us/azure/api-management/virtual-network-concepts) | Tier-specific inbound/outbound networking | Private endpoints govern ingress, not backend reachability. Validate Standard v2/Premium v2 versus classic tier capabilities separately |

**Unresolved documentation conflict:** the September MCP overview describes tools-only support; the existing-server guide also describes resources support. Do not rely on external MCP resources until verified for the chosen deployment. Prompts are not an assumed supported gateway feature. Use **tools-only as the conservative baseline** and record a capability test for any extension.

**Streaming and telemetry:** response body inspection/buffering and payload logging can break MCP streaming and expose sensitive content. The import guidance calls for disabling global frontend-response payload capture; adopt metadata-only logging and test streaming at the gateway.

## Supporting Azure services

These established service references identify implementation options; **feature-specific status and applicability require verification**. None automatically enforces all `GOV-01`–`GOV-12` controls.

| Service / source | Enterprise use | Boundary and evidence |
| --- | --- | --- |
| [Landing zones](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/) | Management/subscription structure and platform ownership | Document actual policy inheritance and delegated administration |
| [RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview), [scope](https://learn.microsoft.com/en-us/azure/role-based-access-control/scope-overview) | Least-privilege management and data permissions | Parent grants inherit; project restrictions do not subtract broad grants |
| [Managed identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) | Secretless service identity where supported | Assign only the selected resource/data-plane rights; identity does not imply user delegation |
| [Workload identity federation](https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation) | CI/CD without long-lived deployment secrets | Constrain issuer, subject, audience, repository/environment and protected deployment approval |
| [PIM](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure) | Time-bound privileged human access | License, role eligibility, approval, emergency access and review evidence |
| [Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview) | Human/workload sign-in policy where supported | Human MFA policies do not automatically protect every noninteractive identity |
| [Private Link](https://learn.microsoft.com/en-us/azure/private-link/private-link-overview), [private DNS](https://learn.microsoft.com/en-us/azure/dns/private-dns-overview) | Private ingress/name resolution | Validate each dependency path, public access disablement and prohibited egress |
| [Azure Firewall](https://learn.microsoft.com/en-us/azure/firewall/overview) | Inspected, restricted egress | Network allowance is not application/data authorization |
| [Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview) | Managed residual secrets, keys and rotation | Avoid values in source/telemetry; restrict connection readers and runtime identity |
| [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-security-overview) | RAG retrieval | Enforce tenant/user document access in retrieval and downstream content access |
| [Microsoft Purview](https://learn.microsoft.com/en-us/purview/) | Classification, catalog and lineage support | Integration coverage is workload-specific; classification is not runtime authorization |
| [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/overview), [Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) | Traces, SLIs, alerts and dependency diagnostics | Redact before export; segment access and set retention |
| [Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/overview), [Defender for Cloud](https://learn.microsoft.com/en-us/azure/defender-for-cloud/defender-for-cloud-introduction) | SOC analytics, posture and incident correlation | Configure ingestion/detections and test incidents; do not claim every agent action is automatically collected |
| [Azure budgets](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets) | Forecasting and cost alerts | Billing latency and alerts do not prevent more spend; enforce application/gateway admission limits separately |
| [Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/) | Reliability, security, cost, operations, performance review | Adapt to probabilistic quality, external tools, approval workflows and AI-specific failure modes |

## Evidence and refresh

Record selected SKU/tier, region, API/SDK version, actual identity grants, routing proof, denied-path tests, streaming/overload behavior, and source review date in the workload's architecture and release evidence. Platform owns monthly preview/status review; a change to the route, gateway tier, network topology, or authentication is a [governed change](../docs/21-change-management/README.md).
