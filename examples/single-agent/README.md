# Worked design: single-agent operations assistant

- **Last reviewed:** 2026-09-16
- **Scope:** logical enterprise patterns.
- **Experience:** Foundry resource/project (new), unless stated.
- **Capability status:** feature-specific; Preview/GA only when confirmed in sources; otherwise verification required.
- **Recommendation:** proposed enterprise baseline.
- **Limitations:** diagrams are not network or availability guarantees.
- **Exceptions:** [exception request](../../templates/exception-request.md).

Metadata applies throughout. This is a **worked design**, not deployable IaC or a tested implementation.
All inventory values and numerical acceptance targets are fictitious design inputs; no personal data or credentials are included.
Field names below are planning labels, not Azure resource or API schema fields.

## Scenario and inventory

A facilities team wants an assistant that explains approved maintenance procedures and drafts work orders.
It must not approve purchases, operate equipment, or execute unrestricted commands.

| Planning field | Fictitious value |
| --- | --- |
| Workload / accountable owner | `design-single-01` / Facilities Product Team |
| Environment / classification | Production design / Internal synthetic procedures |
| Foundry scopes | `design-ops-resource` / `design-maintenance-project` |
| Runtime identity label | `design-maintenance-runtime` |
| Permitted tool | `lookup-procedure`; optional `create-work-order-draft` |
| Data location constraint | Approved geography; exact region pending capability verification |
| Release / autonomy | `design-release-01` / Read-only answers; approved draft creation |

## Concrete decisions

- One agent: the task has one owner and no demonstrated specialist-agent benefit.
- Use a prompt-led design only if the chosen runtime supports the required tools, identity flow, and controls.
- Pin specific immutable skill versions; treat Limited Preview Agent optimizer output as a candidate requiring isolated evaluation, separate client-side tool tests, and approval—not an automatic production update.
- Separate production subscriptions/resources from nonproduction; use a workload project within the production resource and review any same-environment infrastructure sharing.
- Start with PAYG assumptions for irregular demand; enforce application concurrency and request limits rather than treating budget alerts as a hard stop.

## Identity flow and controls

1. The application authenticates the user and authorizes procedure access and draft creation separately.
2. A scoped workload identity accesses approved model and tool endpoints; user authorization is not inferred from that identity.
3. The tool service validates the permitted operation and business object using trustworthy caller context or narrowly scoped connections.
4. Retrieved procedure text and model proposals are untrusted; validate arguments and require approval bound to the exact draft operation.
5. Reauthorize at execution, enforce idempotency, cap agent iterations, and record only redacted decision evidence.

## Acceptance evidence to collect

| Check | Proposed pass condition | Owner / evidence |
| --- | --- | --- |
| Authorization | Unauthorized procedure and draft requests are denied | App owner / synthetic denial traces |
| Quality | At least 90 of 100 approved synthetic questions meet the rubric | Product owner / versioned evaluation |
| Action safety | Changed or expired approvals cannot create a draft | Tool owner / tampering and replay results |
| Cost and limits | A request exceeding 3 tool calls stops safely | Operations owner / bounded-execution trace |

## Rollback and kill switch

Disable draft creation at both application and tool authorization points; stop new agent sessions if containment requires it.
Inventory in-flight work before revoking the tool connection; do not blindly retry partially completed writes.
Restore the previous approved prompt/tool contract, then rerun denial and quality checks before reopening access.

## Cost / quality tradeoff and next steps

