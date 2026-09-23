---
marp: true
theme: default
size: 16:9
paginate: true
lang: en
title: Microsoft Foundry Enterprise Governance
description: An opinionated enterprise framework for governing AI applications and agents throughout their lifecycle.
footer: Microsoft Foundry Enterprise Governance · Proposed enterprise baseline · Feature review 2026-09-23
style: |
  :root {
    --ink: #11223d;
    --muted: #46597a;
    --deep: #06315c;
    --blue: #0f6cbd;
    --violet: #7b3fe4;
    --magenta: #d6006e;
    --teal: #08707d;
    --green: #107c41;
    --amber: #9a5b00;
  }
  section {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 26px;
    color: var(--ink);
    background: linear-gradient(135deg, #ffffff 0%, #f1f7ff 55%, #e9efff 100%);
    border-top: 12px solid transparent;
    border-image: linear-gradient(90deg, var(--blue), var(--violet), var(--magenta), var(--amber)) 1;
    padding: 46px 58px;
  }
  h1 {
    color: var(--deep);
    font-size: 42px;
    margin: 0 0 4px;
  }
  h1::after {
    content: '';
    display: block;
    width: 150px;
    height: 6px;
    margin-top: 10px;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--blue), var(--magenta));
  }
  a { color: var(--blue); }
  strong { color: var(--deep); }
  li { margin-bottom: 4px; }
  footer { font-size: 15px; color: var(--muted); }
  blockquote {
    margin: 16px 0;
    padding: 10px 18px;
    font-size: 23px;
    color: var(--deep);
    background: rgba(255, 255, 255, 0.85);
    border-left: 8px solid var(--magenta);
    border-radius: 0 10px 10px 0;
  }
  blockquote::before, blockquote::after { content: none; }
  table {
    width: 100%;
    margin: 14px 0;
    font-size: 21px;
    border-collapse: separate;
    border-spacing: 0;
  }
  th {
    padding: 9px 14px;
    text-align: left;
    color: #ffffff;
    border: none;
    background: linear-gradient(90deg, var(--deep), var(--violet));
  }
  td {
    padding: 8px 14px;
    border: none;
    border-bottom: 2px solid #d8e5f7;
    background: rgba(255, 255, 255, 0.78);
  }
  section.lead {
    justify-content: center;
    color: #ffffff;
    background: linear-gradient(135deg, #06315c 0%, #0f6cbd 45%, #7b3fe4 100%);
  }
  section.lead h1 { color: #ffffff; font-size: 50px; }
  section.lead h1::after {
    margin: 12px auto 0;
    background: linear-gradient(90deg, #ffd166, #ff5fa2);
  }
  section.lead strong { color: #ffe08a; }
  section.lead a { color: #d5eaff; }
  section.lead footer { color: rgba(255, 255, 255, 0.72); }
  section.flow ol {
    display: flex;
    flex-wrap: wrap;
    row-gap: 8px;
    margin: 16px 14px 16px 0;
    padding: 0;
    list-style: none;
  }
  section.flow ol li {
    flex: 1 1 150px;
    margin: 0 -14px 0 0;
    padding: 12px 18px 12px 30px;
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    background: var(--blue);
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%);
  }
  section.flow ol li:first-child {
    padding-left: 20px;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%);
  }
  section.flow ol li:nth-child(6n + 2) { background: var(--violet); }
  section.flow ol li:nth-child(6n + 3) { background: var(--magenta); }
  section.flow ol li:nth-child(6n + 4) { background: var(--amber); }
  section.flow ol li:nth-child(6n + 5) { background: var(--teal); }
  section.flow ol li:nth-child(6n + 6) { background: var(--green); }
  section.cards ul {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 16px 0;
    padding: 0;
    list-style: none;
  }
  section.cards ul li {
    margin: 0;
    padding: 10px 16px;
    font-size: 20px;
    line-height: 1.4;
    background: #ffffff;
    border-left: 8px solid var(--blue);
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(12, 46, 96, 0.14);
  }
  section.cards ul li strong { display: block; color: var(--deep); }
  section.cards ul li:nth-child(6n + 2) { border-left-color: var(--violet); }
  section.cards ul li:nth-child(6n + 3) { border-left-color: var(--magenta); }
  section.cards ul li:nth-child(6n + 4) { border-left-color: var(--amber); }
  section.cards ul li:nth-child(6n + 5) { border-left-color: var(--teal); }
  section.cards ul li:nth-child(6n + 6) { border-left-color: var(--green); }
  section.steps ol {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin: 16px 0;
    padding: 0;
    list-style: none;
    counter-reset: step;
  }
  section.steps ol li {
    margin: 0;
    padding: 10px 14px;
    font-size: 18px;
    background: #ffffff;
    border-top: 6px solid var(--blue);
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(12, 46, 96, 0.14);
  }
  section.steps ol li::before {
    counter-increment: step;
    content: counter(step);
    display: block;
    margin-bottom: 4px;
    font-size: 28px;
    font-weight: bold;
    color: var(--blue);
  }
  section.steps ol li:nth-child(5n + 2) { border-top-color: var(--violet); }
  section.steps ol li:nth-child(5n + 2)::before { color: var(--violet); }
  section.steps ol li:nth-child(5n + 3) { border-top-color: var(--magenta); }
  section.steps ol li:nth-child(5n + 3)::before { color: var(--magenta); }
  section.steps ol li:nth-child(5n + 4) { border-top-color: var(--amber); }
  section.steps ol li:nth-child(5n + 4)::before { color: var(--amber); }
  section.steps ol li:nth-child(5n + 5) { border-top-color: var(--teal); }
  section.steps ol li:nth-child(5n + 5)::before { color: var(--teal); }
  section.stack > ul {
    margin: 14px 0;
    padding: 0;
    list-style: none;
  }
  section.stack > ul > li {
    margin: 0 0 8px;
    padding: 8px 16px;
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
    border-radius: 12px;
    background: linear-gradient(90deg, var(--deep), var(--blue));
  }
  section.stack > ul > li strong { color: #ffffff; }
  section.stack > ul > li:nth-child(5n + 2) { background: linear-gradient(90deg, var(--blue), var(--violet)); }
  section.stack > ul > li:nth-child(5n + 3) { background: linear-gradient(90deg, var(--violet), var(--magenta)); }
  section.stack > ul > li:nth-child(5n + 4) { background: linear-gradient(90deg, var(--magenta), var(--amber)); }
  section.stack > ul > li:nth-child(5n + 5) { background: linear-gradient(90deg, var(--teal), var(--green)); }
  section.stack > ul > li > ul {
    display: flex;
    gap: 8px;
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }
  section.stack > ul > li > ul > li {
    flex: 1;
    margin: 0;
    padding: 6px 10px;
    font-size: 17px;
    font-weight: normal;
    color: var(--ink);
    background: rgba(255, 255, 255, 0.92);
    border-radius: 8px;
  }
  section.matrix td strong, section.matrix td em, section.matrix td code {
    display: inline-block;
    padding: 1px 12px;
    font-size: 19px;
    font-weight: bold;
    font-style: normal;
    border-radius: 999px;
  }
  section.matrix td strong { color: var(--green); background: #dff3e6; }
  section.matrix td em { color: var(--amber); background: #fdeed3; }
  section.matrix td code { color: #b4003c; background: #fde3ea; font-family: inherit; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Microsoft Foundry
# Enterprise Governance

**Govern AI applications and agents as production software.**

Architecture · Security · Quality · Operations · Cost

An opinionated framework, not a certified implementation.

---

<!-- _class: cards -->

# What this deck covers

- **Lifecycle and accountability**
  Operating model, ownership, exceptions
- **Boundaries**
  Topology, identity, network, data, memory
- **The agent platform**
  Runtime, knowledge, tools, skills, models
- **Control before release**
  Evaluation, human approval, guardrails
- **Operations and value**
  Telemetry, consumption, FinOps, ROI
- **Evidence**
  Twelve controls, maturity, capability status

Each slide summarizes a chapter; authoritative detail stays in the [documentation](https://github.com/frkim/foundry-governance/blob/main/README.md).

---

<!-- _class: flow -->

# Governance is an end-to-end lifecycle

1. Discover
2. Design
3. Build
4. Secure
5. Evaluate
6. Approve
7. Deploy
8. Observe
9. Optimize
10. Govern
11. Retire

- Govern the application **and its dependencies**, including external agents.
- Every release needs an owner, evidence, operating limits, and a rollback path.
- “Must” describes a proposed enterprise policy, not a Microsoft guarantee.

[Principles and lifecycle](https://github.com/frkim/foundry-governance/blob/main/docs/00-overview/README.md)

---

# Central standards, delegated delivery

| Accountability | Responsibility |
| --- | --- |
| Platform | Landing zones, approved patterns, shared services |
| Application teams | Outcomes, runtime, evaluations, support |
| Security and data | Identity, trust boundaries, permitted data use |
| FinOps | Attribution, capacity, budget escalation |
| AI governance | Risk oversight, evidence, time-bound exceptions |

Separate business-risk acceptance from release authorization.

[Operating model and RACI](https://github.com/frkim/foundry-governance/blob/main/docs/01-governance-model/README.md)

---

# Isolate by risk, not by convenience

- Separate development, test, and production identities and access.
- Choose subscriptions, resources, and projects around ownership,
  residency, trust, capacity, and operational blast radius.
- Share infrastructure only when controls, quotas, and failure modes align.
- Approve the processing geography of models, tools, and failover routes.

> A **project is not proof** of network or regulatory isolation.

[Topology decisions](https://github.com/frkim/foundry-governance/blob/main/docs/02-resource-topology/README.md) · [Architecture library](https://github.com/frkim/foundry-governance/blob/main/architecture/reference-architectures/README.md)

---

<!-- _class: flow -->

# Establish explicit trust boundaries

1. User
2. Application or agent
3. AI Gateway
4. Authorized tool
5. Data or action

- Separate user, deployer, agent, gateway, tool, and operator identities.
- Prefer managed or workload identities; authorize at the acting service.
- Verify ingress, egress, private DNS, and denied-access paths.
- Treat retrieved text, memory, and tool responses as **untrusted data**;
  a prompt or guardrail never grants permission.

[Identity](https://github.com/frkim/foundry-governance/blob/main/docs/03-identity-access/README.md) · [Network](https://github.com/frkim/foundry-governance/blob/main/docs/04-network-security/README.md) · [Agent security](https://github.com/frkim/foundry-governance/blob/main/docs/07-agent-security/README.md)

---

<!-- _class: steps -->

# Know where the data goes

For prompts, conversations, memory, RAG, and telemetry, record:

1. **What** data is permitted, and why?
2. **Which identity** reads it, on whose behalf?
3. **Where** is it stored and processed, including downstream services?
4. **What is logged**, redacted, retained, and deleted?
5. **How is access revoked** and deletion verified?

Default to metadata-only telemetry; do not publish production evidence.

[Data governance](https://github.com/frkim/foundry-governance/blob/main/docs/05-data-governance/README.md)

---

# Memory and knowledge are governed data

- **Agent memory is Preview**: derive tenant, user, and purpose scope from
  authenticated context, never from model-supplied identifiers.
- The reviewed memory service has **no VNet integration**; a privately
  networked agent does not make its memory private.
- Foundry IQ is partly GA; **Work IQ and Fabric IQ are Preview**, with their
  own permissions, licensing, and network requirements.
- Permission-aware retrieval is not permission-free ingestion: propagate
  source ACL changes and deletions to derived stores.

> Deleting a conversation does not erase **memory, checkpoints, and indexes**.

[Memory and connected knowledge](https://github.com/frkim/foundry-governance/blob/main/docs/05-data-governance/README.md#memory-and-connected-knowledge)

---

<!-- _class: stack -->

# Separate the layers of an agent platform

- **Agent logic and framework** — Agent Framework, LangGraph, custom code
  - Pin dependencies
  - Review adapters
  - Keep code provenance
- **Managed execution** — hosted agents, routines, long-running work
  - Own checkpoints
  - Idempotent effects
  - Bounded budgets
- **Knowledge, memory, and tools** — indexes, toolboxes, skills, MCP
  - Scoped access
  - Versioned contracts
  - Approved routes
- **Governance and evidence** — identity, evaluation, observability, cost
  - Release manifest
  - Control records
  - Operating limits

Framework choice is not a waiver of runtime or supply-chain controls.

[Agent architecture](https://github.com/frkim/foundry-governance/blob/main/docs/06-agent-architecture/README.md)

---

# Durable execution shifts work onto the workload

- Long-running agents are **stateful processes**, not single requests.
- Reviewed resilience APIs are **Preview**: recovery is opt-in, restarts the
  handler, and does not restore local variables.
- Persist versioned state, idempotency keys, and remaining budgets;
  reconcile ambiguous external outcomes explicitly.
- Resume streams from a recorded cursor; a disconnected client is not a
  cancelled task.
- Register routine triggers with an owner, deduplication key, concurrency
  and cost limits, and a pause switch.

> Checkpointing is not **exactly-once** external action.

[Managed runtime and durable work](https://github.com/frkim/foundry-governance/blob/main/docs/06-agent-architecture/README.md#managed-runtime-durable-work-and-developer-choice)

---

# Keep humans in control of consequential actions

- Foundry approval and steering capabilities are **Preview**; enforce
  approval in the consuming runtime and at the executing service.
- Bind each approval to the exact arguments, reviewer identity, release,
  and expiry; recovery must not revive an expired approval.
- Steering queues a new turn and requests cooperative cancellation: it is
  not an instant stop, a fork, or an authorization grant.
- Scheduled and event-driven work must not silently reuse an absent
  user's delegated authority.
- Test reject, timeout, crash, and modified-argument paths before
  financial, procurement, or production-operation actions.

[Human-in-the-loop](https://github.com/frkim/foundry-governance/blob/main/docs/23-human-in-the-loop/README.md) · [Guardrails](https://github.com/frkim/foundry-governance/blob/main/docs/15-guardrails/README.md)

---

<!-- _class: flow -->

# Models, tools, MCP, and skills are dependencies

1. Private
2. Project
3. Business unit
4. Enterprise

- Register an owner, approved purpose, version, permissions, and SLO.
- Discovery is not authorization: tool search selects candidates, and a
  hosted MCP endpoint may not block a direct call.
- Toolbox network support follows the project, not a separate boundary;
  verify each tool's route instead of labeling a toolbox private.
- The **Preview Private Skill Catalog** scopes discovery, not trust:
  pin repositories, versions, and allowed operations.

[Tools](https://github.com/frkim/foundry-governance/blob/main/docs/08-tools/README.md) · [MCP](https://github.com/frkim/foundry-governance/blob/main/docs/09-mcp/README.md) · [Skills](https://github.com/frkim/foundry-governance/blob/main/docs/16-skills/README.md) · [Sharing](https://github.com/frkim/foundry-governance/blob/main/docs/17-sharing/README.md)

---

# Route through a gateway and an approved model set

- Apply consumer authentication, allowed routes, quotas, and attribution;
  prove which calls actually traverse the AI Gateway.
- Distinguish established APIM capabilities from **Preview Foundry
  integration** and the **Preview dedicated AI Gateway tier**.
- Model Router is GA, but routing metadata and session affinity are
  **Preview**, and catalog presence is not router eligibility.
- Approve the exact hosting offer, provider terms, processing geography,
  and cost — not the model family name.
- Record the serving model and fallback attempts with the release.

> A gateway diagram does not prove interception of managed service traffic.

[AI Gateway](https://github.com/frkim/foundry-governance/blob/main/docs/10-ai-gateway/README.md) · [Model governance](https://github.com/frkim/foundry-governance/blob/main/docs/11-model-governance/README.md)

---

<!-- _class: flow -->

# Quality and safety are release gates

1. Redacted traces
2. Versioned dataset
3. Regression tests
4. Candidate agent
5. Independent approval
6. Production sampling

- Evaluate task success, groundedness, retrieval, and tool correctness.
- Exercise prompt injection, permission denial, and approval expiry.
- Core cloud evaluation is GA; **synthetic data and deployed-interaction
  evaluation are Preview** — label and validate generated cases.
- Re-evaluate model, prompt, data, tool, route, and guardrail changes.

[Continuous quality loop](https://github.com/frkim/foundry-governance/blob/main/docs/12-quality-evaluation/README.md#continuous-quality-loop) · [Guardrails](https://github.com/frkim/foundry-governance/blob/main/docs/15-guardrails/README.md)

---

# Operate with evidence and bounded consumption

- Correlate workload, deployment, release, request, and trace identifiers.
- Monitor SLOs, quality, safety, security, and dependency failures.
- Use **Trace Replay to inspect recorded spans**, not as proof of
  reproducible execution; protect replayed content like original telemetry.
- Bound tokens, requests, concurrency, loops, retries, and execution time.
- Test overload behavior, SOC alerts, incident response, and kill switches.

> Budget alerts and TPM/RPM quotas are **not exact currency spend caps**.

[Observability](https://github.com/frkim/foundry-governance/blob/main/docs/13-observability/README.md) · [Consumption](https://github.com/frkim/foundry-governance/blob/main/docs/18-consumption/README.md) · [Security monitoring](https://github.com/frkim/foundry-governance/blob/main/docs/14-security-monitoring/README.md)

---

# Prove business value, not cheaper tokens

- Attribute model, tool, hosting, and shared-service costs to a workload,
  release, and owner.
- The business owner approves the baseline, benefit valuation, reporting
  window, and treatment of failed or reworked tasks.
- FinOps reconciles fully loaded cost; report benefits, total cost, net
  value, and ROI together.
- Separate estimated time savings from realized financial benefits, and
  stop two agents claiming the same outcome.
- Judge router and optimizer candidates against the cost **and** quality
  baseline.

[FinOps and business value](https://github.com/frkim/foundry-governance/blob/main/docs/19-finops/README.md#connecting-agent-telemetry-to-business-value)

---

<!-- _class: flow -->

# Release, recover, and retire deliberately

1. Immutable manifest
2. Isolated environments
3. Approved promotion
4. Monitored rollout
5. Tested rollback

- Bind code, prompts, models, tools, configuration, and evidence to a release.
- Use canaries and approved fallback routes; test state and side effects.
- Assign an on-call owner and authority to disable unsafe actions.
- Revoke routes and identities on retirement; stop spend and enforce retention.
- Time-limit exceptions and reassess after material changes.

[CI/CD](https://github.com/frkim/foundry-governance/blob/main/docs/20-cicd/README.md) · [Operations](https://github.com/frkim/foundry-governance/blob/main/docs/22-production-operations/README.md) · [Inventory](https://github.com/frkim/foundry-governance/blob/main/docs/25-ai-inventory/README.md)

---

# Twelve controls, one evidence contract

| Foundation and protection | Delivery and operation |
| --- | --- |
| GOV-01 · Ownership and inventory | GOV-07 · Quality gates |
| GOV-02 · Isolation and residency | GOV-08 · Observability and SLOs |
| GOV-03 · Least-privilege identities | GOV-09 · Consumption and FinOps |
| GOV-04 · Data handling and retention | GOV-10 · CI/CD and rollback |
| GOV-05 · Approved dependencies | GOV-11 · Response and retirement |
| GOV-06 · Security and approval | GOV-12 · Compliance and review |

Evidence binds to **workload, environment, and released version**.

[Canonical control catalog](https://github.com/frkim/foundry-governance/blob/main/governance/controls/README.md)

---

<!-- _class: flow -->

# Adopt in evidence-based increments

1. Ad hoc
2. Basic
3. Controlled
4. Governed
5. Scaled
6. Optimized

- Assign owners, inventory workloads, and choose approved patterns.
- Establish identity, data, security, and release baselines.
- Prove evaluation gates, observability, rollback, and incident response.
- Scale shared components, consumption controls, and cost attribution.
- Review compliance, exceptions, drift, and retirement continuously.

Maturity is demonstrated control effectiveness, not document count.

[Maturity model](https://github.com/frkim/foundry-governance/blob/main/docs/26-maturity-model/README.md)

---

<!-- _class: matrix -->

# Keep capability assumptions current

| Capability | Status | Enterprise action |
| --- | --- | --- |
| Hosted agents and Responses | **GA** | Verify each runtime component separately |
| Durable execution and reconnect | *Preview* | Own checkpoints, idempotency, budgets |
| Human approval and steering | *Preview* | Bind approval to arguments and expiry |
| Memory, Work IQ, Fabric IQ | *Preview* | Prove scope, retention, and deletion |
| Tool search and skill catalog | *Preview* | Approve each route and permission |
| Trace Replay label and scope | `Conflicting` | Resolve before relying on the label |
| GPT-6 GA status, ROI for Agents | `Verification required` | Absent evidence is not absent risk |

**Visual Foundry workflows are Preview with retirement announced for December 1, 2026.**

[Dated capability and source register](https://github.com/frkim/foundry-governance/blob/main/references/microsoft-foundry.md#september-2026-feature-review)

---

<!-- _class: lead -->

# Start with one workload

**Register → Design → Test → Approve → Operate → Review**

- [Read the framework](https://github.com/frkim/foundry-governance)
- [Register an agent](https://github.com/frkim/foundry-governance/blob/main/templates/agent-registration.md)
- [Review production readiness](https://github.com/frkim/foundry-governance/blob/main/checklists/production-readiness.md)
- [Review the go-live evidence](https://github.com/frkim/foundry-governance/blob/main/checklists/go-live.md)

Adopt the proposed policies explicitly. Keep real evidence in approved,
access-controlled enterprise systems.
