# Overview, principles, and terminology

Last reviewed: **2026-09-16**. Scope: all enterprise AI workloads, including externally hosted agents using Foundry models or tools. Experience: Foundry resource/project unless explicitly hub-based or classic. Capability status: feature-specific in the [source register](../../references/microsoft-foundry.md); unverified capabilities require validation. Recommendation: proposed enterprise baseline. Limitations: a documentation framework does not enforce Azure controls. Exceptions: [time-bound exception request](../../templates/exception-request.md). This metadata applies to recommendations below unless overridden.

## Microsoft capability

Microsoft Foundry brings model, agent, tool, evaluation, and operational capabilities together, with Azure identity, network, and monitoring integrations. The portal experience, resource type, API version, and selected runtime determine which capabilities actually apply. A project is not proof of a separate network, quota, encryption, or legal boundary.

## Enterprise recommendation

Govern the **whole application and its dependencies**, not just its agent definition. A model response, retrieved document, tool description, memory item, or another agent's message is data—not authority to expand permissions.

| Principle | Practical consequence | Evidence |
| --- | --- | --- |
| Production software, not an experiment | Every production release has an owner, immutable manifest, tests, SLO, rollback, and retirement route | Approved release record |
| Least privilege and explicit trust | Separate deployer, user, agent, tool, and operator identities; authorize at the resource performing the action | Identity flow and denied-access tests |
| Risk-proportionate isolation | Separate incompatible data, legal, trust, and operational boundaries | Topology decision record |
| Quality is governance | Evaluate task correctness, groundedness, retrieval, tool use, safety, latency, and cost before publishing | Versioned evaluation report |
| Safe failure over uncontrolled agency | Bound tool loops, retries, tokens, time, and write scope; fail closed for missing authorization/approval | Exhaustion and approval-expiry tests |
| Privacy by design | Minimize input, memory, retrieval, and telemetry; log metadata by default | Data/retention inventory and redaction test |
| Shared components need contracts | Catalog, owner, immutable version, permissions, SLO, and charge model precede reuse | Tool/MCP/skill registration |
| Cost and reliability are design constraints | Allocate consumption, set enforceable admission limits, test quota exhaustion | Cost dashboard and overload test |
| Central standards, delegated delivery | Central platform supplies approved patterns; teams own application outcomes | RACI and exception register |
| Evidence over declarations | A policy statement does not demonstrate enforcement | Timestamped evidence mapped to controls |

## Terminology

| Term | Meaning in this framework |
| --- | --- |
| Foundry resource | Azure resource providing a parent scope for Foundry capabilities and projects; verify actual shared boundaries for the feature |
| Foundry project | Organization and authorization scope for application assets within the supported resource model; not necessarily independent infrastructure |
| Hub-based project | Different resource model used by some existing experiences/workloads; assess migration and feature compatibility explicitly |
| New / classic experience | Portal/API documentation context; **not** a one-to-one synonym for resource/project versus hub-based resource types |
| Agent | Application behavior combining instructions, models, state, orchestration, and possibly tools |
| Prompt agent | Primarily service-managed, instruction/configuration-driven agent; not the same concept as classic Prompt flow |
| Hosted agent | Custom agent code executed in a supported Foundry-managed hosting runtime; support and restrictions are feature-specific |
| Workflow agent / workflow | Orchestration across steps/agents, not a third current Agent Service type. The visual Foundry workflow feature is Preview and scheduled to retire on 2026-12-01; govern existing migrations and use approved framework-based orchestration for new work |
| External agent | Agent runtime operated outside Foundry; consuming Foundry does not transfer runtime ownership to Microsoft |
| Framework | SDK/library such as Microsoft Agent Framework, Semantic Kernel, LangGraph, or LangChain; not a hosting or compliance boundary |
| Tool | Callable capability with a contract and an independently enforced authorization policy |
| MCP | Model Context Protocol connecting clients to servers exposing tools and other context; not an authorization guarantee |
| Skill | Versioned reusable instructions, code, or assets; execution permissions remain explicit and separate |
| Toolbox | Foundry-managed collection exposed through a shared MCP-compatible endpoint; changing the promoted default can affect consumers without their redeployment |
| Tool search | Preview discovery mechanism for selecting relevant tools; discovery must not grant execution permission |
| Agent optimizer | Preview evaluation-driven generation of candidate instructions, skills, tool descriptions, or model selections; candidates must pass normal release gates |
| AI Gateway | Governed API layer, commonly Azure API Management, for supported model/tool/MCP traffic explicitly routed through it |
| Guardrail | Input/output/tool/data safeguard; never a replacement for server-side authorization |
| Model deployment | A configured serving endpoint with a model/version, deployment type, quota/capacity, and processing geography |
| RPM / TPM | Requests/tokens per minute; capacity or policy accounting windows, not a currency-denominated budget |
| PAYG / PTU | Usage-priced consumption / provisioned throughput capacity; economics and support depend on model and deployment |
| Approval | Decision by an authorized party over a defined artifact or exact action; not a generic “yes” in an untrusted conversation |
| Evidence | Access-controlled, versioned proof of a control's design and operation, with owner, date, scope, and retention |
| RAG | Retrieval-augmented generation: supplying retrieved material as model context; retrieval must enforce the caller's data permissions |
| RBAC / RACI | Role-based access control enforces technical permissions; Responsible, Accountable, Consulted, Informed assigns organizational duties. Neither substitutes for the other |
| SLI / SLO / SLA | Service-level indicator is a measurement; objective is its approved target/window; agreement is a contractual commitment. An internal SLO is not a Microsoft SLA |
| RTO / RPO | Recovery time objective bounds the targeted restoration time; recovery point objective bounds acceptable data loss measured in time. Both need workload-specific tests |
| SOC / FinOps | Security operations center handles security detection/response; FinOps is the cross-functional practice of managing technology cost and business value |