Use one approved model first; compare a smaller alternative against the same question set rather than automatically selecting the cheapest route.
Restricting tools reduces cost and action risk but leaves more work for a human operator.
Follow [single-agent architecture](../../architecture/reference-architectures/README.md#1-single-agent-application), [agent selection](../../architecture/decision-trees/README.md#14-single-vs-multi-agent), and the [governance chapter index](../../README.md).
Companion chapters: [identity/access](../../docs/03-identity-access/README.md), [tools](../../docs/08-tools/README.md), [evaluation](../../docs/12-quality-evaluation/README.md), [human approval](../../docs/23-human-in-the-loop/README.md), and [production operations](../../docs/22-production-operations/README.md).
Check [Foundry sources](../../references/microsoft-foundry.md), [Azure sources](../../references/azure.md), and [Agent Service overview](https://learn.microsoft.com/en-us/azure/foundry/agents/overview) before implementation.

## From design to a release decision

**Walkthrough reviewed: 2026-09-22.** This synthetic exercise illustrates how to use the framework, not a completed assessment or new verification of Microsoft capabilities. Start with procedure lookup only; adding draft creation changes the tool permissions and requires reassessment.

1. **Register and classify.** Copy the [agent registration](../../templates/agent-registration.md) into an approved evidence system. Assign named leads to the owner groups above; register the model and lookup tool. Apply the [baseline selection criteria](../../governance/baselines/README.md#selecting-and-proving-a-baseline): read-only operation is not automatically low risk, particularly where maintenance advice can affect physical safety. Record intended/prohibited uses and the independent classification decision.
2. **Bind the candidate.** Use the [canonical metadata](../../governance/standards/README.md#canonical-metadata-contract), for example `agent_id=design-single-01`, `deployment_id=design-single-prod-001`, `version=1.0.0`, `environment=prod`. These are fictitious identifiers, not proof of deployment. Attach the actual source commit, artifact digest, dependency versions and configuration only when implemented.
3. **Collect evidence.** Use the map below to route work to reviewers. Create a separate [control record](../../governance/controls/README.md#how-to-use-the-catalog) for each GOV ID; the grouped rows are a reading aid, not permission to omit a control.
4. **Decide in order.** Complete [architecture](../../checklists/architecture-review.md), [security](../../checklists/security-review.md), and [production readiness](../../checklists/production-readiness.md) reviews against the same candidate. The independent [go-live authorization gate](../../checklists/go-live.md#independent-authorization-gate) decides the permitted traffic scope; a canary approval does not authorize full rollout.

| Controls | Evidence to collect for this assistant | Responsible producer |
| --- | --- | --- |
| GOV-01, GOV-02 | Accepted ownership, dependency inventory, data-flow/isolation design, approved processing/storage geography | Service / Platform / Data owners |
| GOV-03, GOV-04 | User-to-procedure authorization denials, runtime grants, redacted traces, numeric retention and deletion tests | Application / IAM / Data owners |
| GOV-05, GOV-06 | Approved model/tool versions, lookup-only operation allowlist, injection and unauthorized-action tests, effective guardrail tests | Component / Security owners |
| GOV-07 | Versioned 100-question dataset, rubric, per-case results and independent threshold decision; other applicable safety gates still apply | Evaluation lead |
| GOV-08, GOV-09 | Numeric SLOs, alert receipt, trusted cost attribution, approved budget and observed three-call execution bound | Operations / FinOps owners |
| GOV-10, GOV-11 | Immutable release/approval records; timed rollback, queue containment and revocation exercise; retirement plan | Release / Operations owners |
| GOV-12 | Obligation applicability, independent decisions, findings and next review dates; eligible exceptions with scope and expiry | Governance / Compliance owners |

**Illustrative hold:** suppose the quality test passes 92 of 100 questions, but the tool returns a procedure outside the user's permitted scope. Record the quality result under GOV-07 and the authorization failure under GOV-03/GOV-06; do not average them into a pass. Block launch, remediate authorization, rerun the affected tests and obtain independent review of the updated candidate. Missing test results are `hold`, not `n/a`. An exception cannot waive a non-waivable obligation or turn a failed technical test into a pass.

**Recovery exercise:** before launch, have the named operator disable new requests, verify queued/in-flight work is contained, and restore only an approved version. Compare measured containment and recovery times against risk-approved numeric objectives. If recovery fails, keep the affected path disabled and use the approved manual procedure; do not select an unapproved model, tool or region to restore availability.
