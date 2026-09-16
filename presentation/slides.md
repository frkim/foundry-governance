---
marp: true
theme: default
size: 16:9
paginate: true
lang: en
title: Microsoft Foundry Enterprise Governance
description: An opinionated enterprise framework for governing AI applications and agents throughout their lifecycle.
footer: Microsoft Foundry Enterprise Governance · Proposed enterprise baseline
style: |
  section {
    font-family: Arial, sans-serif;
    font-size: 28px;
    color: #172b4d;
    border-top: 10px solid #0078d4;
    padding: 55px 65px;
  }
  h1, h2 { color: #005a9e; }
  a { color: #005a9e; }
  footer { font-size: 16px; }
  section.lead { background-color: #edf6ff; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Microsoft Foundry
# Enterprise Governance

**Govern AI applications and agents as production software.**

Architecture · Security · Quality · Operations · Cost

An opinionated framework, not a certified implementation.

---

# Governance is an end-to-end lifecycle

**Discover → Design → Build → Secure → Evaluate → Approve**

**Deploy → Observe → Optimize → Govern → Retire**

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
- A **project is not proof of network or regulatory isolation**.
- Share infrastructure only when controls, quotas, and failure modes align.
- Approve the processing geography of models, tools, and failover routes.

[Topology decisions](https://github.com/frkim/foundry-governance/blob/main/docs/02-resource-topology/README.md) · [Architecture library](https://github.com/frkim/foundry-governance/blob/main/architecture/reference-architectures/README.md)

---

# Establish explicit trust boundaries

**User → Application / agent → Authorized tool → Data / action**

- Separate user, deployer, agent, gateway, tool, and operator identities.
- Prefer managed or workload identities; authorize at the acting service.
- Verify ingress, egress, private DNS, and denied-access paths.
- Treat retrieved text, memory, and tool responses as **untrusted data**.
- A prompt or guardrail never grants permission.

[Identity](https://github.com/frkim/foundry-governance/blob/main/docs/03-identity-access/README.md) · [Network](https://github.com/frkim/foundry-governance/blob/main/docs/04-network-security/README.md) · [Agent security](https://github.com/frkim/foundry-governance/blob/main/docs/07-agent-security/README.md)

---

# Know where the data goes

For prompts, conversations, memory, RAG, and telemetry, record:

1. **What** data is permitted and why?
2. **Which identity** can access it, on whose behalf?
3. **Where** is it stored and processed, including downstream services?
4. **What is logged**, redacted, retained, and deleted?
5. **How is access revoked** and deletion verified?

Default to metadata-only telemetry; do not publish production evidence.

[Data governance](https://github.com/frkim/foundry-governance/blob/main/docs/05-data-governance/README.md)

---

# Models, tools, MCP, and skills are dependencies

- Register an owner, approved purpose, version, permissions, and SLO.
- Discovery is not authorization; verify server-side operation scope.
- Pin contracts and review schema, permission, and default-version changes.
- Constrain writes; bind human approval to the exact transaction and expiry.
- Promote reusable components through:

**Private → Project → Business Unit → Enterprise**

[Tools](https://github.com/frkim/foundry-governance/blob/main/docs/08-tools/README.md) · [MCP](https://github.com/frkim/foundry-governance/blob/main/docs/09-mcp/README.md) · [Sharing](https://github.com/frkim/foundry-governance/blob/main/docs/17-sharing/README.md)

---

# Gateway controls need verified routing

- Apply consumer authentication, allowed routes, quotas, and attribution.
- Prove which model and tool calls actually traverse the AI Gateway.
- Test bypass paths and backend authorization.
- Distinguish established APIM capabilities from **Preview Foundry
  integration** and the **Preview dedicated AI Gateway tier**.
- A gateway diagram does not prove interception of managed service traffic.

[AI Gateway governance](https://github.com/frkim/foundry-governance/blob/main/docs/10-ai-gateway/README.md)

---

# Quality and safety are release gates

**Representative, versioned datasets + risk-approved thresholds**

- Evaluate task success, groundedness, retrieval, and tool correctness.
- Exercise prompt injection, permission denial, and approval expiry.
- Measure safety, latency, and cost alongside functional outcomes.
- Re-evaluate model, prompt, data, tool, route, and guardrail changes.
- Block unaccepted regressions; require independent release approval.

[Evaluation](https://github.com/frkim/foundry-governance/blob/main/docs/12-quality-evaluation/README.md) · [Guardrails](https://github.com/frkim/foundry-governance/blob/main/docs/15-guardrails/README.md)

---

# Operate with evidence and bounded consumption

- Correlate workload, deployment, release, request, and trace identifiers.
- Monitor SLOs, quality, safety, security, and dependency failures.
- Attribute model, tool, hosting, and shared-service costs.
- Bound tokens, requests, concurrency, loops, retries, and execution time.
- Test overload behavior, SOC alerts, incident response, and kill switches.

**Budget alerts and TPM/RPM quotas are not exact currency spend caps.**

[Observability](https://github.com/frkim/foundry-governance/blob/main/docs/13-observability/README.md) · [Consumption](https://github.com/frkim/foundry-governance/blob/main/docs/18-consumption/README.md) · [FinOps](https://github.com/frkim/foundry-governance/blob/main/docs/19-finops/README.md)

---

# Release, recover, and retire deliberately

**Immutable manifest → Isolated environments → Approved promotion**

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

# Adopt in evidence-based increments

**Ad hoc → Basic → Controlled → Governed → Scaled → Optimized**

1. Assign owners, inventory workloads, and choose approved patterns.
2. Establish identity, data, security, and release baselines.
3. Prove evaluation gates, observability, rollback, and incident response.
4. Scale shared components, consumption controls, and cost attribution.
5. Continuously review compliance, exceptions, drift, and retirement.

Maturity is demonstrated control effectiveness, not document count.

[Maturity model](https://github.com/frkim/foundry-governance/blob/main/docs/26-maturity-model/README.md)

---

# Keep capability assumptions current

**Source snapshot: September 16, 2026 — verify before implementation.**

- Track GA, Preview, Deprecated, and Verification required per capability.
- Validate the exact runtime, API, region, deployment type, and gateway tier.
- Prompt and hosted agents have different implementation boundaries.
- Visual Foundry workflows are Preview, with retirement announced for
  **December 1, 2026**; use approved code-based orchestration for new work.
- Preview adoption needs explicit risk approval and a viable fallback.

[Dated Microsoft capability and source register](https://github.com/frkim/foundry-governance/blob/main/references/microsoft-foundry.md)

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
