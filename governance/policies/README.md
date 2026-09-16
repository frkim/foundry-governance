# Proposed enterprise governance policies

| Document metadata | Value |
|---|---|
| Owner | Enterprise AI Governance Lead; ratification authority: organization's designated governance/risk body |
| Scope / status | Enterprise **proposed draft baseline** pending ratification; “must” means a proposed organizational mandate, not a Microsoft requirement |
| Experience | Microsoft Foundry resource/project, new experience unless stated otherwise |
| Last reviewed | 2026-09-16 |
| Capability status | Feature-specific official references apply; unsupported or uncertain availability is **verification-required**, not an assumed platform feature |
| Evidence | Ratification record, policy/version register, signed control decisions and scoped exception register; Governance Lead is evidence custodian |
| Exceptions | The process below applies to every recommendation, together with this metadata's scope and status, unless explicitly overridden |

## Adoption and applicability

Before treating this baseline as binding, record the adopting authority, policy version, effective date, affected organizations/environments, named owners, evidence-retention schedule and transition deadlines. Publish approved departures from this draft. Until then, use it to structure design reviews and identify gaps; do not claim organizational approval.

Apply the baseline to enterprise-operated agents and their models, tools, MCP servers, skills, gateways, data stores and external suppliers. Development and experimentation remain inventoried, data-classified and cost-controlled; production and high-risk use require stronger gates. Supplier hosting does not transfer enterprise accountability. The [High-Risk Agent Guardrail Baseline](../baselines/README.md#high-risk-agent-guardrail-baseline) applies when impact assessment identifies consequential actions, sensitive/regulated data, broad access or elevated harm potential.

## Policy requirements

| Proposed requirement | Accountable policy owner | Decision and indispensable evidence | Control |
|---|---|---|---|
| Register every workload and dependency; assign a business owner, technical owner and lifecycle state before access is provisioned | Service Owner | Approved inventory entry and complete dependency graph; retire or quarantine unowned deployments | [GOV-01](../controls/README.md#gov-01) |
| Approve isolation, network access, processing geography and storage geography independently; do not infer residency from resource location or project membership | Cloud Platform Owner / Data Owner | Architecture decision, flow map, actual deployment type/regions and tested access boundaries | [GOV-02](../controls/README.md#gov-02) |
| Grant minimal scoped identity permissions, separate human and workload identities, and enforce authorization on the server for each operation | IAM Owner | Role/scope approval, authenticated principal mapping, credential lifecycle and negative access tests | [GOV-03](../controls/README.md#gov-03) |
| Use only approved data classes and purposes; minimize/redact logs and set explicit retention, deletion and legal-hold rules across all processing destinations | Data Owner / Privacy Officer | Data handling assessment, provider terms decision, redaction and deletion evidence | [GOV-04](../controls/README.md#gov-04) |
| Permit only approved, versioned models, tools, MCP endpoints and skills; approve schema, permission and fallback changes before use | AI Platform Owner | Dependency registration, trusted provenance/digests, allowlist and drift review | [GOV-05](../controls/README.md#gov-05) |
| Constrain autonomy and consequential actions with server-side checks, tested guardrails and transaction-bound human approval where required | Business Process Owner / Application Security | Threat model, action/approval matrix and adversarial authorization tests; prompts and model safety filters alone cannot enforce access | [GOV-06](../controls/README.md#gov-06) |
| Evaluate every behavior-affecting change against approved safety and quality thresholds before release | Evaluation Lead | Versioned representative dataset, baseline comparison, failures and independent release gate decision | [GOV-07](../controls/README.md#gov-07) |
| Instrument the complete service path, protect telemetry and establish on-call, SOC routing and measurable SLOs | Service Operations Owner | Redacted correlated traces, dashboards, SLO thresholds and successful alert-delivery exercise | [GOV-08](../controls/README.md#gov-08) |
| Attribute all material costs; approve budgets and implement request, token, retry, loop and concurrency limits with safe failure behavior | FinOps Owner | Cost-center approval, limit tests and forecast; budget alerts alone are not hard spending limits | [GOV-09](../controls/README.md#gov-09) |
| Deploy reviewed immutable artifacts through controlled promotion, preserve provenance and demonstrate rollback | Release Engineering Owner | Manifest, source/artifact identifiers, independent approval, deployment log and rollback test | [GOV-10](../controls/README.md#gov-10) |
| Maintain and exercise incident containment, kill-switch, restart and retirement procedures | Service Operations Owner | On-call acceptance, containment exercise, credential/queue/data retirement evidence | [GOV-11](../controls/README.md#gov-11) |
| Map obligations to evidence, independently approve limited exceptions, and reassess changes and expired approvals | AI Governance Lead / Compliance | Obligation matrix, review calendar, independent approval and expiry register | [GOV-12](../controls/README.md#gov-12) |

## Policy and workload lifecycle

1. **Draft → consultation:** policy owner identifies affected stakeholders, risks, implementation feasibility, official capability evidence and operational costs. Security, privacy, IAM, platform, operations, FinOps and business owners review.
2. **Consultation → ratified:** independent adopting authority signs the version, mandatory scope, effective date and transition plan. The author cannot be the sole approver.
3. **Registered → assessed:** the Service Owner submits [registration](../../templates/agent-registration.md), dependencies, risk classification and evidence. Architecture and security reviewers record control applicability, including justified `n/a` decisions.
4. **Assessed → approved for deployment:** release, data, security and business authorities verify version-bound evidence and valid exceptions. Approval for a nonproduction experiment does not authorize production.
5. **Deployed → operating:** operations accepts ownership, alerts, budget controls, incident response and review dates. Reconcile actual deployment state against approved inventory.
6. **Change → reassess:** model/provider, deployment type/region, prompt behavior, tool/MCP schema, skill version, permissions, data purpose, logging/retention, autonomy or material routing changes trigger relevant re-review and evaluation. Emergency containment may proceed under incident authority, with a logged change and retrospective review within an organization-ratified deadline.
7. **Operating → retired:** revoke routes/identities and delegated access, stop queued/scheduled actions, address records and legal holds, verify disposal and stop avoidable charges. Preserve the required approval/incident evidence under the approved schedule.
8. **Policy review → superseded:** review at least annually and after material regulatory, product or incident changes; publish version history, replacement policy and treatment of outstanding exceptions.

## Exceptions

Use the [exception request](../../templates/exception-request.md). An exception is not approval to violate law, binding contracts, mandatory residency restrictions or another authority's non-waivable requirement. The relevant Legal/Compliance authority decides eligibility; no workload owner can waive those obligations.

| Stage | Required action / accountable role | Evidence and outcome |
|---|---|---|
| Request | Requester describes exact controls, workload IDs, artifact/version, environments, data classes, region, affected transactions and time window | Rationale, failed/missing evidence, alternative options and quantified residual risk; no blanket “all agents” waiver |
| Assess | Control Owner and Security/Privacy/Compliance as applicable validate eligibility and compensating controls | Testable compensating measures, monitoring owner, remediation milestones, rollback/containment trigger and proof they work |
| Approve | Business risk owner independent of requester/change author and designated control/risk authority approve; add Data/Privacy/Legal approval where affected | Named identities, roles, timestamps, decision and fixed expiry; requester cannot self-approve |
| Activate | Release Owner binds approval to the declared scope and releases only within validity period | Exception ID in inventory/release manifest; active monitoring and evidence URI; undocumented requests remain holds |
| Monitor | Exception Owner tracks compensating controls and remediation, at least monthly and more often for high risk | Review results and due dates; failure of compensation triggers containment or rollback, not silent continuation |
| Expire / renew | At expiry, stop new releases relying on the exception and execute the preapproved containment/rollback plan for running workloads; any renewal is a fresh independent risk decision | No auto-renewal; new evidence, explicit new expiry and approvals required before continuation |
| Close | Control Owner verifies remediation and removes temporary measures safely | Retest, independent closure approval and historical evidence retained per schedule |

## Review outcomes

- **Pass:** applicable control is demonstrated for the exact release scope.
- **Hold:** approval, applicability or evidence is missing/uncertain; **do not release** until resolved.
- **Block:** a required control fails or a non-waivable constraint is violated; remediate, or use an eligible independently approved exception. Never label a failed test “pass” because of an exception.
- **N/A:** a reviewer documents why the control does not apply and approves the rationale; cost or inconvenience is not non-applicability.

Final go-live approval is a separate business/release decision, not an automatic consequence of completed checkboxes. See the [control catalog](../controls/README.md), [standards](../standards/README.md), [baselines](../baselines/README.md) and [go-live checklist](../../checklists/go-live.md).

## Sources and capability checks

[Microsoft Foundry source register](../../references/microsoft-foundry.md) and [Azure source register](../../references/azure.md). Use feature-specific official documentation to verify experience, deployment type, model/version, region, quota and feature status at implementation time. Proposed policy decisions, review cadences and risk thresholds in this document are enterprise choices, not Microsoft product requirements.
