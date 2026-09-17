# Worked design: bounded multi-agent review

- **Last reviewed:** 2026-09-16
- **Scope:** logical enterprise patterns.
- **Experience:** Foundry resource/project (new), unless stated.
- **Capability status:** feature-specific; Preview/GA only when confirmed in sources; otherwise verification required.
- **Recommendation:** proposed enterprise baseline.
- **Limitations:** diagrams are not network or availability guarantees.
- **Exceptions:** [exception request](../../templates/exception-request.md).

Metadata applies throughout. This is a **worked design**, not deployable IaC or a tested implementation.
All inventory values and numerical acceptance targets are fictitious design inputs; no personal data or credentials are included.
Field names are planning labels, not Azure resource or API schema fields.

## Scenario and inventory

A product team wants two specialists to compare synthetic supplier specifications and draft a review package.
A research specialist can read specifications; an action specialist can propose a draft review record, never place an order.

| Planning field | Fictitious value |
| --- | --- |
| Workload / accountable owner | `design-multi-01` / Product Review Team |
| Environment / classification | Evaluation design / Internal synthetic specifications |
| Foundry scopes | `design-review-resource` / `design-review-project` |
| Identity labels | `design-orchestrator`, `design-research`, `design-draft-writer` |
| Tool contracts | `read-specification`, `propose-review-draft` |
| Handoff contract | Task identifier, source references, bounded findings, no raw credentials |
| Execution envelope | 2 specialists, at most 4 handoffs, 6 total tool calls |

## Concrete decisions

- Multi-agent adoption is conditional on a matched evaluation showing better completeness than the single-agent baseline.
- The orchestrator owns deadlines and total spend; specialists cannot create new agents or expand their tool scope.
- Separate specialist permissions without assuming that each agent requires a new project; choose additional resources only for justified isolation.
- Use a custom runtime only if prompt-led orchestration cannot meet the validated handoff and enforcement requirements.
- Workflow names orchestration here, not a third persisted agent type; any external Responses API specialist without an agent resource still needs application/runtime inventory and dependency ownership.
- Do not introduce Foundry visual workflows (Preview), scheduled to retire on 2026-12-01; evaluate Microsoft Agent Framework for new workflow orchestration.

## Identity flow and controls

1. The application validates the user and authorizes access to the particular review task.
2. The orchestrator dispatches minimized task context; each specialist uses its own scoped identity where supported.
3. The research role cannot call the write API; retrieved content and peer responses cannot grant new permissions.
4. Validate handoffs against the approved contract and discard instructions embedded in source content.
5. Require an authorized human to approve the exact draft write; the tool service reauthorizes it and enforces idempotency.

## Acceptance evidence to collect

| Check | Proposed pass condition | Owner / evidence |
| --- | --- | --- |
| Comparative value | At least 10 percentage points higher rubric pass rate on 60 matched tasks | Product owner / single-versus-multi evaluation |
| Privilege separation | Research identity cannot write or impersonate another specialist | Security owner / negative traces |
| Bounded execution | Cyclic handoffs stop at the declared envelope without a write | Runtime owner / loop injection results |
| Handoff integrity | Malicious peer instructions do not alter tool permissions | Test owner / adversarial transcript |

## Rollback and kill switch

Disable orchestration dispatch and draft writes; identify outstanding specialist runs before revoking scoped connections.
Cancel or quarantine in-flight proposals, and reconcile any acknowledged writes before retrying.
Return to the evaluated single-agent read-only workflow, not an unevaluated autonomous fallback.

## Cost / quality tradeoff and next steps

Allow the multi-agent trial at no more than twice the baseline median task cost; reject it if the quality benefit does not justify latency and spend.
Parallel specialists may reduce elapsed time but still consume additional tokens, tool calls, and operational effort.
Follow [multi-agent architecture](../../architecture/reference-architectures/README.md#4-multi-agent), [autonomy selection](../../architecture/decision-trees/README.md#13-human-in-the-loop-vs-autonomous), and the [governance chapter index](../../README.md).
Companion chapters: [agent architecture](../../docs/06-agent-architecture/README.md), [agent security](../../docs/07-agent-security/README.md), [evaluation](../../docs/12-quality-evaluation/README.md), [consumption](../../docs/18-consumption/README.md), and [human approval](../../docs/23-human-in-the-loop/README.md).
Verify current orchestration/identity support in [Foundry sources](../../references/microsoft-foundry.md), [Azure sources](../../references/azure.md), and [Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview).
