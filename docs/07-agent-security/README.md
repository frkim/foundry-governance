# Agent security

Last reviewed: **2026-09-16**.
Scope: enterprise agents, orchestration, identities, tools, grounding, and business actions.
Experience: **Foundry resource/project (new)** unless explicitly stated.
Capability status: feature-specific; consult the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) source registers.
Recommendation: contain agent authority with deterministic controls outside the model.
Limitations: content safety, identity, gateway routing, and isolation do not independently establish end-to-end security.
Exceptions: [exception request](../../templates/exception-request.md); metadata applies to every recommendation unless overridden.

## Microsoft capability

Foundry and Azure offer combinations of model safety controls, agent runtimes, identities, networking, monitoring, and gateway integrations. Availability depends on the model, runtime, API, deployment type, and region. Some newer agent governance and guardrail features are Preview; require explicit adoption gates rather than labelling all agents GA or Preview.

Prompt Shields/content safety features can identify supported harmful or injection-related patterns. They do not provide application authorization or guarantee that every indirect instruction is detected. An agent can obey an apparently benign request and still perform an unauthorized business action.

Prompt and hosted agents have documented networking options. Hosted execution and application-hosted agents also require review of code, dependencies, process/container privileges, resource limits, and patch responsibilities; managed hosting does not remove workload security ownership.

Model guardrails are **GA** and agent guardrails **Preview** in the reviewed feature matrix. An explicit agent policy replaces rather than merges with the model policy; agent annotate-only, Spotlighting, and groundedness controls are unsupported. Hosted agents require explicit `rai_config` attachment, and invalid policy IDs can fail open despite active status. Verify policy existence/validity and actual expected blocking before release; see [guardrails](../15-guardrails/README.md).

## Enterprise recommendation

Treat an agent as a partially untrusted decision-making component with access to approved capabilities, not as an authorization authority. Keep policy decisions, sensitive data access, tool execution, approval records, and kill switches outside model-generated text.

Threat-model the full chain: caller → application → agent/model → orchestration/memory → gateway → tool/MCP → business data. Include human approvers, CI/CD, model/tool versions, shared components, telemetry, and operators.

### Threat-to-control matrix

Control suggestions below are enterprise recommendations. The “detective” column identifies telemetry to implement, not events guaranteed to be emitted natively.

| Threat / failure | Preventive control | Detective signal | Corrective action / owner |
| --- | --- | --- | --- |
| Direct prompt injection / policy bypass | Trusted instruction boundary; input checks; independent tool authorization | Safety decisions, denied tool arguments, repeated bypass attempts | Restrict session/tool access; security and workload owners review |
| Indirect injection in documents/web/tool results | Provenance, untrusted-content handling, destination restrictions, least privilege | Unexpected instructions linked to source/tool and subsequent proposed action | Quarantine source/version, invalidate affected caches; data/tool owner |
| Sensitive-data exfiltration | Pre-retrieval ACLs, field minimization, egress and destination authorization | Unusual sensitive retrieval followed by export/tool call | Disable export route/grant; SOC and data owner assess disclosure |
| Cross-tenant data or memory exposure | Verified tenant context, namespace isolation, authorization-aware caches | Tenant mismatch, denied object access, cross-tenant retrieval canaries | Isolate affected workload, invalidate memory/cache; workload owner |
| Excessive agency / unauthorized write | Explicit action contract, bounded authority, transaction-bound human approval | Write without valid approval receipt or outside permitted envelope | Stop executor/queue; reconcile or compensate actions; business/tool owner |
| Confused deputy / identity spoofing | Validate caller and backend authorization separately; no trusted model-supplied user ID | Principal/audience/scope mismatch; agent acts beyond requesting user | Revoke route/grant/credential; IAM and tool owners |
| Tool/MCP poisoning or schema drift | Approved owner/provenance; pinned version/schema; controlled discovery | Runtime schema hash differs from approved release; new tool appears | Quarantine server/tool, revert approved manifest; component owner |
| Code execution / dependency compromise | Reviewed artifacts, least-privileged runtime, restricted filesystem/network, patched dependencies | Unexpected process/network/artifact changes | Isolate runtime, rotate exposed credentials, redeploy trusted build; platform owner |
| Replay, duplicate write, or stale approval | Nonce, expiry, argument digest, idempotency key, single-use approval | Duplicate nonce/operation, changed target after approval | Freeze action, reconcile ledger before retry; tool owner |
| Multi-agent delegation escalation | Explicit delegation graph and per-edge identity/capability limits | Unregistered delegate or rights wider than initiating request | Disable delegation edge and revoke child grants; orchestration owner |
| Denial of service / runaway cost | Request/token/concurrency/tool-hop/time budgets and queue backpressure | Looping calls, high token burn, queue growth, repeated retries | Stop new work, cancel safe queued work, constrain routes; SRE/FinOps |
| Telemetry theft or evidence suppression | Pre-export redaction, restricted evidence store, independent audit path | Raw secrets in traces, diagnostic changes, heartbeat/log gaps | Restrict sink, revoke readers, preserve evidence; SOC/platform owner |

## Proposed enterprise policy

- **GOV-01 / GOV-05:** register agent owner, risk tier, approved dependencies, version, permitted actions, and support/containment contacts before production.
- **GOV-02 / GOV-03 / GOV-04:** isolate incompatible tenants/environments and authorize data/tool actions using verified identities, not model instructions.
- **GOV-06:** no production action may exceed an approved capability contract. High-impact writes need independent, transaction-bound approval; administrative actions require stricter separation.
- **GOV-06 / GOV-07:** safety checks and adversarial evaluations must cover complete trajectories, not only the final answer.
- **GOV-08 / GOV-09:** record security decisions and impose bounded execution/spend; alert on missing telemetry and abnormal action/cost patterns.
- **GOV-10 / GOV-11:** changes require risk-based reapproval; incident operators can disable ingress, execution, and downstream access independently.
- **GOV-12:** unresolved Preview, inspection, isolation, or audit gaps block the affected high-risk path unless a permissible, independently approved exception provides demonstrated compensating controls.

