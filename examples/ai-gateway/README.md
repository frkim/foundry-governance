# Worked design: explicit model routing through AI Gateway

- **Last reviewed:** 2026-09-16
- **Scope:** logical enterprise patterns.
- **Experience:** Foundry resource/project (new), unless stated.
- **Capability status:** feature-specific; Preview/GA only when confirmed in sources; otherwise verification required.
- **Recommendation:** proposed enterprise baseline.
- **Limitations:** diagrams are not network or availability guarantees.
- **Exceptions:** [exception request](../../templates/exception-request.md).

Metadata applies throughout. This is a **worked design**, not deployable IaC or a tested implementation.
Inventory values and thresholds are fictitious design inputs; no personal data, live endpoint, or credentials are included.
Field names are planning labels, not Azure resource or API schema fields.

## Scenario and inventory

Two applications need attributable model consumption through a shared APIM policy layer.
Their controlled model clients explicitly select the gateway endpoint; managed tool connections are reviewed separately.
This design uses traditional APIM policies, not the distinct Preview Foundry integration or Preview dedicated AI Gateway tier.

| Planning field | Fictitious value |
| --- | --- |
| Workload / gateway owner | `design-gateway-01` / AI Platform Team |
| Environment / classification | Production design / Internal synthetic requests |
| Gateway / caller labels | `design-model-gateway` / `design-product-a`, `design-product-b` |
| Approved backend labels | `design-model-primary`; fallback disabled initially |
| Allocation dimensions | Validated product identity, environment, approved model alias |
| Routing constraint | Only proven caller-controlled model routes enter this gateway |
| Capacity assumption | Variable demand; PAYG comparison before any provisioned commitment |

## Concrete decisions

- Authenticate each caller and bind a trusted product identity to its approved model routes and usage allocation.
- Require verification of APIM tier, policies, API compatibility, streaming, and authentication before implementation.
- If the application needs WAF ingress, assess Application Gateway separately; WAF and model API policy are complementary layers.
- If a managed runtime cannot use the mandated gateway route, change the runtime or obtain an approved alternative control; do not claim transparent interception.
- Do not substitute the dedicated Preview tier without redesign: reviewed API-key grants cover all published models/tools, not per-asset access, and the tier has no SLA.

## Identity flow and controls

1. The application authenticates and authorizes the user before making any model request.
2. Its scoped workload identity authenticates to the gateway through the verified supported mechanism.
3. The gateway uses separately scoped backend credentials or identity; consumers do not receive that backend credential.
4. Restrict direct backend callers using verified controls, test bypass, and validate any attribution header rather than trusting caller input.
5. Apply supported policy limits, application budgets, bounded retries, and redacted logging; separately authorize every tool path.

## Acceptance evidence to collect

| Check | Proposed pass condition | Owner / evidence |
| --- | --- | --- |
| Explicit routing | Trace proves the approved client path reaches the gateway; forbidden bypass is denied | Platform owner / route and denial traces |
| Isolation / allocation | Product A cannot consume product B's identity or allocation | Security/FinOps owners / spoofing test and reconciliation |
| Protocol behavior | Supported streaming, cancellation, errors, and retry limits work correctly | App owner / compatibility results |
| Failure safety | Gateway failure returns a bounded error without unauthorized direct fallback | Operations owner / outage drill |

## Rollback and kill switch

Disable the affected caller or model route at the gateway and application; stop automatic retries during containment.
Revert the reviewed gateway policy/client release and validate allowed/denied paths before reopening access.
Keep direct fallback disabled; reconcile requests with uncertain completion to avoid duplicate calls and spend.

## Cost / quality tradeoff and next steps

Measure gateway charges, latency, logging, and retry amplification alongside model cost.
Consider a smaller approved model only if the matched 100-task evaluation loses no more than 2 percentage points under the product's proposed quality rubric.
Follow [agent + AI Gateway](../../architecture/reference-architectures/README.md#7-agent--ai-gateway), [gateway layer selection](../../architecture/decision-trees/README.md#10-application-gateway-vs-ai-gateway), and the [governance chapter index](../../README.md).
Companion chapters: [AI Gateway](../../docs/10-ai-gateway/README.md), [network security](../../docs/04-network-security/README.md), [observability](../../docs/13-observability/README.md), [consumption](../../docs/18-consumption/README.md), and [FinOps](../../docs/19-finops/README.md).
Verify support using [Foundry sources](../../references/microsoft-foundry.md), [Azure sources](../../references/azure.md), and [AI Gateway capabilities](https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities).
Compare the separate [Foundry integration](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/governance) and [dedicated tier](https://learn.microsoft.com/en-us/azure/api-management/ai-gateway-overview) before changing this choice.
