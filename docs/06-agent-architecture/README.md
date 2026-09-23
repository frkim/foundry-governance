# 06 — Agent architecture

> Last reviewed: 2026-09-16.
> Scope: agent patterns, hosting, orchestration, and trust boundaries.
> Experience: Foundry resource/project (new experience), unless stated.
> Capability status: feature-specific; see sources; unverified availability requires validation.
> Recommendation: proposed enterprise baseline.
> Limitations: runtime, region, API, and preview restrictions differ by feature.
> Exceptions: time-bound approval via [exception request](../../templates/exception-request.md).

This metadata applies to every recommendation below unless explicitly overridden.

## Microsoft capability

Foundry provides managed agent capabilities and integrations for code-first agents.
Agent type, hosting location, orchestration pattern, and SDK are separate decisions.
The portal experience is also a separate attribute: **classic does not mean hub-only**.
Record the actual Azure resource and project type rather than inferring it from screenshots.
Projects are not universal isolation boundaries; verify the planning guide's feature-specific isolation matrix.
The networking guide covers **both prompt and hosted agents**; validate BYO/managed VNet options for the exact runtime.

| Dimension | Option | Governance interpretation |
|---|---|---|
| Agent type | Prompt agent | Instructions, model, and tools define behavior; verify selected tool availability |
| Agent type | Hosted agent | Customer code on managed hosting; verify the target offer and feature-level status in the source register |
| Orchestration experience | Workflow agent/workflow | Foundry visual/declarative workflows are preview; not a third persisted type in the current overview |
| Deployment boundary | External/custom agent | Runs outside managed Agent Service; discovery or registration does not transfer operational responsibility |
| Packaging | Containerized agent | Image is a deployable artifact, not a separate reasoning capability or trust guarantee |
| Composition | Multi-agent system | Multiple agents and handoffs; not inherently a dedicated service SKU |
| SDK/framework | Microsoft Agent Framework | Code-first agents and workflows; verify package, language, and hosting compatibility |
| SDK/framework | LangGraph | Explicit graph/state orchestration; validate checkpoint and adapter behavior |
| SDK/framework | GitHub Copilot SDK | Documented hosted authoring option; verify the SDK, hosting adapter, protocol and dependency versions |
| SDK/framework | LangChain | Model/tool abstractions and integrations; inspect transitive dependencies |
| SDK/framework | Semantic Kernel | Existing code-first orchestration/plugin integration; do not assume automatic migration parity |

The same framework can run in more than one hosting model.
A workflow implemented in Agent Framework is not automatically a Foundry workflow agent.
“Any framework” does not establish support for every package, language, or extension.
Treat external A2A/MCP connections as new trust boundaries, not local function calls.
The current overview identifies prompt and hosted persisted types; external Responses API code may be ephemeral.
Ephemeral agents still need application/runtime inventory, identities, versioned instructions, and operational ownership.
The [source register](../../references/microsoft-foundry.md) records visual workflow retirement scheduled for **2026-12-01**.
Do not add new production dependencies on that preview; migrate existing uses to tested supported orchestration.
For new workflow orchestration, follow Microsoft's direction to Microsoft Agent Framework and verify the chosen integration.

### Hosted execution boundaries

Hosted code can be supplied as a container or a source ZIP that is built into an image.
Pin the resulting image/build provenance; a ZIP upload does not remove software supply-chain duties.
The runtime's dedicated agent identity is distinct from the project managed identity used for infrastructure such as ACR.
Authorize and audit each identity separately; neither automatically preserves the original user's data entitlement.
The reviewed hosted guide describes per-session VM isolation, with `$HOME`/file content persisting while compute is idle.
Conversation history persists separately, and an application state store has its own lifecycle.
Idling compute is not deletion: inventory and govern retention, access, backup, and erasure for every state surface.
Document protocol compatibility separately from agent type: Responses, Invocations, and WebSocket require target validation.
The reviewed hosted guide explicitly labels A2A v1.0 GA and v0.3 Preview; do not generalize those labels to hosted features.

### Managed runtime, durable work, and developer choice

