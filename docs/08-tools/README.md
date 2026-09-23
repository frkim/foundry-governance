# Tool governance

Last reviewed: **2026-09-16**.
Scope: enterprise native, OpenAPI, function, code, browser, workflow, and MCP-exposed tools.
Experience: **Foundry resource/project (new)** unless explicitly stated.
Capability status: tool/runtime-specific; verify the [Foundry](../../references/microsoft-foundry.md) and [Azure](../../references/azure.md) source registers.
Recommendation: approve callable operations individually and authorize every execution outside the model.
Limitations: connector availability, identity, network, approval, and telemetry support differ; one tool integration does not imply another's controls.
Exceptions: [exception request](../../templates/exception-request.md); metadata applies to every recommendation unless overridden.

## Microsoft capability

Foundry agents can use supported tools and external integrations. Tool definitions describe callable interfaces; they do not independently establish enterprise ownership, risk approval, per-user permissions, or safe transaction semantics.

Native tools, application functions, OpenAPI integrations, MCP servers, and code/browser execution create different enforcement paths. **Foundry tool governance through APIM is Preview and not universal interception**: the documented automatic routing path covers newly added portal MCP tools, with exclusions described in [AI Gateway](../10-ai-gateway/README.md).

A tool may authenticate through a project/agent identity, a stored credential, or user-delegated OAuth where supported. Shared authentication and delegated user access are not interchangeable.