These are proposed enterprise controls, not claims that Microsoft enforces this policy automatically.

## Implementation

### 1. Define an explicit authority contract

Record permitted inputs, datasets, models, tools, destinations, action classes, delegation targets, and maximum autonomy in [agent registration](../../templates/agent-registration.md). Link each tool to its own approved [risk class](../08-tools/README.md).

An authority contract should answer: “May this agent read this customer's invoice?” and separately “May it change the invoice or send it to this recipient?” Do not reduce both decisions to “may use finance tools.”

Enforce the contract in application middleware/tool services using identity, tenant, target object, validated arguments, and current policy. The model proposes; a deterministic executor decides whether an action is permitted.

### 2. Place controls on every untrusted boundary

| Boundary | Required implementation check |
| --- | --- |
| User input → agent | Authenticate caller; input/content checks; rate and payload limits; prohibit secrets where unnecessary |
| Retrieved content → context | Enforce source ACLs and provenance first; preserve untrusted-source distinction; bound context and attachments |
| Model output → tool executor | Strict server-side schema/semantic validation; reject unknown tools/fields/destinations; evaluate action policy |
| Tool result → agent | Validate type/size; minimize sensitive fields; treat instructions as untrusted; retain source identity |
| Agent → agent | Carry verified requester/context; restrict delegation and action budget; do not inherit broader child permissions |
| Agent output → user/system | Disclosure/safety checks; destination authorization; human review for high-consequence output |
| Runtime → telemetry | Emit security metadata and correlation; redact content before export; restrict raw-content access |

Use an allowlist of callable operations. A text instruction such as “never transfer money” is not a substitute for removing payment permissions or enforcing a transaction policy.

### 3. Make approval resistant to replay and substitution

Before execution, bind approval to agent/release ID, verified requester, independent approver, tool/version, target object, normalized argument digest, business amount/limit if applicable, nonce, expiry, and policy version. Recheck current authorization and object state immediately before execution.

Store approval outside conversation history. Changed arguments, expired consent, a different user, a new target, or a material state change invalidates approval. Timeout or unavailable approval service means **no consequential action**, not implicit consent.

For long-running workflows, reauthorize each consequential step; a top-level “approve this plan” is not unlimited permission for generated future actions. See [human-in-the-loop](../23-human-in-the-loop/README.md).

### 4. Bound execution and delegation

Set per-run wall-clock, model-call, token, tool-call, recursion/delegation depth, concurrency, queue, and spending envelopes in the orchestrator. Separate retry budgets from normal action budgets and avoid retrying uncertain writes without reconciliation.

Scope child-agent permissions to the initiating task's approved authority. Restrict which agents can delegate, which targets may receive context, and whether the delegate can further delegate. Record the full parent/child trace and action chain.

For code-capable agents, control artifact provenance, runtime privilege, filesystem mounts, outbound destinations, resource limits, and persistence. Do not allow generated code to retrieve deployment secrets or administer its hosting environment.

### 5. Design containment before go-live

| Switch | Enforcer / owner | Verification |
| --- | --- | --- |
| Stop new user requests | Application/gateway on-call | New calls rejected; incident message available |
| Stop schedules, delegation, and queued work | Orchestrator/workload on-call | No new child runs; queued work handled by documented policy |
| Disable selected tool/write class | Tool authorization service/tool owner | Direct and agent-mediated attempts denied |
| Revoke backend access | IAM/data/tool owner | Revocation latency measured; active tokens/sessions considered |
| Disable model route or unsafe version | Gateway/model/platform owner | Approved safe route or explicit failure, not unreviewed fallback |
| Restore operation | Incident commander + domain owners | State reconciled, corrected release evaluated, grants narrowed, evidence retained |

Containment must not depend only on the compromised agent cooperating. Document treatment of already committed business actions, queued jobs, and in-flight writes; rollback of code is not rollback of external side effects.

## Evidence

Keep the threat model, authority/delegation contracts, approval and identity design, tool registry, boundary enforcement configuration, and security-owner sign-off. Collect denied unauthorized actions, replay/stale-approval rejection, cross-tenant tests, indirect-injection trajectories, loop-budget termination, and kill-switch exercise results.

Track test coverage by threat and enforcement point, with residual false-negative/false-positive gaps and release version. Attach evidence to [security review](../../checklists/security-review.md) and [production readiness](../../checklists/production-readiness.md); map primarily to **GOV-01 through GOV-12** as applicable, not a single “AI safety passed” label.

## Sources

- [Foundry agent documentation](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
- [Prompt Shields concepts](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection).
- [Agent networking options](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/networking-options).
- [Foundry tool governance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance).
- [Guardrails overview](https://learn.microsoft.com/en-us/azure/foundry/guardrails/guardrails-overview) and [hosted guardrail behavior](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/add-hosted-agent-guardrails).
- Source/status and broader threat references: [Foundry](../../references/microsoft-foundry.md), [Azure](../../references/azure.md), [security](../../references/security.md).

## Limitations and unresolved decisions

No prompt, classifier, sandbox, gateway, or red-team suite proves an agent safe in all future interactions. Blocking harmful content does not establish user authorization, factual quality, or transaction correctness.

Native telemetry and guardrail coverage may omit application-hosted steps, existing/code-first tools, or particular integrations. Inventory the uncovered paths and supply application controls; if consequential execution cannot be authorized, audited, and independently stopped, do not enable it.