**Feature review: 2026-09-23.** See the [researched feature map](../../references/microsoft-foundry.md#september-2026-feature-review) for source-specific status and limitations.
Separate **agent logic/framework**, **managed execution**, **knowledge/memory**, **tools**, and **governance** in the design. Framework choice is not a waiver of runtime or supply-chain controls.
The **Foundry Toolkit for VS Code** consolidates project/resource work and agent authoring, testing and deployment in the IDE; some experiences remain Preview. Inspect extension permissions and use the same reviewed artifacts and release gates as portal/CLI deployment.
Current project SDK/Responses APIs distinguish agent version management from inference and conversations. Record endpoint type and migrate threads/runs to conversations/responses with state and authorization regression tests; project, resource-level OpenAI and Anthropic endpoints are not interchangeable.
Treat IDE development, local tests, hosted deployment, and publication to Teams/Microsoft 365 Copilot as separate stages, with separate identities and release evidence.
Voice channels add recording/transcript retention, consent, interruption handling, and escalation requirements; a voice integration's GA label does not establish support for every agent mode.

Long-running execution changes the workload from a single conversational request into a stateful process. The following are enterprise acceptance checks, not guarantees supplied by a hosted runtime:

The reviewed resilience APIs are **Preview**: crash recovery is opt-in, restarts the handler, and does not restore local variables. Application/framework checkpoints determine where work resumes. Stream-event replay is separate from execution checkpoints and requires the appropriate durable backing.

| Capability | Acceptance evidence |
| --- | --- |
| Checkpoint and crash recovery | Interrupt before/after a side effect; recover without duplicate transactions. Persist versioned state, idempotency keys and remaining budgets; reconcile ambiguous external outcomes |
| Reconnect and streaming | Resume from a recorded cursor without treating a disconnected client as task cancellation; test lost/duplicate events and authorization on reconnect |
| Human approval and steering | Authenticate/authorize each intervention; bind approval to exact arguments and release. Reject expired or changed approvals after recovery; steering does not grant new authority |
| Routines and event triggers | Register trigger owner, service principal, schedule/time zone or event source, deduplication key, concurrency/cost limits, and pause switch; test missed/duplicate events |
| Session and application state | Demonstrate tenant isolation, retention, deletion and state-schema migration independently of compute restart |

Do not equate checkpointing with exactly-once external actions. Use explicit compensation/manual reconciliation when an external tool's outcome is unknown.
Scheduled/event-driven work must not silently reuse an absent user's delegated authority. Route sensitive actions through [transaction-bound human review](../23-human-in-the-loop/README.md).
Apply one end-to-end deadline and remaining execution budget across restarts, child agents, retries, and waiting states, with an explicit approved policy for pauses.

## Enterprise recommendation

Start with a deterministic application or a single bounded agent.
Add autonomy only where measurable task success exceeds a simpler design.
Use the [architecture decision trees](../../architecture/decision-trees/README.md) before selecting a pattern.
Apply the [control catalog](../../governance/controls/README.md) and [baselines](../../governance/baselines/README.md).

| Requirement | Preferred starting pattern | Escalation criterion |
|---|---|---|
| Fixed business rules | Conventional workflow/function | Agent needed for ambiguous inputs |
| Grounded read-only assistance | Single prompt agent with approved retrieval | Custom state/control required |
| Explicit branching and durable approvals | Code-defined workflow | Prefer supported Agent Framework integration; avoid retiring visual workflow dependencies |
| Bespoke libraries or protocols | Hosted/custom code | Network, identity, runtime limits independently accepted |
| Strict runtime/network control | Enterprise-managed container runtime | Team accepts patching, scaling, recovery, and support |
| Specialist decomposition | Bounded multi-agent graph | Golden-set gain justifies latency, cost, and attack surface |
| Cross-organization delegation | Contracted external agent | Data, identity, legal, and operational approval complete |

Default autonomy is read-only; write actions require [human oversight](../23-human-in-the-loop/README.md).
Default orchestration has explicit end states, finite retries, and a global execution budget.
One accountable service owner covers the entire user journey, including delegated agents.

## Policy

1. Record an architecture decision before production or expansion of authority.
2. Identify every model, tool, MCP server, skill, data store, agent, and network destination.
3. Assign execution identity and authorization checks at each hop; never propagate ambient administrator rights.
4. Treat retrieved text, tool output, and peer-agent instructions as untrusted data.
5. Require explicit schemas, output validation, and data minimization across handoffs.
6. Prohibit unbounded recursion, agent spawning, tool loops, and unrestricted code execution.
7. Approve preview use explicitly with an exit path and support-risk acceptance.
8. Reassess architecture after framework/runtime upgrades or changes to state persistence.
9. Keep regional processing, retention, licensing, and residency approvals valid during fallback.
10. Fail safely when policy, identity, approval, or execution-budget state is unavailable.

## Implementation

### Architecture decision record

| Required field | Example decision |
|---|---|
| Business outcome | Draft a support resolution; never close the case automatically |
| Type / hosting / framework | Prompt / managed Foundry / SDK version recorded separately |
| State ownership | Tenant-scoped conversation store with explicit deletion schedule |
| Trust boundaries | Browser → application → agent → retrieval/tool → system of record |
| Authority | Read case and knowledge base; propose update through approval service |
| Data flow | Approved region; document model deployment processing geography |
| Limits | 8 tool calls, 12 model turns, 60-second interactive deadline |
| Recovery | Cancel new work, preserve audit record, offer manual case handling |
| Evidence | Evaluation run, threat model, cost estimate, approved dependency list |

These numerical limits are illustrative and must be tuned to workload risk.
Keep architecture diagrams free of credentials and raw personal data.
Represent data-plane and management-plane paths separately.

### Multi-agent contract

Each handoff includes correlation ID, caller identity, purpose, schema version, and deadline.
Carry only the minimal task context; redact personal data before crossing a new boundary.
The receiving agent independently authorizes tool use against the original user's entitlement.
Child agents inherit a **remaining** execution budget, not a fresh unlimited allowance.
Bound fan-out, graph depth, and total tokens across all branches.
Record which agent produced each output; never treat consensus as proof of correctness.
Cancellation propagates to children; irreversible actions use idempotency and compensation.
Test cycles, missing agents, partial completion, stale state, and malicious tool output.

### Hosting acceptance

For managed hosting, verify supported regions, protocols, networking, state retention, and identity.
Test isolation and deletion across session files, conversations, checkpoints, and external state rather than assuming shared semantics.
Do not draw a gateway-mediated call without configuring and testing that exact route, including bypass denial.
For containers, pin image digests and review image provenance, vulnerability posture, and patch ownership.
For external agents, require contractual telemetry, incident notification, deletion, and availability commitments.
Do not assume container isolation alone prevents data exfiltration or excessive tool authority.
Record capability checks with source URL, review date, API version, and a deployment test result.

## Evidence

Maintain the decision record, boundary diagram, dependency graph, and ownership matrix.
Attach denial tests for cross-tenant access, unauthorized delegation, and forbidden egress.
Retain bounded-loop, cancellation, timeout, replay, and recovery test results.
Attach comparative [quality evaluation](../12-quality-evaluation/README.md) for single versus multi-agent options.
Include per-path [consumption](../18-consumption/README.md) and [observability](../13-observability/README.md) evidence.
Update the [AI inventory](../25-ai-inventory/README.md) before publishing.
Complete [architecture review](../../checklists/architecture-review.md) and [security review](../../checklists/security-review.md).

## Sources and limitations

- [Foundry Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
- [Hosted agents](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents).
- [Foundry workflows — preview](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/workflow).
- [Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/).
- [LangGraph integration](https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/langchain-agents).
- [Hosted-agent migration guidance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/migrate-hosted-agent-preview).
- [Current migration/status comparison](https://learn.microsoft.com/en-us/azure/foundry/how-to/navigate-from-classic).
- [Prompt and hosted networking options](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/networking-options).
- [Resource/project planning and isolation](https://learn.microsoft.com/en-us/azure/foundry/concepts/planning).

Official Learn search and the repository's primary-source register support these distinctions; direct Learn retrieval was unavailable.
Workflow and hosted-agent lifecycle information is change-sensitive; verify current notices before committing a design.
No statement here asserts blanket GA, regional parity, SLA coverage, or automatic framework compatibility.