**Toolboxes** provide a managed, versioned shared MCP-compatible endpoint for built-in and custom tools. The named **core Toolboxes portal experience is GA** in the [feature-readiness table](https://learn.microsoft.com/en-us/azure/foundry/concepts/general-availability#feature-readiness-at-ga); this does not establish GA/support for every tool, identity, network, protocol, or client combination. **Tool search** and **skills** are explicitly Preview; skills support both prompt and hosted agents. Promoting a toolbox default updates consumers without redeployment: treat **all consumers as affected** until version-binding evidence proves otherwise. Discovery/default changes are production supply-chain changes.

The **Limited Preview agent optimizer** can propose instructions, skills, tool descriptions, and model selections. It is not a tool-approval or production-release authority. Record optimizer inputs/output versions and reassess changed descriptions, executable skill content, transitive tool rights, and model choices before promotion.

### Discovery, authentication, and network boundaries

**Feature review: 2026-09-23.** [Tool search](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/tool-search) selects relevant tools by intent instead of placing every definition into context; the documented search uses BM25 over names, descriptions and parameters. Measure selection accuracy and token savings rather than assuming either.
[Toolbox authentication](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/tool-authentication) separates access to the toolbox from downstream authentication. Shared credentials/agent identities do not automatically carry end-user permissions.
For hosted consumers, [the MCP endpoint does not block `tools/call` merely because `require_approval=always`](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/use-toolbox-hosted-agent#enforce-tool-approval). Enforce approvals in the consuming runtime and independently authorize effects at the executor; test direct-call bypass.
[Toolbox network isolation](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/toolbox-network-isolation) follows project networking, not a separate toolbox VNet. Work IQ and browser automation are unsupported in isolated projects in the reviewed matrix; Fabric IQ is conditional and web search uses Microsoft-managed public endpoints. Verify each tool's route rather than labeling an entire toolbox private.

## Enterprise recommendation

Maintain a versioned, searchable tool catalog linked to owners, consuming agents, backend services, data classes, permissions, SLOs, and retirement plans. Register operations rather than approving a whole server or API as “safe.”

Classify by the **maximum permitted effect and disclosure**, not the HTTP method, tool name, or self-declared MCP annotation. A read can disclose restricted information; a `POST` may only search; a shell tool can exceed any declared business function.

### Required risk classes and approval rules

These are proposed enterprise risk classes, not Microsoft product labels.

| Class | Examples / boundary | Onboarding approval | Execution approval |
| --- | --- | --- | --- |
| **Low-risk read** | Public/approved nonsensitive reference lookup; no persistent side effect or external confidential disclosure | Tool owner + workload owner; standard security baseline | No human per-call approval inside approved scope; authenticated caller and request validation still required |
| **Medium-risk read** | Internal/confidential lookup, customer record retrieval, or data export with disclosure risk | Tool owner + data owner + security for sensitive sources/destinations | Verify user/object rights each call; step-up authentication plus human data-owner approval for bulk, unusual, or external disclosure unless explicitly covered by a bounded grant |
| **Transactional** | Bounded, reversible business changes such as an approved low-impact ticket update | Tool owner + business process owner + security | Human approval before execution by default; bounded preauthorization only for named actions/limits, with owner approval, expiry, audit, and revocation |
| **High-impact write** | Payments, customer commitments, consequential record changes, destructive or hard-to-reverse actions | Business risk owner + security + data/compliance as applicable | Independent human approval **per transaction** bound to exact target/arguments; step-up authentication and separation of duties |
| **Administrative** | IAM grants, secrets, infrastructure/security configuration, arbitrary privileged execution | Platform/security authority + affected service owner | No unattended autonomous execution; two distinct authorized human approvals, just-in-time executor rights, change/incident record |

Reversibility alone does not make an action low impact. A draft message that is automatically sent downstream is a write; downloading a sensitive dataset is not a low-risk read.

## Proposed enterprise policy

- **GOV-01 / GOV-05:** only registered, owned, approved tool operations and versions may be used in production; runtime discovery does not grant approval.
- **GOV-03 / GOV-04:** use the narrowest supported backend identity and data access; never place tool credentials into prompts or log bodies.
- **GOV-06:** enforce the risk-class approval rule at the executor/backend, not just in the conversation UI or model instructions.
- **GOV-06:** validate tool name, arguments, target, user/tenant context, destination, and business limits before side effects.
- **GOV-07 / GOV-10:** material schema, permission, provider, destination, or semantic changes require evaluation and risk-based reapproval.
- **GOV-08 / GOV-09:** record attributed tool decisions and outcomes; impose latency, concurrency, request, response, and cost budgets.
- **GOV-11 / GOV-12:** each tool needs a tested disable path and retirement plan; shared credentials and unsupported controls require approved, expiring exceptions.

These requirements become enterprise policy only when adopted; registration alone is not enforcement.

## Implementation

### 1. Register the executable contract

Use [tool registration](../../templates/tool-registration.md). At minimum record:

| Field group | Required information |
| --- | --- |
| Identity and ownership | Stable tool/operation ID; accountable owner; support/on-call; environment; approved consumers |
| Provenance and version | Source repository/vendor; build/version/digest; schema version/hash; release and deprecation policy |
| Function and risk | Exact effect; risk class; read/write/administrative semantics; data classes; maximum impact |
| Interface | Approved endpoint/protocol; strict input/output schema; size/type limits; permitted destinations |
| Authorization | Caller and backend identities; delegated/application-only mode; roles/scopes; object/tenant checks |
| Approval | Onboarding approvers; per-call rule; preauthorization envelope if allowed; expiry and replay prevention |
| Execution safety | Timeout, concurrency, retry, idempotency, transaction status, compensation, and cancellation behavior |
| Data and audit | Retention, redaction, residency, telemetry schema, evidence owner, sensitive-result handling |
| Lifecycle | Dependency/consumer links, SLO, cost attribution, kill switch, rollback and retirement notice |

An approved schema hash identifies the reviewed contract, not proof that the server still behaves correctly. Pair it with trusted deployment provenance and runtime monitoring.

### 2. Separate identities and permissions

Give each incompatible privilege boundary a separate identity/credential. A read-only lookup tool should not share credentials with an administrator tool even if both call the same backend.

Where a tool acts for a user, enforce delegated or equivalent server-verified user/object authorization. Where it acts application-only, approve the application's business authority explicitly; do not claim its broad backend identity preserves the user's narrower access.

Check stored-credential accessibility within the project and backend token/secret handling. Prefer supported managed/workload identities; rotate secrets where required, constrain secret readers, and never return them as tool results.

### 3. Use a deterministic execution envelope

1. Authenticate the caller and resolve permitted tool/version from server-side policy.
2. Parse and validate a strict schema; reject unsupported fields, invalid ranges, oversized payloads, unapproved URLs, and unsafe file paths.
3. Resolve tenant/user/target authorization from verified context; do not trust model-supplied identity or authorization claims.
4. Evaluate risk-class policy and obtain the required approval bound to normalized arguments, target, requester, tool version, nonce, and expiry.
5. Revalidate business state and permission immediately before execution. A changed amount, recipient, target record, or policy requires a new decision.
6. Execute with narrow backend credentials, bounded time/concurrency, and an idempotency key where supported.
7. Record action/approval IDs, attributed principal, result status, and safe metadata; redact/minimize output before returning it to the agent.
8. Reconcile uncertain outcomes using a backend transaction/status record. Do not infer “not executed” from a timeout.

For application-executed function tools, this envelope belongs in application code. For remote APIs/MCP, enforce it in the backend and/or a verified gateway path; merely displaying a confirmation card is insufficient.

### 4. Define retries, cancellation, and compensation

| Situation | Recommended behavior |
| --- | --- |
| Read timeout | Bounded retry if safe for data disclosure/cost; respect cancellation and budget |
| Write times out before response | Query transaction status; retry only with backend-proven idempotency and valid approval |
| Server streams partial output then disconnects | Mark outcome uncertain; preserve correlation/session metadata; do not automatically replay a write |
| User cancels or approval expires | Stop unstarted action; attempt supported cancellation; disclose already committed work |
| Multi-step workflow fails | Run approved compensating actions where safe; otherwise escalate to business owner for reconciliation |
| Backend returns sensitive/untrusted text | Minimize and treat as untrusted; never let returned instructions authorize another action |

Gateways, circuit breakers, and model fallback do not provide business transaction rollback.

### 5. Manage catalog sharing and change

Publish visibility and execution permission separately: private/team/project/business-unit/enterprise catalog visibility does not grant access. Record each consuming agent and the approved operation subset.

Schema additions, changed descriptions, broader OAuth scopes, new destinations, provider changes, and new side effects can change risk even without a major API version. Quarantine unexpected changes; assess consumers before republishing. Pin known-good versions where supported and document compatibility/migration deadlines.

For toolbox default promotion, inventory **every consumer**, verify version bindings, regress affected operations and trajectories, stage the promotion, monitor drift, and retain a tested rollback. Preview tool search returns candidate selections, **not authorization**; constrain discovery and independently deny unapproved direct invocation. Pin each skill to an immutable **specific version** and reviewed digest, including executable/transitive tool rights; use the [skills governance](../16-skills/README.md) review, not ordinary document approval.

Apply the same review to optimizer-generated candidates: require held-out evaluations of actual tool actions and separate human release approval. Optimizer evaluations **invoke tools** and can produce real charges or mutations; **test endpoints or mocks and separate credentials are required enterprise controls**. Prompt-agent tool-description optimization cannot evaluate actual client-side tool execution, so run separate tool/action tests before approval.

For deprecation, notify owners, prevent new onboarding, migrate consumers, revoke old grants, verify absence of traffic, and remove secrets/routes after retention obligations are met. Retain a tombstone inventory record and incident/approval evidence.

## Evidence

Keep the approved tool record, risk decision, schema/version hash, identity grants, source/build provenance, approval configuration, and consumer list. Demonstrate authorized/denied object access, malformed arguments, stale/replayed approval, direct-backend bypass denial, duplicate-write handling, timeout reconciliation, and kill-switch behavior.

Link evidence to [security review](../../checklists/security-review.md), [production readiness](../../checklists/production-readiness.md), and **GOV-01, GOV-03, GOV-04, GOV-05, GOV-06, GOV-07, GOV-08, GOV-09, GOV-10, GOV-11, GOV-12**. Measure catalog coverage and actual call-path enforcement separately.

## Sources

- [Foundry tools documentation](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/overview).
- [Foundry tool governance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance).
- [Foundry MCP authentication](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication).
- [Toolbox overview](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/toolbox-overview), [tool search](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/tool-search), and [feature readiness](https://learn.microsoft.com/en-us/azure/foundry/concepts/general-availability#feature-readiness-at-ga).
- [Agent optimizer](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-optimizer-overview) and [agent types and skills](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
- Capability/status notes: [Foundry](../../references/microsoft-foundry.md), [Azure](../../references/azure.md).
- Related controls: [MCP](../09-mcp/README.md), [agent security](../07-agent-security/README.md), [human-in-the-loop](../23-human-in-the-loop/README.md).

## Limitations and unresolved decisions

Tool availability does not prove per-tool authorization, streaming safety, idempotency, user delegation, or complete telemetry. Self-declared read-only/destructive annotations are hints to review, not trusted enforcement.

Some native or managed integrations may not expose the necessary executor controls. Restrict them to the demonstrably safe risk class, add a supported authorization wrapper, or choose another integration; do not enable high-impact or administrative autonomy on an unverified path.