## Policy

The [control catalog](../../governance/controls/README.md) is the canonical proposed mandate. Adoption requires an accountable policy sponsor. Production requires explicit ownership, permitted identity/data/model/tool paths, evaluated quality thresholds, security/guardrails, telemetry, cost controls, and tested lifecycle operations.

Preview is a release status, not an exemption from controls. Evaluate preview dependencies in a bounded sandbox first. A production exception must establish support, data handling, isolation, operational fallback, expiry, and an accountable risk owner; if mandatory controls cannot be met, choose a different deployment.

Optimizer evaluations may execute tools and cause real side effects. Use test endpoints, synthetic data, bounded budgets, and separate credentials; do not permit an optimization job to authorize production writes. A toolbox default promotion is a dependency change for every affected consumer, not merely a catalog edit.

## Implementation: lifecycle gates

| Stage | Required decision or artifact | Accountable role |
| --- | --- | --- |
| Discover | Business outcome, risk class, inventory entry, success/cost hypothesis | Business owner |
| Design | Architecture, topology, data flow, identities, threat model | Workload owner |
| Build | Versioned code, prompts, tools, model and dependency contracts | Workload owner |
| Secure | Least privilege, network/data controls, abuse tests, baselines | Security owner for security approval |
| Evaluate | Representative datasets and risk-approved acceptance thresholds | Workload owner |
| Approve | Independent approvals and exceptions bound to release manifest | Release authority |
| Deploy | Immutable artifact, environment-specific config, canary and rollback | Workload owner |
| Observe | SLO, quality, safety, security, consumption and dependency signals | Operations owner |
| Optimize | Cost/quality tradeoffs verified by regression evaluation | Workload owner |
| Govern | Periodic evidence, access, model/tool status and exception review | AI governance owner |
| Retire | Revoke access/routes, stop spend, handle retention, archive evidence | Workload owner |

## Anti-patterns and replacements

| Avoid | Why it fails | Use instead |
| --- | --- | --- |
| One project for everything | Mixed owners, environments, privileges, and blast radius | [Risk-aligned topology](../02-resource-topology/README.md) |
| Every team creates an MCP server | Duplicate risk and support burden; inconsistent trust | [Catalog and sharing contracts](../17-sharing/README.md) |
| Agents directly invoke production APIs with broad credentials | Model output becomes uncontrolled authority | [Narrow tool facade and transaction authorization](../08-tools/README.md) |
| Tools or gateways without owners | No responder, policy custodian, or lifecycle accountability | [Named service owners](../01-governance-model/README.md) |
| Shared credentials / excessive permissions | No isolation or reliable attribution | [Scoped workload identities](../03-identity-access/README.md) |
| No evaluation before production | Model/prompt changes silently regress correctness | [Release quality gates](../12-quality-evaluation/README.md) |
| No token monitoring or cost attribution | Runaway loops and unallocated spend | [Consumption controls](../18-consumption/README.md) |
| Logging sensitive prompts; no trace retention policy | Telemetry becomes a data breach/retention liability | [Metadata-first observability](../13-observability/README.md) |
| Public MCP with no explicit authentication or tool authorization | Reachability mistaken for trust | [MCP trust boundaries](../09-mcp/README.md) |
| No versions or rollback | Cannot reproduce or recover a release | [Immutable release manifest](../20-cicd/README.md) |
| No human approval for high-impact actions | Irreversible harm before review | [Transaction-bound oversight](../23-human-in-the-loop/README.md) |
| Guardrails replace application security | Classifiers do not enforce user/data permissions | [Layered guardrail baseline](../15-guardrails/README.md) |
| Azure budget alert treated as a spend stop | Delayed billing signals do not block requests | [Admission and execution limits](../18-consumption/README.md) |
| Fallback to any available region/model | Outage response violates residency or quality approval | [Approved fallback graph](../11-model-governance/README.md) |
| Gateway drawn in front of every managed call without proof | Bypass paths remain invisible/uncontrolled | [Verified routing boundaries](../10-ai-gateway/README.md) |

## Evidence

Start with [agent registration](../../templates/agent-registration.md) and carry its asset/release identifiers into every review. Store actual approvals, trace samples, evaluation datasets, and incident records in an approved evidence system, not this public repository. Use the [maturity model](../26-maturity-model/README.md) to assess demonstrated controls, not the number of documents written.

## Sources and limitations

- [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/).
- [Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
- [Source verification and release-status register](../../references/microsoft-foundry.md).

This baseline deliberately retains external runtimes and classic/hub-based workloads in governance scope without assuming their configuration is interchangeable with newer features.
